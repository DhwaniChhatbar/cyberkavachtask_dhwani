import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-gray-900 text-white shadow-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          CyberKavach
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <button
            className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-800"
            aria-label="Notifications"
          >
            <FaBell className="text-xl" />
          </button>

          <button
            className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-800"
            aria-label="Profile"
          >
            <FaUserCircle className="text-2xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;