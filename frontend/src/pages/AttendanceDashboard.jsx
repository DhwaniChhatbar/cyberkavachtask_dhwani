import React, { useEffect, useState } from "react";
import AttendanceStats from "../components/module4/AttendanceStats";
import AttendanceTable from "../components/module4/AttendanceTable";
import socket from "../socket";

const AttendanceDashboard = () => {
  const eventId = "event123";

  const [stats, setStats] = useState({
    checkedIn: 20,
    checkedOut: 5,
    pending: 10,
    total: 35,
  });

  const [search, setSearch] = useState("");

  const [attendanceData, setAttendanceData] = useState([
    {
      name: "Cyber Warriors",
      checkIn: "10:00 AM",
      checkOut: "-",
      status: "checked-in",
    },
    {
      name: "Code Titans",
      checkIn: "10:15 AM",
      checkOut: "4:00 PM",
      status: "checked-out",
    },
  ]);

  useEffect(() => {
    socket.emit("join-event", eventId);

    socket.on("checkin", (attendance) => {
      setStats((prev) => ({
        ...prev,
        checkedIn: prev.checkedIn + 1,
      }));

      setAttendanceData((prev) => [
        ...prev,
        {
          name: attendance.team || attendance.member || "New Entry",
          checkIn: new Date().toLocaleTimeString(),
          checkOut: "-",
          status: "checked-in",
        },
      ]);
    });

    socket.on("checkout", () => {
      setStats((prev) => ({
        ...prev,
        checkedOut: prev.checkedOut + 1,
      }));
    });

    return () => {
      socket.off("checkin");
      socket.off("checkout");
    };
  }, []);

  const attendanceRate =
    stats.total > 0
      ? Math.round(
          ((stats.checkedIn + stats.checkedOut) / stats.total) * 100
        )
      : 0;

  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          Attendance Dashboard
        </h1>

        <button
          onClick={() =>
            window.open(
              `http://localhost:5000/api/attendance/report/${eventId}`
            )
          }
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white font-semibold shadow-lg transition"
        >
          📥 Download CSV Report
        </button>
      </div>

      <AttendanceStats
        checkedIn={stats.checkedIn}
        checkedOut={stats.checkedOut}
        pending={stats.pending}
        total={stats.total}
      />

      <div className="bg-gray-900 rounded-xl p-4 mt-6 mb-6">
        <h2 className="text-white text-xl font-semibold mb-2">
          Attendance Rate
        </h2>

        <p className="text-4xl font-bold text-green-400">
          {attendanceRate}%
        </p>
      </div>

      <input
        type="text"
        placeholder="🔍 Search team/member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-900 text-white outline-none mb-6"
      />

      <AttendanceTable data={filteredData} />
    </div>
  );
};

export default AttendanceDashboard;