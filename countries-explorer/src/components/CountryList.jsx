"use client";

import { useEffect, useState, useCallback } from "react";
import CountryCard from "./CountryCard";
import SearchBar from "./SearchBar";
import RegionFilter from "./RegionFilter";
import LanguageFilter from "./LanguageFilter";
import { useAuth } from "@/context/AuthContext";
import { removeFavorite } from "@/lib/favoritesApi";
import Image from "next/image";
import Link from "next/link";
import {
  getAllCountries,
  getCountryByName,
  getCountriesByRegion,
  getCountriesByLanguage,
} from "@/lib/api";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesSearchQuery, setFavoritesSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'favorites'
  const { isAuthenticated, favorites, favoritesLoading, removeFromFavorites } =
    useAuth();

  // Reset to 'all' tab when authentication state changes
  useEffect(() => {
    setActiveTab("all");
  }, [isAuthenticated]);

  // Fetch all countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      const data = await getAllCountries();
      setCountries(data);
      setFilteredCountries(data);
      setLoading(false);
    };

    fetchCountries();
  }, []);

  // Memoized filter function to prevent unnecessary re-renders
  const applyFilters = useCallback(async () => {
    if (countries.length === 0) return;

    setLoading(true);
    let result = [];

    try {
      // Apply different filtering strategies based on which filters are active
      if (searchQuery && selectedRegion && selectedLanguage) {
        // If all filters are active
        const searchResults = await getCountryByName(searchQuery);
        result = searchResults.filter(
          (country) =>
            country.region === selectedRegion &&
            country.languages &&
            Object.keys(country.languages).includes(selectedLanguage)
        );
      } else if (searchQuery && selectedRegion) {
        // Search query and region filter
        const searchResults = await getCountryByName(searchQuery);
        result = searchResults.filter(
          (country) => country.region === selectedRegion
        );
      } else if (searchQuery && selectedLanguage) {
        // Search query and language filter
        const searchResults = await getCountryByName(searchQuery);
        result = searchResults.filter(
          (country) =>
            country.languages &&
            Object.keys(country.languages).includes(selectedLanguage)
        );
      } else if (selectedRegion && selectedLanguage) {
        // Region and language filter
        const regionResults = await getCountriesByRegion(selectedRegion);
        result = regionResults.filter(
          (country) =>
            country.languages &&
            Object.keys(country.languages).includes(selectedLanguage)
        );
      } else if (searchQuery) {
        // Only search query is active
        result = await getCountryByName(searchQuery);
      } else if (selectedRegion) {
        // Only region filter is active
        result = await getCountriesByRegion(selectedRegion);
      } else if (selectedLanguage) {
        // Only language filter is active
        result = await getCountriesByLanguage(selectedLanguage);
      } else {
        // No filters are active, show all countries
        result = countries;
      }

      setFilteredCountries(result);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredCountries([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedRegion, selectedLanguage, countries]);

  // Apply filters when search query, region, or language changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Filter favorites based on search query
  useEffect(() => {
    // Skip processing if favorites aren't loaded yet
    if (!favorites) return;

    if (favoritesSearchQuery.trim() === "") {
      setFilteredFavorites(favorites);
      return;
    }

    const lowerCaseQuery = favoritesSearchQuery.toLowerCase();
    const filtered = favorites.filter((favorite) =>
      favorite.countryName.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredFavorites(filtered);
  }, [favorites, favoritesSearchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFavoritesSearch = (query) => {
    setFavoritesSearchQuery(query);
  };

  const handleRegionFilter = (region) => {
    setSelectedRegion(region);
  };

  const handleLanguageFilter = (language) => {
    setSelectedLanguage(language);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle removing a favorite directly from the favorites tab
  const handleRemoveFavorite = async (countryCode) => {
    try {
      await removeFavorite(countryCode);
      removeFromFavorites(countryCode);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <div className="mx-auto container px-4 py-2  dark:bg-gray-900 min-h-screen">
      {/* Tabs */}
      {isAuthenticated && (
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "all"
                    ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTabChange("all")}
              >
                All Countries
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "favorites"
                    ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTabChange("favorites")}
              >
                My Favorites
              </button>
            </li>
          </ul>
        </div>
      )}

      {activeTab === "all" && (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <SearchBar onSearch={handleSearch} />
            <div className="flex flex-col md:flex-row gap-4">
              <RegionFilter onFilterChange={handleRegionFilter} />
              <LanguageFilter onFilterChange={handleLanguageFilter} />
            </div>
          </div>

          {/* Countries Count */}
          {!loading && filteredCountries.length > 0 && (
            <div className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Countries Found: {filteredCountries.length}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                Retrieving country information...
              </span>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300">
                No countries found
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCountries.map((country) => (
                <CountryCard
                  key={`${country.cca3}-${country.name.common}`}
                  country={country}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "favorites" && (
        <div className="mt-6">
          <div className="mb-8">
            <SearchBar onSearch={handleFavoritesSearch} />
          </div>

          {/* Favorites Count */}
          {!favoritesLoading && filteredFavorites.length > 0 && (
            <div className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Favorite Countries: {filteredFavorites.length}
            </div>
          )}

          {favoritesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300">
                {favorites.length === 0
                  ? "No favorite countries yet"
                  : "No matches found"}
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mt-2">
                {favorites.length === 0
                  ? "Start exploring and add countries to your favorites"
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFavorites.map((favorite) => {
                // Find the full country data if available (for additional details)
                const fullCountry = countries.find(
                  (c) => c.cca3 === favorite.countryCode
                );

                return (
                  <div
                    key={favorite.countryCode}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                  >
                    <Link
                      href={`/country/${favorite.countryCode}`}
                      className="block"
                    >
                      <div className="relative h-40">
                        <Image
                          src={favorite.flagUrl}
                          alt={`Flag of ${favorite.countryName}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {favorite.countryName}
                        </h2>
                        {fullCountry && (
                          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            <p>
                              <span className="font-medium">Population:</span>{" "}
                              {fullCountry.population.toLocaleString()}
                            </p>
                            <p>
                              <span className="font-medium">Region:</span>{" "}
                              {fullCountry.region}
                            </p>
                            <p>
                              <span className="font-medium">Capital:</span>{" "}
                              {fullCountry.capital?.[0] || "N/A"}
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Favorite remove button */}
                    <button
                      onClick={() => handleRemoveFavorite(favorite.countryCode)}
                      className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 dark:bg-slate-700 dark:bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all"
                      aria-label="Remove from favorites"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryList;
