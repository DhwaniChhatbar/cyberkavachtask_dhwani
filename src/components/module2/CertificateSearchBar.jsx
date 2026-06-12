import React from "react";

const CertificateSearchBar = ({
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search certificate..."
      className="w-full bg-gray-800 text-white p-3 rounded-xl outline-none"
    />
  );
};

export default CertificateSearchBar;