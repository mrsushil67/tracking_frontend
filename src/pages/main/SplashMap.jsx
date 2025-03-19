import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Function to calculate the average latitude and longitude of a group
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
  const defaultCenter = { lat: 22.9734, lng: 78.6569 }; // Center of India
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
      if (!markerPosition || markerPosition.length === 0) return [];
  
      // If there are less than 10 markers, show them as individual markers
      if (markerPosition.length < 10) {
        return markerPosition.map((loc) => ({ ...loc, count: 1 }));
      }
  
      if (zoom < 4) {
        return [{ ...getAverageLatLng(markerPosition), count: markerPosition.length }];
      } else if (zoom < 5) {
        return clusterLocations(markerPosition, 3);
      } else if (zoom < 6) {
        return clusterLocations(markerPosition, 2.5);
      } else if (zoom < 7) {
        return clusterLocations(markerPosition, 2);
      } else if (zoom < 8) {
        return clusterLocations(markerPosition, 1.7);
      } else if (zoom < 9) {
        return clusterLocations(markerPosition, 1.4);
      } else if (zoom < 10) {
        return clusterLocations(markerPosition, 1.2);
      } else if (zoom < 11) {
        return clusterLocations(markerPosition, 1);
      } else if (zoom < 12) {
        return clusterLocations(markerPosition, 0.9);
      } else if (zoom < 13) {
        return clusterLocations(markerPosition, 0.8);
      } else if (zoom < 14) {
        return clusterLocations(markerPosition, 0.7);
      } else if (zoom < 15) {
        return clusterLocations(markerPosition, 0.6);
      } else if (zoom < 16) {
        return clusterLocations(markerPosition, 0.5);
      } else if (zoom < 17) {
        return clusterLocations(markerPosition, 0.32);
      } else if (zoom < 18) {
        return clusterLocations(markerPosition, 0.16);
      } else if (zoom < 19) {
        return clusterLocations(markerPosition, 0.08);
      } else if (zoom < 20) {
        return clusterLocations(markerPosition, 0.04);
      } else if (zoom < 21) {
        return clusterLocations(markerPosition, 0.02);
      } else {
        return clusterLocations(markerPosition, 0.01);
      }
    },
    [markerPosition]
  );
  


  useEffect(() => {
    console.log("Updated markerPosition:", markerPosition);
    setVisibleMarkers(generateClusteredMarkers(zoomLevel));
  }, [zoomLevel, markerPosition, generateClusteredMarkers]);

  function handleZoomChange() {
    setZoomLevel(this.getZoom());
  }

  // Function to create a custom icon with count
  const getCustomIcon = (count) => {
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");

    // Draw circle
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, 2 * Math.PI);
    ctx.fillStyle = count > 1 ? "#a8a8f0" : "#f0a8e0";
    ctx.fill();
    ctx.stroke();

    // Draw count number
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(count.toString(), 20, 20);

    return canvas.toDataURL();
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_REACT_APP_MAP_KEY}>
      <GoogleMap
        center={mapCenter}
        zoom={zoomLevel}
        mapContainerStyle={containerStyle}
        onZoomChanged={handleZoomChange}
      >
        {visibleMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{ url: getCustomIcon(marker.count) }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default SplashMap;
