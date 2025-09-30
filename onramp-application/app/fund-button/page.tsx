"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { FundButton } from "../components/FundButton";
import { WalletConnector } from "../components/WalletConnector";

export default function FundButtonPage() {
  const [hideIcon, setHideIcon] = useState(false);
  const [hideText, setHideText] = useState(false);
  const [openIn, setOpenIn] = useState<"popup" | "tab">("popup");
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [presetAmount, setPresetAmount] = useState(20);
  const [customText, setCustomText] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Fund Button Demo</h1>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
            <p className="mb-4">
              Connect your wallet to test the Fund Button below.
            </p>
            <WalletConnector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Button Text
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Fund"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hideIcon"
                    checked={hideIcon}
                    onChange={() => setHideIcon(!hideIcon)}
                    className="mr-2"
                  />
                  <label htmlFor="hideIcon" className="text-sm text-gray-700">
                    Hide Icon
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hideText"
                    checked={hideText}
                    onChange={() => setHideText(!hideText)}
                    className="mr-2"
                  />
                  <label htmlFor="hideText" className="text-sm text-gray-700">
                    Hide Text
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Open In
                  </label>
                  <select
                    value={openIn}
                    onChange={(e) =>
                      setOpenIn(e.target.value as "popup" | "tab")
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="popup">Popup</option>
                    <option value="tab">New Tab</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useCustomUrl"
                    checked={useCustomUrl}
                    onChange={() => setUseCustomUrl(!useCustomUrl)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="useCustomUrl"
                    className="text-sm text-gray-700"
                  >
                    Use Custom Onramp URL
                  </label>
                </div>

                {useCustomUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preset Amount ($)
                    </label>
                    <input
                      type="number"
                      value={presetAmount}
                      onChange={(e) => setPresetAmount(Number(e.target.value))}
                      min="1"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Fund Button</h2>
              <FundButton
                customText={customText || undefined}
                hideIcon={hideIcon}
                hideText={hideText}
                openIn={openIn}
                useCustomUrl={useCustomUrl}
                presetAmount={presetAmount}
              />

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold mb-2">Notes:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Make sure your wallet is connected to the Base network
                  </li>
                  <li>
                    The CDP Project ID must be correctly set in your environment
                    variables
                  </li>
                  <li>
                    If using a custom URL, your wallet address will be included
                    in the URL
                  </li>
                  <li>Check the browser console for any error messages</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
