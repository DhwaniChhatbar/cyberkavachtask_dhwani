import React from "react";
import api from "../../utils/api";

const AttendanceTable = ({
  data = [],
  eventId,
  refreshAttendance,
}) => {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

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
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Check In</th>
            <th className="p-3 text-left">Check Out</th>
            <th className="p-3 text-left">Status</th>

            {canManageAttendance && (
              <th className="p-3 text-left">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-800"
              >
                <td className="p-3">
                  {item.name}
                </td>

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
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === "checked-in"
                        ? "bg-green-900 text-green-400"
                        : item.status === "checked-out"
                        ? "bg-blue-900 text-blue-400"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {item.status === "checked-in"
                      ? "Checked In"
                      : item.status === "checked-out"
                      ? "Checked Out"
                      : "Not Marked"}
                  </span>
                </td>

                {canManageAttendance && (
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        handleCheckIn(item.memberId)
                      }
                      disabled={
                        item.status === "checked-in" ||
                        item.status === "checked-out"
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-3 py-1 rounded-lg"
                    >
                      Check In
                    </button>

                    <button
                      onClick={() =>
                        handleCheckOut(item.memberId)
                      }
                      disabled={
                        item.status !== "checked-in"
                      }
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-3 py-1 rounded-lg"
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
                colSpan={
                  canManageAttendance ? 6 : 5
                }
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