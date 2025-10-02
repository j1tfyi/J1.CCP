#!/bin/bash

# CDP Session Token Setup Script
# Sets up proper CDP session token generation for J1TFYI CCP

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   CDP Session Token Setup for J1TFYI CCP                  ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install node-fetch@3.3.2 jsonwebtoken dotenv --save

echo -e "\n${BLUE}🔍 Checking CDP credentials...${NC}"

# Check for CDP credentials
if [ -f "cdp_api_key.json" ]; then
    echo -e "${GREEN}✅ Found cdp_api_key.json${NC}"
else
    echo -e "${YELLOW}⚠️  cdp_api_key.json not found${NC}"
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Found .env file${NC}"
    
    # Check for CDP variables
    if grep -q "CDP_API_KEY" .env; then
        echo -e "${GREEN}✅ CDP_API_KEY configured${NC}"
    else
        echo -e "${YELLOW}⚠️  CDP_API_KEY not found in .env${NC}"
    fi
    
    if grep -q "CDP_API_SECRET" .env; then
        echo -e "${GREEN}✅ CDP_API_SECRET configured${NC}"
    else
        echo -e "${YELLOW}⚠️  CDP_API_SECRET not found in .env${NC}"
    fi
    
    if grep -q "VITE_CDP_PROJECT_ID" .env; then
        echo -e "${GREEN}✅ VITE_CDP_PROJECT_ID configured${NC}"
    else
        echo -e "${YELLOW}⚠️  VITE_CDP_PROJECT_ID not found in .env${NC}"
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env 2>/dev/null || echo "No .env.example found"
fi

echo -e "\n${BLUE}🧪 Running CDP configuration test...${NC}"
node test-cdp-session.mjs

echo -e "\n${GREEN}✨ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure your CDP credentials are properly configured in .env or cdp_api_key.json"
echo "2. Start the CDP session server: ${YELLOW}npm run cdp-server${NC}"
echo "3. In another terminal, start the development server: ${YELLOW}npm run dev${NC}"
echo "4. Or run both together: ${YELLOW}npm run dev:full${NC}"
echo ""
echo "To test CDP session generation:"
echo "  ${YELLOW}npm run test-cdp${NC}"
echo ""
echo "CDP Session API endpoints will be available at:"
echo "  • POST http://localhost:3001/api/session - Generate session token"
echo "  • GET  http://localhost:3001/api/health - Health check"
echo "  • GET  http://localhost:3001/api/config - Configuration info"
echo "  • GET  http://localhost:3001/api/widget-config - Widget configuration"
