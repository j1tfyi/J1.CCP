#!/bin/bash
# Development startup script with API server for session tokens

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   J1TFYI CCP Development Environment               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

# Load NVM and use correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo -e "${YELLOW}→ Setting Node.js version...${NC}"
nvm use

# Kill any existing processes on our ports
echo -e "${YELLOW}→ Cleaning up existing processes...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start the API server in background
echo -e "${GREEN}→ Starting Session Token API server on port 3001...${NC}"
node dev-api-server.mjs &
API_PID=$!

# Wait for API server to start
sleep 2

# Update the Coinbase component to use the correct API URL
echo -e "${YELLOW}→ Configuring Coinbase Onramp/Offramp...${NC}"

# Start Vite dev server
echo -e "${GREEN}→ Starting Vite development server...${NC}"
npm run dev &
VITE_PID=$!

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Development servers are running!                 ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║   Main App: http://localhost:5173                  ║${NC}"
echo -e "${GREEN}║   Session API: http://localhost:3001/api/session   ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║   Press Ctrl+C to stop all servers                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"

# Function to handle cleanup
cleanup() {
    echo -e "\n${YELLOW}→ Shutting down servers...${NC}"
    kill $API_PID 2>/dev/null || true
    kill $VITE_PID 2>/dev/null || true
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup INT

# Wait for processes
wait