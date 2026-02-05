# Troubleshooting Blank White Page on Netlify

If you see a blank white page after deploying to Netlify, follow these steps:

## 1. Check Browser Console (MOST IMPORTANT)
Open your Netlify site in a browser:
- Press **F12** or right-click → Inspect
- Go to **Console** tab
- Look for **red error messages**
- Take a screenshot and share if needed

Common errors and fixes:
- **"Failed to fetch"** or **CORS error** → API server not deployed or CORS not configured
- **"undefined is not an object"** → Missing environment variable
- **404 errors for assets** → Build didn't copy assets correctly

## 2. Verify Environment Variables in Netlify
Go to Netlify dashboard → Site settings → Environment variables

**CRITICAL:** Check `VITE_API_URL`:
- ❌ Wrong: `http://localhost:5000/api` (won't work in production)
- ❌ Wrong: Empty or not set
- ✅ Correct: `https://your-deployed-api.onrender.com/api` (your actual API URL)

**If API is not deployed yet:**
- Set `VITE_API_URL` to `https://jsonplaceholder.typicode.com` temporarily
- This will make the page load (with mock data errors, but you'll see the UI)
- Then deploy your real API and update the URL

## 3. Check Build Logs in Netlify
Go to Deploys tab → Click latest deploy → View build logs
- Look for any red **ERROR** messages
- Verify "Build succeeded" appears at the end
- Check that `client/dist` folder was created

## 4. Test Build Locally First
Before deploying, test the production build on your machine:
```bash
cd client
npm run build
npx serve dist -p 3000
```
Open http://localhost:3000 - does it work?

## 5. Common Fixes

### Fix A: API Not Deployed Yet
**Problem:** Frontend is trying to reach API that doesn't exist
**Solution:**
1. Deploy the server first (see DEPLOY.md step 2)
2. Get the API URL from your hosting provider (e.g., Render)
3. Set `VITE_API_URL` in Netlify to that URL
4. Trigger a new deploy

### Fix B: Wrong API URL
**Problem:** VITE_API_URL points to localhost or wrong domain
**Solution:**
1. In Netlify → Site settings → Environment variables
2. Edit `VITE_API_URL` to your real API URL (must include `/api` at the end)
3. Example: `https://designer-api.onrender.com/api`
4. Trigger redeploy: Deploys → Trigger deploy → Clear cache and deploy site

### Fix C: CORS Blocking Requests
**Problem:** API rejects requests from Netlify domain
**Solution:** Update server CORS config in `server/src/index.js`:
```javascript
import cors from 'cors';
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://your-site.netlify.app',
  credentials: true
}));
```
Set `CLIENT_ORIGIN` environment variable on your server host (Render/Railway)

### Fix D: Missing Public Assets
**Problem:** logo.png or other assets not found
**Solution:** 
- Ensure `client/public/logo.png` exists in your repo
- Add and commit: `git add client/public/logo.png && git commit -m "Add logo"`
- Push and redeploy

## 6. Quick Verification Checklist
Before asking for help, verify:
- [ ] Checked browser console for errors
- [ ] `VITE_API_URL` is set in Netlify (not localhost)
- [ ] API server is deployed and accessible (open API URL in browser)
- [ ] Build logs show "Deploy succeeded"
- [ ] Cleared cache and re-deployed after changing env vars

## 7. Emergency: See Something Instead of Blank Page
I added an ErrorBoundary that will show errors instead of blank page.

After you commit and push the latest changes:
- If there's a React error, you'll see a red error message with details
- If page is still blank, the issue is before React renders (check console)

## Next Steps
1. **Right now:** Open your Netlify site, press F12, check Console tab
2. **If API errors:** Deploy your server first (DEPLOY.md step 2)
3. **After fixing:** Commit changes, push, and Netlify will auto-deploy
4. **Still stuck:** Share the browser console errors

---

**Quick test command:**
```bash
# In your Netlify site URL, open browser console and run:
console.log(import.meta.env.VITE_API_URL)
# This will show what API URL the frontend is using
```
