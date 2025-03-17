import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import VehicleList from "./VehicleList";
import Map from "./Map";
import VehicleDetails from "./VehicleDetails";
import { format } from "date-fns";
import arrow from "./arrow.png";
import config from "../../config/services";

function Main() {
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
  const [tempRange, setTempRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // console.log("CurrentPos : ", currentPosition);

  const icon1 = window.google?.maps
    ? {
        url: "images/truck1.png", //arrow,
        scaledSize: new window.google.maps.Size(70, 70),
        anchor: new window.google.maps.Point(35, 35),
        scale: 1.5,
      }
    : null;

  const intervalIdRef = useRef(null);
  let lastKnownAngle = null; // Store last computed angle

  const rotateIconBasedOnPath = (vehicleLocation) => {
    if (vehicleLocation.length > 1) {
      // Get the last two unique points
      let point1 = vehicleLocation[vehicleLocation.length - 2];
      let point2 = vehicleLocation[vehicleLocation.length - 1];

      // If the last two points are identical, find the last different one
      for (let i = vehicleLocation.length - 3; i >= 0; i--) {
        if (point1.lat !== point2.lat || point1.lng !== point2.lng) break;
        point1 = vehicleLocation[i]; // Shift to an older valid position
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
        // console.log("No movement detected, keeping last angle:", lastKnownAngle);
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
      // console.log("vehicles : ",response.data.vehicles)
      // const running = response.data?.vehicles.filter(
      //   (vehicle) => vehicle.speed > 0
      // );
      // console.log("vehicles : ", running.length);

      setVehiclelist(response.data.vehicles);
    } catch (error) {
      console.log(error);
    }
  };

  const getVehiclePath = async (vehicleNo) => {
    try {
      const response = await axios.get(
        `${config.host}${config.getVehiclePath.url}`,
        {
          params: { vehicleNo },
        }
      );
      console.log("response : ", response);
      const formattedPath = response.data.map(({ lat, lng }) => ({ lat, lng }));
      setVehiclePath(formattedPath);
      setCurrentPosition(formattedPath[0]);
      const lastLatLong = formattedPath.slice(-1)[0];
      setLastLoc(lastLatLong);
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

      const formattedPath = response.data.map(({ lat, lng }) => ({ lat, lng }));
      setVehiclePath(formattedPath);
      setCurrentPosition(formattedPath[0]);

      if (formattedPath.length > 0) {
        setLastLoc(formattedPath[formattedPath.length - 1]);
      }

      const vehicleLocation = response.data.slice(-3);
      console.log("vehicleLocation : ", vehicleLocation);

      rotateIconBasedOnPath(vehicleLocation);
    } catch (error) {
      console.error("Error fetching filtered paths:", error);
    }
  };

  const handleShowDetails = async (vehicleNo) => {
    setSelectedVehicleNo(vehicleNo);
    await vehicleCurrentLocation(vehicleNo);
    await getVehiclePath(vehicleNo);
  };

  const handleClick = () => {
    setShowDetails(true);
  };

  const restartInterval = () => {
    if (selectedVehicleNo) {
      clearVehiclePathInterval(); // Clear previous interval
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
    getVehiclePath(selectedVehicleNo);
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

  useEffect(() => {
    getAllVehicles();
    vehicleCurrentLocation();
  }, []);

  useEffect(() => {
    if (vehiclePath.length > 0 && index < vehiclePath.length - 1) {
      const interval = setInterval(() => {
        setIndex((prev) => prev + 5);
        setCurrentPosition(vehiclePath[index]);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [vehiclePath, index]);

  return (
    <div className={`main-container ${showDetails ? "details-open" : ""}`}>
      {/* Vehicle List Section */}
      <div className="vehicle-list">
        <VehicleList
          vehiclelist={vehiclelist}
          handleShowDetails={handleShowDetails}
          handleClick={handleClick}
          vehicleDetails={vehicleDetails}
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
          />
        )}
      </div>

      {/* Google Map Section */}
      <div className="map-container">
        <Map
          icon1={icon1}
          vehiclePath={vehiclePath}
          filteredPath={filteredPath}
          vehicleCurrentloc={vehicleCurrentloc}
          lastLoc={lastLoc}
          getVehiclePath={getVehiclePath}
          currentPosition={currentPosition}
          vehicleDetails={vehicleDetails}
        />
      </div>
    </div>
  );
}

export default Main;
