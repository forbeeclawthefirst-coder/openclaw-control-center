/**
 * OpenClaw Agent Connector
 * 
 * This script connects your local OpenClaw agent to the Control Center.
 * Run this from your OpenClaw environment to establish a connection.
 */

const WebSocket = require('ws');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_PATH = '/data/workspace/.clawhub/agent-config.json';
const AGENT_ID = process.env.OPENCLAW_AGENT_ID || `openclaw-${os.hostname()}-${Date.now()}`;
const CONTROL_CENTER_URL = process.env.CONTROL_CENTER_URL;
const AGENT_TOKEN = process.env.AGENT_TOKEN;

// Load or create config
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not load config:', e.message);
  }
  return null;
}

// Save config
function saveConfig(config) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// Get capabilities from available skills
function getCapabilities() {
  const capabilities = [];
  
  // Check for available skills/tools
  try {
    const skillsDir = '/data/workspace/skills';
    if (fs.existsSync(skillsDir)) {
      const skills = fs.readdirSync(skillsDir);
      if (skills.includes('github')) capabilities.push('github');
      if (skills.includes('gog')) capabilities.push('google-workspace');
    }
  } catch (e) {}
  
  // Always available
  capabilities.push('code', 'shell', 'file-ops');
  
  return capabilities;
}

// Connect to Control Center
async function connect() {
  console.log('🔗 OpenClaw Agent Connector');
  console.log('===========================\n');
  
  // Check for required env vars
  if (!CONTROL_CENTER_URL) {
    console.error('❌ CONTROL_CENTER_URL not set');
    console.log('   Set it with: export CONTROL_CENTER_URL=https://your-app.up.railway.app');
    process.exit(1);
  }
  
  if (!AGENT_TOKEN) {
    console.error('❌ AGENT_TOKEN not set');
    console.log('   Get your token from the Control Center dashboard');
    console.log('   Set it with: export AGENT_TOKEN=your-token-here');
    process.exit(1);
  }
  
  // Save config
  const config = {
    controlCenterUrl: CONTROL_CENTER_URL,
    agentId: AGENT_ID,
    capabilities: getCapabilities(),
    platform: os.platform(),
    registeredAt: new Date().toISOString()
  };
  saveConfig(config);
  
  console.log(`📡 Agent ID: ${AGENT_ID}`);
  console.log(`🌐 Control Center: ${CONTROL_CENTER_URL}`);
  console.log(`🛠️  Capabilities: ${config.capabilities.join(', ')}\n`);
  
  // Convert https:// to wss:// for WebSocket
  const wsUrl = CONTROL_CENTER_URL.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');
  
  console.log(`Connecting to ${wsUrl}/api/ws ...\n`);
  
  const ws = new WebSocket(`${wsUrl}/api/ws`, {
    headers: {
      'X-Agent-Token': AGENT_TOKEN,
      'X-Agent-ID': AGENT_ID
    }
  });
  
  ws.on('open', () => {
    console.log('✅ Connected to Control Center!');
    
    // Send initial status
    ws.send(JSON.stringify({
      type: 'agent:status',
      payload: {
        agentId: AGENT_ID,
        status: 'online',
        capabilities: config.capabilities,
        platform: os.platform(),
        version: '1.0.0'
      }
    }));
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 Received:', message.type);
      handleMessage(message, ws);
    } catch (e) {
      console.log('📨 Received:', data.toString());
    }
  });
  
  ws.on('error', (err) => {
    console.error('❌ Connection error:', err.message);
  });
  
  ws.on('close', () => {
    console.log('🔌 Disconnected. Retrying in 5 seconds...');
    setTimeout(connect, 5000);
  });
}

// Handle incoming messages
async function handleMessage(message, ws) {
  switch (message.type) {
    case 'task:assign':
      console.log('📝 New task assigned:', message.payload.taskId);
      // Execute task and report back
      break;
      
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;
      
    default:
      console.log('ℹ️  Unknown message type:', message.type);
  }
}

// Run if called directly
if (require.main === module) {
  connect().catch(err => {
    console.error('❌ Failed to connect:', err.message);
    process.exit(1);
  });
}

module.exports = { connect, getCapabilities };