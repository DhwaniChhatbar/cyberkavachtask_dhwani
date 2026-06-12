import React from "react";

const WaitlistCard = ({
  registrations,
  capacity,
}) => {
  const waitlist =
    registrations > capacity
      ? registrations - capacity
      : 0;

  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">
        Waitlist Status
      </h2>

      <p>Capacity : {capacity}</p>

      <p>Total Registrations : {registrations}</p>

      <p className="text-red-400 mt-3">
        Waitlist : {waitlist}
      </p>
    </div>
  );
};

export default WaitlistCard;