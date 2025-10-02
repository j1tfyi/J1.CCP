#!/usr/bin/env node

/**
 * Local development server for session token API
 * This provides the /api/session endpoint for Coinbase Onramp/Offramp
 */

import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// J1.CCP wallet address for direct deposits
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Session token generation endpoint
app.post('/api/session', async (req, res) => {
  try {
    const { addresses, assets } = req.body;
    
    // Use provided addresses or default to J1.CCP
    const targetAddresses = addresses || [{
      address: J1_CCP_ADDRESS,
      blockchains: ["ethereum", "base", "polygon", "arbitrum", "optimism"]
    }];

    const requestBody = {
      addresses: targetAddresses,
      assets: assets || ["ETH", "USDC", "USDT", "DAI"]
    };

    console.log('[Session API] Generating token for addresses:', targetAddresses);

    // Call the Node.js generateToken script
    const generateTokenPath = path.join(process.cwd(), 'api', 'generateToken.mjs');
    
    // Check if the script exists
    if (!fs.existsSync(generateTokenPath)) {
      throw new Error('generateToken.mjs not found');
    }

    // Execute the Node.js script with the request body
    const child = spawn('node', [generateTokenPath, JSON.stringify(requestBody)], {
      env: {
        ...process.env,
        CDP_API_KEY: process.env.CDP_API_KEY || '1709cbbe-8909-469c-99de-8df1c1396cf9',
        CDP_API_SECRET: process.env.CDP_API_SECRET || '6sW8Lsf2WAZJCSDjHG9kM/Ym28JtqnFu4s31RTuAh+LXe2gLcGu8F7Tmhu3LDh/iihHSxb6iiWLzzOkzTnq0xQ=='
      }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error('[Session API] Token generation failed:', stderr);
        
        // Return fallback mock token for development
        const mockToken = Buffer.from(JSON.stringify({
          addresses: targetAddresses,
          assets: assets || ["ETH", "USDC", "USDT", "DAI"],
          timestamp: Date.now(),
          env: 'development'
        })).toString('base64');

        res.json({
          token: mockToken,
          channel_id: 'dev-' + Date.now(),
          expires_at: new Date(Date.now() + 600000).toISOString(),
          note: 'Using development fallback token'
        });
        return;
      }

      try {
        const result = JSON.parse(stdout);
        console.log('[Session API] Token generated successfully');
        res.json({
          token: result.token,
          channel_id: result.channel_id || null,
          expires_at: new Date(Date.now() + 600000).toISOString()
        });
      } catch (parseError) {
        console.error('[Session API] Failed to parse response:', parseError);
        
        // Return fallback mock token
        const mockToken = Buffer.from(JSON.stringify({
          addresses: targetAddresses,
          timestamp: Date.now(),
          env: 'development-error'
        })).toString('base64');

        res.json({
          token: mockToken,
          channel_id: 'dev-error-' + Date.now(),
          expires_at: new Date(Date.now() + 600000).toISOString(),
          note: 'Using development fallback token due to parse error'
        });
      }
    });

  } catch (error) {
    console.error('[Session API] Error:', error);
    
    // Return error response
    res.status(500).json({
      error: 'Failed to generate session token',
      details: error.message
    });
  }
});

// Widget configuration endpoint (for deBridge)
app.get('/widget-config', (req, res) => {
  res.json({
    element: 'debridgeWidget',
    inputChain: 1,
    outputChain: 7565164,
    inputCurrency: '0x0000000000000000000000000000000000000000',
    outputCurrency: '11111111111111111111111111111111',
    mode: 'deswap',
    affiliateFeePercent: 0.5,
    affiliateFeeRecipient: J1_CCP_ADDRESS,
    r: '32422',
    isHideLogo: true,
    theme: 'dark'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Session Token API Server Running                 ║
╠════════════════════════════════════════════════════╣
║   Port: ${PORT}                                    ║
║   Health: http://localhost:${PORT}/api/health      ║
║   Session: http://localhost:${PORT}/api/session    ║
║   Widget: http://localhost:${PORT}/widget-config   ║
╠════════════════════════════════════════════════════╣
║   CDP API Key: ${process.env.CDP_API_KEY ? '✓ Configured' : '✗ Missing'}     ║
║   CDP Secret: ${process.env.CDP_API_SECRET ? '✓ Configured' : '✗ Missing'}      ║
╚════════════════════════════════════════════════════╝
  `);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Session API] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Session API] Uncaught Exception:', error);
  process.exit(1);
});