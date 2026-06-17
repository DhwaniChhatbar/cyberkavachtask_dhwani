import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 5,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned QR:", decodedText);

        // Later:
        // axios.post("/api/attendance/checkin", {
        //   eventId,
        //   teamId: decodedText,
        // });

        scanner.clear();
      },
      (error) => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        QR Scanner
      </h2>

      <div
        id="reader"
        className="bg-white rounded-lg overflow-hidden"
      ></div>
    </div>
  );
};

export default QRScanner;