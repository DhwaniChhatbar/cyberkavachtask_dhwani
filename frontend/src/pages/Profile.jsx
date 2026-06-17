import React, { useState, useEffect } from "react";
import { FaUser, FaStar, FaAward } from "react-icons/fa";
import { getLeaderboard } from "../utils/storage";
import BadgeCard from "../components/module5/TempBadgeCard";

const Profile = () => {
  const [user, setUser] = useState(null);

  const loadData = () => {
    const users = getLeaderboard();
    setUser(users[0] || null);
  };

  useEffect(() => {
    loadData();

    window.addEventListener("storageUpdate", loadData);

    return () => {
      window.removeEventListener("storageUpdate", loadData);
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Profile
      </h1>

      {!user ? (
        <div className="bg-[#111827] rounded-2xl p-8 text-center text-gray-400">
          No user data found
        </div>
      ) : (
        <div className="bg-[#111827] rounded-2xl shadow-lg p-8 max-w-2xl border border-gray-800">
          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <div className="bg-violet-600 p-4 rounded-full text-2xl">
                <FaUser />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {user.name}
                </h2>

                <p className="text-gray-400">
                  Club Member
                </p>
              </div>
            </div>

            <hr className="border-gray-700" />

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-violet-500">
                <div className="flex items-center gap-3">
                  <FaStar className="text-violet-400 text-xl" />

                  <div>
                    <p className="text-gray-400">
                      Total Points
                    </p>

                    <h3 className="text-2xl font-bold text-violet-400">
                      {user.points}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-emerald-500">
                <div className="flex items-center gap-3">
                  <FaAward className="text-emerald-400 text-xl" />

                  <div>
                    <p className="text-gray-400">
                      Current Badge
                    </p>

                    <h3 className="text-2xl font-bold text-emerald-400">
                      {user.badge}
                    </h3>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Achievement
              </h2>

              <BadgeCard
                badge={user.badge}
                points={user.points}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;