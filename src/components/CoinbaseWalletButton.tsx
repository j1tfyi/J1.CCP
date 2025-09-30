import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { Wallet, LogOut, Copy, Check, ChevronDown } from "lucide-react";

export function CoinbaseWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const coinbaseConnector = connectors.find((c) => c.id === 'com.coinbase.wallet');

  const handleConnect = () => {
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = () => {
    if (!chain) return 'Unknown Chain';
    return chain.name;
  };

  useEffect(() => {
    if (error) {
      console.error('Connection error:', error);
    }
  }, [error]);

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isPending || !coinbaseConnector}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6600] to-[#ffae00] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium shadow-lg text-sm"
      >
        <Wallet className="h-4 w-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6600] to-[#ffae00] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">{formatAddress(address || "")}</span>
        <span className="sm:hidden">Connected</span>
        {copied ? (
          <Check className="h-3 w-3 text-white" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-400">Connected to</p>
            <p className="text-sm text-white font-medium">{getChainName()}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyAddress();
              }}
              className="flex items-center gap-2 text-xs text-gray-400 mt-1 hover:text-white transition-colors"
            >
              {formatAddress(address || "")}
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>

          <button
            onClick={() => {
              disconnect();
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}