/**
 * API utilities for Coinbase Onramp
 */
import { fetchOnrampConfig, fetchOnrampOptions } from '@coinbase/onchainkit/fund';

// Types for Buy Config API response
export interface PaymentMethod {
  id: string;
}

export interface Country {
  id: string;
  paymentMethods: PaymentMethod[];
  subdivisions?: string[];
}

export interface BuyConfigResponse {
  countries: Country[];
}

// Types for Buy Options API response
export interface CurrencyLimit {
  id: string;
  min: string;
  max: string;
}

export interface PaymentCurrency {
  id: string;
  name?: string;
  limits: CurrencyLimit[];
}

export interface FiatCurrency {
  id: string;
  name: string;
  symbol?: string;
}

export interface Network {
  chainId: number;
  contractAddress: string;
  displayName: string;
  name: string;
}

export interface PurchaseCurrency {
  iconUrl: string;
  id: string;
  name: string;
  networks: Network[];
  symbol: string;
}

export interface BuyOptionsResponse {
  paymentCurrencies: PaymentCurrency[];
  purchaseCurrencies: PurchaseCurrency[];
}

// Country data with names
export const countryNames: Record<string, string> = {
  // North America
  US: "United States",
  CA: "Canada",
  MX: "Mexico",

  // Europe
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  CH: "Switzerland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  AT: "Austria",
  BE: "Belgium",
  PT: "Portugal",
  GR: "Greece",
  PL: "Poland",
  CZ: "Czech Republic",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  HR: "Croatia",
  SI: "Slovenia",
  LT: "Lithuania",
  LV: "Latvia",
  EE: "Estonia",
  CY: "Cyprus",
  MT: "Malta",
  LU: "Luxembourg",
  IS: "Iceland",
  LI: "Liechtenstein",
  MC: "Monaco",

  // Asia Pacific
  AU: "Australia",
  NZ: "New Zealand",
  JP: "Japan",
  SG: "Singapore",
  HK: "Hong Kong",
  KR: "South Korea",
  TW: "Taiwan",
  TH: "Thailand",
  MY: "Malaysia",
  PH: "Philippines",
  ID: "Indonesia",
  VN: "Vietnam",
  IN: "India",
  CN: "China",

  // Middle East & Africa
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  QA: "Qatar",
  BH: "Bahrain",
  KW: "Kuwait",
  OM: "Oman",
  IL: "Israel",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",

  // Latin America
  BR: "Brazil",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  UY: "Uruguay",
  CR: "Costa Rica",
  PA: "Panama",

  // Other regions
  TR: "Turkey",
  RU: "Russia",
  UA: "Ukraine",
  BY: "Belarus",
  KZ: "Kazakhstan",
};

// Cache for API responses
let buyConfigCache: BuyConfigResponse | null = null;
let buyOptionsCache: Record<string, BuyOptionsResponse> = {};
const CACHE_EXPIRY = 1000 * 60 * 15; // 15 minutes
let lastConfigFetch = 0;
let lastOptionsFetch: Record<string, number> = {};

// Define asset-network compatibility mapping
const assetNetworkMap: Record<string, string[]> = {
  ETH: ["ethereum", "base", "optimism", "arbitrum", "polygon"],
  USDC: [
    "ethereum",
    "base",
    "optimism",
    "arbitrum",
    "polygon",
    "solana",
    "avalanche-c-chain",
    "unichain",
    "aptos",
    "bnb-chain",
  ],
  BTC: ["bitcoin", "bitcoin-lightning"],
  SOL: ["solana"],
  MATIC: ["polygon", "ethereum"],
  AVAX: ["avalanche-c-chain"],
  ADA: ["cardano"],
  DOT: ["polkadot"],
  ATOM: ["cosmos"],
  XRP: ["xrp"],
  ALGO: ["algorand"],
  FIL: ["filecoin"],
  NEAR: ["near"],
  XLM: ["stellar"],
  TRX: ["tron"],
  // Add more mappings as needed
};

/**
 * Fetches the list of supported countries and payment methods
 */
