import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [settings, setSettings] = useState({
    academicYear: "",
    clubName: "",
    semester: "",
    eventCategories: [],
    pointPolicy: {
      attendance: 0,
      volunteer: 0,
      winner: 0,
      participation: 0,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5000/api/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/settings",
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Settings Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Club Settings
      </h1>

      <div className="space-y-6 max-w-3xl">

        <div>
          <label>Club Name</label>

          <input
            className="w-full bg-gray-800 p-3 rounded mt-2"
            value={settings.clubName}
            onChange={(e) =>
              setSettings({
                ...settings,
                clubName: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Academic Year</label>

          <input
            className="w-full bg-gray-800 p-3 rounded mt-2"
            value={settings.academicYear}
            onChange={(e) =>
              setSettings({
                ...settings,
                academicYear: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Semester</label>

          <input
            className="w-full bg-gray-800 p-3 rounded mt-2"
            value={settings.semester}
            onChange={(e) =>
              setSettings({
                ...settings,
                semester: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Attendance Points</label>

          <input
            type="number"
            className="w-full bg-gray-800 p-3 rounded mt-2"
            value={settings.pointPolicy.attendance}
            onChange={(e) =>
              setSettings({
                ...settings,
                pointPolicy: {
                  ...settings.pointPolicy,
                  attendance: e.target.value,
                },
              })
            }
          />
        </div>

        <div>
          <label>Volunteer Points</label>

          <input
            type="number"
            className="w-full bg-gray-800 p-3 rounded mt-2"
            value={settings.pointPolicy.volunteer}
            onChange={(e) =>
              setSettings({
                ...settings,
                pointPolicy: {
                  ...settings.pointPolicy,
                  volunteer: e.target.value,
                },
              })
            }
          />
        </div>

        <button
          onClick={updateSettings}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;