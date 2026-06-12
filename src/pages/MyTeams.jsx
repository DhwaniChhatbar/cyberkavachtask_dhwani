import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamCard from "../components/module3/TeamCard";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { exportToExcel } from "../utils/exportExcel";

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teams");
      setTeams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();

    // 🔥 REAL-TIME TEAM UPDATE
    socket.on("team-created", (newTeam) => {
      setTeams((prev) => [newTeam, ...prev]);
    });

    return () => {
      socket.off("team-created");
    };
  }, []);

  // Delete team
  const deleteTeam = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`);
      setTeams((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Reuse team
  const reuseTeam = (team) => {
    navigate("/team-registration", {
      state: {
        teamName: team.teamName,
        members: team.members,
        previousEvent: team.eventName,
      },
    });
  };

  // 📊 EXPORT TO EXCEL
  const handleExport = () => {
    const exportData = teams.map((team) => ({
      TeamName: team.teamName,
      TeamID: team.teamId,
      Event: team.eventName,
      Leader: team.leaderName,
      Email: team.leaderEmail,
      Members: team.members?.join(", "),
      Status: team.status,
      CreatedAt: team.createdAt,
    }));

    exportToExcel(exportData, "teams.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Teams</h1>

        {/* EXPORT BUTTON */}
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
        >
          Export Excel
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-gray-400">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="text-gray-400">No teams found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {teams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              onDelete={deleteTeam}
              onReuse={reuseTeam}
            />
          ))}

        </div>
      )}
    </div>
  );
};

export default MyTeams;