# 🚀 Sketch Flow - Deployment Guide

This guide covers multiple deployment strategies for the Sketch Flow application, a Turborepo monorepo with Next.js frontend and Bun backend services.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Option 1: Deploy to Vercel + Railway](#option-1-deploy-to-vercel--railway-recommended)
  - [Option 2: Deploy to VPS (DigitalOcean/AWS/Linode)](#option-2-deploy-to-vps-digitaloceanawslinode)
  - [Option 3: Docker Deployment](#option-3-docker-deployment)
  - [Option 4: Deploy to Render](#option-4-deploy-to-render)
- [Database Setup](#database-setup)
- [Redis Setup](#redis-setup)
- [Post-Deployment Steps](#post-deployment-steps)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

Your application consists of 4 main services:

| Service                 | Technology             | Port | Purpose                   |
| ----------------------- | ---------------------- | ---- | ------------------------- |
| **excalidraw-frontend** | Next.js 16 (Turbopack) | 3000 | User interface            |
| **http-backend**        | Express + Bun          | 3001 | REST API                  |
| **ws-backend**          | WebSocket (ws) + Bun   | 8080 | Real-time communication   |
| **worker**              | Bun                    | N/A  | Background job processing |

**Dependencies:**

- PostgreSQL database
- Redis (for pub/sub and caching)
- Bun runtime (v1.3.5+)
- Node.js v18+

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository access (rajneeshverma1/Sketch-flow)
- [ ] PostgreSQL database (Neon, Supabase, or self-hosted)
- [ ] Redis instance (Upstash, Redis Cloud, or self-hosted)
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (most platforms provide this)

---

## 🔐 Environment Setup

### 1. Create Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT Secrets (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_64_byte_random_string_here
PLAIN_TEXT_SECRET=your_64_byte_random_string_here

# Redis Configuration
# Option 1: Cloud Redis URL (Recommended for production)
REDIS_DB_URL=redis://username:password@host:port

# Option 2: Individual Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=
REDIS_DB=0
```

### 3. Generate Secure Secrets

Run this command to generate secure JWT secrets:

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('PLAIN_TEXT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌐 Deployment Options

### Option 1: Deploy to Vercel + Railway (Recommended)

This is the easiest option for beginners. Frontend on Vercel, backends on Railway.

#### Step 1: Deploy Database & Redis

**PostgreSQL on Neon (Free):**

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your environment

**Redis on Upstash (Free):**

1. Go to [Upstash](https://upstash.com)
2. Create a Redis database
3. Copy the connection URL
4. Update `REDIS_DB_URL` in your environment

#### Step 2: Run Database Migrations

```bash
cd packages/db
bun run push
```

#### Step 3: Deploy Frontend to Vercel

1. **Connect to Vercel:**

   ```bash
   npm i -g vercel
   cd apps/excalidraw-frontend
   vercel
   ```

2. **Configure in Vercel Dashboard:**
   - Framework Preset: Next.js
   - Build Command: `cd ../.. && bun run build --filter=excalidraw-frontend`
   - Output Directory: `apps/excalidraw-frontend/.next`
   - Install Command: `bun install`
   - Root Directory: `/`

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Step 4: Deploy Backends to Railway

1. **Install Railway CLI:**

   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Create Railway Project:**

   ```bash
   railway init
   ```

3. **Deploy HTTP Backend:**

   ```bash
   cd apps/http-backend
   railway up
   ```

4. **Deploy WebSocket Backend:**

   ```bash
   cd apps/ws-backend
   railway up
   ```

5. **Deploy Worker:**

   ```bash
   cd apps/worker
   railway up
   ```

6. **Add Environment Variables:**
   - Go to Railway Dashboard
   - Add all environment variables to each service
   - Ensure `DATABASE_URL`, `REDIS_DB_URL`, `JWT_SECRET`, and `PLAIN_TEXT_SECRET` are set

7. **Configure Domains:**
   - Railway will provide URLs like `https://your-app.up.railway.app`
   - Update your frontend to use these URLs for API calls

---

### Option 2: Deploy to VPS (DigitalOcean/AWS/Linode)

For more control and cost efficiency at scale.

#### Prerequisites:

- VPS with Ubuntu 22.04+ (2GB RAM minimum)
- Root/sudo access
- Domain name pointed to your VPS

#### Step 1: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install PostgreSQL (optional, if not using cloud DB)
apt install -y postgresql postgresql-contrib

# Install Redis (optional, if not using cloud Redis)
apt install -y redis-server
```

#### Step 2: Clone and Setup Project

```bash
# Create app directory
mkdir -p /var/www/sketch-flow
cd /var/www/sketch-flow

# Clone repository
git clone https://github.com/rajneeshverma1/Sketch-flow.git .

# Install dependencies
bun install

# Copy environment file
cp .env.example .env
nano .env  # Edit with your actual values
```

#### Step 3: Build the Application

```bash
# Build all services
bun run build
```

#### Step 4: Setup PM2 Process Manager

Create `ecosystem.config.js` in the root:

```javascript
module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "./apps/excalidraw-frontend",
      script: "bun",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "http-backend",
      cwd: "./apps/http-backend",
      script: "bun",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "ws-backend",
      cwd: "./apps/ws-backend",
      script: "bun",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "worker",
      cwd: "./apps/worker",
      script: "bun",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

Start all services:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions to enable startup on boot
```

#### Step 5: Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/sketch-flow`:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# HTTP Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# WebSocket Backend
server {
    listen 80;
    server_name ws.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/sketch-flow /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### Step 6: Setup SSL with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com -d ws.yourdomain.com
```

#### Step 7: Setup Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

### Option 3: Docker Deployment

Perfect for containerized environments and Kubernetes.

#### Step 1: Create Dockerfiles

**Frontend Dockerfile** (`apps/excalidraw-frontend/Dockerfile`):

```dockerfile
FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/excalidraw-frontend/package.json ./apps/excalidraw-frontend/
COPY packages ./packages

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
RUN cd apps/excalidraw-frontend && bun run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/excalidraw-frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/excalidraw-frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/excalidraw-frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "run", "server.js"]
```

**Backend Dockerfile** (`apps/http-backend/Dockerfile`):

```dockerfile
FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/http-backend/package.json ./apps/http-backend/
COPY packages ./packages

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/http-backend ./apps/http-backend
COPY packages ./packages

WORKDIR /app/apps/http-backend

EXPOSE 3001

CMD ["bun", "run", "start"]
```

**WebSocket Dockerfile** (`apps/ws-backend/Dockerfile`):

```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
COPY apps/ws-backend/package.json ./apps/ws-backend/
COPY packages ./packages

RUN bun install --frozen-lockfile

COPY apps/ws-backend ./apps/ws-backend
COPY packages ./packages

WORKDIR /app/apps/ws-backend

EXPOSE 8080

CMD ["bun", "run", "start"]
```

**Worker Dockerfile** (`apps/worker/Dockerfile`):

```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
COPY apps/worker/package.json ./apps/worker/
COPY packages ./packages

RUN bun install --frozen-lockfile

COPY apps/worker ./apps/worker
COPY packages ./packages

WORKDIR /app/apps/worker

CMD ["bun", "run", "start"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: sketchflow
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: sketchflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sketchflow"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  frontend:
    build:
      context: .
      dockerfile: apps/excalidraw-frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - PLAIN_TEXT_SECRET=${PLAIN_TEXT_SECRET}
    depends_on:
      - postgres
      - redis
      - http-backend
      - ws-backend

  http-backend:
    build:
      context: .
      dockerfile: apps/http-backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - PLAIN_TEXT_SECRET=${PLAIN_TEXT_SECRET}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  ws-backend:
    build:
      context: .
      dockerfile: apps/ws-backend/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - PLAIN_TEXT_SECRET=${PLAIN_TEXT_SECRET}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  worker:
    build:
      context: .
      dockerfile: apps/worker/Dockerfile
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
```

#### Step 3: Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

### Option 4: Deploy to Render

Render provides a simple deployment experience with good free tier.

#### Step 1: Create render.yaml

```yaml
services:
  # Frontend
  - type: web
    name: sketch-flow-frontend
    env: node
    buildCommand: cd apps/excalidraw-frontend && bun install && bun run build
    startCommand: cd apps/excalidraw-frontend && bun run start
    envVars:
      - key: NODE_VERSION
        value: 18
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: PLAIN_TEXT_SECRET
        sync: false
      - key: REDIS_DB_URL
        sync: false

  # HTTP Backend
  - type: web
    name: sketch-flow-http-backend
    env: node
    buildCommand: cd apps/http-backend && bun install
    startCommand: cd apps/http-backend && bun run start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: PLAIN_TEXT_SECRET
        sync: false
      - key: REDIS_DB_URL
        sync: false

  # WebSocket Backend
  - type: web
    name: sketch-flow-ws-backend
    env: node
    buildCommand: cd apps/ws-backend && bun install
    startCommand: cd apps/ws-backend && bun run start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: PLAIN_TEXT_SECRET
        sync: false
      - key: REDIS_DB_URL
        sync: false

  # Worker
  - type: worker
    name: sketch-flow-worker
    env: node
    buildCommand: cd apps/worker && bun install
    startCommand: cd apps/worker && bun run start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: REDIS_DB_URL
        sync: false

databases:
  - name: sketch-flow-db
    plan: starter
    region: oregon
```

#### Step 2: Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect `render.yaml` and create all services
6. Add environment variables in each service's settings
7. Deploy!

---

## 💾 Database Setup

### Using Neon (Recommended - Free Tier Available)

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Run migrations:
   ```bash
   cd packages/db
   bun run push
   ```

### Using Supabase

1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Use the connection pooler URL for production
5. Run migrations

### Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE sketchflow;
CREATE USER sketchuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sketchflow TO sketchuser;
\q

# Update DATABASE_URL
DATABASE_URL=postgresql://sketchuser:your_password@localhost:5432/sketchflow
```

---

## 🔴 Redis Setup

### Using Upstash (Recommended - Free Tier Available)

1. Sign up at [Upstash](https://upstash.com)
2. Create a Redis database
3. Copy the connection URL
4. Update `REDIS_DB_URL` in your environment

### Using Redis Cloud

1. Sign up at [Redis Cloud](https://redis.com/try-free/)
2. Create a database
3. Copy connection details
4. Update environment variables

### Self-Hosted Redis

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: bind 127.0.0.1
# Set: requirepass your_strong_password

# Restart Redis
sudo systemctl restart redis

# Update environment
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_strong_password
```

---

## ✅ Post-Deployment Steps

### 1. Verify All Services

Check that all services are running:

```bash
# Frontend
curl https://yourdomain.com

# HTTP Backend
curl https://api.yourdomain.com/health

# WebSocket Backend
wscat -c ws://ws.yourdomain.com
```

### 2. Monitor Logs

```bash
# PM2
pm2 logs

# Docker
docker-compose logs -f

# Railway
railway logs

# Vercel
vercel logs
```

### 3. Setup Monitoring

Consider using:

- **Sentry** for error tracking
- **LogRocket** for session replay
- **DataDog** or **New Relic** for APM
- **UptimeRobot** for uptime monitoring

### 4. Setup Backups

**Database Backups:**

```bash
# PostgreSQL backup
pg_dump -U username dbname > backup.sql

# Restore
psql -U username dbname < backup.sql
```

**Automated Backups:**

- Neon provides automatic backups
- Set up cron job for self-hosted databases
- Use cloud provider backup solutions

### 5. Configure CORS

Update CORS settings in `apps/http-backend/index.ts`:

```typescript
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://www.yourdomain.com"],
    credentials: true,
  }),
);
```

### 6. Update Frontend API URLs

Update API URLs in your frontend configuration to point to your production backends.

---

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
pm2 logs
# or
docker-compose logs service-name

# Check environment variables
echo $DATABASE_URL
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check if migrations ran
cd packages/db
bun run studio
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli -h your-host -p 6379 -a your-password ping

# Should return: PONG
```

### WebSocket Connection Issues

- Ensure your reverse proxy supports WebSocket upgrades
- Check firewall rules allow port 8080
- Verify `Upgrade: websocket` headers are passed through

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules .next apps/*/node_modules apps/*/.next
bun install
bun run build
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
# or
netstat -ano | findstr :3000

# Kill process
kill -9 PID
```

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Bun Deployment Guide](https://bun.sh/guides/ecosystem/docker)
- [Turborepo Deployment](https://turbo.build/repo/docs/handbook/deploying-with-docker)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

---

## 🔒 Security Checklist

- [ ] Use strong, randomly generated JWT secrets
- [ ] Enable HTTPS/SSL for all domains
- [ ] Set secure CORS policies
- [ ] Use environment variables for all secrets
- [ ] Enable PostgreSQL SSL mode
- [ ] Use Redis password authentication
- [ ] Keep dependencies updated
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up proper firewall rules
- [ ] Regular security audits

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review service logs
3. Open an issue on GitHub
4. Check your environment variables

---

**Last Updated:** March 3, 2026  
**Repository:** [rajneeshverma1/Sketch-flow](https://github.com/rajneeshverma1/Sketch-flow)
