import { createClient } from 'redis';
import { env } from './env.config';

const redisClient = createClient({
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD
});

redisClient.on('error', (err) => {
    console.error('Redis Analytics Consumer Error', err);
});

redisClient.on('connect', () => {
    console.log('Redis connected successfully for analytics consumer');
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error('Failed to connect to Redis', error);
    }
};

export default redisClient;
