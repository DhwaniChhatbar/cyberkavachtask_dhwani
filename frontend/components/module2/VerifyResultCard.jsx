import React from "react";

const VerifyResultCard = ({ certificate }) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white border border-gray-800">

      <h2 className="text-2xl font-bold text-green-400 mb-4">
        Certificate Verified ✅
      </h2>

      <div className="space-y-2">

        <p>
          <strong>Name:</strong>{" "}
          {certificate.user?.name}
        </p>

        <p>
          <strong>Event:</strong>{" "}
          {certificate.eventName}
        </p>

        <p>
          <strong>Certificate ID:</strong>{" "}
          {certificate.certificateId}
        </p>

        <p>
          <strong>Issued:</strong>{" "}
          {new Date(
            certificate.createdAt
          ).toLocaleDateString()}
        </p>

      </div>
    </div>
  );
};

export default VerifyResultCard;