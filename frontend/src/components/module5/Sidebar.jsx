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
  FaCheckCircle,
  FaPlusCircle,
} from "react-icons/fa";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const menuItems = [
    // Dashboard
    {
      name: "Dashboard",
      icon: <MdDashboard />,
      path: "/dashboard",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    // Leaderboard
    {
      name: "Leaderboard",
      icon: <FaTrophy />,
      path: "/leaderboard",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    // Profile
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    // Requests
    {
      name: "Requests",
      icon: <FaClipboardList />,
      path: "/request-form",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    {
      name: "Approvals",
      icon: <FaCheckCircle />,
      path: "/approvals",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
      ],
    },

    {
      name: "Request History",
      icon: <FaHistory />,
      path: "/request-history",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    // Certificates
    {
      name: "Certificates",
      icon: <FaCertificate />,
      path: "/certificates",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Social Media Coordinator",
        "Member",
      ],
    },

    {
      name: "Generate Certificate",
      icon: <FaCertificate />,
      path: "/generate-certificate",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
      ],
    },

    // Events
    {
      name: "Events",
      icon: <FaCalendar />,
      path: "/event-dashboard",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Member",
      ],
    },

    {
      name: "Create Event",
      icon: <FaPlusCircle />,
      path: "/create-event",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
      ],
    },

    // Student + Faculty
    {
      name: "Points History",
      icon: <FaHistory />,
      path: "/points-history",
      roles: [
        "Faculty Coordinator",
        "Student Coordinator",
      ],
    },

    // Faculty only
    {
      name: "Assign Points",
      icon: <FaAward />,
      path: "/assign-points",
      roles: ["Faculty Coordinator"],
    },

    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/analytics",
      roles: ["Faculty Coordinator"],
    },

    {
      name: "Audit Logs",
      icon: <FaShieldAlt />,
      path: "/admin",
      roles: ["Faculty Coordinator"],
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
            .filter((item) => item.roles.includes(role))
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

          <button
            className="flex items-center gap-4 rounded-xl px-4 py-3 mt-4 hover:bg-red-600 transition"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
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