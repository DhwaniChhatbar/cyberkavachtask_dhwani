import React from "react";
import ManualEntry from "../components/module4/ManualEntry";
import QRScanner from "../components/module4/QRScanner";

const CheckInPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        Event Check-In
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <ManualEntry />
        <QRScanner />
      </div>
    </div>
  );
};

export default CheckInPage;