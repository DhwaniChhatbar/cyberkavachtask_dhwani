import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TimelineCard from "../components/module1/TimelineCard";
import StatusBadge from "../components/ui/StatusBadge";

function RequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequest(res.data);
    } catch (error) {
      console.log(error);
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

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
        Request not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
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
            <span className="font-semibold">
              Status:
            </span>{" "}
            <StatusBadge status={request.status} />
          </div>

          <div>
            <span className="font-semibold">
              Created By:
            </span>{" "}
            {request.createdBy?.name}
          </div>

          <div>
            <span className="font-semibold">
              Current Stage:
            </span>{" "}
            {request.currentStage}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Timeline
        </h2>

        <div className="space-y-4">
          {request.timeline?.map((item, index) => (
            <TimelineCard
              key={index}
              timeline={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;