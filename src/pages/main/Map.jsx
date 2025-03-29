import React, { useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
  InfoWindow,
  Circle,
  InfoBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GrDirections } from "react-icons/gr";
import { Link } from "react-router-dom";
import { Commet } from "react-loading-indicators";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = ({
  icon1,
  vehiclePath,
  vehicleDetails,
  pathloading,
}) => {
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [open, setOpen] = useState(false);
  // const [zoom, setZoom] = useState(6);

  const handleMarkerClick = (event) => {
    setOpen(true);
    setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const updatedCoordinates = [...vehiclePath];

  if (
    vehicleDetails &&
    typeof vehicleDetails.lat === "number" &&
    typeof vehicleDetails.lng === "number"
  ) {
    updatedCoordinates.push({
      lat: vehicleDetails.lat,
      lng: vehicleDetails.lng,
    });
  }

  const center =
    updatedCoordinates.length > 0
      ? updatedCoordinates[updatedCoordinates.length - 1]
      : { lat: 28.7041, lng: 77.1025 };

  const address = vehicleDetails.currentAddress || "";
  const parts = address.split(",");

  const handleRedirect = () => {
    window.open("https://www.google.com/maps/");
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      ref={mapRef}
      center={center}
      zoom={6}
      options={{
        clickableIcons: false,
        fullscreenControl: true,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style:
            typeof google != "undefined"
              ? window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR
              : null,
          position:
            typeof google != "undefined"
              ? window.google.maps.ControlPosition.TOP_RIGHT
              : null,
        },
      }}
    >
      {vehicleDetails.currentAddress && (
        <div className="addressCard-onMap">
          <div className="flex justify-between">
            <div className="p-3">
              <div className="font-bold">{parts[parts.length - 4]}</div>
              <span className="text-gray-700 font-bold text-xs">
                {parts[parts.length - 3]}
              </span>
              <span className="text-gray-700 font-bold text-xs">, </span>
              <span className="text-gray-700 font-bold text-xs">
                {parts[parts.length - 2]}
              </span>
            </div>
            <div className="p-3 items-center cursor-pointer">
              <div className="flex items-center justify-center font-bold">
                <div>
                  <GrDirections
                    onClick={handleRedirect}
                    className="text-blue-400 text-2xl font-bold transition-transform transform hover:scale-110"
                  />
                </div>
              </div>
              <div className="text-blue-400 font-bold text-xs hover:underline">
                Direction
              </div>
            </div>
          </div>
        </div>
      )}
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
          position={updatedCoordinates[updatedCoordinates.length - 1]}
        />
      ) : null}
      {updatedCoordinates.length > 0 ? (
        <Marker
          position={updatedCoordinates[0]}
          title="start"
          label="S"
          onClick={handleMarkerClick}
        />
      ) : null}
    </GoogleMap>
  );
};

export default Map;
