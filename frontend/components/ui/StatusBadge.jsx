import React from "react";

const StatusBadge = ({ status }) => {
  let color = "bg-gray-600";

  switch (status?.toLowerCase()) {
    case "approved":
      color = "bg-green-600";
      break;

    case "rejected":
      color = "bg-red-600";
      break;

    case "pending":
      color = "bg-yellow-500";
      break;

    case "under review":
      color = "bg-blue-600";
      break;

    default:
      color = "bg-gray-600";
  }

  return (
    <span
      className={`${color} px-3 py-1 rounded-full text-xs font-semibold text-white`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;