export async function fetchBuyConfig(): Promise<BuyConfigResponse> {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (buyConfigCache && now - lastConfigFetch < CACHE_EXPIRY) {
      return buyConfigCache;
    }

    // Use the OnchainKit utility to fetch the config
    const config = await fetchOnrampConfig();
    console.log('Buy config API response from OnchainKit:', config);

    // Transform the response to match our expected format if needed
    const transformedConfig: BuyConfigResponse = {
      countries: config.countries.map(country => ({
        id: country.id,
        paymentMethods: country.paymentMethods.map(method => ({ id: String(method) })),
        subdivisions: country.subdivisions
      }))
    };

    // Log all country IDs for debugging
    if (transformedConfig && transformedConfig.countries && Array.isArray(transformedConfig.countries)) {
      console.log('Countries returned by API:', transformedConfig.countries.map(c => c.id).join(', '));
    }

    // Update cache
    buyConfigCache = transformedConfig;
    lastConfigFetch = now;

    return transformedConfig;
  } catch (error) {
    console.error("Error fetching buy config:", error);

    // If API call fails and we have a cache, return the cache even if expired
    if (buyConfigCache) {
      console.warn("Returning cached buy config due to API error");
      return buyConfigCache;
    }

    // If no cache, return a default response
    return {
      countries: [
        {
          id: "US",
          paymentMethods: [
            { id: "CARD" },
            { id: "ACH_BANK_ACCOUNT" },
            { id: "APPLE_PAY" },
            { id: "PAYPAL" }
          ],
          subdivisions: [
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
            "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
            "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
          ]
        },
        {
          id: "GB",
          paymentMethods: [
            { id: "CARD" },
            { id: "PAYPAL" }
          ]
        },
        {
          id: "DE",
          paymentMethods: [
            { id: "CARD" },
            { id: "SEPA" }
          ]
        },
        {
          id: "FR",
          paymentMethods: [
            { id: "CARD" },
            { id: "SEPA" }
          ]
        },
        {
          id: "ES",
          paymentMethods: [
            { id: "CARD" },
            { id: "SEPA" }
          ]
        },
        {
          id: "IT",
          paymentMethods: [
            { id: "CARD" },
            { id: "SEPA" }
          ]
        },
        {
          id: "CA",
          paymentMethods: [
            { id: "CARD" }
          ]
        },
        {
          id: "AU",
          paymentMethods: [
            { id: "CARD" }
          ]
        }
      ]
    };
  }
}

/**
 * Fetches the available options for buying crypto
 */
export async function fetchBuyOptions(country: string, subdivision?: string): Promise<BuyOptionsResponse> {
  try {
    // Create a cache key based on country and subdivision
    const cacheKey = `${country}${subdivision ? `-${subdivision}` : ''}`;

    // Check if we have a valid cache
    const now = Date.now();
    if (buyOptionsCache[cacheKey] && now - (lastOptionsFetch[cacheKey] || 0) < CACHE_EXPIRY) {
      return buyOptionsCache[cacheKey];
    }

    // Use the OnchainKit utility to fetch the options
    const options = await fetchOnrampOptions({ country, subdivision });
    console.log('Buy options API response from OnchainKit:', options);

    // Transform the response to match our expected format if needed
    const transformedOptions: BuyOptionsResponse = {
      paymentCurrencies: options.paymentCurrencies || [],
      purchaseCurrencies: (options.purchaseCurrencies || []).map(currency => ({
        ...currency,
        networks: (currency.networks || []).map(network => ({
          ...network,
          chainId: Number(network.chainId) // Convert chainId from string to number
        }))
      }))
    };

    // Log all payment currencies and purchase currencies for debugging
    if (transformedOptions.paymentCurrencies && Array.isArray(transformedOptions.paymentCurrencies)) {
      console.log('Payment currencies returned by API:', transformedOptions.paymentCurrencies.map(c => c.id).join(', '));
    }
    if (transformedOptions.purchaseCurrencies && Array.isArray(transformedOptions.purchaseCurrencies)) {
      console.log('Purchase currencies (assets) returned by API:', transformedOptions.purchaseCurrencies.map(c => c.id).join(', '));
    }

    // Update cache
    buyOptionsCache[cacheKey] = transformedOptions;
    lastOptionsFetch[cacheKey] = now;

    return transformedOptions;
  } catch (error) {
    console.error("Error fetching buy options:", error);

    // If API call fails and we have a cache for this country/subdivision, return the cache even if expired
    const cacheKey = `${country}${subdivision ? `-${subdivision}` : ''}`;
    if (buyOptionsCache[cacheKey]) {
      console.warn("Returning cached buy options due to API error");
      return buyOptionsCache[cacheKey];
    }

    // If no cache, return a default response
    return {
      paymentCurrencies: [
        {
          id: "USD",
          name: "US Dollar",
          limits: [
            {
              id: "CARD",
              min: "10.00",
              max: "1000.00"
            },
            {
              id: "ACH_BANK_ACCOUNT",
              min: "10.00",
              max: "25000.00"
            },
            {
              id: "APPLE_PAY",
              min: "10.00",
              max: "1000.00"
            },
            {
              id: "PAYPAL",
              min: "10.00",
              max: "1000.00"
            }
          ]
        },
        {
          id: "EUR",
          name: "Euro",
          limits: [
            {
              id: "CARD",
              min: "10.00",
              max: "1000.00"
            },
            {
              id: "SEPA",
              min: "10.00",
              max: "25000.00"
            }
          ]
        },
        {
          id: "GBP",
          name: "British Pound",
          limits: [
            {
              id: "CARD",
              min: "10.00",
              max: "1000.00"
            },
            {
              id: "PAYPAL",
              min: "10.00",
              max: "1000.00"
            }
          ]
        }
      ],
      purchaseCurrencies: [
        {
          iconUrl: "",
          id: "ETH",
          name: "Ethereum",
          symbol: "ETH",
          networks: [
            {
              chainId: 1,
              contractAddress: "",
              displayName: "Ethereum",
              name: "ethereum"
            },
            {
              chainId: 10,
              contractAddress: "",
              displayName: "Optimism",
              name: "optimism"
            },
            {
              chainId: 42161,
              contractAddress: "",
              displayName: "Arbitrum",
              name: "arbitrum"
            },
            {
              chainId: 8453,
              contractAddress: "",
              displayName: "Base",
              name: "base"
            }
          ]
        },
        {
          iconUrl: "",
          id: "USDC",
          name: "USD Coin",
          symbol: "USDC",
          networks: [
            {
              chainId: 1,
              contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
              displayName: "Ethereum",
              name: "ethereum"
            },
            {
              chainId: 10,
              contractAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
              displayName: "Optimism",
              name: "optimism"
            },
            {
              chainId: 42161,
              contractAddress: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
              displayName: "Arbitrum",
              name: "arbitrum"
            },
            {
              chainId: 8453,
              contractAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
              displayName: "Base",
              name: "base"
            },
            {
              chainId: 137,
              contractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
              displayName: "Polygon",
              name: "polygon"
            },
            {
              chainId: 1111,
              contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
              displayName: "Unichain",
              name: "unichain"
            },
            {
              chainId: 1,
              contractAddress: "0xfedcba9876543210fedcba9876543210fedcba98",
              displayName: "Aptos",
              name: "aptos"
            },
            {
              chainId: 43114,
              contractAddress: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
              displayName: "Avalanche",
              name: "avalanche"
            },
            {
              chainId: 56,
              contractAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
              displayName: "BNB Chain",
              name: "bnb-chain"
            },
            {
              chainId: 0,
              contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              displayName: "Solana",
              name: "solana"
            }
          ]
        },
        {
          iconUrl: "",
          id: "BTC",
          name: "Bitcoin",
          symbol: "BTC",
          networks: [
            {
              chainId: 0,
              contractAddress: "",
              displayName: "Bitcoin",
              name: "bitcoin"
            }
          ]
        },
        {
          iconUrl: "",
          id: "SOL",
          name: "Solana",
          symbol: "SOL",
          networks: [
            {
              chainId: 0,
              contractAddress: "",
              displayName: "Solana",
              name: "solana"
            }
          ]
        },
        {
          iconUrl: "",
          id: "MATIC",
          name: "Polygon",
          symbol: "MATIC",
          networks: [
            {
              chainId: 1,
              contractAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
              displayName: "Ethereum",
              name: "ethereum"
            },
            {
              chainId: 137,
              contractAddress: "",
              displayName: "Polygon",
              name: "polygon"
            }
          ]
        }
      ]
    };
  }
}
