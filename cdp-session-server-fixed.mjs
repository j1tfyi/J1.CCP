#!/usr/bin/env node

/**
 * CDP Session Token API Server - Production Ready
 * Secure server for generating Coinbase Developer Platform session tokens
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { generateSessionToken, generateDevelopmentToken, loadCDPCredentials, verifySessionToken } from './api/generateToken-fixed.mjs';
import { validateCredentials } from './api/cdp-auth-fixed.mjs';
import { readFileSync, existsSync } from 'fs';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.CDP_SESSION_PORT || 3001;

// J1.CCP wallet address
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

// Supported blockchains for deposits
const SUPPORTED_CHAINS = {
  ethereum: { id: 1, name: "Ethereum Mainnet", symbol: "ETH" },
  base: { id: 8453, name: "Base", symbol: "BASE" },
  polygon: { id: 137, name: "Polygon", symbol: "MATIC" },
  arbitrum: { id: 42161, name: "Arbitrum One", symbol: "ARB" },
  optimism: { id: 10, name: "Optimism", symbol: "OP" },
  avalanche: { id: 43114, name: "Avalanche", symbol: "AVAX" }
};

// Supported assets with metadata
const SUPPORTED_ASSETS = {
  "ETH": { name: "Ethereum", type: "native", decimals: 18 },
  "USDC": { name: "USD Coin", type: "token", decimals: 6 },
  "USDT": { name: "Tether", type: "token", decimals: 6 },
  "DAI": { name: "Dai Stablecoin", type: "token", decimals: 18 },
  "WETH": { name: "Wrapped Ethereum", type: "token", decimals: 18 },
  "WBTC": { name: "Wrapped Bitcoin", type: "token", decimals: 8 },
  "UNI": { name: "Uniswap", type: "token", decimals: 18 },
  "LINK": { name: "Chainlink", type: "token", decimals: 18 },
  "AAVE": { name: "Aave", type: "token", decimals: 18 },
  "MATIC": { name: "Polygon", type: "native", decimals: 18 },
  "OP": { name: "Optimism", type: "native", decimals: 18 },
  "ARB": { name: "Arbitrum", type: "native", decimals: 18 }
};

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow specific origins in production
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://j1tfyi.com',
      'https://www.j1tfyi.com',
      'https://j1tfyi-ccp.vercel.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomBytes(8).toString('hex');
  req.requestId = requestId;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Request ID: ${requestId}`);
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
});

// Rate limiting middleware
function rateLimiter(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitMap.has(clientIp)) {
    rateLimitMap.set(clientIp, { count: 1, windowStart: now });
    return next();
  }
  
  const clientData = rateLimitMap.get(clientIp);
  
  // Reset window if expired
  if (now - clientData.windowStart > RATE_LIMIT_WINDOW) {
    clientData.count = 1;
    clientData.windowStart = now;
    return next();
  }
  
  // Check rate limit
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - clientData.windowStart)) / 1000),
      requestId: req.requestId
    });
  }
  
  clientData.count++;
  next();
}


/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  try {
    const credentials = loadCDPCredentials();
    const validation = validateCredentials(credentials);
    
    res.json({
      status: 'ok',
      service: 'cdp-session-api',
      version: '1.0.0',
      project_id: credentials.projectId,
      configured: validation.valid,
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  } catch (error) {
    res.json({
      status: 'ok',
      service: 'cdp-session-api',
      version: '1.0.0',
      configured: false,
      error: 'CDP credentials not configured',
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }
});

/**
 * Configuration info endpoint
 */
app.get('/api/config', (req, res) => {
  try {
    const credentials = loadCDPCredentials();
    const validation = validateCredentials(credentials);
    
    res.json({
      project_id: credentials.projectId,
      organization_id: credentials.organizationId,
      destination_address: J1_CCP_ADDRESS,
      supported_chains: Object.keys(SUPPORTED_CHAINS),
      chain_details: SUPPORTED_CHAINS,
      supported_assets: Object.keys(SUPPORTED_ASSETS),
      asset_details: SUPPORTED_ASSETS,
      configured: validation.valid,
      environment: process.env.NODE_ENV || 'production',
      rate_limit: {
        window_ms: RATE_LIMIT_WINDOW,
        max_requests: MAX_REQUESTS_PER_WINDOW
      },
      requestId: req.requestId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Configuration error',
      details: error.message,
      requestId: req.requestId
    });
  }
});

/**
 * Generate session token endpoint - Main API
 */
