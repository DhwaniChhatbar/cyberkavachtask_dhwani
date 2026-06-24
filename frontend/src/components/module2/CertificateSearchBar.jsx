import React from "react";
import { FaSearch } from "react-icons/fa";

const CertificateSearchBar = ({
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={value || ""} // 🔥 safe fallback
        onChange={onChange || (() => {})} // 🔥 prevent crash
        placeholder="Search by certificate ID, event name, or user..."
        aria-label="Search Certificates" // 🔥 accessibility improvement
        className="
          w-full
          bg-gray-800
          text-white
          p-3
          pl-12
          rounded-xl
          outline-none
          border
          border-gray-700
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500
          transition
        "
      />
    </div>
  );
};

export default CertificateSearchBar;