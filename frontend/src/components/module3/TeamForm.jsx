import React, { useState } from "react";

const TeamForm = ({
  onSubmit,
  initialTeamName = "",
}) => {
  const [teamName, setTeamName] = useState(initialTeamName);
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [previousEvent, setPreviousEvent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      teamName,
      leaderName,
      leaderEmail,
      previousEvent,
      members: [], // empty array because members schema expects ObjectIds
    });

    setTeamName("");
    setLeaderName("");
    setLeaderEmail("");
    setPreviousEvent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-2xl space-y-4"
    >
      <input
        type="text"
        placeholder="Team Name"
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Leader Name"
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        value={leaderName}
        onChange={(e) => setLeaderName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Leader Email"
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        value={leaderEmail}
        onChange={(e) => setLeaderEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Previous Event (Optional)"
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        value={previousEvent}
        onChange={(e) => setPreviousEvent(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
      >
        Create Team
      </button>
    </form>
  );
};

export default TeamForm;