# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

J1.CROSS-CHAIN PORTAL (J1.CCP) is a multi-chain DeFi application built on deBridge Liquidity Network Protocol (DLN), enabling instant cross-chain asset transfers across 25+ blockchain networks (22 EVM + Solana/xStocks/Tron). The system uses a multi-SPA architecture with a single Deno server orchestrating two React applications with sophisticated caching, security layers, and automated affiliate fee collection.

## Architecture

### Multi-App Structure
The project serves multiple React applications from a single Deno server:
- **Main Portal** (root): Wormhole visualization with Three.js 3D graphics, serves from `/`
- **Bridge Widget** (`bridge-react-app/`): deBridge integration widget with custom theming, serves from `/bridge/*`

**Note**: HODL Pump Buddy app exists but is not actively deployed.

### Request Flow & Routing (main.ts)
1. **Rate Limiting**: IP-based with 50 requests per 30-second sliding window
2. **Asset Routing Priority**:
   - `/widget-config` → Dynamic JSON configuration (includes referral logic)
   - `/assets/*` → Immutable hashed files (Cache-Control: max-age=31536000, immutable)
   - `/bridge/*` → Bridge app SPA (strips /bridge prefix, fallback to bridge-react-app/dist/index.html)
   - `/` → Main portal SPA (fallback to dist/index.html)
3. **Compression**: gzip for text/html, application/javascript, application/json
4. **Security**: CSP allows deBridge/Jupiter domains, X-Frame-Options: SAMEORIGIN

### Deployment Architecture
- **Platform**: Deno Deploy (edge runtime)
- **CI/CD**: GitHub Actions deploys on push to main
- **Secret Management**: Critical files stored as base64 in GitHub Secrets:
  - `main.ts`, `useBridge.jsx`, `App.jsx`, `PortalPage.tsx`, `DeBridgePortal.tsx`, `App.css`
- **Asset Hashing**: Service worker updated with hashed asset names during deployment

## Development Commands

### Local Development Setup
```bash
# Install Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

# Full local development (both apps + server)
cd bridge-react-app && npm install && npm run build && cd ..
npm install && npm run build
deno run --allow-net --allow-read main.ts
```

### Main Portal (Root)
```bash
npm install
npm run dev          # Vite dev server on port 5173
npm run build        # Build + copy assets to dist/
npm run preview      # Preview production build
npm run lint         # ESLint with max-warnings 0
```

### Bridge React App
```bash
cd bridge-react-app
npm install
npm run dev          # Vite dev server
npm run build        # Build + copy public assets
npm run preview      # Preview production build
npm run lint         # ESLint for JS/JSX
npm run audit:fix    # Fix npm vulnerabilities
npm run browserslist:update  # Update browser targets
```

### Affiliate Fee Management (scripts/)
```bash
cd scripts
npm install
npm run verify                  # Verify .env configuration
npm run withdraw-fees           # Withdraw all deBridge + Jupiter fees
npm run withdraw-fees:dry       # Dry run (test without execution)
npm run jupiter:status          # Check Jupiter referral status
npm run jupiter:init-token      # Initialize token accounts
npm run jupiter:claim           # Claim Jupiter fees only

# Automated weekly collection via GitHub Actions (Mondays 2 AM UTC)
# Uses base64 secrets: scripts_withdraw-solana-fees.ts.base64, etc.

# Required GitHub Secrets for automation:
# - SOLANA_PRIVATE_KEY: Wallet private key (base58 format)
# - SOLANA_RPC_URL: Helius RPC endpoint (optional)
# - SCRIPTS_WITHDRAW_FEES_BASE64: Base64 of withdraw script
# - SCRIPTS_JUPITER_SETUP_BASE64: Base64 of Jupiter setup script
# - SCRIPTS_PACKAGE_JSON_BASE64: Base64 of scripts package.json
```

### Visitor Tracking
```bash
node scripts/check-visitors.js  # Check visitor count stats
```

### Deno Server
```bash
deno run --allow-net --allow-read main.ts  # Run with dist/ pre-built
deno fmt main.ts                            # Format Deno code
deno lint main.ts                           # Lint server code
```

## Key Implementation Details

