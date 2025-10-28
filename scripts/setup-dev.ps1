#!/bin/bash

# ERP Development Setup Script for Windows (PowerShell compatible)

echo "🚀 Iniciando configuración del ERP..."

# Check if Node.js is installed
if (Get-Command node -ErrorAction SilentlyContinue) {
    echo "✅ Node.js encontrado: $(node --version)"
}
else {
    echo "❌ Node.js no encontrado. Por favor instala Node.js 20+ desde https://nodejs.org"
    exit 1
}

# Check if Docker is installed
if (Get-Command docker -ErrorAction SilentlyContinue) {
    echo "✅ Docker encontrado: $(docker --version)"
}
else {
    echo "❌ Docker no encontrado. Por favor instala Docker Desktop desde https://www.docker.com"
    exit 1
}

# Install backend dependencies
echo "📦 Instalando dependencias del backend..."
Set-Location backend
if (Test-Path package.json) {
    npm install
    if ($LASTEXITCODE -eq 0) {
        echo "✅ Dependencias del backend instaladas"
    }
    else {
        echo "❌ Error instalando dependencias del backend"
        exit 1
    }
}
else {
    echo "❌ package.json no encontrado en backend/"
    exit 1
}

# Setup environment variables
if (-not (Test-Path .env)) {
    echo "📝 Creando archivo .env..."
    Copy-Item .env.example .env
    echo "✅ Archivo .env creado. Por favor revisa y ajusta las variables según sea necesario."
}

# Go back to root
Set-Location ..

# Install frontend dependencies
echo "📦 Instalando dependencias del frontend..."
Set-Location frontend
if (Test-Path package.json) {
    npm install
    if ($LASTEXITCODE -eq 0) {
        echo "✅ Dependencias del frontend instaladas"
    }
    else {
        echo "❌ Error instalando dependencias del frontend"
        exit 1
    }
}
else {
    echo "❌ package.json no encontrado en frontend/"
    exit 1
}

# Go back to root
Set-Location ..

# Start Docker services
echo "🐳 Iniciando servicios con Docker Compose..."
Set-Location infra
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for postgres to be ready
echo "⏳ Esperando que PostgreSQL esté listo..."
Start-Sleep -Seconds 10

# Go back to backend and run migrations
Set-Location ../backend
echo "🗄️ Ejecutando migraciones de Prisma..."
npx prisma migrate dev --name init
npx prisma generate

echo "🌱 Ejecutando seeds de datos iniciales..."
npm run seed

# Go back to root
Set-Location ..

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para iniciar el desarrollo:"
echo "1. Backend:  cd backend && npm run start:dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "URLs disponibles:"
echo "- Frontend:    http://localhost:5173"
echo "- Backend API: http://localhost:3000/api"
echo "- GraphQL:     http://localhost:3000/graphql"
echo "- Swagger:     http://localhost:3000/api/docs"
echo "- Prisma Studio: npx prisma studio (desde backend/)"
echo ""
echo "Para usar Docker completo:"
echo "cd infra && docker-compose -f docker-compose.dev.yml up"