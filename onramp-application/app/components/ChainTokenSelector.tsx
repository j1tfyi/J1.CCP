"use client";
import { useMemo, useState } from "react";
import { useCoinbaseRampTransaction } from "../contexts/CoinbaseRampTransactionContext";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  chainId: number;
}

export interface Chain {
  id: string;
  name: string;
}

export const ChainTokenSelector = () => {
  const {
    selectedPurchaseCurrency,
    setSelectedPurchaseCurrency,
    selectedSellCurrency,
    setSelectedSellCurrency,
    selectedPurchaseCurrencyNetwork,
    setSelectedPurchaseCurrencyNetwork,
    selectedSellCurrencyNetwork,
    setSelectedSellCurrencyNetwork,
    buyOptions,
    sellOptions,
    loadingBuyOptions,
    isOnrampActive,
  } = useCoinbaseRampTransaction();

  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  const handleTokenSelect = (purchaseCurrency: any) => {
    if (isOnrampActive) {
      setSelectedPurchaseCurrency(purchaseCurrency);

      // If the currency has networks, select the first one or BASE if available
      if (purchaseCurrency.networks && purchaseCurrency.networks.length > 0) {
        const baseNetwork = purchaseCurrency.networks.find(
          (network: any) => network.name.toUpperCase() === "BASE"
        );
        setSelectedPurchaseCurrencyNetwork(
          baseNetwork || purchaseCurrency.networks[0]
        );
      }
    } else {
      setSelectedSellCurrency(purchaseCurrency);

      // If the currency has networks, select the first one or BASE if available
      if (purchaseCurrency.networks && purchaseCurrency.networks.length > 0) {
        const baseNetwork = purchaseCurrency.networks.find(
          (network: any) => network.name.toUpperCase() === "BASE"
        );
        setSelectedSellCurrencyNetwork(
          baseNetwork || purchaseCurrency.networks[0]
        );
      }
    }
    setTokenDropdownOpen(false);
  };

  const handleNetworkSelect = (network: any) => {
    if (isOnrampActive) {
      setSelectedPurchaseCurrencyNetwork(network);
    } else {
      setSelectedSellCurrencyNetwork(network);
    }
    setNetworkDropdownOpen(false);
  };

  const getSelectedCurrency = () => {
    return isOnrampActive
      ? selectedPurchaseCurrency?.id
      : selectedSellCurrency?.id;
  };

  const getSelectedNetwork = () => {
    if (isOnrampActive && selectedPurchaseCurrencyNetwork) {
      return selectedPurchaseCurrencyNetwork.displayName;
    } else if (!isOnrampActive && selectedSellCurrencyNetwork) {
      return selectedSellCurrencyNetwork.display_name;
    }
    return "Select Network";
  };

  const getAvailableNetworks = useMemo(() => {
    if (isOnrampActive && selectedPurchaseCurrency) {
      return selectedPurchaseCurrency.networks || [];
    } else if (!isOnrampActive && selectedSellCurrency) {
      return selectedSellCurrency.networks || [];
    }
    return [];
  }, [isOnrampActive, selectedPurchaseCurrency, selectedSellCurrency]);

  // Helper function to get the display name of a network regardless of its type
  const getNetworkDisplayName = (network: any) => {
    return isOnrampActive ? network.displayName : network.display_name;
  };

  return (
    <div className="w-full">
      {loadingBuyOptions ? (
        <>
          <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse"></div>
        </>
      ) : (
        <>
          <div className="relative mb-4">
            <button
              type="button"
              className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setTokenDropdownOpen(!tokenDropdownOpen)}
            >
              {getSelectedCurrency() ||
                `Select ${isOnrampActive ? "Buy" : "Sell"} Token`}
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {tokenDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {(
                  (isOnrampActive
                    ? buyOptions?.purchaseCurrencies
                    : sellOptions?.sell_currencies) || []
                ).map((currency) => (
                  <div
                    key={currency.id}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                    onClick={() => handleTokenSelect(currency)}
                  >
                    {currency.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(isOnrampActive
            ? selectedPurchaseCurrency
            : selectedSellCurrency) && (
            <div className="relative">
              <button
                type="button"
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              >
                {getSelectedNetwork()}
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {networkDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {getAvailableNetworks.map((network) => (
                    <div
                      key={getNetworkDisplayName(network)}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 capitalize"
                      onClick={() => handleNetworkSelect(network)}
                    >
                      {getNetworkDisplayName(network)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChainTokenSelector;
