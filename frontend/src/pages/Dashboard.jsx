import React, { useEffect, useState } from "react";
import { FaUsers, FaStar, FaTrophy, FaMedal } from "react-icons/fa";
import StatCard from "../components/module5/Statcard";
import api from "../utils/api";
import socket from "../socket";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState("Loading...");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser?.role;

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/count");

      if (res.data?.success) {
        setTotalUsers(res.data.count);
      }
    } catch (error) {
      console.error("Users fetch error:", error);
      setTotalUsers("N/A");
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    if (role !== "Member") {
      fetchUsers();
    }

    socket.on("leaderboard:update", fetchLeaderboard);

    return () => {
      socket.off("leaderboard:update", fetchLeaderboard);
    };
  }, []);

  const totalPoints = users.reduce(
    (sum, user) => sum + Number(user.totalPoints || 0),
    0
  );

  const topUser = users.length > 0 ? users[0] : null;

  const myEntry = users.find(
    (u) =>
      u.user?._id === currentUser?._id ||
      u.user?.email === currentUser?.email
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {currentUser?.name}
      </h1>

      <p className="text-gray-400 mb-8">
        Role : {role}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        {role !== "Member" ? (
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<FaUsers />}
            color="emerald"
          />
        ) : (
          <StatCard
            title="My Points"
            value={myEntry?.totalPoints || 0}
            icon={<FaStar />}
            color="emerald"
          />
        )}

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