import React from "react";

const VerifyResultCard = ({ certificate }) => {
  if (!certificate) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 text-white border border-gray-800">
        <h2 className="text-xl font-bold text-red-400">
          Certificate not found
        </h2>
      </div>
    );
  }

  // 🔥 SAFE DATE HANDLING
  const issuedDate =
    certificate.createdAt && !isNaN(new Date(certificate.createdAt))
      ? new Date(certificate.createdAt).toLocaleDateString()
      : "N/A";

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white border border-gray-800">

      <h2 className="text-2xl font-bold text-green-400 mb-6">
        Certificate Verified ✅
      </h2>

      <div className="space-y-3">

        <p>
          <strong>Name:</strong>{" "}
          {certificate.displayName ||
            certificate.user?.name ||
            certificate.team?.name ||
            "Unknown Participant"}
        </p>

        <p>
          <strong>Event:</strong>{" "}
          {certificate.eventName || "N/A"}
        </p>

        <p>
          <strong>Certificate ID:</strong>{" "}
          {certificate.certificateId || "N/A"}
        </p>

        <p>
          <strong>Issued By:</strong>{" "}
          {certificate.issuedBy?.name || "N/A"}
        </p>

        <p>
          <strong>Certificate Type:</strong>{" "}
          {certificate.type || "Participation"}
        </p>

        <p>
          <strong>Issued Date:</strong>{" "}
          {issuedDate}
        </p>

      </div>
    </div>
  );
};

export default VerifyResultCard;