import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { useGlobleContext } from "../../globle/context";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

function Streaming({ vehicleDetails, range }) {
  // const {path, setPath, fullPath, setFullPath} = useGlobleContext();
  const ref = useRef();
  const isDragging = useRef(false);
  const location = useLocation();
  const [center, setCenter] = useState({ lat: 22.015137, lng: 77.97953 });
  const [zoom, setZoom] = useState(8);
  const [path, setPath] = useState([]);
  const [totalPath, setTotalPath] = useState(0);
  const [eventSource, setEventSource] = useState(null);
  const [chunkSize, setChunkSize] = useState(20);
  const [intervalTime, setIntervalTime] = useState(100);
  const [pauseStream, setPauseStream] = useState(false);
  const [vehicle, setVehicle] = useState({ vehicleDetails });
  const progressBarRef = useRef(null);
  const [fullPath, setFullPath] = useState([]);
  const [progress, setProgress] = useState(0); // percentage

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
    libraries: libraries,
  });


  console.log("path : ",path)
  console.log("fullpath : ",fullPath)

  const updatedCoordinates = [...path];
  const intervalIdRef = useRef(null);
  let lastKnownAngle = null;

  const defaultCenter =
    totalPath > 0
      ? updatedCoordinates[updatedCoordinates.length - 1]
      : { lat: 22.4738, lng: 77.64372, time: "2025-03-26T07:36:40.307Z" };

  const Progress = (path.length / totalPath) * 100;

  const icon1 = isLoaded
    ? zoom <= 8
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

  const endDate = range != null ? range.endDate : new Date();
  const startDate =
    range != null
      ? range.startDate
      : new Date(endDate.getTime() - (24 * 60 * 60 - 1) * 1000);

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

    // console.log("percent : ",percent)

    percent = Math.max(0, Math.min(100, percent)); // clamp 0-100
    setProgress(percent);

    // You can send the new value back to parent or simulate a seek
    if (onSeek) {
      const value = (percent / 100) * totalPath;

      // console.log("value  :",value)
      onSeek(value);
    }
  };

  useEffect(() => {
    if (totalPath > 0) {
      console.log(path);
      const calculatedProgress = Math.min((path.length / totalPath) * 100, 100);
      setProgress(calculatedProgress);
    }
  }, [path, totalPath]);

  function handleZoomChanged() {
    setZoom(this.getZoom());
  }

  console.log("zoom : ", zoom);

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

  // console.log("vehicleDetails : ",vehicle.vehicleDetails)

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const startStreaming = () => {
    if (eventSource) {
      eventSource.close();
    }

    setPauseStream(false);

    setPath([]);

    let queryParams = `vehicleNo=${vehicle.vehicleDetails.vehicleNo}`;

    if (chunkSize && intervalTime) {
      queryParams += `&chunkSize=${chunkSize}&interval=${intervalTime}`;
    }

    if (startDate && endDate) {
      queryParams += `&startDate=${startDate}&endDate=${endDate}`;
    }

    console.log("Query : ", queryParams);

    const es = new EventSource(
      `http://localhost:7000/stream-path?${queryParams}`
    );

    es.addEventListener("total-path", (e) => {
      const data = JSON.parse(e.data);
      setTotalPath(data.totalData);
    });

    es.addEventListener("vehicle-path", (e) => {
      const data = JSON.parse(e.data);
      setFullPath((prev) => [...prev, ...data]);
      setPath((prev) => [...prev, ...data]);
    });

    es.addEventListener("No-more", () => {
      console.log("No more data to stream.");
      es.close();
    });

    es.onerror = (e) => {
      console.error("SSE Error:", e);
      es.close();
    };

    setEventSource(es);
  };

  const pauseStreaming = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setPauseStream(true);
    }
  };

  const restartStreaming = () => {};

  // console.log("Start : ", pauseStream);
  useEffect(() => {
    startStreaming();
  }, [vehicle]);

  const increasingSpped = (chunk, interval) => {
    setChunkSize(chunk);
    setIntervalTime(interval);
    startStreaming();
  };

  console.log(totalPath);

  if (!isLoaded) return <div>Loading map...</div>;
  return (
    <div style={{ width: "100%", height: "81vh" }}>
      <GoogleMap
        ref={ref}
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={zoom}
        onZoomChanged={handleZoomChanged}
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
            icon={icon1}
            position={defaultCenter}
            title="Vehicle"
            // label="S"
          />
        )}
      </GoogleMap>

      <div className="bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          ref={progressBarRef}
          className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 my-2 cursor-pointer"
          onClick={handleClick}
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => (isDragging.current = false)}
          onMouseLeave={() => (isDragging.current = false)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="bg-[#fc6a2a] h-2.5 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 my-1">
        {defaultCenter && (
          <div className="font-bold text-1xl">
            {defaultCenter.time}
          </div>
        )}
        <div className="flex justify-center items-center">
          <div className="mx-[1px]">
            <FaStop
              className="text-2xl border p-1 rounded"
              onClick={startStreaming}
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
            onClick={() => increasingSpped(30, 90)}
          >
            10px
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(40, 80)}
          >
            20px
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(50, 70)}
          >
            50px
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(70, 30)}
          >
            100px
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
            onClick={() => increasingSpped(2000, 10)}
          >
            200px
          </button>
        </div>
      </div>
    </div>
  );
}

export default Streaming;
