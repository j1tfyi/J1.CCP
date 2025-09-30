/**
 * API utilities for Coinbase Offramp
 */

// Types for Sell Config API response
export interface CashoutMethod {
  id: string;
  name: string;
  description?: string;
}

export interface Country {
  code: string;
  name: string;
  cashout_methods: CashoutMethod[];
  supported_states?: string[];
}

export interface SellConfigResponse {
  countries: Country[];
}

// Types for Sell Options API response
export interface CurrencyLimit {
  min: string;
  max: string;
}

export interface CashoutMethodOption {
  id: string;
  name: string;
  limits: Record<string, CurrencyLimit>;
}

export interface FiatCurrency {
  code: string;
  name: string;
  cashout_methods: CashoutMethodOption[];
}

export interface CryptoAsset {
  code: string;
  name: string;
  networks: {
    id: string;
    name: string;
  }[];
}

export interface SellOptionsResponse {
  cashout_currencies: FiatCurrency[];
  sell_currencies: CryptoAsset[];
}

// Country data with names
export const countryNames: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  AU: "Australia",
  JP: "Japan",
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
  NZ: "New Zealand",
  SG: "Singapore",
  HK: "Hong Kong",
  AE: "United Arab Emirates",
  BR: "Brazil",
  MX: "Mexico",
};

/**
 * Fetches the list of supported countries and cashout methods
 */
