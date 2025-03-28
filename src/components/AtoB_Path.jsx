import React, { useRef, useEffect, useState } from "react";

const stops = [
  { name: "Parking Hyderabad", schDept: "2024-10-15T22:06:00.000Z", actDept: "" },
  { name: "Allwyn X Road", schDept: "2024-10-15T22:15:00.000Z", actDept: "" },
  { name: "Kukatpally", schDept: "2024-10-15T22:46:00.000Z", actDept: "" },
  { name: "Miyapur", schDept: "2024-10-15T23:00:00.000Z", actDept: "" },
  { name: "Chandanagar", schDept: "2024-10-15T23:30:00.000Z", actDept: "" },
  { name: "Lingampally", schDept: "2024-10-15T23:45:00.000Z", actDept: "" },
  { name: "BHEL", schDept: "2024-10-16T00:00:00.000Z", actDept: "" },
  { name: "Patancheru", schDept: "2024-10-16T00:15:00.000Z", actDept: "" },
];

const AtoB_Path = () => {
  const stopsRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    if (stopsRef.current) {
      setLineHeight(stopsRef.current.scrollHeight); // Adjust line height dynamically
    }
  }, [stops]);

  return (
    <div className="w-[300px] h-[400px] overflow-y-auto border border-gray-300 rounded-lg shadow-lg p-4 relative">
      {/* ✅ Green Line with Dynamic Height */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-500"
        style={{ height: `${lineHeight}px` }}
      ></div>

      {/* Stops Container (for dynamic height calculation) */}
      <div ref={stopsRef} className="relative">
        {stops.map((stop, index) => (
          <div key={index} className="flex w-full items-center justify-center my-6 relative">
            {/* Left side content */}
            {index % 2 === 0 ? (
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-lg font-bold text-green-700">{stop.name}</h3>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Sch_Dept:</span> {stop.schDept}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Act_Dept:</span> {stop.actDept || "-"}
                </p>
              </div>
            ) : (
              <div className="w-1/2"></div>
            )}

            {/* Timeline Indicator (Dots) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="w-4 h-4 bg-white border-2 border-green-500 rounded-full"></div>
            </div>

            {/* Right side content */}
            {index % 2 !== 0 ? (
              <div className="w-1/2 text-left pl-8">
                <h3 className="text-lg font-bold text-green-700">{stop.name}</h3>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Sch_Dept:</span> {stop.schDept}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Act_Dept:</span> {stop.actDept || "-"}
                </p>
              </div>
            ) : (
              <div className="w-1/2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtoB_Path;
