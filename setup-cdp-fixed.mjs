#!/usr/bin/env node

/**
 * CDP Setup and Configuration Script
 * Helps set up and test CDP credentials for the J1TFYI CCP project
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { generateCDPJWT, validateCredentials } from './api/cdp-auth-fixed.mjs';
import { loadCDPCredentials, generateSessionToken } from './api/generateToken-fixed.mjs';
import crypto from 'crypto';
import fetch from 'node-fetch';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// J1.CCP wallet address
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

/**
 * Display banner
 */
function showBanner() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║          CDP Session Token Setup & Configuration          ║
║                    J1TFYI CCP Project                     ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
}

/**
 * Check current configuration
 */
async function checkConfiguration() {
  console.log(`\n${colors.cyan}📋 Checking Current Configuration...${colors.reset}`);
  
  let hasConfig = false;
  
  // Check for .env file
  if (existsSync('.env')) {
    console.log(`  ${colors.green}✅ .env file found${colors.reset}`);
    const envContent = readFileSync('.env', 'utf8');
    const hasApiKey = envContent.includes('CDP_API_KEY');
    const hasApiSecret = envContent.includes('CDP_API_SECRET');
    const hasProjectId = envContent.includes('VITE_CDP_PROJECT_ID');
    
    console.log(`    API Key: ${hasApiKey ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
    console.log(`    API Secret: ${hasApiSecret ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
    console.log(`    Project ID: ${hasProjectId ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
    
    hasConfig = hasApiKey && hasApiSecret;
  } else {
    console.log(`  ${colors.yellow}⚠️  .env file not found${colors.reset}`);
  }
  
  // Check for key files
  const keyFiles = [
    'cdp_api_key.json',
    'cdp_api_key_fixed.json',
    'cdp_api_key.json.backup'
  ];
  
  for (const file of keyFiles) {
    if (existsSync(file)) {
      console.log(`  ${colors.green}✅ ${file} found${colors.reset}`);
      try {
        const keyData = JSON.parse(readFileSync(file, 'utf8'));
        if (keyData.id && keyData.privateKey) {
          console.log(`    Key ID: ${keyData.id.substring(0, 8)}...${colors.reset}`);
          hasConfig = true;
        }
      } catch (error) {
        console.log(`    ${colors.red}Invalid JSON format${colors.reset}`);
      }
    }
  }
  
  // Check for private key file
  if (existsSync('cdp_private_key.pem')) {
    console.log(`  ${colors.green}✅ cdp_private_key.pem found${colors.reset}`);
  }
  
  return hasConfig;
}

/**
 * Test credential loading
 */
async function testCredentials() {
  console.log(`\n${colors.cyan}🔐 Testing Credential Loading...${colors.reset}`);
  
  try {
    const credentials = loadCDPCredentials();
    console.log(`  ${colors.green}✅ Credentials loaded successfully${colors.reset}`);
    
    console.log(`\n  Project ID: ${credentials.projectId}`);
    console.log(`  Organization ID: ${credentials.organizationId}`);
    console.log(`  API Key: ${credentials.apiKey.substring(0, 8)}...`);
    console.log(`  API Key Name: ${credentials.apiKeyName}`);
    
    // Validate credentials
    const validation = validateCredentials(credentials);
    if (validation.valid) {
      console.log(`  ${colors.green}✅ Credentials validated successfully${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌ Validation errors:${colors.reset}`);
      validation.errors.forEach(error => {
        console.log(`    - ${error}`);
      });
    }
    
    return credentials;
  } catch (error) {
    console.log(`  ${colors.red}❌ Failed to load credentials: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Test JWT generation
 */
async function testJWTGeneration(credentials) {
  console.log(`\n${colors.cyan}🔐 Testing JWT Generation...${colors.reset}`);
  
  try {
    const jwt = generateCDPJWT(
      'POST',
      '/onramp/v1/token',
      credentials.apiKeyName,
      credentials.apiSecret
    );
    
    console.log(`  ${colors.green}✅ JWT generated successfully${colors.reset}`);
    console.log(`  Token length: ${jwt.length} characters`);
    
    // Decode and display JWT info
    const parts = jwt.split('.');
    if (parts.length === 3) {
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      console.log(`  Algorithm: ${header.alg}`);
      console.log(`  Key ID: ${header.kid?.substring(0, 50)}...`);
      console.log(`  Issuer: ${payload.iss}`);
      console.log(`  Audience: ${payload.aud.join(', ')}`);
      console.log(`  Expires in: ${payload.exp - Math.floor(Date.now() / 1000)} seconds`);
    }
    
    return jwt;
  } catch (error) {
    console.log(`  ${colors.red}❌ JWT generation failed: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Test CDP API connectivity
 */
async function testCDPAPI(credentials) {
  console.log(`\n${colors.cyan}🌐 Testing CDP API Connection...${colors.reset}`);
  
  try {
    const result = await generateSessionToken({
      addresses: [{
        address: J1_CCP_ADDRESS,
        blockchains: ["ethereum", "base"],
        assets: ["ETH", "USDC"]
      }]
    });
    
    if (result.success && result.production) {
      console.log(`  ${colors.green}✅ CDP API connection successful!${colors.reset}`);
      console.log(`  Token: ${result.token.substring(0, 30)}...`);
      console.log(`  Expires: ${result.expires_at}`);
      console.log(`  Environment: Production`);
    } else if (result.success && result.development) {
      console.log(`  ${colors.yellow}⚠️  Using development token (CDP API not available)${colors.reset}`);
      console.log(`  Token: ${result.token.substring(0, 30)}...`);
      console.log(`  Warning: ${result.warning}`);
    } else {
      console.log(`  ${colors.red}❌ Token generation failed${colors.reset}`);
    }
    
    return result;
  } catch (error) {
    console.log(`  ${colors.red}❌ CDP API test failed: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Test local server
 */
async function testLocalServer() {
  console.log(`\n${colors.cyan}🖥️  Testing Local CDP Server...${colors.reset}`);
  
  const port = process.env.CDP_SESSION_PORT || 3001;
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`http://localhost:${port}/api/health`);
    
    if (!healthResponse.ok) {
      console.log(`  ${colors.red}❌ Server not responding${colors.reset}`);
      console.log(`  ${colors.yellow}Start the server with: npm run cdp-server${colors.reset}`);
      return false;
    }
    
    const healthData = await healthResponse.json();
    console.log(`  ${colors.green}✅ Server is running${colors.reset}`);
    console.log(`  Status: ${healthData.status}`);
    console.log(`  Version: ${healthData.version}`);
    console.log(`  Configured: ${healthData.configured ? 'Yes' : 'No'}`);
    
    // Test session endpoint
    console.log(`\n  Testing session generation...`);
    
    const sessionResponse = await fetch(`http://localhost:${port}/api/session`, {
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
      console.log(`  ${colors.green}✅ Session token generated via server${colors.reset}`);
      console.log(`  Token: ${sessionData.token?.substring(0, 30)}...`);
      console.log(`  Response time: ${sessionData.responseTime}ms`);
    } else {
      console.log(`  ${colors.red}❌ Session generation failed${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.log(`  ${colors.red}❌ Server connection failed: ${error.message}${colors.reset}`);
    console.log(`  ${colors.yellow}Start the server with: npm run cdp-server${colors.reset}`);
    return false;
  }
}

/**
 * Create example .env file
 */
function createExampleEnv() {
  const envExample = `# Coinbase Developer Platform Configuration
VITE_CDP_PROJECT_ID=80a2acea-83de-40aa-be1e-081d47e196c8
CDP_API_KEY=your-api-key-here
CDP_API_SECRET=your-base64-encoded-private-key-here
CDP_ORGANIZATION_ID=0c11b786-76f2-4a16-9088-e2e88dc26cd9
VITE_CDP_API_KEY_NAME=organizations/0c11b786-76f2-4a16-9088-e2e88dc26cd9/apiKeys/your-api-key-here

# Optional
CDP_SESSION_PORT=3001
NODE_ENV=development
USE_FALLBACK_TOKEN=true
`;
  
  writeFileSync('.env.example', envExample);
  console.log(`  ${colors.green}✅ Created .env.example${colors.reset}`);
}

/**
 * Main setup function
 */
async function main() {
  showBanner();
  
  // Check current configuration
  const hasConfig = await checkConfiguration();
  
  if (!hasConfig) {
    console.log(`\n${colors.yellow}⚠️  No CDP configuration found${colors.reset}`);
    console.log(`\nTo configure CDP:`);
    console.log(`1. Copy .env.example to .env`);
    console.log(`2. Add your CDP API credentials`);
    console.log(`3. Or place your cdp_api_key.json file in the project root`);
    
    createExampleEnv();
    return;
  }
  
  // Test credentials
  const credentials = await testCredentials();
  if (!credentials) {
    console.log(`\n${colors.red}Please fix credential issues before continuing${colors.reset}`);
    return;
  }
  
  // Test JWT generation
  const jwt = await testJWTGeneration(credentials);
  
  // Test CDP API
  await testCDPAPI(credentials);
  
  // Test local server
  await testLocalServer();
  
  // Summary
  console.log(`\n${colors.bright}${colors.cyan}📊 Setup Summary${colors.reset}`);
  console.log('═══════════════════════════════════════════════════');
  
  console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
  console.log(`1. Start the CDP server: ${colors.yellow}npm run cdp-server${colors.reset}`);
  console.log(`2. Start the development server: ${colors.yellow}npm run dev${colors.reset}`);
  console.log(`3. Test the Coinbase Onramp integration`);
  
  console.log(`\n${colors.bright}Available Scripts:${colors.reset}`);
  console.log(`  npm run cdp-server     - Start CDP session server`);
  console.log(`  npm run test-cdp       - Run CDP tests`);
  console.log(`  npm run dev            - Start development server`);
  console.log(`  npm run dev:full       - Start both servers`);
  
  console.log(`\n${colors.green}✨ CDP setup complete!${colors.reset}\n`);
}

// Run setup
main().catch(console.error);
