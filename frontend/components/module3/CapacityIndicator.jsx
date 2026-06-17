import React from "react";

const CapacityIndicator = ({ current, total }) => {

  const percentage =
    (current / total) * 100;

  return (
    <div className="bg-gray-900 p-5 rounded-2xl">

      <h2 className="font-bold mb-4">
        Capacity
      </h2>

      <div className="bg-gray-800 h-5 rounded-full">
        <div
          className="bg-green-500 h-5 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-3">
        {current}/{total}
      </p>
    </div>
  );
};

export default CapacityIndicator;