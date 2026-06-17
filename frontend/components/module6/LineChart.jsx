import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ stats }) => {
  const data = {
    labels: [
      "Pending",
      "Under Review",
      "Approved",
      "Rejected",
    ],
    datasets: [
      {
        label: "Request Status",
        data: [
          stats.pendingRequests,
          stats.underReviewRequests,
          stats.approvedRequests,
          stats.rejectedRequests,
        ],
        tension: 0.4,
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
        Request Analytics
      </h2>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;