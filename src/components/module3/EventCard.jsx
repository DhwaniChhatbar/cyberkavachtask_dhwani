import React from "react";

const EventCard = ({ event }) => {
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
          <p>📅 {event.date}</p>

          <p>📍 {event.venue}</p>

          <p>👥 Team Size: {event.teamSize}</p>

          <p>
            ⏳ Registration Deadline:
            {" "}
            {event.registrationDeadline}
          </p>
        </div>

        <div className="mt-5">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              event.status === "Published"
                ? "bg-green-600"
                : "bg-yellow-600"
            }`}
          >
            {event.status || "Draft"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;