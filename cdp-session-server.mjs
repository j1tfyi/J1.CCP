#!/usr/bin/env node

/**
 * CDP Session Token API Server
 * Production-ready server for generating Coinbase Developer Platform session tokens
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { generateSessionToken, generateDevelopmentToken } from './api/generateToken.mjs';
import { generateCDPJWT } from './api/cdp-auth.mjs';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.CDP_SESSION_PORT || 3001;

// J1.CCP wallet address
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

// Supported blockchains for deposits
const SUPPORTED_CHAINS = {
  ethereum: { id: 1, name: "Ethereum Mainnet" },
  base: { id: 8453, name: "Base" },
  polygon: { id: 137, name: "Polygon" },
  arbitrum: { id: 42161, name: "Arbitrum One" },
  optimism: { id: 10, name: "Optimism" }
};

// Supported assets
const SUPPORTED_ASSETS = [
  "ETH", "USDC", "USDT", "DAI", "WETH", "WBTC", 
  "UNI", "LINK", "AAVE", "MATIC", "OP", "ARB"
];

// Load CDP credentials
function loadCredentials() {
  try {
    const keyFile = readFileSync('./cdp_api_key.json', 'utf8');
    const keyData = JSON.parse(keyFile);
    
    return {
      projectId: process.env.VITE_CDP_PROJECT_ID || "80a2acea-83de-40aa-be1e-081d47e196c8",
      apiKey: keyData.id,
      apiSecret: keyData.privateKey,
      apiKeyName: `organizations/0c11b786-76f2-4a16-9088-e2e88dc26cd9/apiKeys/${keyData.id}`
    };
  } catch {
    return {
      projectId: process.env.VITE_CDP_PROJECT_ID,
      apiKey: process.env.CDP_API_KEY,
      apiSecret: process.env.CDP_API_SECRET,
      apiKeyName: process.env.VITE_CDP_API_KEY_NAME
    };
  }
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Generate session token endpoint
 */
app.post('/api/session', async (req, res) => {
  console.log('[Session API] Generating CDP session token...');
  
  try {
    const { addresses, assets, blockchains } = req.body;
    const credentials = loadCredentials();
    
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error("CDP credentials not configured");
    }

    // Prepare destination wallets
    const destinationWallets = addresses || [{
      address: J1_CCP_ADDRESS,
      blockchains: blockchains || Object.keys(SUPPORTED_CHAINS),
      assets: assets || SUPPORTED_ASSETS
    }];

    console.log('[Session API] Destination wallets:', JSON.stringify(destinationWallets, null, 2));

    // Prepare CDP API request
    const requestBody = {
      projectId: credentials.projectId,
      destinationWallets: destinationWallets
    };

    // Make authenticated request to CDP
    const url = 'https://api.developer.coinbase.com/onramp/v1/token';
    const jwt = generateCDPJWT('POST', '/onramp/v1/token', credentials.apiKeyName, credentials.apiSecret);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
        'X-Project-ID': credentials.projectId
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(responseData);
      console.log('[Session API] ✅ Token generated successfully');
      
      res.json({
        token: data.token || data.session_token,
        expires_at: new Date(Date.now() + 600000).toISOString(),
        project_id: credentials.projectId,
        success: true
      });
      
    } else {
      console.error('[Session API] CDP API error:', response.status, responseData);
      
      // Generate fallback token for development
      const devToken = generateDevelopmentToken(requestBody);
      
      res.json({
        ...devToken,
        expires_at: new Date(Date.now() + 600000).toISOString(),
        project_id: credentials.projectId,
        fallback: true
      });
    }
    
  } catch (error) {
    console.error('[Session API] Error:', error);
    
    // Return development token as fallback
    const devToken = generateDevelopmentToken({
      projectId: loadCredentials().projectId,
      destinationWallets: [{
        address: J1_CCP_ADDRESS,
        blockchains: Object.keys(SUPPORTED_CHAINS),
        assets: ["ETH", "USDC"]
      }]
    });
    
    res.json({
      ...devToken,
      expires_at: new Date(Date.now() + 600000).toISOString(),
      error: error.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  const credentials = loadCredentials();
  res.json({
    status: 'ok',
    service: 'cdp-session-api',
    project_id: credentials.projectId,
    configured: !!(credentials.apiKey && credentials.apiSecret)
  });
});

/**
 * Configuration endpoint
 */
app.get('/api/config', (req, res) => {
  const credentials = loadCredentials();
  res.json({
    project_id: credentials.projectId,
    destination_address: J1_CCP_ADDRESS,
    supported_chains: Object.keys(SUPPORTED_CHAINS),
    supported_assets: SUPPORTED_ASSETS,
    configured: !!(credentials.apiKey && credentials.apiSecret)
  });
});

/**
 * Widget configuration endpoint
 */
app.get('/api/widget-config', (req, res) => {
  res.json({
    element: 'coinbaseOnrampWidget',
    projectId: loadCredentials().projectId,
    destinationAddress: J1_CCP_ADDRESS,
    supportedChains: SUPPORTED_CHAINS,
    supportedAssets: SUPPORTED_ASSETS,
    theme: 'dark',
    affiliateFeePercent: 0.5
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, () => {
  const credentials = loadCredentials();
  
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   CDP Session Token API Server                             ║
╠════════════════════════════════════════════════════════════╣
║   Port: ${PORT}                                           ║
║   Project ID: ${credentials.projectId?.substring(0, 20)}... ║
║   API Key: ${credentials.apiKey ? '✅ Configured' : '❌ Missing'}           ║
║   API Secret: ${credentials.apiSecret ? '✅ Configured' : '❌ Missing'}      ║
╠════════════════════════════════════════════════════════════╣
║   Endpoints:                                               ║
║   • POST /api/session - Generate session token            ║
║   • GET  /api/health - Health check                       ║
║   • GET  /api/config - Configuration info                 ║
║   • GET  /api/widget-config - Widget configuration        ║
╚════════════════════════════════════════════════════════════╝

🚀 Ready to generate CDP session tokens!
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
