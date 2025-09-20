#!/bin/bash

# Script to restore scripts folder from base64 encoded GitHub secrets
# Use this in CI/CD or locally when you need to restore the scripts folder

set -euo pipefail

echo "=== Restoring Scripts Folder from Base64 ==="

# Ensure scripts directory exists
mkdir -p scripts

# Function to restore from base64
restore_from_base64() {
    local base64_content="$1"
    local target_file="$2"

    if [ -z "${base64_content:-}" ]; then
        echo "⚠️  Warning: No base64 content for $target_file"
        return 1
    fi

    printf '%s' "$base64_content" | base64 -d > "$target_file"
    echo "✅ Restored: $target_file"
}

# Restore scripts files (these would come from GitHub secrets in CI/CD)
restore_from_base64 "${SCRIPTS_WITHDRAW_FEES_BASE64:-}" "scripts/withdraw-solana-fees.ts"
restore_from_base64 "${SCRIPTS_JUPITER_SETUP_BASE64:-}" "scripts/jupiter-referral-setup.ts"
restore_from_base64 "${SCRIPTS_PACKAGE_JSON_BASE64:-}" "scripts/package.json"
restore_from_base64 "${SCRIPTS_README_BASE64:-}" "scripts/README.md"
restore_from_base64 "${SCRIPTS_ENV_EXAMPLE_BASE64:-}" "scripts/.env.example"

echo ""
echo "=== Scripts Folder Restoration Complete ==="
echo "Don't forget to:"
echo "1. Create scripts/.env with your actual private key"
echo "2. Run 'cd scripts && npm install' to install dependencies"
echo "3. Never commit the scripts folder or .env file to git"