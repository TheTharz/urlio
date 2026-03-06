import { createClient, RedisClientType } from "redis";
import { env } from "./env.config";
import { logger } from "./logger.config";

const redisClient:RedisClientType = createClient({
  url: env.REDIS_DATABASE_URL,
  password: env.REDIS_DATABASE_PASSWORD,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error({ retries }, 'Redis: Too many retry attempts');
        return new Error('Redis connection failed after 10 retries');
      }
      // Exponential backoff: 100ms, 200ms, 400ms, etc.
      return Math.min(retries * 100, 3000);
    }
  }
});

// Connecting to the Redis server
async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
    logger.info('Successfully connected to Redis');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to Redis');
    // Don't crash the app if Redis is unavailable
    // The app can still work without cache
  }
}

// Event handlers
redisClient.on('error', (err: Error) => {
  logger.error({ err }, 'Redis connection error');
});

redisClient.on('ready', () => {
  logger.info('Redis client is ready');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client is reconnecting');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Closing Redis connection');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Closing Redis connection');
  await redisClient.quit();
  process.exit(0);
});

connectRedis().catch((err) => logger.error({ err }, 'Redis connection failed'));

export default redisClient;