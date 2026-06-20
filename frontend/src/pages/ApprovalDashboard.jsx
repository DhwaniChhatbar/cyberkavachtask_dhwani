import React, { useEffect, useState } from "react";
import api from "../utils/api";
import socket from "../socket";
import RequestTable from "../components/module1/RequestTable";
import { useNavigate } from "react-router-dom";

const ApprovalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // =========================
  // ROLE GUARD (IMPORTANT)
  // =========================
  useEffect(() => {
    const allowedRoles = [
      "Admin",
      "Faculty Coordinator",
      "Student Coordinator",
      "Tech Coordinator",
      "Content Coordinator",
      "Social Media Coordinator",
    ];

    if (!user || !allowedRoles.includes(role)) {
      navigate("/dashboard");
    }
  }, []);

  // =========================
  // FETCH REQUESTS
  // =========================
  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests");
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // =========================
    // SOCKET EVENTS
    // =========================
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

  // =========================
  // APPROVE REQUEST
  // =========================
  const handleApprove = async (id) => {
    try {
      await api.put(`/requests/approve/${id}`, {
        comment: "Approved",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // REJECT REQUEST
  // =========================
  const handleReject = async (id) => {
    try {
      await api.put(`/requests/reject/${id}`, {
        comment: "Rejected",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-2">
        Approval Dashboard
      </h1>

      <p className="text-gray-400 mb-6">
        Role: {role}
      </p>

      {loading ? (
        <div className="text-center text-gray-400">
          Loading...
        </div>
      ) : (
        <RequestTable
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ApprovalDashboard;