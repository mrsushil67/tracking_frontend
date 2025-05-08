import React from 'react';
import {
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Paper,
} from '@mui/material';

const steps = [
  {
    label: 'Car Picked',
    description: 'The car was picked up from the location.',
    leftTime: '09:00 AM',
    rightTime: '09:15 AM',
  },
  {
    label: 'On the Way',
    description: 'The vehicle is en route to the destination.',
    leftTime: '09:30 AM',
    rightTime: '10:00 AM',
  },
  {
    label: 'Reached',
    description: 'The vehicle has arrived at the destination.',
    leftTime: '10:15 AM',
    rightTime: '10:20 AM',
  },
];

export default function VerticalStepperWithTimes() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Stepper orientation="vertical" activeStep={steps.length}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Grid container alignItems="center">
                {/* Left Time */}
                <Grid item xs={3}>
                  <Typography variant="caption" color="text.secondary">
                    {step.leftTime}
                  </Typography>
                </Grid>

                {/* Step Label */}
                <Grid item xs={6}>
                  <Typography variant="subtitle1" align="center">
                    {step.label}
                  </Typography>
                </Grid>

                {/* Right Time */}
                <Grid item xs={3} textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    {step.rightTime}
                  </Typography>
                </Grid>
              </Grid>
            </StepLabel>

            <StepContent>
              <Typography sx={{ ml: 2 }}>{step.description}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Final message after all steps */}
      <Paper square elevation={0} sx={{ p: 2, mt: 2 }}>
        <Typography variant="body2" align="center">
          Journey Completed
        </Typography>
      </Paper>
    </Box>
  );
}


// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import Modal from "react-modal";
// import Map from "../main/Map";
// import MapModal from "./MapModal";
// import AtoB_Path from "./AtoB_Path";
// import { IoClose } from "react-icons/io5";
// import axios from "axios";
// import config from "../../config/services";

// const customStyles = {
//   content: {
//     top: "54%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     padding: 0,
//   },
// };

// Modal.setAppElement("#root");

// const JobModal = ({
//   modalIsOpen,
//   setIsOpen,
//   selectedJob,
//   latlongData,
//   jobTouchPoint,
//   jobDetails,
//   setLatlongData,
// }) => {
//   const sourceCoords = latlongData
//     ? { lat: latlongData.SourceLat, long: latlongData.SourceLong }
//     : { lat: "", long: "" };

//   const destinationCoords = latlongData
//     ? { lat: latlongData.DestLat, long: latlongData.DestLong }
//     : { lat: "", long: "" };

//   const getTripData = async () => {
//     try {
//       console.log("jobDetails : ", jobDetails);

//       const payload = {
//         vehicleNo: jobDetails.Vehicle_no,
//         source: {
//           lat: jobDetails.SourceLat,
//           long: jobDetails.SourceLong,
//         },
//         destination: {
//           lat: jobDetails.DestLat,
//           long: jobDetails.DestLong,
//         },
//         jobArr_Date : jobDetails.Job_Arrivle,
//         jobDept_Date : jobDetails.Job_Departure,
//       }

//       console.log(payload)
//       const tripData = await axios.post(
//         `${config.host}${config.getRootDataByTripDetails.url}`,
//         payload
//       );

//       console.log("Received tripData: ", tripData.data);
//     } catch (error) {
//       console.error("Error fetching trip data: ", error);
//     }
//   };

//   useEffect(() => {
//     getTripData();
//   }, [jobDetails]);

//   function closeModal() {
//     setIsOpen(false);
//     setLatlongData({});
//   }

//   const touch = jobTouchPoint.map((job) => ({
//     location: { lat: parseFloat(job.TouchLat), lng: parseFloat(job.TouchLong) },
//   }));

//   const filteredTouch = touch.filter((num) => {
//     const isValidLat =
//       !isNaN(num.location.lat) &&
//       num.location.lat !== 0 &&
//       num.location.lat !== null;
//     const isValidLng =
//       !isNaN(num.location.lng) &&
//       num.location.lng !== 0 &&
//       num.location.lng !== null;
//     // console.log("num:", num.location.lat, num.location.lng);
//     return isValidLat && isValidLng;
//   });

//   // console.log(jobDetails)
//   // console.log(filteredTouch)

//   return (
//     <div>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         style={customStyles}
//         contentLabel="Example Modal"
//         transparent={false}
//       >
//         <div className="">
//           <div className="flex justify-between px-3 py-1 bg-[#fc6a2a]">
//             <div className="text-sm font-bold text-white">
//               {selectedJob ? (
//                 <>
//                   <span>{selectedJob.Vehicle_no} | </span>
//                   <span>{selectedJob.SourceCity} to </span>
//                   <span>{selectedJob.DestCity} - </span>
//                   <span>{selectedJob.TripSheet}</span>
//                 </>
//               ) : (
//                 <span>No Vehicle data</span>
//               )}
//             </div>
//             <div>
//               <button onClick={closeModal}>
//                 <IoClose />
//               </button>
//             </div>
//           </div>
//           <div className=" flex ">
//             <div className="border border-gray-400">
//               <AtoB_Path
//                 jobTouchPoint={jobTouchPoint}
//                 jobDetails={jobDetails}
//               />
//             </div>
//             <div className="border border-gray-400">
//               <MapModal
//                 sourceCoords={sourceCoords}
//                 destinationCoords={destinationCoords}
//                 touch={filteredTouch}
//               />
//             </div>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default JobModal;
