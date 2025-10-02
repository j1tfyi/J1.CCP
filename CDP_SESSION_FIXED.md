# CDP Session Token Implementation - Fixed Version

## Quick Start

```bash
# 1. Setup and validate CDP configuration
npm run setup-cdp

# 2. Start the CDP session server
npm run cdp-server

# 3. In a new terminal, start the development server
npm run dev

# Or run both together
npm run dev:full
```

## Overview

This is the production-ready implementation of Coinbase Developer Platform (CDP) session token generation for the J1TFYI CCP project. The implementation includes:

- **Secure JWT authentication** with ES256 algorithm
- **Automatic credential discovery** from multiple sources
- **Production and development modes** with automatic fallback
- **Rate limiting** to prevent abuse
- **Comprehensive error handling** with detailed logging
- **Request tracking** with unique request IDs

## Files Structure

```
api/
├── cdp-auth-fixed.mjs         # Core authentication module with JWT generation
├── generateToken-fixed.mjs    # Token generation with CDP API integration
└── (original files preserved)

cdp-session-server-fixed.mjs   # Production-ready Express server
setup-cdp-fixed.mjs            # Setup and configuration script
```

## Configuration

### Method 1: Environment Variables (.env)

```bash
# Required
VITE_CDP_PROJECT_ID=80a2acea-83de-40aa-be1e-081d47e196c8
CDP_API_KEY=1709cbbe-8909-469c-99de-8df1c1396cf9
CDP_API_SECRET=MHcCAQEEIDLo0VBr/OtAvwfhTjWGRqCrCA3cjPCvsv8Fwzj7Z7VpoAoGCCqGSM49AwEHoUQDQgAEfai+xQDFjp7RVVJ5Sz7CPmqqvHmGj5hwioJl2MU3h7TDWbnBBGtv7DMzJlYYwLb5ba4DD9y7uT9k2AlyMPPZXw==
CDP_ORGANIZATION_ID=0c11b786-76f2-4a16-9088-e2e88dc26cd9

# Optional
CDP_SESSION_PORT=3001
NODE_ENV=development
USE_FALLBACK_TOKEN=true
```

### Method 2: JSON Key File (cdp_api_key.json)

```json
{
  "id": "1709cbbe-8909-469c-99de-8df1c1396cf9",
  "privateKey": "MHcCAQEEIDLo0VBr/OtAvwfhTjWGRqCrCA3cjPCvsv8Fwzj7Z7VpoAoGCCqGSM49AwEHoUQDQgAEfai+xQDFjp7RVVJ5Sz7CPmqqvHmGj5hwioJl2MU3h7TDWbnBBGtv7DMzJlYYwLb5ba4DD9y7uT9k2AlyMPPZXw=="
}
```

## API Endpoints

### Health Check
```bash
GET http://localhost:3001/api/health

Response:
{
  "status": "ok",
  "service": "cdp-session-api",
  "version": "1.0.0",
  "project_id": "80a2acea-83de-40aa-be1e-081d47e196c8",
  "configured": true,
  "timestamp": "2025-01-15T12:00:00.000Z",
  "requestId": "abc123"
}
```

### Generate Session Token
```bash
POST http://localhost:3001/api/session
Content-Type: application/json

{
  "addresses": [{
    "address": "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E",
    "blockchains": ["ethereum", "base", "polygon"],
    "assets": ["ETH", "USDC", "USDT"]
  }],
  "fiatCurrency": "USD",
  "defaultAmount": 100,
  "defaultNetwork": "base"
}

Response:
{
  "token": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-01-15T12:10:00.000Z",
  "project_id": "80a2acea-83de-40aa-be1e-081d47e196c8",
  "success": true,
  "production": true,
  "responseTime": 245,
  "requestId": "def456"
}
```

### Configuration Info
```bash
GET http://localhost:3001/api/config

Response:
{
  "project_id": "80a2acea-83de-40aa-be1e-081d47e196c8",
  "organization_id": "0c11b786-76f2-4a16-9088-e2e88dc26cd9",
  "destination_address": "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E",
  "supported_chains": ["ethereum", "base", "polygon", "arbitrum", "optimism"],
  "chain_details": {...},
  "supported_assets": ["ETH", "USDC", "USDT", "DAI", "WETH", "WBTC"],
  "asset_details": {...},
  "configured": true,
  "environment": "production",
  "rate_limit": {
    "window_ms": 60000,
    "max_requests": 10
  }
}
```

