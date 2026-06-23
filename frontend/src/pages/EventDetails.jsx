import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import EventBanner from "../components/module3/EventBanner";

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading Event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Event not found
      </div>
    );
  }

  const remainingSlots =
    (event.capacity || 0) - (event.registrationCount || 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <EventBanner poster={event.poster} name={event.name} />

      <div className="mt-8 bg-gray-900 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-4">{event.name}</h1>

        <p className="text-gray-400 mb-8">
          {event.description || "No description available"}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p>
              📅 <span className="font-semibold">Date:</span>{" "}
              {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
            </p>

            <p>
              ⏰ <span className="font-semibold">Time:</span>{" "}
              {event.time || "N/A"}
            </p>

            <p>
              📍 <span className="font-semibold">Venue:</span>{" "}
              {event.venue || "N/A"}
            </p>

            <p>
              👥 <span className="font-semibold">Team Size:</span>{" "}
              {event.teamSize ?? 1}
            </p>

            <p>
              👤 <span className="font-semibold">Event Type:</span>{" "}
              {event.eventType}
            </p>

            <p>
              🏷️ <span className="font-semibold">Category:</span>{" "}
              {event.category || "General"}
            </p>
          </div>

          <div className="space-y-4">
            <p>
              📜 <span className="font-semibold">Rules:</span>{" "}
              {event.rules || "No rules specified"}
            </p>

            <p>
              ⏳{" "}
              <span className="font-semibold">
                Registration Deadline:
              </span>{" "}
              {event.registrationDeadline
                ? new Date(event.registrationDeadline).toLocaleDateString()
                : "N/A"}
            </p>

            <p>
              📊 <span className="font-semibold">Registrations:</span>{" "}
              {event.registrationCount || 0}
            </p>

            <p>
              👥 <span className="font-semibold">Capacity:</span>{" "}
              {event.capacity}
            </p>

            <p>
              🟢 <span className="font-semibold">Remaining Slots:</span>{" "}
              {remainingSlots > 0 ? remainingSlots : 0}
            </p>

            <p>
              🚀 <span className="font-semibold">Status:</span>{" "}
              {event.status}
            </p>

            <p>
              🎓 <span className="font-semibold">
                Certificates Enabled:
              </span>{" "}
              {event.certificatesEnabled ? "Yes" : "No"}
            </p>

            <p>
              ✅ <span className="font-semibold">Completed:</span>{" "}
              {event.isCompleted ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {event.tags?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>

            <div className="flex flex-wrap gap-3">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-600 px-4 py-2 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-5 rounded-xl">
            <div className="text-gray-400 text-sm">
              Registration Progress
            </div>

            <div className="text-3xl font-bold text-blue-400 mt-2">
              {event.registrationCount || 0}/{event.capacity}
            </div>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <div className="text-gray-400 text-sm">Workflow Status</div>
            <div className="text-2xl font-bold text-green-400 mt-2">
              {event.status}
            </div>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <div className="text-gray-400 text-sm">Created Date</div>
            <div className="text-xl font-bold mt-2">
              {new Date(event.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;