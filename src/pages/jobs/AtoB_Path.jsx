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

const AtoB_Path = ({ jobTouchPoint, jobDetails }) => {
  return (
    <Box className="w-[400px] h-[420px] overflow-y-auto rounded-lg shadow-lg relative p-4">
      <Box className="flex justify-center">
        {jobDetails !== null || undefined ? (
          jobTouchPoint[0].Id !== null ? (
            <Box>
              <Stepper orientation="vertical" sx={{}}>
                <Step active={true}>
                  <StepLabel>
                    <Box className="text-sm font-semibold text-green-700">
                      {jobDetails ? jobDetails.SourceCity : ""}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box className="text-gray-600 font-medium text-xs">
                      Job Start:
                      {jobDetails ? jobDetails.Job_Departure : ""}
                    </Box>
                  </StepContent>
                </Step>

                {jobTouchPoint.map((stop, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>
                      <Box className="text-sm font-semibold text-green-700">
                        {stop.TouchPoint}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Box className="text-gray-600 font-medium text-xs">
                        <Box>Sch Arr: {stop.ShuArr}</Box>
                        <Box>Sch Dept: {stop.ShuDept}</Box>
                      </Box>
                      <Box className="text-gray-600 font-medium text-xs">
                        <Box>
                          Act Arr: {stop.Indate} {stop.Intime}
                        </Box>
                        <Box>
                          Act Dept: {stop.OutDate} {stop.OutTime}
                        </Box>
                      </Box>
                    </StepContent>
                  </Step>
                ))}

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
                          Arr at :
                          {jobDetails &&
                          jobDetails.Arr &&
                          jobDetails.Arr.split(",")[0]
                            ? jobDetails.Arr.split(",")[0].trim()
                            : jobDetails.Arr}
                        </Box>
                        <Box className="text-gray-600 font-medium text-xs">
                          Dept at :
                          {jobDetails &&
                          jobDetails.Dept &&
                          jobDetails.Dept.split(",")[1]
                            ? jobDetails.Dept.split(",")[1].trim()
                            : jobDetails.Dept}
                        </Box>
                      </Box>
                    ) : (
                      <Box className="text-gray-600 font-medium text-xs">
                        Arr at :
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
                        Arr at :
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
                      Job Start: {jobDetails ? jobDetails.Job_Departure : ""}
                    </Box>
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
                          Arr at :
                          {jobDetails &&
                          jobDetails.Arr &&
                          jobDetails.Arr.split(",")[0]
                            ? jobDetails.Arr.split(",")[0].trim()
                            : jobDetails.Arr}
                        </Box>
                        <Box className="text-gray-600 font-medium text-xs">
                          Dept at :
                          {jobDetails &&
                          jobDetails.Dept &&
                          jobDetails.Dept.split(",")[1]
                            ? jobDetails.Dept.split(",")[1].trim()
                            : jobDetails.Dept}
                        </Box>
                      </Box>
                    ) : (
                      <Box className="text-gray-600 font-medium text-xs">
                        Arr at :
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
                        Arr at :
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
