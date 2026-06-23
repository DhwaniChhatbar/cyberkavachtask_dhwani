import React, { useEffect, useState } from "react";
import api from "../utils/api";
import TeamCard from "../components/module3/TeamCard";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { exportToExcel } from "../utils/exportExcel";

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();

    socket.on("team-created", (newTeam) => {
      setTeams((prev) => [newTeam, ...prev]);
    });

    return () => {
      socket.off("team-created");
    };
  }, []);

  const deleteTeam = async (id) => {
    try {
      await api.delete(`/teams/${id}`);

      setTeams((prev) =>
        prev.filter((team) => team._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const reuseTeam = (team) => {
    navigate(`/team-registration/${team.event?._id}`, {
      state: {
        teamName: team.teamName,
        previousEvent: team.previousEvent,
        leaderDetails: team.leaderDetails,
        members:
          team.members
            ?.filter((member) => !member.isLeader)
            .map((member) => ({
              fullName: member.fullName,
              email: member.email,
              collegeId: member.collegeId,
              department: member.department,
              institute: member.institute,
            })) || [],
      },
    });
  };

  const handleExport = () => {
    const exportData = teams.map((team) => ({
      TeamName: team.teamName,
      TeamID: team.teamId,
      Event: team.event?.name || "N/A",

      LeaderName: team.leaderDetails?.fullName || "",
      LeaderEmail: team.leaderDetails?.email || "",
      LeaderCollegeID: team.leaderDetails?.collegeId || "",
      LeaderDepartment: team.leaderDetails?.department || "",
      LeaderInstitute: team.leaderDetails?.institute || "",

      Members:
        team.members
          ?.map(
            (member) =>
              `${member.fullName} (${member.email})`
          )
          .join(", ") || "",

      Status: team.status,
      CreatedAt: team.createdAt,
    }));

    exportToExcel(exportData, "teams.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          My Teams
        </h1>

        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
        >
          Export Excel
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">
          Loading teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="text-gray-400">
          No teams found.
        </div>
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