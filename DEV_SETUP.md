# J1TFYI CCP - Development Setup Guide

## ✅ Prerequisites Fixed
- Node.js v20.19.0 (using NVM)
- All dependencies installed including Vite 7.1.7

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Check your environment
./check-env.sh

# 2. If needed, install dependencies
npm install --include=dev
```

### Running the Development Server

#### Option 1: Full Stack (Recommended for Coinbase features)
```bash
./start-dev-with-api.sh
```
This starts:
- Vite dev server on http://localhost:5173
- Session API server on http://localhost:3001 (for Coinbase Onramp/Offramp)

#### Option 2: Frontend Only
```bash
./start-dev.sh
# or simply:
npm run dev
```

## 🔧 Troubleshooting

### If you see "Cannot find package 'vite'" error:
```bash
# Clean install everything
rm -rf node_modules package-lock.json
npm install --include=dev
```

### If NVM is not working:
```bash
# Load NVM manually
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20.19.0
```

## 📍 Development URLs
- **Main App:** http://localhost:5173
- **Session API:** http://localhost:3001/api/session
- **API Health:** http://localhost:3001/api/health

## 💳 Coinbase Integration
The Coinbase Onramp/Offramp buttons require the Session API server.
Always use `./start-dev-with-api.sh` when testing Coinbase features.

## 🏗️ Build Commands
```bash
npm run build         # Build for production
npm run preview       # Preview production build
npm run vercel-build  # Build for Vercel deployment
```

## 📝 Important Files
- `.nvmrc` - Specifies Node v20.19.0
- `dev-api-server.mjs` - Session token API for Coinbase
- `vite.config.ts` - Vite configuration
- `.env` - Environment variables (CDP keys)