import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import Map from "../main/Map";
import MapModal from "./MapModal";
import AtoB_Path from "./AtoB_Path";
import { IoClose } from "react-icons/io5";
import axios from "axios";

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

const JobModal = ({ modalIsOpen, setIsOpen, selectedJob }) => {
  const [latlongData, setLatlongData] = useState({});
  const [jobTouchPoint, setJobTouchPoint] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);

  const sourceCoords = latlongData
    ? { lat: latlongData.SourceLat, long: latlongData.SourceLong }
    : { lat: "", long: "" };

  const destinationCoords = latlongData
    ? { lat: latlongData.DestLat, long: latlongData.DestLong }
    : { lat: "", long: "" };

    const fetchJobRout = async () => {
      try {
        if (!selectedJob?.id) {
          // console.warn("Selected job is not available.");
          return;
        }
    
        const response = await axios.get(
          `https://rcm.snaptrak.tech/VehicleJobListDeatils?id=${selectedJob.id}`
        );
    
        console.log(response.data);
        setLatlongData(response.data.trip);
        setJobDetails(response.data.trip);
        setJobTouchPoint(response.data.touch);
      } catch (error) {
        console.error("Error fetching job route:", error);
      }
    };
    
    useEffect(() => {
      fetchJobRout();
    }, [selectedJob]);
    

  function closeModal() {
    setIsOpen(false);
    setLatlongData({});
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        transparent={false}
        
      >
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
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobModal;
