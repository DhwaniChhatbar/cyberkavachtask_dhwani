import React, { useEffect, useState } from "react";
import { FaUser, FaStar, FaAward } from "react-icons/fa";
import BadgeCard from "../components/module5/BadgeCard";
import api from "../utils/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        console.log("Current user:", currentUser);

        if (!currentUser?._id) {
          setLoading(false);
          return;
        }

        // USER DETAILS
        const userRes = await api.get(`/users/${currentUser._id}`);
        const userData = userRes.data?.user || userRes.data;

        // DEFAULT VALUES
        let totalPoints = 0;
        let badgeName = null;

        // LEADERBOARD (don't fail whole profile if leaderboard fails)
        try {
          const leaderboardRes = await api.get("/leaderboard");

          const leaderboardData = Array.isArray(leaderboardRes.data)
            ? leaderboardRes.data
            : [];

          const leaderboardUser = leaderboardData.find(
            (item) =>
              String(item.user?._id || item.user?.id) ===
              String(currentUser._id)
          );

          totalPoints = leaderboardUser?.totalPoints || 0;
          badgeName = leaderboardUser?.badge?.name || null;
        } catch (err) {
          console.error("Leaderboard fetch failed:", err);
        }

        const roleBadgeMap = {
          "Faculty Coordinator": "Faculty",
          "Student Coordinator": "Coordinator",
          "Tech Coordinator": "Tech",
          "Content Coordinator": "Content",
          "Social Media Coordinator": "Social",
          Member: "Member",
          Guest: "Guest",
        };

        setProfile({
          ...userData,
          totalPoints,
          badge:
            badgeName ||
            roleBadgeMap[userData?.role] ||
            userData?.role ||
            "Member",
        });
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error.response?.data || error
        );

        // IMPORTANT:
        // Do NOT clear profile on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#111827] rounded-2xl p-8 text-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#111827] rounded-2xl p-8 text-center text-gray-400">
        No user data found
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-[#111827] rounded-2xl shadow-lg p-8 max-w-2xl border border-gray-800">
        <div className="space-y-6">

          <div className="flex items-center gap-4">
            <div className="bg-violet-600 p-4 rounded-full text-2xl">
              <FaUser />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {profile.name || "Unknown"}
              </h2>

              <p className="text-gray-400">
                {profile.role || "No role"}
              </p>
            </div>
          </div>

          <hr className="border-gray-700" />

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-violet-500">
              <div className="flex items-center gap-3">
                <FaStar className="text-violet-400 text-xl" />

                <div>
                  <p className="text-gray-400">Total Points</p>

                  <h3 className="text-2xl font-bold text-violet-400">
                    {profile.totalPoints}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-emerald-500">
              <div className="flex items-center gap-3">
                <FaAward className="text-emerald-400 text-xl" />

                <div>
                  <p className="text-gray-400">Current Badge</p>

                  <h3 className="text-2xl font-bold text-emerald-400">
                    {profile.badge}
                  </h3>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8">
            <BadgeCard
              badge={profile.badge}
              points={profile.totalPoints}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;