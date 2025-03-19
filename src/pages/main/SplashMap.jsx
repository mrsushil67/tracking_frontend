import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// List of location coordinates
const locations = [
  { lat: 28.6139, lng: 77.209 }, // Delhi
  { lat: 19.076, lng: 72.8777 }, // Mumbai
  { lat: 13.0827, lng: 80.2707 }, // Chennai
  { lat: 22.5726, lng: 88.3639 }, // Kolkata
  { lat: 12.9716, lng: 77.5946 }, // Bangalore
  { lat: 17.385, lng: 78.4867 }, // Hyderabad
  { lat: 26.9124, lng: 75.7873 }, // Jaipur
  { lat: 21.1702, lng: 72.8311 }, // Surat
  { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
  { lat: 15.2993, lng: 74.124 }, // Goa
  { lat: 25.3176, lng: 82.9739 }, // Varanasi
  { lat: 30.7333, lng: 76.7794 }, // Chandigarh
  { lat: 31.634, lng: 74.8723 }, // Amritsar
  { lat: 11.0168, lng: 76.9558 }, // Coimbatore
  { lat: 9.9312, lng: 76.2673 }, // Kochi
  { lat: 18.5204, lng: 73.8567 }, // Pune
  { lat: 34.0837, lng: 74.7973 }, // Srinagar
  { lat: 22.7196, lng: 75.8577 }, // Indore
  { lat: 24.5854, lng: 73.7125 }, // Udaipur
  { lat: 28.8505, lng: 76.2711 }, // Haryana
];

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

  const generateClusteredMarkers = useCallback((zoom) => {
    if (!markerPosition || markerPosition.length === 0) return [];

    if (zoom < 4) {
      return [
        { ...getAverageLatLng(markerPosition), count: markerPosition.length },
      ];
    } else if (zoom < 5) {
      return clusterLocations(markerPosition, 20);
    } else if (zoom < 6) {
      return clusterLocations(markerPosition, 11);
    } else if (zoom < 7) {
      return clusterLocations(markerPosition, 8);
    } else if (zoom < 8) {
      return clusterLocations(markerPosition, 5);
    } else if (zoom < 9) {
      return clusterLocations(markerPosition, 4);
    } else if (zoom < 10) {
      return clusterLocations(markerPosition, 3);
    } else if (zoom < 11) {
      return clusterLocations(markerPosition, 2);
    } else if (zoom < 12) {
      return clusterLocations(markerPosition, 1);
    } else {
      return locations.map((loc) => ({ ...loc, count: 1 }));
    }
  }, []);

  useEffect(() => {
    setVisibleMarkers(generateClusteredMarkers(zoomLevel));
  }, [zoomLevel, generateClusteredMarkers]);

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
