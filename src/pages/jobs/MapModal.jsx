import {
  DirectionsRenderer,
  GoogleMap,
  InfoBox,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useRef, useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 28.7041, lng: 77.1025 };

const MapModal = ({ sourceCoords, destinationCoords, touch }) => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(4);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
  });

  useEffect(() => {
    if (isLoaded && sourceCoords && destinationCoords) {
      const directionsService = new google.maps.DirectionsService();

      // Convert latitude and longitude to numbers
      const origin = {
        lat: parseFloat(sourceCoords.lat),
        lng: parseFloat(sourceCoords.long),
      };
      const destination = {
        lat: parseFloat(destinationCoords.lat),
        lng: parseFloat(destinationCoords.long),
      };
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: touch,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status} ${result}`);
          }
        }
      );
    }
  }, [isLoaded, sourceCoords, destinationCoords]);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  // console.log("directions : ", directions);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "400px", height: "420px" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        options={{
          zoomControl: false,
          mapTypeControl: true,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          rotateControl: false,
        }}
      >
        {directions && (
          <>
            {directions.request.origin && (
              <Marker
                position={directions.request.origin.location}
                icon={{
                  url: "images/location.png",
                  scaledSize: new google.maps.Size(35, 35),
                }}
              >
                <InfoBox
                  position={directions.request.origin.location}
                  options={{
                    closeBoxURL: "",
                    enableEventPropagation: true,
                    pixelOffset: new google.maps.Size(-17, -60), // Move upwards
                  }}
                >
                  <div
                    style={{
                      background: "#6e6e6e",
                      border: "1px solid #6e6e6e",
                      padding: "5px",
                      borderRadius: "5px",
                      boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                      color: "#6e6e6e", // Make text visible
                    }}
                  >
                    <p className="text-white">start</p>
                  </div>
                </InfoBox>
              </Marker>
            )}

            {directions.request.waypoints.map((wp, index) => (
              <Marker
                key={index}
                position={wp.location.location}
                icon={{
                  url: "images/touch2.png",
                  scaledSize: new google.maps.Size(30, 30),
                }}
              />
            ))}

            {directions.request.destination && (
              <Marker
                position={directions.request.destination.location}
                icon={{
                  url: "images/touch2.png",
                  scaledSize: new google.maps.Size(40, 40),
                }}
              >
                <InfoBox
                  position={directions.request.destination.location}
                  options={{
                    closeBoxURL: "",
                    enableEventPropagation: true,
                    pixelOffset: new google.maps.Size(-17, -60), // Move upwards
                  }}
                >
                  <div
                    style={{
                      background: "#6e6e6e",
                      border: "1px solid #6e6e6e",
                      padding: "5px",
                      borderRadius: "5px",
                      boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                      color: "#6e6e6e", // Make text visible
                    }}
                  >
                    <p className="text-white">End</p>
                  </div>
                </InfoBox>
                </Marker>
            )}
            <DirectionsRenderer
              options={{
                suppressMarkers: true,
                preserveViewport: true,
                polylineOptions: {
                  strokeColor: "#079ef5",
                  strokeOpacity: 3,
                  strokeWeight: 3,
                },
              }}
              directions={directions}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapModal;
