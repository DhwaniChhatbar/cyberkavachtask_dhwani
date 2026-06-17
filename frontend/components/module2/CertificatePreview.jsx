import React from "react";
import { QRCodeSVG } from "qrcode.react";

const CertificatePreview = ({
  name,
  eventName,
  certificateId,
}) => {
  return (
    <div className="bg-white text-black rounded-2xl p-10 shadow-xl border-4 border-blue-600">

      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-blue-700">
        Certificate of Participation
      </h1>

      <div className="mt-10 text-center text-xl">
        This certificate is proudly awarded to
      </div>

      {/* Student Name */}
      <div className="text-4xl font-bold text-center mt-6">
        {name}
      </div>

      <div className="text-center mt-8 text-xl">
        for successfully participating in
      </div>

      {/* Event Name */}
      <div className="text-3xl font-bold text-center mt-4 text-green-700">
        {eventName}
      </div>

      {/* Date */}
      <div className="text-center mt-8 text-gray-600">
        Issued on: {new Date().toLocaleDateString()}
      </div>

      {/* Certificate ID */}
      <div className="text-center mt-3 text-gray-600">
        Certificate ID: {certificateId}
      </div>

      {/* QR Code */}
      <div className="flex justify-center mt-8">
        <QRCodeSVG
          value={`http://localhost:5173/verify-certificate/${certificateId}`}
          size={120}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mt-3">
        Scan to verify certificate
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end mt-16">
        <div>
          <div className="border-t border-black w-40"></div>
          <p className="mt-2 text-center">Organizer Signature</p>
        </div>

        <div>
          <div className="border-t border-black w-40"></div>
          <p className="mt-2 text-center">Faculty Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;