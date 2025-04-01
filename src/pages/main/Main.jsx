import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import VehicleList from "./VehicleList";
import Map from "./Map";
import VehicleDetails from "./VehicleDetails";
import { format } from "date-fns";
import arrow from "./arrow.png";
import config from "../../config/services";
import SplashMap from "./SplashMap";
import { useJsApiLoader } from "@react-google-maps/api";
import { Commet } from "react-loading-indicators";
import { useOutletContext } from "react-router-dom";

const googleMapsLibraries = ["places", "geometry", "marker"];

function Main() {
  const [vehicleno,setTotalVehicles, setFilterdCounts ] = useOutletContext();
  const [vehiclelist, setVehiclelist] = useState([]);
  const [vehiclePath, setVehiclePath] = useState([]);
  const [filteredPath, setFilteredPath] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [vehicleCurrentloc, setVehicleCurrentloc] = useState({});
  const [selectedVehicleNo, setSelectedVehicleNo] = useState(null);
  const [lastLoc, setLastLoc] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [range, setRange] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [index, setIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState([]);
  const [showSplashMap, setShowSplashMap] = useState(true);
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [filterVehicles, setFilterVehicles] = useState([]);
  const [pathloading, setPathLoading] = useState(false)
  const [tempRange, setTempRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

 useEffect(()=>{
  if (vehiclelist && vehiclelist.length > 0 && vehicleno !== "" ) {
    const filtered = vehiclelist.filter((vehicle) =>
      vehicle.vehicleNo.toLowerCase().includes(vehicleno.toLowerCase())
    );
    setFilterVehicles(filtered);
    console.log("ab : ",filtered)
  }
 },[vehicleno])
 
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAP_KEY,
    libraries: googleMapsLibraries,
  });

  const icon1 = isLoaded
    ? {
        url: "images/truck1.png",
        scaledSize: new window.google.maps.Size(60, 60),
        anchor: new window.google.maps.Point(30, 30),
        scale: 1.5,
      }
    : null;

    console.log("Loading : ",isLoaded)

  const intervalIdRef = useRef(null);
  let lastKnownAngle = null;

  const rotateIconBasedOnPath = (vehicleLocation) => {
    if (vehicleLocation.length > 1) {
      let point1 = vehicleLocation[vehicleLocation.length - 2];
      let point2 = vehicleLocation[vehicleLocation.length - 1];

      for (let i = vehicleLocation.length - 3; i >= 0; i--) {
        if (point1.lat !== point2.lat || point1.lng !== point2.lng) break;
        point1 = vehicleLocation[i];
      }

      const point1LatLng = new window.google.maps.LatLng(
        Number(point1.lat),
        Number(point1.lng)
      );

      const point2LatLng = new window.google.maps.LatLng(
        Number(point2.lat),
        Number(point2.lng)
      );
      if (point1.lat === point2.lat && point1.lng === point2.lng) {
      } else {
        const angle = window.google.maps.geometry.spherical.computeHeading(
          point1LatLng,
          point2LatLng
        );

        lastKnownAngle = angle - 90;
      }

      // console.log("Updated actualAngle:", lastKnownAngle);

      const marker = document.querySelector(`[src="${icon1.url}"]`);
      if (marker && lastKnownAngle !== null) {
        marker.style.transform = `rotate(${lastKnownAngle}deg)`;
      }
    }
  };

  const vehicleLocation = vehiclePath.slice(-3);
  setTimeout(() => {
    rotateIconBasedOnPath(vehicleLocation);
  }, 500);

  const getAllVehicles = async () => {
    try {
      const response = await axios.get(
        `${config.host}${config.getAllVehicles.url}`
      );
      setVehiclelist(response.data.vehicles);
      setTotalVehicles(response.data?.vehicles.length)
      console.log("response.data : ",response.data.vehicles.length)
      const markerpos = response.data.vehicles.map((position) => ({
        vehicleid: position._id,
        lat: position.latitude,
        lng: position.longitude,
      }));
      setMarkerPosition(markerpos);
    } catch (error) {
      console.log(error);
    }
  };

  const getVehiclePath = async (vehicleNo) => {
    try {
      // setPathLoading(true)
      const response = await axios.get(
        `${config.host}${config.getVehiclePath.url}`,
        {
          params: { vehicleNo },
        }
      );
     
      console.log("response : ", response);
      setVehicleData(response.data);
      const formattedPath = response.data.map(({ lat, lng }) => ({ lat, lng }));
      setVehiclePath(formattedPath);
      setCurrentPosition(formattedPath[0]);
      const lastLatLong = formattedPath.slice(-1)[0];
      setLastLoc(lastLatLong);
      // setPathLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const vehicleCurrentLocation = async (vehicleNo) => {
    try {
      const response = await axios.get(
        `${config.host}${config.currentLocation.url}`,
        {
          params: { vehicleNo },
        }
      );

      console.log("API Response:", response.data.data);
      setVehicleDetails(response.data.data);

      const location = response.data.data;

      if (
        location &&
        typeof location.latitude === "number" &&
        typeof location.longitude === "number"
      ) {
        setVehicleCurrentloc({
          lat: location.latitude,
          lng: location.longitude,
        });
      } else {
        console.error("Invalid vehicle location data:", location);
      }
    } catch (error) {
      console.log("Error fetching vehicle location:", error);
    }
  };

  const FilterPathsByDate = async () => {
    clearVehiclePathInterval();
    console.log("running ", vehicleDetails.vehicleNo);
    if (!range) return;

    try {
      setPathLoading(true);
      const response = await axios.get(
        `${config.host}${config.filterVehiclePath.url}`,
        {
          params: {
            vehicleNo: vehicleDetails.vehicleNo,
            startDate: format(range.startDate, "yyyy-MM-dd"),
            endDate: format(range.endDate, "yyyy-MM-dd"),
          },
        }
      );

      console.log("Response:", response);
      setVehicleData(response.data);
      const formattedPath = response.data.map(({ lat, lng }) => ({ lat, lng }));
      setVehiclePath(formattedPath);
      setCurrentPosition(formattedPath[0]);

      if (formattedPath.length > 0) {
        setLastLoc(formattedPath[formattedPath.length - 1]);
      }

      const vehicleLocation = response.data.slice(-3);
      console.log("vehicleLocation : ", vehicleLocation);

      rotateIconBasedOnPath(vehicleLocation);
      setPathLoading(false);
    } catch (error) {
      console.error("Error fetching filtered paths:", error);
    }
  };

  const handleShowDetails = async (vehicleNo) => {
    setSelectedVehicleNo(vehicleNo);
    vehicleCurrentLocation(vehicleNo);
    getVehiclePath(vehicleNo);
    setShowSplashMap();
    setShowDetails(true);
  };

  const handleClick = () => {
    // setShowDetails(true);
  };

  const restartInterval = () => {
    if (selectedVehicleNo) {
      clearVehiclePathInterval();
      intervalIdRef.current = setInterval(() => {
        getVehiclePath(selectedVehicleNo);
        vehicleCurrentLocation(selectedVehicleNo);
      }, 10000);
    }
  };

  const clearVehiclePathInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  useEffect(() => {
    if (!selectedVehicleNo) return;
    // getVehiclePath(selectedVehicleNo);
    intervalIdRef.current = setInterval(() => {
      getVehiclePath(selectedVehicleNo);
      vehicleCurrentLocation(selectedVehicleNo);
    }, 10000);
    return () => clearInterval(intervalIdRef.current);
  }, [selectedVehicleNo]);

  useEffect(() => {
    getAllVehicles();
    const interval = setInterval(() => {
      getAllVehicles();
      vehicleCurrentLocation(selectedVehicleNo);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   getAllVehicles();
  //   // vehicleCurrentLocation();
  // }, []);

  // useEffect(() => {
  //   if (vehiclePath.length > 0 && index < vehiclePath.length - 1) {
  //     const interval = setInterval(() => {
  //       setIndex((prev) => prev + 5);
  //       setCurrentPosition(vehiclePath[index]);
  //     }, 100);

  //     return () => clearInterval(interval);
  //   }
  // }, [vehiclePath, index]);

  const safeCurrentPosition =
    currentPosition &&
    currentPosition.lat != null &&
    currentPosition.lng != null
      ? { lat: Number(currentPosition.lat), lng: Number(currentPosition.lng) }
      : { lat: 27.7172, lng: 85.324 };

  const safeVehicleCurrentLoc =
    vehicleCurrentloc?.lat != null && vehicleCurrentloc?.lng != null
      ? {
          lat: Number(vehicleCurrentloc.lat),
          lng: Number(vehicleCurrentloc.lng),
        }
      : { lat: 27.7172, lng: 85.324 }; // Default

  const safeLastLoc =
    lastLoc?.lat != null && lastLoc?.lng != null
      ? { lat: Number(lastLoc.lat), lng: Number(lastLoc.lng) }
      : { lat: 27.7172, lng: 85.324 };

  return (
    <div className={`main-container ${showDetails ? "details-open" : ""}`}>
      {/* Vehicle List Section */}
      <div className="vehicle-list">
        <VehicleList
          vehiclelist={vehiclelist}
          filterVehicles={filterVehicles}
          handleShowDetails={handleShowDetails}
          handleClick={handleClick}
          vehicleDetails={vehicleDetails}
          setFilterdCounts={setFilterdCounts}
        />
      </div>

      <div className="vehicle-details">
        {showDetails && (
          <VehicleDetails
            setShowDetails={setShowDetails}
            vehicleDetails={vehicleDetails}
            setFilteredPath={setFilteredPath}
            setLastLoc={setLastLoc}
            range={range}
            setRange={setRange}
            tempRange={tempRange}
            setTempRange={setTempRange}
            FilterPathsByDate={FilterPathsByDate}
            restartInterval={restartInterval}
            getVehiclePath={getVehiclePath}
            vehicleData={vehicleData}
          />
        )}
      </div>
      <div className="map-container">
        {isLoaded ? (
          showSplashMap ? (
            <SplashMap markerPosition={markerPosition} icon1={icon1} />
          ) : (
            <Map
              icon1={icon1}
              vehiclePath={vehiclePath}
              vehicleDetails={vehicleDetails}
              markerPosition={markerPosition}
              pathloading={pathloading}
            />
          )
        ) : (
          <div className="grid min-h-full place-items-center">
            <div className="text-center">
              <Commet color="#fc7d32" size="medium" text="" textColor="" />
              <h1 className="text-[#fc7d32]">Loading...</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
