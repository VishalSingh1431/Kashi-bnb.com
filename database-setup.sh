#!/bin/bash

# Database Setup Script for KashiBnB
# Run this after the server setup

echo "🗄️ Setting up PostgreSQL database..."

# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE kashibnb;
CREATE USER kashibnb_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE kashibnb TO kashibnb_user;
ALTER USER kashibnb_user CREATEDB;
\q
EOF

echo "✅ Database setup completed!"
echo "Database: kashibnb"
echo "User: kashibnb_user"
echo "Password: your_secure_password_here (change this!)" 