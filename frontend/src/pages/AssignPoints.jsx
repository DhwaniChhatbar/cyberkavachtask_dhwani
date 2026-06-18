import React, { useState } from "react";
import api from "../utils/api";

const AssignPoints = () => {
  const [form, setForm] = useState({
    name: "",
    newName: "",
    points: "",
    category: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username =
      form.name === "new"
        ? form.newName.trim()
        : form.name;

    if (!username) {
      alert("Please select or enter a user name");
      return;
    }

    if (!form.points) {
      alert("Please enter points");
      return;
    }

    try {
      // ✅ SAVE TO BACKEND (MongoDB Points collection)
      await api.post("/leaderboard/assign", {
        userName: username,
        points: Number(form.points),
        category: form.category,
        remarks: form.remarks,
      });

      setForm({
        name: "",
        newName: "",
        points: "",
        category: "",
        remarks: "",
      });

      alert("Points assigned successfully!");
    } catch (error) {
      console.error("Assign points error:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to assign points"
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Assign Points
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-xl space-y-4 max-w-xl border-l-4 border-emerald-500"
      >
        <select
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 bg-[#0B0F1A] border border-gray-700 rounded text-white"
        >
          <option value="">Select User</option>

          {/* NOTE: this assumes users list is optional */}
          <option value="new">+ Add New User</option>
        </select>

        {form.name === "new" && (
          <input
            type="text"
            name="newName"
            value={form.newName}
            onChange={handleChange}
            placeholder="Enter new user name"
            className="w-full p-3 bg-[#0B0F1A] border border-gray-700 rounded text-white"
          />
        )}

        <input
          type="number"
          name="points"
          value={form.points}
          onChange={handleChange}
          placeholder="Points"
          className="w-full p-3 bg-[#0B0F1A] border border-gray-700 rounded text-white"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 bg-[#0B0F1A] border border-gray-700 rounded text-white"
        >
          <option value="">Select Category</option>
          <option value="Event Participation">Event Participation</option>
          <option value="Workshop">Workshop</option>
          <option value="Competition">Competition</option>
          <option value="Volunteer Work">Volunteer Work</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Remarks"
          rows="4"
          className="w-full p-3 bg-[#0B0F1A] border border-gray-700 rounded text-white"
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 transition duration-300 p-3 rounded-lg font-semibold"
        >
          Assign Points
        </button>
      </form>
    </div>
  );
};

export default AssignPoints;