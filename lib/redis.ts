import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis clients with error handling
function createRedisClient() {
  const client = new Redis(redisUrl, {
    retryStrategy: (times) => {
      // Don't retry indefinitely during build
      if (times > 3) return null;
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  client.on('error', (err) => {
    // Silent fail during build or if Redis is unavailable
    if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
      // Expected during build without Redis
      return;
    }
    console.error('Redis error:', err.message);
  });

  return client;
}

export const redis = createRedisClient();
export const pubClient = createRedisClient();
export const subClient = createRedisClient();
