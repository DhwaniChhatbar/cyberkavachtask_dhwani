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
    rules: "",
    tags: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    }

    setFormData({
      name: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      registrationDeadline: "",
      poster: "",
      teamSize: 1,
      rules: "",
      tags: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-2xl space-y-4"
    >
      <input
        type="text"
        name="name"
        placeholder="Event Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
        rows="3"
      />

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

      <input
        type="text"
        name="venue"
        placeholder="Venue"
        value={formData.venue}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      <input
        type="date"
        name="registrationDeadline"
        value={formData.registrationDeadline}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      <input
        type="text"
        name="poster"
        placeholder="Poster URL"
        value={formData.poster}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      <input
        type="number"
        name="teamSize"
        placeholder="Team Size"
        value={formData.teamSize}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

      <textarea
        name="rules"
        placeholder="Rules"
        value={formData.rules}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
        rows="3"
      />

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="w-full p-3 bg-gray-800 rounded-lg"
      />

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