"use client";

import { memo, useState } from "react";
import { useCoinbaseRampTransaction } from "../contexts/CoinbaseRampTransactionContext";
import { AmountInput } from "./AmountInput";
import { ChainTokenSelector } from "./ChainTokenSelector";
import { CurrencySelector } from "./CurrencySelector";
import { OrderHistory } from "./OrderHistory";
import { RampTransactionSummary } from "./RampTransactionSummary";
import { RegionSelector } from "./RegionSelector";
import { WalletConnector } from "./WalletConnector";
import { useAccount } from "wagmi";
import { RampTransaction } from "../types/RampTransaction";
import { OnrampConfigCountry } from "@coinbase/onchainkit/fund";

export const CustomIntegrationDemo = memo(function CustomIntegrationDemo() {
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const { authenticated, rampTransaction, setRampTransaction } =
    useCoinbaseRampTransaction();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("0");

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    setRampTransaction({
      ...rampTransaction,
      amount: newAmount,
      wallet: address,
    });
  };

  const handleConnectWallet = () => {
    // This is handled by the WalletConnector component
  };

  const handleCheckout = () => {
    if (
      !authenticated ||
      !rampTransaction?.amount ||
      parseFloat(rampTransaction.amount) <= 0
    ) {
      alert("Please connect your wallet and enter a valid amount");
      return;
    }

    alert(
      "Transaction initiated! This is a demo, no actual transaction will occur."
    );
  };

  return (
    <>
      <div className="flex gap-4 justify-center py-4">
        <WalletConnector buttonStyle="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors" />
        {authenticated && (
          <button
            onClick={() => setShowOrderHistory(true)}
            className="cursor-pointer hover:opacity-50 active:opacity-30 flex items-center justify-center"
            aria-label="Order History"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Form */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            {/* Region Selector */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <div className="bg-black text-white p-2 rounded-md mb-1">
                  <span className="text-sm">country</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-md appearance-none"
                    onChange={(e) => {
                      // Update country in rampTransaction
                      setRampTransaction({
                        ...rampTransaction,
                        country: {
                          id: e.target.value,
                          subdivisions: [],
                          paymentMethods: [],
                        },
                      });
                    }}
                    value={rampTransaction?.country?.id || "US"}
                  >
                    <option value="US">United States of America</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="NL">Netherlands</option>
                    <option value="CH">Switzerland</option>
                    <option value="SG">Singapore</option>
                    <option value="JP">Japan</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-black text-white p-2 rounded-md mb-1">
                  <span className="text-sm">subdivision</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-md appearance-none"
                    onChange={(e) => {
                      // Update subdivision in UI state
                    }}
                  >
                    <option>CA</option>
                    <option>NY</option>
                    <option>TX</option>
                    <option>FL</option>
                    <option>IL</option>
                    <option>PA</option>
                    <option>OH</option>
                    <option>GA</option>
                    <option>NC</option>
                    <option>MI</option>
                    <option>NJ</option>
                    <option>VA</option>
                    <option>WA</option>
                    <option>MA</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col">
              <div className="text-center mb-2">
                <span className="text-6xl font-light">${amount}</span>
              </div>
              <div className="text-center text-red-500 text-sm mb-2">
                {parseFloat(amount) > 0 &&
                  parseFloat(amount) < 2 &&
                  "Amount must be greater than minimum"}
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Min: $2.00</span>
                <span>Max: $7,500.00</span>
              </div>
              <div className="flex gap-2 justify-center mb-4">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => handleAmountChange("10")}
                >
                  $10
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => handleAmountChange("25")}
                >
                  $25
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => handleAmountChange("50")}
                >
                  $50
                </button>
              </div>
            </div>

            {/* Asset & Currency Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="bg-black text-white p-2 rounded-md mb-1">
                  <span className="text-sm">Buy</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-md appearance-none"
                    onChange={(e) =>
                      setRampTransaction({
                        ...rampTransaction,
                        chainToken: e.target.value,
                      })
                    }
                    value={rampTransaction?.chainToken || "USDC"}
                  >
                    <option value="USDC">USDC</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                    <option value="SOL">SOL</option>
                    <option value="MATIC">MATIC</option>
                    <option value="AVAX">AVAX</option>
                    <option value="LINK">LINK</option>
                    <option value="UNI">UNI</option>
                    <option value="AAVE">AAVE</option>
                    <option value="DAI">DAI</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-black text-white p-2 rounded-md mb-1">
                  <span className="text-sm">Currency</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-md appearance-none"
                    onChange={(e) =>
                      setRampTransaction({
                        ...rampTransaction,
                        currency: e.target.value,
                      })
                    }
                    value={rampTransaction?.currency || "USD"}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="JPY">JPY</option>
                    <option value="CHF">CHF</option>
                    <option value="SGD">SGD</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Network & Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="bg-black text-white p-2 rounded-md mb-1">
                  <span className="text-sm">Network</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-md appearance-none"
                    onChange={(e) => {
                      // We don't update rampTransaction here since network is not in the type
                      // Just keep the UI state
                    }}
                    value={rampTransaction?.chainToken || "Base"}
                  >
                    <option value="Base">Base</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="Optimism">Optimism</option>
                    <option value="Arbitrum">Arbitrum</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Avalanche">Avalanche</option>
                    <option value="Solana">Solana</option>
                    <option value="BNB Chain">BNB Chain</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-black text-white p-2 rounded-md mb-1">
                  <span className="text-sm">Payment Method</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-md appearance-none"
                    onChange={(e) =>
                      setRampTransaction({
                        ...rampTransaction,
                        paymentMethod: e.target.value,
                      })
                    }
                    value={rampTransaction?.paymentMethod || "CARD"}
                  >
                    <option value="CARD">CARD</option>
                    <option value="BANK">BANK</option>
                    <option value="APPLE_PAY">APPLE PAY</option>
                    <option value="GOOGLE_PAY">GOOGLE PAY</option>
                    <option value="PAYPAL">PAYPAL</option>
                    <option value="COINBASE">COINBASE</option>
                    <option value="ACH">ACH</option>
                    <option value="SEPA">SEPA</option>
                    <option value="IDEAL">IDEAL</option>
                    <option value="SOFORT">SOFORT</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Transaction Summary */}
          <div className="w-full md:w-1/3">
            <div className="bg-black text-white rounded-lg p-6">
              <h3 className="text-xl font-medium mb-4">Transaction Summary</h3>
              <div className="mb-4">
                <p className="text-blue-400 text-xl mb-2">
                  Buy ${amount} of {rampTransaction?.chainToken || "USDC"}
                </p>
                <p className="text-gray-400 flex justify-between">
                  <span>{rampTransaction?.chainToken || "USDC"} Price</span>
                  <span>-</span>
                </p>
              </div>

              <div className="border border-gray-700 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount Received</span>
                  <span>
                    {parseFloat(amount) > 0
                      ? parseFloat(amount).toFixed(3)
                      : "0.000"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Network:</span>
                  <span>{rampTransaction?.chainToken || "Base"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Pay With:</span>
                  <span>{rampTransaction?.paymentMethod || "CARD"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span>
                    {address
                      ? `${address.substring(0, 6)}...${address.substring(
                          address.length - 4
                        )}`
                      : ""}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Sending funds is a permanent action. For your security, be sure
                you own the wallet address listed
              </p>

              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span>${amount}</span>
              </div>
              <p className="text-gray-400 text-xs mb-4">
                including spread + $0.00 fees
              </p>

              {authenticated ? (
                <button
                  className="w-full py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                  onClick={handleCheckout}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Buy Now
                </button>
              ) : (
                <WalletConnector buttonStyle="w-full py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Order History
                    </h3>
                    <div className="mt-2 h-[600px] overflow-y-auto">
                      <OrderHistory />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowOrderHistory(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default CustomIntegrationDemo;
