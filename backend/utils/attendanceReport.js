import { Parser } from "json2csv";

export const generateAttendanceCSV = (attendanceData = []) => {
  const fields = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Team", value: "team" },
    { label: "Event", value: "event" },
    { label: "Check In Time", value: "checkInTime" },
    { label: "Check Out Time", value: "checkOutTime" },
    { label: "Duration (Minutes)", value: "durationMinutes" },
    { label: "Status", value: "status" },
    { label: "Late", value: "lateFlag" },
    { label: "Early Exit", value: "earlyExitFlag" },
    { label: "Certificate Generated", value: "certificateGenerated" },
    { label: "Points Awarded", value: "pointsAwarded" },
  ];

  const safeData = Array.isArray(attendanceData)
    ? attendanceData.map((record) => ({
        name:
          record.name ||
          record.fullName ||
          record.participantDetails?.fullName ||
          "Unknown",

        email:
          record.email ||
          record.participantDetails?.email ||
          "",

        team:
          record.team?.teamName ||
          record.team ||
          "",

        event:
          record.event?.name ||
          record.event ||
          "",

        checkInTime: record.checkInTime || "",
        checkOutTime: record.checkOutTime || "",
        durationMinutes: record.durationMinutes || 0,

        status: record.status || "",

        lateFlag: record.lateFlag ? "Yes" : "No",
        earlyExitFlag: record.earlyExitFlag ? "Yes" : "No",
        certificateGenerated: record.certificateGenerated ? "Yes" : "No",
        pointsAwarded: record.pointsAwarded ? "Yes" : "No",
      }))
    : [];

  const parser = new Parser({ fields });

  return parser.parse(safeData);
};