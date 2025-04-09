import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdSpeedometer } from "react-icons/io";
import { BsCalendar2WeekFill } from "react-icons/bs"; // Calendar Icon
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGlobleContext } from "../../globle/context";

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
  vehicleData,
}) => {
  const { showDetailed } = useGlobleContext();
  const [showCalendar, setShowCalendar] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const clearData = (vehicleNo) => {
    setRange(null);
    setShowCalendar(!!showCalendar);
    restartInterval();
    getVehiclePath(vehicleNo);
  };

  // console.log("range : ", range);

  useEffect(() => {
    if (range) {
      FilterPathsByDate();
    }
  }, [range]);

  const downloadExcel = async () => {
    let stopStartTime = null;
    let previousLocation = null;
    let isCurrentlyStopped = false;
    let Data = [];

    vehicleData.forEach((vehicle, index, arr) => {
      let isStopped = "No";
      let stopDuration = "";

      if (vehicle.speed === 0) {
        if (
          previousLocation &&
          vehicle.lat === previousLocation.lat &&
          vehicle.lng === previousLocation.lng
        ) {
          // Already stopped, update the stop duration
          if (!isCurrentlyStopped) {
            stopStartTime = new Date(vehicle.time);
            isCurrentlyStopped = true;
          }
        } else {
          // New stop detected
          stopStartTime = new Date(vehicle.time);
          isCurrentlyStopped = true;
        }
      } else {
        // Vehicle starts moving, log the stop entry if there was a stop
        if (isCurrentlyStopped && stopStartTime) {
          let stopEndTime = new Date(vehicle.time);
          let durationInMs = stopEndTime - stopStartTime;
          let durationInMinutes = Math.ceil(durationInMs / (1000 * 60));

          Data.push({
            speed: 0,
            address: previousLocation?.address || "Unknown",
            latitude: previousLocation?.lat || "",
            longitude: previousLocation?.lng || "",
            Datatime: stopStartTime.toISOString(), // Log stop start time
            stop: "Yes",
            "stop duration": `${durationInMinutes} min`,
          });

          // Reset stop tracking
          isCurrentlyStopped = false;
          stopStartTime = null;
        }

        // Add moving vehicle entry
        Data.push({
          speed: vehicle.speed,
          address: vehicle.address,
          latitude: vehicle.lat,
          longitude: vehicle.lng,
          Datatime: vehicle.time,
          stop: "No",
          "stop duration": "",
        });
      }

      previousLocation = {
        lat: vehicle.lat,
        lng: vehicle.lng,
        address: vehicle.address,
      };
    });

    // **Fix for Vehicles that Never Moved**
    if (Data.length === 0 && vehicleData.length > 0) {
      let firstVehicle = vehicleData[0];
      Data.push({
        speed: 0,
        address: firstVehicle.address || "Unknown",
        latitude: firstVehicle.lat || "",
        longitude: firstVehicle.lng || "",
        Datatime: firstVehicle.time,
        stop: "Yes",
        "stop duration": "Ongoing",
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(Data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `vehicle_activity.xlsx`);
  };

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col">
        <div className="p-2 flex items-center justify-between">
          <div className="relative px-2 pt-1">
            <div
              className="flex items-center space-x-2 text-sm border rounded px-2 py-1 cursor-pointer bg-white shadow"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <BsCalendar2WeekFill
                className="text-gray-600"
                // onClick={() => setShowCalendar(!showCalendar)}
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

                {/* Time Pickers */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Start Time */}
                  <div className="flex flex-col bg-gray-50 p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <label className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                      🕓 Start Time
                    </label>
                    <TimePicker
                      onChange={setStartTime}
                      value={startTime}
                      // disableClock={false}
                      className="w-full px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                      clearIcon={null}
                    />
                  </div>

                  {/* End Time */}
                  <div className="flex flex-col bg-gray-50 p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <label className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                      🕓 End Time
                    </label>
                    <TimePicker
                      onChange={setEndTime}
                      value={endTime}
                      // disableClock={true}
                      className="w-full rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                      clearIcon={null}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
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
                      const updatedRange = {
                        ...tempRange[0],
                        startDate: new Date(
                          tempRange[0].startDate.toDateString() +
                            " " +
                            startTime
                        ),
                        endDate: new Date(
                          tempRange[0].endDate.toDateString() + " " + endTime
                        ),
                      };
                      setRange(updatedRange);
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
            <div className="flex justify-end">
              <button
                className="border p-[3px] rounded text-xs font-semibold mt-2 bg-amber-500 border-amber-600  hover:bg-amber-500 cursor-pointer transition-transform transform hover:scale-104"
                onClick={downloadExcel}
              >
                ⬇️Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;

// const downloadExcel = async () => {
//   let stopStartTime = null;
//   const Data = vehicleData.map((vehicle, index) => {
//     let status = "Running"; // Default status

//     if (vehicle.speed === 0) {
//       if (!stopStartTime) {
//         stopStartTime = vehicle.time; // Mark start of stop
//       }
//       status = `Stopped from ${stopStartTime} to ${vehicle.time}`;
//     } else {
//       stopStartTime = null; // Reset when vehicle starts moving
//     }

//     return {
//       speed: vehicle.speed,
//       address: vehicle.address,
//       latitude: vehicle.lat,
//       longitude: vehicle.lng,
//       Datetime: vehicle.time,
//       status: status,
//     };
//   });

//   const worksheet = XLSX.utils.json_to_sheet(Data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//   saveAs(blob, `example.xlsx`);
// };

// const downloadExcel = async () => {
//   let stopStartTime = null;
//   let stopEndTime = null;
//   let stopLatLng = null;
//   let stopCount = 0;
//   const Data = [];

//   vehicleData.forEach((vehicle, index) => {
//     const { lat, lng, speed, address, time } = vehicle;
//     const currentLatLng = `${lat},${lng}`;

//     if (stopLatLng === currentLatLng) {
//       stopCount++; // Increase stop count if same location repeats
//       stopEndTime = time; // Update stop end time
//     } else {
//       // If new location detected, check if previous location was a stop
//       if (stopCount >= 4) {
//         // Calculate stop duration
//         const start = new Date(stopStartTime);
//         const end = new Date(stopEndTime);
//         const stopDuration = Math.round((end - start) / 60000); // Convert to minutes

//         Data.push({
//           speed: 0,
//           address: vehicleData[index - 1].address,
//           latitude: stopLatLng.split(",")[0],
//           longitude: stopLatLng.split(",")[1],
//           Datetime: `${stopStartTime} to ${stopEndTime}`,
//           status: `Stopped for ${stopDuration} min from ${stopStartTime} to ${stopEndTime}`,
//         });
//       }

//       // Reset tracking variables
//       stopLatLng = currentLatLng;
//       stopStartTime = time;
//       stopEndTime = time;
//       stopCount = 1;
//     }

//     // If moving, mark as Running
//     if (stopCount < 4) {
//       Data.push({
//         speed,
//         address,
//         latitude: lat,
//         longitude: lng,
//         Datetime: time,
//         status: "Running",
//       });
//     }
//   });

//   // Final check in case the last entries were a stop
//   if (stopCount >= 4) {
//     const start = new Date(stopStartTime);
//     const end = new Date(stopEndTime);
//     const stopDuration = Math.round((end - start) / 60000);

//     Data.push({
//       speed: 0,
//       address: vehicleData[vehicleData.length - 1].address,
//       latitude: stopLatLng.split(",")[0],
//       longitude: stopLatLng.split(",")[1],
//       Datetime: `${stopStartTime} to ${stopEndTime}`,
//       status: `Stopped for ${stopDuration} min from ${stopStartTime} to ${stopEndTime}`,
//     });
//   }

//   const worksheet = XLSX.utils.json_to_sheet(Data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });
//   const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(blob, `example.xlsx`);
// };
