import { useState } from "react";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full p-2 bg-gray-800 rounded outline-none"
    />
  );
};

export default SearchBar;