import React, { useState } from "react";

const ManualEntry = () => {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Entered ID:", id);

    // Later:
    // axios.post("/api/attendance/checkin", {
    //   eventId,
    //   teamId: id,
    // });

    setId("");
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        Manual Check-In
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Team ID / Member ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-white w-full"
        >
          Check In
        </button>
      </form>
    </div>
  );
};

export default ManualEntry;