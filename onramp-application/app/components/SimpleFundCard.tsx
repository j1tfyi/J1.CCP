"use client";

import React, { useState, useEffect } from "react";
import { FundCard } from "@coinbase/onchainkit/fund";
import { useAccount } from "wagmi";

export function SimpleFundCard() {
  const { isConnected } = useAccount();
  const [cdpProjectId, setCdpProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch CDP Project ID from server
    const fetchCdpProjectId = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Auth API response:", data);

        if (data.success) {
          setCdpProjectId(data.config.cdpProjectId || "");
          if (!data.config.cdpProjectId) {
            setError("CDP Project ID is empty in the response");
          }
        } else {
          setError(data.error || "Unknown error in API response");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching CDP Project ID:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setIsLoading(false);
      }
    };

    fetchCdpProjectId();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-center">Loading FundCard configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        <p className="font-bold">Error loading FundCard:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Please check that your environment variables are correctly set.
        </p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        <p>Please connect your wallet to use the Fund Card</p>
        <p className="text-sm mt-2">
          CDP Project ID: {cdpProjectId ? "✓ Loaded" : "✗ Not loaded"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <FundCard
        assetSymbol="ETH"
        country="US"
        currency="USD"
        headerText="Purchase Ethereum"
        buttonText="Purchase"
        presetAmountInputs={["10", "20", "50"]}
      />
    </div>
  );
}
