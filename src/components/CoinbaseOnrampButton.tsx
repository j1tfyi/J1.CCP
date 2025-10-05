import React from "react";
import { CreditCard, DollarSign } from "lucide-react";

/**
 * CoinbaseOnrampButton Component
 *
 * Simple Coinbase buy/sell links without complex integration
 */
export function CoinbaseOnrampButton() {
  const handleBuyCrypto = () => {
    window.open('https://www.coinbase.com/buy', '_blank', 'noopener,noreferrer');
  };

  const handleSellCrypto = () => {
    window.open('https://www.coinbase.com/sell', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <button
        onClick={handleBuyCrypto}
        className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-[#ff6600] to-[#ffae00] text-white rounded hover:opacity-90 transition-opacity font-medium shadow-lg text-[10px] sm:text-sm sm:px-4 sm:py-2 sm:gap-2 sm:rounded-lg"
        title="Buy crypto with fiat currency via Coinbase"
      >
        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Fiat → Coinbase</span>
        <span className="sm:hidden">Fiat → Crypto</span>
      </button>

      <button
        onClick={handleSellCrypto}
        className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded hover:opacity-90 transition-opacity font-medium shadow-lg text-[10px] sm:text-sm sm:px-4 sm:py-2 sm:gap-2 sm:rounded-lg"
        title="Sell crypto for fiat currency via Coinbase"
      >
        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Coinbase → Fiat</span>
        <span className="sm:hidden">Crypto → Fiat</span>
      </button>
    </div>
  );
}