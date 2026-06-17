import { Parser } from "json2csv";

export const generateAttendanceCSV = (attendanceData) => {
  const fields = [
    "name",
    "checkInTime",
    "checkOutTime",
    "status",
  ];

  const parser = new Parser({ fields });

  return parser.parse(attendanceData);
};