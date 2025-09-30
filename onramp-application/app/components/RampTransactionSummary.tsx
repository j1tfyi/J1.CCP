"use client";

import { useState } from "react";
import { useCoinbaseRampTransaction } from "../contexts/CoinbaseRampTransactionContext";
import { WalletConnector } from "./WalletConnector";

export const RampTransactionSummary = () => {
  const {
    rampTransaction,
    selectedPurchaseCurrency,
    selectedPurchaseCurrencyNetwork,
    authenticated,
    loadingBuyOptions,
    isOnrampActive,
  } = useCoinbaseRampTransaction();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransaction = async () => {
    if (!authenticated) return;

    setIsProcessing(true);

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(
        "Transaction initiated! This is a demo, no actual transaction will occur."
      );
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingBuyOptions) {
    return (
      <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-white animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="mt-6 h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-medium mb-4">Transaction Summary</h3>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Asset:</span>
            <span className="font-medium">
              {selectedPurchaseCurrency?.symbol || "Not selected"}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium">
              {selectedPurchaseCurrencyNetwork?.name || "Not selected"}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">
              {rampTransaction?.amount || "0"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">
              {rampTransaction?.paymentMethod || "Not selected"}
            </span>
          </div>
        </div>

        {authenticated ? (
          <button
            onClick={handleTransaction}
            disabled={
              isProcessing ||
              !rampTransaction?.amount ||
              !selectedPurchaseCurrency
            }
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing
              ? "Processing..."
              : isOnrampActive
              ? "Buy Now"
              : "Sell Now"}
          </button>
        ) : (
          <div className="text-center">
            <p className="mb-3 text-gray-600">
              Connect your wallet to continue
            </p>
            <WalletConnector buttonStyle="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RampTransactionSummary;
