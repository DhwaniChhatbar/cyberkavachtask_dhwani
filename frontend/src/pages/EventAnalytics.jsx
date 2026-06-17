import React from "react";

import RegistrationChart from "../components/module3/RegistrationChart";
import TeamSizeChart from "../components/module3/TeamSizeChart";
import WaitlistCard from "../components/module3/WaitlistCard";

const EventAnalytics = () => {
  // Dummy data (replace later with API data)
  const registrationData = [
    { date: "Day 1", registrations: 12 },
    { date: "Day 2", registrations: 25 },
    { date: "Day 3", registrations: 40 },
    { date: "Day 4", registrations: 65 },
    { date: "Day 5", registrations: 90 },
  ];

  const teamSizeData = [
    { name: "1 Member", value: 10 },
    { name: "2 Members", value: 18 },
    { name: "3 Members", value: 30 },
    { name: "4 Members", value: 22 },
    { name: "5+ Members", value: 12 },
  ];

  const registrations = 95;
  const capacity = 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">
        Event Analytics Dashboard
      </h1>

      {/* Top Stats Row */}
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
            {capacity - registrations}
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <RegistrationChart data={registrationData} />

        <TeamSizeChart data={teamSizeData} />

      </div>

      {/* Waitlist Section */}
      <div className="mb-8">
        <WaitlistCard
          registrations={registrations}
          capacity={capacity}
        />
      </div>

      {/* Footer Note */}
      <div className="text-gray-500 text-sm">
        * Analytics will auto-update once backend integration and real registration data are connected.
      </div>

    </div>
  );
};

export default EventAnalytics;