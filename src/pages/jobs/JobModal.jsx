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

  const sourceCoords = latlongData
    ? { lat: latlongData.SourceLat, long: latlongData.SourceLong }
    : { lat: "", long: "" };

  const destinationCoords = latlongData
    ? { lat: latlongData.DestLat, long: latlongData.DestLong }
    : { lat: "", long: "" };

  const getTripData = async () => {
    try {
      setLoading(true);
      console.log("jobDetails : ", jobDetails);

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
      if (tripData.data.status === 404) {
        console.log(tripData.data?.message);
      }
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

          const distance = haversineDistance(lat1, lon1, lat2, lon2);
          return !isNaN(distance) && distance <= 1; // Check only within 1 km radius
        });

        if (matchedStops.length > 0) {
          results.push({
            touchPoint: tp.TouchPoint,
            matchedStops: matchedStops.map((stop) => ({
              stopDetails: stop,
              distance: haversineDistance(
                Number(stop.latitude || stop.location?.lat),
                Number(stop.longitude || stop.location?.long),
                lat2,
                lon2
              ).toFixed(3),
            })),
          });
        }
      });

      setMatchedStops(results);
    } catch (error) {
      console.error("Error fetching trip data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return NaN;

    const R = 6371; // Radius of Earth in km
    const toRad = (x) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // useEffect(() => {
  //   const threshold = 0.5; // km
  //   const results = [];

  //   jobPath.forEach((stop, index) => {
  //     jobTouchPoint.forEach((tp) => {
  //       const lat1 = Number(stop.latitude || stop.location?.lat);
  //       const lon1 = Number(stop.longitude || stop.location?.long);

  //       if (isNaN(lat1) || isNaN(lon1)) {
  //         console.warn(`Invalid coordinates at stop ${index + 1}:`, stop);
  //         return; // Skip this stop
  //       }

  //       const lat2 = Number(tp.TouchLat);
  //       const lon2 = Number(tp.TouchLong);

  //       const distance = haversineDistance(lat1, lon1, lat2, lon2);

  //       console.log(`Stop ${index + 1} → ${tp.TouchPoint}:`, {
  //         lat1,
  //         lon1,
  //         lat2,
  //         lon2,
  //         distance,
  //       });

  //       if (!isNaN(distance) && distance <= threshold) {
  //         results.push({
  //           stopIndex: index,
  //           matchedTouchPoint: tp.TouchPoint,
  //           distance: distance.toFixed(3),
  //         });
  //       }
  //     });
  //   });

  //   setMatchedStops(results);
  // }, []);

  useEffect(() => {
    getTripData();
  }, [jobDetails]);

  function closeModal() {
    setIsOpen(false);
    setLatlongData({});
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
