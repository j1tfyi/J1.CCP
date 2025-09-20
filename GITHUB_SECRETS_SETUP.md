# GitHub Secrets Setup Guide

This guide will help you set up the required GitHub Secrets for automated fee withdrawal.

## Required Secrets

You need to add these secrets to your GitHub repository:

### 1. SOLANA_PRIVATE_KEY
Your Solana wallet private key in base58 format.

**Value**: `2UYFKBGnpz6mu3t4smRciv8Q62K9KSZpVeJ98XeDUpRsH7LqSiJ7WcKsgyzNGj5gKyUZERMCJea6g1rJ9XFkLcwE`

### 2. SOLANA_RPC_URL (Optional)
Custom RPC endpoint for better performance. If not set, will use Helius RPC with embedded API key.

**Value**: `https://mainnet.helius-rpc.com/?api-key=c1b2f3e2-c831-40ae-bd03-0065b060cf0b`

### 3. Script Base64 Secrets
These are the base64-encoded versions of your script files:

- **SCRIPTS_WITHDRAW_FEES_BASE64**: Content of `scripts_withdraw-solana-fees.ts.base64`
- **SCRIPTS_JUPITER_SETUP_BASE64**: Content of `scripts_jupiter-referral-setup.ts.base64`
- **SCRIPTS_PACKAGE_JSON_BASE64**: Content of `scripts_package.json.base64`
- **SCRIPTS_README_BASE64**: Content of `scripts_README.md.base64` (optional)

## How to Add Secrets to GitHub

### Step 1: Go to Repository Settings
1. Navigate to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Each Secret
1. Click **New repository secret**
2. Enter the secret name (e.g., `SOLANA_PRIVATE_KEY`)
3. Enter the secret value
4. Click **Add secret**

### Step 3: Add Base64 Script Secrets
For each script file:

```bash
# Copy the base64 content to clipboard (Mac)
cat scripts_withdraw-solana-fees.ts.base64 | pbcopy

# Or display it to copy manually
cat scripts_withdraw-solana-fees.ts.base64
```

Then add to GitHub:
- Name: `SCRIPTS_WITHDRAW_FEES_BASE64`
- Value: (paste the base64 content)

Repeat for:
- `SCRIPTS_JUPITER_SETUP_BASE64`
- `SCRIPTS_PACKAGE_JSON_BASE64`
- `SCRIPTS_README_BASE64` (optional)

## Quick Copy Commands

Run these commands to copy each secret value to clipboard:

```bash
# Copy private key
echo "2UYFKBGnpz6mu3t4smRciv8Q62K9KSZpVeJ98XeDUpRsH7LqSiJ7WcKsgyzNGj5gKyUZERMCJea6g1rJ9XFkLcwE" | pbcopy

# Copy RPC URL
echo "https://mainnet.helius-rpc.com/?api-key=c1b2f3e2-c831-40ae-bd03-0065b060cf0b" | pbcopy

# Copy base64 files
cat scripts_withdraw-solana-fees.ts.base64 | pbcopy
cat scripts_jupiter-referral-setup.ts.base64 | pbcopy
cat scripts_package.json.base64 | pbcopy
```

## Verifying Your Setup

### 1. Test with Dry Run
After adding all secrets:
1. Go to **Actions** tab
2. Select **Withdraw Affiliate Fees** workflow
3. Click **Run workflow**
4. Select **Dry run: true**
5. Click **Run workflow**

### 2. Check the Output
The workflow should:
- ✅ Successfully restore script files
- ✅ Install dependencies
- ✅ Check wallet balance
- ✅ Show available fees (in dry run mode)

### 3. Run Actual Withdrawal
Once dry run succeeds:
1. Run workflow again with **Dry run: false**
2. Check the logs for successful withdrawals
3. Verify transactions on Solscan

## Automated Schedule

The workflow will automatically run:
- **Every Monday at 2:00 AM UTC**
- You can also trigger it manually anytime

## Security Notes

⚠️ **IMPORTANT**:
- Never share your private key
- GitHub Secrets are encrypted and not visible after adding
- Only repository admins can view/edit secrets
- Secrets are not exposed in logs

## Troubleshooting

### "Secret not found" Error
- Ensure secret name matches exactly (case-sensitive)
- Check you're adding to the correct repository

### "Invalid private key" Error
- Verify the private key is in base58 format
- Check for any extra spaces or newlines

### "RPC error" Issues
- The Helius RPC endpoint should work immediately
- If rate limited, wait or use a different API key

## Summary

After adding these secrets, your automated fee withdrawal system will:
1. ✅ Run automatically every week
2. ✅ Withdraw deBridge and Jupiter fees
3. ✅ Use high-performance Helius RPC
4. ✅ Clean up all sensitive data after execution
5. ✅ Generate withdrawal reports

The entire process is secure and automated!