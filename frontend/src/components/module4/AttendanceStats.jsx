import React from "react";

const AttendanceStats = ({
  checkedIn = 0,
  checkedOut = 0,
  total = 0,
}) => {
  const cards = [
    {
      title: "Checked In",
      value: checkedIn,
    },
    {
      title: "Checked Out",
      value: checkedOut,
    },
    {
      title: "Total",
      value: total,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-gray-900 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-gray-400">
            {card.title}
          </h2>

          <p className="text-3xl font-bold text-white mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStats;