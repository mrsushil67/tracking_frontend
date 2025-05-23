// import {
//   DirectionsRenderer,
//   GoogleMap,
//   InfoBox,
//   Marker,
//   useLoadScript,
// } from "@react-google-maps/api";
// import React, { useRef, useState, useEffect } from "react";

// const containerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const center = { lat: 28.7041, lng: 77.1025 };

// const MapModal = ({ sourceCoords, destinationCoords, touch, jobPath }) => {
//   const mapRef = useRef(null);
//   const [zoom, setZoom] = useState(4);
//   const [directions, setDirections] = useState(null);

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
//   });

//   useEffect(() => {
//     if (isLoaded && sourceCoords && destinationCoords) {
//       const directionsService = new google.maps.DirectionsService();

//       // Convert latitude and longitude to numbers
//       const origin = {
//         lat: parseFloat(sourceCoords.lat),
//         lng: parseFloat(sourceCoords.long),
//       };
//       const destination = {
//         lat: parseFloat(destinationCoords.lat),
//         lng: parseFloat(destinationCoords.long),
//       };
//       directionsService.route(
//         {
//           origin: origin,
//           destination: destination,
//           waypoints: touch,
//           travelMode: google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === google.maps.DirectionsStatus.OK) {
//             setDirections(result);
//           } else {
//             console.error(`Error fetching directions: ${status} ${result}`);
//           }
//         }
//       );
//     }
//   }, [isLoaded, sourceCoords, destinationCoords]);

//   const onLoad = (map) => {
//     mapRef.current = map;
//   };

//   // console.log("directions : ", directions);

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div style={{ width: "400px", height: "420px" }}>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={zoom}
//         onLoad={onLoad}
//         options={{
//           zoomControl: false,
//           mapTypeControl: true,
//           scaleControl: false,
//           streetViewControl: false,
//           overviewMapControl: false,
//           rotateControl: false,
//         }}
//       >
//         {directions && (
//           <>
//             {directions.request.origin && (
//               <Marker
//                 position={directions.request.origin.location}
//                 icon={{
//                   url: "images/location.png",
//                   scaledSize: new google.maps.Size(35, 35),
//                 }}
//               >
//                 <InfoBox
//                   position={directions.request.origin.location}
//                   options={{
//                     closeBoxURL: "",
//                     enableEventPropagation: true,
//                     pixelOffset: new google.maps.Size(-17, -60), // Move upwards
//                   }}
//                 >
//                   <div
//                     style={{
//                       background: "#6e6e6e",
//                       border: "1px solid #6e6e6e",
//                       padding: "5px",
//                       borderRadius: "5px",
//                       boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
//                       color: "#6e6e6e", // Make text visible
//                     }}
//                   >
//                     <p className="text-white">start</p>
//                   </div>
//                 </InfoBox>
//               </Marker>
//             )}

//             {directions.request.waypoints.map((wp, index) => (
//               <Marker
//                 key={index}
//                 position={wp.location.location}
//                 icon={{
//                   url: "images/touch2.png",
//                   scaledSize: new google.maps.Size(30, 30),
//                 }}
//               />
//             ))}

//             {directions.request.destination && (
//               <Marker
//                 position={directions.request.destination.location}
//                 icon={{
//                   url: "images/touch2.png",
//                   scaledSize: new google.maps.Size(40, 40),
//                 }}
//               >
//                 <InfoBox
//                   position={directions.request.destination.location}
//                   options={{
//                     closeBoxURL: "",
//                     enableEventPropagation: true,
//                     pixelOffset: new google.maps.Size(-17, -60), // Move upwards
//                   }}
//                 >
//                   <div
//                     style={{
//                       background: "#6e6e6e",
//                       border: "1px solid #6e6e6e",
//                       padding: "5px",
//                       borderRadius: "5px",
//                       boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
//                       color: "#6e6e6e", // Make text visible
//                     }}
//                   >
//                     <p className="text-white">End</p>
//                   </div>
//                 </InfoBox>
//                 </Marker>
//             )}
//             <DirectionsRenderer
//               options={{
//                 suppressMarkers: true,
//                 preserveViewport: true,
//                 polylineOptions: {
//                   strokeColor: "#079ef5",
//                   strokeOpacity: 3,
//                   strokeWeight: 3,
//                 },
//               }}
//               directions={directions}
//             />
//           </>
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MapModal;

import {
  DirectionsRenderer,
  GoogleMap,
  InfoBox,
  InfoWindow,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useRef, useState, useEffect } from "react";
import { Commet } from "react-loading-indicators";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 28.7041, lng: 77.1025 };

const MapModal = ({ jobPath, jobStops, loading, matchedTouchPoints,activeMarker, setActiveMarker }) => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(4);
  // const [] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
  });

  // Convert jobPath to an array of lat/lng objects
  const pathCoordinates = jobPath.map((point) => ({
    lat: parseFloat(point.latitude),
    lng: parseFloat(point.longitude),
  }));

  const stopsCoordinates = jobStops.map((point) => ({
    lat: parseFloat(point.location.lat),
    lng: parseFloat(point.location.long),
    startTime: point.startTime,
    endTime: point.endTime,
    address: point.address,
    hour: point.duration.hours,
    minutes: point.duration.minutes,
    seconds: point.duration.seconds,
  }));

  const handleShowInfoWindow = (index) => {
    setActiveMarker(index);
  };
  console.log("matchedTouch : ",matchedTouchPoints)

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      {!loading ? (
        <div style={{ width: "400px", height: "420px" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={{
              zoomControl: false,
              mapTypeControl: true,
              scaleControl: false,
              streetViewControl: false,
              overviewMapControl: false,
              rotateControl: false,
            }}
          >
            <Polyline
              path={pathCoordinates}
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
            {pathCoordinates.length > 0 && (
              <Marker position={pathCoordinates[0]} title="start" label="S" />
            )}
            {pathCoordinates.length > 0 && (
              <Marker
                position={pathCoordinates[pathCoordinates.length - 1]}
                title="destination"
                label="D"
              />
            )}
            {stopsCoordinates.map((stop, index) => (
              <Marker
                key={index}
                position={stop}
                title={`Stop ${index + 1}`}
                label={`${index + 1}`}
                onClick={() => handleShowInfoWindow(index)}
              >
                {activeMarker === index && (
                  <InfoWindow
                    position={stop}
                    options={{
                      closeBoxURL: "",
                      enableEventPropagation: true,
                    }}
                    // onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div className="p-2 rounded-2xl shadow-md bg-white w-[250px]">
                      <div className="mb-2">
                        <div className="flex justify-between pb-1">
                          <div className="font-bold text-red-500">
                            Vehicle Stopped
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-700">
                            Address :{" "}
                          </span>
                          <span className="text-xs text-gray-700">
                            {stop.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 border-2 border-amber-600 bg-amber-600 rounded-full"></span>
                          <span className="text-xs font-bold text-gray-600 pb-1">
                            Start Time :{" "}
                            {new Date(stop.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 border-2 border-amber-600 bg-amber-600 rounded-full"></span>
                          <span className="text-xs font-bold text-gray-600 pb-1">
                            End Time : {new Date(stop.endTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 border-2 border-amber-600 bg-amber-600 rounded-full"></span>
                          <span className="text-xs font-bold text-gray-600 pb-1">
                            Duration :{" "}
                            {`${stop.hour}h ${stop.minutes}m ${stop.seconds}s`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
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

export default MapModal;
