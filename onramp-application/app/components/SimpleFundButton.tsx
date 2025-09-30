"use client";

import React, { useState, useEffect } from "react";
import { FundButton, getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { useAccount } from "wagmi";

export function SimpleFundButton() {
  const { address, isConnected, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access CDP Project ID directly from environment variables
  // For client components, we need to use NEXT_PUBLIC_ prefix
  const cdpProjectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID || "";

  useEffect(() => {
    // Simple loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getFundingUrl = () => {
    if (!address || !cdpProjectId) {
      console.log("Cannot generate funding URL:", {
        address: !!address,
        cdpProjectId: !!cdpProjectId,
      });
      return undefined;
    }

    try {
      console.log("Generating funding URL with CDP Project ID");

      const url = getOnrampBuyUrl({
        projectId: cdpProjectId,
        addresses: { [address]: ["base"] },
        assets: ["ETH"],
        presetFiatAmount: 20,
        fiatCurrency: "USD",
      });

      console.log("Generated funding URL successfully");
      return url;
    } catch (err) {
      console.error("Error generating funding URL:", err);
      setError("Failed to generate funding URL");
      return undefined;
    }
  };

  if (isLoading) {
    return <div className="p-4 border rounded-lg">Loading...</div>;
  }

  if (!isConnected) {
    return (
      <div className="p-4 border rounded-lg">
        Please connect your wallet to use the Fund Button
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg text-red-500">Error: {error}</div>
    );
  }

  if (!cdpProjectId) {
    return (
      <div className="p-4 border rounded-lg text-red-500">
        CDP Project ID not available
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Simple Fund Button</h2>
      <div className="mb-4">
        <p>Wallet: {address}</p>
        <p>Chain ID: {chainId}</p>
        <p>CDP Project ID: {cdpProjectId ? "Available" : "Not available"}</p>
      </div>
      <div className="flex flex-col space-y-4">
        <FundButton text="Fund Now" fundingUrl={getFundingUrl()} />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            const url = getFundingUrl();
            if (url) window.open(url, "_blank");
          }}
        >
          Open Funding URL Directly
        </button>
      </div>
    </div>
  );
}
