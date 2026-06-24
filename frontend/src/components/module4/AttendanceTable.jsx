import React from "react";
import api from "../../utils/api";

const AttendanceTable = ({
  data = [],
  eventId,
  refreshAttendance,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const canManageAttendance = [
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
  ].includes(user?.role);

  const handleCheckIn = async (memberId) => {
    try {
      await api.post("/attendance/checkin", {
        eventId,
        memberId,
      });

      refreshAttendance();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Check In failed"
      );
    }
  };

  const handleCheckOut = async (memberId) => {
    try {
      await api.post("/attendance/checkout", {
        eventId,
        memberId,
      });

      refreshAttendance();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Check Out failed"
      );
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl p-4">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-3">Member</th>
            <th className="p-3">Email</th>
            <th className="p-3">Check In</th>
            <th className="p-3">Check Out</th>
            <th className="p-3">Status</th>

            {canManageAttendance && (
              <th className="p-3">Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-800"
              >
                <td className="p-3">{item.name}</td>

                <td className="p-3">
                  {item.email || "-"}
                </td>

                <td className="p-3">
                  {item.checkIn || "-"}
                </td>

                <td className="p-3">
                  {item.checkOut || "-"}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      item.status === "checked-in"
                        ? "bg-green-900 text-green-400"
                        : item.status === "checked-out"
                        ? "bg-blue-900 text-blue-400"
                        : item.status === "late"
                        ? "bg-yellow-900 text-yellow-400"
                        : "bg-red-900 text-red-400"
                    }`}
                  >
                    {item.status === "checked-in"
                      ? "🟢 Checked In"
                      : item.status === "checked-out"
                      ? "🔵 Checked Out"
                      : item.status === "late"
                      ? "🟡 Late"
                      : item.status === "early-exit"
                      ? "🔴 Early Exit"
                      : "⚪ Not Marked"}
                  </span>
                </td>

                {canManageAttendance && (
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg disabled:bg-gray-700"
                      disabled={
                        item.status === "checked-in" ||
                        item.status === "checked-out"
                      }
                      onClick={() =>
                        handleCheckIn(item.memberId)
                      }
                    >
                      Check In
                    </button>

                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg disabled:bg-gray-700"
                      disabled={
                        item.status !== "checked-in"
                      }
                      onClick={() =>
                        handleCheckOut(item.memberId)
                      }
                    >
                      Check Out
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={canManageAttendance ? 6 : 5}
                className="p-6 text-center text-gray-400"
              >
                No attendance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;