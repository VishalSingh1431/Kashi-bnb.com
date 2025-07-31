#!/bin/bash

# KashiBnB VPS Deployment Script
# Run this on your VPS as root or with sudo privileges

echo "🚀 Starting KashiBnB VPS Deployment..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
apt install -y curl wget git nginx software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Install PM2 for process management
echo "⚡ Installing PM2..."
npm install -g pm2

# Install Certbot for SSL
echo "🔒 Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/kashibnb
cd /var/www/kashibnb

# Clone the repository
echo "📥 Cloning repository..."
git clone https://github.com/VishalSingh1431/Kashi-bnb.com.git .

echo "✅ Server setup completed!"
echo "Next steps:"
echo "1. Configure PostgreSQL database"
echo "2. Set up environment variables"
echo "3. Build and deploy the application" 