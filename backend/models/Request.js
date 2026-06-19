import React, { useState } from "react";
import api from "../utils/api";

const RequestFormPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/requests", formData);

      alert("Request submitted successfully!");

      setFormData({
        title: "",
        type: "",
        description: "",
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to submit request"
      );
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

        {error && (
          <div className="bg-red-600 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="block mb-2">Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              required
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="block mb-2">Request Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              required
            >
              <option value="">Select Type</option>

              <option value="Event Permission">
                Event Permission
              </option>

              <option value="Resource Request">
                Resource Request
              </option>

              <option value="Budget Approval">
                Budget Approval
              </option>

              <option value="Social Media Approval">
                Social Media Approval
              </option>

              <option value="Content Approval">
                Content Approval
              </option>

              <option value="Certificate Approval">
                Certificate Approval
              </option>

              <option value="Collaboration Request">
                Collaboration Request
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2">Description</label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              required
            />
          </div>

          {/* BUTTON */}
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