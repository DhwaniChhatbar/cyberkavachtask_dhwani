import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { FaSearch, FaSyncAlt } from "react-icons/fa";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/audit-logs");
      const data = res.data?.logs || res.data || [];

      setLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredLogs(logs);
      return;
    }

    const lower = search.toLowerCase();

    const filtered = logs.filter((log) => {
      return (
        log?.action?.toLowerCase().includes(lower) ||
        log?.user?.name?.toLowerCase().includes(lower) ||
        log?.user?.email?.toLowerCase().includes(lower) ||
        log?.module?.toLowerCase().includes(lower)
      );
    });

    setFilteredLogs(filtered);
  }, [search, logs]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Audit Logs
        </h1>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded shadow">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search logs by action, user, module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-gray-800"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Module</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-700">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    <div className="font-medium text-gray-800">
                      {log?.user?.name || "System"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log?.user?.email || "-"}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {log?.action || "-"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">
                    {log?.module || "-"}
                  </td>

                  <td className="p-3 text-gray-600">
                    {log?.details || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;