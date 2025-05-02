"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FavoriteButton from "@/components/FavoriteButton";
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-300"></div>
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
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
          <FavoriteButton country={country} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="relative w-full h-64 md:h-auto">
              <Image
                src={country.flags.svg || country.flags.png}
                alt={`Flag of ${country.name.common}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {country.name.common}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Official Name:
                    </span>{" "}
                    {country.name.official}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Population:
                    </span>{" "}
                    {country.population.toLocaleString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Region:
                    </span>{" "}
                    {country.region}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Sub Region:
                    </span>{" "}
                    {country.subregion || "None"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Capital:
                    </span>{" "}
                    {country.capital?.[0] || "None"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Top Level Domain:
                    </span>{" "}
                    {country.tld?.join(", ") || "None"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Currencies:
                    </span>{" "}
                    {currencies}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 py-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Languages:
                    </span>{" "}
                    {languages}
                  </p>
                </div>
              </div>

              {borders.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Border Countries:
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {borders.map((border) => (
                      <Link
                        key={border}
                        href={`/country/${border}`}
                        className="px-4 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
