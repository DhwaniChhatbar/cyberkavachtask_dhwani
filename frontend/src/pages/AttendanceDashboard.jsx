import React, { useEffect, useState } from "react";
import AttendanceStats from "../components/module4/AttendanceStats";
import AttendanceTable from "../components/module4/AttendanceTable";
import ManualEntry from "../components/module4/ManualEntry";
import socket from "../socket";
import api from "../utils/api";

const AttendanceDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const canManageAttendance = [
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
  ].includes(user?.role);

  const [stats, setStats] = useState({
    checkedIn: 0,
    checkedOut: 0,
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

      if (eventList.length && !eventId) {
        setEventId(eventList[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // FETCH DASHBOARD STATS
  // ==========================
  const fetchStats = async () => {
    if (!eventId) return;

    try {
      const res = await api.get(`/attendance/dashboard/${eventId}`);

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
  // FETCH ATTENDANCE
  // ==========================
  const fetchAttendance = async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      const res = await api.get(`/attendance/event/${eventId}`);

      const records = res.data.attendance || [];

      const formatted = records.map((item) => ({
        id: item._id,
        name: item.fullName,
        collegeId: item.collegeId,
        department: item.department,
        institute: item.institute,
        team: item.team,
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
  // CSV DOWNLOAD (FIXED)
  // ==========================
  const downloadCSV = async () => {
    try {
      const res = await api.get(
        `/attendance/report/${eventId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance-report.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV download failed:", err);
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
      socket.emit("leave-event", eventId);

      socket.off("attendance:checkin", refresh);
      socket.off("attendance:checkout", refresh);
      socket.off("attendance:completed", refresh);
    };
  }, [eventId]);

  // ==========================
  // SEARCH
  // ==========================
  const filteredAttendance = attendanceData.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.collegeId?.toLowerCase().includes(keyword) ||
      item.team?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          Attendance Dashboard
        </h1>

        <div className="flex gap-3 flex-wrap">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="bg-gray-900 text-white px-4 py-3 rounded-xl"
          >
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>

          {canManageAttendance && eventId && (
            <button
              onClick={downloadCSV}
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
          type="text"
          placeholder="Search by Name, College ID or Team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 text-white p-4 rounded-xl outline-none"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-gray-400">Loading attendance...</div>
        ) : (
          <AttendanceTable
            data={filteredAttendance}
            eventId={eventId}
            refreshAttendance={() => {
              fetchStats();
              fetchAttendance();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;