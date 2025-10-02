# CDP Session Token Implementation

## Overview
This document describes the proper implementation of Coinbase Developer Platform (CDP) session token generation for secure initialization in the J1TFYI CCP project.

## Architecture

### Components

1. **cdp-auth.mjs** - Core authentication module
   - JWT generation with ES256 algorithm
   - Private key formatting
   - Request signing

2. **generateToken.mjs** - Token generation script
   - Node.js script for CDP API calls
   - Handles credential loading
   - Generates production and fallback tokens

3. **cdp-session-server.mjs** - Express API server
   - RESTful endpoints for token generation
   - CORS-enabled for cross-origin requests
   - Health checks and configuration endpoints

4. **test-cdp-session.mjs** - Testing suite
   - Validates CDP credentials
   - Tests JWT generation
   - Verifies API connectivity

## Configuration

### Environment Variables

```bash
# Required CDP Configuration
VITE_CDP_PROJECT_ID=80a2acea-83de-40aa-be1e-081d47e196c8
CDP_API_KEY=1709cbbe-8909-469c-99de-8df1c1396cf9
CDP_API_SECRET=<your-private-key>
VITE_CDP_API_KEY_NAME=organizations/<org-id>/apiKeys/<key-id>

# Optional
CDP_SESSION_PORT=3001  # Default: 3001
```

### Credential Storage

CDP credentials can be stored in two ways:

1. **Environment Variables** (.env file)
2. **JSON Key File** (cdp_api_key.json)

```json
{
  "id": "your-api-key-id",
  "privateKey": "your-base64-encoded-private-key"
}
```

## API Endpoints

### Generate Session Token
**POST** `/api/session`

Request:
```json
{
  "addresses": [{
    "address": "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E",
    "blockchains": ["ethereum", "base", "polygon"],
    "assets": ["ETH", "USDC", "USDT"]
  }]
}
```

Response:
```json
{
  "token": "cdp_session_v1_...",
  "expires_at": "2025-01-15T10:30:00Z",
  "project_id": "80a2acea-83de-40aa-be1e-081d47e196c8",
  "success": true
}
```

### Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "ok",
  "service": "cdp-session-api",
  "project_id": "80a2acea-83de-40aa-be1e-081d47e196c8",
  "configured": true
}
```

### Configuration Info
**GET** `/api/config`

Response:
```json
{
  "project_id": "80a2acea-83de-40aa-be1e-081d47e196c8",
  "destination_address": "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E",
  "supported_chains": ["ethereum", "base", "polygon", "arbitrum", "optimism"],
  "supported_assets": ["ETH", "USDC", "USDT", "DAI", "WETH", "WBTC"],
  "configured": true
}
```

## JWT Authentication

The CDP API requires JWT authentication with ES256 algorithm:

1. **Header**:
   - Algorithm: ES256
   - Key ID: Your API key name
   - Type: JWT
   - Nonce: Random 16-byte hex string

2. **Payload**:
   - Issuer: "coinbase-cloud"
   - Subject: API key name
   - Audience: ["platform", "onramp"]
   - URI: HTTP method + path
   - Expiry: 120 seconds

3. **Signature**:
   - Signed with EC private key (P-256 curve)

## Security Considerations

1. **Private Key Protection**
   - Never commit private keys to version control
   - Use environment variables in production
   - Rotate keys regularly

2. **Token Expiry**
   - Session tokens expire in 10 minutes
   - JWTs expire in 2 minutes
   - Implement token refresh logic

3. **CORS Configuration**
   - Restrict origins in production
   - Use credentials for secure cookies

4. **Rate Limiting**
   - Implement rate limiting on token generation
   - Monitor for unusual activity

## Supported Blockchains

- **Ethereum** (Chain ID: 1)
- **Base** (Chain ID: 8453)
- **Polygon** (Chain ID: 137)
- **Arbitrum One** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)

## Supported Assets

Primary tokens:
- ETH (Ethereum)
- USDC (USD Coin)
- USDT (Tether)
- DAI (Dai Stablecoin)
- WETH (Wrapped Ethereum)
- WBTC (Wrapped Bitcoin)

Additional tokens:
- UNI (Uniswap)
- LINK (Chainlink)
- AAVE (Aave)
- MATIC (Polygon)
- OP (Optimism)
- ARB (Arbitrum)

## Development vs Production

### Development Mode
- Uses fallback tokens when CDP API fails
- Tokens marked with `development: true`
- No real CDP API calls required

### Production Mode
- Requires valid CDP credentials
- Makes authenticated API calls
- Returns real session tokens

## Testing

Run the test suite:
```bash
npm run test-cdp
```

This will:
1. Validate CDP credentials
2. Test JWT generation
3. Verify API connectivity
4. Test local server endpoints

## Troubleshooting

### Common Issues

1. **"CDP credentials not configured"**
   - Ensure CDP_API_KEY and CDP_API_SECRET are set
   - Check cdp_api_key.json exists and is valid

2. **"JWT generation failed"**
   - Verify private key format (base64 or PEM)
   - Check key corresponds to the API key

3. **"CDP API Error: 401"**
   - Invalid JWT signature
   - Expired credentials
   - Wrong project ID

4. **"CDP API Error: 400"**
   - Invalid request body
   - Unsupported blockchain or asset

## Usage in Application

### Client-Side Integration

```typescript
// Request session token
const response = await fetch('http://localhost:3001/api/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    addresses: [{
      address: userWalletAddress,
      blockchains: ['ethereum', 'base'],
      assets: ['ETH', 'USDC']
    }]
  })
});

const { token } = await response.json();

// Use token with Coinbase Onramp
const onrampInstance = new CoinbaseOnramp({
  sessionToken: token,
  // ... other config
});
```

## Deployment

### Local Development
```bash
# Start CDP session server
npm run cdp-server

# Start development server
npm run dev

# Or run both
npm run dev:full
```

### Production (Vercel)
- Set environment variables in Vercel dashboard
- Deploy with `vercel deploy`
- Session server runs as serverless function

## References

- [CDP API Documentation](https://docs.cdp.coinbase.com/)
- [Coinbase Onramp Integration](https://docs.cdp.coinbase.com/onramp/docs/)
- [JWT ES256 Specification](https://tools.ietf.org/html/rfc7518#section-3.4)

## Support

For issues or questions:
1. Check test results: `npm run test-cdp`
2. Review server logs: `npm run cdp-server`
3. Verify credentials in .env or cdp_api_key.json
4. Contact Coinbase Developer Support

---

Last Updated: January 2025
Version: 1.0.0
