#!/bin/bash

# Vercel Deployment Script for J1.CCP

echo "🚀 J1.CCP Vercel Deployment Script"
echo "================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Check if we're logged in
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
fi

# Link to project if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking to Vercel project..."
    vercel link
fi

# Set environment variables if they don't exist
echo "🔧 Setting up environment variables..."
echo "Note: You'll need to set CDP_API_KEY and CDP_API_SECRET manually in Vercel dashboard"
echo "Visit: https://vercel.com/team_tDOlySEYtPFrKqO3WendFWqj/j1-ccp/settings/environment-variables"

# Deploy based on argument
if [ "$1" == "preview" ]; then
    echo "🚀 Deploying to preview..."
    vercel
elif [ "$1" == "production" ] || [ "$1" == "prod" ]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "Usage: ./deploy.sh [preview|production]"
    echo "  preview    - Deploy to preview URL"
    echo "  production - Deploy to production"
    echo ""
    echo "Defaulting to preview deployment..."
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set CDP_API_KEY and CDP_API_SECRET in Vercel dashboard"
echo "2. Visit your deployment URL"
echo "3. Test Coinbase Onramp/Offramp functionality"