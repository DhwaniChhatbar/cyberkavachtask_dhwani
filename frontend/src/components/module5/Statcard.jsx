import React from "react";

const StatCard = ({ title, value, icon, color = "gray" }) => {
  const colorClasses = {
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    amber: "text-amber-400",
    red: "text-red-400",
    gray: "text-gray-300",
  };

  return (
    <div className="w-full rounded-2xl bg-gray-900 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`flex items-center justify-center text-3xl ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;