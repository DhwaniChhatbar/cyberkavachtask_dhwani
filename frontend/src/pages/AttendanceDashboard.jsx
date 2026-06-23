import React, { useEffect, useMemo, useState } from "react";
import AttendanceStats from "../components/module4/AttendanceStats";
import AttendanceTable from "../components/module4/AttendanceTable";
import socket from "../socket";
import api from "../utils/api";

const AttendanceDashboard = () => {
  // ⚠️ later replace with dynamic eventId from route
  const eventId = "event123";

  const [stats, setStats] = useState({
    checkedIn: 0,
    checkedOut: 0,
    pending: 0,
    total: 0,
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH STATS
  // ==========================
  const fetchStats = async () => {
    try {
      const res = await api.get(`/attendance/dashboard/${eventId}`);

      setStats({
        checkedIn: res.data.checkedIn || 0,
        checkedOut: res.data.checkedOut || 0,
        pending: res.data.pending || 0,
        total: res.data.total || 0,
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // ==========================
  // FETCH ATTENDANCE LIST
  // ==========================
  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/event/${eventId}`);

      const formatted = (res.data || []).map((item) => ({
        name: item.team?.teamName || item.member?.name || "Unknown",
        email: item.member?.email || "-",
        checkIn: item.checkInTime
          ? new Date(item.checkInTime).toLocaleString()
          : "-",
        checkOut: item.checkOutTime
          ? new Date(item.checkOutTime).toLocaleString()
          : "-",
        status: item.status,
      }));

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Attendance error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SOCKET HANDLING
  // ==========================
  useEffect(() => {
    socket.emit("join-event", eventId);

    const refresh = () => {
      fetchStats();
      fetchAttendance();
    };

    socket.on("attendance:checkin", refresh);
    socket.on("attendance:checkout", refresh);
    socket.on("attendance:completed", refresh);

    return () => {
      socket.off("attendance:checkin", refresh);
      socket.off("attendance:checkout", refresh);
      socket.off("attendance:completed", refresh);
    };
  }, []);

  // initial load
  useEffect(() => {
    fetchStats();
    fetchAttendance();
  }, []);

  // ==========================
  // ATTENDANCE RATE
  // ==========================
  const attendanceRate = useMemo(() => {
    if (!stats.total) return 0;
    return Math.round(
      ((stats.checkedIn + stats.checkedOut) / stats.total) * 100
    );
  }, [stats]);

  // ==========================
  // SEARCH FILTER
  // ==========================
  const filteredData = useMemo(() => {
    return attendanceData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendanceData, search]);

  return (
    <div className="min-h-screen bg-gray-950 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          Attendance Dashboard
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
          📥 Download CSV
        </button>
      </div>

      {/* STATS */}
      <AttendanceStats {...stats} />

      {/* RATE */}
      <div className="bg-gray-900 rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          Attendance Rate
        </h2>
        <div className="text-5xl font-bold text-green-400">
          {attendanceRate}%
        </div>
      </div>

      {/* SEARCH */}
      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search team/member..."
          className="w-full p-4 rounded-xl bg-gray-900 text-white outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="mt-6">
        {loading ? (
          <div className="text-gray-400">Loading attendance...</div>
        ) : (
          <AttendanceTable data={filteredData} />
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;