interface BridgeTransaction {
  id: string;
  from: string;
  to: string;
  fromChain: number;
  toChain: number;
  amount: string;
  token: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;
  estimatedTime?: number;
  affiliateFee?: number;
}

interface BridgeStats {
  totalVolume24h: number;
  totalTransactions24h: number;
  averageTime: number;
  successRate: number;
  totalRevenue24h: number;
}

class BridgeTrackerService {
  private transactions: Map<string, BridgeTransaction> = new Map();
  private stats: BridgeStats = {
    totalVolume24h: 4200000,
    totalTransactions24h: 1247,
    averageTime: 11,
    successRate: 99.8,
    totalRevenue24h: 21000,
  };

  constructor() {
    // Simulate real-time updates
    this.startSimulation();
  }

  private startSimulation() {
    // Update stats every 30 seconds
    setInterval(() => {
      this.stats.totalVolume24h += Math.random() * 10000;
      this.stats.totalTransactions24h += Math.floor(Math.random() * 3);
      this.stats.totalRevenue24h = this.stats.totalVolume24h * 0.005;
    }, 30000);
  }

  trackTransaction(tx: Partial<BridgeTransaction>): string {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transaction: BridgeTransaction = {
      id,
      from: tx.from || '',
      to: tx.to || '',
      fromChain: tx.fromChain || 1,
      toChain: tx.toChain || 999999, // Hyperliquid
      amount: tx.amount || '0',
      token: tx.token || 'ETH',
      status: 'pending',
      timestamp: Date.now(),
      estimatedTime: 8 + Math.random() * 4, // 8-12 seconds
      affiliateFee: parseFloat(tx.amount || '0') * 0.005,
      ...tx,
    };

    this.transactions.set(id, transaction);

    // Simulate processing
    setTimeout(() => {
      this.updateTransactionStatus(id, 'processing');
    }, 2000);

    // Simulate completion
    setTimeout(() => {
      this.updateTransactionStatus(id, 'completed');
      this.updateStats(transaction);
    }, transaction.estimatedTime! * 1000);

    return id;
  }

  updateTransactionStatus(id: string, status: BridgeTransaction['status']) {
    const tx = this.transactions.get(id);
    if (tx) {
      tx.status = status;
      if (status === 'completed') {
        tx.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      }
    }
  }

  getTransaction(id: string): BridgeTransaction | undefined {
    return this.transactions.get(id);
  }

  getRecentTransactions(limit: number = 10): BridgeTransaction[] {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  getStats(): BridgeStats {
    return { ...this.stats };
  }

  private updateStats(tx: BridgeTransaction) {
    this.stats.totalVolume24h += parseFloat(tx.amount);
    this.stats.totalTransactions24h++;
    this.stats.totalRevenue24h += tx.affiliateFee || 0;
  }

  calculateRevenue(amount: string): {
    bridgeFee: number;
    potentialTradingFee: number;
    total: number;
  } {
    const value = parseFloat(amount);
    const bridgeFee = value * 0.005; // 0.5%
    const potentialTradingFee = value * 100 * 0.0005; // Assume 100x volume at 0.05% fee

    return {
      bridgeFee,
      potentialTradingFee,
      total: bridgeFee + potentialTradingFee,
    };
  }

  getChainName(chainId: number): string {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      56: 'BNB Chain',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
      43114: 'Avalanche',
      7565164: 'Solana',
      8453: 'Base',
      999999: 'Hyperliquid',
    };
    return chains[chainId] || `Chain ${chainId}`;
  }
}

export const bridgeTracker = new BridgeTrackerService();
export type { BridgeTransaction, BridgeStats };