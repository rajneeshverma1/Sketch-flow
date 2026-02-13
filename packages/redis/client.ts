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

// Use REDIS_DB_URL if available (cloud Redis), otherwise fall back to local config
const redisConfig = REDIS_URL 
    ? REDIS_URL 
    : {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
    };

export const redisPublisher = new Redis(redisConfig);
export const redisConsumer = new Redis(redisConfig);

// Handle connection errors gracefully
redisPublisher.on('error', (err) => {
    console.warn('⚠️  Redis Publisher connection error (app will continue):', err.message);
});

redisConsumer.on('error', (err) => {
    console.warn('⚠️  Redis Consumer connection error (app will continue):', err.message);
});

redisPublisher.on('connect', () => {
    console.log('✅ Redis Publisher connected successfully');
});

redisConsumer.on('connect', () => {
    console.log('✅ Redis Consumer connected successfully');
});

