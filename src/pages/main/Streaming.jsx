import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import { Commet } from "react-loading-indicators";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];
let socket;

function Streaming() {
  const ref = useRef();
  const location = useLocation();
  // console.log(location.pathname);
  const [center, setCenter] = useState({ lat: 22.015137, lng: 77.97953 });
  const [zoom, setZoom] = useState(8);
  const [markers, setMarkers] = useState([]);
  const [totalPath, setTotalPath] = useState(0);
  const [path, setPath] = useState([]);
  const [connected, setConnected] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
  });

  const updatedCoordinates = [...path];

  const icon1 = isLoaded
    ? {
        url: "images/truck1.png",
        scaledSize: new window.google.maps.Size(60, 60),
        anchor: new window.google.maps.Point(30, 30),
        scale: 1.5,
      }
    : null;

  const intervalIdRef = useRef(null);
  let lastKnownAngle = null;

  const rotateIconBasedOnPath = (vehicleLocation) => {
    if (vehicleLocation.length > 1) {
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
      if (point1.lat === point2.lat && point1.lng === point2.lng) {
      } else {
        const angle = window.google.maps.geometry.spherical.computeHeading(
          point1LatLng,
          point2LatLng
        );

        lastKnownAngle = angle - 90;
      }

      // console.log("Updated actualAngle:", lastKnownAngle);

      const marker = document.querySelector(`[src="${icon1.url}"]`);
      if (marker && lastKnownAngle !== null) {
        marker.style.transform = `rotate(${lastKnownAngle}deg)`;
      }
    }
  };

  const vehicleLocation = path.slice(-3);
  setTimeout(() => {
    rotateIconBasedOnPath(vehicleLocation);
  }, 500);

  useEffect(() => {
    // Connect to socket
    socket = io("http://localhost:7000");

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setConnected(true);
    });

    socket.on("total-path", (total) => {
      setTotalPath(total);
    });

    socket.on("vehicle-path", (data) => {
      console.log(data.length);
      setPath((prev) => [...prev, ...data]); // append data
    });

    socket.on("No-more", (str) => {
      console.log(str);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
      setConnected(false);
    });

    socket.emit("update-stream-settings", {
      chunkSize: 50,
      interval: 100,
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startStreaming = () => {
    if (socket && connected) {
      setPath([]);
      socket.emit("start-stream", "NL01AE5625");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  const defaultCenter =
    totalPath > 0
      ? updatedCoordinates[updatedCoordinates.length - 1]
      : { lat: 22.4738, lng: 77.64372, time: "2025-03-26T07:36:40.307Z" };

  const total = 50000;

  const increasing = (path.length / totalPath) * 100;

  // console.log("Increasing : ", increasing);
  // console.log("totalPath : ", totalPath);
  console.log("totalPath : ", defaultCenter);

  return (
    <div style={{ width: "70%", height: "500px" }}>
      <div style={{ width: "100%", height: "400px" }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={zoom}
        >
          {window.google && window.google.maps ? (
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
          ) : null}

          {updatedCoordinates.length > 0 ? (
            <Marker
              icon={icon1}
              position={defaultCenter}
              title="start"
              label="S"
              // onClick={handleMarkerClick}
            />
          ) : null}
        </GoogleMap>
      </div>
      {/* <div ref={ref}>
        <h1>Vehicle Streaming</h1>
        <button onClick={startStreaming}>Start Streaming</button>
        <p>Received Points: {path.length}</p>
      </div> */}
      <div className="bg-gray-200 rounded-full dark:bg-gray-700">
        <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 my-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: path.length > 0 ? `${increasing}%` : "0%" }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 my-1">
        {defaultCenter && (
          <div className="font-bold text-1xl">{defaultCenter.time}</div>
        )}
        <div className="flex justify-center items-center">
          <div className="mx-[1px]">
            <FaPlay className="text-3xl border p-1 rounded" onClick={startStreaming}/>
          </div>
          <div className="mx-[1px]">
            <FaPause className="text-3xl border p-1 rounded" />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            id="speedDecrease"
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
          >
            10px
          </button>
          <button
            id="speedDecrease"
            className="bg-gray-300 hover:bg-gray-400 text-xs text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
          >
            20px
          </button>
          {/* <button
            id="speedDecrease"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
          >
            50px
          </button>
          <button
            id="speedDecrease"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
          >
            100px
          </button> */}
          {/* <button
            id="speedDecrease"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 m-[1px] rounded"
          >
            200px
          </button> */}
        </div>
      </div>
      {/* <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div
          id="progressBar"
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: "0%" }}
        ></div>
      </div> */}
    </div>
  );
}

export default Streaming;
