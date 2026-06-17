import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg">Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() =>
                setEmailNotifications(!emailNotifications)
              }
              className="w-5 h-5"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}