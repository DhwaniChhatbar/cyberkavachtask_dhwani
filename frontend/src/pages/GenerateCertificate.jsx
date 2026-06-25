import React, { useEffect, useState } from "react";
import api from "../utils/api";

const GenerateCertificate = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    fetchEventUsers();
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data || []);
    } catch (error) {
      setEvents([]);
    }
  };

  const fetchEventUsers = async () => {
    try {
      const res = await api.get(`/events/${selectedEvent}/users`);
      setUsers(res.data || []);
    } catch (error) {
      setUsers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const event = events.find(
        (ev) => ev._id === selectedEvent
      );

      const res = await api.post("/certificates", {
        event: selectedEvent,
        eventName: event?.name,
        user: selectedUser,
      });

      setGeneratedCertificate(res.data.certificate);

      setSelectedEvent("");
      setSelectedUser("");
      setUsers([]);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to generate certificate"
      );
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
              Select Event
            </label>

            <select
              value={selectedEvent}
              onChange={(e) =>
                setSelectedEvent(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-gray-800 outline-none"
              required
            >
              <option value="">
                Choose an event
              </option>

              {events.map((event) => (
                <option
                  key={event._id}
                  value={event._id}
                >
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Select User
            </label>

            <select
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-gray-800 outline-none"
              required
            >
              <option value="">
                Choose a user
              </option>

              {users.length === 0 ? (
                <option disabled>
                  No users in this event
                </option>
              ) : (
                users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name} ({user.role})
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Generating..."
              : "Generate Certificate"}
          </button>
        </form>

        {generatedCertificate && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Certificate Generated ✅
            </h2>

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
              {generatedCertificate.user?.name ||
                generatedCertificate.displayName ||
                "N/A"}
            </p>

            <p>
              <strong>Type:</strong>{" "}
              {generatedCertificate.type}
            </p>

            <p>
              <strong>Issued At:</strong>{" "}
              {generatedCertificate.createdAt
                ? new Date(
                    generatedCertificate.createdAt
                  ).toLocaleString()
                : "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCertificate;