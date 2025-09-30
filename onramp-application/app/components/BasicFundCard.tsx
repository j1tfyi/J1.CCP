"use client";

import React from "react";
import { FundCard } from "@coinbase/onchainkit/fund";
import { useAccount } from "wagmi";

export function BasicFundCard() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        Please connect your wallet to use the Fund Card
      </div>
    );
  }

  // Following the documentation exactly
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
