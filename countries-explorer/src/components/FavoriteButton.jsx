"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addFavorite, removeFavorite } from "@/lib/favoritesApi";

const FavoriteButton = ({ country, className = "" }) => {
  const [loading, setLoading] = useState(false);
  const {
    isAuthenticated,
    openLoginModal,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  } = useAuth();

  const isCountryFavorited =
    country && isAuthenticated ? isFavorite(country.cca3) : false;

  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event propagation

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    if (!country) return;

    setLoading(true);

    try {
      const favoriteData = {
        countryCode: country.cca3,
        countryName: country.name.common,
        flagUrl: country.flags.svg || country.flags.png,
      };

      if (isCountryFavorited) {
        // Optimistic UI update - remove immediately
        removeFromFavorites(country.cca3);
        // Then perform the actual API call
        await removeFavorite(country.cca3);
      } else {
        // Optimistic UI update - add immediately
        addToFavorites(favoriteData);
        // Then perform the actual API call
        await addFavorite(favoriteData);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert optimistic update if API call fails
      if (isCountryFavorited) {
        addToFavorites({
          countryCode: country.cca3,
          countryName: country.name.common,
          flagUrl: country.flags.svg || country.flags.png,
        });
      } else {
        removeFromFavorites(country.cca3);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!country) {
    return null;
  }

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={loading}
      className={`absolute top-2 right-2 p-2 bg-white bg-opacity-80 dark:bg-slate-700 dark:bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all ${className}`}
      aria-label={
        isCountryFavorited ? "Remove from favorites" : "Add to favorites"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isCountryFavorited ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-5 h-5 text-red-500 ${loading ? "animate-pulse" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
