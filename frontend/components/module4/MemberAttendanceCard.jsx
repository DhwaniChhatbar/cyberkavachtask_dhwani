import React from "react";

const MemberAttendanceCard = ({
  name,
  status,
  checkIn,
  checkOut,
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-5 shadow-lg">
      <h2 className="text-xl font-bold text-white">
        {name}
      </h2>

      <div className="mt-3 space-y-2 text-gray-300">
        <p>Status: {status}</p>
        <p>Check In: {checkIn}</p>
        <p>Check Out: {checkOut}</p>
      </div>
    </div>
  );
};

export default MemberAttendanceCard;