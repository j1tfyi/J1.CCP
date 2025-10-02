#!/bin/bash
# Development script with Vercel Dev server for proper API handling

# Load NVM and use correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use

echo "🚀 Starting Vercel Development Server..."
echo "This will handle both frontend and API routes properly"
echo "Access your app at: http://localhost:3000"
echo ""

# Start Vercel dev server
npx vercel dev --listen 3000