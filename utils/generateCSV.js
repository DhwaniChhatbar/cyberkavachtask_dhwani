import { Parser } from "json2csv";

export const generateCSV = (data, res) => {
  const fields = ["Metric", "Value"];

  const parser = new Parser({ fields });

  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment("analytics-report.csv");

  return res.send(csv);
};