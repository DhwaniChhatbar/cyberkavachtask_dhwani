import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CertificateCard from "../components/module2/CertificateCard";
import CertificateSearchBar from "../components/module2/CertificateSearchBar";

const CertificateDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    let filtered = certificates.filter((certificate) => {
      return (
        certificate?.certificateId?.toLowerCase().includes(query) ||
        certificate?.eventName?.toLowerCase().includes(query) ||
        certificate?.user?.name?.toLowerCase().includes(query)
      );
    });

    if (sortBy === "latest") {
      filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (sortBy === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    if (sortBy === "az") {
      filtered.sort((a, b) =>
        (a.eventName || "").localeCompare(b.eventName || "")
      );
    }

    setFilteredCertificates(filtered);
  }, [search, certificates, sortBy]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/certificates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data?.certificates || [];

      setCertificates(data);
      setFilteredCertificates(data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setCertificates([]);
      setFilteredCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const totalCertificates = certificates.length;

  const totalEvents = useMemo(() => {
    return new Set(
      certificates.map((c) => c.eventName)
    ).size;
  }, [certificates]);

  const todayCertificates = useMemo(() => {
    const today = new Date().toDateString();

    return certificates.filter(
      (c) =>
        new Date(c.createdAt).toDateString() === today
    ).length;
  }, [certificates]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Certificate Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gray-900 p-5 rounded-2xl shadow">
          <h2 className="text-gray-400 text-sm">
            Total Certificates
          </h2>
          <p className="text-3xl font-bold mt-2">
            {totalCertificates}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl shadow">
          <h2 className="text-gray-400 text-sm">
            Events Covered
          </h2>
          <p className="text-3xl font-bold mt-2">
            {totalEvents}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl shadow">
          <h2 className="text-gray-400 text-sm">
            Certificates Today
          </h2>
          <p className="text-3xl font-bold mt-2">
            {todayCertificates}
          </p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <CertificateSearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-900 px-4 py-3 rounded-xl"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Event Name A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400">
          Loading certificates...
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-2xl text-center text-gray-400">
          No certificates found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate._id}
              certificate={certificate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateDashboard;