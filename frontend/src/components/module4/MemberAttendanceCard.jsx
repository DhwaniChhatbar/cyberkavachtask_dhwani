import React, { useState } from "react";
import api from "../../utils/api";

const MemberAttendanceCard = ({
  _id,
  name,
  status,
  checkIn,
  checkOut,
  eventId,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      await api.post("/attendance/checkin", {
        eventId,
        memberId: _id,
      });

      alert("Check-in successful");

      if (onRefresh) onRefresh();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Check-in failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      await api.post("/attendance/checkout", {
        eventId,
        memberId: _id,
      });

      alert("Check-out successful");

      if (onRefresh) onRefresh();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Check-out failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white">
        {name}
      </h2>

      <div className="mt-4 space-y-2 text-gray-300">
        <p>
          Status:
          <span className="ml-2 font-semibold">
            {status || "Not Checked In"}
          </span>
        </p>

        <p>
          Check In:
          <span className="ml-2">
            {checkIn
              ? new Date(checkIn).toLocaleString()
              : "-"}
          </span>
        </p>

        <p>
          Check Out:
          <span className="ml-2">
            {checkOut
              ? new Date(checkOut).toLocaleString()
              : "-"}
          </span>
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        {(status === undefined ||
          status === null ||
          status === "") && (
          <button
            disabled={loading}
            onClick={handleCheckIn}
            className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg py-2 text-white font-semibold disabled:bg-gray-700"
          >
            {loading ? "Processing..." : "Check In"}
          </button>
        )}

        {status === "checked-in" && (
          <button
            disabled={loading}
            onClick={handleCheckOut}
            className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 text-white font-semibold disabled:bg-gray-700"
          >
            {loading ? "Processing..." : "Check Out"}
          </button>
        )}

        {status === "checked-out" && (
          <div className="flex-1 bg-gray-800 rounded-lg py-2 text-center text-green-400 font-semibold">
            Attendance Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberAttendanceCard;