#!/bin/bash
# Check and fix development environment

echo "🔍 Checking development environment..."

# Check Node version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Loading NVM..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm use
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if vite is installed
if [ ! -d "node_modules/vite" ]; then
    echo "⚠️  Vite not found. Installing dependencies..."
    npm install --include=dev
else
    echo "✅ Vite is installed"
fi

# Check if express is installed (for API server)
if [ ! -d "node_modules/express" ]; then
    echo "⚠️  Express not found. Installing..."
    npm install express cors --save
else
    echo "✅ Express is installed"
fi

echo ""
echo "✨ Environment ready! You can now run:"
echo "   ./start-dev.sh          - Start Vite only"
echo "   ./start-dev-with-api.sh - Start Vite + API server (for Coinbase)"