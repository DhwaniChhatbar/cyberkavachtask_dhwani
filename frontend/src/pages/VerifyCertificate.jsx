import React, { useState } from "react";
import axios from "axios";
import VerifyResultCard from "../components/module2/VerifyResultCard";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    const id = certificateId.trim();

    if (!id) {
      setError("Please enter a certificate ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertificate(null);

      const res = await axios.get(
        `http://localhost:5000/api/certificates/verify/${id}`
      );

      if (!res.data.success) {
        setError("Certificate not found");
        return;
      }

      setCertificate(res.data.certificate);
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
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

        </form>

        {error && (
          <div className="bg-red-600 mt-6 p-3 rounded-lg">
            {error}
          </div>
        )}

        {certificate && (
          <div className="mt-6">
            <VerifyResultCard certificate={certificate} />
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyCertificate;