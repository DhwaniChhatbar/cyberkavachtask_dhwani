import React, { useEffect, useState } from "react";
import { FaUsers, FaStar, FaTrophy, FaMedal } from "react-icons/fa";
import StatCard from "../components/module5/Statcard";
import api from "../utils/api";
import socket from "../socket";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // ==========================
  // FETCH FROM BACKEND
  // ==========================
  const fetchDashboardData = async () => {
    try {
      // Leaderboard data
      const leaderboardRes = await api.get("/leaderboard");
      setUsers(leaderboardRes.data);

      // Registered users count
      const usersRes = await api.get("/users");
      setTotalUsers(usersRes.data.users.length);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  // ==========================
  // INIT LOAD + SOCKET SYNC
  // ==========================
  useEffect(() => {
    // Initial load
    fetchDashboardData();

    // Realtime updates
    socket.on("leaderboard:update", fetchDashboardData);

    // Cleanup
    return () => {
      socket.off("leaderboard:update", fetchDashboardData);
    };
  }, []);

  // ==========================
  // STATS CALCULATIONS
  // ==========================
  const totalPoints = users.reduce(
    (sum, user) => sum + Number(user.totalPoints || 0),
    0
  );

  const topUser = users.length > 0 ? users[0] : null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<FaUsers />}
          color="emerald"
        />

        <StatCard
          title="Total Points"
          value={totalPoints}
          icon={<FaStar />}
          color="violet"
        />

        <StatCard
          title="Top User"
          value={topUser?.user?.name || "N/A"}
          icon={<FaTrophy />}
          color="amber"
        />

        <StatCard
          title="Top Score"
          value={topUser?.totalPoints || 0}
          icon={<FaMedal />}
          color="red"
        />

      </div>
    </div>
  );
};

export default Dashboard;