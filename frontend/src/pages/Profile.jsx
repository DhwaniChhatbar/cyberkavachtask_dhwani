import React, { useEffect, useState } from "react";
import { FaUser, FaStar, FaAward } from "react-icons/fa";
import BadgeCard from "../components/module5/BadgeCard";
import api from "../utils/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Logged-in user
        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) return;

        // Get latest user details
        const userRes = await api.get(`/users/${currentUser._id}`);

        // Get leaderboard data
        const leaderboardRes = await api.get("/leaderboard");

        // Find current user in leaderboard
        const leaderboardUser = leaderboardRes.data.find(
          (item) => item.user?._id === currentUser._id
        );

        setProfile({
          ...userRes.data.user,
          totalPoints: leaderboardUser?.totalPoints || 0,
          badge:
            leaderboardUser?.badge?.name ||
            leaderboardUser?.badge ||
            "Member",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

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
          {/* User Header */}
          <div className="flex items-center gap-4">
            <div className="bg-violet-600 p-4 rounded-full text-2xl">
              <FaUser />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>

              <p className="text-gray-400">{profile.role}</p>
            </div>
          </div>

          <hr className="border-gray-700" />

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-violet-500">
              <div className="flex items-center gap-3">
                <FaStar className="text-violet-400 text-xl" />

                <div>
                  <p className="text-gray-400">Email</p>

                  <h3 className="text-lg font-bold text-violet-400">
                    {profile.email}
                  </h3>
                </div>
              </div>
            </div>

            {/* Approval */}
            <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-emerald-500">
              <div className="flex items-center gap-3">
                <FaAward className="text-emerald-400 text-xl" />

                <div>
                  <p className="text-gray-400">Status</p>

                  <h3 className="text-lg font-bold text-emerald-400">
                    {profile.isApproved ? "Approved" : "Pending"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Total Points */}
            <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-amber-500">
              <div className="flex items-center gap-3">
                <FaStar className="text-amber-400 text-xl" />

                <div>
                  <p className="text-gray-400">Total Points</p>

                  <h3 className="text-2xl font-bold text-amber-400">
                    {profile.totalPoints}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Badge */}
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