import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import Map from "../main/Map";
import MapModal from "./MapModal";
import AtoB_Path from "./AtoB_Path";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import config from "../../config/services";
import { Commet } from "react-loading-indicators";
import { toast } from "react-toastify";

const customStyles = {
  content: {
    top: "54%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
  },
};

Modal.setAppElement("#root");

const JobModal = ({
  modalIsOpen,
  setIsOpen,
  selectedJob,
  latlongData,
  jobTouchPoint,
  jobDetails,
  setLatlongData,
}) => {
  const [jobPath, setJobPath] = useState([]);
  const [jobStops, setJobStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchedStops, setMatchedStops] = useState([]);
  const [activeMarker, setActiveMarker ] =  useState(null)

  const sourceCoords = latlongData
    ? { lat: latlongData.SourceLat, long: latlongData.SourceLong }
    : { lat: "", long: "" };

  const destinationCoords = latlongData
    ? { lat: latlongData.DestLat, long: latlongData.DestLong }
    : { lat: "", long: "" };

  const getTripData = async () => {
    try {
      setLoading(true);

      const payload = {
        vehicleNo: jobDetails.Vehicle_no,
        source: {
          lat: jobDetails.SourceLat,
          long: jobDetails.SourceLong,
        },
        destination: {
          lat: jobDetails.DestLat,
          long: jobDetails.DestLong,
        },
        jobArr_Date: jobDetails.Job_Arrivle,
        jobDept_Date: jobDetails.Job_Departure,
      };

      console.log(payload);
      const tripData = await axios.post(
        `${config.host}${config.getRootDataByTripDetails.url}`,
        payload
      );
      console.log(tripData);
      
      console.log("Received tripData: ", tripData.data);
      setJobPath(tripData.data.path);
      setJobStops(tripData.data.stops);
      setLoading(false);

      const results = [];

      jobTouchPoint.forEach((tp) => {
        const lat2 = Number(tp.TouchLat);
        const lon2 = Number(tp.TouchLong);

        const matchedStops = tripData.data.stops.filter((stop) => {
          const lat1 = Number(stop.latitude || stop.location?.lat);
          const lon1 = Number(stop.longitude || stop.location?.long);

          if (isNaN(lat1) || isNaN(lon1)) {
            console.warn(`Invalid coordinates for stop:`, stop);
            return false; // Skip invalid stops
          }

          // Allow some difference in latitudes and longitudes
          const latDiff = Math.abs(lat1 - lat2);
          const lonDiff = Math.abs(lon1 - lon2);
          const threshold = 0.10; // Adjust threshold as needed

          return latDiff <= threshold && lonDiff <= threshold;
        });

        if (matchedStops.length > 0) {
          const mergedStop = matchedStops.reduce(
            (acc, stop, index) => {
              if (index === 0) {
                acc.startTime = stop.startTime;
              }
              acc.endTime = stop.endTime;
              acc.totalTime += stop.totalTime || 0;
              acc.stops.push(stop);
              return acc;
            },
            { startTime: null, endTime: null, totalTime: 0, stops: [] }
          );

          const totalDurationMs =
            new Date(mergedStop.endTime) - new Date(mergedStop.startTime);
          const totalDurationSeconds = Math.floor(totalDurationMs / 1000);
          const hours = Math.floor(totalDurationSeconds / 3600);
          const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
          const seconds = totalDurationSeconds % 60;

          results.push({
            touchPoint: tp.TouchPoint,
            matchedStops: [mergedStop],
            totalDuration: totalDurationMs > 0 ? totalDurationMs : 0, // Ensure non-negative duration
            formattedDuration: `${hours}h ${minutes}m ${seconds}s`, // Duration in hours, minutes, and seconds
          });
        }
      });
      setMatchedStops(results);
    } catch (error) {
      toast.error(error.response.data.message)
      console.error("Error fetching trip data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripData();
  }, [jobDetails]);

  function closeModal() {
    setIsOpen(false);
    setLatlongData({});
    setJobPath([]);
    setJobStops([]);
  }

  const touch = jobTouchPoint.map((job) => ({
    location: { lat: parseFloat(job.TouchLat), lng: parseFloat(job.TouchLong) },
  }));

  const filteredTouch = touch.filter((num) => {
    const isValidLat =
      !isNaN(num.location.lat) &&
      num.location.lat !== 0 &&
      num.location.lat !== null;
    const isValidLng =
      !isNaN(num.location.lng) &&
      num.location.lng !== 0 &&
      num.location.lng !== null;
    return isValidLat && isValidLng;
  });

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        transparent={false}
      >
        {!loading ? (
          <div className="">
            <div className="flex justify-between px-3 py-1 bg-[#fc6a2a]">
              <div className="text-sm font-bold text-white">
                {selectedJob ? (
                  <>
                    <span>{selectedJob.Vehicle_no} | </span>
                    <span>{selectedJob.SourceCity} to </span>
                    <span>{selectedJob.DestCity} - </span>
                    <span>{selectedJob.TripSheet}</span>
                  </>
                ) : (
                  <span>No Vehicle data</span>
                )}
              </div>
              <div>
                <button onClick={closeModal}>
                  <IoClose />
                </button>
              </div>
            </div>
            <div className=" flex ">
              <div className="border border-gray-400">
                <AtoB_Path
                  jobTouchPoint={jobTouchPoint}
                  jobDetails={jobDetails}
                  matchedStops={matchedStops}
                  jobPath={jobPath}
                  jobStops={jobStops}
                />
              </div>
              <div className="border border-gray-400">
                <MapModal
                  sourceCoords={sourceCoords}
                  destinationCoords={destinationCoords}
                  touch={filteredTouch}
                  jobPath={jobPath}
                  jobStops={jobStops}
                  matchedTouchPoints={matchedStops}
                  loading={loading}
                  activeMarker={activeMarker}
                  setActiveMarker = {setActiveMarker}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-full place-items-center">
            <div className="text-center">
              <Commet color="#fc7d32" size="medium" text="" textColor="" />
              <h1 className="text-[#fc7d32]">Loading...</h1>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobModal;
