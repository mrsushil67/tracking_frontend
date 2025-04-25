import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { FaPlay, FaPause, FaBackspace, FaBackward } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useGlobleContext } from "../../globle/context";
import moment from "moment";
import config from "../../config/services";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

function Streaming({ vehicleDetails, range }) {
  const { setShowVedio, setPathLoading } = useGlobleContext();
  const ref = useRef();
  const isInitialRender = useRef(true);
  const isDragging = useRef(false);
  const location = useLocation();
  const [center, setCenter] = useState({ lat: 22.015137, lng: 77.97953 });
  const [zoom, setZoom] = useState(8);
  const [path, setPath] = useState([]);
  const [totalPath, setTotalPath] = useState(0);
  const [eventSource, setEventSource] = useState(null);
  const [chunkSize, setChunkSize] = useState(6);
  const [intervalTime, setIntervalTime] = useState(100);
  const [pauseStream, setPauseStream] = useState(false);
  const [vehicle, setVehicle] = useState({ vehicleDetails });
  const progressBarRef = useRef(null);
  const [fullPath, setFullPath] = useState([]);
  const [progress, setProgress] = useState(0); // percentage
  const [resumeIndex, setResumeIndex] = useState(0);
  const [lastTime, setLastTime] = useState(null);
  const [pauseOnLastIndex, setPauseOnLastIndex] = useState({});
  const [filterStops, setFilterStops] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear() +
      "   " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
    libraries: libraries,
  });

  const updatedCoordinates = [...path];
  const intervalIdRef = useRef(null);
  let lastKnownAngle = null;

  const defaultCenter =
    totalPath > 0
      ? updatedCoordinates[updatedCoordinates.length - 1]
      : { lat: 22.4738, lng: 77.64372, time: currentDateTime };

  const icon1 = isLoaded
    ? zoom < 8
      ? {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(30, 35),
          anchor: new window.google.maps.Point(20, 20),
          scale: 1.5,
        }
      : zoom >= 8 && zoom < 10
      ? {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(35, 39),
          anchor: new window.google.maps.Point(20, 20),
          scale: 1.5,
        }
      : zoom >= 10 && zoom < 12
      ? {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(40, 44),
          anchor: new window.google.maps.Point(23, 23),
          scale: 1.5,
        }
      : zoom >= 12 && zoom < 14
      ? {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(45, 49),
          anchor: new window.google.maps.Point(25, 25),
          scale: 1.5,
        }
      : zoom >= 14 && zoom < 16
      ? {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(50, 53),
          anchor: new window.google.maps.Point(28, 28),
          scale: 1.5,
        }
      : zoom >= 16
      ? {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(55, 56),
          anchor: new window.google.maps.Point(30, 30),
          scale: 1.5,
        }
      : {
          url: "images/truck1.png",
          scaledSize: new window.google.maps.Size(60, 60),
          anchor: new window.google.maps.Point(30, 30),
          scale: 1.5,
        }
    : null;

  // for vehicle rotation
  const rotateIconBasedOnPath = (vehicleLocation) => {
    if (vehicleLocation.length > 1 && window.google) {
      let point1 = vehicleLocation[vehicleLocation.length - 2];
      let point2 = vehicleLocation[vehicleLocation.length - 1];

      for (let i = vehicleLocation.length - 3; i >= 0; i--) {
        if (point1.lat !== point2.lat || point1.lng !== point2.lng) break;
        point1 = vehicleLocation[i];
      }

      const point1LatLng = new window.google.maps.LatLng(
        Number(point1.lat),
        Number(point1.lng)
      );
      const point2LatLng = new window.google.maps.LatLng(
        Number(point2.lat),
        Number(point2.lng)
      );

      if (point1.lat !== point2.lat || point1.lng !== point2.lng) {
        const angle = window.google.maps.geometry.spherical.computeHeading(
          point1LatLng,
          point2LatLng
        );
        lastKnownAngle = angle - 90;

        const marker = document.querySelector(`[src="images/truck1.png"]`);
        if (marker && lastKnownAngle !== null) {
          marker.style.transform = `rotate(${lastKnownAngle}deg)`;
        }
      }
    }
  };

  const vehicleLocation = path.slice(-3);
  setTimeout(() => {
    rotateIconBasedOnPath(vehicleLocation);
  }, 500);

  const onSeek = (value) => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setPauseStream(true);
    }

    // Seek the path
    const seekedPath = fullPath.slice(0, Math.floor(value));
    setPath(seekedPath);
  };

  const handleClick = (e) => {
    updateProgress(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      updateProgress(e);
    }
  };

  const updateProgress = (e) => {
    const bar = progressBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();

    const x = e.clientX - rect.left;
    let percent = (x / rect.width) * 100;

    percent = Math.max(0, Math.min(100, percent)); // clamp 0-100
    setProgress(percent);

    if (onSeek) {
      const value = (percent / 100) * totalPath;

      onSeek(value);
    }
  };

  useEffect(() => {
    if (totalPath > 0) {
      const calculatedProgress = Math.min((path.length / totalPath) * 100, 100);
      const speedArray = path.map((item) => item.speed);
      // console.log(
      //   "Cal Process : ",
      //   path.length,
      //   speeds.length,
      //   calculatedProgress,
      //   totalPath
      // );
      setProgress(calculatedProgress);
      setSpeeds(speedArray);
    }
  }, [path, totalPath]);

  useEffect(() => {
    if (path.length > 0) {
      const validStops = [];
      let currentStop = null;
      let count = 0;
      let startTime = null;
      let endTime = null;

      for (let i = 0; i < path.length; i++) {
        const point = path[i];

        if (Number(point.speed) === 0) {
          if (
            currentStop &&
            currentStop.lat === point.lat &&
            currentStop.lng === point.lng
          ) {
            count++;
            endTime = point.time;
          } else {
            if (count >= 60 && currentStop && startTime && endTime) {
              validStops.push({
                ...currentStop,
                duration: getDuration(startTime, endTime),
                StartT: startTime,
                EndT: endTime,
                address: currentStop.address,
              });
            }
            // New stop
            currentStop = {
              lat: point.lat,
              lng: point.lng,
              time: point.time,
              address: point.address,
            };
            count = 1;
            startTime = point.time;
            endTime = point.time;
          }
        } else {
          if (count >= 60 && currentStop && startTime && endTime) {
            validStops.push({
              ...currentStop,
              duration: getDuration(startTime, endTime),
              StartT: startTime,
              EndT: endTime,
              address: currentStop.address,
            });
          }
          currentStop = null;
          count = 0;
          startTime = null;
          endTime = null;
        }
      }

      // Final stop
      if (count >= 60 && currentStop && startTime && endTime) {
        validStops.push({
          ...currentStop,
          duration: getDuration(startTime, endTime),
          StartT: startTime,
          EndT: endTime,
          address: currentStop.address,
        });
      }

      setFilterStops(validStops);
    }
  }, [path]);

  // Helper to calculate duration between two timestamps
  const getDuration = (start, end) => {
    const diff = moment(end).diff(moment(start));
    const dur = moment.duration(diff);
    const days = dur.days();
    const hours = dur.hours();
    const minutes = dur.minutes();
    const seconds = dur.seconds();

    let result = "";
    if(days > 0 ) result += `${days} days `;
    if(hours > 0 ) result += `${hours} hrs `;
    if(minutes > 0 ) result += `${minutes} min `;
    if(seconds > 0 ) result += `${seconds} sec `;


    return result.trim();
  };

  function handleZoomChanged() {
    setZoom(this.getZoom());
  }

  // console.log("vehicleDetails : ",vehicle.vehicleDetails)

  useEffect(() => {
    closeStreamingPage;
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const time24 = moment().subtract(24, "h");
  const startDate = pauseOnLastIndex?.time
    ? new Date(pauseOnLastIndex?.time).toISOString()
    : range !== null
    ? range.startDate.toISOString()
    : new Date(time24).toISOString();
  const endDate =
    range !== null ? range.endDate.toISOString() : new Date().toISOString();

  const startStreaming = () => {
    if (eventSource) {
      eventSource.close();
    }

    setPauseStream(false);

    // setPath([]);
    // setFullPath([]);

    let queryParams = `vehicleNo=${vehicle.vehicleDetails.vehicleNo}`;

    if (chunkSize && intervalTime) {
      queryParams += `&chunkSize=${chunkSize}&interval=${intervalTime}`;
    }

    if (startDate && endDate) {
      queryParams += `&startDate=${startDate}&endDate=${endDate}`;
    }

    console.log("Query : ", queryParams);

    const es = new EventSource(`${config.host}/stream-path?${queryParams}`);

    if (totalPath === 0) {
      es.addEventListener("total-path", (e) => {
        const data = JSON.parse(e.data);
        setTotalPath(data.totalData);
      });
    }

    es.addEventListener("vehicle-path", (e) => {
      const data = JSON.parse(e.data);
      setFullPath((prev) => [...prev, ...data]);
      setPath((prev) => [...prev, ...data]);

      // setSpeeds((prev) => [...prev, ...data?.speed])
    });

    es.addEventListener("No-more", () => {
      console.log("No more data to stream.");
      es.close();
      setPauseOnLastIndex({});
    });

    es.onerror = (e) => {
      console.error("SSE Error:", e);
      es.close();
    };

    setEventSource(es);
  };

  const pauseStreaming = () => {
    setPauseStream(true);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setPauseOnLastIndex(path[path.length - 1]);
    }
  };

  const restartStreaming = () => {
    setPauseStream(false);
    startStreaming();
  };

  // console.log("Start : ", pauseStream);
  useEffect(() => {
    startStreaming();
  }, [vehicle]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; // skip running on first render
    }

    setPauseStream(false);
    startStreaming();
  }, [chunkSize, intervalTime]);

  const increasingSpped = (chunk, interval) => {
    setChunkSize(chunk);
    setIntervalTime(interval);
    setPauseStream(true);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setPauseOnLastIndex(path[path.length - 1]);
    }
  };

  const startfromBegnning = () => {
    setChunkSize(6);
    setIntervalTime(100);
    setPauseStream(false);
    setFullPath([]);
    setPath([]);
    startStreaming();
  };

  const closeStreamingPage = () => {
    // setPath([]);
    setShowVedio(false);
    setPathLoading(true);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  useEffect(() => {
    if (updatedCoordinates.length > 0) {
      const lastCoord = updatedCoordinates[updatedCoordinates.length - 1];
      if (lastCoord.time) {
        const formate = new Date(lastCoord.time);
        setLastTime(
          formate.getDate() +
            "/" +
            (formate.getMonth() + 1) +
            "/" +
            formate.getFullYear() +
            "  " +
            formate.getHours() +
            ":" +
            formate.getMinutes() +
            ":" +
            formate.getSeconds()
        );
      }
    }
  }, [updatedCoordinates]);

  if (!isLoaded) return <div>Loading map...</div>;
  return (
    <div style={{ width: "100%", height: "81vh" }}>
      <GoogleMap
        ref={ref}
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={zoom}
        onZoomChanged={handleZoomChanged}
        options={{
          streetViewControl:false
        }}
      >
        {window.google && window.google.maps && (
          <Polyline
            path={updatedCoordinates}
            options={{
              strokeColor: "blue",
              strokeWeight: 3,
              icons: [
                {
                  icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 1.5,
                    strokeColor: "#027699",
                  },
                  offset: "100%",
                  repeat: "40px",
                },
              ],
            }}
          />
        )}

        {updatedCoordinates.length > 0 && (
          <Marker
            position={updatedCoordinates[0]}
            title="Vehicle"
            // label="S"
          />
        )}

        {updatedCoordinates.length > 0 && (
          <Marker
            icon={icon1}
            position={defaultCenter}
            title="Vehicle"
            // label="S"
          />
        )}
        {filterStops.length > 0 &&
          filterStops.map((stop, index) => (
            <Marker
              key={index}
              position={stop}
              // title="Stop"
              // label="stop"
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
                      <!-- Pin shape -->
                      <path d="M20 0C9 0 0 9 0 20c0 11 20 40 20 40s20-29 20-40C40 9 31 0 20 0z" fill="#fc6a2a"/>
                      <!-- White square in the center -->
                      <rect x="13" y="13" width="14" height="14" fill="white" />
                    </svg>
                  `),
                scaledSize: new google.maps.Size(24, 36),
                anchor: new google.maps.Point(12, 36),
              }}
              onClick={() => setSelectedStop(stop)}
            >
              {selectedStop &&
                selectedStop.lat === stop.lat &&
                selectedStop.lng === stop.lng && (
                  <InfoWindow
                    position={selectedStop}
                    options={{
                      closeBoxURL: "",
                      enableEventPropagation: true,
                    }}
                  >
                    <div className="p-1 rounded-2xl w-[300px]">
                      <div className="mb-2">
                        <div className="flex justify-between">
                          <div className="font-bold pb-3">VEHICLE STOPPED</div>
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                          <div className="">
                            <div className="text-xs font-bold text-gray-700 pb-1">
                              from:{" "}
                            </div>
                            <div className="text-xs font-bold text-green-700">
                              {new Date(selectedStop.StartT).toLocaleString()}
                            </div>
                          </div>
                          {/* <div className="">
                          <div className="text-xs font-bold text-gray-700">
                            Fuel :{" "}
                          </div>
                          <div className="text-xs font-bold text-green-700">
                            grfvsrtg
                          </div>
                        </div> */}
                          <div className="">
                            <div className="text-xs font-bold text-gray-700 pb-1">
                              to:{" "}
                            </div>
                            <div className="text-xs font-bold text-green-700">
                              {new Date(selectedStop.EndT).toLocaleString()}
                            </div>
                          </div>

                          <div class="...">
                            <div className="text-xs font-bold text-gray-700 pb-1">
                              Duration:{" "}
                            </div>
                            <div className="text-xs font-bold text-green-700">
                              {selectedStop.duration}
                            </div>
                          </div>
                        </div>
                        {/* <div>Latitude: 6732547823</div>
                                   <div>Longitude: 4356436</div>  */}

                        <div className="pt-2">
                          <span className="text-xs font-bold text-gray-700">
                            Address :{" "}
                          </span>
                          <span className="text-xs text-gray-700">
                            {selectedStop.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
            </Marker>
          ))}
      </GoogleMap>

      <div className="bg-gray-200 rounded-full dark:bg-gray-700 h-2.5 my-2 relative overflow-hidden">
        <div
          ref={progressBarRef}
          className="w-full h-full rounded-full cursor-pointer"
          onClick={handleClick}
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => (isDragging.current = false)}
          onMouseLeave={() => (isDragging.current = false)}
          onMouseMove={handleMouseMove}
        >
          <div className="h-full flex" style={{ width: `${progress}%` }}>
            {speeds.map((speed, index) => (
              <div
                key={index}
                style={{ width: `${progress}%` }}
                className={`h-full ${
                  speed > 0 ? "bg-green-700" : "bg-[#fc6a2a]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 my-1">
        {defaultCenter ? (
          <div className="font-bold text-1xl">
            {totalPath > 0 ? lastTime : defaultCenter.time}
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex justify-center items-center">
          <div className="mx-[1px]">
            <IoClose
              className="text-2xl border p-1 rounded"
              onClick={closeStreamingPage}
            />
          </div>
          <div className="mx-[1px]">
            <FaStop
              className="text-2xl font-bold border p-1 rounded"
              onClick={startfromBegnning}
            />
          </div>
          {pauseStream ? (
            <div className="mx-[1px]">
              <FaPlay
                className="text-2xl border p-1 rounded"
                onClick={restartStreaming}
              />
            </div>
          ) : (
            <div className="mx-[1px]">
              <FaPause
                className="text-2xl border p-1 rounded"
                onClick={pauseStreaming}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end items-center">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(6, 100)}
          >
            1x
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(12, 100)}
          >
            2x
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(30, 100)}
          >
            5x
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(60, 100)}
          >
            10x
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(600, 100)}
          >
            100x
          </button>
        </div>
      </div>
    </div>
  );
}

export default Streaming;
