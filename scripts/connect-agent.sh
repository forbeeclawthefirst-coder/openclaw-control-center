#!/bin/bash
# Connect your OpenClaw agent to the Control Center

set -e

echo "🔗 OpenClaw Agent Connector"
echo "============================"
echo ""

# Check if running in OpenClaw workspace
if [ ! -f "/data/workspace/AGENTS.md" ]; then
    echo "❌ Not in OpenClaw workspace. Run this from your OpenClaw environment."
    exit 1
fi

# Get Control Center URL from user
read -p "Enter your Control Center URL (e.g., https://openclaw-control-center.up.railway.app): " CONTROL_CENTER_URL

if [ -z "$CONTROL_CENTER_URL" ]; then
    echo "❌ URL is required"
    exit 1
fi

# Remove trailing slash
CONTROL_CENTER_URL="${CONTROL_CENTER_URL%/}"

echo ""
echo "📡 Registering agent with Control Center..."

# Generate unique agent ID
AGENT_ID="openclaw-$(hostname)-$(date +%s)"

echo "   Agent ID: $AGENT_ID"

# Create agent config
cat > /data/workspace/.clawhub/agent-config.json << EOF
{
  "controlCenterUrl": "$CONTROL_CENTER_URL",
  "agentId": "$AGENT_ID",
  "capabilities": ["code", "shell", "browse", "github"],
  "platform": "linux",
  "registeredAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo ""
echo "✅ Agent configuration saved!"
echo ""
echo "📋 Next steps:"
echo "   1. Go to your Control Center: $CONTROL_CENTER_URL"
echo "   2. Create an agent with ID: $AGENT_ID"
echo "   3. Copy the agent token"
echo "   4. Add it to your environment: export AGENT_TOKEN=your-token-here"
echo ""
echo "🌐 WebSocket Gateway will be available at:"
echo "   $CONTROL_CENTER_URL/api/ws"
echo ""
echo "📖 For automatic agent connector, run:"
echo "   node /data/workspace/openclaw-control-center/scripts/agent-connector.js"