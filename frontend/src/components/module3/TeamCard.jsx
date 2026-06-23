import React from "react";
import TeamQRCode from "./TeamQRCode";

const TeamCard = ({ team }) => {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-lg">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {team.teamName}
          </h2>

          <p className="mt-2 text-gray-400 text-sm">
            Team ID: {team.teamId}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Event: {team.event?.name || "N/A"}
          </p>
        </div>

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

      {/* LEADER SECTION */}
      {team.leaderDetails && (
        <div className="mt-5 bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-3">
            👤 Team Leader
          </h3>

          <div className="space-y-1 text-sm text-gray-300">
            <p>
              <span className="text-white font-medium">
                Name:
              </span>{" "}
              {team.leaderDetails.fullName}
            </p>

            <p>
              <span className="text-white font-medium">
                Email:
              </span>{" "}
              {team.leaderDetails.email}
            </p>

            <p>
              <span className="text-white font-medium">
                College ID:
              </span>{" "}
              {team.leaderDetails.collegeId}
            </p>

            <p>
              <span className="text-white font-medium">
                Department:
              </span>{" "}
              {team.leaderDetails.department}
            </p>

            <p>
              <span className="text-white font-medium">
                Institute:
              </span>{" "}
              {team.leaderDetails.institute}
            </p>
          </div>
        </div>
      )}

      {/* MEMBERS SECTION */}
      <div className="mt-5">
        <h3 className="font-semibold mb-3 text-white">
          Team Members
        </h3>

        {team.members?.filter((member) => !member.isLeader).length >
        0 ? (
          team.members
            .filter((member) => !member.isLeader)
            .map((member, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-xl mb-3 text-sm text-gray-300"
              >
                <p className="text-white font-medium mb-1">
                  {member.fullName}
                </p>

                <p>📧 {member.email}</p>
                <p>🆔 {member.collegeId}</p>
                <p>🎓 {member.department}</p>
                <p>🏫 {member.institute}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-sm">
            No members added
          </p>
        )}
      </div>

      {/* PREVIOUS EVENT */}
      {team.previousEvent && (
        <div className="mt-5 text-sm text-gray-400">
          Previous Event:{" "}
          <span className="text-white">
            {team.previousEvent}
          </span>
        </div>
      )}

      {/* QR CODE */}
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