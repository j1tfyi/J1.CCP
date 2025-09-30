'use client';

import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { WalletConnector } from '../components/WalletConnector';

export default function DebugPage() {
  const [serverVars, setServerVars] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side environment variables
  const clientEnvVars = {
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY
      ? 'Set'
      : 'Not set',
    NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME:
      process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    NEXT_PUBLIC_CDP_PROJECT_ID: process.env.NEXT_PUBLIC_CDP_PROJECT_ID
      ? 'Set'
      : 'Not set',
    NEXT_PUBLIC_COINBASE_CLOUD_API_KEY: process.env
      .NEXT_PUBLIC_COINBASE_CLOUD_API_KEY
      ? 'Set'
      : 'Not set',
    NEXT_PUBLIC_CDP_PROJECT_ID_VALUE:
      process.env.NEXT_PUBLIC_CDP_PROJECT_ID || 'Empty',
  };

  // Fetch server-side environment variables
  useEffect(() => {
    const fetchServerVars = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Auth API response:', data);

        if (data.success) {
          setServerVars(data.config || {});
        } else {
          setError(data.error || 'Unknown error in API response');
        }
      } catch (error) {
        console.error('Error fetching server variables:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerVars();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Environment Debug</h1>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
            <p className="mb-4">
              Connect your wallet to test environment variables.
            </p>
            <WalletConnector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                Client-Side Environment Variables
              </h2>

              {Object.entries(clientEnvVars).map(([key, value]) => (
                <div key={key} className="mb-2 pb-2 border-b border-gray-200">
                  <div className="font-mono text-sm text-gray-600">{key}</div>
                  <div className="font-medium">
                    {value === 'Set' ? (
                      <span className="text-green-600">✓ Set</span>
                    ) : value === 'Not set' ? (
                      <span className="text-red-600">✗ Not set</span>
                    ) : (
                      <span>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                Server-Side Environment Variables
              </h2>

              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  <p className="font-bold">Error:</p>
                  <p>{error}</p>
                </div>
              ) : (
                Object.entries(serverVars).map(([key, value]) => (
                  <div key={key} className="mb-2 pb-2 border-b border-gray-200">
                    <div className="font-mono text-sm text-gray-600">{key}</div>
                    <div className="font-medium">
                      {value === 'Set' ? (
                        <span className="text-green-600">✓ Set</span>
                      ) : value === 'Not set' ? (
                        <span className="text-red-600">✗ Not set</span>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold mb-2">
              How to Fix Environment Variables:
            </h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Go to your Vercel project settings and navigate to the
                Environment Variables section.
              </li>
              <li>
                Add or update the following environment variables:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <code>NEXT_PUBLIC_CDP_PROJECT_ID</code> - Client-side
                    variable for the Coinbase Developer Platform Project ID
                  </li>
                  <li>
                    <code>CDP_PROJECT_ID</code> - Server-side variable for the
                    Coinbase Developer Platform Project ID
                  </li>
                  <li>
                    <code>NEXT_PUBLIC_ONCHAINKIT_API_KEY</code> - Client-side
                    variable for OnchainKit API Key
                  </li>
                  <li>
                    <code>ONCHAINKIT_API_KEY</code> - Server-side variable for
                    OnchainKit API Key
                  </li>
                  <li>
                    <code>NEXT_PUBLIC_CDP_PROJECT_ID</code> - Client-side
                    variable for WalletConnect Project ID
                  </li>
                  <li>
                    <code>CDP_PROJECT_ID</code> - Server-side variable for
                    WalletConnect Project ID
                  </li>
                </ul>
              </li>
              <li>
                After updating the environment variables, redeploy your
                application.
              </li>
              <li>
                <a
                  href="https://vercel.com/docs/projects/environment-variables"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Learn more about Vercel environment variables
                </a>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
