import React from "react";
import axios from "axios";
import TeamForm from "../components/module3/TeamForm";

const TeamRegistration = () => {

  const handleCreateTeam = async (data) => {
    try {
      await axios.post(
        "http://localhost:5000/api/teams",
        data
      );

      alert("Team created successfully");
    } catch (err) {
      console.error(err);
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