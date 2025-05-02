"use client";

import { useState, useEffect } from "react";

const LanguageFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get all common languages across countries
    const fetchLanguages = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=languages"
        );
        const data = await response.json();

        // Extract all languages
        const allLanguages = new Set();
        data.forEach((country) => {
          if (country.languages) {
            Object.entries(country.languages).forEach(([code, name]) => {
              allLanguages.add(JSON.stringify({ code, name }));
            });
          }
        });

        // Convert back to array of objects
        const languagesArray = Array.from(allLanguages).map((lang) =>
          JSON.parse(lang)
        );

        // Sort by language name
        languagesArray.sort((a, b) => a.name.localeCompare(b.name));

        setLanguages(languagesArray);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleSelectLanguage = (code) => {
    const newSelected = code === selectedLanguage ? "" : code;
    setSelectedLanguage(newSelected);
    onFilterChange(newSelected);
    setIsOpen(false);
  };

  // Filter languages based on search term
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-60 px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-gray-700 dark:text-gray-200">
          {selectedLanguage
            ? languages.find((lang) => lang.code === selectedLanguage)?.name ||
              "Language"
            : "Filter by Language"}
        </span>
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full md:w-60 bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          <div className="sticky -top-1 z-10 bg-white dark:bg-gray-700 px-3 py-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className={`w-full text-left px-4 py-2 text-sm ${
              !selectedLanguage
                ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"
                : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
            onClick={() => handleSelectLanguage("")}
          >
            All Languages
          </button>

          {filteredLanguages.map((language) => (
            <button
              key={`${language.code}-${language.name}`}
              className={`w-full text-left px-4 py-2 text-sm ${
                selectedLanguage === language.code
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"
                  : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              onClick={() => handleSelectLanguage(language.code)}
            >
              {language.name}
            </button>
          ))}

          {filteredLanguages.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No languages found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageFilter;
