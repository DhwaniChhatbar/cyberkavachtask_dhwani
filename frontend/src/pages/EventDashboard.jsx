import React, { useEffect, useState } from "react";
import axios from "axios";

import AnalyticsCard from "../components/module3/AnalyticsCard";
import CapacityIndicator from "../components/module3/CapacityIndicator";
import ParticipantTable from "../components/module3/ParticipantTable";

const EventDashboard = () => {
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

      const res = await axios.get(
        "http://localhost:5000/api/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const res = await axios.get(
        "http://localhost:5000/api/teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      <h1 className="text-3xl font-bold mb-8">
        Event Dashboard
      </h1>

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