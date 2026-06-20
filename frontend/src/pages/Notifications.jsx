import React, { useEffect, useState } from "react";
import api from "../utils/api";
import socket from "../socket";
import NotificationPanel from "../components/module1/NotificationPanel";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      // Handle both formats safely
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.notifications || [];

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socket.on("requestUpdated", (request) => {
      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: `${request.title} is now ${request.status}`,
          type: "Status Update",
          createdAt: new Date(),
        },
        ...prev,
      ]);
    });

    socket.on("requestCreated", (request) => {
      setNotifications((prev) => [
        {
          _id: Date.now() + 1,
          message: `New request created: ${request.title}`,
          type: "Request",
          createdAt: new Date(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
      socket.off("requestUpdated");
      socket.off("requestCreated");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Notifications
        </h1>

        {loading ? (
          <div className="text-gray-400 text-center">
            Loading...
          </div>
        ) : (
          <NotificationPanel notifications={notifications} />
        )}
      </div>
    </div>
  );
};

export default Notifications;