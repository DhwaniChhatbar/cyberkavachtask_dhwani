import React from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {
  FaAward,
  FaHistory,
  FaTrophy,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/" },
    { name: "Assign Points", icon: <FaAward />, path: "/assign-points" },
    { name: "Points History", icon: <FaHistory />, path: "/points-history" },
    { name: "Leaderboard", icon: <FaTrophy />, path: "/leaderboard" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-gray-900 text-white shadow-lg">
      <div className="flex flex-col p-4">

        <h2 className="mb-8 text-2xl font-bold tracking-wide">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-800"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          ))}

          {/* Logout */}
          <button
            className="flex items-center gap-4 rounded-xl px-4 py-3 mt-4 hover:bg-red-600 transition-all duration-200"
            onClick={() => {
              // later: clear token / logout logic
              console.log("Logged out");
            }}
          >
            <span className="text-xl">
              <FaSignOutAlt />
            </span>
            <span className="text-base font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;