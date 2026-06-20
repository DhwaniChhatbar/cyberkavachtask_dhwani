import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="sticky top-0 z-50 h-16 bg-gray-900 text-white shadow-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          CyberKavach
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <button
            className="rounded-full p-2 hover:bg-gray-800 transition"
            aria-label="Notifications"
          >
            <FaBell className="text-xl" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-blue-400" />

            <div className="hidden md:flex flex-col">
              <span className="font-semibold">
                {user?.name || "User"}
              </span>

              <span className="text-sm text-gray-400">
                {user?.role || ""}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;