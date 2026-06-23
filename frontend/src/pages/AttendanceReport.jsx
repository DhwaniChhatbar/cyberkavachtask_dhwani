import React, { useEffect, useState } from "react";
import api from "../utils/api";
import MemberAttendanceCard from "../components/module4/MemberAttendanceCard";

const AttendanceReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with actual event ID source
  const eventId = "event123";

  useEffect(() => {
    fetchAttendanceReport();
  }, []);

  const fetchAttendanceReport = async () => {
    try {
      const res = await api.get(
        `/attendance/event/${eventId}`
      );

      setAttendance(res.data || []);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Attendance Report
        </h1>

        <button
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_URL}/api/attendance/report/${eventId}`,
              "_blank"
            )
          }
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white font-semibold"
        >
          Download CSV
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">
          Loading attendance report...
        </div>
      ) : attendance.length === 0 ? (
        <div className="text-gray-400">
          No attendance records found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {attendance.map((record) => (
            <MemberAttendanceCard
              key={record._id}
              name={
                record.team?.teamName ||
                record.member?.name ||
                "Unknown"
              }
              email={record.member?.email || "N/A"}
              status={record.status}
              checkIn={
                record.checkInTime
                  ? new Date(
                      record.checkInTime
                    ).toLocaleString()
                  : "-"
              }
              checkOut={
                record.checkOutTime
                  ? new Date(
                      record.checkOutTime
                    ).toLocaleString()
                  : "-"
              }
              durationMinutes={
                record.durationMinutes || 0
              }
              lateFlag={record.lateFlag}
              earlyExitFlag={record.earlyExitFlag}
              certificateGenerated={
                record.certificateGenerated
              }
              pointsAwarded={record.pointsAwarded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;