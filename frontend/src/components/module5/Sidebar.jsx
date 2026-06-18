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
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Menu items with role permissions
  const menuItems = [
    // Module 5
    {
      name: "Dashboard",
      icon: <MdDashboard />,
      path: "/dashboard",
      roles: ["Admin", "Member"],
    },
    {
      name: "Assign Points",
      icon: <FaAward />,
      path: "/assign-points",
      roles: ["Admin"],
    },
    {
      name: "Points History",
      icon: <FaHistory />,
      path: "/points-history",
      roles: ["Admin", "Member"],
    },
    {
      name: "Leaderboard",
      icon: <FaTrophy />,
      path: "/leaderboard",
      roles: ["Admin", "Member"],
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile",
      roles: ["Admin", "Member"],
    },

    // Module 1
    {
      name: "Requests",
      icon: <FaClipboardList />,
      path: "/request-form",
      roles: ["Admin", "Member"],
    },
    {
      name: "Request History",
      icon: <FaHistory />,
      path: "/request-history",
      roles: ["Admin", "Member"],
    },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
      roles: ["Admin", "Member"],
    },

    // Module 2
    {
      name: "Certificates",
      icon: <FaCertificate />,
      path: "/certificates",
      roles: ["Admin", "Member"],
    },

    // Module 3
    {
      name: "Events",
      icon: <FaCalendar />,
      path: "/event-dashboard",
      roles: ["Admin", "Member"],
    },

    // Module 6 (Admin only)
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/analytics",
      roles: ["Admin"],
    },
    {
      name: "Audit Logs",
      icon: <FaShieldAlt />,
      path: "/admin",
      roles: ["Admin"],
    },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-gray-900 text-white shadow-lg">
      <div className="flex flex-col p-4">
        <h2 className="mb-8 text-2xl font-bold tracking-wide">
          CyberKavach
        </h2>

        <nav className="flex flex-col gap-3">
          {menuItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-800 transition"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

          {/* Logout */}
          <button
            className="flex items-center gap-4 rounded-xl px-4 py-3 mt-4 hover:bg-red-600 transition"
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