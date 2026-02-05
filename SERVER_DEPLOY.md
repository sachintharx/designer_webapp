# Deploy Server to Render (Free Tier)

This guide walks you through deploying the Express API to Render.

## Step 1: Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare server for deployment"
git push
```

## Step 2: Sign Up for Render
1. Go to https://render.com
2. Sign up with your GitHub account (easiest)

## Step 3: Create a New Web Service
1. In Render dashboard, click **New +** → **Web Service**
2. Click **Connect** next to your repository
3. Configure the service:

   **Basic Settings:**
   - Name: `designer-webapp-api` (or your choice)
   - Region: Choose closest to you
   - Branch: `main` (or your default branch)
   - Root Directory: `server`
   - Runtime: `Node`
   
   **Build & Deploy:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   
   **Instance Type:**
   - Free (or paid if you prefer)

4. Click **Advanced** and add these Environment Variables:

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | `mongodb+srv://starmerals_db_user:fl3XXDo7132TLpd8@users.zo2f5yu.mongodb.net/?appName=users` |
   | `JWT_SECRET` | (use a strong random string, e.g., `aB9xK2mP7nQ4wR8sT1vY6zC3dE5fG0hJ`) |
   | `ADMIN_EMAIL` | `admin@example.com` (or your choice) |
   | `ADMIN_PASSWORD` | (choose a strong password) |
   | `CLIENT_ORIGIN` | `https://your-site.netlify.app,http://localhost:5173` |
   | `NODE_VERSION` | `20` (optional, ensures Node 20) |

   **IMPORTANT for CLIENT_ORIGIN:**
   - Replace `your-site.netlify.app` with your actual Netlify URL
   - Keep both URLs separated by comma (production + local dev)
   - Example: `https://designer-hub-123.netlify.app,http://localhost:5173`

5. Click **Create Web Service**

## Step 4: Wait for Deploy to Complete
- Render will install dependencies and start your server
- Watch the logs for any errors
- When you see "Server listening on [port]", it's ready!
- Copy your service URL (e.g., `https://designer-webapp-api.onrender.com`)

## Step 5: Test the API
Open this URL in your browser (replace with your actual URL):
```
https://designer-webapp-api.onrender.com/api/health
```

You should see:
```json
{"status":"ok"}
```

## Step 6: Update Netlify with Real API URL
1. Go to Netlify dashboard → Your site → Site settings
2. Build & deploy → Environment → Environment variables
3. Edit `VITE_API_URL` to your Render URL + `/api`:
   ```
   https://designer-webapp-api.onrender.com/api
   ```
   (NO trailing slash!)

4. Deploys → Trigger deploy → **Clear cache and deploy site**

## Step 7: Verify End-to-End
1. Wait for Netlify redeploy to finish
2. Open your Netlify site
3. Try logging in as admin
4. Create a task
5. Submit a design application

## Troubleshooting

### "Application failed to respond" on Render
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `MONGO_URI` is correct and MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### CORS errors in browser console
- Verify `CLIENT_ORIGIN` on Render includes your Netlify URL
- No typos in the URL (remove trailing slashes)
- Format: `https://site.netlify.app,http://localhost:5173`

### MongoDB connection failed
- In MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
- Verify connection string has correct username/password

### Render free tier sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid tier or using a "keep-alive" service
- Or accept the delay for free tier

## Notes
- Render free tier has 750 hours/month (plenty for one app)
- Logs are available in Render dashboard
- Set up automatic deploys: Render will redeploy on every git push
- To update env vars later: Render dashboard → Environment → Edit

## Alternative: Deploy to Railway
If Render doesn't work:
1. Go to https://railway.app
2. New Project → Deploy from GitHub repo
3. Select `server` directory
4. Add same environment variables
5. Railway will auto-detect Node and run `npm start`

Your API URL will be like: `https://your-project.up.railway.app`
