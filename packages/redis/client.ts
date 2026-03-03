import Redis from "ioredis";

// Environment variables should be loaded from the root .env by the apps
// This is a shared package, so we rely on the consuming apps to load env vars

const REDIS_URL = process.env.REDIS_DB_URL;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

console.log("🔧 Redis Configuration:", {
    hasUrl: !!REDIS_URL,
    host: REDIS_URL ? '[from URL]' : REDIS_HOST,
    port: REDIS_URL ? '[from URL]' : REDIS_PORT,
});

// Common options for Redis connection
const redisOptions = {
    lazyConnect: true,
    retryStrategy: (times: number) => {
        if (times > 10) {
            console.warn('⚠️  Redis connection failed after 10 retries, giving up');
            return null; // Stop retrying
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    showFriendlyErrorStack: true,
};

// Use REDIS_DB_URL if available (cloud Redis), otherwise fall back to local config
export const redisPublisher = REDIS_URL 
    ? new Redis(REDIS_URL, redisOptions)
    : new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        ...redisOptions,
    });

export const redisConsumer = REDIS_URL 
    ? new Redis(REDIS_URL, redisOptions)
    : new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        ...redisOptions,
    });

// Handle connection errors gracefully
redisPublisher.on('error', (err) => {
    console.warn('⚠️  Redis Publisher error:', err.message);
});

redisConsumer.on('error', (err) => {
    console.warn('⚠️  Redis Consumer error:', err.message);
});

redisPublisher.on('connect', () => {
    console.log('✅ Redis Publisher connected successfully');
});

redisConsumer.on('connect', () => {
    console.log('✅ Redis Consumer connected successfully');
});

