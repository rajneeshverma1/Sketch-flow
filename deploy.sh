#!/bin/bash

# Sketch Flow Deployment Script
# This script helps automate the deployment process

set -e  # Exit on error

echo "🚀 Sketch Flow Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists bun; then
    echo -e "${RED}❌ Bun is not installed. Please install it first: curl -fsSL https://bun.sh/install | bash${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Bun is installed${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js is installed${NC}"

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual values before continuing${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .env file exists${NC}"

echo ""
echo "Select deployment target:"
echo "1) Production Build (Local)"
echo "2) VPS Deployment"
echo "3) Docker Deployment"
echo "4) Run Database Migrations"
echo "5) Setup PM2 Process Manager"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building for production..."
        bun install
        bun run build
        echo -e "${GREEN}✓ Build completed successfully!${NC}"
        echo ""
        echo "To start the production build:"
        echo "  bun run start"
        ;;
    
    2)
        echo ""
        echo "🌐 VPS Deployment"
        echo ""
        read -p "Enter your server IP or domain: " server
        read -p "Enter SSH user (default: root): " ssh_user
        ssh_user=${ssh_user:-root}
        
        echo ""
        echo "Deploying to $ssh_user@$server..."
        
        # Build locally
        echo "Building project..."
        bun install
        bun run build
        
        # Create deployment directory on server
        ssh $ssh_user@$server "mkdir -p /var/www/sketch-flow"
        
        # Sync files
        echo "Syncing files..."
        rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
            ./ $ssh_user@$server:/var/www/sketch-flow/
        
        # Install dependencies on server
        echo "Installing dependencies on server..."
        ssh $ssh_user@$server "cd /var/www/sketch-flow && bun install && bun run build"
        
        echo -e "${GREEN}✓ Deployment completed!${NC}"
        echo "Don't forget to:"
        echo "1. Setup PM2 (run option 5)"
        echo "2. Configure Nginx"
        echo "3. Setup SSL certificates"
        ;;
    
    3)
        echo ""
        echo "🐳 Docker Deployment"
        
        if ! command_exists docker; then
            echo -e "${RED}❌ Docker is not installed${NC}"
            exit 1
        fi
        
        echo "Building Docker images..."
        docker-compose build
        
        echo "Starting containers..."
        docker-compose up -d
        
        echo -e "${GREEN}✓ Docker containers started!${NC}"
        echo ""
        echo "View logs with: docker-compose logs -f"
        echo "Stop containers with: docker-compose down"
        ;;
    
    4)
        echo ""
        echo "🗄️  Running Database Migrations"
        
        if [ -z "$DATABASE_URL" ]; then
            echo -e "${YELLOW}⚠️  DATABASE_URL not set in environment${NC}"
            read -p "Enter your DATABASE_URL: " db_url
            export DATABASE_URL=$db_url
        fi
        
        echo "Running migrations..."
        cd packages/db
        bun run push
        
        echo -e "${GREEN}✓ Migrations completed!${NC}"
        ;;
    
    5)
        echo ""
        echo "⚙️  Setting up PM2 Process Manager"
        
        if ! command_exists pm2; then
            echo "Installing PM2..."
            npm install -g pm2
        fi
        
        echo "Creating ecosystem.config.js..."
        cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: './apps/excalidraw-frontend',
      script: 'bun',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'http-backend',
      cwd: './apps/http-backend',
      script: 'bun',
      args: 'run start',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
    {
      name: 'ws-backend',
      cwd: './apps/ws-backend',
      script: 'bun',
      args: 'run start',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
    {
      name: 'worker',
      cwd: './apps/worker',
      script: 'bun',
      args: 'run start',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    }
  ]
};
EOF
        
        echo "Starting PM2 services..."
        pm2 start ecosystem.config.js
        pm2 save
        
        echo -e "${GREEN}✓ PM2 setup completed!${NC}"
        echo ""
        echo "Useful PM2 commands:"
        echo "  pm2 list          - List all processes"
        echo "  pm2 logs          - View logs"
        echo "  pm2 restart all   - Restart all services"
        echo "  pm2 stop all      - Stop all services"
        echo "  pm2 delete all    - Delete all services"
        echo ""
        echo "To enable PM2 startup on boot:"
        echo "  pm2 startup"
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Done!${NC}"
