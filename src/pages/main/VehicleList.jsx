import React, { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { MdOutlineFullscreen } from "react-icons/md";
import VehicleCard from "../../components/VehicleCard";

const VehicleList = ({
  vehiclelist,
  filterVehicles,
  handleShowDetails,
  handleClick,
  vehicleDetails,
  setFilterdCounts,
}) => {
  // console.log("Filtered : ", filterVehicles);
  const vehiclesToDisplay =
    filterVehicles && filterVehicles.length > 0 ? filterVehicles : vehiclelist;

  // console.log("vehiclesToDisplay :", vehiclesToDisplay.length);
  setFilterdCounts(vehiclesToDisplay.length);

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
