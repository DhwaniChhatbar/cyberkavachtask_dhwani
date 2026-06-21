import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/module3/EventCard";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/events"
      );

      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Events
      </h1>

      {loading ? (
        <div className="text-gray-400">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-gray-400">
          No events found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default EventList;