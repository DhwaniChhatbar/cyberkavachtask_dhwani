import React from "react";
import { FaDownload } from "react-icons/fa";

const CertificateTable = ({ certificates = [] }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
      <table className="w-full text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-4 text-left">Certificate ID</th>
            <th className="p-4 text-left">Event</th>
            <th className="p-4 text-left">Recipient</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Issued Date</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {certificates.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="p-8 text-center text-gray-400"
              >
                No certificates found
              </td>
            </tr>
          ) : (
            certificates.map((certificate) => (
              <tr
                key={certificate._id}
                className="border-b border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="p-4 font-mono text-blue-400">
                  {certificate.certificateId || "N/A"}
                </td>

                <td className="p-4">
                  {certificate.eventName || "N/A"}
                </td>

                <td className="p-4">
                  {certificate.user?.name || "Unknown User"}
                </td>

                <td className="p-4">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {certificate.type || "Participation"}
                  </span>
                </td>

                <td className="p-4">
                  {certificate.createdAt
                    ? new Date(
                        certificate.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>

                <td className="p-4 text-center">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                    onClick={() =>
                      window.open(
                        `/verify-certificate/${certificate.certificateId}`,
                        "_blank"
                      )
                    }
                  >
                    <FaDownload />
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;