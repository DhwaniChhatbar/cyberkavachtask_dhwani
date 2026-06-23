import React from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import TeamForm from "../components/module3/TeamForm";

const TeamRegistration = () => {
  const { eventId } = useParams();

  const handleCreateTeam = async (data) => {
    try {
      await api.post("/teams", {
        ...data,
        event: eventId,
      });

      alert("Team created successfully");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
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