export async function fetchSellConfig(): Promise<SellConfigResponse> {
  try {
    // In a real implementation, you would make an actual API call
    // For demo purposes, we'll return mock data
    return {
      countries: [
        {
          code: "US",
          name: "United States",
          cashout_methods: [
            { id: "ACH_BANK_ACCOUNT", name: "Bank Transfer (ACH)", description: "US only, 1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
          supported_states: [
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
            "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
            "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
            "DC"
          ],
        },
        {
          code: "GB",
          name: "United Kingdom",
          cashout_methods: [
            { id: "SEPA_BANK_ACCOUNT", name: "SEPA Bank Transfer", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
        },
        {
          code: "CA",
          name: "Canada",
          cashout_methods: [
            { id: "EFT_BANK_ACCOUNT", name: "EFT Bank Transfer", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
          supported_states: [
            "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"
          ],
        },
        {
          code: "DE",
          name: "Germany",
          cashout_methods: [
            { id: "SEPA_BANK_ACCOUNT", name: "SEPA Bank Transfer", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
        },
        {
          code: "FR",
          name: "France",
          cashout_methods: [
            { id: "SEPA_BANK_ACCOUNT", name: "SEPA Bank Transfer", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
        },
        {
          code: "ES",
          name: "Spain",
          cashout_methods: [
            { id: "SEPA_BANK_ACCOUNT", name: "SEPA Bank Transfer", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
        },
        {
          code: "IT",
          name: "Italy",
          cashout_methods: [
            { id: "SEPA_BANK_ACCOUNT", name: "SEPA Bank Transfer", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
        },
        {
          code: "AU",
          name: "Australia",
          cashout_methods: [
            { id: "PAYID", name: "PayID", description: "1-3 business days" },
            { id: "PAYPAL", name: "PayPal", description: "Available in select countries" },
            { id: "FIAT_WALLET", name: "Coinbase Fiat Wallet", description: "Instant transfer to your Coinbase account" },
          ],
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching sell config:", error);
    throw error;
  }
}

/**
 * Fetches the available options for selling crypto
 */
export async function fetchSellOptions(country: string, subdivision?: string): Promise<SellOptionsResponse> {
  try {
    // In a real implementation, you would make an actual API call with the country and subdivision
    // For demo purposes, we'll return mock data
    return {
      cashout_currencies: [
        {
          code: "USD",
          name: "US Dollar",
          cashout_methods: [
            {
              id: "ACH_BANK_ACCOUNT",
              name: "Bank Transfer (ACH)",
              limits: {
                USD: { min: "10", max: "25000" },
              },
            },
            {
              id: "PAYPAL",
              name: "PayPal",
              limits: {
                USD: { min: "10", max: "5000" },
              },
            },
            {
              id: "FIAT_WALLET",
              name: "Coinbase Fiat Wallet",
              limits: {
                USD: { min: "1", max: "50000" },
              },
            },
          ],
        },
        {
          code: "EUR",
          name: "Euro",
          cashout_methods: [
            {
              id: "SEPA_BANK_ACCOUNT",
              name: "SEPA Bank Transfer",
              limits: {
                EUR: { min: "10", max: "25000" },
              },
            },
            {
              id: "PAYPAL",
              name: "PayPal",
              limits: {
                EUR: { min: "10", max: "5000" },
              },
            },
            {
              id: "FIAT_WALLET",
              name: "Coinbase Fiat Wallet",
              limits: {
                EUR: { min: "1", max: "50000" },
              },
            },
          ],
        },
        {
          code: "GBP",
          name: "British Pound",
          cashout_methods: [
            {
              id: "SEPA_BANK_ACCOUNT",
              name: "SEPA Bank Transfer",
              limits: {
                GBP: { min: "10", max: "25000" },
              },
            },
            {
              id: "PAYPAL",
              name: "PayPal",
              limits: {
                GBP: { min: "10", max: "5000" },
              },
            },
            {
              id: "FIAT_WALLET",
              name: "Coinbase Fiat Wallet",
              limits: {
                GBP: { min: "1", max: "50000" },
              },
            },
          ],
        },
        {
          code: "CAD",
          name: "Canadian Dollar",
          cashout_methods: [
            {
              id: "EFT_BANK_ACCOUNT",
              name: "EFT Bank Transfer",
              limits: {
                CAD: { min: "10", max: "25000" },
              },
            },
            {
              id: "PAYPAL",
              name: "PayPal",
              limits: {
                CAD: { min: "10", max: "5000" },
              },
            },
            {
              id: "FIAT_WALLET",
              name: "Coinbase Fiat Wallet",
              limits: {
                CAD: { min: "1", max: "50000" },
              },
            },
          ],
        },
        {
          code: "AUD",
          name: "Australian Dollar",
          cashout_methods: [
            {
              id: "PAYID",
              name: "PayID",
              limits: {
                AUD: { min: "10", max: "25000" },
              },
            },
            {
              id: "PAYPAL",
              name: "PayPal",
              limits: {
                AUD: { min: "10", max: "5000" },
              },
            },
            {
              id: "FIAT_WALLET",
              name: "Coinbase Fiat Wallet",
              limits: {
                AUD: { min: "1", max: "50000" },
              },
            },
          ],
        },
      ],
      sell_currencies: [
        {
          code: "BTC",
          name: "Bitcoin",
          networks: [{ id: "bitcoin", name: "Bitcoin" }],
        },
        {
          code: "ETH",
          name: "Ethereum",
          networks: [
            { id: "ethereum", name: "Ethereum" },
            { id: "base", name: "Base" },
            { id: "optimism", name: "Optimism" },
            { id: "arbitrum", name: "Arbitrum" },
          ],
        },
        {
          code: "USDC",
          name: "USD Coin",
          networks: [
            { id: "ethereum", name: "Ethereum" },
            { id: "base", name: "Base" },
            { id: "optimism", name: "Optimism" },
            { id: "polygon", name: "Polygon" },
            { id: "arbitrum", name: "Arbitrum" },
            { id: "solana", name: "Solana" },
            { id: "avalanche-c-chain", name: "Avalanche" },
            { id: "unichain", name: "Unichain" },
            { id: "aptos", name: "Aptos" },
            { id: "bnb-chain", name: "BNB Chain" }
          ],
        },
        {
          code: "SOL",
          name: "Solana",
          networks: [{ id: "solana", name: "Solana" }],
        },
        {
          code: "MATIC",
          name: "Polygon",
          networks: [
            { id: "ethereum", name: "Ethereum" },
            { id: "polygon", name: "Polygon" },
          ],
        },
        {
          code: "AVAX",
          name: "Avalanche",
          networks: [
            { id: "ethereum", name: "Ethereum" },
            { id: "avalanche-c-chain", name: "Avalanche" },
          ],
        },
        {
          code: "LINK",
          name: "Chainlink",
          networks: [
            { id: "ethereum", name: "Ethereum" },
            { id: "base", name: "Base" },
            { id: "arbitrum", name: "Arbitrum" },
          ],
        },
        {
          code: "UNI",
          name: "Uniswap",
          networks: [
            { id: "ethereum", name: "Ethereum" },
            { id: "polygon", name: "Polygon" },
          ],
        },
        {
          code: "DOGE",
          name: "Dogecoin",
          networks: [{ id: "dogecoin", name: "Dogecoin" }],
        },
        {
          code: "SHIB",
          name: "Shiba Inu",
          networks: [{ id: "ethereum", name: "Ethereum" }],
        },
        {
          code: "XRP",
          name: "XRP",
          networks: [{ id: "ripple", name: "XRP Ledger" }],
        },
        {
          code: "LTC",
          name: "Litecoin",
          networks: [{ id: "litecoin", name: "Litecoin" }],
        },
        {
          code: "BCH",
          name: "Bitcoin Cash",
          networks: [{ id: "bitcoin-cash", name: "Bitcoin Cash" }],
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching sell options:", error);
    throw error;
  }
}
