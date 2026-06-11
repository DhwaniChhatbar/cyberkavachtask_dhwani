import React from "react";

const LeaderboardCard = ({ rank, name, points, badge }) => {
  const rankColors = {
    1: "text-yellow-400",
    2: "text-gray-300",
    3: "text-orange-400",
  };

  return (
    <div className="w-full rounded-2xl bg-gray-900 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Section */}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 text-xl font-bold ${rankColors[rank] || "text-white"}`}>
            <span>🏆</span>
            <span>Rank #{rank}</span>
          </div>

          <div className="flex items-center gap-2 text-lg">
            <span>👤</span>
            <span>{name}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-2 text-left sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end">
            <span>⭐</span>
            <span className="font-semibold">{points} Points</span>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <span>🎖</span>
            <span>{badge}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;