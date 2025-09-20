/**
 * Test Script for Fee Collection System
 *
 * This script tests all components without actually withdrawing fees
 * Run this to verify everything works before using automation
 */

const https = require('https');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const bs58Module = require('bs58');
const bs58 = bs58Module.default || bs58Module;

// Configuration
const CONFIG = {
  PRIVATE_KEY: "2UYFKBGnpz6mu3t4smRciv8Q62K9KSZpVeJ98XeDUpRsH7LqSiJ7WcKsgyzNGj5gKyUZERMCJea6g1rJ9XFkLcwE",
  RPC_URL: "https://mainnet.helius-rpc.com/?api-key=c1b2f3e2-c831-40ae-bd03-0065b060cf0b",
  DEBRIDGE_REFERRAL_CODE: "32422",
  JUPITER_REFERRAL_ACCOUNT: "EKtLGKfhtaJoUnoPodBesHzfaT8aJozCayv1zw8AKH3h",
  SOLANA_BENEFICIARY: "D6vq5F6RUg6n2by5KHXyR1hpQ3uPG3dvNHJVXXaMyTnc",
  EVM_BENEFICIARY: "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E"
};

// Test results tracking
let testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, type = 'info') {
  switch(type) {
    case 'success':
      console.log(`${colors.green}✅ ${message}${colors.reset}`);
      break;
    case 'error':
      console.log(`${colors.red}❌ ${message}${colors.reset}`);
      break;
    case 'warning':
      console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
      break;
    case 'info':
      console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
      break;
    case 'header':
      console.log(`\n${colors.bold}${colors.blue}${'='.repeat(50)}${colors.reset}`);
      console.log(`${colors.bold}${colors.blue}${message}${colors.reset}`);
      console.log(`${colors.bold}${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
      break;
  }
}

// Test 1: Validate Private Key
async function testPrivateKey() {
  log('Testing private key format...', 'info');

  try {
    const wallet = Keypair.fromSecretKey(bs58.decode(CONFIG.PRIVATE_KEY));
    const pubkey = wallet.publicKey.toString();

    log(`Private key is valid`, 'success');
    log(`Wallet public key: ${pubkey}`, 'info');

    // Check if it matches expected wallet
    if (pubkey === CONFIG.SOLANA_BENEFICIARY) {
      log('Wallet matches beneficiary address', 'success');
    } else {
      log(`Wallet (${pubkey}) differs from beneficiary (${CONFIG.SOLANA_BENEFICIARY})`, 'warning');
      testResults.warnings.push('Wallet/beneficiary mismatch');
    }

    testResults.passed.push('Private key validation');
    return true;
  } catch (error) {
    log(`Invalid private key: ${error.message}`, 'error');
    testResults.failed.push('Private key validation');
    return false;
  }
}

// Test 2: RPC Connection
async function testRPCConnection() {
  log('Testing RPC connection...', 'info');

  try {
    const connection = new Connection(CONFIG.RPC_URL, 'confirmed');
    const version = await connection.getVersion();

    log(`RPC connected: ${CONFIG.RPC_URL}`, 'success');
    log(`Solana version: ${version['solana-core']}`, 'info');

    testResults.passed.push('RPC connection');
    return connection;
  } catch (error) {
    log(`RPC connection failed: ${error.message}`, 'error');
    testResults.failed.push('RPC connection');
    return null;
  }
}

// Test 3: Wallet Balance
async function testWalletBalance(connection) {
  log('Checking wallet balance...', 'info');

  try {
    const wallet = Keypair.fromSecretKey(bs58.decode(CONFIG.PRIVATE_KEY));
    const balance = await connection.getBalance(wallet.publicKey);
    const solBalance = balance / 1e9;

    log(`Wallet balance: ${solBalance.toFixed(4)} SOL`, 'info');

    if (solBalance < 0.01) {
      log('Balance too low for transaction fees (need at least 0.01 SOL)', 'warning');
      testResults.warnings.push('Low balance');
    } else {
      log('Sufficient balance for fees', 'success');
    }

    testResults.passed.push('Wallet balance check');
    return true;
  } catch (error) {
    log(`Balance check failed: ${error.message}`, 'error');
    testResults.failed.push('Wallet balance check');
    return false;
  }
}

// Test 4: Jupiter Referral Account
async function testJupiterReferral(connection) {
  log('Checking Jupiter referral account...', 'info');

  try {
    const referralPubkey = new PublicKey(CONFIG.JUPITER_REFERRAL_ACCOUNT);
    const accountInfo = await connection.getAccountInfo(referralPubkey);

    if (accountInfo) {
      log('Jupiter referral account exists', 'success');
      log(`Account size: ${accountInfo.data.length} bytes`, 'info');
      log(`Account owner: ${accountInfo.owner.toString().slice(0, 8)}...`, 'info');
      testResults.passed.push('Jupiter referral account');
    } else {
      log('Jupiter referral account not found - may need initialization', 'warning');
      testResults.warnings.push('Jupiter account not initialized');
    }

    return true;
  } catch (error) {
    log(`Jupiter check failed: ${error.message}`, 'error');
    testResults.failed.push('Jupiter referral account');
    return false;
  }
}

// Test 5: Check deBridge Orders
async function testDeBridgeOrders() {
  log('Checking deBridge orders...', 'info');

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      giveChainIds: [7565164], // Solana
      takeChainIds: [],
      orderStates: ["ClaimedUnlock"],
      filter: CONFIG.SOLANA_BENEFICIARY,
      referralCode: CONFIG.DEBRIDGE_REFERRAL_CODE,
      skip: 0,
      take: 10
    });

    const options = {
      hostname: 'stats-api.dln.trade',
      path: '/api/Orders/filteredList',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const orders = result.orders || [];

          log(`Found ${orders.length} unclaimed deBridge orders`, 'info');

          if (orders.length > 0) {
            log('Sample order IDs:', 'info');
            orders.slice(0, 3).forEach(order => {
              const orderId = order.orderId?.stringValue || 'Unknown';
              console.log(`  - ${orderId}`);
            });
            testResults.passed.push('deBridge API connection');
          } else {
            log('No unclaimed orders currently (this is normal)', 'info');
            testResults.passed.push('deBridge API connection');
          }

          resolve(true);
        } catch (e) {
          log(`Failed to parse deBridge response: ${e.message}`, 'error');
          testResults.failed.push('deBridge API connection');
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      log(`deBridge API error: ${e.message}`, 'error');
      testResults.failed.push('deBridge API connection');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test 6: Dependency Check
async function testDependencies() {
  log('Checking required dependencies...', 'info');

  const requiredPackages = [
    '@solana/web3.js',
    'bs58',
    '@jup-ag/referral-sdk',
    '@debridge-finance/dln-client'
  ];

  const missing = [];

  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
      log(`✓ ${pkg}`, 'success');
    } catch {
      log(`✗ ${pkg} - not installed`, 'warning');
      missing.push(pkg);
    }
  }

  if (missing.length > 0) {
    log(`Missing packages: ${missing.join(', ')}`, 'warning');
    log('Install with: npm install ' + missing.join(' '), 'info');
    testResults.warnings.push(`Missing packages: ${missing.join(', ')}`);
  } else {
    log('All dependencies installed', 'success');
    testResults.passed.push('Dependency check');
  }

  return missing.length === 0;
}

// Main test runner
async function runTests() {
  log('FEE COLLECTION SYSTEM TEST', 'header');

  // Run tests in sequence
  const keyValid = await testPrivateKey();
  if (!keyValid) {
    log('Cannot continue without valid private key', 'error');
    return;
  }

  const connection = await testRPCConnection();
  if (!connection) {
    log('Cannot continue without RPC connection', 'error');
    return;
  }

  await testWalletBalance(connection);
  await testJupiterReferral(connection);
  await testDeBridgeOrders();
  await testDependencies();

  // Summary
  log('TEST SUMMARY', 'header');

  console.log(`${colors.green}Passed: ${testResults.passed.length}${colors.reset}`);
  testResults.passed.forEach(test => console.log(`  ✅ ${test}`));

  if (testResults.warnings.length > 0) {
    console.log(`\n${colors.yellow}Warnings: ${testResults.warnings.length}${colors.reset}`);
    testResults.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
  }

  if (testResults.failed.length > 0) {
    console.log(`\n${colors.red}Failed: ${testResults.failed.length}${colors.reset}`);
    testResults.failed.forEach(test => console.log(`  ❌ ${test}`));
  }

  // Final verdict
  console.log('\n' + '='.repeat(50));
  if (testResults.failed.length === 0) {
    log('✅ SYSTEM READY - All critical tests passed!', 'success');
    log('The automated scripts should work correctly.', 'info');

    if (testResults.warnings.length > 0) {
      log('Address warnings above for optimal operation.', 'warning');
    }
  } else {
    log('❌ SYSTEM NOT READY - Fix errors before using automation', 'error');
  }

  // Additional info
  console.log('\n' + '='.repeat(50));
  log('Next Steps:', 'info');
  console.log('1. Add secrets to GitHub (see GITHUB_SECRETS_SETUP.md)');
  console.log('2. Push changes to GitHub');
  console.log('3. Run manual test in GitHub Actions (dry run)');
  console.log('4. Enable automation for weekly execution');

  console.log('\n' + colors.blue + 'Dashboard Links:' + colors.reset);
  console.log(`Jupiter: https://referral.jup.ag/dashboard`);
  console.log(`Wallet: https://solscan.io/account/${CONFIG.SOLANA_BENEFICIARY}`);
}

// Run the tests
console.log('Starting system tests...\n');
runTests().catch(error => {
  console.error('Test runner error:', error);
});