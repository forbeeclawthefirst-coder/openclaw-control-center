#!/bin/bash
# Start OpenClaw Control Center with public tunnel

cd /data/workspace/openclaw-control-center

echo "🚀 Starting OpenClaw Control Center..."
echo "======================================="
echo ""

# Set environment
export NODE_ENV=development
export PORT=3000
export NEXTAUTH_SECRET="local-dev-secret-$(date +%s)"
export NEXTAUTH_URL="http://localhost:3000"
export AGENT_TOKEN_SECRET="agent-token-$(openssl rand -hex 16)"
export WS_GATEWAY_TOKEN="ws-token-$(openssl rand -hex 16)"

# Start Next.js in background
echo "📦 Starting Next.js on port 3000..."
npm run dev &
NEXTJS_PID=$!

# Wait for server to start
sleep 5

echo ""
echo "🌐 Creating public tunnel..."
echo ""

# Create tunnel using localtunnel
npx localtunnel --port 3000 --subdomain openclaw-control-$(date +%s | tail -c 4) 2>&1 &
TUNNEL_PID=$!

sleep 3

echo ""
echo "✅ Control Center is running!"
echo ""
echo "📝 Local URL: http://localhost:3000"
echo "🌐 Public URL: Will be shown above ^"
echo ""
echo "⚠️  Keep this terminal open. Press Ctrl+C to stop."
echo ""

# Wait for interrupt
trap "kill $NEXTJS_PID $TUNNEL_PID 2>/dev/null; exit" INT
tail -f /dev/null