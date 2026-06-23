import React, { useEffect, useState } from "react";
import api from "../utils/api";

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const res = await api.get("/attendance/my");

      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        My Attendance
      </h1>

      {loading ? (
        <div className="text-gray-400">Loading attendance...</div>
      ) : attendance.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-2xl text-gray-400">
          No attendance records found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {attendance.map((record) => (
            <div
              key={record._id}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                {record.event?.name || "Unknown Event"}
              </h2>

              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {record.role}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      record.status === "checked-in"
                        ? "text-green-400"
                        : record.status === "checked-out"
                        ? "text-blue-400"
                        : record.status === "completed"
                        ? "text-purple-400"
                        : "text-red-400"
                    }`}
                  >
                    {record.status}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Check In:</span>{" "}
                  {record.checkInTime
                    ? new Date(record.checkInTime).toLocaleString()
                    : "-"}
                </p>

                <p>
                  <span className="font-semibold">Check Out:</span>{" "}
                  {record.checkOutTime
                    ? new Date(record.checkOutTime).toLocaleString()
                    : "-"}
                </p>

                <p>
                  <span className="font-semibold">
                    Duration:
                  </span>{" "}
                  {record.durationMinutes || 0} min
                </p>

                <p>
                  <span className="font-semibold">
                    Certificate:
                  </span>{" "}
                  {record.certificateGenerated ? (
                    <span className="text-green-400">Yes</span>
                  ) : (
                    <span className="text-red-400">No</span>
                  )}
                </p>

                <p>
                  <span className="font-semibold">
                    Points:
                  </span>{" "}
                  {record.pointsAwarded ? (
                    <span className="text-green-400">Yes</span>
                  ) : (
                    <span className="text-red-400">No</span>
                  )}
                </p>

                {record.lateFlag && (
                  <p className="text-yellow-400 font-semibold">
                    Late Entry
                  </p>
                )}

                {record.earlyExitFlag && (
                  <p className="text-red-400 font-semibold">
                    Early Exit
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAttendance;