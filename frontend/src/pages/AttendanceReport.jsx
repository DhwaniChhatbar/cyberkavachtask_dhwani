import React, { useEffect, useState } from "react";
import api from "../utils/api";
import MemberAttendanceCard from "../components/module4/MemberAttendanceCard";

const AttendanceReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH EVENTS
  // ==========================
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");

      const eventList = res.data.events || res.data || [];

      setEvents(eventList);

      if (eventList.length > 0) {
        setEventId(eventList[0]._id);
      }
    } catch (err) {
      console.error("Event fetch error:", err);
    }
  };

  // ==========================
  // FETCH ATTENDANCE
  // ==========================
  useEffect(() => {
    if (eventId) {
      fetchAttendanceReport();
    }
  }, [eventId]);

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/attendance/event/${eventId}`
      );

      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">
          Attendance Report
        </h1>

        <div className="flex gap-4">
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
        </div>
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
              name={record.fullName || "Unknown"}
              email={record.email || "N/A"}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;