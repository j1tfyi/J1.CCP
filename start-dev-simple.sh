#!/bin/bash
# Simple development startup script for J1TFYI CCP

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   J1TFYI CCP Development Server                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

# Load NVM and use correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Automatically use Node version from .nvmrc
nvm use

# Start development server
echo -e "${GREEN}Starting Vite development server...${NC}"
npm run dev