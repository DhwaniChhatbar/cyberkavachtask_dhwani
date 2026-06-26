import React, { useEffect, useState } from "react";
import AttendanceStats from "../components/module4/AttendanceStats";
import AttendanceTable from "../components/module4/AttendanceTable";
import socket from "../socket";
import api from "../utils/api";
import ManualEntry from "../components/module4/ManualEntry";

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
    total: 0,
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(""); // now = collegeId
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH EVENTS (collegeId based)
  // ==========================
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");

      const eventList = res.data.events || res.data || [];

      setEvents(eventList);

      if (eventList.length > 0 && !eventId) {
        setEventId(eventList[0].collegeId || eventList[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // FETCH STATS
  // ==========================
  const fetchStats = async () => {
    if (!eventId) return;

    try {
      const res = await api.get(
        `/attendance/dashboard/${eventId}`
      );

      setStats({
        checkedIn: res.data.checkedIn || 0,
        checkedOut: res.data.checkedOut || 0,
        total: res.data.total || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // FETCH ATTENDANCE (collegeId mapping)
  // ==========================
  const fetchAttendance = async () => {
    if (!eventId) return;

    try {
      const res = await api.get(
        `/attendance/event/${eventId}`
      );

      const records = res.data.attendance || [];

      const formatted = records.map((item) => ({
        id: item._id,

        name: item.fullName || "Unknown",

        email: item.email || "-",

        collegeId: item.collegeId || "-",

        department: item.department || "-",

        institute: item.institute || "-",

        team: item.team || "-",

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD EVENTS
  // ==========================
  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================
  // EVENT CHANGE (collegeId based socket room)
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
  // SEARCH
  // ==========================
  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

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
              <option
                key={event._id}
                value={event._id}
              >
                {event.name}
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
              Download CSV
            </button>
          )}
        </div>
      </div>

      <AttendanceStats {...stats} />

      {canManageAttendance && eventId && (
        <div className="mt-6">
          <ManualEntry
            eventId={eventId}
            refreshAttendance={() => {
              fetchStats();
              fetchAttendance();
            }}
          />
        </div>
      )}

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search participant..."
          className="w-full p-4 rounded-xl bg-gray-900 text-white outline-none"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-gray-400">Loading attendance...</div>
        ) : (
          <>
            <AttendanceTable data={filteredData} />
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;