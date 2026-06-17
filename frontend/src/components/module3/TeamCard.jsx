import React from "react";
import TeamQRCode from "./TeamQRCode";

const TeamCard = ({ team }) => {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-2xl font-bold">
            {team.teamName}
          </h2>

          <p className="mt-2 text-gray-400 text-sm">
            Team ID: {team.teamId}
          </p>

          {team.eventName && (
            <p className="text-gray-500 text-sm mt-1">
              Event: {team.eventName}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            team.status === "Approved"
              ? "bg-green-600"
              : team.status === "Rejected"
              ? "bg-red-600"
              : "bg-yellow-600"
          }`}
        >
          {team.status || "Pending"}
        </span>
      </div>

      {/* Leader Info */}
      {team.leaderName && (
        <div className="mt-4 text-sm text-gray-400">
          <p>
            👤 Leader:{" "}
            <span className="text-white">
              {team.leaderName}
            </span>
          </p>

          {team.leaderEmail && (
            <p>
              📧 {team.leaderEmail}
            </p>
          )}
        </div>
      )}

      {/* Members */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">
          Members
        </h3>

        {team.members?.length > 0 ? (
          team.members.map((member, index) => (
            <p
              key={index}
              className="text-gray-300"
            >
              • {member}
            </p>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            No members added
          </p>
        )}
      </div>

      {/* QR Code Section */}
      <div className="mt-6">
        <TeamQRCode
          teamId={team.teamId}
          teamName={team.teamName}
        />
      </div>
    </div>
  );
};

export default TeamCard;