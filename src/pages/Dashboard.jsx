import React, { useState, useEffect } from "react";
import { FaUsers, FaStar, FaTrophy, FaMedal } from "react-icons/fa";
import StatCard from "../components/module5/StatCard";
import { getLeaderboard } from "../utils/storage";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const load = () => {
    const data = getLeaderboard() || [];
    setUsers(data);
  };

  useEffect(() => {
    load();

    // custom event for local updates
    window.addEventListener("storageUpdate", load);

    return () => {
      window.removeEventListener("storageUpdate", load);
    };
  }, []);

  const totalUsers = users.length;

  const totalPoints = users.reduce(
    (sum, user) => sum + Number(user.points || 0),
    0
  );

  // FIX: avoid crash if empty array
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
          value={topUser?.name || "N/A"}
          icon={<FaTrophy />}
          color="amber"
        />

        <StatCard
          title="Top Score"
          value={topUser?.points || 0}
          icon={<FaMedal />}
          color="red"
        />

      </div>
    </div>
  );
};

export default Dashboard;