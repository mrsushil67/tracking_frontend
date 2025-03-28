import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

const AtoB_Path = ({ selectedJob, setLatlongData }) => {
  const stopsRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);
  const [jobTouchPoint, setJobTouchPoint] = useState([]);

  const fetchJobRout = async () => {
    const response = await axios.get(
      `http://103.239.89.132/RCM/VehicleJobListDeatils?id=${selectedJob.id}`
    );
    setLatlongData(response.data.trip);
    setJobDetails(response.data.trip);
    setJobTouchPoint(response.data.touch);
  };

  useEffect(() => {
    fetchJobRout();
  }, [selectedJob]);

  useEffect(() => {
    if (stopsRef.current) {
      setLineHeight(stopsRef.current.scrollHeight);
    }
  }, [jobTouchPoint]);

  return (
    <div className="w-[400px] h-[420px] overflow-y-auto rounded-lg shadow-lg relative">
      {jobDetails !== null || undefined ? (
        jobTouchPoint.length > 0 ? (
          <div>
            <div className="flex justify-center font-bold">
              {jobDetails ? jobDetails.SourceCity : ""}
            </div>
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-500"
              style={{ height: `${lineHeight}px` }}
            ></div>

            <div ref={stopsRef} className="relative">
              {jobTouchPoint.map((stop, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-center my-6 relative"
                >
                  {index % 2 === 0 ? (
                    <div className="w-1/2 text-right pr-3">
                      <h3 className="text-sm font-bold text-green-700">
                        {stop.TouchPoint}
                      </h3>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Lat:</span>{" "}
                        {stop.TouchLat}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Long:</span>{" "}
                        {stop.TouchLong}
                      </p>
                    </div>
                  ) : (
                    <div className="w-1/2"></div>
                  )}

                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-500"
                    style={{ height: `100px` }}
                  ></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-4 h-4 bg-white border-2 border-green-500 rounded-full"></div>
                  </div>

                  {index % 2 !== 0 ? (
                    <div className="w-1/2 text-left pl-3">
                      <h3 className="text-sm font-bold text-green-700">
                        {stop.TouchPoint}
                      </h3>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Lat:</span>{" "}
                        {stop.TouchLat}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Long:</span>{" "}
                        {stop.TouchLong}
                      </p>
                    </div>
                  ) : (
                    <div className="w-1/2"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center font-bold">
              {jobDetails ? jobDetails.DestCity : ""}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="font-bold mb-2">
              {jobDetails ? jobDetails.SourceCity : ""}
            </div>
            <div className="relative flex flex-col items-center">
              <div
                className="w-1 bg-green-500"
                style={{ height: "340px" }}
              ></div>
              <div className="w-4 h-4 bg-white border-2 border-green-500 rounded-full -mt-2"></div>
            </div>
            <div className="font-bold mt-2">
              {jobDetails ? jobDetails.DestCity : ""}
            </div>
          </div>
        )
      ) : (
        <div className="grid min-h-full place-items-center">
          <div className="text-center">
            <Commet color="#fc7d32" size="medium" text="" textColor="" />
            <h1 className="text-[#fc7d32]">Loading...</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtoB_Path;
