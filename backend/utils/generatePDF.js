import PDFDocument from "pdfkit";

export const generatePDF = (stats, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=analytics-report.pdf"
  );

  doc.pipe(res);

  doc.fontSize(20).text("CyberKavach Analytics Report", {
    align: "center",
  });

  doc.moveDown();

  Object.entries(stats).forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: ${value}`);
  });

  doc.end();
};