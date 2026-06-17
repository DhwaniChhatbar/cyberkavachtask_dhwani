import React from "react";

const AnalyticsCard = ({
  title,
  value,
}) => {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl">
      <h3 className="text-gray-400">
        {title}
      </h3>

      <h1 className="text-3xl font-bold mt-3">
        {value}
      </h1>
    </div>
  );
};

export default AnalyticsCard;