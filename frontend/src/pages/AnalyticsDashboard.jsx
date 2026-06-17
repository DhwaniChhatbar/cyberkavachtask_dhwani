import React from "react";

export default function AnalyticsDashboard() {
  const stats = [
    {
      title: "Total Events",
      value: 24,
    },
    {
      title: "Total Participants",
      value: 842,
    },
    {
      title: "Certificates Issued",
      value: 615,
    },
    {
      title: "Attendance Rate",
      value: "91%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-gray-400 text-sm mb-2">
              {item.title}
            </h2>

            <p className="text-3xl font-bold text-blue-500">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Event Analytics
          </h2>

          <div className="h-56 flex items-center justify-center text-gray-400">
            Event charts will appear here
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Attendance Analytics
          </h2>

          <div className="h-56 flex items-center justify-center text-gray-400">
            Attendance charts will appear here
          </div>
        </div>
      </div>

      <div className="mt-10 bg-gray-900 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-gray-300">
          <li>✔ Hackathon 2026 completed successfully</li>
          <li>✔ 120 certificates generated this week</li>
          <li>✔ Attendance crossed 90%</li>
          <li>✔ 35 teams registered this month</li>
        </ul>
      </div>
    </div>
  );
}