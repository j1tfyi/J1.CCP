"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCoinbaseRampTransaction } from "../contexts/CoinbaseRampTransactionContext";

// Define interfaces for type safety
interface Country {
  id: string;
  name: string;
  subdivisions: string[];
}

export const RegionSelector = () => {
  const {
    countries,
    setSelectedCountry,
    selectedCountry,
    setSelectedSubdivision,
    selectedSubdivision,
    loadingBuyConfig,
  } = useCoinbaseRampTransaction();

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [subdivisionDropdownOpen, setSubdivisionDropdownOpen] = useState(false);

  const subdivisions = useMemo(() => {
    if (selectedCountry) {
      return selectedCountry.subdivisions;
    }
    return [];
  }, [selectedCountry]);

  const handleCountrySelect = (countryId: string) => {
    const country = countries.find((country) => country.id === countryId);
    if (country) {
      setSelectedCountry(country);
      setSelectedSubdivision(null);
    }
    setCountryDropdownOpen(false);
  };

  const handleSubdivisionSelect = (subdivision: string) => {
    setSelectedSubdivision(subdivision);
    setSubdivisionDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-medium mb-4">Region</h3>

      {loadingBuyConfig ? (
        <div className="flex gap-4">
          <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse"></div>
          <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <button
              type="button"
              className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            >
              <div className="flex items-center">
                {selectedCountry && (
                  <Image
                    src={`https://flagcdn.com/${selectedCountry.id.toLowerCase()}.svg`}
                    alt={selectedCountry.id}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                )}
                <span>
                  {selectedCountry ? selectedCountry.name : "Select Country"}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {countryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {countries.map(({ id, name }) => (
                  <div
                    key={id}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                    onClick={() => handleCountrySelect(id)}
                  >
                    <div className="flex items-center">
                      <Image
                        src={`https://flagcdn.com/${id.toLowerCase()}.svg`}
                        alt={id}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      <span>{name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {subdivisions.length > 0 && (
            <div className="relative">
              <button
                type="button"
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() =>
                  setSubdivisionDropdownOpen(!subdivisionDropdownOpen)
                }
              >
                {selectedSubdivision || "Select Subdivision"}
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {subdivisionDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {subdivisions.map((subdivision) => (
                    <div
                      key={subdivision}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                      onClick={() => handleSubdivisionSelect(subdivision)}
                    >
                      {subdivision}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
