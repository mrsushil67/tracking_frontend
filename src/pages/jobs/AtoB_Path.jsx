import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

const AtoB_Path = ({ jobTouchPoint, jobDetails }) => {
  const stopsRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    if (stopsRef.current) {
      if (jobTouchPoint.length < 5) {
        setLineHeight(350);
      } else {
        // setLineHeight((jobTouchPoint.length)*100)
        setLineHeight(stopsRef.current.scrollHeight);
      }
    }
  }, [jobTouchPoint]);

  return (
    <div className="w-[400px] h-[420px] overflow-y-auto rounded-lg shadow-lg relative">
      {jobDetails !== null || undefined ? (
        jobTouchPoint[0].Id !== null ? (
          <div>
            <div className="flex flex-col justify-center items-center">
              <div className="font-bold">
                {jobDetails ? jobDetails.SourceCity : ""}
              </div>
              <div className="text-xs text-gray-500">
                Job Start : {jobDetails ? jobDetails.Job_Start : ""}
              </div>
            </div>
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-500"
              style={{ height: `${lineHeight}px` }}
            ></div>

            <div ref={stopsRef} className="relative">
              {jobTouchPoint.map((stop, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-center relative"
                  style={
                    jobTouchPoint.length <= 4
                      ? { height: `${lineHeight / jobTouchPoint.length - 1}px` }
                      : { marginTop: "3rem", marginBottom: "3rem" }
                  }
                >
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-1/2 text-right pr-3">
                        <h3 className="text-sm font-bold text-green-700">
                          {stop.TouchPoint}
                        </h3>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Sch Arr:</span>{" "}
                          {stop.ShuArr}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Sch Dept:</span>{" "}
                          {stop.ShuDept}
                        </p>
                      </div>
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-500"
                        style={{ height: `100px` }}
                      ></div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 bg-white border-2 border-green-500 rounded-full"></div>
                      </div>
                      <div className="w-1/2 text-left pl-3">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Act Arr:</span>{" "}
                          {stop.Indate} {stop.Intime}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Act Dept:</span>{" "}
                          {stop.OutDate} {stop.OutTime}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-1/2 text-right pr-3">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Act Arr:</span>{" "}
                          {stop.Indate} {stop.Intime}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Act Dept:</span>{" "}
                          {stop.OutDate} {stop.OutTime}
                        </p>
                      </div>
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-500"
                        style={{ height: `100px` }}
                      ></div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 bg-white border-2 border-green-500 rounded-full"></div>
                      </div>
                      <div className="w-1/2 text-left pl-3">
                        <h3 className="text-sm font-bold text-green-700">
                          {stop.TouchPoint}
                        </h3>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Sch Arr:</span>{" "}
                          {stop.ShuArr}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Sch Dept:</span>{" "}
                          {stop.ShuDept}
                        </p>
                      </div>
                    </>
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
              <div className="flex flex-col justify-center items-center">
                <div className="font-bold">
                  {jobDetails ? jobDetails.SourceCity : ""}
                </div>
                <div className="text-xs text-gray-500">
                  Job Start : {jobDetails ? jobDetails.Job_Start : ""}
                </div>
              </div>
            </div>
            <div className="relative flex flex-col items-center">
              <div
                className="w-1 bg-green-500"
                style={{ height: "320px" }}
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
