import React, { useState } from "react";
import axios from "axios";

const RequestFormPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/requests",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Request submitted successfully!");

      setFormData({
        title: "",
        type: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center p-6">
      <div className="bg-gray-900 w-full max-w-2xl rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6">
          Create Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Request Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              required
            >
              <option value="">Select Type</option>
              <option value="Event">Event</option>
              <option value="Budget">Budget</option>
              <option value="Purchase">Purchase</option>
              <option value="Permission">Permission</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestFormPage;