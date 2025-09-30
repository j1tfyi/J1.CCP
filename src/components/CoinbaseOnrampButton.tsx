import React, { useState } from "react";
import { CreditCard, DollarSign } from "lucide-react";

// J1.CCP Configuration
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";
const CDP_PROJECT_ID = "80a2acea-83de-40aa-be1e-081d47e196c8";

interface OnrampURLParams {
  sessionToken?: string;
  defaultAsset?: string;
  defaultNetwork?: string;
  defaultPaymentMethod?: string;
  presetFiatAmount?: string;
  fiatCurrency?: string;
  partnerUserId?: string;
  redirectUrl?: string;
}

interface OfframpURLParams {
  sessionToken?: string;
  defaultAsset?: string;
  defaultNetwork?: string;
  defaultCashoutMethod?: string;
  presetFiatAmount?: string;
  partnerUserId?: string;
  redirectUrl?: string;
}

/**
 * Generates a session token for secure onramp/offramp initialization
 */
async function generateSessionToken(): Promise<string | null> {
  try {
    // Use the Vercel API endpoint which will work both locally and in production
    const apiUrl = process.env.NODE_ENV === 'production'
      ? '/api/session'
      : 'http://localhost:3000/api/session';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addresses: [{
          address: J1_CCP_ADDRESS,
          blockchains: ["ethereum", "base", "polygon", "arbitrum", "optimism"]
        }],
        assets: ["ETH", "USDC", "USDT", "DAI"]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Session token generation failed:', error);
      return null;
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating session token:', error);
    return null;
  }
}

/**
 * Generates Coinbase Onramp URL
 */
function generateOnrampURL(params: OnrampURLParams): string {
  const baseUrl = "https://pay.coinbase.com/buy/select-asset";
  const queryParams = new URLSearchParams();

  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  });

  return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Generates Coinbase Offramp URL
 */
function generateOfframpURL(params: OfframpURLParams): string {
  const baseUrl = "https://pay.coinbase.com/v3/sell/input";
  const queryParams = new URLSearchParams();

  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  });

  return `${baseUrl}?${queryParams.toString()}`;
}

export function CoinbaseOnrampButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyCrypto = async () => {
    setIsLoading(true);
    try {
      // Always generate a fresh session token for onramp (buy)
      // Session tokens are single-use only
      console.log('Generating fresh session token for onramp...');
      const sessionToken = await generateSessionToken();

      if (sessionToken) {
        // Use session token flow (purchases go directly to J1.CCP wallet)
        const buyUrl = generateOnrampURL({
          sessionToken,
          defaultAsset: "ETH",
          defaultNetwork: "base",
          defaultPaymentMethod: "CARD",
          fiatCurrency: "USD",
          partnerUserId: J1_CCP_ADDRESS.substring(0, 49),
          redirectUrl: window.location.origin
        });
        console.log('Opening onramp with fresh session token');
        window.open(buyUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to app ID flow if session token fails
        console.warn('Session token generation failed, using app ID flow');
        const baseUrl = "https://pay.coinbase.com/buy/select-asset";
        const params = new URLSearchParams({
          appId: CDP_PROJECT_ID,
          defaultAsset: "ETH",
          defaultNetwork: "base",
          defaultPaymentMethod: "CARD",
          fiatCurrency: "USD",
          partnerUserId: J1_CCP_ADDRESS.substring(0, 49),
          redirectUrl: window.location.origin,
          addresses: JSON.stringify({ [J1_CCP_ADDRESS]: ["ethereum", "base", "polygon", "arbitrum", "optimism"] }),
          assets: JSON.stringify(["ETH", "USDC", "USDT", "DAI"])
        });
        window.open(`${baseUrl}?${params}`, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening buy crypto:', error);
      // Fallback to simple URL
      window.open("https://www.coinbase.com/buy", '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellCrypto = async () => {
    setIsLoading(true);
    try {
      // Always generate a fresh session token for offramp (sell)
      // Session tokens are single-use only
      console.log('Generating fresh session token for offramp...');
      const sessionToken = await generateSessionToken();

      if (sessionToken) {
        // Use session token flow with fresh token
        const sellUrl = generateOfframpURL({
          sessionToken,
          defaultAsset: "USDC",
          defaultNetwork: "base",
          defaultCashoutMethod: "BANK_ACCOUNT",
          partnerUserId: J1_CCP_ADDRESS.substring(0, 49),
          redirectUrl: window.location.origin
        });
        console.log('Opening offramp with fresh session token');
        window.open(sellUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to app ID flow if session token fails
        console.warn('Session token generation failed, using app ID flow');
        const baseUrl = "https://pay.coinbase.com/v3/sell/input";
        const params = new URLSearchParams({
          appId: CDP_PROJECT_ID,
          defaultAsset: "USDC",
          defaultNetwork: "base",
          defaultCashoutMethod: "BANK_ACCOUNT",
          partnerUserId: J1_CCP_ADDRESS.substring(0, 49),
          redirectUrl: window.location.origin,
          addresses: JSON.stringify({ [J1_CCP_ADDRESS]: ["ethereum", "base", "polygon", "arbitrum", "optimism"] }),
          assets: JSON.stringify(["ETH", "USDC", "USDT", "DAI"])
        });
        window.open(`${baseUrl}?${params}`, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening sell crypto:', error);
      // Fallback to simple URL
      window.open("https://www.coinbase.com/sell", '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleBuyCrypto}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6600] to-[#ffae00] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm disabled:opacity-50"
      >
        <CreditCard className="h-4 w-4" />
        <span className="hidden sm:inline">{isLoading ? 'Loading...' : 'Fiat → Crypto (Coinbase)'}</span>
        <span className="sm:hidden">{isLoading ? '...' : 'Fiat → Crypto'}</span>
      </button>

      <button
        onClick={handleSellCrypto}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm disabled:opacity-50"
      >
        <DollarSign className="h-4 w-4" />
        <span className="hidden sm:inline">{isLoading ? 'Loading...' : 'Crypto → Fiat (Coinbase)'}</span>
        <span className="sm:hidden">{isLoading ? '...' : 'Crypto → Fiat'}</span>
      </button>
    </div>
  );
}