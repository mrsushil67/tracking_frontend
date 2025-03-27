import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const data = [
  { name: "A", value: 400 },
  { name: "B", value: 500 },
  { name: "C", value: 300 },
  { name: "D", value: 600 },
  { name: "E", value: 700 },
];

const AtoB_Path = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />

        {/* Vertical Line at X = "C" */}
        <ReferenceLine x="C" stroke="red" strokeWidth={2} label="Vertical Line" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AtoB_Path;
