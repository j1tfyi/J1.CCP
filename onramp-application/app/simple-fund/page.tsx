'use client';

import { Header } from '../components/Header';
import { SimpleFundCard } from '../components/SimpleFundCard';
import { WalletConnector } from '../components/WalletConnector';

export default function SimpleFundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Simple Fund Card Test</h1>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
            <p className="mb-4">
              Connect your wallet to test the Fund Card below.
            </p>
            <WalletConnector />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Simple Fund Card</h2>
            <p className="mb-4">
              This implementation includes CDP Project ID fetching from the
              server.
            </p>
            <SimpleFundCard />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Make sure your wallet is connected to the Base network</li>
              <li>
                Check that the environment variables are correctly set in your
                .env.local file:
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    <code>CDP_PROJECT_ID</code> - Server-side variable for the
                    Coinbase Developer Platform Project ID
                  </li>
                  <li>
                    <code>ONCHAINKIT_API_KEY</code> - Server-side variable for
                    the OnchainKit API Key
                  </li>
                  <li>
                    <code>CDP_PROJECT_ID</code> - Server-side variable for the
                    WalletConnect Project ID
                  </li>
                </ul>
              </li>
              <li>Open the browser console to see any error messages</li>
              <li>Try refreshing the page after connecting your wallet</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-8">
            <h2 className="text-xl font-bold mb-4">Debug Information</h2>
            <p>If you're seeing a 400 Bad Request error, it could be due to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Missing or invalid CDP Project ID</li>
              <li>Incorrect API keys</li>
              <li>Network connectivity issues</li>
              <li>Wallet not properly connected to the Base network</li>
            </ul>
            <p className="mt-4">
              Check the browser console for more detailed error messages that
              can help identify the specific issue.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
