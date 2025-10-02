# Coinbase Onramp/Offramp Integration Guide

## Current Implementation (App ID Flow) ✅

The current implementation uses the **App ID flow**, which is simpler and doesn't require session tokens:

```javascript
// Your configuration
CDP_PROJECT_ID = "80a2acea-83de-40aa-be1e-081d47e196c8"
J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E"
```

### How it works:
1. User clicks "Fiat → Crypto" or "Crypto → Fiat"
2. Opens Coinbase Pay with your App ID
3. Funds are sent directly to your J1.CCP wallet address
4. No backend server or session tokens required

### URLs Used:
- **Onramp:** `https://pay.coinbase.com/buy?appId=YOUR_PROJECT_ID&...`
- **Offramp:** `https://pay.coinbase.com/sell?appId=YOUR_PROJECT_ID&...`

## Testing the Integration

1. Make sure your servers are running:
```bash
./start-dev-with-api.sh
```

2. Open http://localhost:5173

3. Click the Coinbase buttons - they should now work without errors!

## Important Parameters

### For Onramp (Buy Crypto):
- `appId`: Your CDP Project ID (required)
- `destinationWallets`: JSON array of wallet configurations
- `defaultAsset`: Default crypto to buy (e.g., "ETH")
- `defaultNetwork`: Default blockchain (e.g., "base")
- `defaultPaymentMethod`: Payment type (e.g., "CARD")
- `presetFiatAmount`: Default amount in USD

### For Offramp (Sell Crypto):
- `appId`: Your CDP Project ID (required)
- `defaultAsset`: Default crypto to sell (e.g., "USDC")
- `defaultNetwork`: Default blockchain (e.g., "base")

## Session Tokens (Advanced) 🔐

Session tokens are only needed if you want:
- Server-side control over transactions
- Custom fee structures
- Advanced security features
- Programmatic transaction monitoring

For most use cases, the App ID flow is sufficient.

## Troubleshooting

### "invalid_app_id" Error
- Verify your CDP_PROJECT_ID is correct
- Check if your project is active in the Coinbase Developer Platform
- Ensure your domain is whitelisted in CDP settings

### Funds not going to correct address
- Check the `destinationWallets` parameter
- Verify the wallet address is correct
- Ensure the blockchain networks match

## Production Deployment

For production on Vercel:
1. Add environment variables in Vercel dashboard:
   - `VITE_CDP_PROJECT_ID`
   - `VITE_J1_CCP_ADDRESS`

2. Update the component to use environment variables:
```javascript
const CDP_PROJECT_ID = import.meta.env.VITE_CDP_PROJECT_ID || "80a2acea-83de-40aa-be1e-081d47e196c8";
const J1_CCP_ADDRESS = import.meta.env.VITE_J1_CCP_ADDRESS || "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";
```

## Resources
- [Coinbase Pay Documentation](https://docs.cdp.coinbase.com/pay/docs/overview)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [Integration Examples](https://github.com/coinbase/pay-sdk)