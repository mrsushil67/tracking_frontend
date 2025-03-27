import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import React, { useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 28.7041, lng: 77.1025 };

const MapModal = () => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(10);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY
  });

  const onLoad = (map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "300px", height: "400px" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad} // Correct way to get the map instance
      />
    </div>
  );
};

export default MapModal;
