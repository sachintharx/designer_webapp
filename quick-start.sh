#!/bin/bash
# Quick start script - Run this in your EC2 terminal after uploading the project

echo "🚀 Quick Start for EC2..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd server && npm install && cd ..
cd client && npm install && cd ..

# Build client
echo "🏗️  Building client..."
cd client && npm run build && cd ..

# Create logs directory
mkdir -p logs

# Start with PM2
echo "▶️  Starting applications..."
pm2 start ecosystem.config.cjs
pm2 save
pm2 list

echo ""
echo "✅ Done! Your apps are running."
echo "🌐 API: http://51.21.200.224:5000/api/health"
echo "🌐 Client: http://51.21.200.224:5173"
echo ""
echo "📝 Commands:"
echo "  pm2 logs       - View logs"
echo "  pm2 restart all - Restart apps"
