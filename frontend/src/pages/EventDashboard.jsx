import React, { useEffect, useState } from "react";
import axios from "axios";

import AnalyticsCard from "../components/module3/AnalyticsCard";
import CapacityIndicator from "../components/module3/CapacityIndicator";
import ParticipantTable from "../components/module3/ParticipantTable";

const API_URL = import.meta.env.VITE_API_URL;

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
      const token = localStorage.getItem("token");

      console.log("API_URL =", API_URL);
      console.log("Fetching:", `${API_URL}/api/events`);

      const res = await axios.get(`${API_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Events API Response:", res.data);

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
      const token = localStorage.getItem("token");

      console.log("Fetching:", `${API_URL}/api/teams`);

      const res = await axios.get(`${API_URL}/api/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Teams API Response:", res.data);

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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>

      {/* Role Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        {role === "Tech Coordinator" && (
          <>
            <button className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
              Create Event
            </button>

            <button className="bg-yellow-600 px-5 py-2 rounded-lg hover:bg-yellow-700">
              Send For Approval
            </button>
          </>
        )}

        {role === "Faculty Coordinator" && (
          <button className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700">
            Approve Pending Events
          </button>
        )}

        {role === "Student Coordinator" && (
          <button className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700">
            Publish Approved Events
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <AnalyticsCard
          title="Registrations"
          value={participants.length}
        />

        <AnalyticsCard
          title="Teams"
          value={participants.length}
        />

        <AnalyticsCard
          title="Events"
          value={events.length}
        />
      </div>

      <div className="mb-8">
        <CapacityIndicator
          current={participants.length}
          total={totalCapacity}
        />
      </div>

      <ParticipantTable participants={participants} />
    </div>
  );
};

export default EventDashboard;