#!/bin/bash

# KashiBnB Deployment Script
# Run this after setting up the server and database

echo "🚀 Starting KashiBnB deployment..."

cd /var/www/kashibnb

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Backend Setup
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚠️  Please create .env file with your configuration"
    echo "Copy from env-example.txt and update with your values"
    exit 1
fi

# Frontend Setup
echo "🎨 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Build the application
echo "🏗️  Building frontend..."
npm run build

# PM2 Process Management
echo "⚡ Setting up PM2 processes..."

# Stop existing processes
pm2 stop kashibnb-backend 2>/dev/null || true
pm2 delete kashibnb-backend 2>/dev/null || true

# Start backend with PM2
cd ../backend
pm2 start index.js --name "kashibnb-backend" --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo "✅ Deployment completed!"
echo "🌐 Your application should be running at https://kashibnb.com" 