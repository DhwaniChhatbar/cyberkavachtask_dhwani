import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../utils/storage";
import LeaderboardCard from "../components/module5/LeaderboardCard";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  const load = () => {
    setUsers(getLeaderboard());
  };

  useEffect(() => {
    load();

    window.addEventListener("storageUpdate", load);

    return () => {
      window.removeEventListener("storageUpdate", load);
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Leaderboard
      </h1>

      {users.length === 0 ? (
        <div className="bg-[#111827] rounded-xl p-6 text-gray-400">
          No users found.
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user, index) => (
            <LeaderboardCard
              key={user.name}
              rank={index + 1}
              name={user.name}
              points={user.points}
              badge={user.badge}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;