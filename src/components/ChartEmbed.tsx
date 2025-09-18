import React, { useEffect, useState } from 'react';

interface ChartEmbedProps {
  tokenAddress?: string;
  chainSlug?: string;
}

const ChartEmbed: React.FC<ChartEmbedProps> = ({
  tokenAddress = "HAqD46mR4LgY3aJiMZSabfefZoysG3Uuj6wn2ZKYE14v",
  chainSlug = "solana"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build the embed URL
  const embedUrl = `https://dexscreener.com/${chainSlug}/${tokenAddress}?embed=1&theme=dark&info=0&trades=0`;

  useEffect(() => {
    console.log('ChartEmbed rendering with URL:', embedUrl);
    setIsLoading(true);
    setError(null);

    // Reset loading state after a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [embedUrl]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-foreground/60">Loading chart...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-red-500">Error loading chart: {error}</div>
        </div>
      )}

      <iframe
        src={embedUrl}
        width="100%"
        height="700"
        frameBorder="0"
        style={{
          border: 'none',
          borderRadius: '8px',
          display: isLoading ? 'none' : 'block',
        }}
        onLoad={() => {
          console.log('Chart iframe loaded');
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error('Chart iframe error:', e);
          setError('Failed to load chart');
          setIsLoading(false);
        }}
        title="Token Chart"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />

      {/* Fallback link */}
      <div className="mt-2 text-center">
        <a
          href={`https://dexscreener.com/${chainSlug}/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          View on DexScreener →
        </a>
      </div>
    </div>
  );
};

export default ChartEmbed;