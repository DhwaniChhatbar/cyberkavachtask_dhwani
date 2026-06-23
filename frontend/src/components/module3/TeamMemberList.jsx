import React from "react";

const TeamMemberList = ({ members = [] }) => {
  const displayMembers = members.filter(
    (member) => !member?.isLeader
  );

  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <h2 className="font-bold mb-3 text-white">
        Team Members
      </h2>

      {displayMembers.length === 0 ? (
        <div className="text-gray-400">
          No members added
        </div>
      ) : (
        displayMembers.map((member, index) => (
          <div
            key={index}
            className="bg-gray-800 p-3 rounded mb-3 text-sm space-y-1"
          >
            <div className="font-semibold text-white">
              {member?.fullName || "Unknown Member"}
            </div>

            <div className="text-gray-300">
              📧 {member?.email || "N/A"}
            </div>

            <div className="text-gray-400">
              🆔 {member?.collegeId || "N/A"}
            </div>

            <div className="text-gray-400">
              🎓 {member?.department || "N/A"}
            </div>

            <div className="text-gray-400">
              🏫 {member?.institute || "N/A"}
            </div>

            {member?.isLeader && (
              <div className="text-green-400 font-medium">
                Team Leader
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TeamMemberList;