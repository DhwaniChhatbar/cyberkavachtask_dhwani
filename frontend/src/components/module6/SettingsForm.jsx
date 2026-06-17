import React, { useState } from "react";

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings Saved:", settings);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">
        Settings
      </h2>

      <div className="flex justify-between text-white">
        <span>Email Notifications</span>

        <input
          type="checkbox"
          name="emailNotifications"
          checked={settings.emailNotifications}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-between text-white">
        <span>Dark Mode</span>

        <input
          type="checkbox"
          name="darkMode"
          checked={settings.darkMode}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 px-5 py-2 rounded text-white hover:bg-blue-700"
      >
        Save Settings
      </button>
    </form>
  );
}