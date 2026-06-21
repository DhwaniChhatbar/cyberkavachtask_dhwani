import { Parser } from "json2csv";

export const generateCSV = (
  data,
  res,
  filename = "analytics-report.csv"
) => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data available for CSV export",
      });
    }

    const fields = Object.keys(data[0]);

    const parser = new Parser({ fields });

    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );

    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate CSV",
      error: err.message,
    });
  }
};