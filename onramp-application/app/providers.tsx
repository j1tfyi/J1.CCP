'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { base } from 'wagmi/chains';
import { CoinbaseRampTransactionProvider } from './contexts/CoinbaseRampTransactionContext';

export function Providers({ children }: { children: ReactNode }) {
  // Access environment variables directly
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_CDP_PROJECT_ID ||
    'a353ad87-5af2-4bc7-af5b-884e6aabf088';
  const onchainKitApiKey =
    process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ||
    'HCBY5TstODcJYjYbCoC9re0PFwZ75DDe';
  const projectName =
    process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Coinbase Ramp Demo';
  const cdpProjectId =
    process.env.NEXT_PUBLIC_CDP_PROJECT_ID ||
    'a353ad87-5af2-4bc7-af5b-884e6aabf088';

  // Log configuration status (without exposing actual values)
  console.log('Provider configuration:', {
    walletConnectProjectId: walletConnectProjectId ? 'Set' : 'Not set',
    apiKey: onchainKitApiKey ? 'Set' : 'Not set',
    cdpProjectId: cdpProjectId ? 'Set' : 'Not set',
  });

  return (
    <CoinbaseRampTransactionProvider>
      <OnchainKitProvider
        chain={base}
        projectId={cdpProjectId}
        apiKey={onchainKitApiKey}
        config={{
          appearance: {
            name: projectName,
            theme: 'default',
            mode: 'light',
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </CoinbaseRampTransactionProvider>
  );
}
