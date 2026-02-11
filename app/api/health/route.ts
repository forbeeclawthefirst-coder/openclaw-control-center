import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis
    await redis.ping();
    
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: String(error) },
      { status: 503 }
    );
  }
}
