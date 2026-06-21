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

    pdf.save(
      `${certificate.certificateId || "certificate"}.pdf`
    );
  };

  const downloadCSV = () => {
    const csvData = [
      [
        "Certificate ID",
        "User",
        "Event",
        "Issued By",
        "Issued At",
      ],
      [
        certificate.certificateId || "",
        certificate.user?.name || "",
        certificate.eventName || "",
        certificate.issuedBy?.name || "",
        new Date(certificate.createdAt).toLocaleDateString(),
      ],
    ];

    const csvContent = csvData
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${certificate.certificateId}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-800">

      {/* Certificate Preview */}
      <div
        id={`certificate-${certificate._id}`}
        className="bg-white text-black p-10 rounded-xl border-8 border-blue-600"
      >
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Certificate of Participation
        </h1>

        <p className="text-center mt-8 text-lg">
          This certifies that
        </p>

        <h2 className="text-4xl font-bold text-center mt-4">
          {certificate.user?.name || "Unknown User"}
        </h2>

        <p className="text-center mt-8 text-lg">
          has successfully participated in
        </p>

        <h3 className="text-2xl font-semibold text-center mt-3">
          {certificate.eventName}
        </h3>

        <div className="mt-12 flex justify-between text-sm">
          <div>
            <p>
              <strong>Certificate ID:</strong>
            </p>
            <p>{certificate.certificateId}</p>
          </div>

          <div className="text-right">
            <p>
              <strong>Date Issued:</strong>
            </p>
            <p>
              {new Date(
                certificate.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-5">
        <button
          onClick={downloadPDF}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
        >
          Download PDF
        </button>

        <button
          onClick={downloadCSV}
          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;