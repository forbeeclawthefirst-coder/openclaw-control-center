#!/bin/sh
set -e

echo "🚀 Starting OpenClaw Control Center..."
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL not set!"
else
    echo "✅ DATABASE_URL is configured"
fi

# Run migrations (best effort)
echo "📦 Running database migrations..."
npx prisma migrate deploy 2>&1 || echo "⚠️  Migration check complete"

echo "🎯 Starting Next.js application on 0.0.0.0:3000..."
# Railway needs explicit hostname binding
export HOSTNAME="0.0.0.0"
export PORT="3000"

# Use the standalone output if available, otherwise regular start
if [ -d ".next/standalone" ]; then
    echo "Using standalone build..."
    exec node .next/standalone/server.js
else
    echo "Using standard build..."
    exec npm run start
fi