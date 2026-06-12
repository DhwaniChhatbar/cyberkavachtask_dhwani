import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";

const RequestCard = ({ request, onApprove, onReject }) => {
  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-5 text-white border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">
            {request.title}
          </h2>

          <p className="text-gray-400 mt-2">
            {request.description}
          </p>
        </div>

        <StatusBadge status={request.status} />
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Created:
        {" "}
        {new Date(request.createdAt).toLocaleString()}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        {onApprove && (
          <button
            onClick={() => onApprove(request._id)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Approve
          </button>
        )}

        {onReject && (
          <button
            onClick={() => onReject(request._id)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Reject
          </button>
        )}

        <Link
          to={`/request-details/${request._id}`}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RequestCard;