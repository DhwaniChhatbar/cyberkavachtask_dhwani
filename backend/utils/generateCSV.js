import { Parser } from "json2csv";

const flattenValue = (value) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return JSON.stringify(value);
  }

  return value;
};

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

    // 🔥 FIX: safer field extraction (handles missing keys across objects)
    const fields = [...new Set(data.flatMap((item) => Object.keys(item)))];

    const safeData = data.map((item) => {
      const obj = {};
      fields.forEach((key) => {
        obj[key] = flattenValue(item[key]);
      });
      return obj;
    });

    const parser = new Parser({ fields });

    const csv = parser.parse(safeData);

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