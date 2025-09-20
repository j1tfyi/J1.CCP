# Automated Fee Withdrawal

This document explains the automated affiliate fee withdrawal system that runs on GitHub Actions.

## Overview

The scripts folder **does NOT need to be in the repository**. Instead:
- Script files are stored as base64-encoded GitHub Secrets
- GitHub Actions reconstructs them when needed
- Fees are automatically withdrawn weekly
- All sensitive files are cleaned up after execution

## Automated Withdrawal Schedule

### Weekly Automation
- **Schedule**: Every Monday at 2:00 AM UTC
- **Workflow**: `.github/workflows/withdraw-fees.yml`
- **Actions**:
  1. Checks wallet balance
  2. Withdraws deBridge cross-chain fees
  3. Claims Jupiter referral fees
  4. Generates withdrawal report
  5. Cleans up all sensitive files

### Manual Triggers
You can also manually trigger withdrawals:
1. Go to Actions tab in GitHub
2. Select "Withdraw Affiliate Fees" workflow
3. Click "Run workflow"
4. Choose options:
   - **Branch**: main
   - **Dry run**: true/false (test without withdrawing)

## Required GitHub Secrets

### Essential Secrets
```
SOLANA_PRIVATE_KEY           # Your wallet private key (base58)
SCRIPTS_WITHDRAW_FEES_BASE64 # Base64 of withdraw-solana-fees.ts
SCRIPTS_JUPITER_SETUP_BASE64 # Base64 of jupiter-referral-setup.ts
SCRIPTS_PACKAGE_JSON_BASE64  # Base64 of scripts/package.json
```

### Optional Secrets
```
SOLANA_RPC_URL    # Custom RPC endpoint (defaults to public)
SCRIPTS_README_BASE64  # Documentation (optional)
```

## Setting Up Automation

### 1. Generate Base64 Secrets
```bash
# Use the existing script files
base64 -i scripts/withdraw-solana-fees.ts -o withdraw-fees.base64
base64 -i scripts/jupiter-referral-setup.ts -o jupiter-setup.base64
base64 -i scripts/package.json -o package.base64

# Copy each to clipboard (Mac)
cat withdraw-fees.base64 | pbcopy
```

### 2. Add to GitHub Secrets
1. Go to Settings → Secrets and variables → Actions
2. Add each secret:
   - Name: `SCRIPTS_WITHDRAW_FEES_BASE64`
   - Value: (paste base64 content)
3. Add your private key:
   - Name: `SOLANA_PRIVATE_KEY`
   - Value: Your base58 private key

### 3. Test the Workflow
```bash
# Manually trigger with dry run
# Go to Actions → Withdraw Affiliate Fees → Run workflow
# Select "Dry run: true"
```

## Security Features

### Automatic Cleanup
- Scripts are created only during workflow execution
- All files are deleted after completion
- No sensitive data persists in the repository

### Secret Protection
- Private keys never appear in logs
- Base64 encoding prevents accidental exposure
- GitHub Secrets are encrypted at rest

### Access Control
- Only runs on main branch
- Requires repository secret access
- Manual approval for first-time setup

## Monitoring

### Check Fee Status
Run the "Check Affiliate Fees" workflow to see available fees without withdrawing:
1. Go to Actions → Check Affiliate Fees
2. Run workflow
3. View output for fee summary

### Withdrawal Reports
Each withdrawal generates a report showing:
- Initial wallet balance
- Number of fees claimed
- Final wallet balance
- Transaction links

### Failure Notifications
The workflow will fail if:
- Wallet balance too low (< 0.01 SOL)
- Private key is invalid
- RPC endpoint is unavailable

## Troubleshooting

### Workflow Not Running
- Check schedule is enabled in Actions settings
- Verify all required secrets are set
- Ensure main branch protection allows workflows

### Withdrawal Failing
```bash
# Check these common issues:
1. Low SOL balance for gas fees
2. Invalid private key format
3. RPC rate limiting
4. No fees available to claim
```

### Testing Locally
```bash
# Restore scripts from base64
echo "$SCRIPTS_PACKAGE_JSON_BASE64" | base64 -d > package.json
echo "$SCRIPTS_WITHDRAW_FEES_BASE64" | base64 -d > withdraw-fees.ts

# Install and test
npm install
SOLANA_PRIVATE_KEY="your-key" npx ts-node withdraw-fees.ts
```

## Cost Considerations

### GitHub Actions
- **Free tier**: 2,000 minutes/month for private repos
- **This workflow**: ~2-3 minutes per run
- **Weekly runs**: ~12 minutes/month
- **Cost**: Free (well within limits)

### Solana Network
- **Transaction fees**: ~0.001 SOL per withdrawal
- **Weekly cost**: ~0.005 SOL/month
- **Recommendation**: Keep 0.1 SOL in wallet

## Best Practices

### DO ✅
- Use a dedicated wallet for fee collection
- Keep minimal SOL balance (0.1-0.5 SOL)
- Monitor weekly execution logs
- Rotate private keys quarterly
- Test with dry run first

### DON'T ❌
- Store private keys in code
- Run on untrusted branches
- Share workflow logs publicly
- Modify without testing
- Use main wallet private key

## Advanced Configuration

### Custom RPC Endpoints
```yaml
# Add to GitHub Secrets:
SOLANA_RPC_URL: https://your-private-rpc.com
```

### Different Schedule
```yaml
# Edit .github/workflows/withdraw-fees.yml
on:
  schedule:
    - cron: '0 2 * * 1,4'  # Monday and Thursday
```

### Email Notifications
```yaml
# Add to workflow:
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    username: ${{ secrets.EMAIL }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Fee Withdrawal Failed
    body: Check workflow logs
```

## Recovery Procedures

### If Secrets Are Lost
1. Regenerate from local backup base64 files
2. Or recreate scripts and re-encode
3. Update GitHub Secrets

### If Wallet Is Compromised
1. Immediately disable the workflow
2. Transfer any remaining funds
3. Generate new wallet
4. Update SOLANA_PRIVATE_KEY secret
5. Re-enable workflow

### If Fees Aren't Claimed
1. Check workflow execution history
2. Verify fees are actually available
3. Run manual check workflow
4. Test with local script

## Summary

The automated system:
- ✅ Runs weekly without manual intervention
- ✅ Keeps private keys secure in GitHub Secrets
- ✅ Cleans up sensitive data after execution
- ✅ Provides detailed logs and reports
- ✅ Costs nothing to operate
- ✅ Can be manually triggered anytime

This approach is much more secure than storing the scripts folder in the repository!