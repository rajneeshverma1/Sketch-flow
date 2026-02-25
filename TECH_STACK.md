# Technology Stack - Sketch Flow (Excali-Draw)

This document outlines all the technologies, frameworks, libraries, and tools used in the Sketch Flow collaborative whiteboard application.

---

## 🏗️ Architecture & Monorepo Management

- **Monorepo Tool**: Turbo (v2.7.2) - High-performance build system
- **Package Manager**: Bun (v1.3.5) - Fast JavaScript runtime and package manager
- **Workspace Structure**: Multi-app monorepo with shared packages
- **Node Version**: >=18

---

## 🎨 Frontend Stack

### Core Framework & Runtime

- **Framework**: Next.js 16.1.2 (React 19.2.3) with Turbopack
- **UI Library**: React 19.2.3 + React DOM 19.2.3
- **Language**: TypeScript 5.9.2

### UI Components & Styling

- **Styling**: Tailwind CSS v4 with PostCSS
- **Component Library**: Radix UI
  - @radix-ui/react-dialog (v1.1.15)
  - @radix-ui/react-label (v2.1.8)
  - @radix-ui/react-slot (v1.2.4)
  - @radix-ui/react-tooltip (v1.2.8)
- **Icons**: Lucide React (v0.562.0)
- **Utility Classes**:
  - clsx (v2.1.1) - Conditional className utility
  - tailwind-merge (v3.4.0) - Tailwind class merger
  - class-variance-authority (v0.7.1) - CVA for component variants
- **Animations**:
  - Motion (v12.26.2) - Smooth animations
  - tw-animate-css (v1.4.0) - Tailwind animation utilities

### State Management & Data Handling

- **State Management**: Zustand (v5.0.10) - Lightweight state management
- **Form Handling**:
  - React Hook Form (v7.71.1)
  - @hookform/resolvers (v5.2.2)
- **Validation**: Zod (v4.3.5) - TypeScript-first schema validation
- **HTTP Client**: Axios (v1.13.2)
- **Notifications**: React Hot Toast (v2.6.0)

### Routing & Navigation

- **Client-Side Routing**: React Router DOM (v7.12.0)

### Utilities

- **UUID Generation**: uuid (v13.0.0)
- **JWT**: jsonwebtoken (v9.0.3)

---

## 🔧 Backend Stack

### Runtime & Framework

- **Runtime**: Bun (latest) - Fast JavaScript runtime
- **HTTP Server**: Express.js (v5.2.1)
- **WebSocket Server**: ws (v8.18.3)
- **Language**: TypeScript 5+

### Backend Services

1. **HTTP Backend** (Port 3001)
   - RESTful API for user, room, canvas, chat, and shapes
   - Authentication & authorization
2. **WebSocket Backend** (Port 8080)
   - Real-time collaboration
   - Canvas updates and synchronization
3. **Worker Service**
   - Background job processing
   - Queue management

### Middleware & Utilities

- **CORS**: cors (v2.8.5) - Cross-Origin Resource Sharing
- **Cookie Parsing**: cookie-parser (v1.4.7)
- **Password Hashing**: bcryptjs (v3.0.3)
- **Authentication**: JSON Web Tokens (jsonwebtoken v9.0.3)
- **Environment Variables**: dotenv (v17.2.3)

---

## 💾 Database & Data Layer

### Database

- **Database**: PostgreSQL (via Neon.tech - Serverless PostgreSQL)
- **ORM**: Drizzle ORM (v0.45.1)
- **Database Client**: @neondatabase/serverless (v1.0.2)
- **Migration Tool**: Drizzle Kit (v0.31.8)
- **PostgreSQL Client**: pg (v8.16.3)
- **ID Generation**: @paralleldrive/cuid2 (v3.0.6)

### Caching & Real-time

- **Cache/PubSub**: Redis Cloud (Redis v5.10.0, ioredis v5.9.0)
  - Publisher/Subscriber pattern
  - Queue management
  - Real-time event handling

---

## 🛠️ Development Tools

### Code Quality

- **Linter**: ESLint (v9) with Next.js config
- **Code Formatter**: Prettier (v3.7.4)
- **Type Checking**: TypeScript (v5.9.2)

### Build & Deployment

- **Build System**: Turbo (v2.7.2)
- **Bundler**: Turbopack (built into Next.js 16)
- **Package Scripts**:
  - `dev` - Development mode
  - `build` - Production build
  - `start` - Start production server
  - `lint` - Run ESLint
  - `format` - Format code with Prettier
  - `check-types` - TypeScript type checking

---

## 📦 Shared Packages

### Internal Packages (@repo/\*)

1. **@repo/backend-common** - Shared backend utilities
2. **@repo/common** - Shared types and utilities across frontend/backend
3. **@repo/db** - Database schema and client
4. **@repo/redis** - Redis client and queue management
5. **@repo/eslint-config** - Shared ESLint configurations
6. **@repo/typescript-config** - Shared TypeScript configurations
7. **@repo/ui** - Shared UI components

---

## 🌐 Applications

### 1. Excalidraw Frontend (Port 3000)

Main collaborative whiteboard application with:

- Canvas drawing and collaboration
- Real-time updates via WebSocket
- User authentication
- Dashboard and room management
- Shape palette and toolbar

### 2. Web App (Port 3002)

Secondary web application

### 3. HTTP Backend (Port 3001)

RESTful API server handling:

- User authentication and management
- Room/workspace CRUD operations
- Canvas state management
- Chat functionality
- Shape operations

### 4. WebSocket Backend (Port 8080)

Real-time communication server for:

- Live canvas updates
- Collaborative drawing
- User presence
- Real-time notifications

### 5. Worker Service

Background processing for:

- Async task execution
- Queue processing
- Data synchronization

---

## 🔐 Security Features

- **Authentication**: JWT-based authentication
- **Password Security**: bcryptjs for password hashing
- **CORS Protection**: Configured CORS middleware
- **Cookie Security**: Secure cookie handling
- **Type Safety**: Full TypeScript coverage

---

## 🚀 Infrastructure & Hosting

- **Database**: Neon.tech (Serverless PostgreSQL)
- **Cache**: Redis Cloud (Redis Labs)
- **Frontend Hosting**: Deployable to Vercel/any Node.js host
- **API Hosting**: Bun-compatible hosting

---

## 📱 Key Features Supported

✅ Real-time collaborative drawing
✅ WebSocket-based communication
✅ User authentication & authorization
✅ Room/workspace management
✅ Canvas state persistence
✅ Chat functionality
✅ Shape tools and palettes
✅ Responsive UI with Tailwind CSS
✅ Form validation with Zod
✅ Toast notifications
✅ Smooth animations
✅ Type-safe development

---

## 🔄 Real-time Communication Flow

```
Client (Next.js) ↔ WebSocket Server (ws) ↔ Redis (PubSub) ↔ Worker
                                              ↕
Client (Next.js) ↔ HTTP API (Express) ↔ PostgreSQL (Neon)
```

---

## 📊 Project Statistics

- **Total Apps**: 5 (excalidraw-frontend, web, http-backend, ws-backend, worker)
- **Total Packages**: 7 (backend-common, common, db, redis, eslint-config, typescript-config, ui)
- **Ports Used**:
  - 3000 (Frontend)
  - 3001 (HTTP Backend)
  - 3002 (Web)
  - 8080 (WebSocket)
- **Primary Language**: TypeScript
- **Package Manager**: Bun
- **Monorepo Tool**: Turbo

---

_Last Updated: February 25, 2026_
