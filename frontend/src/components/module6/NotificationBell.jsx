import React from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
      <Bell className="text-white w-6 h-6" />

      <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full text-white">
        3
      </span>
    </button>
  );
}