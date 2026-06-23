import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import TeamForm from "../components/module3/TeamForm";

const TeamRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleCreateTeam = async (data) => {
    try {
      if (!eventId) {
        alert("Event ID not found");
        return;
      }

      const payload = {
        ...data,
        event: eventId,
      };

      const res = await api.post("/teams", payload);

      alert(
        res.data?.message || "Team created successfully"
      );

      navigate("/my-teams");
    } catch (err) {
      console.error("Team registration error:", err);

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create team"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Team Registration
      </h1>

      <TeamForm onSubmit={handleCreateTeam} />
    </div>
  );
};

export default TeamRegistration;