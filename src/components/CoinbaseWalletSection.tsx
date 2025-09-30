import React, { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { CoinbaseWalletButton } from "./CoinbaseWalletButton";
import { CoinbaseOnrampButton } from "./CoinbaseOnrampButton";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Wallet, Copy, Check, CreditCard, ExternalLink } from "lucide-react";

export function CoinbaseWalletSection() {
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

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

  if (!isConnected) {
    return (
      <Card className="p-8 bg-card-gradient backdrop-blur-sm border-border/40 text-center">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-3">Connect Your Wallet</h3>
        <p className="text-foreground/70 mb-6">
          Connect your Coinbase Wallet to buy and sell crypto instantly!
        </p>
        <div className="flex justify-center">
          <CoinbaseWalletButton />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card-gradient backdrop-blur-sm border-border/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-8 h-8 text-primary" />
          Your Wallet
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => disconnect()}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-background/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/70 mb-1">Wallet Address</p>
              <p className="font-mono text-sm">{formatAddress(address || "")}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="flex items-center gap-1"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CoinbaseOnrampButton />

          <Button
            variant="outline"
            onClick={() => window.open(`https://basescan.org/address/${address}`, "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            View on Explorer
          </Button>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary flex items-center gap-2">
            <span className="font-semibold">✨ New Feature:</span>
            Your embedded wallet works across all supported chains!
          </p>
        </div>
      </div>
    </Card>
  );
}