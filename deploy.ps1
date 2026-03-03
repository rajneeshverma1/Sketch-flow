# Sketch Flow Deployment Script for Windows PowerShell
# Run with: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "🚀 Sketch Flow Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "bun")) {
    Write-Host "❌ Bun is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   Visit: https://bun.sh/docs/installation" -ForegroundColor White
    exit 1
}
Write-Host "✓ Bun is installed" -ForegroundColor Green

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js is installed" -ForegroundColor Green

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor White
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your actual values before continuing" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ .env file exists" -ForegroundColor Green

Write-Host ""
Write-Host "Select deployment target:" -ForegroundColor Cyan
Write-Host "1) Production Build (Local)" -ForegroundColor White
Write-Host "2) Run Database Migrations" -ForegroundColor White
Write-Host "3) Docker Deployment" -ForegroundColor White
Write-Host "4) Generate Environment Secrets" -ForegroundColor White
Write-Host "5) Install Dependencies" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Building for production..." -ForegroundColor Yellow
        
        bun install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
            exit 1
        }
        
        bun run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build failed" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✓ Build completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start the production build:" -ForegroundColor Cyan
        Write-Host "  bun run start" -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        Write-Host "🗄️  Running Database Migrations" -ForegroundColor Yellow
        
        if (-not $env:DATABASE_URL) {
            Write-Host "⚠️  DATABASE_URL not set in environment" -ForegroundColor Yellow
            $dbUrl = Read-Host "Enter your DATABASE_URL"
            $env:DATABASE_URL = $dbUrl
        }
        
        Write-Host "Running migrations..." -ForegroundColor White
        Set-Location "packages\db"
        bun run push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Migrations completed!" -ForegroundColor Green
        } else {
            Write-Host "❌ Migrations failed" -ForegroundColor Red
        }
        
        Set-Location "..\..\"
    }
    
    "3" {
        Write-Host ""
        Write-Host "🐳 Docker Deployment" -ForegroundColor Yellow
        
        if (-not (Test-Command "docker")) {
            Write-Host "❌ Docker is not installed" -ForegroundColor Red
            Write-Host "   Visit: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor White
            exit 1
        }
        
        Write-Host "Building Docker images..." -ForegroundColor White
        docker-compose build
        
        Write-Host "Starting containers..." -ForegroundColor White
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker containers started!" -ForegroundColor Green
            Write-Host ""
            Write-Host "View logs with: docker-compose logs -f" -ForegroundColor Cyan
            Write-Host "Stop containers with: docker-compose down" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Docker deployment failed" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "🔐 Generating Environment Secrets" -ForegroundColor Yellow
        Write-Host ""
        
        # Generate JWT_SECRET
        $bytes = New-Object byte[] 64
        [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
        $jwtSecret = [BitConverter]::ToString($bytes) -replace '-', ''
        
        # Generate PLAIN_TEXT_SECRET
        $bytes2 = New-Object byte[] 64
        [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes2)
        $plainSecret = [BitConverter]::ToString($bytes2) -replace '-', ''
        
        Write-Host "Add these to your .env file:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Green
        Write-Host "PLAIN_TEXT_SECRET=$plainSecret" -ForegroundColor Green
        Write-Host ""
        
        $updateEnv = Read-Host "Do you want to update .env file automatically? (y/n)"
        if ($updateEnv -eq "y" -or $updateEnv -eq "Y") {
            if (Test-Path ".env") {
                $envContent = Get-Content ".env" -Raw
                
                if ($envContent -match "JWT_SECRET=your_jwt_secret_here") {
                    $envContent = $envContent -replace "JWT_SECRET=.*", "JWT_SECRET=$jwtSecret"
                } else {
                    $envContent += "`nJWT_SECRET=$jwtSecret"
                }
                
                if ($envContent -match "PLAIN_TEXT_SECRET=your_plain_text_secret_here") {
                    $envContent = $envContent -replace "PLAIN_TEXT_SECRET=.*", "PLAIN_TEXT_SECRET=$plainSecret"
                } else {
                    $envContent += "`nPLAIN_TEXT_SECRET=$plainSecret"
                }
                
                Set-Content ".env" $envContent
                Write-Host "✓ .env file updated!" -ForegroundColor Green
            }
        }
    }
    
    "5" {
        Write-Host ""
        Write-Host "📦 Installing Dependencies" -ForegroundColor Yellow
        
        Write-Host "Installing root dependencies..." -ForegroundColor White
        bun install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green