## Key Improvements

### 1. Enhanced Authentication
- Proper ES256 JWT generation with correct header and payload structure
- Support for multiple key formats (PEM, base64-encoded DER)
- Automatic key format detection and conversion
- Credential validation before API calls

### 2. Error Handling
- Comprehensive error messages with actionable feedback
- Automatic retry logic with exponential backoff
- Fallback to development tokens when CDP API is unavailable
- Request tracking with unique IDs for debugging

### 3. Security Features
- Rate limiting (10 requests per minute per IP)
- CORS configuration with allowed origins
- Request validation and sanitization
- Secure credential storage options

### 4. Production Ready
- Health check and monitoring endpoints
- Detailed logging with request IDs
- Graceful shutdown handling
- Environment-based configuration

## Testing

### Run Complete Test Suite
```bash
npm run setup-cdp
```

This will:
1. Check current configuration
2. Validate CDP credentials
3. Test JWT generation
4. Test CDP API connectivity
5. Test local server endpoints

### Test Individual Components

```bash
# Test token generation directly
npm run cdp:test

# Validate credentials
npm run cdp:validate

# Test the old implementation for comparison
npm run cdp-server:old
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "CDP credentials not configured"
```bash
# Check if credentials are loaded correctly
npm run setup-cdp

# Verify .env file exists and has correct values
cat .env | grep CDP

# Check JSON key file
cat cdp_api_key.json
```

#### 2. "Authentication failed: Invalid JWT"
- Ensure the private key is correctly formatted
- Check that the API key matches the private key
- Verify the organization ID and project ID are correct

#### 3. "CDP API Error: 403 Permission denied"
- Verify your API key has onramp permissions in the Coinbase Developer Platform
- Check that the project ID matches your CDP project

#### 4. "Using development token - CDP API not available"
- This is normal in development mode
- To use production tokens, ensure:
  - CDP credentials are properly configured
  - You have a valid CDP account with onramp access
  - The CDP API is accessible from your network

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm run cdp-server
```

Check server logs:
```bash
tail -f logs/cdp-server.log
```

## Integration with Frontend

### React/TypeScript Integration

```typescript
// api/coinbase.ts
export async function generateCDPSessionToken(
  walletAddress: string,
  chains: string[] = ['ethereum', 'base'],
  assets: string[] = ['ETH', 'USDC']
) {
  const response = await fetch('http://localhost:3001/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      addresses: [{
        address: walletAddress,
        blockchains: chains,
        assets: assets
      }]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate session token');
  }

  return response.json();
}

// Usage in component
const { token } = await generateCDPSessionToken(userWallet);

// Initialize Coinbase Onramp
const onrampInstance = new CoinbaseOnramp({
  sessionToken: token,
  onSuccess: () => console.log('Purchase successful'),
  onError: (error) => console.error('Purchase failed:', error)
});
```

## Production Deployment

### Vercel Deployment

1. Set environment variables in Vercel dashboard:
```
VITE_CDP_PROJECT_ID
CDP_API_KEY
CDP_API_SECRET
CDP_ORGANIZATION_ID
```

2. Update vercel.json:
```json
{
  "functions": {
    "api/session.js": {
      "maxDuration": 10
    }
  }
}
```

3. Deploy:
```bash
vercel deploy --prod
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3001
CMD ["node", "cdp-session-server-fixed.mjs"]
```

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Rotate API keys regularly** - Every 90 days minimum
3. **Use HTTPS in production** - SSL/TLS encryption required
4. **Implement rate limiting** - Already included (10 req/min)
5. **Monitor for suspicious activity** - Check logs regularly
6. **Validate all inputs** - Sanitize user-provided data
7. **Keep dependencies updated** - Regular security updates

## Support

For issues:
1. Run diagnostics: `npm run setup-cdp`
2. Check server logs: `npm run cdp-server`
3. Verify credentials in CDP dashboard
4. Review this documentation

## License

MIT License - J1TFYI CCP Project 2025
