#!/bin/bash

# Nginx CORS Setup Script for KashiBnB
# This script sets up nginx configurations for both main site and backend API

echo "🔧 Setting up Nginx configurations for CORS..."

# Copy main site configuration
echo "📝 Setting up main site configuration..."
sudo cp nginx-config.conf /etc/nginx/sites-available/kashibnb

# Copy backend configuration
echo "📝 Setting up backend configuration..."
sudo cp backend-nginx-config.conf /etc/nginx/sites-available/backend-kashibnb

# Remove any existing default site
echo "🗑️  Removing default nginx site..."
sudo rm -f /etc/nginx/sites-enabled/default

# Enable the sites
echo "🔗 Enabling nginx sites..."
sudo ln -sf /etc/nginx/sites-available/kashibnb /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/backend-kashibnb /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo "✅ Nginx CORS setup completed!"
    echo "🌐 Main site: https://kashibnb.com"
    echo "🔧 Backend API: https://backend.kashibnb.com"
else
    echo "❌ Nginx configuration test failed"
    echo "Please check the configuration files and try again"
    exit 1
fi 