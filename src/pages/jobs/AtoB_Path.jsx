import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const AtoB_Path = ({
  jobTouchPoint,
  jobDetails,
  matchedStops,
  jobPath,
  jobStops,
}) => {
  console.log("jobStops  : ", jobStops);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  return (
    <Box className="w-[400px] h-[420px] overflow-y-auto rounded-lg shadow-lg relative p-4">
      <Box className="flex justify-center">
        {jobDetails !== null || undefined ? (
          jobTouchPoint[0].Id !== null ? (
            <Box>
              <Stepper
                orientation="vertical"
                sx={{
                  "& .MuiStepLabel-root": {
                    "& .MuiStepLabel-label": {
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "#2d3748",
                    },
                  },
                  "& .MuiStepContent-root": {
                    borderLeft: "2px solid #4caf50",
                    paddingLeft: "16px",
                  },
                  "& .MuiStepIcon-root": {
                    color: "#4caf50",
                  },
                }}
              >
                {" "}
                <Step active={true}>
                  <StepLabel>
                    <Box className="text-sm font-semibold text-green-700">
                      {jobDetails ? jobDetails.SourceCity : ""}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box className="text-gray-600 font-medium text-xs">
                      Sch Dept time :
                      {jobDetails ? jobDetails.Job_Departure : ""}
                    </Box>
                    {jobPath.length > 0 && (
                      <Box className="text-gray-600 font-medium text-xs">
                        Act Dept time :&nbsp;
                        {(() => {
                          const timestamp =
                            jobStops.length === 0
                              ? jobPath[0]?.createdAt
                              : jobStops[0]?.endTime;

                          return timestamp
                            ? dayjs(timestamp)
                                .tz("Asia/Kolkata")
                                .format("YYYY-MM-DD HH:mm:ss")
                            : "N/A";
                        })()}
                      </Box>
                    )}
                  </StepContent>
                </Step>
                {jobTouchPoint.map((stop, index) => {
                  const matchedStop = matchedStops.find(
                    (ms) => ms.touchPoint === stop.TouchPoint
                  );
                  return (
                    <Step key={index} active={true}>
                      <StepLabel>
                        <Box className="text-sm font-semibold text-green-700">
                          {stop.TouchPoint}
                        </Box>
                      </StepLabel>
                      <StepContent>
                        <Box className="text-gray-600 font-medium text-xs">
                          <Box>Sch Arr at :&nbsp; {stop.ShuArr}</Box>
                          <Box>Sch Dept at :&nbsp;{stop.ShuDept}</Box>
                        </Box>
                        {matchedStop && (
                          <Box className="text-gray-600 font-medium text-xs">
                            <Box>
                              Act Arr at :&nbsp;
                              {(() => {
                                const timestamp =
                                  matchedStop.matchedStops[0].startTime;

                                return timestamp
                                  ? dayjs(timestamp)
                                      .tz("Asia/Kolkata")
                                      .format("YYYY-MM-DD HH:mm:ss")
                                  : "N/A";
                              })()}
                            </Box>
                            <Box>
                              Act Dept at : &nbsp;
                              {(() => {
                                const timestamp =
                                  matchedStop.matchedStops[0].endTime;

                                return timestamp
                                  ? dayjs(timestamp)
                                      .tz("Asia/Kolkata")
                                      .format("YYYY-MM-DD HH:mm:ss")
                                  : "N/A";
                              })()}
                            </Box>
                          </Box>
                        )}
                      </StepContent>
                    </Step>
                  );
                })}
                <Step active={true}>
                  <StepLabel>
                    <Box className="text-sm font-semibold text-green-700">
                      {jobDetails ? jobDetails.DestCity : ""}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    {jobDetails.TripType === 2 ? (
                      <Box>
                        <Box>
                          <Box className="text-gray-600 font-medium text-xs">
                            Sch Arr at :&nbsp;
                            {jobDetails &&
                            jobDetails.Arr &&
                            jobDetails.Arr.split(",")[0]
                              ? jobDetails.Arr.split(",")[0].trim()
                              : jobDetails.Arr}
                          </Box>
                          <Box className="text-gray-600 font-medium text-xs">
                            Sch Dept at :&nbsp;
                            {jobDetails &&
                            jobDetails.Dept &&
                            jobDetails.Dept.split(",")[1]
                              ? jobDetails.Dept.split(",")[1].trim()
                              : jobDetails.Dept}
                          </Box>
                        </Box>
                        {jobPath.length > 0 && (
                          <Box>
                            <Box className="text-gray-600 font-medium text-xs">
                              Act Arr at :&nbsp;
                              {(() => {
                                const timestamp =
                                  jobStops[jobStops.length - 1].startTime;

                                return timestamp
                                  ? dayjs(timestamp)
                                      .tz("Asia/Kolkata")
                                      .format("YYYY-MM-DD HH:mm:ss")
                                  : "N/A";
                              })()}
                            </Box>
                            <Box className="text-gray-600 font-medium text-xs">
                              Act Dept at : &nbsp;
                              {(() => {
                                const timestamp =
                                  jobStops[jobStops.length - 1].endTime;

                                return timestamp
                                  ? dayjs(timestamp)
                                      .tz("Asia/Kolkata")
                                      .format("YYYY-MM-DD HH:mm:ss")
                                  : "N/A";
                              })()}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box className="text-gray-600 font-medium text-xs">
                        Sch Arr at :&nbsp;
                        {jobDetails && jobDetails.Arr ? jobDetails.Arr : ""}
                      </Box>
                    )}
                  </StepContent>
                </Step>
                {jobDetails.TripType === 2 && (
                  <Step active={true}>
                    <StepLabel>
                      <Box className="text-sm font-semibold text-green-700">
                        {jobDetails ? jobDetails.SourceCity : ""}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Box className="text-gray-600 font-medium text-xs">
                        Sch Arr at :&nbsp;
                        {jobDetails &&
                        jobDetails.Arr &&
                        jobDetails.Arr.split(",")[1]
                          ? jobDetails.Arr.split(",")[1].trim()
                          : jobDetails.Arr}
                      </Box>
                    </StepContent>
                  </Step>
                )}
              </Stepper>
            </Box>
          ) : (
            <Box className="flex flex-col items-center">
              <Stepper orientation="vertical">
                <Step active={true}>
                  <StepLabel>
                    <Box className="text-sm font-semibold text-green-700">
                      {jobDetails ? jobDetails.SourceCity : ""}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box className="text-gray-600 font-medium text-xs">
                      Sch Dept time :&nbsp;
                      {jobDetails ? jobDetails.Job_Departure : ""}
                    </Box>
                    {jobPath.length > 0 && (
                      <Box className="text-gray-600 font-medium text-xs">
                        Act Dept time :&nbsp;
                        {(() => {
                          const timestamp =
                            jobStops.length === 0
                              ? jobPath[0]?.createdAt
                              : jobStops[0]?.endTime;

                          return timestamp
                            ? dayjs(timestamp)
                                .tz("Asia/Kolkata")
                                .format("YYYY-MM-DD HH:mm:ss")
                            : "N/A";
                        })()}
                      </Box>
                    )}
                  </StepContent>
                </Step>

                <Step active={true}>
                  <StepLabel>
                    <Box className="text-sm font-semibold text-green-700">
                      {jobDetails ? jobDetails.DestCity : ""}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    {jobDetails.TripType === 2 ? (
                      <Box>
                        <Box className="text-gray-600 font-medium text-xs">
                          Sch Arr time : &nbsp;
                          {jobDetails &&
                          jobDetails.Arr &&
                          jobDetails.Arr.split(",")[1]
                            ? jobDetails.Arr.split(",")[1].trim()
                            : jobDetails.Arr}
                        </Box>
                        {jobStops.length > 0 && (
                          <Box className="text-gray-600 font-medium text-xs">
                            Act Arr time : &nbsp;
                            {(() => {
                              const timestamp =
                                jobPath[jobPath.length - 1].createdAt;

                              return timestamp
                                ? dayjs(timestamp)
                                    .tz("Asia/Kolkata")
                                    .format("YYYY-MM-DD HH:mm:ss")
                                : "N/A";
                            })()}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box className="text-gray-600 font-medium text-xs">
                        Arr at :&nbsp;
                        {jobDetails && jobDetails.Arr ? jobDetails.Arr : ""}
                      </Box>
                    )}
                  </StepContent>
                </Step>

                {jobDetails.TripType === 2 && (
                  <Step active={true}>
                    <StepLabel>
                      <Box className="text-sm font-semibold text-green-700">
                        {jobDetails ? jobDetails.SourceCity : ""}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Box className="text-gray-600 font-medium text-xs">
                        Sch Arr at :&nbsp;
                        {jobDetails &&
                        jobDetails.Arr &&
                        jobDetails.Arr.split(",")[1]
                          ? jobDetails.Arr.split(",")[1].trim()
                          : jobDetails.Arr}
                      </Box>
                    </StepContent>
                  </Step>
                )}
              </Stepper>
            </Box>
          )
        ) : (
          <Box className="grid min-h-full place-items-center">
            <Box className="text-center">
              <Commet color="#fc7d32" size="medium" text="" textColor="" />
              <Typography variant="h6" color="primary">
                Loading...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AtoB_Path;
