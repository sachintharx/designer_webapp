Netlify + API deployment steps

This repository contains a Vite React frontend in `client/` and an Express/MongoDB API in `server/`.

What I added for you
- `netlify.toml` at repo root (build command + SPA redirect + example env placeholders).
- `client/_redirects` to ensure SPA routing works on Netlify.

What you must do (step-by-step)

1) Push repository to GitHub (or GitLab/Bitbucket)
   - Ensure your repo is up-to-date and accessible.

2) Configure and deploy the API (server)
   - Choose a host: Render, Railway, Fly, or similar. (Netlify doesn't host long-running Node servers.)
   - Example (Render):
     - Create a new Web Service, connect your repo, set the Root/Directory to `server`.
     - Set Build command: `npm install` (Render will run install) and Start command: `node src/index.js` or `npm run start` if defined.
     - In service settings, set environment variables:
       - `MONGODB_URI` = your MongoDB Atlas connection string
       - `JWT_SECRET` = a secure secret string
       - Any other env var the server expects (e.g., `PORT`, `ADMIN_PASSWORD` if used)
   - Ensure CORS allows your Netlify domain while in production. In `server/src/index.js` or similar add:
     ```js
     import cors from 'cors';
     app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
     ```
     (Replace `*` with your Netlify URL for production.)
   - Deploy the service and note the public URL (e.g., `https://designer-api.onrender.com`).

3) Configure Netlify for the frontend
   - In Netlify dashboard, create a new site → Import from Git → select your repo.
   - The build command in `netlify.toml` is: `npm --prefix client ci && npm --prefix client run build`
     - This installs client dependencies first, then builds the Vite app.
   - Publish directory is automatically set to `client/dist` via netlify.toml.
   - In Site settings → Build & deploy → Environment → Environment variables, add:
     - `VITE_API_URL` = `https://your-api-url.example.com/api`
     - `VITE_ADSENSE_PUB` and `VITE_ADSENSE_SLOT` if using ads
     - Any other `VITE_*` env var your client reads
   - Deploy site. Netlify will run the build and publish `client/dist`.

4) Quick local test before pushing
   - Build the client locally to confirm there are no build errors:
     ```bash
     cd client
     npm install
     npm run build
     # open dist locally with a simple server, e.g.:
     npx serve dist
     ```

5) After deploy checks
   - Open the Netlify site and verify the frontend loads.
   - Use browser DevTools Network tab to confirm requests to `VITE_API_URL` succeed.
   - If 404 appears on client-side routes, check `_redirects`/`netlify.toml` and redeploy.

Notes & tips
- Environment secrets: Never commit real secrets to repo. Use Netlify/Render dashboard to store them.
- AdSense: add your `ca-pub-` ID to `VITE_ADSENSE_PUB` in Netlify UI; Google may need to verify domain.
- If you want the server to be on the same domain for cookies, consider deploying the API to a subdomain and enabling secure cookies. Otherwise keep client->API via CORS and bearer tokens.

If you want, I can:
- Add a `start` script to `server/package.json` if missing.
- Add a short `server/README_DEPLOY.md` with Render/Railway steps.
- Deploy the server to Render for you (you'll need to connect your Render account and provide secrets).

Tell me which of the optional actions you want me to do next.
