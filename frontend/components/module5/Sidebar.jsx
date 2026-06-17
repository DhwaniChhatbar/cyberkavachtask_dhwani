import React from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {
  FaAward,
  FaHistory,
  FaTrophy,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaBell,
  FaCalendar,
  FaCertificate,
  FaChartBar,
  FaShieldAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    // Module 5
    { name: "Dashboard", icon: <MdDashboard />, path: "/" },
    { name: "Assign Points", icon: <FaAward />, path: "/assign-points" },
    { name: "Points History", icon: <FaHistory />, path: "/points-history" },
    { name: "Leaderboard", icon: <FaTrophy />, path: "/leaderboard" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },

    // Module 1
    { name: "Requests", icon: <FaClipboardList />, path: "/request-form" },
    { name: "Request History", icon: <FaHistory />, path: "/request-history" },
    { name: "Notifications", icon: <FaBell />, path: "/notifications" },

    // Module 2
    { name: "Certificates", icon: <FaCertificate />, path: "/certificates" },

    // Module 3
    { name: "Events", icon: <FaCalendar />, path: "/event-dashboard" },

    // Module 6
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Audit Logs", icon: <FaShieldAlt />, path: "/audit-logs" },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-gray-900 text-white shadow-lg">
      <div className="flex flex-col p-4">

        <h2 className="mb-8 text-2xl font-bold tracking-wide">
          CyberKavach
        </h2>

        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-800"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}

          <button
            className="flex items-center gap-4 rounded-xl px-4 py-3 mt-4 hover:bg-red-600"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;