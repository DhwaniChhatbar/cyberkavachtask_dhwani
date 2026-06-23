import React from "react";

const TeamMemberList = ({ members = [] }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <h2 className="font-bold mb-3">
        Team Members
      </h2>

      {members.length === 0 ? (
        <div className="text-gray-400">
          No members added
        </div>
      ) : (
        members.map((member, index) => (
          <div
            key={index}
            className="bg-gray-800 p-2 rounded mb-2"
          >
            {typeof member === "string"
              ? member
              : member?.name || member?.email || "Unknown Member"}
          </div>
        ))
      )}
    </div>
  );
};

export default TeamMemberList;