import React, { useState } from "react";

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="addon-wrapping">
        Search
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        aria-label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
