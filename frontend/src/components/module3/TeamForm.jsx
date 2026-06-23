import React, { useState } from "react";

const emptyPerson = {
  fullName: "",
  email: "",
  collegeId: "",
  department: "",
  institute: "",
};

const TeamForm = ({ onSubmit, initialTeamName = "" }) => {
  const [teamName, setTeamName] = useState(initialTeamName);

  // Leader details
  const [leaderDetails, setLeaderDetails] = useState({
    ...emptyPerson,
  });

  // Team members
  const [members, setMembers] = useState([{ ...emptyPerson }]);

  const [previousEvent, setPreviousEvent] = useState("");

  // ==========================
  // LEADER CHANGE
  // ==========================
  const handleLeaderChange = (e) => {
    setLeaderDetails({
      ...leaderDetails,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // MEMBER CHANGE
  // ==========================
  const handleMemberChange = (index, e) => {
    const updatedMembers = [...members];

    updatedMembers[index] = {
      ...updatedMembers[index],
      [e.target.name]: e.target.value,
    };

    setMembers(updatedMembers);
  };

  // ==========================
  // ADD MEMBER
  // ==========================
  const addMember = () => {
    setMembers([
      ...members,
      {
        ...emptyPerson,
      },
    ]);
  };

  // ==========================
  // REMOVE MEMBER
  // ==========================
  const removeMember = (index) => {
    const updatedMembers = members.filter(
      (_, i) => i !== index
    );

    setMembers(updatedMembers);
  };

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // remove completely empty member cards
    const filteredMembers = members.filter(
      (member) =>
        member.fullName.trim() ||
        member.email.trim() ||
        member.collegeId.trim() ||
        member.department.trim() ||
        member.institute.trim()
    );

    const payload = {
      teamName,
      leaderDetails,
      members: filteredMembers,
      previousEvent,
    };

    if (onSubmit) {
      onSubmit(payload);
    }

    // reset form
    setTeamName("");
    setLeaderDetails({
      ...emptyPerson,
    });

    setMembers([
      {
        ...emptyPerson,
      },
    ]);

    setPreviousEvent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-2xl space-y-6"
    >
      {/* TEAM NAME */}
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        required
      />

      {/* LEADER DETAILS */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">
          Leader Details
        </h2>

        <input
          type="text"
          name="fullName"
          placeholder="Leader Full Name"
          value={leaderDetails.fullName}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Leader Email"
          value={leaderDetails.email}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />

        <input
          type="text"
          name="collegeId"
          placeholder="Leader College ID"
          value={leaderDetails.collegeId}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Leader Department"
          value={leaderDetails.department}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />

        <input
          type="text"
          name="institute"
          placeholder="Leader Institute"
          value={leaderDetails.institute}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />
      </div>

      {/* MEMBERS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Team Members
        </h2>

        {members.map((member, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl p-4 space-y-3"
          >
            <h3 className="font-semibold text-gray-300">
              Member {index + 1}
            </h3>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={member.fullName}
              onChange={(e) => handleMemberChange(index, e)}
              className="w-full p-3 bg-gray-700 rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={member.email}
              onChange={(e) => handleMemberChange(index, e)}
              className="w-full p-3 bg-gray-700 rounded-lg"
            />

            <input
              type="text"
              name="collegeId"
              placeholder="College ID"
              value={member.collegeId}
              onChange={(e) => handleMemberChange(index, e)}
              className="w-full p-3 bg-gray-700 rounded-lg"
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={member.department}
              onChange={(e) => handleMemberChange(index, e)}
              className="w-full p-3 bg-gray-700 rounded-lg"
            />

            <input
              type="text"
              name="institute"
              placeholder="Institute"
              value={member.institute}
              onChange={(e) => handleMemberChange(index, e)}
              className="w-full p-3 bg-gray-700 rounded-lg"
            />

            {members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Remove Member
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addMember}
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl"
        >
          + Add Member
        </button>
      </div>

      {/* PREVIOUS EVENT */}
      <input
        type="text"
        placeholder="Previous Event (Optional)"
        value={previousEvent}
        onChange={(e) => setPreviousEvent(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
      >
        Register Team
      </button>
    </form>
  );
};

export default TeamForm;