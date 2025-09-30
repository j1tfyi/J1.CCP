"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { RampTransaction } from "../types/RampTransaction";

interface Country {
  id: string;
  name: string;
  subdivisions: string[];
  paymentMethods?: Array<{
    id: string;
    name?: string;
  }>;
}

interface Currency {
  id: string;
  name: string;
}

interface Network {
  name: string;
  displayName: string;
}

interface PurchaseCurrency {
  id: string;
  name: string;
  symbol: string;
  networks: Network[];
}

interface SellCurrencyNetwork {
  name: string;
  display_name: string;
}

interface SellCurrency {
  id: string;
  name: string;
  networks: SellCurrencyNetwork[];
}

interface BuyOptions {
  paymentCurrencies: Currency[];
  purchaseCurrencies: PurchaseCurrency[];
}

interface SellOptions {
  sell_currencies: SellCurrency[];
}

interface CoinbaseRampTransactionContextType {
  countries: Country[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  selectedSubdivision: string | null;
  setSelectedSubdivision: (subdivision: string | null) => void;
  selectedCurrency: Currency | null;
  setSelectedCurrency: (currency: Currency | null) => void;
  buyOptions: BuyOptions | null;
  sellOptions: SellOptions | null;
  loadingBuyConfig: boolean;
  loadingBuyOptions: boolean;
  selectedPurchaseCurrency: PurchaseCurrency | null;
  setSelectedPurchaseCurrency: (currency: PurchaseCurrency) => void;
  selectedPurchaseCurrencyNetwork: Network | null;
  setSelectedPurchaseCurrencyNetwork: (network: Network | null) => void;
  selectedSellCurrency: SellCurrency | null;
  setSelectedSellCurrency: (currency: SellCurrency) => void;
  selectedSellCurrencyNetwork: SellCurrencyNetwork | null;
  setSelectedSellCurrencyNetwork: (network: SellCurrencyNetwork | null) => void;
  isOnrampActive: boolean;
  setIsOnrampActive: (isActive: boolean) => void;
  rampTransaction?: RampTransaction;
  setRampTransaction: (transaction: RampTransaction) => void;
  setSelectedPaymentMethod: (method: any) => void;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  partnerUserId?: string;
}

const CoinbaseRampTransactionContext = createContext<
  CoinbaseRampTransactionContextType | undefined
>(undefined);

// Sample data for demonstration
const sampleCountries: Country[] = [
  {
    id: "US",
    name: "United States",
    subdivisions: ["California", "New York", "Texas"],
    paymentMethods: [
      { id: "credit_card", name: "Credit Card" },
      { id: "debit_card", name: "Debit Card" },
      { id: "bank_transfer", name: "Bank Transfer" },
    ],
  },
  {
    id: "CA",
    name: "Canada",
    subdivisions: ["Ontario", "Quebec", "British Columbia"],
    paymentMethods: [
      { id: "credit_card", name: "Credit Card" },
      { id: "debit_card", name: "Debit Card" },
    ],
  },
  {
    id: "GB",
    name: "United Kingdom",
    subdivisions: [],
    paymentMethods: [
      { id: "credit_card", name: "Credit Card" },
      { id: "bank_transfer", name: "Bank Transfer" },
    ],
  },
  {
    id: "DE",
    name: "Germany",
    subdivisions: [],
    paymentMethods: [
      { id: "credit_card", name: "Credit Card" },
      { id: "sepa", name: "SEPA Transfer" },
    ],
  },
];

const sampleCurrencies: Currency[] = [
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
  { id: "GBP", name: "British Pound" },
];

const sampleNetworks: Network[] = [
  { name: "ethereum", displayName: "Ethereum" },
  { name: "base", displayName: "Base" },
  { name: "optimism", displayName: "Optimism" },
];

const samplePurchaseCurrencies: PurchaseCurrency[] = [
  { id: "BTC", name: "Bitcoin", symbol: "₿", networks: sampleNetworks },
  { id: "ETH", name: "Ethereum", symbol: "Ξ", networks: sampleNetworks },
  { id: "USDC", name: "USD Coin", symbol: "$", networks: sampleNetworks },
];

const sampleSellCurrencies: SellCurrency[] = [
  {
    id: "BTC",
    name: "Bitcoin",
    networks: sampleNetworks.map((n) => ({
      name: n.name,
      display_name: n.displayName,
    })),
  },
  {
    id: "ETH",
    name: "Ethereum",
    networks: sampleNetworks.map((n) => ({
      name: n.name,
      display_name: n.displayName,
    })),
  },
  {
    id: "USDC",
    name: "USD Coin",
    networks: sampleNetworks.map((n) => ({
      name: n.name,
      display_name: n.displayName,
    })),
  },
];

export const CoinbaseRampTransactionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [countries] = useState<Country[]>(sampleCountries);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    sampleCountries[0]
  );
  const [selectedSubdivision, setSelectedSubdivision] = useState<string | null>(
    null
  );
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    sampleCurrencies[0]
  );
  const [loadingBuyConfig, setLoadingBuyConfig] = useState(false);
  const [loadingBuyOptions, setLoadingBuyOptions] = useState(false);
  const [buyOptions, setBuyOptions] = useState<BuyOptions | null>({
    paymentCurrencies: sampleCurrencies,
    purchaseCurrencies: samplePurchaseCurrencies,
  });
  const [sellOptions, setSellOptions] = useState<SellOptions | null>({
    sell_currencies: sampleSellCurrencies,
  });
  const [selectedPurchaseCurrency, setSelectedPurchaseCurrency] =
    useState<PurchaseCurrency | null>(samplePurchaseCurrencies[0]);
  const [selectedPurchaseCurrencyNetwork, setSelectedPurchaseCurrencyNetwork] =
    useState<Network | null>(sampleNetworks[0]);
  const [selectedSellCurrency, setSelectedSellCurrency] =
    useState<SellCurrency | null>(sampleSellCurrencies[0]);
  const [selectedSellCurrencyNetwork, setSelectedSellCurrencyNetwork] =
    useState<SellCurrencyNetwork | null>({
      name: sampleNetworks[0].name,
      display_name: sampleNetworks[0].displayName,
    });
  const [isOnrampActive, setIsOnrampActive] = useState(true);
  const [rampTransaction, setRampTransaction] = useState<RampTransaction>({});
  const [authenticated, setAuthenticated] = useState(false);
  const partnerUserId = "demo-user-123"; // Sample partner user ID

  // Simulate loading data
  useEffect(() => {
    setLoadingBuyConfig(true);
    setLoadingBuyOptions(true);

    // Simulate API call
    const timer = setTimeout(() => {
      setLoadingBuyConfig(false);
      setLoadingBuyOptions(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const setSelectedPaymentMethod = (method: any) => {
    // Implementation for setting payment method
  };

  return (
    <CoinbaseRampTransactionContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        selectedSubdivision,
        setSelectedSubdivision,
        selectedCurrency,
        setSelectedCurrency,
        buyOptions,
        sellOptions,
        loadingBuyConfig,
        loadingBuyOptions,
        selectedPurchaseCurrency,
        setSelectedPurchaseCurrency,
        selectedPurchaseCurrencyNetwork,
        setSelectedPurchaseCurrencyNetwork,
        selectedSellCurrency,
        setSelectedSellCurrency,
        selectedSellCurrencyNetwork,
        setSelectedSellCurrencyNetwork,
        isOnrampActive,
        setIsOnrampActive,
        rampTransaction,
        setRampTransaction,
        setSelectedPaymentMethod,
        authenticated,
        setAuthenticated,
        partnerUserId,
      }}
    >
      {children}
    </CoinbaseRampTransactionContext.Provider>
  );
};

export const useCoinbaseRampTransaction = () => {
  const context = useContext(CoinbaseRampTransactionContext);
  if (context === undefined) {
    throw new Error(
      "useCoinbaseRampTransaction must be used within a CoinbaseRampTransactionProvider"
    );
  }
  return context;
};
