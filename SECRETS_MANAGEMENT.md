# Secrets Management Guide

This document describes how to manage sensitive files that are stored as GitHub secrets.

## Files Stored as GitHub Secrets

### Core Application Files
- `main.ts` → `MAIN_TS_BASE64`
- `src/pages/PortalPage.tsx` → `PORTAL_PAGE_BASE64`
- `src/components/DeBridgePortal.tsx` → `DEBRIDGE_PORTAL_BASE64`
- `src/components/ChartEmbed.tsx` → `CHART_EMBED_BASE64`

### Bridge App Files
- `bridge-react-app/src/App.jsx` → `APP_JSX_BASE64`
- `bridge-react-app/src/useBridge.jsx` → `BRIDGE_JSX_BASE64`
- `bridge-react-app/src/App.css` → `APP_CSS_BASE64`

### Scripts Folder (NEW)
- `scripts/withdraw-solana-fees.ts` → `SCRIPTS_WITHDRAW_FEES_BASE64`
- `scripts/jupiter-referral-setup.ts` → `SCRIPTS_JUPITER_SETUP_BASE64`
- `scripts/package.json` → `SCRIPTS_PACKAGE_JSON_BASE64`
- `scripts/README.md` → `SCRIPTS_README_BASE64`
- `scripts/.env.example` → `SCRIPTS_ENV_EXAMPLE_BASE64`

## Updating GitHub Secrets

### 1. Generate Base64 Versions
```bash
# Run the update script
./update_secrets.sh

# This will:
# - Create .base64 files for each sensitive file
# - Copy each one to clipboard sequentially
# - Prompt you to update GitHub secrets
```

### 2. Update in GitHub
1. Go to your repository Settings → Secrets and variables → Actions
2. For each secret, click Update and paste the base64 content
3. Save each secret

### 3. Verify Deployment
Push to main branch and check that GitHub Actions successfully:
- Decodes all secrets
- Builds both applications
- Deploys to Deno Deploy

## Restoring Files Locally

### From Base64 Files
```bash
# Decode a specific file
base64 -d -i main.ts.base64 -o main.ts

# Decode scripts folder
base64 -d -i scripts_withdraw-solana-fees.ts.base64 -o scripts/withdraw-solana-fees.ts
base64 -d -i scripts_jupiter-referral-setup.ts.base64 -o scripts/jupiter-referral-setup.ts
base64 -d -i scripts_package.json.base64 -o scripts/package.json
base64 -d -i scripts_README.md.base64 -o scripts/README.md
base64 -d -i scripts_env.example.base64 -o scripts/.env.example
```

### Using Restore Script (for CI/CD)
```bash
# Set environment variables with base64 content
export SCRIPTS_WITHDRAW_FEES_BASE64="..."
export SCRIPTS_JUPITER_SETUP_BASE64="..."
# ... etc

# Run restore script
./scripts_restore.sh
```

## Scripts Folder Special Notes

The `scripts/` folder contains sensitive fee management tools:
- **Wallet Private Keys**: Required for withdrawing fees
- **Referral Configurations**: Your unique referral codes and accounts
- **API Endpoints**: RPC endpoints and API keys

### Security Best Practices
1. **Never commit** the scripts folder to git (it's in .gitignore)
2. **Never share** your private keys or .env files
3. **Rotate keys** regularly if compromised
4. **Use dedicated wallets** for fee collection
5. **Store backups** securely offline

### Setting Up Scripts Locally
```bash
# 1. Restore from base64
base64 -d -i scripts_package.json.base64 -o scripts/package.json
base64 -d -i scripts_withdraw-solana-fees.ts.base64 -o scripts/withdraw-solana-fees.ts
# ... restore other files

# 2. Install dependencies
cd scripts
npm install

# 3. Create .env file (DO NOT COMMIT)
cat > .env << EOF
SOLANA_PRIVATE_KEY="your-base58-private-key"
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
EOF

# 4. Run scripts
npm run withdraw-fees
```

## GitHub Actions Integration

The deployment workflow automatically:
1. Restores main application files from secrets
2. Builds and deploys the application
3. Does NOT restore scripts folder (not needed for deployment)

If you need scripts in CI/CD, add to `.github/workflows/deploy.yml`:
```yaml
- name: Restore scripts folder (if needed)
  run: |
    mkdir -p scripts
    printf '%s' "${{ secrets.SCRIPTS_PACKAGE_JSON_BASE64 }}" | base64 -d > scripts/package.json
    # ... restore other files as needed
```

## Troubleshooting

### Base64 Encoding Issues
- **Mac**: Use `base64` or `openssl base64`
- **Linux**: Use `base64 -w 0` for single-line output
- **Windows**: Use `certutil -encode` or WSL

### Secret Too Large
GitHub secrets have a 64KB limit. If a file is too large:
1. Split into multiple secrets
2. Compress before encoding: `gzip -c file | base64`
3. Consider storing in encrypted cloud storage

### Missing Files in Deployment
Check that:
1. All secrets are properly set in GitHub
2. Base64 content is valid (no extra whitespace)
3. Deployment workflow decodes all required files

## Emergency Recovery

If you lose access to the original files:
1. Check for local base64 backups (*.base64 files)
2. Download from GitHub secrets (via API or UI)
3. Check deployment logs for file verification
4. Contact team members for backup copies

## Important Reminders

⚠️ **NEVER**:
- Commit sensitive files to git
- Share private keys in any form
- Store credentials in plain text
- Use production keys for testing

✅ **ALWAYS**:
- Keep base64 backups secure
- Rotate credentials regularly
- Use environment variables for secrets
- Test with testnet/devnet first