# Excali-Draw Setup Notes

## ✅ Successfully Running

The project is now running with the following services:

- **Frontend (Next.js)**: http://localhost:3000
- **HTTP Backend (Express)**: http://localhost:3001
- **WebSocket Backend**: ws://localhost:8080

## ⚠️ Redis Configuration Issue

### Current Status

Redis connection is failing with the configured cloud Redis instance. The app continues to run, but features requiring Redis won't work:

- Real-time chat functionality
- Background job processing (worker queue)
- Real-time canvas synchronization

### To Fix Redis Connection

#### Option 1: Use Local Redis (Recommended for Development)

1. Install Redis locally:
   - Windows: `choco install redis` or download from https://redis.io/download
   - Run Redis: `redis-server`
2. Update `.env`:
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   # Comment out or remove REDIS_DB_URL
   # REDIS_DB_URL=...
   ```

#### Option 2: Fix Cloud Redis Connection

The current cloud Redis URL may be invalid or expired:

```
REDIS_DB_URL=redis://default:apkq6GelJbaDnF6Hqj7cnLXMVB3vAMtK@redis-12502.crce182.ap-south-1-1.ec2.cloud.redislabs.com:12502
```

To fix:

1. Verify the Redis instance is active and accessible
2. Check credentials are correct
3. Ensure firewall/security groups allow connections from your IP

#### Option 3: Get New Redis Instance

Get a free Redis instance from:

- https://redis.io/try-free/ (Redis Cloud)
- https://upstash.com/ (Upstash Redis)
- https://railway.app/ (Railway)

Update `.env` with new credentials.

## 🔧 Fixed Issues

1. ✅ Redis port NaN error - Fixed environment variable loading
2. ✅ Added graceful error handling for Redis connection failures
3. ✅ Fixed dotenv path resolution in monorepo structure
4. ✅ All services start successfully despite Redis connection issues

## 🚀 Running the Project

```bash
# Development mode (all services)
bun dev

# Individual services
cd apps/excalidraw-frontend && bun dev
cd apps/http-backend && bun dev
cd apps/ws-backend && bun dev
cd apps/worker && bun dev
```

## 📝 Environment Variables

Ensure all required environment variables are set in the root `.env` file:

```env
# Database
DATABASE_URL=postgresql://...

# JWT Secrets
JWT_SECRET=...
PLAIN_TEXT_SECRET=...

# Redis (choose one approach)
# Option 1: Use URL
REDIS_DB_URL=redis://...

# Option 2: Use individual values
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## 🎯 Next Steps

1. Fix Redis connection for full functionality
2. Test all features (auth, canvas, chat)
3. Run database migrations if needed: `cd packages/db && bun run drizzle-kit push`
