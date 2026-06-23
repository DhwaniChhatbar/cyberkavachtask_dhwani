import React from "react";
import ManualEntry from "../components/module4/ManualEntry";
import QRScanner from "../components/module4/QRScanner";

const CheckInPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Event Check-In
        </h1>

        <p className="text-gray-400 mt-2">
          Check in teams or individual participants using
          manual entry or QR code scanning.
        </p>
      </div>

      {/* CHECK-IN OPTIONS */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* MANUAL ENTRY */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">
            Manual Check-In
          </h2>

          <ManualEntry />
        </div>

        {/* QR SCANNER */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">
            QR Code Check-In
          </h2>

          <QRScanner />
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;