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

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

function Streaming({ vehicleDetails, range }) {
  const ref = useRef();
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
    libraries: libraries,
  });

  const startDate = range != null ? range.startDate : new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = range != null ? range.endDate : new Date();

  const updatedCoordinates = [...path];
  const intervalIdRef = useRef(null);
  let lastKnownAngle = null;

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

  // console.log("Start : ", pauseStream);
  useEffect(() => {
    startStreaming();
  }, [vehicle]);

  const increasingSpped = (chunk, interval) => {
    setChunkSize(chunk);
    setIntervalTime(interval);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  const defaultCenter =
    totalPath > 0
      ? updatedCoordinates[updatedCoordinates.length - 1]
      : { lat: 22.4738, lng: 77.64372, time: "2025-03-26T07:36:40.307Z" };

  const progress = (path.length / totalPath) * 100;

  const icon1 = isLoaded
    ? {
        url: "images/truck1.png",
        scaledSize: new window.google.maps.Size(60, 60),
        anchor: new window.google.maps.Point(30, 30),
        scale: 1.5,
      }
    : null;

  return (
    <div style={{ width: "100%", height: "82vh" }}>
      <GoogleMap
        ref={ref}
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={zoom}
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
            label="S"
          />
        )}
      </GoogleMap>

      <div className="bg-gray-200 rounded-full dark:bg-gray-700">
        <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 my-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: path.length > 0 ? `${progress}%` : "0%" }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 my-1">
        {defaultCenter && (
          <div className="font-bold text-1xl">{defaultCenter.time}</div>
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
              <FaPlay className="text-2xl border p-1 rounded" />
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
            onClick={() => increasingSpped(100, 10)}
          >
            200px
          </button>
        </div>
      </div>
    </div>
  );
}

export default Streaming;
