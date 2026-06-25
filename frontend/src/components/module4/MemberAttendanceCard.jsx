import React from "react";

const MemberAttendanceCard = ({
  name,
  email,
  status,
  checkIn,
  checkOut,
  durationMinutes,
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white">
        {name}
      </h2>

      <div className="mt-4 space-y-3 text-gray-300">
        <p>
          <span className="font-semibold text-white">
            Email:
          </span>{" "}
          {email || "N/A"}
        </p>

        <p>
          <span className="font-semibold text-white">
            Status:
          </span>{" "}
          {status || "Not Marked"}
        </p>

        <p>
          <span className="font-semibold text-white">
            Check In:
          </span>{" "}
          {checkIn || "-"}
        </p>

        <p>
          <span className="font-semibold text-white">
            Check Out:
          </span>{" "}
          {checkOut || "-"}
        </p>

        <p>
          <span className="font-semibold text-white">
            Duration:
          </span>{" "}
          {durationMinutes || 0} mins
        </p>
      </div>

      <div className="mt-5">
        {status === "checked-out" ? (
          <div className="bg-green-900 text-green-400 text-center py-2 rounded-lg font-semibold">
            Attendance Completed
          </div>
        ) : status === "checked-in" ? (
          <div className="bg-blue-900 text-blue-400 text-center py-2 rounded-lg font-semibold">
            Checked In
          </div>
        ) : (
          <div className="bg-gray-800 text-gray-400 text-center py-2 rounded-lg font-semibold">
            Not Marked
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberAttendanceCard;