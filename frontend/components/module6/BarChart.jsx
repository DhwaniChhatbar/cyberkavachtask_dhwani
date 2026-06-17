import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ stats }) => {
  const data = {
    labels: [
      "Users",
      "Events",
      "Requests",
      "Certificates",
      "Attendance",
    ],
    datasets: [
      {
        label: "Platform Statistics",
        data: [
          stats.totalUsers,
          stats.totalEvents,
          stats.totalRequests,
          stats.totalCertificates,
          stats.totalAttendanceRecords,
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-white text-2xl font-bold mb-6">
        Platform Overview
      </h2>

      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;