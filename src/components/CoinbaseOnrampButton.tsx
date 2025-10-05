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
    <div className="flex items-center gap-2">
      <button
        onClick={handleBuyCrypto}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6600] to-[#ffae00] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm"
        title="Buy crypto with fiat currency via Coinbase"
      >
        <CreditCard className="h-4 w-4" />
        <span className="hidden sm:inline">Fiat → Coinbase</span>
        <span className="sm:hidden">Fiat → Crypto</span>
      </button>

      <button
        onClick={handleSellCrypto}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm"
        title="Sell crypto for fiat currency via Coinbase"
      >
        <DollarSign className="h-4 w-4" />
        <span className="hidden sm:inline">Coinbase → Fiat</span>
        <span className="sm:hidden">Crypto → Fiat</span>
      </button>
    </div>
  );
}