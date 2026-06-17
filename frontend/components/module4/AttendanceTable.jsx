import React from "react";

const AttendanceTable = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl p-4">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-3">Team/Member</th>
            <th className="p-3">Check In</th>
            <th className="p-3">Check Out</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="p-3">{item.name}</td>

              <td className="p-3">{item.checkIn}</td>

              <td className="p-3">{item.checkOut}</td>

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
                    : "🔴 Early Exit"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;