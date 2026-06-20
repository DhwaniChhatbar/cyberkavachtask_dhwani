import React, { useEffect, useState } from "react";
import { FaUsers, FaStar, FaTrophy, FaMedal } from "react-icons/fa";
import StatCard from "../components/module5/Statcard";
import api from "../utils/api";
import socket from "../socket";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser?.role;

  const fetchDashboardData = async () => {
    try {
      const leaderboardRes = await api.get("/leaderboard");

      if (Array.isArray(leaderboardRes.data)) {
        setUsers(leaderboardRes.data);
      }

      const usersRes = await api.get("/users");

      if (
        usersRes.data &&
        usersRes.data.users &&
        Array.isArray(usersRes.data.users)
      ) {
        setTotalUsers(usersRes.data.users.length);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    socket.on("leaderboard:update", fetchDashboardData);

    return () => {
      socket.off("leaderboard:update", fetchDashboardData);
    };
  }, []);

  const totalPoints = users.reduce(
    (sum, user) => sum + Number(user.totalPoints || 0),
    0
  );

  const topUser = users.length > 0 ? users[0] : null;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-2">
        Welcome, {currentUser?.name}
      </h1>

      <p className="text-gray-400 mb-8">
        Role : {role}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Users"
          value={totalUsers ?? "Loading..."}
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