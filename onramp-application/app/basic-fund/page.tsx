"use client";

import React from "react";
import { Header } from "../components/Header";
import { BasicFundCard } from "../components/BasicFundCard";
import { WalletConnector } from "../components/WalletConnector";

export default function BasicFundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Basic Fund Card Test</h1>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
            <p className="mb-4">
              Connect your wallet to test the Fund Card below.
            </p>
            <WalletConnector />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Basic Fund Card</h2>
            <p className="mb-4">
              This is a basic implementation following the documentation
              exactly.
            </p>
            <BasicFundCard />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Make sure your wallet is connected to the Base network</li>
              <li>Check that the environment variables are correctly set</li>
              <li>Open the browser console to see any error messages</li>
              <li>Try refreshing the page after connecting your wallet</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
