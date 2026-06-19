import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/module5/Layout";
import RequestCard from "../components/module1/RequestCard";
import api from "../utils/api";
import socket from "../socket";

const RequestHistoryPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // FETCH (ROLE BASED FIX)
  // =========================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const isCoordinator = [
        "Admin",
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
      ].includes(user?.role?.trim());

      const url = isCoordinator ? "/requests" : "/requests/my";

      const res = await api.get(url);

      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // SOCKET UPDATES
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (newRequest) => {
      setRequests((prev) => {
        const exists = prev.find((r) => r._id === newRequest._id);
        if (exists) return prev;
        return [newRequest, ...prev];
      });
    };

    const handleUpdated = (updatedRequest) => {
      setRequests((prev) =>
        prev.map((req) =>
          req._id === updatedRequest._id
            ? updatedRequest
            : req
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
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6">

        <h1 className="text-3xl font-bold mb-6">
          Request History
        </h1>

        {loading && (
          <div className="text-gray-400">
            Loading requests...
          </div>
        )}

        {error && (
          <div className="text-red-400 mb-4">
            {error}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-gray-400">
            No requests found.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {requests.map((request) => (
            <div
              key={request._id}
              onClick={() =>
                navigate(`/requests/${request._id}`)
              }
              className="cursor-pointer"
            >
              <RequestCard request={request} />
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default RequestHistoryPage;