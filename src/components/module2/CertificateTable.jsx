import React from "react";

const CertificateTable = ({ certificates }) => {
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
          {certificates.map((certificate) => (
            <tr
              key={certificate._id}
              className="border-b border-gray-800"
            >
              <td className="p-4">
                {certificate.certificateId}
              </td>

              <td className="p-4">
                {certificate.eventName}
              </td>

              <td className="p-4">
                {certificate.user?.name}
              </td>

              <td className="p-4">
                {new Date(
                  certificate.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;