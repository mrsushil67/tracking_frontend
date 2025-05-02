import React, { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { MdOutlineFullscreen } from "react-icons/md";
import VehicleCard from "../../components/VehicleCard";
import { useGlobleContext } from "../../globle/context";

const VehicleList = ({
  vehiclelist,
  handleShowDetails,
  handleClick,
  vehicleDetails,
}) => {
  const { vehicleno, filterByStatus } = useGlobleContext();
  const [filterVehicles, setFilterVehicles] = useState([]);
  const [filterVehiclesByStatus, setFilterVehiclesByStatus] = useState([]);

  useEffect(() => {
    if (vehiclelist && vehiclelist.length > 0) {
      console.log("Filtered : ", filterByStatus);
      const filtered = vehiclelist.filter((vehicle) =>
        filterByStatus.some((status) => vehicle.currentStatus.includes(status))
      );
      setFilterVehiclesByStatus(filterByStatus.length > 0 ? filtered : []);
    }
  }, [filterByStatus]);

  useEffect(() => {
    if (vehiclelist && vehiclelist.length > 0 && vehicleno !== "") {
      const filtered = vehiclelist.filter((vehicle) =>
        vehicle.vehicleNo.toLowerCase().includes(vehicleno.toLowerCase())
      );
      setFilterVehicles(filtered);
    }
  }, [vehicleno]);

  const vehiclesToDisplay =
    filterVehiclesByStatus && filterVehiclesByStatus.length > 0
      ? filterVehiclesByStatus
      : filterVehicles && filterVehicles.length > 0
      ? filterVehicles
      : vehiclelist;

  return (
    <div className="vehicle-card-container bg-gray-100">
      {vehiclesToDisplay.length > 0 ? (
        vehiclesToDisplay.map((vehicle, index) => (
          <VehicleCard
            key={index}
            vehicle={vehicle}
            handleShowDetails={handleShowDetails}
          />
        ))
      ) : (
        <div className="flex justify-center items-center">
          <span className="items-center">Loading ... </span>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
