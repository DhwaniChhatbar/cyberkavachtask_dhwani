import PDFDocument from "pdfkit";

export const generatePDF = (
  data,
  res,
  title = "CyberKavach Analytics Report",
  filename = "analytics-report.pdf"
) => {
  try {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );

    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .text(title, {
        align: "center",
      });

    doc.moveDown(2);

    // Timestamp
    doc
      .fontSize(10)
      .text(
        `Generated on: ${new Date().toLocaleString()}`,
        {
          align: "right",
        }
      );

    doc.moveDown();

    // Array of objects
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        doc
          .fontSize(14)
          .fillColor("#1E40AF")
          .text(`Record ${index + 1}`);

        doc.moveDown(0.3);

        Object.entries(item).forEach(([key, value]) => {
          doc
            .fontSize(12)
            .fillColor("black")
            .text(
              `${key}: ${
                value !== undefined && value !== null
                  ? value
                  : "N/A"
              }`
            );
        });

        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
      });
    }

    // Single object
    else if (typeof data === "object" && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        doc
          .fontSize(12)
          .fillColor("black")
          .text(
            `${key}: ${
              value !== undefined && value !== null
                ? value
                : "N/A"
            }`
          );
      });
    }

    else {
      doc.fontSize(12).text("No data available.");
    }

    doc.end();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
      error: err.message,
    });
  }
};