"use client";

import React, { useState, useEffect } from "react";
import {
  FundButton as CoinbaseFundButton,
  getOnrampBuyUrl,
} from "@coinbase/onchainkit/fund";
import { useAccount } from "wagmi";

interface FundButtonProps {
  customText?: string;
  hideIcon?: boolean;
  hideText?: boolean;
  openIn?: "popup" | "tab";
  useCustomUrl?: boolean;
  presetAmount?: number;
}

export function FundButton({
  customText,
  hideIcon = false,
  hideText = false,
  openIn = "popup",
  useCustomUrl = false,
  presetAmount = 20,
}: FundButtonProps) {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const [cdpProjectId, setCdpProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch CDP Project ID from both client and server
  useEffect(() => {
    // First try to get it from client-side env vars
    const clientCdpProjectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID || "";

    if (clientCdpProjectId) {
      console.log("Using client-side CDP Project ID");
      setCdpProjectId(clientCdpProjectId);
      setIsLoading(false);
      return;
    }

    // If not available client-side, try to fetch from server
    const fetchCdpProjectId = async () => {
      try {
        console.log("Fetching CDP Project ID from server...");
        setIsLoading(true);

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

        if (data.success && data.config.cdpProjectId) {
          console.log("Using server-side CDP Project ID");
          setCdpProjectId(data.config.cdpProjectId);
        } else {
          setError("CDP Project ID not found in server response");
        }
      } catch (err) {
        console.error("Error fetching CDP Project ID:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCdpProjectId();
  }, []);

  // Log environment variable status for debugging
  useEffect(() => {
    console.log("Environment variables status:");
    console.log("- CDP Project ID:", cdpProjectId ? "Set" : "Not set");
    console.log("- Address:", address || "Not connected");
    console.log("- Using custom URL:", useCustomUrl);
  }, [cdpProjectId, address, useCustomUrl]);

  // Generate custom onramp URL if requested
  const customOnrampUrl =
    useCustomUrl && isConnected && address && cdpProjectId
      ? (() => {
          try {
            return getOnrampBuyUrl({
              projectId: cdpProjectId,
              addresses: { [address]: ["base"] },
              assets: ["ETH", "USDC"],
              presetFiatAmount: presetAmount,
              fiatCurrency: "USD",
            });
          } catch (err) {
            console.error("Error generating onramp URL:", err);
            setError("Failed to generate onramp URL");
            return undefined;
          }
        })()
      : undefined;

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-center">Loading configuration...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        Please connect your wallet to use the Fund Button
      </div>
    );
  }

  if (useCustomUrl && !cdpProjectId) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        <p className="font-bold">Error:</p>
        <p>
          CDP Project ID is not available. Please check your environment
          variables.
        </p>
        <p className="mt-2 text-sm">
          Make sure <code>NEXT_PUBLIC_CDP_PROJECT_ID</code> is set in your
          Vercel project settings.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://vercel.com/docs/projects/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Learn more about Vercel environment variables
          </a>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Fund Your Wallet</h3>
      <p className="text-gray-600 mb-4">
        Add funds to your wallet directly from this app.
      </p>

      <div className="flex flex-col space-y-4">
        <div>
          <CoinbaseFundButton
            text={customText}
            hideIcon={hideIcon}
            hideText={hideText}
            openIn={openIn}
            fundingUrl={customOnrampUrl}
          />
        </div>

        {useCustomUrl && (
          <div className="text-xs text-gray-500 mt-2">
            Using custom onramp URL with preset amount: ${presetAmount}
          </div>
        )}
      </div>
    </div>
  );
}
