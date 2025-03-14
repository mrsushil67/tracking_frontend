import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdSpeedometer } from "react-icons/io";
import { BsCalendar2WeekFill } from "react-icons/bs"; // Calendar Icon
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import axios from "axios";

const VehicleDetails = ({
  setShowDetails,
  vehicleDetails,
  setFilteredPath,
  setLastLoc,
  range,
  setRange,
  tempRange,
  setTempRange,
  FilterPathsByDate,
  restartInterval,
  getVehiclePath,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const clearData = (vehicleNo) => {
    setRange(null);
    setShowCalendar(!!showCalendar);
    restartInterval();
    getVehiclePath(vehicleNo);
  };

  useEffect(() => {
    if (range) {
      FilterPathsByDate();
    }
  }, [range]);

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex flex-col">
        <div className="p-2 flex items-center justify-between">
          <div className="relative px-2 pt-1">
            <div
              className="flex items-center space-x-2 text-sm border rounded px-2 py-1 cursor-pointer bg-white shadow"
              // onClick={() => setShowCalendar(!showCalendar)}
            >
              <BsCalendar2WeekFill
                className="text-gray-600"
                onClick={() => setShowCalendar(!showCalendar)}
              />{" "}
              {/* Calendar Icon */}
              {range ? (
                <>
                  <span>{format(range.startDate, "yyyy-MM-dd")}</span>
                  <span>to</span>
                  <span>{format(range.endDate, "yyyy-MM-dd")}</span>
                  <span className="p-[1px] bg-gray-400 rounded-2xl">
                    <IoClose
                      onClick={() => {
                        clearData(vehicleDetails.vehicleNo);
                      }}
                    />
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Select Date Range</span>
              )}
            </div>

            {showCalendar && (
              <div className="absolute left-0 top-full mt-2 z-50 bg-white shadow-lg border rounded p-3 custom-calendar">
                <DateRange
                  ranges={tempRange}
                  onChange={(item) => setTempRange([{ ...item.selection }])}
                  moveRangeOnFirstSelection={false}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => {
                      setTempRange([
                        ...(range
                          ? [range]
                          : [
                              {
                                startDate: new Date(),
                                endDate: new Date(),
                                key: "selection",
                              },
                            ]),
                      ]);
                      setShowCalendar(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      setRange({ ...tempRange[0] }); // Apply selected range
                      setShowCalendar(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <IoClose
              className="text-gray-700 hover:text-gray-900 text-2xl font-bold cursor-pointer transition-transform transform hover:scale-110"
              onClick={() => {
                setShowDetails(false);
                restartInterval();
                getVehiclePath(vehicleDetails.vehicleNo);
              }}
            />
          </div>
        </div>
        <div className="mt-4 mx-2 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-700">Details -</h2>
          <p className="text-xl font-bold text-gray-700">
            {vehicleDetails.vehicleNo}
          </p>

          <div className="flex items-center space-x-1 mt-2">
            <IoMdSpeedometer className="text-gray-600" />
            <span className=" font-bold text-xs  text-gray-700">Speed:</span>
            <span
              className={` text-xs ${
                vehicleDetails.speed === 0
                  ? "text-orange-600 font-bold"
                  : "text-green-600 font-bold"
              }`}
            >
              {vehicleDetails.speed?.toFixed(2)} km/h
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <span className="font-bold text-xs">Coordinates</span>
            <pan className=" font-bold text-xs px-1">:</pan>
            <span
              className={`font-semibold text-xs ${
                vehicleDetails.speed === 0
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {vehicleDetails.latitude?.toFixed(4)},{" "}
              {vehicleDetails.longitude?.toFixed(4)}
            </span>
          </div>

          <div className="mt-2 text-sm">
            <span className="font-bold text-xs text-gray-700">
              Current Address:
            </span>
            <span className="text-gray-600 text-xs px-3">
              {vehicleDetails.currentAddress
                ? vehicleDetails.currentAddress
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
