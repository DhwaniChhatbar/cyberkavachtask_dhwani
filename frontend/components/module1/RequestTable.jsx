import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";

const RequestTable = ({ requests, onApprove, onReject }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-2xl shadow-lg">
      <table className="w-full text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Created By</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="p-6 text-center text-gray-400"
              >
                No requests found
              </td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr
                key={req._id}
                className="border-b border-gray-800 hover:bg-gray-800"
              >
                <td className="p-4">
                  {req.title}
                </td>

                <td className="p-4">
                  {req.type}
                </td>

                <td className="p-4">
                  <StatusBadge status={req.status} />
                </td>

                <td className="p-4">
                  {req.createdBy?.name || "Unknown"}
                </td>

                <td className="p-4 flex flex-wrap gap-2">
                  {onApprove && (
                    <button
                      onClick={() => onApprove(req._id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}

                  {onReject && (
                    <button
                      onClick={() => onReject(req._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  )}

                  <Link
                    to={`/request-details/${req._id}`}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;