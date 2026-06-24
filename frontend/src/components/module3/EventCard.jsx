import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  if (!event) return null;

  // =========================
  // SAFE STATUS HANDLING
  // =========================
  const status =
    event.status ||
    event.eventStatus ||
    "Draft";

  // =========================
  // SAFE IMAGE HANDLING
  // =========================
  const posterSrc =
    event.poster?.startsWith("http")
      ? event.poster
      : event.poster
      ? `${import.meta.env.VITE_API_URL}/${event.poster}`
      : "https://via.placeholder.com/600x300?text=Event+Poster";

  // =========================
  // SAFE DATE HANDLING
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  // =========================
  // SAFE REG COUNT
  // =========================
  const registrationCount =
    event.registrationCount ??
    event.registrations?.length ??
    0;

  // =========================
  // SAFE TEAM SIZE
  // =========================
  const teamSize = event.teamSize || event.maxTeamSize || 1;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800">
      {/* Poster */}
      <img
        src={posterSrc}
        alt={event.name || "Event"}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h2 className="text-2xl font-bold text-white">
          {event.name || "Untitled Event"}
        </h2>

        <p className="text-gray-400 mt-2">
          {event.description || "No description available"}
        </p>

        <div className="mt-4 space-y-2 text-sm text-gray-300">
          <p>📅 {formatDate(event.date)}</p>

          <p>📍 {event.venue || "N/A"}</p>

          <p>👥 Team Size: {teamSize}</p>

          <p>
            ⏳ Registration Deadline:{" "}
            {formatDate(event.registrationDeadline)}
          </p>

          <p>👤 Registrations: {registrationCount}</p>
        </div>

        {/* Status */}
        <div className="mt-5 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              status === "Published"
                ? "bg-green-600"
                : status === "Faculty Approved"
                ? "bg-blue-600"
                : status === "Pending Faculty Review"
                ? "bg-yellow-600"
                : "bg-gray-700"
            }`}
          >
            {status}
          </span>

          {status === "Published" && (
            <button
              onClick={() => navigate(`/register-team/${event._id}`)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;