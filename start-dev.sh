#!/bin/bash
# Development startup script for j1tfyi-ccp

# Load NVM and use correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Automatically use Node version from .nvmrc
nvm use

# Start development server
echo "Starting development server..."
npm run dev