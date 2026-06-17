import React, { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../components/Module6/StatsCard";
import BarChart from "../components/Module6/BarChart";
import LineChart from "../components/Module6/LineChart";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    facultyCount: 0,
    studentCoordinatorCount: 0,
    memberCount: 0,
    totalEvents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    underReviewRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalCertificates: 0,
    totalAttendanceRecords: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5000/api/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const token = localStorage.getItem("token");

    window.open(
      `http://localhost:5000/api/analytics/export/pdf?token=${token}`,
      "_blank"
    );
  };

  const exportCSV = () => {
    const token = localStorage.getItem("token");

    window.open(
      `http://localhost:5000/api/analytics/export/csv?token=${token}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <h1 className="text-3xl text-white font-bold">
          Loading Analytics...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-4xl text-white font-bold">
          Analytics Dashboard
        </h1>

        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={exportPDF}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white font-semibold"
          >
            Export PDF
          </button>

          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl text-white font-semibold"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Faculty Coordinators" value={stats.facultyCount} />
        <StatsCard
          title="Student Coordinators"
          value={stats.studentCoordinatorCount}
        />
        <StatsCard title="Members" value={stats.memberCount} />
        <StatsCard title="Total Events" value={stats.totalEvents} />
        <StatsCard title="Total Requests" value={stats.totalRequests} />
        <StatsCard title="Pending Requests" value={stats.pendingRequests} />
        <StatsCard
          title="Under Review Requests"
          value={stats.underReviewRequests}
        />
        <StatsCard title="Approved Requests" value={stats.approvedRequests} />
        <StatsCard title="Rejected Requests" value={stats.rejectedRequests} />
        <StatsCard
          title="Certificates Issued"
          value={stats.totalCertificates}
        />
        <StatsCard
          title="Attendance Records"
          value={stats.totalAttendanceRecords}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <BarChart stats={stats} />
        <LineChart stats={stats} />
      </div>
    </div>
  );
};

export default Analytics;