import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { FaSearch, FaSyncAlt } from "react-icons/fa";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/audit-logs");
      setLogs(res.data || []);
      setFilteredLogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredLogs(logs);
      return;
    }

    const lower = search.toLowerCase();

    const filtered = logs.filter((log) => {
      return (
        log.action?.toLowerCase().includes(lower) ||
        log.user?.name?.toLowerCase().includes(lower) ||
        log.user?.email?.toLowerCase().includes(lower) ||
        log.module?.toLowerCase().includes(lower)
      );
    });

    setFilteredLogs(filtered);
  }, [search, logs]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <FaSearch />
        <input
          type="text"
          placeholder="Search logs (action, user, module...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
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
                <td colSpan="5" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="p-3 text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <div className="font-medium">
                      {log.user?.name || "System"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.user?.email || "-"}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">{log.module || "-"}</td>

                  <td className="p-3 text-sm text-gray-600">
                    {log.details || "-"}
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