#!/bin/bash

# EC2 Deployment Script for Designer WebApp
# This script automates the deployment process on AWS EC2

set -e

echo "🚀 Starting EC2 Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on EC2
if [ ! -d "/home/ubuntu" ] && [ ! -d "/home/ec2-user" ]; then
    echo -e "${YELLOW}Warning: This doesn't appear to be an EC2 instance${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Node.js if not present
if ! command_exists node; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo -e "${GREEN}✓ Node.js $(node -v) installed${NC}"

# Install PM2 if not present
if ! command_exists pm2; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

echo -e "${GREEN}✓ PM2 installed${NC}"

# Create logs directory
mkdir -p logs

# Install server dependencies
echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
cd server
npm install --production
cd ..

# Install client dependencies
echo -e "${YELLOW}📦 Installing client dependencies...${NC}"
cd client
npm install
echo -e "${YELLOW}🏗️  Building client...${NC}"
npm run build
cd ..

# Setup environment files
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚙️  Creating server .env from .env.production...${NC}"
    cp server/.env.production server/.env
    echo -e "${RED}⚠️  IMPORTANT: Edit server/.env with your production values!${NC}"
fi

# Stop existing PM2 processes
echo -e "${YELLOW}🛑 Stopping existing processes...${NC}"
pm2 stop all || true
pm2 delete all || true

# Start applications with PM2
echo -e "${YELLOW}🚀 Starting applications with PM2...${NC}"
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
echo -e "${YELLOW}⚙️  Configuring PM2 startup...${NC}"
sudo env PATH=$PATH:/usr/bin $(which pm2) startup systemd -u $USER --hp $HOME

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "📊 Application Status:"
pm2 list
echo ""
echo "🌐 Access your application at:"
echo "   API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000/api/health"
echo "   Client: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5173"
echo ""
echo "📝 Useful commands:"
echo "   pm2 logs          - View all logs"
echo "   pm2 logs designer-api   - View API logs"
echo "   pm2 logs designer-client - View client logs"
echo "   pm2 restart all   - Restart all apps"
echo "   pm2 stop all      - Stop all apps"
echo "   pm2 monit         - Monitor apps"
