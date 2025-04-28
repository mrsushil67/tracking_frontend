import React from 'react'

const VehicleCard = ({vehicle, handleShowDetails}) => {
  return (
    <div
    onClick={() => handleShowDetails(vehicle.vehicleNo)}
    className="vehicle-card p-3 my-3"
  >
    <div className="flex justify-between">
      <div className="font-bold text-gray-700">{vehicle.vehicleNo}</div>
      {/* <MdOutlineFullscreen onClick={() => handleClick()} /> */}
    </div>

    <div className="flex flex-row ">
      <div className="pr-2 flex flex-row items-center text-[12px] truncate">
        <span className="pr-1 font-bold text-sm">📅</span>

        <span className="text-green-700 font-bold">
          {vehicle.lastUpdateAt}
        </span>
      </div>
    </div>
    <div>
      <div className="flex flex-row items-center text-[12px]">
        <span className=""></span>
        <span className="font-bold text-sm text-gray-700">
          🚗 Speed:
        </span>
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
  )
}

export default VehicleCard
