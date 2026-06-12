import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

const TeamSizeChart = ({ data }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-6">
        Team Size Distribution
      </h2>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </div>
  );
};

export default TeamSizeChart;