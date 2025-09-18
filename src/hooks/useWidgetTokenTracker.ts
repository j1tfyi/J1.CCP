import { useEffect, useState, useCallback } from 'react';

interface TokenInfo {
  address: string;
  chain: string;
  symbol: string;
}

const CHAIN_MAP: { [key: string]: string } = {
  '1': 'ethereum',
  '56': 'bsc',
  '137': 'polygon',
  '42161': 'arbitrum',
  '10': 'optimism',
  '43114': 'avalanche',
  '250': 'fantom',
  '7565164': 'solana',
  '8453': 'base',
};

export const useWidgetTokenTracker = () => {
  const [selectedToken, setSelectedToken] = useState<TokenInfo>({
    address: 'HAqD46mR4LgY3aJiMZSabfefZoysG3Uuj6wn2ZKYE14v',
    chain: 'solana',
    symbol: 'J1TFYI'
  });

  const detectTokenFromWidget = useCallback(() => {
    const widget = document.getElementById('debridgeWidget');
    if (!widget) return;

    // Strategy 1: Look for token addresses in specific elements
    const tokenSelectors = [
      '[data-testid*="token"]',
      '[class*="token"]',
      '[class*="Token"]',
      '[id*="token"]',
      'input[placeholder*="token"]',
      'input[placeholder*="Token"]',
      'input[value]',
      '[data-token]',
      '[data-address]',
    ];

    for (const selector of tokenSelectors) {
      const elements = widget.querySelectorAll(selector);
      elements.forEach((el: Element) => {
        // Check data attributes
        const dataAddress = el.getAttribute('data-address');
        const dataToken = el.getAttribute('data-token');
        const dataChain = el.getAttribute('data-chain') || el.getAttribute('data-chainid');

        if (dataAddress || dataToken) {
          const address = dataAddress || dataToken;
          console.log('Found token via data attribute:', address);

          const newToken: TokenInfo = {
            address: address,
            chain: dataChain ? (CHAIN_MAP[dataChain] || 'solana') : selectedToken.chain,
            symbol: selectedToken.symbol
          };

          if (address !== selectedToken.address) {
            setSelectedToken(newToken);
          }
          return;
        }

        // Check input values
        if (el instanceof HTMLInputElement && el.value) {
          const value = el.value.trim();
          // Check if it looks like a token address (32-64 chars, alphanumeric)
          if (value.length >= 32 && value.length <= 64 && /^[a-zA-Z0-9]+$/.test(value)) {
            console.log('Found potential token in input:', value);

            if (value !== selectedToken.address) {
              setSelectedToken({
                ...selectedToken,
                address: value
              });
            }
            return;
          }
        }

        // Check text content for addresses
        const text = el.textContent || '';
        const addressMatch = text.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
        if (addressMatch) {
          const address = addressMatch[0];
          console.log('Found potential address in text:', address);

          if (address !== selectedToken.address) {
            setSelectedToken({
              ...selectedToken,
              address: address
            });
          }
          return;
        }
      });
    }

    // Strategy 2: Monitor network requests (if possible)
    // This would require intercepting fetch/XHR requests which is more complex
  }, [selectedToken]);

  useEffect(() => {
    console.log('Starting widget token tracker...');

    // Initial detection after widget loads
    const initialTimer = setTimeout(detectTokenFromWidget, 3000);

    // Set up MutationObserver
    const observer = new MutationObserver((mutations) => {
      console.log('Widget DOM changed, checking for tokens...');
      detectTokenFromWidget();
    });

    // Start observing after delay
    const observerTimer = setTimeout(() => {
      const widget = document.getElementById('debridgeWidget');
      if (widget) {
        observer.observe(widget, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['data-address', 'data-token', 'data-chain', 'value'],
          characterData: true
        });
        console.log('MutationObserver attached to widget');
      }
    }, 2000);

    // Also check periodically as fallback
    const interval = setInterval(detectTokenFromWidget, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(observerTimer);
      clearInterval(interval);
      observer.disconnect();
    };
  }, [detectTokenFromWidget]);

  return { selectedToken, setSelectedToken };
};