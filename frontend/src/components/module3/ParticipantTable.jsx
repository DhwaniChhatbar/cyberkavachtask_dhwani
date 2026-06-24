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
              // ✅ NORMALIZED DATA (handles BOTH backend formats)
              const member = p.member || p;

              const team =
                p.team?.teamName ||
                p.team ||
                p.teamName ||
                "N/A";

              return (
                <tr key={index} className="border-b border-gray-800">

                  {/* NAME */}
                  <td className="p-3">
                    {p.fullName ||
                      member?.name ||
                      "N/A"}
                  </td>

                  {/* EMAIL */}
                  <td className="p-3">
                    {p.email ||
                      member?.email ||
                      "N/A"}
                  </td>

                  {/* COLLEGE ID */}
                  <td className="p-3">
                    {p.collegeId ||
                      member?.collegeId ||
                      "N/A"}
                  </td>

                  {/* DEPARTMENT */}
                  <td className="p-3">
                    {p.department ||
                      member?.department ||
                      "N/A"}
                  </td>

                  {/* INSTITUTE */}
                  <td className="p-3">
                    {p.institute ||
                      member?.institute ||
                      "N/A"}
                  </td>

                  {/* TEAM */}
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