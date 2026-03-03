# 🎨 Sketch Flow

A real-time collaborative whiteboard application built with Next.js, WebSockets, and Bun. Create, share, and collaborate on drawings with team members in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Bun](https://img.shields.io/badge/Bun-v1.3.5-ff69b4)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## ✨ Features

- 🎨 **Real-time Collaboration** - Draw together with multiple users simultaneously
- 🔐 **User Authentication** - Secure JWT-based authentication
- 🏠 **Room Management** - Create and join collaborative rooms
- 💬 **Real-time Chat** - Communicate with team members
- 📱 **Responsive Design** - Works seamlessly across devices
- 🎯 **Shape Tools** - Various drawing tools and shapes
- 💾 **Auto-save** - Automatic canvas state persistence
- ⚡ **Fast Performance** - Built with Bun for optimal speed

## 🏗️ Architecture

This is a Turborepo monorepo with the following structure:

### Apps

- **excalidraw-frontend** - Next.js 16 frontend with Turbopack (Port 3000)
- **http-backend** - Express REST API with Bun (Port 3001)
- **ws-backend** - WebSocket server for real-time communication (Port 8080)
- **worker** - Background job processor for async tasks

### Packages

- **@repo/db** - Drizzle ORM with PostgreSQL schemas
- **@repo/redis** - Redis client configuration for pub/sub
- **@repo/common** - Shared types and utilities
- **@repo/backend-common** - Backend shared code
- **@repo/ui** - Shared React components
- **@repo/eslint-config** - ESLint configurations
- **@repo/typescript-config** - TypeScript configurations

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS, Zustand, Framer Motion
- **Backend:** Bun, Express, WebSocket (ws)
- **Database:** PostgreSQL with Drizzle ORM
- **Cache/Queue:** Redis (ioredis)
- **Auth:** JWT (jsonwebtoken)
- **Monorepo:** Turborepo
- **Package Manager:** Bun

All apps and packages are 100% [TypeScript](https://www.typescriptlang.org/).

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.5+
- [Node.js](https://nodejs.org) v18+
- PostgreSQL database
- Redis instance

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rajneeshverma1/Sketch-flow.git
   cd Sketch-flow
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   JWT_SECRET=your_64_byte_random_string
   PLAIN_TEXT_SECRET=your_64_byte_random_string
   REDIS_DB_URL=redis://username:password@host:port
   ```

4. **Run database migrations:**

   ```bash
   cd packages/db
   bun run push
   cd ../..
   ```

5. **Start development servers:**
   ```bash
   bun run dev
   ```

The application will be available at:

- Frontend: http://localhost:3000
- HTTP Backend: http://localhost:3001
- WebSocket Backend: ws://localhost:8080

## 📦 Available Commands

```bash
# Development
bun run dev          # Start all services in development mode
bun run lint         # Lint all packages
bun run format       # Format code with Prettier

# Production
bun run build        # Build all packages and apps
bun run start        # Start all services in production mode

# Specific apps
cd apps/excalidraw-frontend
bun run dev          # Start only frontend

# Database operations
cd packages/db
bun run push         # Push schema changes to database
bun run studio       # Open Drizzle Studio
bun run generate     # Generate migrations
```

## 🌐 Deployment

We provide comprehensive deployment guides for multiple platforms:

### 📖 Documentation

- **[📚 Full Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete guide covering all deployment options
- **[⚡ Quick Deploy Reference](./QUICK_DEPLOY.md)** - Quick reference for common deployment tasks

### 🔧 Deployment Scripts

**Windows PowerShell:**

```powershell
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

### 🎯 Recommended Platforms

| Platform                                 | Use Case         | Free Tier |
| ---------------------------------------- | ---------------- | --------- |
| [Vercel](https://vercel.com)             | Frontend         | ✅ Yes    |
| [Railway](https://railway.app)           | Backend Services | ✅ Yes    |
| [Neon](https://neon.tech)                | PostgreSQL       | ✅ Yes    |
| [Upstash](https://upstash.com)           | Redis            | ✅ Yes    |
| [DigitalOcean](https://digitalocean.com) | VPS              | ❌ $4/mo  |

## 📁 Project Structure

```
sketch-flow/
├── apps/
│   ├── excalidraw-frontend/    # Next.js frontend
│   │   ├── app/                # Next.js app directory
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   └── store/              # Zustand stores
│   ├── http-backend/           # REST API
│   │   ├── routes/             # API routes
│   │   └── middleware/         # Express middleware
│   ├── ws-backend/             # WebSocket server
│   └── worker/                 # Background jobs
├── packages/
│   ├── db/                     # Database schemas
│   ├── redis/                  # Redis configuration
│   ├── common/                 # Shared utilities
│   ├── backend-common/         # Backend utilities
│   ├── ui/                     # UI components
│   ├── eslint-config/          # ESLint configs
│   └── typescript-config/      # TypeScript configs
├── .env.example                # Environment template
├── deploy.sh                   # Linux deployment script
├── deploy.ps1                  # Windows deployment script
├── DEPLOYMENT_GUIDE.md         # Full deployment guide
├── QUICK_DEPLOY.md             # Quick reference
└── turbo.json                  # Turborepo configuration
```

## 🔐 Environment Variables

| Variable            | Description                   | Required |
| ------------------- | ----------------------------- | -------- |
| `DATABASE_URL`      | PostgreSQL connection string  | ✅       |
| `JWT_SECRET`        | Secret for JWT token signing  | ✅       |
| `PLAIN_TEXT_SECRET` | Additional encryption secret  | ✅       |
| `REDIS_DB_URL`      | Redis connection URL          | ✅       |
| `REDIS_HOST`        | Redis host (if not using URL) | ⚠️       |
| `REDIS_PORT`        | Redis port (if not using URL) | ⚠️       |
| `REDIS_PASSWORD`    | Redis password                | ⚠️       |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Rajneesh Verma**

- GitHub: [@rajneeshverma1](https://github.com/rajneeshverma1)

## 🙏 Acknowledgments

- Built with [Turborepo](https://turborepo.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
