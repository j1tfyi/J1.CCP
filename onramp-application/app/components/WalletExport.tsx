'use client';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
} from '@nextui-org/react';
import { usePrivy, useSolanaWallets, useWallets } from '@privy-io/react-auth';
import { memo, useCallback, useState } from 'react';

const WalletExport = () => {
  const { login, user, logout, exportWallet } = usePrivy();
  const [loading, setLoading] = useState(false);

  const { wallets } = useWallets();
  const { wallets: solanaWallets, exportWallet: exportSolanaWallet } =
    useSolanaWallets();

  const handleLogOut = useCallback(async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  }, [logout]);

  const handleLogIn = useCallback(async () => {
    setLoading(true);
    await login({
      loginMethods: ['google', 'github', 'discord', 'twitter'],
    });
    setLoading(false);
  }, [login]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Card className="max-w-[600px] w-full bg-white dark:bg-black shadow-lg">
        {loading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" color="primary" />
              <p className="text-gray-600 dark:text-zinc-400">Processing...</p>
            </div>
          </div>
        )}
        <CardHeader className="flex flex-col gap-2 pb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Wallet Export
            </h1>
            {user && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={handleLogOut}
                isLoading={loading}
              >
                Log out
              </Button>
            )}
          </div>
        </CardHeader>
        <Divider className="bg-gray-200 dark:bg-zinc-800" />
        <CardBody>
          {user ? (
            <div className="flex flex-col gap-6">
              <p className="text-gray-600 dark:text-zinc-400">
                Select a wallet to export its private key. Please ensure
                you&apos;re in a secure environment.
              </p>
              <div className="grid gap-4">
                {[...wallets, ...solanaWallets].map((wallet) => (
                  <Card
                    key={wallet.address}
                    className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800"
                  >
                    <CardBody className="flex flex-row justify-between items-center p-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                          Address
                        </p>
                        <p className="font-mono text-sm truncate max-w-[250px] text-gray-900 dark:text-white">
                          {wallet.address}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                          Type: {wallet.type}
                        </p>
                      </div>
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        onPress={async () => {
                          setLoading(true);
                          try {
                            if (wallet.type === 'solana') {
                              await exportSolanaWallet({
                                address: wallet.address,
                              });
                            } else {
                              await exportWallet({ address: wallet.address });
                            }
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        Export
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Authentication Required
                </h2>
                <p className="text-gray-600 dark:text-zinc-400">
                  Please authenticate to access your wallets
                </p>
              </div>
              <Button
                color="primary"
                size="lg"
                onPress={handleLogIn}
                isLoading={loading}
              >
                Authenticate
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default memo(WalletExport);
