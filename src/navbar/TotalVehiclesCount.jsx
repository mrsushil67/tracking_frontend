import React, { useRef, useState } from "react";
import VehicleStatus from "./VehicleStatus";
import { useGlobleContext } from "../globle/context";

const TotalVehiclesCount = () => {
  const ref = useRef(null);
  const { totalVehicles, vehiclelist } = useGlobleContext();
  const [hoverVehicleCount, setHoverVehicleCount] = useState(null);

  const count = {};
  vehiclelist.forEach((element) => {
    element.currentStatus in count
      ? count[element.currentStatus]++
      : (count[element.currentStatus] = 1);
  });
  const vehicleStatus = Object.entries(count).map(([key, value]) => ({
    status: key,
    count: value,
  }));

  const handlePopoverOpen = (event) => {
    setHoverVehicleCount(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setHoverVehicleCount(null);
  };
  const openVehicleStatusFilter = Boolean(hoverVehicleCount);
  const id2 = openVehicleStatusFilter ? "mouse-over-popover" : undefined;

  return (
    <div
      className="flex"
      ref={ref}
      aria-owns={id2}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <div className="pr-10">
        <span className="font-bold text-gray-700">Running : </span>
        <span className="font-bold text-green-700">{count.RUNNING}</span>
      </div>
      <div className="pr-10">
        <span className="font-bold text-gray-700">Idle : </span>
        <span className="font-bold text-yellow-500">{count.IDLE}</span>
      </div>
      <div className="pr-10">
        {totalVehicles > 0 && (
          <div>
            <span className="font-bold text-gray-700">
              Total Vehicles :{" "}
            </span>
            <span className="font-bold text-[#fc6a2a]">
              {totalVehicles}{" "}
            </span>
            <VehicleStatus
              vehicleStatus={vehicleStatus}
              hoverVehicleCount={hoverVehicleCount}
              setHoverVehicleCount={setHoverVehicleCount}
              openVehicleStatusFilter={openVehicleStatusFilter}
              id2={id2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalVehiclesCount;
