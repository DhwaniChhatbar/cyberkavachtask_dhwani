import React, { useEffect, useState } from "react";
import api from "../utils/api";

import AnalyticsCard from "../components/module3/AnalyticsCard";
import CapacityIndicator from "../components/module3/CapacityIndicator";
import ParticipantTable from "../components/module3/ParticipantTable";
import EventCard from "../components/module3/EventCard";

const EventDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.trim();

  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [totalCapacity] = useState(100);

  useEffect(() => {
    fetchEvents();

    if (role !== "Member") {
      fetchParticipants();
    }
  }, [role]);

  // =========================
  // EVENTS
  // =========================
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");

      const eventData = Array.isArray(res.data) ? res.data : [];

      setEvents(eventData);
    } catch (err) {
      console.error("EVENT FETCH ERROR:", err);
      setEvents([]);
    }
  };

  // =========================
  // PARTICIPANTS (UNCHANGED SOURCE)
  // =========================
  const fetchParticipants = async () => {
    try {
      const res = await api.get("/attendance/event");

      const data = res.data?.attendance || res.data || [];

      const formatted = data.map((p) => ({
        fullName: p.member?.name || p.fullName || "N/A",
        email: p.member?.email || p.email || "N/A",
        collegeId: p.member?.collegeId || p.collegeId || "N/A",
        department: p.member?.department || p.department || "N/A",
        institute: p.member?.institute || p.institute || "N/A",
        team: p.team?.teamName || p.team || "N/A",
      }));

      setParticipants(formatted);
    } catch (err) {
      console.error("PARTICIPANT FETCH ERROR:", err);
      setParticipants([]);
    }
  };

  // =========================
  // ACTIONS
  // =========================
  const handleSendForApproval = async (id) => {
    try {
      await api.put(`/events/approval/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/events/approve/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/events/publish/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const STATUS = {
    DRAFT: "Draft",
    PENDING: "Pending Faculty Review",
    APPROVED: "Faculty Approved",
    PUBLISHED: "Published",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>

      {role !== "Member" && (
        <>
          <div className="grid md:grid-cols-3 gap-5 mb-8">

            {/* ✅ FIXED: REAL REGISTRATION COUNT FROM EVENTS */}
            <AnalyticsCard
              title="Registrations"
              value={events.reduce(
                (acc, e) => acc + (e.registrations?.length || 0),
                0
              )}
            />

            <AnalyticsCard title="Teams" value={events.length} />

            <AnalyticsCard title="Events" value={events.length} />
          </div>

          <div className="mb-8">
            <CapacityIndicator
              current={participants.length}
              total={totalCapacity}
            />
          </div>
        </>
      )}

      {/* EVENTS */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Events</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id}>
              <EventCard event={event} />

              <div className="mt-3 flex gap-3 flex-wrap">
                {role === "Tech Coordinator" &&
                  event.status === STATUS.DRAFT && (
                    <button
                      onClick={() => handleSendForApproval(event._id)}
                      className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700"
                    >
                      Send For Approval
                    </button>
                  )}

                {role === "Faculty Coordinator" &&
                  event.status === STATUS.PENDING && (
                    <button
                      onClick={() => handleApprove(event._id)}
                      className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve Event
                    </button>
                  )}

                {role === "Student Coordinator" &&
                  event.status === STATUS.APPROVED && (
                    <button
                      onClick={() => handlePublish(event._id)}
                      className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Publish Event
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PARTICIPANTS */}
      {role !== "Member" && (
        <ParticipantTable participants={participants} />
      )}
    </div>
  );
};

export default EventDashboard;