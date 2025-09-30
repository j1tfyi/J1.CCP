# Vercel Setup Instructions for J1.CCP

## Quick Setup

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
# Deploy to preview
./deploy.sh preview

# Deploy to production
./deploy.sh production
```

## Manual Setup via Vercel Dashboard

### 1. Import Project
1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import Git Repository: `https://github.com/j1tfyi/J1.CCP`
3. Select Framework: Vite
4. Set Team: `team_tDOlySEYtPFrKqO3WendFWqj`

### 2. Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`

### 3. Environment Variables
Add these in [Environment Variables Settings](https://vercel.com/team_tDOlySEYtPFrKqO3WendFWqj/j1-ccp/settings/environment-variables):

```bash
CDP_API_KEY=your_cdp_api_key_here
CDP_API_SECRET=your_cdp_api_secret_here
CDP_PROJECT_ID=80a2acea-83de-40aa-be1e-081d47e196c8
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## GitHub Integration (Optional)

### 1. Get Vercel Tokens
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create new token with name "GitHub Actions"
3. Copy the token

### 2. Get Project IDs
```bash
# After linking project
cat .vercel/project.json
```

### 3. Add GitHub Secrets
In your GitHub repository settings, add:
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your organization ID (team_tDOlySEYtPFrKqO3WendFWqj)
- `VERCEL_PROJECT_ID`: Your project ID from .vercel/project.json

## Testing

### 1. Health Check
```bash
curl https://j1-ccp.vercel.app/api/health
```

### 2. Widget Config
```bash
curl https://j1-ccp.vercel.app/api/widget-config
```

### 3. Session Token (requires CDP credentials)
```bash
curl -X POST https://j1-ccp.vercel.app/api/session \
  -H "Content-Type: application/json" \
  -d '{"addresses":[{"address":"0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E","blockchains":["ethereum","base"]}]}'
```

## Domains

### Default Domain
- Preview: `j1-ccp-git-{branch}-{team}.vercel.app`
- Production: `j1-ccp.vercel.app`

### Custom Domain
1. Go to [Domains Settings](https://vercel.com/team_tDOlySEYtPFrKqO3WendFWqj/j1-ccp/settings/domains)
2. Add your domain (e.g., `ccp.j1tfyi.com`)
3. Configure DNS as instructed

## Troubleshooting

### Build Fails
- Check Node version (requires 18+)
- Verify environment variables are set
- Check build logs in Vercel dashboard

### API Errors
- Ensure CDP_API_KEY and CDP_API_SECRET are set
- Check API endpoint logs in Functions tab
- Verify CORS headers are correct

### Session Token Issues
- CDP credentials must be valid
- Check network requests in browser console
- Verify API endpoint is accessible

## Support

For issues, check:
- [Vercel Status](https://www.vercel-status.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/j1tfyi/J1.CCP/issues)