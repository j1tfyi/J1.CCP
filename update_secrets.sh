#!/bin/bash

# Function to update base64 secret
update_base64_secret() {
    local file_path="$1"
    local base64_file_path="${file_path}.base64"
    local secret_name="$2"
    
    # Create base64 encoded version using openssl for Mac
    openssl base64 -in "$file_path" > "$base64_file_path"
    openssl base64 -in "$file_path" | pbcopy
    
    echo "Updated base64 file: $base64_file_path"
    echo "Base64 encoded content for $secret_name copied to clipboard."
    echo "Please manually update the secret in GitHub repository settings."
    echo "File: $file_path"
}

# Update useBridge.jsx
update_base64_secret "bridge-react-app/src/useBridge.jsx" "BRIDGE_JSX_BASE64"

# Update App.jsx
update_base64_secret "bridge-react-app/src/App.jsx" "APP_JSX_BASE64"

# Update main.ts
update_base64_secret "main.ts" "MAIN_TS_BASE64"

echo "Base64 encoding process complete. Please update secrets in GitHub."