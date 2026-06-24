import React from "react";

const ParticipantTable = ({ participants = [] }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-2xl">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">College ID</th>
            <th className="p-3">Department</th>
            <th className="p-3">Institute</th>
            <th className="p-3">Team</th>
          </tr>
        </thead>

        <tbody>
          {participants.length > 0 ? (
            participants.map((p, index) => {
              // ✅ SAFE TEAM EXTRACTION (handles backend mismatch)
              const team =
                p.team?.name ||     // if populated object
                p.team ||           // if plain string
                p.teamName ||       // fallback old API
                p.user?.team ||     // nested structure case
                "N/A";

              return (
                <tr key={index} className="border-b border-gray-800">
                  <td className="p-3">{p.fullName || "N/A"}</td>
                  <td className="p-3">{p.email || "N/A"}</td>
                  <td className="p-3">{p.collegeId || "N/A"}</td>
                  <td className="p-3">{p.department || "N/A"}</td>
                  <td className="p-3">{p.institute || "N/A"}</td>
                  <td className="p-3">{team}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-400">
                No participants found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;