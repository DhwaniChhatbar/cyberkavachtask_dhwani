import React, { useState } from "react";
import axios from "axios";

const GenerateCertificate = () => {
  const [eventName, setEventName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/certificates",
        {
          eventName,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGeneratedCertificate(res.data);

      setEventName("");
      setUserId("");
    } catch (err) {
      console.error(err);
      alert("Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-8 shadow-lg">

        <h1 className="text-3xl font-bold mb-6">
          Generate Certificate
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-gray-300">
              Event Name
            </label>

            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              className="w-full p-3 rounded-lg bg-gray-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              User ID
            </label>

            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full p-3 rounded-lg bg-gray-800 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading ? "Generating..." : "Generate Certificate"}
          </button>
        </form>

        {generatedCertificate && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Certificate Generated ✅
            </h2>

            <div className="space-y-2">
              <p>
                <strong>Certificate ID:</strong>{" "}
                {generatedCertificate.certificateId}
              </p>

              <p>
                <strong>Event:</strong>{" "}
                {generatedCertificate.eventName}
              </p>

              <p>
                <strong>User:</strong>{" "}
                {generatedCertificate.user}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCertificate;