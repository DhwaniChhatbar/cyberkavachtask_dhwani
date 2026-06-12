import React, { useEffect, useState } from "react";
import axios from "axios";
import RequestCard from "../components/module1/RequestCard";
import socket from "../socket";

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/requests/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    socket.on("requestCreated", (request) => {
      setRequests((prev) => [request, ...prev]);
    });

    socket.on("requestUpdated", (updatedRequest) => {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === updatedRequest._id ? updatedRequest : r
        )
      );
    });

    return () => {
      socket.off("requestCreated");
      socket.off("requestUpdated");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Request History
      </h1>

      {loading ? (
        <div className="text-center text-gray-400">
          Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-400">
          No requests found.
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default RequestHistory;