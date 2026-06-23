import React from "react";
import api from "../utils/api";
import EventForm from "../components/module3/EventForm";

const CreateEvent = () => {
  const handleCreateEvent = async (formData) => {
    try {
      // ensure capacity is number (important fix)
      if (formData.get) {
        const capacity = formData.get("capacity");
        if (capacity) {
          formData.set("capacity", Number(capacity));
        }
      }

      const res = await api.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event created successfully");
      console.log(res.data);
    } catch (error) {
      console.error("Error creating event:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create event"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Event
      </h1>

      <EventForm onSubmit={handleCreateEvent} />
    </div>
  );
};

export default CreateEvent;