import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const TeamSizeChart = ({ data = [] }) => {
  // sanitize data to avoid crashes
  const safeData = Array.isArray(data)
    ? data
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          name: item.name || "Unknown",
          value: Number(item.value) || 0,
        }))
    : [];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-6">
        Team Size Distribution
      </h2>

      {safeData.length === 0 ? (
        <div className="text-gray-400 text-center py-10">
          No team data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={safeData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {safeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TeamSizeChart;