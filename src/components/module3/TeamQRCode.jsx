import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const TeamQRCode = ({ teamId, teamName }) => {
  const qrRef = useRef(null);

  // Download QR as image
  const downloadQR = () => {
    const svg = qrRef.current;

    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `${teamId}-QR.png`;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(svgData);
  };

  return (
    <div className="bg-gray-900 p-5 rounded-2xl flex flex-col items-center">

      <h2 className="text-xl font-bold mb-4">
        Team QR Code
      </h2>

      {/* QR CODE */}
      <div ref={qrRef}>
        <QRCodeSVG value={teamId} size={180} />
      </div>

      {/* Info */}
      <p className="mt-4 text-gray-400 text-sm">
        Team: {teamName}
      </p>

      <p className="text-gray-500 text-xs">
        ID: {teamId}
      </p>

      {/* Download Button */}
      <button
        onClick={downloadQR}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
      >
        Download QR
      </button>

    </div>
  );
};

export default TeamQRCode;