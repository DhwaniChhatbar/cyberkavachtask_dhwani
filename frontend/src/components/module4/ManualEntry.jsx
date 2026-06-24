import React, { useState } from "react";
import api from "../../utils/api";

const ManualEntry = ({ eventId }) => {
  const [id, setId] = useState("");
  const [mode, setMode] = useState("checkin");
  const [type, setType] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id.trim()) {
      alert("Please enter Member ID or Team ID");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        eventId,
      };

      if (type === "member") {
        payload.memberId = id.trim();
      } else {
        payload.teamId = id.trim();
      }

      if (mode === "checkin") {
        const res = await api.post("/attendance/checkin", payload);

        alert(res.data.message || "Checked in successfully");
      } else {
        const res = await api.post("/attendance/checkout", payload);

        alert(res.data.message || "Checked out successfully");
      }

      setId("");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Attendance Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Check In / Check Out */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white"
        >
          <option value="checkin">Check In</option>
          <option value="checkout">Check Out</option>
        </select>

        {/* Member / Team */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white"
        >
          <option value="member">Member</option>
          <option value="team">Team</option>
        </select>

        {/* ID Input */}
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder={
            type === "member"
              ? "Enter Member ID"
              : "Enter Team ID"
          }
          className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold"
        >
          {loading
            ? "Processing..."
            : mode === "checkin"
            ? "Check In"
            : "Check Out"}
        </button>
      </form>
    </div>
  );
};

export default ManualEntry;