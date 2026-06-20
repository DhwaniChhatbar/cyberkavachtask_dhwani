import React, { useEffect, useState } from "react";
import api from "../utils/api";

const PointsHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/points/history");

      // ✅ SAFE FIX (IMPORTANT)
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.history || [];

      setHistory(data);
    } catch (err) {
      console.error("History fetch error:", err);
      setHistory([]); // safety fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading history...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Points History
      </h1>

      {history.length === 0 ? (
        <p>No points history found.</p>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(history) ? history : []).map((item) => (
            <div
              key={item._id}
              className="bg-[#111827] p-4 rounded-lg border border-gray-700"
            >
              <h2 className="font-bold text-lg">
                {item.user?.name || "Unknown User"}
              </h2>

              <p className="text-emerald-400">
                +{item.points} points
              </p>

              <p className="text-gray-300">
                Category: {item.category}
              </p>

              <p className="text-gray-300">
                Remarks: {item.remarks || "-"}
              </p>

              <p className="text-gray-400 text-sm">
                Assigned By: {item.assignedBy?.name || "Unknown"}
              </p>

              <p className="text-gray-500 text-sm">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PointsHistory;