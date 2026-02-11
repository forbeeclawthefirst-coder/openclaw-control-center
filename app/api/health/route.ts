import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  // Optional DB check - don't fail if DB isn't ready yet
  try {
    const { prisma } = await import('@/lib/db');
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'connected';
  } catch (e) {
    checks.database = 'disconnected';
  }

  // Optional Redis check
  try {
    const { redis } = await import('@/lib/redis');
    await redis.ping();
    checks.redis = 'connected';
  } catch (e) {
    checks.redis = 'disconnected';
  }

  // Always return 200 for Railway health checks
  // The deployment is "healthy" if the app is running
  return NextResponse.json(checks);
}
