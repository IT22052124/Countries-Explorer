"use client";

import { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search to avoid too many API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 shadow-sm"
          placeholder="Search for a country..."
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="clear search"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-200"
            onClick={() => {
              setSearchQuery("");
              onSearch("");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
