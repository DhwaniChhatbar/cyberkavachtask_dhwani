import React from "react";

export default function UserTable() {
  const users = [
    {
      name: "Rahul Sharma",
      role: "Admin",
      email: "rahul@gmail.com",
    },
    {
      name: "Priya Patel",
      role: "Faculty",
      email: "priya@gmail.com",
    },
    {
      name: "Amit Shah",
      role: "Student",
      email: "amit@gmail.com",
    },
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg overflow-x-auto">
      <h2 className="text-white text-2xl font-bold mb-5">
        Users
      </h2>

      <table className="w-full text-left">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="pb-3">Name</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Email</th>
          </tr>
        </thead>

        <tbody className="text-white">
          {users.map((user, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="py-3">{user.name}</td>
              <td className="py-3">{user.role}</td>
              <td className="py-3">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}