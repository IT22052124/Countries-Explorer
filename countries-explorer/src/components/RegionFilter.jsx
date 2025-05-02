"use client";

import { useState } from "react";

const RegionFilter = ({ onFilterChange }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

  const handleRegionChange = (region) => {
    const newRegion = region === "All" ? "" : region;
    setSelectedRegion(newRegion);
    onFilterChange(newRegion);
  };

  return (
    <div className="relative">
      <select
        value={selectedRegion}
        onChange={(e) => handleRegionChange(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm"
        aria-label="Filter by region"
      >
        <option value="">Filter by Region</option>
        {regions.map((region) => (
          <option
            key={region}
            value={region === "All" ? "" : region}
            className="text-black dark:text-white"
          >
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionFilter;