### Cross-Chain Configuration
- **Supported Networks**: 25 chains (22 EVM + Solana, xStocks via Solana, Tron)
- **Referral System**:
  - deBridge Code: `32422`
  - Jupiter Account: `EKtLGKfhtaJoUnoPodBesHzfaT8aJozCayv1zw8AKH3h`
  - Solana Recipient: `D6vq5F6RUg6n2by5KHXyR1hpQ3uPG3dvNHJVXXaMyTnc`
  - EVM Recipient: `0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E`

### Widget Configuration (`/widget-config` endpoint)
Dynamic configuration served by main.ts includes:
- Chain IDs: inputChain (1=Ethereum), outputChain (7565164=Solana)
- Mode: "deswap" for swap functionality
- Referral logic:
  - EVM chains → deBridge code "32422"
  - Solana → Jupiter account "EKtLGKfhtaJoUnoPodBesHzfaT8aJozCayv1zw8AKH3h"
- Custom CSS with orange gradient theming (#ff6600 to #ffae00)
- Container: "debridgeWidget" element ID

### Coinbase Integration
The CoinbaseOnrampButton component uses simple direct links:
- **Buy Crypto**: Opens `https://www.coinbase.com/buy`
- **Sell Crypto**: Opens `https://www.coinbase.com/sell`
- No CDP session tokens or backend authentication required
- Simple, reliable integration without complex API calls

### Service Worker Strategy
- Caches bridge app assets for offline functionality
- Updated during deployment with hashed asset names
- No caching for service worker itself (always fresh)

### Safari-Specific Optimizations
1. **Video Playback**: Programmatic source loading in `VideoBackground.tsx`
2. **Widget Scrolling**: Pointer-events management in `DeBridgePortal.tsx`
3. **Performance**: Hardware acceleration via CSS transforms

### Critical Layout Values (DO NOT MODIFY)
**Desktop:**
- J1Logo: `marginBottom: '-145px'`
- titlepage.png: `top: '-145px'`, `marginBottom: '-430px'`

**Mobile:**
- J1Logo: `marginBottom: '-80px'`, `top: '-60px'`
- titlepage.png: `top: '-40px'`, `marginBottom: '-100px'`

## Build & Deployment Process

### GitHub Actions Workflow (.github/workflows/deploy.yml)
1. **Setup**: Node 20.18+, checkout with Git LFS
2. **Secret Injection**: Decode base64 secrets to required files
3. **Build Sequence**:
   ```bash
   npm install && npm run build              # Root portal
   cd bridge-react-app && npm install && npm run build  # Bridge app
   ```
4. **Asset Processing**: Update service worker with hashed filenames
5. **Deploy**: Upload to Deno Deploy with all assets

### Pre-deployment Checklist
1. Both apps build successfully without errors
2. ESLint passes (`npm run lint` in both directories)
3. All GitHub Secrets are current (use `update_secrets.sh` to update)
4. Service worker paths match generated asset names
5. Video files tracked in Git LFS if modified

### Secret File Management
```bash
# Generate base64 for GitHub Secrets (outputs to root with prefixes)
./update_secrets.sh

# Critical files stored as GitHub Secrets:
- main.ts → MAIN_TS_BASE64
- src/pages/PortalPage.tsx → PORTAL_PAGE_BASE64
- src/components/DeBridgePortal.tsx → DEBRIDGE_PORTAL_BASE64
- bridge-react-app/src/App.jsx → APP_JSX_BASE64
- bridge-react-app/src/useBridge.jsx → BRIDGE_JSX_BASE64
- bridge-react-app/src/App.css → APP_CSS_BASE64
- scripts/withdraw-solana-fees.ts → scripts_withdraw-solana-fees.ts.base64
- scripts/jupiter-referral-setup.ts → scripts_jupiter-referral-setup.ts.base64
- scripts/package.json → scripts_package.json.base64

# Note: .env files and README.md are NOT uploaded to secrets
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Main portal loads at `/`
- [ ] Bridge widget loads at `/bridge`
- [ ] Cross-chain swaps execute correctly
- [ ] Safari video playback works
- [ ] PWA installs correctly
- [ ] Service worker caches assets
- [ ] Widget scrolling works on mobile
- [ ] Visitor tracking records visits (check with `node scripts/check-visitors.js`)
- [ ] Coinbase buy/sell buttons open correct URLs

### Performance Validation
- Lighthouse score > 90 for performance
- First Contentful Paint < 2s
- Time to Interactive < 3.5s
- Bundle size < 500KB (gzipped)

## Common Development Tasks

### Adding a New Blockchain Network
1. Update `SUPPORTED_CHAINS` object in `main.ts` with chain ID mapping
2. Modify `WIDGET_CONFIG` inputChain/outputChain if changing defaults
3. Update referral logic in `/widget-config` endpoint:
   - `getAffiliateFeeRecipient()` for fee recipients
   - `getReferralKey()` for referral codes/accounts
4. Add chain to bridge-react-app if UI changes needed
5. Test cross-chain transfers with new network

### Updating the deBridge Widget
1. Modify widget configuration in `main.ts` `WIDGET_CONFIG` object
2. Update styles in base64-encoded string
3. Test on multiple browsers and mobile devices

### Modifying Build Process
1. Update scripts in respective `package.json` files
2. Ensure `.github/workflows/deploy.yml` reflects changes
3. Test full build locally before pushing

### Managing Large Files
```bash
git lfs track "*.mp4"
git lfs track "*.mov"
git lfs track "*.webm"
git add .gitattributes
git add video.mp4
git commit -m "Add video file"
```

## Troubleshooting

### Build Failures
- Ensure Node version >= 20.18.0
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check all secret files are properly decoded from GitHub Secrets

### Runtime Issues
- Check Deno Deploy logs at https://dash.deno.com
- Verify CSP allows: app.debridge.finance, *.jup.ag, unpkg.com
- Rate limit debugging: Check `rateLimitMap` in main.ts
- Widget loading issues: Verify script src="https://app.debridge.finance/widget.js"

### Safari-Specific Issues
- Video not playing: Check `VideoBackground.tsx` programmatic loading
- Widget scrolling broken: Review pointer-events in `DeBridgePortal.tsx`
- Performance issues: Enable hardware acceleration in CSS

## Project File Structure

```
.
├── main.ts                    # Deno server (gitignored, in secrets)
├── dist/                      # Main portal build output
├── bridge-react-app/
│   ├── dist/                  # Bridge app build output
│   └── src/
│       ├── App.jsx           # Bridge app root (gitignored)
│       └── useBridge.jsx     # Bridge logic (gitignored)
├── scripts/                   # Affiliate fee management
│   ├── withdraw-solana-fees.ts
│   ├── jupiter-referral-setup.ts
│   └── check-visitors.js     # Visitor count checker
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx      # Landing page with features
│   │   ├── PortalPage.tsx    # Main portal page (gitignored)
│   │   └── TermsOfService.tsx
│   ├── components/
│   │   ├── DeBridgePortal.tsx # Widget component (gitignored)
│   │   ├── VideoBackground.tsx
│   │   ├── CoinbaseOnrampButton.tsx
│   │   └── J1Logo.tsx
│   └── utils/
│       └── visitorTracker.ts  # CounterAPI V2 implementation
├── api/                       # Vercel serverless functions
│   ├── session.js            # CDP session token generation
│   ├── health.js             # Health check endpoint
│   └── widget-config.js      # Widget configuration
└── .github/workflows/
    ├── deploy.yml            # Deno Deploy CI/CD
    └── withdraw-fees.yml     # Automated fee collection
```

## External Dependencies

### Critical Services
- **deBridge DLN Protocol**: Cross-chain swap execution (widget.js SDK)
- **Jupiter Ultra API**: Solana swap aggregation with referral system
- **Deno Deploy**: Edge hosting with global CDN
- **GitHub Actions**: Automated deployment + weekly fee collection
- **Git LFS**: Video file storage (*.mp4, *.mov, *.webm)
- **Helius RPC**: Premium Solana RPC for fee withdrawals
- **CounterAPI V2**: Visitor tracking service

### NPM Dependencies
- **React 18**: UI framework
- **Three.js**: 3D graphics for wormhole
- **Vite**: Build tool and dev server
- **@solana/wallet-adapter**: Wallet integration
- **@jup-ag/referral-sdk**: Jupiter fee collection
- **Coinbase SDK**: Optional onramp integration (simplified to direct URLs)
