import { OnrampConfigCountry } from '@coinbase/onchainkit/fund';

export interface RampTransaction {
  wallet?: string;
  address?: string;
  country?: OnrampConfigCountry;
  currency?: string;
  amount?: string;
  chainToken?: string;
  paymentMethod?: string;
  provider?: string;
}
