# KashiBnB VPS Deployment Guide

This guide will help you deploy your KashiBnB project to a VPS hosting with domain `kashibnb.com`.

## Prerequisites

- VPS with Ubuntu 20.04+ (recommended: 2GB RAM, 1 CPU)
- Domain `kashibnb.com` pointing to your VPS IP
- SSH access to your VPS
- Root or sudo privileges

## Step-by-Step Deployment

### 1. Connect to Your VPS
```bash
ssh root@your-vps-ip
```

### 2. Run Server Setup
```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/VishalSingh1431/Kashi-bnb.com/main/deployment-setup.sh
chmod +x deployment-setup.sh
./deployment-setup.sh
```

### 3. Set Up Database
```bash
# Run database setup
wget https://raw.githubusercontent.com/VishalSingh1431/Kashi-bnb.com/main/database-setup.sh
chmod +x database-setup.sh
./database-setup.sh
```

### 4. Configure Environment Variables
```bash
cd /var/www/kashibnb/backend
cp env-example.txt .env
nano .env
```

**Update the following in `.env`:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string
- `EMAIL_USER` & `EMAIL_PASS`: Your Gmail credentials
- `IMG_K_PUBK`, `IMG_K_PRIK`, `IMG_K_URL`: Your ImageKit credentials
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Your Razorpay credentials

### 5. Configure Nginx
```bash
# Copy Nginx configuration
cp nginx-config.conf /etc/nginx/sites-available/kashibnb

# Enable the site
ln -sf /etc/nginx/sites-available/kashibnb /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### 6. Set Up SSL Certificate
```bash
# Update the email in ssl-setup.sh
nano ssl-setup.sh

# Run SSL setup
chmod +x ssl-setup.sh
./ssl-setup.sh
```

### 7. Deploy the Application
```bash
# Run deployment script
wget https://raw.githubusercontent.com/VishalSingh1431/Kashi-bnb.com/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### 8. Verify Deployment
```bash
# Check if services are running
pm2 status
systemctl status nginx
systemctl status postgresql

# Check application logs
pm2 logs kashibnb-backend
```

## Post-Deployment Tasks

### 1. Set Up Automatic Updates
```bash
# Create update script
cat > /var/www/kashibnb/update.sh << 'EOF'
#!/bin/bash
cd /var/www/kashibnb
git pull origin main
cd backend && npm install && npx prisma migrate deploy
cd ../frontend && npm install && npm run build
pm2 restart kashibnb-backend
EOF

chmod +x /var/www/kashibnb/update.sh
```

### 2. Set Up Monitoring
```bash
# Install monitoring tools
npm install -g pm2-logrotate

# Configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Backup Strategy
```bash
# Create backup script
cat > /var/www/kashibnb/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/kashibnb"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump kashibnb > $BACKUP_DIR/database_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/kashibnb

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /var/www/kashibnb/backup.sh

# Add to crontab (daily backup at 2 AM)
echo "0 2 * * * /var/www/kashibnb/backup.sh" | crontab -
```

## Troubleshooting

### Common Issues

1. **Port 6000 not accessible**
   ```bash
   # Check if backend is running
   pm2 status
   pm2 logs kashibnb-backend
   ```

2. **Database connection issues**
   ```bash
   # Test database connection
   sudo -u postgres psql -d kashibnb -c "SELECT 1;"
   ```

3. **Nginx configuration errors**
   ```bash
   # Test Nginx configuration
   nginx -t
   # Check Nginx logs
   tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues**
   ```bash
   # Check SSL certificate
   certbot certificates
   # Renew manually if needed
   certbot renew
   ```

### Useful Commands

```bash
# View application logs
pm2 logs kashibnb-backend

# Restart application
pm2 restart kashibnb-backend

# Check Nginx status
systemctl status nginx

# Check database status
systemctl status postgresql

# View real-time logs
tail -f /var/log/nginx/access.log
```

## Security Considerations

1. **Firewall Setup**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

2. **Regular Updates**
   ```bash
   # Update system packages
   apt update && apt upgrade -y
   ```

3. **Monitor Logs**
   ```bash
   # Check for suspicious activity
   tail -f /var/log/auth.log
   ```

## Performance Optimization

1. **Enable Nginx caching**
2. **Use CDN for static assets**
3. **Implement database connection pooling**
4. **Set up Redis for session storage**

Your KashiBnB application should now be live at `https://kashibnb.com`! 