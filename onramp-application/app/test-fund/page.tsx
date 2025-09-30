"use client";

import React from "react";
import { Header } from "../components/Header";
import { SimpleFundButton } from "../components/SimpleFundButton";
import { SimpleFundCard } from "../components/SimpleFundCard";
import { WalletConnector } from "../components/WalletConnector";

export default function TestFundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Test Fund Components</h1>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
            <p className="mb-4">
              Connect your wallet to test the Fund components below.
            </p>
            <WalletConnector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Simple Fund Button</h2>
              <SimpleFundButton />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Simple Fund Card</h2>
              <SimpleFundCard />
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
            <p>
              If the components don't work, check the browser console for
              errors.
            </p>
            <p>Make sure your wallet is connected to the Base network.</p>
            <p>
              Verify that all environment variables are correctly set in Vercel.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
