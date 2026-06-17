import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EventBanner from "./components/module3/EventBanner";

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );

      setEvent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!event)
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <EventBanner
        poster={event.poster}
        name={event.name}
      />

      <h1 className="text-4xl font-bold mt-6">
        {event.name}
      </h1>

      <p className="mt-4 text-gray-400">
        {event.description}
      </p>

      <div className="space-y-3 mt-8">
        <p>📅 Date: {event.date}</p>

        <p>📍 Venue: {event.venue}</p>

        <p>👥 Team Size: {event.teamSize}</p>

        <p>
          ⏳ Registration Deadline:
          {" "}
          {event.registrationDeadline}
        </p>

        <p>📜 Rules: {event.rules}</p>
      </div>
    </div>
  );
};

export default EventDetails;