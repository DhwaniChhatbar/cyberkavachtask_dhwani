import React, { useState } from "react";

const TeamForm = ({
  onSubmit,
  initialTeamName = "",
  initialMembers = [],
}) => {
  const [teamName, setTeamName] = useState(initialTeamName);
  const [eventName, setEventName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [previousEvent, setPreviousEvent] = useState("");

  const [members, setMembers] = useState(
    initialMembers.join(", ")
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const memberArray = members
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m !== "");

    onSubmit({
      teamName,
      eventName,
      leaderName,
      leaderEmail,
      previousEvent,
      members: memberArray,
    });

    setTeamName("");
    setEventName("");
    setLeaderName("");
    setLeaderEmail("");
    setPreviousEvent("");
    setMembers("");
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
        placeholder="Event Name"
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
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

      <textarea
        rows="4"
        placeholder="Members (comma separated)"
        className="w-full p-3 bg-gray-800 rounded-lg outline-none"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
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