app.post('/api/session', rateLimiter, async (req, res) => {
  const startTime = Date.now();
  
  console.log(`[${req.requestId}] Generating CDP session token...`);
  
  try {
    const { 
      addresses, 
      assets, 
      blockchains, 
      fiatCurrency,
      defaultAmount,
      defaultNetwork,
      partnerUserId,
      defaultExperience 
    } = req.body;
    
    // Validate input
    if (!addresses && !blockchains) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: 'Either addresses or blockchains must be provided',
        requestId: req.requestId
      });
    }
    
    // Load and validate credentials
    let credentials;
    try {
      credentials = loadCDPCredentials();
      const validation = validateCredentials(credentials);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
    } catch (error) {
      console.error(`[${req.requestId}] Credential error:`, error.message);
      return res.status(500).json({
        error: 'CDP configuration error',
        details: 'CDP credentials not properly configured',
        requestId: req.requestId
      });
    }

    // Prepare destination wallets
    const destinationWallets = addresses || [{
      address: J1_CCP_ADDRESS,
      blockchains: blockchains || Object.keys(SUPPORTED_CHAINS),
      assets: assets || Object.keys(SUPPORTED_ASSETS).slice(0, 6) // Top 6 assets
    }];

    console.log(`[${req.requestId}] Destination wallets:`, JSON.stringify(destinationWallets, null, 2));
    
    // Generate session token
    const tokenResult = await generateSessionToken({
      addresses: destinationWallets,
      fiatCurrency,
      defaultAmount,
      defaultNetwork,
      partnerUserId,
      defaultExperience
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`[${req.requestId}] Token generated successfully in ${responseTime}ms`);
    
    // Return session token
    res.json({
      ...tokenResult,
      responseTime,
      requestId: req.requestId
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error(`[${req.requestId}] Session token error:`, error.message);
    console.error(error.stack);
    
    // Return error with appropriate status code
    const statusCode = error.message.includes('Authentication') ? 401 :
                       error.message.includes('Permission') ? 403 :
                       error.message.includes('Invalid request') ? 400 : 500;
    
    res.status(statusCode).json({
      error: 'Failed to generate session token',
      details: error.message,
      responseTime,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Simple session endpoint for backward compatibility
 */
app.post('/api/session-simple', async (req, res) => {
  console.log(`[${req.requestId}] Simple session request`);
  
  try {
    // Use default configuration
    const tokenResult = await generateSessionToken({
      addresses: [{
        address: J1_CCP_ADDRESS,
        blockchains: ["ethereum", "base"],
        assets: ["ETH", "USDC"]
      }]
    });
    
    res.json(tokenResult);
    
  } catch (error) {
    console.error(`[${req.requestId}] Simple session error:`, error.message);
    
    // Always return a token (development if production fails)
    const devToken = generateDevelopmentToken({
      destinationWallets: [{
        address: J1_CCP_ADDRESS,
        blockchains: ["ethereum", "base"],
        assets: ["ETH", "USDC"]
      }]
    }, "80a2acea-83de-40aa-be1e-081d47e196c8");
    
    res.json(devToken);
  }
});

/**
 * Verify token endpoint
 */
app.post('/api/verify', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      error: 'Token required',
      requestId: req.requestId
    });
  }
  
  try {
    const verification = await verifySessionToken(token);
    res.json({
      ...verification,
      requestId: req.requestId
    });
  } catch (error) {
    res.status(400).json({
      valid: false,
      error: error.message,
      requestId: req.requestId
    });
  }
});

/**
 * Widget configuration endpoint
 */
app.get('/api/widget-config', (req, res) => {
  try {
    const credentials = loadCDPCredentials();
    
    res.json({
      appId: credentials.projectId,
      destinationAddress: J1_CCP_ADDRESS,
      destinationNetworks: Object.keys(SUPPORTED_CHAINS),
      destinationAssets: Object.keys(SUPPORTED_ASSETS).slice(0, 6),
      handlingRequestedUrls: true,
      defaultExperience: 'send',
      requestId: req.requestId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Configuration error',
      requestId: req.requestId
    });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(`[${req.requestId}] Unhandled error:`, err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    requestId: req.requestId
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                   CDP Session Token API Server                   ║
╠══════════════════════════════════════════════════════════════════╣
║  Status: Running                                                  ║
║  Port: ${PORT}                                                    ║
║  Environment: ${process.env.NODE_ENV || 'production'}            ║
║  Time: ${new Date().toISOString()}                               ║
╚══════════════════════════════════════════════════════════════════╝

API Endpoints:
  GET  /api/health        - Health check
  GET  /api/config        - Configuration info
  POST /api/session       - Generate session token
  POST /api/session-simple - Simple token generation
  POST /api/verify        - Verify token
  GET  /api/widget-config - Widget configuration

Configuration:
`);
  
  try {
    const credentials = loadCDPCredentials();
    const validation = validateCredentials(credentials);
    
    if (validation.valid) {
      console.log(`  ✅ CDP credentials configured`);
      console.log(`  Project ID: ${credentials.projectId}`);
      console.log(`  API Key: ${credentials.apiKey.substring(0, 8)}...`);
    } else {
      console.log(`  ⚠️  CDP credentials issues:`, validation.errors);
    }
  } catch (error) {
    console.log(`  ❌ CDP credentials not configured:`, error.message);
  }
  
  console.log(`
Ready to accept requests!
Test with: curl http://localhost:${PORT}/api/health
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
