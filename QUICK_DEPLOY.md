# 🚀 Quick Deployment Reference

A quick reference guide for deploying Sketch Flow. For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## ⚡ Quick Start (Choose One)

### Option A: Deploy to Vercel + Railway (Easiest)

**Frontend to Vercel:**

```bash
npm i -g vercel
cd apps/excalidraw-frontend
vercel
```

**Backends to Railway:**

```bash
npm i -g @railway/cli
railway login
railway init
# Deploy each service in apps/http-backend, apps/ws-backend, apps/worker
```

---

### Option B: Deploy to VPS (Ubuntu)

**Using deployment script:**

```bash
chmod +x deploy.sh
./deploy.sh
# Choose option 2 for VPS deployment
```

**Manual steps:**

```bash
# On server
git clone https://github.com/rajneeshverma1/Sketch-flow.git
cd Sketch-flow
bun install
bun run build

# Setup PM2
npm i -g pm2
./deploy.sh  # Choose option 5
```

---

### Option C: Docker Deployment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📋 Pre-Deployment Checklist

- [ ] **Database Setup** (Choose one):
  - [Neon](https://neon.tech) (Free PostgreSQL)
  - [Supabase](https://supabase.com) (Free PostgreSQL)
  - Self-hosted PostgreSQL

- [ ] **Redis Setup** (Choose one):
  - [Upstash](https://upstash.com) (Free Redis)
  - [Redis Cloud](https://redis.com/try-free/)
  - Self-hosted Redis

- [ ] **Environment Variables**:

  ```bash
  cp .env.example .env
  # Edit .env with your values
  ```

- [ ] **Generate Secrets**:

  ```bash
  # On Windows
  powershell -File deploy.ps1  # Choose option 4

  # On Linux/Mac
  ./deploy.sh  # Or use:
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- [ ] **Run Migrations**:
  ```bash
  cd packages/db
  bun run push
  ```

---

## 🌐 Service Ports

| Service           | Port | URL                   |
| ----------------- | ---- | --------------------- |
| Frontend          | 3000 | http://localhost:3000 |
| HTTP Backend      | 3001 | http://localhost:3001 |
| WebSocket Backend | 8080 | ws://localhost:8080   |
| Worker            | N/A  | Background process    |
| PostgreSQL        | 5432 | -                     |
| Redis             | 6379 | -                     |

---

## 🔐 Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/db?sslmode=require

# JWT Secrets (generate with deploy script)
JWT_SECRET=64_byte_random_string
PLAIN_TEXT_SECRET=64_byte_random_string

# Redis (Option 1: URL)
REDIS_DB_URL=redis://username:password@host:port

# Redis (Option 2: Components)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

---

## 🛠️ Deployment Scripts

**Windows PowerShell:**

```powershell
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

**Options:**

1. Production Build - Build project locally
2. VPS Deployment - Deploy to remote server
3. Docker Deployment - Build and start containers
4. Database Migrations - Run DB migrations
5. PM2 Setup - Configure process manager

---

## 📦 Build Commands

```bash
# Install dependencies
bun install

# Build all apps
bun run build

# Start all apps (production)
bun run start

# Start all apps (development)
bun run dev

# Run specific app
cd apps/excalidraw-frontend
bun run start
```

---

## 🔄 Update/Redeploy

### VPS with PM2:

```bash
git pull
bun install
bun run build
pm2 restart all
```

### Docker:

```bash
git pull
docker-compose down
docker-compose up -d --build
```

### Vercel:

```bash
git push  # Auto-deploys on push
# Or manual:
vercel --prod
```

### Railway:

```bash
git push  # Auto-deploys on push
# Or manual:
railway up
```

---

## 🐛 Quick Troubleshooting

**Services won't start:**

```bash
pm2 logs        # Check PM2 logs
pm2 restart all # Restart services
```

**Database connection failed:**

```bash
# Test connection
psql $DATABASE_URL
# Check .env file has correct DATABASE_URL
```

**Redis connection failed:**

```bash
# Test Redis
redis-cli -h host -p 6379 -a password ping
# Should return: PONG
```

**Port already in use:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux
lsof -i :3000
kill -9 <pid>
```

**Clear cache and rebuild:**

```bash
rm -rf node_modules .next apps/*/node_modules apps/*/.next
bun install
bun run build
```

---

## 🗂️ Project Structure

```
sketch-flow/
├── apps/
│   ├── excalidraw-frontend/  # Next.js frontend (Port 3000)
│   ├── http-backend/          # Express REST API (Port 3001)
│   ├── ws-backend/            # WebSocket server (Port 8080)
│   └── worker/                # Background job processor
├── packages/
│   ├── db/                    # Drizzle ORM & schemas
│   ├── redis/                 # Redis client config
│   ├── common/                # Shared types/utils
│   └── backend-common/        # Backend shared code
├── .env.example               # Environment template
├── deploy.sh                  # Linux deployment script
├── deploy.ps1                 # Windows deployment script
├── DEPLOYMENT_GUIDE.md        # Full deployment guide
└── package.json               # Root package.json
```

---

## 🔗 Useful Links

- **Main Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Repository:** [github.com/rajneeshverma1/Sketch-flow](https://github.com/rajneeshverma1/Sketch-flow)
- **Neon (Database):** https://neon.tech
- **Upstash (Redis):** https://upstash.com
- **Vercel:** https://vercel.com
- **Railway:** https://railway.app
- **Render:** https://render.com

---

## 📊 Recommended Hosting

| Service      | Recommended For  | Free Tier             |
| ------------ | ---------------- | --------------------- |
| Vercel       | Frontend         | ✅ Yes                |
| Railway      | Backend Services | ✅ Yes (500 hrs)      |
| Render       | Backend Services | ✅ Yes (750 hrs)      |
| Neon         | PostgreSQL       | ✅ Yes (0.5GB)        |
| Upstash      | Redis            | ✅ Yes (10k cmds/day) |
| DigitalOcean | VPS              | ❌ No ($4/mo)         |

---

## ⚡ Common Tasks

**View logs:**

```bash
pm2 logs          # PM2
docker-compose logs -f  # Docker
railway logs      # Railway
vercel logs       # Vercel
```

**Restart services:**

```bash
pm2 restart all   # PM2
docker-compose restart  # Docker
railway restart   # Railway
```

**Database operations:**

```bash
cd packages/db
bun run push      # Push schema changes
bun run studio    # Open Drizzle Studio
bun run generate  # Generate migrations
```

**Monitor services:**

```bash
pm2 status        # PM2 status
pm2 monit         # PM2 monitoring
docker ps         # Docker containers
```

---

**Need help?** Check the detailed [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or open an issue on GitHub.
