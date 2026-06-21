import React from "react";

const CertificateTable = ({ certificates = [] }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-2xl">
      <table className="w-full text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-4 text-left">Certificate ID</th>
            <th className="p-4 text-left">Event</th>
            <th className="p-4 text-left">Recipient</th>
            <th className="p-4 text-left">Issued Date</th>
          </tr>
        </thead>

        <tbody>
          {certificates.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-6 text-center text-gray-400"
              >
                No certificates found
              </td>
            </tr>
          ) : (
            certificates.map((certificate) => (
              <tr
                key={certificate._id}
                className="border-b border-gray-800"
              >
                <td className="p-4">
                  {certificate.certificateId || "N/A"}
                </td>

                <td className="p-4">
                  {certificate.eventName || "N/A"}
                </td>

                <td className="p-4">
                  {certificate.user?.name || "Unknown User"}
                </td>

                <td className="p-4">
                  {certificate.createdAt
                    ? new Date(
                        certificate.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
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