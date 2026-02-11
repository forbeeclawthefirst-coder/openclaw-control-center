#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 OpenClaw Control Center Deployment');
console.log('=====================================\n');

// Check if logged in
try {
  execSync('npx railway whoami', { stdio: 'ignore' });
  console.log('✅ Already logged in to Railway');
} catch (e) {
  console.log('❌ Not logged in. Getting token from environment...');
  
  const token = process.env.RAILWAY_TOKEN;
  if (!token) {
    console.log('\n⚠️  No RAILWAY_TOKEN found in environment.');
    console.log('\nTo deploy, run one of these:');
    console.log('  1. npx railway login');
    console.log('  2. RAILWAY_TOKEN=your_token npx railway up');
    console.log('\nOr use the Railway dashboard to add this as a new service.');
    process.exit(1);
  }
}

// Create service if needed
console.log('\n📦 Creating/Updating service...');

try {
  // Try to link to existing project
  execSync('npx railway link --project 59aff73f-ecb1-43db-a73e-d0d16c388a85', { stdio: 'inherit' });
} catch (e) {
  console.log('Could not link automatically');
}

// Deploy
console.log('\n🚀 Deploying...');
execSync('npx railway up', { stdio: 'inherit' });

console.log('\n✅ Deployment complete!');
console.log('\nYour control center will be available at:');
console.log(`  https://openclaw-control-center.up.railway.app`);
