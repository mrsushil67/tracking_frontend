import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import { Commet } from "react-loading-indicators";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

function SplashMap({ markerPosition, icon1 }) {
  const [center, setCenter] = useState({ lat: 22.015137, lng: 77.97953 });
  const [zoom, setZoom] = useState(4);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (markerPosition && markerPosition.length > 0) {
      setMarkers(markerPosition);
    }
  }, [markerPosition]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={zoom}
    >
      <MarkerClusterer>
        {(clusterer) =>
          markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              clusterer={clusterer}
            />
          ))
        }
      </MarkerClusterer>
    </GoogleMap>
  );
}

export default SplashMap;
