import React from "react";
import { getUsers } from "../utils/storage";

const PointsHistory = () => {
  const users = getUsers();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Points History</h1>

      {users.map((user, i) => (
        <div key={i} className="mb-4">
          <h2 className="font-bold">{user.name}</h2>

          {user.history?.map((h, index) => (
            <div key={index} className="text-sm text-gray-300 ml-4">
              • {h.category} | +{h.points} | {h.remarks} | {h.date}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PointsHistory;