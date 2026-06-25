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

    setFilteredLogs(
      logs.filter((log) =>
        log?.action?.toLowerCase().includes(lower) ||
        log?.user?.name?.toLowerCase().includes(lower) ||
        log?.user?.email?.toLowerCase().includes(lower) ||
        log?.module?.toLowerCase().includes(lower)
      )
    );
  }, [search, logs]);

  const getActionColor = (action = "") => {
    if (action.toLowerCase().includes("delete"))
      return "bg-red-500/20 text-red-400";

    if (action.toLowerCase().includes("create"))
      return "bg-green-500/20 text-green-400";

    if (action.toLowerCase().includes("update") || action.toLowerCase().includes("edit"))
      return "bg-yellow-500/20 text-yellow-300";

    return "bg-blue-500/20 text-blue-300";
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Audit Logs
        </h1>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-5 bg-gray-900 border border-gray-800 p-3 rounded-lg">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-200"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-gray-800 overflow-x-auto bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
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
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="p-3 text-gray-300">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    <div className="text-gray-100 font-medium">
                      {log?.user?.name || "System"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {log?.user?.email || "-"}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getActionColor(
                        log?.action
                      )}`}
                    >
                      {log?.action || "-"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-300">
                    {log?.module || "-"}
                  </td>

                  <td className="p-3 text-gray-400">
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