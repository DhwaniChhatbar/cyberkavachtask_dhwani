import React, { useState, useMemo } from "react";

const emptyPerson = {
  fullName: "",
  email: "",
  collegeId: "",
  department: "",
  institute: "",
};

const TeamForm = ({
  onSubmit,
  initialTeamName = "",
  teamSize = 1,
}) => {
  const [teamName, setTeamName] = useState(initialTeamName);

  const [leaderDetails, setLeaderDetails] = useState({
    ...emptyPerson,
  });

  const [members, setMembers] = useState([{ ...emptyPerson }]);
  const [previousEvent, setPreviousEvent] = useState("");

  const totalPeople = 1 + members.length;

  const remainingSlots = useMemo(() => {
    return Math.max(teamSize - totalPeople, 0);
  }, [teamSize, totalPeople]);

  const handleLeaderChange = (e) => {
    setLeaderDetails({
      ...leaderDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberChange = (index, e) => {
    const updated = [...members];
    updated[index][e.target.name] = e.target.value;
    setMembers(updated);
  };

  const addMember = () => {
    if (totalPeople >= teamSize) return;
    setMembers([...members, { ...emptyPerson }]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const isValidPerson = (p) =>
    p.fullName &&
    p.email &&
    p.collegeId &&
    p.department &&
    p.institute;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidPerson(leaderDetails)) {
      alert("Please fill all leader details");
      return;
    }

    const filteredMembers = members.filter(isValidPerson);

    if (1 + filteredMembers.length > teamSize) {
      alert("Team size exceeded");
      return;
    }

    onSubmit({
      teamName,
      leaderDetails,
      members: filteredMembers,
      previousEvent,
    });

    setTeamName("");
    setLeaderDetails({ ...emptyPerson });
    setMembers([{ ...emptyPerson }]);
    setPreviousEvent("");
  };

  return (
    <form
      className="bg-gray-900 p-6 rounded-2xl space-y-6"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg"
        required
      />

      <div>
        <h2 className="text-white font-bold mb-2">
          Leader Details
        </h2>

        <input
          name="fullName"
          placeholder="Leader Full Name *"
          value={leaderDetails.fullName}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg mb-2"
          required
        />

        <input
          name="email"
          placeholder="Leader Email *"
          value={leaderDetails.email}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg mb-2"
          required
        />

        <input
          name="collegeId"
          placeholder="Leader College ID *"
          value={leaderDetails.collegeId}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg mb-2"
          required
        />

        <input
          name="department"
          placeholder="Leader Department *"
          value={leaderDetails.department}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg mb-2"
          required
        />

        <input
          name="institute"
          placeholder="Leader Institute *"
          value={leaderDetails.institute}
          onChange={handleLeaderChange}
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />
      </div>

      <div>
        <h2 className="text-white font-bold mb-2">
          Team Members
        </h2>

        <p className="text-sm text-gray-400 mb-3">
          Remaining slots: {remainingSlots}
        </p>

        {members.map((m, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-xl mb-3">
            <input
              name="fullName"
              placeholder="Full Name *"
              value={m.fullName}
              onChange={(e) => handleMemberChange(i, e)}
              className="w-full p-2 bg-gray-700 rounded mb-2"
              required
            />

            <input
              name="email"
              placeholder="Email *"
              value={m.email}
              onChange={(e) => handleMemberChange(i, e)}
              className="w-full p-2 bg-gray-700 rounded mb-2"
              required
            />

            <input
              name="collegeId"
              placeholder="College ID *"
              value={m.collegeId}
              onChange={(e) => handleMemberChange(i, e)}
              className="w-full p-2 bg-gray-700 rounded mb-2"
              required
            />

            <input
              name="department"
              placeholder="Department *"
              value={m.department}
              onChange={(e) => handleMemberChange(i, e)}
              className="w-full p-2 bg-gray-700 rounded mb-2"
              required
            />

            <input
              name="institute"
              placeholder="Institute *"
              value={m.institute}
              onChange={(e) => handleMemberChange(i, e)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />

            {members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMember(i)}
                className="text-red-400 mt-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addMember}
          disabled={totalPeople >= teamSize}
          className={`px-4 py-2 rounded ${
            totalPeople >= teamSize
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          + Add Member
        </button>
      </div>

      <input
        type="text"
        placeholder="Previous Event"
        value={previousEvent}
        onChange={(e) => setPreviousEvent(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
      >
        Register Team
      </button>
    </form>
  );
};

export default TeamForm;