import React, { useEffect, useState } from "react";
import api from "../utils/api";
import LeaderboardCard from "../components/module5/LeaderboardCard";
import { useUsers } from "../context/UserContext";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 context trigger (this is the fix)
  const { users: localUsers } = useUsers();

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leaderboard");
      setUsers(res.data);
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // 🔥 AUTO REFRESH when points change in context
  useEffect(() => {
    if (localUsers.length > 0) {
      fetchLeaderboard();
    }
  }, [localUsers]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Leaderboard
      </h1>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : users.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-6 text-gray-400">
          No users found.
        </div>
      ) : (
        <div className="grid gap-4">
          {users
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((item) => (
              <LeaderboardCard
                key={item.user?._id || item.rank}
                rank={item.rank}
                name={item.user?.name || "Unknown"}
                role={item.user?.role || "-"}
                totalPoints={item.totalPoints}
                contributions={item.contributions}
                badgeName={item.badge?.name || "No Badge"}
                badgeIcon={item.badge?.icon || "🏅"}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;