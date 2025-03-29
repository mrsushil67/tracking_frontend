import React, { useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import Map from "../main/Map";
import MapModal from "./MapModal";
import AtoB_Path from "./AtoB_Path";
import { IoClose } from "react-icons/io5";

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
  const [latlongData, setLatlongData] = useState({})

  const sourceCoords = latlongData ? 
  {lat:latlongData.SourceLat, long:latlongData.SourceLong}
  :{lat:"", long:""}

  const destinationCoords = latlongData ? 
  {lat:latlongData.DestLat, long:latlongData.DestLong}
  :{lat:"", long:""}

  function closeModal() {
    setIsOpen(false);
    setLatlongData({})
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
          <div className="flex justify-between px-3 py-1 bg-amber-600">
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
              <AtoB_Path selectedJob={selectedJob} setLatlongData={setLatlongData}/>
            </div>
            <div className="border border-gray-400">
              <MapModal sourceCoords={sourceCoords} destinationCoords={destinationCoords}/>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobModal;
