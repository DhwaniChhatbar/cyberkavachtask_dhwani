import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import BadgeCard from "./TempBadgeCard";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      // TEMPORARY: replace with real logged-in user id after auth frontend integration
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await api.get(`/user-badges/${userId}`);
      setBadges(res.data);
    } catch (error) {
      console.error("Badge fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Badges
      </h1>

      {loading ? (
        <div className="text-gray-400">
          Loading...
        </div>
      ) : badges.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-6 text-gray-400">
          No badges earned yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {badges.map((item) => (
            <div key={item._id}>
              <BadgeCard
                badge={item.badge?.name}
                points={item.badge?.minPoints}
              />

              <div className="mt-2 text-sm text-gray-400">
                {item.badge?.description}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Unlocked on{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Badges;