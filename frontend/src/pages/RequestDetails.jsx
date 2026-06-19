import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimelineCard from "../components/module1/TimelineCard";
import StatusBadge from "../components/ui/StatusBadge";
import api from "../utils/api";

function RequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");

  // FIX: direct read (no async state issue)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/requests/${id}`);
      setRequest(res.data);

    } catch (error) {
      console.log(error);
      setError("Failed to load request");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.put(`/requests/approve/${id}`, { comment });
      setComment("");
      fetchRequest();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/requests/reject/${id}`, { comment });
      setComment("");
      fetchRequest();
    } catch (err) {
      console.log(err);
    }
  };

  // FIX: direct role check (NO helper function)
  const canApprove = [
    "Admin",
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
  ].includes(currentUser.role);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-red-400 flex justify-center items-center">
        {error}
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
        Request not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* DETAILS CARD */}
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">

        <h1 className="text-3xl font-bold mb-4">
          Request Details
        </h1>

        <div className="space-y-4">

          <div>
            <h2 className="text-xl font-semibold">
              {request.title}
            </h2>

            <p className="text-gray-400 mt-2">
              {request.description}
            </p>
          </div>

          <div>
            <span className="font-semibold">Status:</span>{" "}
            <StatusBadge status={request.status} />
          </div>

          <div>
            <span className="font-semibold">Created By:</span>{" "}
            {request.createdBy?.name || "Unknown"}
          </div>

          <div>
            <span className="font-semibold">Current Stage:</span>{" "}
            {request.currentStage}
          </div>
        </div>
      </div>

      {/* APPROVAL PANEL */}
      {canApprove && request.status === "Under Review" && (
        <div className="mt-6 bg-gray-900 p-4 rounded-xl">

          <textarea
            className="w-full p-3 bg-gray-800 rounded-lg"
            placeholder="Add comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-3 mt-3">

            <button
              onClick={handleApprove}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              Approve
            </button>

            <button
              onClick={handleReject}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              Reject
            </button>

          </div>
        </div>
      )}

      {/* TIMELINE */}
      <div className="mt-8">

        <h2 className="text-2xl font-bold mb-4">
          Timeline
        </h2>

        <div className="space-y-4">
          {request.timeline?.length > 0 ? (
            request.timeline.map((item, index) => (
              <TimelineCard key={index} timeline={item} />
            ))
          ) : (
            <p className="text-gray-400">
              No timeline available
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default RequestDetails;