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
import { IoCall } from "react-icons/io5";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = ({
  icon1,
  vehiclePath,
  vehicleDetails,
  pathloading,
  vehicleStartTime,
  setShowVedio,
  zoom,
  handleZoomChanged,
}) => {
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [open, setOpen] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [driverDetails, setDriverDetails] = useState(
    vehicleDetails.driverDetails
  );

  const localDateTime = new Date(vehicleDetails.lastUpdateAt).toLocaleString();

  const handleMarkerClick = (event) => {
    setOpen(true);
    setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const updatedCoordinates = [...vehiclePath];

  const processBar =
    (updatedCoordinates.length / updatedCoordinates.length) * 100;

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

  const handleShowInfoWindow = () => {
    setShowInfoWindow(true);
  };

  const showVedioPage = () => {
    setShowVedio(true);
  };

  const isoString = vehicleStartTime.time;
  const date = new Date(isoString);
  let time = "";

  if (!isNaN(date.getTime())) {
    time = date.toISOString().substr(11, 8);
  } else {
    time = "--:--:--";
  }

  const handleRedirect = () => {
    if (updatedCoordinates.length > 0) {
      const startLatLng = updatedCoordinates[0];
      const currentLatLng =
        updatedCoordinates[updatedCoordinates.length - 1];
      const googleMapsUrl = `https://www.google.com/maps/dir/${startLatLng.lat},${startLatLng.lng}/${currentLatLng.lat},${currentLatLng.lng}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  return (
    <>
      {!pathloading ? (
        <div>
          <div style={{ width: "100%", height: "86vh" }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              ref={mapRef}
              center={center}
              zoom={zoom}
              onZoomChanged={handleZoomChanged}
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
                      <span className="text-gray-700 font-bold text-xs">
                        ,{" "}
                      </span>
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
                          path: window.google.maps.SymbolPath
                            .FORWARD_CLOSED_ARROW,
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
                  onClick={handleShowInfoWindow}
                >
                  {showInfoWindow && (
                    <InfoWindow
                      position={
                        updatedCoordinates[updatedCoordinates.length - 1]
                      }
                      options={{
                        closeBoxURL: "",
                        enableEventPropagation: true,
                      }}
                      onCloseClick={() => setShowInfoWindow(false)}
                    >
                      <div className="p-2 rounded-2xl shadow-md bg-white w-[300px]">
                        <div className="mb-2">
                          <div className="flex justify-between pb-1">
                            <div className="font-bold">
                              Vehicle No: {vehicleDetails.vehicleNo}
                            </div>
                            <div className="font-bold">
                              {vehicleDetails.vehicleMake}
                            </div>
                          </div>
                          {vehicleDetails?.driverDetails?.driverName !== "" ? (
                            <div className="flex pb-1">
                              <span className="text-xs font-bold text-gray-600">
                                Driver :{" "}
                              </span>
                              <span className="text-xs font-bold text-gray-600">
                                {vehicleDetails?.driverDetails?.driverName}{" "}
                              </span>
                              <div className="flex">
                                <span>
                                  {" "}
                                  <IoCall />
                                </span>
                                <span> </span>
                                <span className="text-xs font-bold text-gray-600">
                                  {vehicleDetails?.driverDetails?.driverNumber}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 border-2 border-amber-600 bg-amber-600 rounded-full"></span>
                            <span className="text-xs font-bold text-gray-600 pb-1">
                              Last Updated: {localDateTime}
                            </span>
                          </div>
                          <div class="grid grid-cols-4 gap-4 pb-1">
                            <div className="">
                              <div className="text-xs font-bold text-gray-700">
                                Speed:{" "}
                              </div>
                              <div className="text-xs font-bold text-green-700">
                                {vehicleDetails.speed?.toFixed(1)} km/h
                              </div>
                            </div>
                            <div className="">
                              <div className="text-xs font-bold text-gray-700">
                                Fuel :{" "}
                              </div>
                              <div className="text-xs font-bold text-green-700">
                                {vehicleDetails.fuelType}
                              </div>
                            </div>
                            <div className="">
                              <div className="text-xs font-bold text-gray-700">
                                Status:{" "}
                              </div>
                              <div className="text-xs font-bold text-green-700">
                                {vehicleDetails.currentStatus}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-700">
                              Address :{" "}
                            </span>
                            <span className="text-xs text-gray-700">
                              {vehicleDetails?.currentAddress}
                            </span>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
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
          </div>
          <div className="">
            <div className="flex bg-gray-200 rounded dark:bg-gray-700">
              <div className="mx-[1px]">
                <FaPlay
                  className="text-2xl p-1 rounded"
                  onClick={showVedioPage}
                />
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-400 my-2">
                <div
                  className="bg-[#fc6a2a] h-2.5 rounded-full"
                  style={{
                    width: updatedCoordinates ? `${processBar}%` : `16%`,
                  }}
                ></div>
              </div>
              <div className="font-bold text-m mx-4">{time}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 my-1">
              <div className="flex justify-center items-center">
                <div className="mx-[1px]"></div>
                <div className="mx-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid min-h-full place-items-center">
          <div className="text-center">
            <Commet color="#fc7d32" size="medium" text="" textColor="" />
            <h1 className="text-[#fc7d32]">Loading...</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Map;
