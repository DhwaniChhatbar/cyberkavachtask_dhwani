import React, { useEffect, useState } from "react";
import RequestCard from "../components/module1/RequestCard";
import socket from "../socket";
import api from "../utils/api";

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // FETCH REQUESTS
  // =========================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/requests/my");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // SOCKET REAL-TIME UPDATES
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (request) => {
      setRequests((prev) => {
        const exists = prev.find((r) => r._id === request._id);

        if (exists) return prev;

        return [request, ...prev];
      });
    };

    const handleUpdated = (updatedRequest) => {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === updatedRequest._id
            ? updatedRequest
            : r
        )
      );
    };

    socket.on("requestCreated", handleCreated);
    socket.on("requestUpdated", handleUpdated);

    return () => {
      socket.off("requestCreated", handleCreated);
      socket.off("requestUpdated", handleUpdated);
    };
  }, []);

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Request History
      </h1>

      {loading && (
        <div className="text-gray-400">
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-400">
          {error}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-gray-400">
          No requests found.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {requests.map((request) => (
          <RequestCard
            key={request._id}
            request={request}
            onApprove={() => {}}
            onReject={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default RequestHistory;