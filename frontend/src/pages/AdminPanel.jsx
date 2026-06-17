import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const approveUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Admin Panel
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-900 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-800"
              >
                <td className="p-4">{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <select
                    value={user.role}
                    className="bg-gray-800 p-2 rounded"
                    onChange={(e) =>
                      updateRole(user._id, e.target.value)
                    }
                  >
                    <option>FacultyCoordinator</option>
                    <option>StudentCoordinator</option>
                    <option>TechCoordinator</option>
                    <option>ContentCoordinator</option>
                    <option>SocialMediaCoordinator</option>
                    <option>Member</option>
                  </select>
                </td>

                <td>
                  {user.isApproved ? "Approved" : "Pending"}
                </td>

                <td className="space-x-3">
                  {!user.isApproved && (
                    <button
                      onClick={() => approveUser(user._id)}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminPanel;