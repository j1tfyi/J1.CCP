import { http, createConfig } from 'wagmi';
import { base, mainnet, optimism, arbitrum, polygon, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base, mainnet, optimism, arbitrum, polygon, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'J1.CROSS-CHAIN PORTAL',
      appLogoUrl: '/j1ccplogo.svg',
      preference: 'all', // 'all' | 'smartWalletOnly' | 'eoaOnly'
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [baseSepolia.id]: http(),
  },
});