import React, { useState } from "react";
import api from "../../utils/api";

const ManualEntry = ({ eventId, refreshAttendance }) => {
  const [collegeId, setCollegeId] = useState("");
  const [mode, setMode] = useState("checkin");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      alert("Please select an event");
      return;
    }

    if (!collegeId.trim()) {
      alert("Please enter College ID");
      return;
    }

    try {
      setLoading(true);

      // Backend expects memberId, not collegeId
      const payload = {
        eventId,
        memberId: collegeId.trim(),
      };

      let res;

      if (mode === "checkin") {
        res = await api.post("/attendance/checkin", payload);
      } else {
        res = await api.post("/attendance/checkout", payload);
      }

      alert(
        res.data.message || "Attendance updated successfully"
      );

      setCollegeId("");

      if (refreshAttendance) {
        refreshAttendance();
      }
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Manual Attendance
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-lg"
        >
          <option value="checkin">Check In</option>
          <option value="checkout">Check Out</option>
        </select>

        <input
          type="text"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
          placeholder="Enter College ID"
          className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none"
        />

        <button
          type="submit"
          disabled={loading || !eventId}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg"
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