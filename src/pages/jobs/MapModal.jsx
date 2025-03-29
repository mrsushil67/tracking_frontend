import { DirectionsRenderer, GoogleMap, useLoadScript } from "@react-google-maps/api";
import React, { useRef, useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 28.7041, lng: 77.1025 };

const MapModal = ({ sourceCoords, destinationCoords }) => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(4);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
  });

  console.log("LatLong: ", sourceCoords, destinationCoords);

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
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeOpacity: 0.6,
                strokeWeight: 5,
                strokeColor: "#033dfc",
              },
              preserveViewport: true,
              suppressMarkers: false,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapModal;
