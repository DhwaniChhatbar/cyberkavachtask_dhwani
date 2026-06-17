import React from "react";

const ParticipantTable = ({ participants }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-2xl">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Team</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((p, index) => (
            <tr key={index}>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{p.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;