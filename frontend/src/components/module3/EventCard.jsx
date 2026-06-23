import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800">
      {/* Poster */}
      <img
        src={
          event.poster ||
          "https://via.placeholder.com/600x300?text=Event+Poster"
        }
        alt={event.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h2 className="text-2xl font-bold text-white">
          {event.name}
        </h2>

        <p className="text-gray-400 mt-2">
          {event.description}
        </p>

        <div className="mt-4 space-y-2 text-sm text-gray-300">
          <p>
            📅{" "}
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : "N/A"}
          </p>

          <p>📍 {event.venue || "N/A"}</p>

          <p>👥 Team Size: {event.teamSize || 1}</p>

          <p>
            ⏳ Registration Deadline:{" "}
            {event.registrationDeadline
              ? new Date(
                  event.registrationDeadline
                ).toLocaleDateString()
              : "N/A"}
          </p>

          <p>
            👤 Registrations:{" "}
            {event.registrationCount || 0}
          </p>
        </div>

        {/* Status */}
        <div className="mt-5 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              event.status === "Published"
                ? "bg-green-600"
                : event.status === "Approved by Faculty"
                ? "bg-blue-600"
                : event.status === "Pending Faculty Review"
                ? "bg-yellow-600"
                : "bg-gray-700"
            }`}
          >
            {event.status || "Draft"}
          </span>

          {/* Register button only for published events */}
          {event.status === "Published" && (
            <button
              onClick={() =>
                navigate(`/register-team/${event._id}`)
              }
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