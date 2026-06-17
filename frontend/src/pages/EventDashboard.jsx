import React, { useEffect, useState } from "react";
import axios from "axios";

import AnalyticsCard from "../components/module3/AnalyticsCard";
import CapacityIndicator from "../components/module3/CapacityIndicator";
import ParticipantTable from "../components/module3/ParticipantTable";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Fetch events
  useEffect(() => {
    fetchEvents();
    fetchParticipants();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 placeholder (replace with real API later if needed)
  const fetchParticipants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teams");
      const formatted = (res.data || []).map((t) => ({
        name: t.leaderName || "N/A",
        email: t.leaderEmail || "N/A",
        team: t.teamId,
      }));

      setParticipants(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const totalTeams = participants.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        Event Dashboard
      </h1>

      {/* SIMPLE STATS */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <AnalyticsCard
          title="Registrations"
          value={participants.length}
        />

        <AnalyticsCard
          title="Teams"
          value={totalTeams}
        />

        <AnalyticsCard
          title="Events"
          value={events.length}
        />

      </div>

      {/* CAPACITY */}
      <div className="mb-8">
        <CapacityIndicator
          current={participants.length}
          total={100}
        />
      </div>

      {/* TABLE */}
      <ParticipantTable participants={participants} />

    </div>
  );
};

export default EventDashboard;