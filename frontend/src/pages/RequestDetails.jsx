import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimelineCard from "../components/module1/TimelineCard";
import StatusBadge from "../components/ui/StatusBadge";
import api from "../utils/api"; // IMPORTANT FIX

function RequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      {/* TIMELINE */}
      <div className="mt-8">

        <h2 className="text-2xl font-bold mb-4">
          Timeline
        </h2>

        <div className="space-y-4">
          {request.timeline?.length > 0 ? (
            request.timeline.map((item, index) => (
              <TimelineCard
                key={index}
                timeline={item}
              />
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