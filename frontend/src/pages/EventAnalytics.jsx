import React, { useEffect, useState } from "react";
import api from "../utils/api";

import RegistrationChart from "../components/module3/RegistrationChart";
import TeamSizeChart from "../components/module3/TeamSizeChart";
import WaitlistCard from "../components/module3/WaitlistCard";

const EventAnalytics = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [teamSizeData, setTeamSizeData] = useState([]);

  const [registrations, setRegistrations] = useState(0);
  const [capacity, setCapacity] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const eventRes = await api.get("/events");

      const events = eventRes.data || [];

      let totalRegistrations = 0;
      let totalCapacity = 0;

      const teamSizeMap = {};
      const chartMap = {};

      for (const event of events) {
        totalRegistrations += event.registrationCount || 0;
        totalCapacity += event.capacity || 0;

        chartMap[event.name] = event.registrationCount || 0;

        if (event.eventType === "Team") {
          const size = event.teamSize || 1;

          if (!teamSizeMap[size]) {
            teamSizeMap[size] = 0;
          }

          teamSizeMap[size]++;
        }
      }

      setRegistrations(totalRegistrations);
      setCapacity(totalCapacity);

      setRegistrationData(
        Object.keys(chartMap).map((key) => ({
          date: key,
          registrations: chartMap[key],
        }))
      );

      setTeamSizeData(
        Object.keys(teamSizeMap).map((key) => ({
          name: `${key} Members`,
          value: teamSizeMap[key],
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">
        Event Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-gray-300">
            Total Registrations
          </h2>

          <p className="text-3xl font-bold mt-2 text-blue-400">
            {registrations}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-gray-300">
            Event Capacity
          </h2>

          <p className="text-3xl font-bold mt-2 text-green-400">
            {capacity}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-gray-300">
            Remaining Slots
          </h2>

          <p className="text-3xl font-bold mt-2 text-yellow-400">
            {Math.max(capacity - registrations, 0)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <RegistrationChart data={registrationData} />

        <TeamSizeChart data={teamSizeData} />
      </div>

      <WaitlistCard
        registrations={registrations}
        capacity={capacity}
      />
    </div>
  );
};

export default EventAnalytics;