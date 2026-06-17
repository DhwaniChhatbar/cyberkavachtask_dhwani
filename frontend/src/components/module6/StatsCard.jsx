import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
      <h3 className="text-gray-400 text-sm mb-2">
        {title}
      </h3>

      <p className="text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
};

export default StatsCard;