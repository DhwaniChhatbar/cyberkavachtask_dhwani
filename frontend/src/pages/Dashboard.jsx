import React, { useEffect, useState } from "react";
import { FaUsers, FaStar, FaTrophy, FaMedal } from "react-icons/fa";
import StatCard from "../components/module5/Statcard";
import api from "../utils/api";
import socket from "../socket";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  // ==========================
  // FETCH FROM BACKEND
  // ==========================
  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/leaderboard");
      setUsers(res.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  // ==========================
  // INIT LOAD + SOCKET SYNC
  // ==========================
  useEffect(() => {
    // initial load
    fetchDashboardData();

    // realtime update from backend
    socket.on("leaderboard:update", fetchDashboardData);

    // cleanup
    return () => {
      socket.off("leaderboard:update", fetchDashboardData);
    };
  }, []);

  // ==========================
  // STATS CALCULATIONS
  // ==========================
  const totalUsers = users.length;

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