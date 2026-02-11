#!/bin/bash
set -e

echo "🚀 OpenClaw Control Center - Railway Auto-Setup"
echo "================================================"

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check login status
echo "🔐 Checking Railway login..."
railway whoami || railway login

# Link to project (create if doesn't exist)
echo "📦 Linking to Railway project..."
railway link --project openclaw-control-center || railway init --name openclaw-control-center

echo ""
echo "🗄️  Creating PostgreSQL service..."
railway add --database postgres --name openclaw-db || echo "⚠️  DB may already exist"

echo ""
echo "💾 Creating Redis service..."
railway add --database redis --name openclaw-redis || echo "⚠️  Redis may already exist"

echo ""
echo "🔑 Generating secrets..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
WS_GATEWAY_TOKEN=$(openssl rand -hex 32)
AGENT_TOKEN_SECRET=$(openssl rand -hex 32)

echo ""
echo "⚙️  Setting environment variables..."

# Set variables
railway variables --set "NODE_ENV=production"
railway variables --set "PORT=3000"
railway variables --set "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
railway variables --set "WS_GATEWAY_TOKEN=$WS_GATEWAY_TOKEN"
railway variables --set "AGENT_TOKEN_SECRET=$AGENT_TOKEN_SECRET"

# Service-specific URLs will be auto-populated by Railway
# But we need to set the variable names for reference
echo ""
echo "🔗 Database and Redis URLs will be auto-configured by Railway"
echo "   (these reference the services we just created)"

echo ""
echo "📤 Deploying application..."
railway up --detach

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔍 Monitoring deployment..."
railway logs --follow

echo ""
echo "🎉 Your OpenClaw Control Center will be available at:"
railway domain || echo "   (Run 'railway domain' after deployment completes)"
echo ""
echo "📝 Default login:"
echo "   Email: admin@openclaw.local"
echo "   Password: admin123"
echo ""
echo "⚠️  Change the default password after first login!"