import React, { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { MdOutlineFullscreen } from "react-icons/md";

const VehicleList = ({
  vehiclelist,
  handleShowDetails,
  handleClick,
  vehicleDetails,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vehicle-card-container">
      {vehiclelist.length > 0 ? (
        vehiclelist.map((vehicle, index) => (
          <div
            key={index}
            onClick={() => handleShowDetails(vehicle.vehicleNo)}
            className="vehicle-card p-3 ml-2 mb-2"
          >
            <div className="flex justify-between">
              <div className="font-bold text-gray-700">{vehicle.vehicleNo}</div>
              <MdOutlineFullscreen onClick={() => handleClick()} />
            </div>

            <div className="flex flex-row">
              <div className="pr-2 flex flex-row items-center text-[12px]">
                <span className="pr-1 font-bold text-sm">
                📅
                </span>
                
                <span className="text-green-700 font-bold">
                  {vehicle.lastUpdateAt}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-row items-center text-[12px]">
                <span className="">
                
                </span>
                <span className="font-bold text-sm text-gray-700" >🚗 Speed:</span>
                <span
                  className={`${
                    vehicle.speed === 0
                      ? "text-orange-600 px-2 font-bold"
                      : "text-green-700 px-2 font-bold"
                  }`}
                >
                  {vehicle.speed === 0 ? 0 : vehicle.speed?.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="truncate">
              <span className="font-bold text-sm text-gray-700">
              📍 Address :{" "}
              </span>
              <span className="text-xs">
                {vehicle?.currentAddress
                  ? vehicle.currentAddress.slice(" ")
                  : "N/A"}
              </span>
            </div>
          </div>
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

// const VehicleList = ({ vehiclelist, handleShowDetails, handleClick }) => {
//     const [hoveredVehicle, setHoveredVehicle] = useState(null);
//     const [debouncedVehicle, setDebouncedVehicle] = useState(null);

//     // Debounce effect: Only update the vehicle details if the user hovers for a short period
//     useEffect(() => {
//         const delay = setTimeout(() => {
//             setDebouncedVehicle(hoveredVehicle);
//         }, 300); // Adjust debounce time as needed (300ms)

//         return () => clearTimeout(delay);
//     }, [hoveredVehicle]);

//     // Call API only when debouncedVehicle changes
//     useEffect(() => {
//         if (debouncedVehicle !== null) {
//             handleShowDetails(debouncedVehicle);
//         }
//     }, [debouncedVehicle, handleShowDetails]);

//     return (
//         <div>
//             {vehiclelist.length > 0 ? (
//                 vehiclelist.map((vehicle, index) => (
//                     <div
//                         key={index}
//                         className="border p-4 ml-1 my-1 cursor-pointer rounded hover:bg-gray-200 transition"
//                         onMouseEnter={() => setHoveredVehicle(vehicle.vehicleNo)}
//                         onMouseLeave={() => setHoveredVehicle(null)}
//                         onClick={() => handleClick()}
//                     >
//                         {vehicle.vehicleNo}
//                     </div>
//                 ))
//             ) : (
//                 <p>No vehicles found</p>
//             )}
//         </div>
//     );
// };

// export default VehicleList;
