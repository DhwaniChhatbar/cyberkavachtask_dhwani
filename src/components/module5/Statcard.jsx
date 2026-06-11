import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="flex items-center justify-center text-3xl text-gray-300">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;