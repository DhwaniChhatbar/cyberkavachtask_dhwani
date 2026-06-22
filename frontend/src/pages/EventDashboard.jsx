import React, { useEffect, useState } from "react";
import api from "../utils/api";

import AnalyticsCard from "../components/module3/AnalyticsCard";
import CapacityIndicator from "../components/module3/CapacityIndicator";
import ParticipantTable from "../components/module3/ParticipantTable";

const EventDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.trim();

  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [totalCapacity, setTotalCapacity] = useState(100);

  useEffect(() => {
    fetchEvents();
    fetchParticipants();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");

      const eventData = Array.isArray(res.data)
        ? res.data
        : res.data.events || [];

      setEvents(eventData);

      const capacity = eventData.reduce(
        (sum, event) => sum + (event.capacity || 0),
        0
      );

      setTotalCapacity(capacity || 100);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await api.get("/teams");

      const teams = Array.isArray(res.data)
        ? res.data
        : res.data.teams || [];

      const formatted = teams.map((team) => ({
        name: team.leaderName || "N/A",
        email: team.leaderEmail || "N/A",
        team: team.teamId || "N/A",
      }));

      setParticipants(formatted);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <AnalyticsCard title="Registrations" value={participants.length} />
        <AnalyticsCard title="Teams" value={participants.length} />
        <AnalyticsCard title="Events" value={events.length} />
      </div>

      <div className="mb-8">
        <CapacityIndicator
          current={participants.length}
          total={totalCapacity}
        />
      </div>

      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-5">Events</h2>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="text-xl font-bold">{event.name}</h3>
                <p className="text-gray-400">
                  Status: {event.status}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                {role === "Tech Coordinator" &&
                  event.status === "Draft" && (
                    <button
                      onClick={() =>
                        handleSendForApproval(event._id)
                      }
                      className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700"
                    >
                      Send For Approval
                    </button>
                  )}

                {role === "Faculty Coordinator" &&
                  event.status === "Pending Faculty Review" && (
                    <button
                      onClick={() =>
                        handleApprove(event._id)
                      }
                      className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve Event
                    </button>
                  )}

                {role === "Student Coordinator" &&
                  event.status === "Approved by Faculty" && (
                    <button
                      onClick={() =>
                        handlePublish(event._id)
                      }
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

      <ParticipantTable participants={participants} />
    </div>
  );
};

export default EventDashboard;