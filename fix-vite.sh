#!/bin/bash

echo "🔧 Fixing Vite Installation Issue..."
echo ""

# Use nvm
source ~/.nvm/nvm.sh
nvm use 20

# Navigate to project directory
cd "/Users/elgringo/Projects/J1TFYI Bridge Gate Dent/new/j1tfyi-ccp"

echo "📦 Cleaning up old installations..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf .vite-temp
rm -rf dist

echo "📥 Installing dependencies..."
npm install

echo "📥 Installing Vite explicitly..."
npm install vite@latest --save-dev

echo "✅ Installation complete!"
echo ""
echo "🚀 Starting development server..."
npm run dev
