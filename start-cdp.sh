#!/bin/bash

# CDP Session Token Quick Start Script
# Automatically sets up and starts the CDP session server

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          CDP Session Token - Quick Start                   ║"
echo "║                 J1TFYI CCP Project                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to find Node.js
find_node() {
    if command_exists node; then
        echo "node"
    elif command_exists nodejs; then
        echo "nodejs"
    elif [ -f "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        nvm use 20 2>/dev/null || nvm use default 2>/dev/null
        if command_exists node; then
            echo "node"
        fi
    elif [ -f "/usr/local/bin/node" ]; then
        echo "/usr/local/bin/node"
    elif [ -f "/opt/homebrew/bin/node" ]; then
        echo "/opt/homebrew/bin/node"
    else
        echo ""
    fi
}

# Function to find npm
find_npm() {
    if command_exists npm; then
        echo "npm"
    elif [ -f "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        nvm use 20 2>/dev/null || nvm use default 2>/dev/null
        if command_exists npm; then
            echo "npm"
        fi
    elif [ -f "/usr/local/bin/npm" ]; then
        echo "/usr/local/bin/npm"
    elif [ -f "/opt/homebrew/bin/npm" ]; then
        echo "/opt/homebrew/bin/npm"
    else
        echo ""
    fi
}

# Check for Node.js
echo -e "${CYAN}Checking Node.js environment...${NC}"
NODE_CMD=$(find_node)
NPM_CMD=$(find_npm)

if [ -z "$NODE_CMD" ]; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo ""
    echo "Please install Node.js first:"
    echo "  macOS: brew install node"
    echo "  Ubuntu: sudo apt install nodejs npm"
    echo "  Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $NODE_CMD${NC}"
$NODE_CMD --version

# Check for npm
if [ -z "$NPM_CMD" ]; then
    echo -e "${RED}❌ npm not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $NPM_CMD${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found!${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    $NPM_CMD install
fi

# Check for CDP configuration
echo ""
echo -e "${CYAN}Checking CDP configuration...${NC}"

CONFIG_FOUND=false

# Check for .env file
if [ -f ".env" ]; then
    if grep -q "CDP_API_KEY" .env && grep -q "CDP_API_SECRET" .env; then
        echo -e "${GREEN}✅ .env file configured${NC}"
        CONFIG_FOUND=true
    fi
fi

# Check for cdp_api_key.json
if [ -f "cdp_api_key.json" ] || [ -f "cdp_api_key_fixed.json" ]; then
    echo -e "${GREEN}✅ CDP key file found${NC}"
    CONFIG_FOUND=true
fi

if [ "$CONFIG_FOUND" = false ]; then
    echo -e "${YELLOW}⚠️  No CDP configuration found${NC}"
    echo ""
    echo "Setting up CDP configuration..."
    
    # Create example .env if it doesn't exist
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env and add your CDP credentials${NC}"
        exit 1
    fi
fi

# Run setup to validate configuration
echo ""
echo -e "${CYAN}Running CDP setup validation...${NC}"
$NODE_CMD setup-cdp-fixed.mjs

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ CDP setup validation failed${NC}"
    echo "Please fix the configuration issues above and try again"
    exit 1
fi

# Start the CDP server
echo ""
echo -e "${CYAN}Starting CDP session server...${NC}"
echo "Server will run on port ${CDP_SESSION_PORT:-3001}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the server
exec $NODE_CMD cdp-session-server-fixed.mjs
