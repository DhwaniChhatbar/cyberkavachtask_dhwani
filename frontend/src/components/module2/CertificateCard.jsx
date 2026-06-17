import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CertificateCard = ({ certificate }) => {
  const downloadPDF = async () => {
    const element = document.getElementById(
      `certificate-${certificate._id}`
    );

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${certificate.certificateId || "certificate"}.pdf`);
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-800">

      {/* Certificate */}
      <div
        id={`certificate-${certificate._id}`}
        className="bg-white text-black p-8 rounded-xl"
      >
        <h2 className="text-2xl font-bold text-center">
          Certificate of Participation
        </h2>

        <p className="text-center mt-6">
          This is to certify that
        </p>

        <h3 className="text-3xl font-bold text-center mt-3">
          {certificate.user?.name || "Unknown User"}
        </h3>

        <p className="text-center mt-6">
          has successfully participated in
        </p>

        <h3 className="text-xl font-semibold text-center mt-3">
          {certificate.eventName || "Event"}
        </h3>

        <p className="text-center mt-6 text-sm">
          Certificate ID: {certificate.certificateId}
        </p>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
      >
        Download PDF
      </button>
    </div>
  );
};

export default CertificateCard;