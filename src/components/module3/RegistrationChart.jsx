import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RegistrationChart = ({ data }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-6">
        Registrations Over Time
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#444" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#3b82f6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegistrationChart;