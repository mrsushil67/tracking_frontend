import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
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

      const TouchPoints = [
        { location: { lat: 28.2576800811307, lng: 76.826758199115 } },
        { location: { lat: 26.22973668607, lng: 91.6911107343093 } },
        { location: { lat: 26.6639744850806, lng: 88.4751131569461 } },
        { location: { lat: 26.6639744850806, lng: 88.4751131569461 } },
        { location: { lat: 27.2315390388978, lng: 77.8795132204701 } },
        { location: { lat: 28.4777260022206, lng: 76.8074957147551 } },
        { location: { lat: 28.4777260022206, lng: 76.8074957147551 } },
      ];

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: TouchPoints,
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
          <>
            {/* Render custom markers */}
            <Marker
              position={directions.request.origin.location}
              icon={{
                url: "images/location.png",
                scaledSize: new google.maps.Size(45, 45),
              }}
            />

            {directions.request.waypoints.map((wp, index) => (
              <Marker
                key={index}
                position={wp.location}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            ))}

            <Marker
              position={directions.request.destination.location}
              icon={{
                url: "images/placeholder.png",
                scaledSize: new google.maps.Size(45, 45),
              }}
            />

            {/* Render the route */}
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: false }}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapModal;
