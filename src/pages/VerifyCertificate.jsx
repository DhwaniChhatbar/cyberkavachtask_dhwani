import React, { useState } from "react";
import axios from "axios";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setCertificate(null);
      setLoading(true);

      const id = certificateId.trim();

      if (!id) {
        setError("Please enter a certificate ID");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/certificates/verify/${id}`
      );

      if (!res.data) {
        setError("Certificate not found");
        return;
      }

      setCertificate(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Certificate not found or invalid"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center p-6">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6">
          Verify Certificate
        </h1>

        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="w-full bg-gray-800 p-3 rounded-lg outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg ${
              loading
                ? "bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-600 mt-6 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Result */}
        {certificate && (
          <div className="bg-gray-800 mt-6 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4 text-green-400">
              Certificate Verified ✅
            </h2>

            <div className="space-y-2">

              <p>
                <strong>Name:</strong>{" "}
                {certificate.user?.name || "N/A"}
              </p>

              <p>
                <strong>Event:</strong>{" "}
                {certificate.eventName || "N/A"}
              </p>

              <p>
                <strong>Certificate ID:</strong>{" "}
                {certificate.certificateId}
              </p>

              <p>
                <strong>Issued On:</strong>{" "}
                {certificate.createdAt
                  ? new Date(
                      certificate.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;