# J1.CROSS-CHAIN PORTAL
## One Portal. Infinite Possibilities. Zero Risk.

![J1.CCP Logo](./public/comboj1ccplogo.png)

[![Documentation](https://img.shields.io/badge/GitBook-Documentation-7B36ED?style=for-the-badge&logo=gitbook&logoColor=white)](https://j1tfyi.gitbook.io/docs/utilities-and-future-plan/j1.cross-chain-portal)
[![Website](https://img.shields.io/badge/Website-J1.CCP-FF6B6B?style=for-the-badge&logo=firefox&logoColor=white)](https://ccp.j1t.fyi/)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/j1tfyi)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/j1tfyi)

## 🌐 J1.CCP Project Overview

J1.CROSS-CHAIN PORTAL [J1.CCP] is a cross-chain networking solution built on the deBridge infrastructure, designed to break down barriers between blockchain ecosystems and unlock unprecedented financial mobility.

## 🚀 Core Value Proposition

### Transforming Cross-Chain Interactions

Our platform leverages deBridge's Liquidity Network Protocol (DLN) smart contracts to provide:
- **Instant Cross-Chain Transactions**: Move assets seamlessly across blockchain networks
- **Zero Slippage Trading**: Guaranteed rates with minimal friction
- **Native Asset Preservation**: Trade without the risks of wrapped tokens
- **Minimal Fee Structure**: Pay only for successful transactions

## 🔗 Technical Foundation: Using deBridge Infrastructure

### deBridge Core Infrastructure Capabilities
- **Decentralized Validation**: Secure, independent validator network ensuring transaction integrity
- **Advanced Security Mechanisms**: Slashing protocols to prevent validator collusion
- **Governance-Driven**: Community-controlled infrastructure

### Beyond Traditional Bridging
deBridge enables:
- Seamless asset transfers across multiple blockchain ecosystems
- Advanced cross-chain trading strategies
- Preservation of native token characteristics
- Elimination of liquidity pool constraints

### Unique Value Propositions
- **Global Accessibility**: Connect users across different blockchain networks
- **Reduced Complexity**: Simplified cross-chain interactions
- **Enhanced Liquidity**: Unlock capital trapped in siloed blockchain environments

## 🌍 Technical Architecture

### Infrastructure Components

#### Backend
- **Runtime**: Deno Deploy (edge runtime serving static assets)
- **Server Features**:
  - IP-based rate limiting (50 req/30s sliding window)
  - Asset routing with immutable caching
  - Dynamic portal configuration endpoint
  - gzip compression for text assets
  - CSP security headers
- **Deployment**: GitHub Actions → Deno Deploy
- **CDN**: Deno Deploy global edge network

#### Frontend
- **Framework**: Dual React 18 SPAs
  - **Main Portal**: 3D wormhole visualization with Three.js
  - **Bridge Portal**: deBridge DLN integration portal
- **Key Libraries**:
  - **3D Graphics**: Three.js for WebGL rendering
  - **Blockchain**: ethers.js, @solana/web3.js, wagmi, viem
  - **Wallet Integration**: @solana/wallet-adapter, @coinbase/onchainkit
  - **UI Components**: Radix UI, Tailwind CSS, Lucide React icons
  - **Routing**: React Router v7
  - **State Management**: TanStack Query
- **Build Tool**: Vite 7 with TypeScript support

#### Core Protocol
- **J1.CCP** built on the deBridge DLN smart contracts

### Supported Networks

**25+ Total Networks**

#### EVM Chains (22 chains):
1. Abstract
2. Arbitrum
3. Avalanche (C-Chain)
4. Base
5. Berachain
6. Binance Smart Chain (BSC)
7. BOB
8. Ethereum (ETH)
9. Flow
10. Gnosis
11. HyperEVM
12. Hyperliquid
13. Linea
14. Mantle
15. Neon
16. Optimism
17. Plasma
18. Polygon (MATIC)
19. Sei
20. Sonic
21. Story
22. Zilliqa

#### Non-EVM Chains (3 chains):
23. Solana
24. xStocks via Solana
25. Tron

## 📦 Development Setup

### Prerequisites
- Deno (latest version)
- Node.js and npm
- Modern web browser

### Installation Steps
1. Install Deno
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. Clone the Repository
   ```bash
   git clone https://github.com/j1tfyi/ccp.git
   cd j1tfyi-portal
   ```

3. Prepare Frontend
   ```bash
   npm install
   npm run build
   ```

4. Run Development Server
   ```bash
   deno run --allow-net --allow-read server.ts
   ```
Or
```bash
    cd bridge-react-app && npm run build && cd ..
    npm run build
    deno run --allow-net --allow-read main.ts
```

## 🔒 Licensing

### Proprietary Notice
**All Rights Reserved**
- Demonstration purposes only
- Unauthorized reproduction or distribution prohibited
- No license granted without explicit permission

## 📚 Documentation & Resources

### Official Documentation
- **📖 Complete Documentation**: [J1.CCP GitBook](https://j1tfyi.gitbook.io/docs/utilities-and-future-plan/j1.cross-chain-portal)
  - Cross-Chain Portal Architecture
  - Integration Guides
  - API Reference
  - Utilities & Future Roadmap

### Additional Resources
- **Official deBridge Website**: [deBridge Finance](https://debridge.finance/)
- **Project Portal**: [J1.CCP Website](https://ccp.j1t.fyi/)
- **Third-party Security Audits**
    - deBridge protocol, smart contracts and periphery modules passed more than 25+ security audits. 
    - A comprehensive list of audit reports can be found in the deBridge GitHub repository for [deBridge Security Audits](https://github.com/debridge-finance/debridge-security)

## 🤝 Contact & Community

### Social Channels
- **Telegram**: [J1TFYI Telegram](https://t.me/j1tfyi)
- **Twitter**: [J1TFYI Twitter](https://x.com/j1tfyi)

For inquiries, technical discussions, or potential collaborations, please reach out through our social channels or contact the project maintainers on github.

**Note**: J1.CCP is Powered by deBridge, pioneering the future of cross-chain liquidity networking.
