#!/bin/bash

# SSL Setup Script for KashiBnB
# Run this after setting up Nginx configuration

echo "🔒 Setting up SSL certificate..."

# Enable the site
ln -sf /etc/nginx/sites-available/kashibnb /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Obtain SSL certificate
certbot --nginx -d kashibnb.com -d www.kashibnb.com --non-interactive --agree-tos --email your-email@example.com

# Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "✅ SSL setup completed!"
echo "🔐 Your site is now secured with HTTPS" 