import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const getAverageLatLng = (locations) => {
  if (locations.length === 0) return null;
  const avgLat =
    locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
  const avgLng =
    locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
  return { lat: avgLat, lng: avgLng, count: locations.length };
};

function SplashMap({ markerPosition }) {
  const [zoomLevel, setZoomLevel] = useState(5);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
    libraries: ["marker"],
  });
  const defaultCenter = { lat: 26.9124, lng: 75.7873 }; // Center of India
  const mapCenter =
    markerPosition && markerPosition.length > 0
      ? getAverageLatLng(markerPosition)
      : defaultCenter;

  const getDistance = (loc1, loc2) => {
    const latDiff = Math.abs(loc1.lat - loc2.lat);
    const lngDiff = Math.abs(loc1.lng - loc2.lng);
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  };

  const clusterLocations = (locations, threshold) => {
    const clusters = [];
    const visited = new Set();

    locations.forEach((loc, index) => {
      if (visited.has(index)) return;

      const cluster = [loc];
      visited.add(index);

      for (let i = 0; i < locations.length; i++) {
        if (
          i !== index &&
          !visited.has(i) &&
          getDistance(loc, locations[i]) < threshold
        ) {
          cluster.push(locations[i]);
          visited.add(i);
        }
      }

      clusters.push(getAverageLatLng(cluster));
    });

    return clusters;
  };

  const generateClusteredMarkers = useCallback(
    (zoom) => {
      console.log("zoom : ", zoom);
      if (!markerPosition || markerPosition.length === 0) return [];

      if (markerPosition.length < 10) {
        return markerPosition.map((loc) => ({ ...loc, count: 1 }));
      }

      if (zoom >= 12) {
        return markerPosition.map((loc) => ({ ...loc, count: 1 }));
      }

      let clusteredMarkers;

      if (zoom < 4) {
        clusteredMarkers = [
          { ...getAverageLatLng(markerPosition), count: markerPosition.length },
        ];
      } else if (zoom < 5) {
        clusteredMarkers = clusterLocations(markerPosition, 2);
      } else if (zoom < 6) {
        clusteredMarkers = clusterLocations(markerPosition, 1.5);
      } else if (zoom < 7) {
        clusteredMarkers = clusterLocations(markerPosition, 1.2);
      } else if (zoom < 8) {
        clusteredMarkers = clusterLocations(markerPosition, 1.0);
      } else if (zoom < 9) {
        clusteredMarkers = clusterLocations(markerPosition, 0.7);
      } else if (zoom < 10) {
        clusteredMarkers = clusterLocations(markerPosition, 0.5);
      } else if (zoom < 11) {
        clusteredMarkers = clusterLocations(markerPosition, 0.2);
      } else if (zoom < 12) {
        clusteredMarkers = clusterLocations(markerPosition, 0.1);
      } else {
        clusteredMarkers = markerPosition.map((loc) => ({ ...loc, count: 1 }));
      }

      let finalMarkers = [];
      clusteredMarkers.forEach((cluster) => {
        if (cluster.count < 11) {
          const actualMarkers = markerPosition.filter(
            (loc) =>
              getDistance(loc, { lat: cluster.lat, lng: cluster.lng }) < 0.1
          );
          finalMarkers.push(
            ...actualMarkers.map((loc) => ({ ...loc, count: 1 }))
          );
        } else {
          finalMarkers.push(cluster);
        }
      });

      return finalMarkers;
    },
    [markerPosition]
  );

  useEffect(() => {
    setVisibleMarkers(generateClusteredMarkers(zoomLevel));
  }, [zoomLevel]);

  function handleZoomChange() {
    setZoomLevel(this.getZoom());
  }

  const getCustomIcon = (count) => {
    const canvas = document.createElement("canvas");
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(15, 15, 13, 0, 2 * Math.PI);
    ctx.fillStyle = count > 1 ? "#a8a8f0" : "#f0a8e0";
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(count.toString(), 15, 15);

    return canvas.toDataURL();
  };

  if (!isLoaded)
    return (
      <div className="grid min-h-full place-items-center">
        <div className="text-center">
          <Commet color="#fc7d32" size="medium" text="" textColor="" />
          <h1 className="text-[#fc7d32]">Loading...</h1>
        </div>
      </div>
    );
  return (
    <GoogleMap
      center={mapCenter}
      zoom={zoomLevel}
      mapContainerStyle={containerStyle}
      onZoomChanged={handleZoomChange}
    >
      {/* {visibleMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{ url: getCustomIcon(marker.count) }}
          />
        ))} */}
      {markerPosition.map((pos) => (
        <Marker key={pos.vehicleid} position={{ lat: pos.lat, lng: pos.lng }} />
      ))}
    </GoogleMap>
  );
}

export default SplashMap;
