import React, { useEffect, useMemo, useState } from "react";
import AttendanceStats from "../components/module4/AttendanceStats";
import AttendanceTable from "../components/module4/AttendanceTable";
import socket from "../socket";
import api from "../utils/api";

const AttendanceDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const canManageAttendance = [
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
  ].includes(user?.role);

  const canDownloadReport = canManageAttendance;

  const [stats, setStats] = useState({
    checkedIn: 0,
    checkedOut: 0,
    pending: 0,
    total: 0,
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH EVENTS
  // ==========================
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");

      const eventList = res.data.events || res.data || [];

      setEvents(eventList);

      if (eventList.length > 0 && !eventId) {
        setEventId(eventList[0]._id);
      }
    } catch (err) {
      console.error("Events error:", err);
    }
  };

  // ==========================
  // FETCH STATS
  // ==========================
  const fetchStats = async () => {
    if (!eventId) return;

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
  // FETCH ATTENDANCE
  // ==========================
  const fetchAttendance = async () => {
    if (!eventId) return;

    try {
      const res = await api.get(`/attendance/event/${eventId}`);

      const records = res.data.attendance || res.data || [];

      const formatted = records.map((item) => ({
        id: item._id,
        teamId: item.team?._id,
        memberId: item.member?._id,
        name:
          item.team?.teamName ||
          item.member?.name ||
          item.attendeeName ||
          "Unknown",
        email:
          item.member?.email ||
          item.attendeeEmail ||
          "-",
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
  // CHECK-IN
  // ==========================
  const handleCheckIn = async (row) => {
    try {
      await api.post("/attendance/checkin", {
        eventId,
        teamId: row.teamId,
        memberId: row.memberId,
      });

      fetchStats();
      fetchAttendance();
    } catch (err) {
      console.error("Check-in error:", err);
    }
  };

  // ==========================
  // CHECK-OUT
  // ==========================
  const handleCheckOut = async (row) => {
    try {
      await api.post("/attendance/checkout", {
        eventId,
        teamId: row.teamId,
        memberId: row.memberId,
      });

      fetchStats();
      fetchAttendance();
    } catch (err) {
      console.error("Check-out error:", err);
    }
  };

  // ==========================
  // INITIAL LOAD
  // ==========================
  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================
  // EVENT CHANGE
  // ==========================
  useEffect(() => {
    if (!eventId) return;

    fetchStats();
    fetchAttendance();

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
  }, [eventId]);

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
  // SEARCH
  // ==========================
  const filteredData = useMemo(() => {
    return attendanceData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendanceData, search]);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          Attendance Dashboard
        </h1>

        <div className="flex gap-4 flex-wrap">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="bg-gray-900 text-white px-4 py-3 rounded-xl"
          >
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title || event.name}
              </option>
            ))}
          </select>

          {canDownloadReport && (
            <button
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_API_URL}/attendance/report/${eventId}`,
                  "_blank"
                )
              }
              className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white font-semibold"
            >
              📥 Download CSV
            </button>
          )}
        </div>
      </div>

      <AttendanceStats {...stats} />

      <div className="bg-gray-900 rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          Attendance Rate
        </h2>

        <div className="text-5xl font-bold text-green-400">
          {attendanceRate}%
        </div>
      </div>

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search team/member..."
          className="w-full p-4 rounded-xl bg-gray-900 text-white outline-none"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-gray-400">
            Loading attendance...
          </div>
        ) : (
          <>
            <AttendanceTable data={filteredData} />

            {canManageAttendance && (
              <div className="mt-8 bg-gray-900 rounded-2xl p-6">
                <h2 className="text-2xl text-white font-bold mb-4">
                  Attendance Actions
                </h2>

                <div className="space-y-4">
                  {filteredData.map((row, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 rounded-xl p-4"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {row.name}
                        </p>

                        <p className="text-gray-400 text-sm">
                          {row.status}
                        </p>
                      </div>

                      <div className="flex gap-3 mt-3 md:mt-0">
                        <button
                          onClick={() => handleCheckIn(row)}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
                        >
                          Check In
                        </button>

                        <button
                          onClick={() => handleCheckOut(row)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                        >
                          Check Out
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;