"use client";
import React, { useState, useEffect } from "react";
import { FundCard, FundCardPropsReact } from "@coinbase/onchainkit/fund";
import { useCoinbaseRampTransaction } from "../contexts/CoinbaseRampTransactionContext";
import { useAccount } from "wagmi";

// Import the Currency interface
interface Currency {
  id: string;
  name: string;
}

export function FundCardDemo() {
  const { selectedCountry, selectedSubdivision, selectedCurrency } =
    useCoinbaseRampTransaction();

  const { isConnected } = useAccount();
  const [cdpProjectId, setCdpProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [asset, setAsset] = useState("USDC");
  const [presetAmountInputs, setPresetAmountInputs] = useState<
    FundCardPropsReact["presetAmountInputs"]
  >(["10", "25", "50"]);

  useEffect(() => {
    // Fetch CDP Project ID from server
    const fetchCdpProjectId = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCdpProjectId(data.config.cdpProjectId || "");
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching CDP Project ID:", error);
        setIsLoading(false);
      }
    };

    fetchCdpProjectId();
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto">
      {isLoading ? (
        <div className="p-6 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : isConnected ? (
        <FundCard
          assetSymbol={asset}
          country={selectedCountry ? selectedCountry.id : "US"}
          subdivision={selectedSubdivision || undefined}
          currency={selectedCurrency ? selectedCurrency.id : "USD"}
          presetAmountInputs={presetAmountInputs}
          headerText="Fund Your Project"
          buttonText="Continue"
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-amber-600 dark:text-amber-400 text-sm">
            Please connect your wallet to use the Fund Card
          </p>
          {cdpProjectId ? (
            <p className="text-green-600 dark:text-green-400 text-xs mt-2">
              CDP Project ID loaded successfully
            </p>
          ) : (
            <p className="text-red-600 dark:text-red-400 text-xs mt-2">
              CDP Project ID not loaded
            </p>
          )}
        </div>
      )}
    </div>
  );
}
