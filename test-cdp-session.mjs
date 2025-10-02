#!/usr/bin/env node

/**
 * CDP Session Token Test Script
 * Tests the session token generation and validation
 */

import fetch from 'node-fetch';
import { generateCDPJWT } from './api/cdp-auth.mjs';
import { readFileSync } from 'fs';

// Manual environment variable loading
try {
  const envFile = readFileSync('./.env', 'utf8');
  envFile.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
} catch (error) {
  console.log('No .env file found, using existing environment variables');
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// J1.CCP wallet address
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

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

// Test credential loading
async function testCredentials() {
  console.log(`\n${colors.cyan}📋 Testing CDP Credentials...${colors.reset}`);
  
  const credentials = loadCredentials();
  
  console.log(`  Project ID: ${credentials.projectId ? colors.green + '✅' : colors.red + '❌'} ${credentials.projectId || 'Missing'}${colors.reset}`);
  console.log(`  API Key: ${credentials.apiKey ? colors.green + '✅' : colors.red + '❌'} ${credentials.apiKey ? credentials.apiKey.substring(0, 8) + '...' : 'Missing'}${colors.reset}`);
  console.log(`  API Secret: ${credentials.apiSecret ? colors.green + '✅' : colors.red + '❌'} ${credentials.apiSecret ? 'Configured' : 'Missing'}${colors.reset}`);
  
  return credentials;
}

// Test JWT generation
async function testJWTGeneration(credentials) {
  console.log(`\n${colors.cyan}🔐 Testing JWT Generation...${colors.reset}`);
  
  try {
    const jwt = generateCDPJWT('POST', '/onramp/v1/token', credentials.apiKeyName, credentials.apiSecret);
    
    if (jwt) {
      console.log(`  ${colors.green}✅ JWT generated successfully${colors.reset}`);
      console.log(`  Token length: ${jwt.length} characters`);
      
      // Decode JWT header and payload (without verification)
      const parts = jwt.split('.');
      if (parts.length === 3) {
        const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        
        console.log(`  Algorithm: ${header.alg}`);
        console.log(`  Key ID: ${header.kid?.substring(0, 30)}...`);
        console.log(`  Expires in: ${payload.exp - Math.floor(Date.now() / 1000)} seconds`);
      }
      
      return jwt;
    }
  } catch (error) {
    console.log(`  ${colors.red}❌ JWT generation failed: ${error.message}${colors.reset}`);
    return null;
  }
}

// Test CDP API connection
async function testCDPAPI(credentials, jwt) {
  console.log(`\n${colors.cyan}🌐 Testing CDP API Connection...${colors.reset}`);
  
  try {
    // Test request to CDP API
    const requestBody = {
      projectId: credentials.projectId,
      destinationWallets: [{
        address: J1_CCP_ADDRESS,
        blockchains: ["ethereum", "base"],
        assets: ["ETH", "USDC"]
      }]
    };

    console.log(`  Making request to CDP Onramp API...`);
    
    const response = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
        'X-Project-ID': credentials.projectId
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log(`  ${colors.green}✅ CDP API request successful!${colors.reset}`);
      console.log(`  Session token received: ${data.token ? 'Yes' : 'No'}`);
      console.log(`  Token preview: ${data.token?.substring(0, 30)}...`);
      return data;
    } else {
      console.log(`  ${colors.yellow}⚠️  CDP API returned error: ${response.status}${colors.reset}`);
      console.log(`  Response: ${responseText.substring(0, 200)}`);
      return null;
    }
  } catch (error) {
    console.log(`  ${colors.red}❌ CDP API request failed: ${error.message}${colors.reset}`);
    return null;
  }
}

// Test local session server
async function testLocalServer() {
  console.log(`\n${colors.cyan}🖥️  Testing Local Session Server...${colors.reset}`);
  
  try {
    // Test health endpoint
    console.log(`  Testing health endpoint...`);
    const healthResponse = await fetch('http://localhost:3001/api/health');
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`  ${colors.green}✅ Server is running${colors.reset}`);
      console.log(`  Status: ${healthData.status}`);
      console.log(`  Configured: ${healthData.configured ? 'Yes' : 'No'}`);
    } else {
      console.log(`  ${colors.yellow}⚠️  Server might not be running${colors.reset}`);
      return false;
    }

    // Test session generation
    console.log(`\n  Testing session generation endpoint...`);
    const sessionResponse = await fetch('http://localhost:3001/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        addresses: [{
          address: J1_CCP_ADDRESS,
          blockchains: ["ethereum", "base"],
          assets: ["ETH", "USDC"]
        }]
      })
    });

    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log(`  ${colors.green}✅ Session token generated${colors.reset}`);
      console.log(`  Token: ${sessionData.token?.substring(0, 30)}...`);
      console.log(`  Type: ${sessionData.fallback ? 'Development/Fallback' : 'Production'}`);
      console.log(`  Expires at: ${sessionData.expires_at}`);
      return sessionData;
    } else {
      console.log(`  ${colors.red}❌ Session generation failed${colors.reset}`);
      return null;
    }
    
  } catch (error) {
    console.log(`  ${colors.red}❌ Server connection failed: ${error.message}${colors.reset}`);
    console.log(`  ${colors.yellow}Make sure the server is running: npm run cdp-server${colors.reset}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(`${colors.bright}${colors.blue}
╔════════════════════════════════════════════════════════════╗
║          CDP Session Token Configuration Test             ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Test credentials
  const credentials = await testCredentials();
  
  if (!credentials.apiKey || !credentials.apiSecret) {
    console.log(`\n${colors.red}❌ Missing CDP credentials. Please configure:${colors.reset}`);
    console.log('   1. Add CDP_API_KEY and CDP_API_SECRET to .env');
    console.log('   2. Or ensure cdp_api_key.json is present');
    return;
  }

  // Test JWT generation
  const jwt = await testJWTGeneration(credentials);
  
  if (jwt) {
    // Test CDP API
    await testCDPAPI(credentials, jwt);
  }

  // Test local server
  await testLocalServer();

  console.log(`\n${colors.bright}${colors.cyan}📊 Test Summary${colors.reset}`);
  console.log('═══════════════════════════════════════════');
  console.log(`If all tests pass, your CDP session token generation is properly configured!`);
  console.log(`\nNext steps:`);
  console.log(`1. Start the CDP session server: ${colors.yellow}npm run cdp-server${colors.reset}`);
  console.log(`2. Start the main application: ${colors.yellow}npm run dev${colors.reset}`);
  console.log(`3. Test the Coinbase Onramp integration in your app`);
}

// Run tests
runTests().catch(console.error);
