"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FavoriteButton from "@/components/FavoriteButton";
import Footer from "@/components/Footer";
import { getCountryByCode } from "@/lib/api";

export default function CountryDetailPage({ params }) {
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params);
  const countryCode = unwrappedParams.code;

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true);
      try {
        const data = await getCountryByCode(countryCode);
        setCountry(data);

        // Set page title
        if (data) {
          document.title = `${data.name.common} - Countries Explorer`;
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-300"></div>
            <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center">
              Retrieving detailed country information...
            </span>
          </div>
        </main>
      </div>
    );
  }

  if (!country) {
    return notFound();
  }

  // Handle languages
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "None";

  // Handle currencies
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => `${currency.name} (${currency.symbol})`)
        .join(", ")
    : "None";

  // Handle borders
  const borders = country.borders || [];

  // Format area with commas
  const formattedArea = country.area ? country.area.toLocaleString() : "N/A";

  // Format coordinates
  const coordinates = country.latlng
    ? `${country.latlng[0]}°, ${country.latlng[1]}°`
    : "N/A";

  // Create driving side string
  const drivingSide = country.car?.side
    ? `${
        country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)
      } side`
    : "N/A";

  // Get week start
  const weekStart = country.startOfWeek
    ? country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1)
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-sm font-medium text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Country Header with Flag and Name */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-8">
          <div className="relative w-full h-48 md:h-64 bg-gray-200 dark:bg-gray-700">
            <Image
              src={country.flags.svg || country.flags.png}
              alt={`Flag of ${country.name.common}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-4xl font-bold">{country.name.common}</h1>
              <p className="text-lg opacity-90">{country.name.official}</p>
            </div>
            <FavoriteButton country={country} className="z-10" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                Basic Information
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Region:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {country.region || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Subregion:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {country.subregion || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Capital:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {country.capital?.[0] || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Population:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {country.population.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Area:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formattedArea} km²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Coordinates:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {coordinates}
                  </span>
                </div>
              </div>
            </div>

            {/* Currency and Languages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                Cultural
              </h2>

              <div className="space-y-3">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 block mb-1">
                    Currencies:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currencies}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 dark:text-gray-300 block mb-1">
                    Languages:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {languages}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 dark:text-gray-300 block mb-1">
                    Start of Week:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {weekStart}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center and Right Columns */}
          <div className="lg:col-span-2">
            {/* Geography Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                Geography & Maps
              </h2>

              <div className="mb-4">
                <span className="text-gray-700 dark:text-gray-300 block mb-1">
                  Google Maps:
                </span>
                <a
                  href={country.maps?.googleMaps || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                >
                  Open in Google Maps
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Map Preview */}
              <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden shadow-md mb-6">
                {country.latlng && (
                  <iframe
                    title={`Map of ${country.name.common}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${country.name.common}&center=${country.latlng[0]},${country.latlng[1]}&zoom=5`}
                  />
                )}
              </div>

              {/* Borders section */}
              {borders.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Border Countries:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {borders.map((border) => (
                      <Link
                        key={border}
                        href={`/country/${border}`}
                        className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                Additional Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 block mb-1">
                      Top Level Domain:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {country.tld?.join(", ") || "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 block mb-1">
                      Country Codes:
                    </span>
                    <div className="flex gap-2">
                      {country.cca2 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                          {country.cca2}
                        </span>
                      )}
                      {country.cca3 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                          {country.cca3}
                        </span>
                      )}
                      {country.ccn3 && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
                          {country.ccn3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 block mb-1">
                      Timezones:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {country.timezones?.map((timezone, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs"
                        >
                          {timezone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 block mb-1">
                      International Dialing:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {country.idd?.root}
                      {country.idd?.suffixes?.[0] || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 block mb-1">
                      Driving Side:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {drivingSide}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 block mb-1">
                      Continents:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {country.continents?.map((continent, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded text-xs font-medium"
                        >
                          {continent}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coat of Arms Section - if available */}
            {country.coatOfArms?.png && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Coat of Arms
                </h2>
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <Image
                      src={country.coatOfArms.svg || country.coatOfArms.png}
                      alt={`Coat of Arms of ${country.name.common}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
