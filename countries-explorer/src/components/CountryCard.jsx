"use client";

import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

const CountryCard = ({ country }) => {
  return (
    <div className="country-card bg-white dark:bg-[#1E2A3B] rounded-lg shadow-md overflow-hidden transition-shadow duration-300 relative border border-gray-100 dark:border-[#2A3A4D]">
      <Link href={`/country/${country.cca3}`} className="block">
        <div className="relative h-40">
          <Image
            src={country.flags.svg || country.flags.png}
            alt={`Flag of ${country.name.common}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {country.name.common}
          </h2>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium">Population:</span>{" "}
              {country.population.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Region:</span> {country.region}
            </p>
            <p>
              <span className="font-medium">Capital:</span>{" "}
              {country.capital?.[0] || "N/A"}
            </p>
          </div>
        </div>
      </Link>

      <div className="absolute top-2 right-2">
        <FavoriteButton country={country} />
      </div>
    </div>
  );
};

export default CountryCard;
