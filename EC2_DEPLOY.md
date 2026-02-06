# Deploy to AWS EC2 - Complete Guide

This guide will help you deploy both the client and server to your AWS EC2 instance.

## Prerequisites

✅ EC2 instance running (Ubuntu/Amazon Linux)  
✅ Security Group configured with ports: 22, 80, 443, 5000, 5173  
✅ SSH key pair for connecting to EC2  
✅ MongoDB Atlas connection string  

## Your EC2 Instance

**Public IP:** `51.21.200.224`

## Quick Deployment (Automated)

### Step 1: Upload Project to EC2

From your local machine:

```bash
# Option A: Using Git (Recommended)
# First, push your code to GitHub
git add .
git commit -m "Prepare for EC2 deployment"
git push

# Then SSH into EC2 and clone
ssh -i "your-key.pem" ubuntu@51.21.200.224
git clone https://github.com/yourusername/designer_webapp.git
cd designer_webapp
```

```bash
# Option B: Using SCP (if no Git)
# From your local machine, upload the entire project
scp -i "your-key.pem" -r "c:/Users/Asus/Documents/My Documents/University - Computer Engineering/Projects/designer_webapp" ubuntu@51.21.200.224:~/
```

### Step 2: Run Deployment Script

SSH into your EC2 instance and run:

```bash
cd designer_webapp
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

That's it! The script will:
- ✅ Install Node.js and PM2
- ✅ Install all dependencies
- ✅ Build the client
- ✅ Start both server and client with PM2
- ✅ Configure auto-restart on reboot

---

## Manual Deployment (Step by Step)

If you prefer to understand each step:

### 1. Connect to EC2

```bash
ssh -i "your-key.pem" ubuntu@51.21.200.224
```

### 2. Install Node.js

```bash
# Update system
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

### 3. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 4. Upload Your Project

```bash
# If using Git
git clone https://github.com/yourusername/designer_webapp.git
cd designer_webapp

# If using SCP, files are already uploaded
cd ~/designer_webapp
```

### 5. Configure Environment Variables

```bash
# Edit server environment
nano server/.env
```

Update these values:
```env
PORT=5000
MONGO_URI=mongodb+srv://starmerals_db_user:fl3XXDo7132TLpd8@users.zo2f5yu.mongodb.net/?appName=users
JWT_SECRET=YOUR_SECURE_RANDOM_STRING_HERE
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
CLIENT_ORIGIN=http://51.21.200.224:5173,http://localhost:5173
NODE_ENV=production
```

⚠️ **Security Note:** Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Install Dependencies

```bash
# Install server dependencies
cd server
npm install --production
cd ..

# Install and build client
cd client
npm install
npm run build
cd ..
```

### 7. Start Applications with PM2

```bash
# Create logs directory
mkdir -p logs

# Start both apps using PM2 config
pm2 start ecosystem.config.cjs

# Check status
pm2 list

# View logs
pm2 logs
```

### 8. Configure PM2 to Start on Boot

```bash
pm2 save
pm2 startup
# Follow the command it outputs (usually needs sudo)
```

---

## Testing Your Deployment

### Test API Server

```bash
# From EC2 instance
curl http://localhost:5000/api/health

# From your local machine
curl http://51.21.200.224:5000/api/health
```

Expected response:
```json
{"status":"ok"}
```

### Test Client

Open in browser:
```
http://51.21.200.224:5173
```

---

## Production Setup with Nginx & SSL

For a production-ready setup with a domain name:

### 1. Point Your Domain to EC2

Add an A record pointing to: `51.21.200.224`

### 2. Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 3. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/designer-webapp
```

Add this configuration:

```nginx
# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Client
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/designer-webapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Install SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### 5. Update Environment Variables

```bash
nano server/.env
```

Update CLIENT_ORIGIN:
```env
CLIENT_ORIGIN=https://yourdomain.com,http://localhost:5173
```

Restart the API:
```bash
pm2 restart designer-api
```

Update client env:
```bash
nano client/.env
```

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Rebuild and restart client:
```bash
cd client
npm run build
pm2 restart designer-client
cd ..
```

---

## Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs (all apps)
pm2 logs

# View logs (specific app)
pm2 logs designer-api
pm2 logs designer-client

# Restart apps
pm2 restart all
pm2 restart designer-api

# Stop apps
pm2 stop all
pm2 stop designer-api

# Delete apps from PM2
pm2 delete all

# Monitor apps (live dashboard)
pm2 monit

# View detailed info
pm2 show designer-api
```

---

## Troubleshooting

### Server not responding

```bash
# Check if process is running
pm2 list

# View logs for errors
pm2 logs designer-api

# Restart the server
pm2 restart designer-api

# Check if port is in use
sudo lsof -i :5000
```

### Client not loading

```bash
# Check if client is running
pm2 logs designer-client

# Rebuild client
cd client
npm run build
pm2 restart designer-client
```

### Connection Refused

1. **Check Security Group** - Ensure ports 5000 and 5173 are open
2. **Check if server is running** - `pm2 list`
3. **Test locally on EC2** - `curl http://localhost:5000/api/health`
4. **Check firewall** - `sudo ufw status` (should be inactive or allow ports)

### MongoDB Connection Issues

```bash
# Test MongoDB connection
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ MongoDB Connected'); process.exit(0); }).catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });"
```

If it fails:
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify MONGO_URI in `.env` is correct
- Check MongoDB Atlas cluster is running

### View PM2 Logs

```bash
# Real-time logs
pm2 logs

# Last 100 lines
pm2 logs --lines 100

# Logs for specific app
pm2 logs designer-api --lines 50
```

---

## Updating Your Application

When you make changes:

```bash
# Pull latest code (if using Git)
git pull

# Update server
cd server
npm install
pm2 restart designer-api
cd ..

# Update client
cd client
npm install
npm run build
pm2 restart designer-client
cd ..
```

---

## Security Checklist

- [ ] Changed default admin password
- [ ] Generated secure JWT_SECRET
- [ ] MongoDB Atlas Network Access configured
- [ ] EC2 Security Group limits SSH to your IP
- [ ] Using HTTPS in production (with SSL)
- [ ] Environment files (.env) are NOT committed to Git
- [ ] Regular system updates: `sudo apt update && sudo apt upgrade`

---

## Cost Optimization

- Use **Nginx** to serve the built client files (static) instead of Vite preview
- Set up **CloudFront** for asset caching
- Use **t3.micro** or **t3.small** instance (free tier eligible)
- Stop instance when not in use for development

---

## Need Help?

Check the logs:
```bash
pm2 logs
```

Restart everything:
```bash
pm2 restart all
```

Still stuck? Check:
1. Security Group rules in AWS Console
2. Server logs: `pm2 logs designer-api`
3. MongoDB Atlas connection
4. Environment variables: `cat server/.env`
