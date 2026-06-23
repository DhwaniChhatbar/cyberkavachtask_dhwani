import React, { useEffect, useState } from "react";
import api from "../utils/api";
import EventCard from "../components/module3/EventCard";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let data = [...events];

    if (search) {
      data = data.filter(
        (event) =>
          event.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          event.category
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      data = data.filter(
        (event) => event.category === categoryFilter
      );
    }

    setFilteredEvents(data);
  }, [events, search, categoryFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/events");

      setEvents(res.data || []);
      setFilteredEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category)),
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          Events
        </h1>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none"
          >
            {categories.map((category, index) => (
              <option key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-gray-400">
          No events found.
        </div>
      ) : (
        <>
          <div className="mb-6 text-gray-400">
            Total Events : {filteredEvents.length}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventList;