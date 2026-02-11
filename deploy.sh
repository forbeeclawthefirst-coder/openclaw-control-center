#!/bin/bash
set -e

echo "🚀 OpenClaw Control Center Deployment"
echo "======================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "Step 1: Login to Railway"
railway login

echo ""
echo "Step 2: Initialize project"
railway init

echo ""
echo "Step 3: Add PostgreSQL database"
railway add --database postgres

echo ""
echo "Step 4: Add Redis"
railway add --database redis

echo ""
echo "Step 5: Set environment variables"
railway variables set NEXTAUTH_SECRET="$(openssl rand -base64 32)"
railway variables set AGENT_TOKEN_SECRET="$(openssl rand -base64 32)"
railway variables set WS_GATEWAY_TOKEN="$(openssl rand -base64 32)"

echo ""
echo "Step 6: Deploy!"
railway up

echo ""
echo "Step 7: Get your URL"
URL=$(railway domain 2>/dev/null || echo "Check Railway dashboard for URL")
echo "Your app is live at: $URL"
echo ""
echo "To connect agents:"
echo "  ./scripts/agent-connect.sh -u wss://<your-domain>/ws -t <agent-token>"
