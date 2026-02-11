#!/bin/sh
set -e

echo "🚀 Starting OpenClaw Control Center..."

# Wait for database to be ready (if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
    echo "⏳ Waiting for database..."
    timeout=60
    while ! npx prisma db execute --stdin <<< "SELECT 1;" 2>/dev/null; do
        timeout=$((timeout - 1))
        if [ $timeout -eq 0 ]; then
            echo "⚠️  Database not ready, continuing anyway..."
            break
        fi
        sleep 1
    done
    
    echo "📦 Running migrations..."
    npx prisma migrate deploy || echo "⚠️  Migration failed, continuing..."
fi

echo "🎯 Starting application..."
exec npm run start