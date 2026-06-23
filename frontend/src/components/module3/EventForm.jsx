import React, { useState } from "react";

const EventForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationDeadline: "",
    poster: "",
    teamSize: 1,
    capacity: 100,
    rules: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ==========================
    // CLEAN + SAFE PAYLOAD
    // ==========================
    const finalData = {
      ...formData,
      teamSize: Number(formData.teamSize || 1),
      capacity: Number(formData.capacity || 100),

      // convert tags string → array (IMPORTANT FIX)
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [],
    };

    if (onSubmit) {
      onSubmit(finalData);
    }

    // reset form
    setFormData({
      name: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      registrationDeadline: "",
      poster: "",
      teamSize: 1,
      capacity: 100,
      rules: "",
      tags: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-2xl space-y-4"
    >
      {/* NAME */}
      <input
        type="text"
        name="name"
        placeholder="Event Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
        required
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
        rows="3"
      />

      {/* DATE + TIME */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-3 bg-gray-800 rounded-lg"
          required
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="p-3 bg-gray-800 rounded-lg"
          required
        />
      </div>

      {/* VENUE */}
      <input
        type="text"
        name="venue"
        placeholder="Venue"
        value={formData.venue}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      {/* DEADLINE */}
      <input
        type="date"
        name="registrationDeadline"
        value={formData.registrationDeadline}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      {/* POSTER */}
      <input
        type="text"
        name="poster"
        placeholder="Poster URL"
        value={formData.poster}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      {/* CAPACITY */}
      <input
        type="number"
        name="capacity"
        placeholder="Registration Capacity"
        value={formData.capacity}
        onChange={handleChange}
        min="1"
        className="w-full p-3 bg-gray-800 rounded-lg"
        required
      />

      {/* TEAM SIZE */}
      <input
        type="number"
        name="teamSize"
        placeholder="Team Size"
        value={formData.teamSize}
        onChange={handleChange}
        min="1"
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      {/* RULES */}
      <textarea
        name="rules"
        placeholder="Rules"
        value={formData.rules}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
        rows="3"
      />

      {/* TAGS */}
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
      >
        Create Event
      </button>
    </form>
  );
};

export default EventForm;