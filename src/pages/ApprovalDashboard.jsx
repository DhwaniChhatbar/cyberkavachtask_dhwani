import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import RequestTable from "../components/module1/RequestTable";

const ApprovalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/requests",
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

  // Socket.io real-time updates
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

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/requests/approve/${id}`,
        {
          comment: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/requests/reject/${id}`,
        {
          comment: "Rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Approval Dashboard
      </h1>

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