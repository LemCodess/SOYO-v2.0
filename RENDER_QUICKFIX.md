# Quick Fix for Render Deployment Error

## The Problem

Your frontend was deployed as a **Web Service** instead of a **Static Site**. Web services need a `start` command to run a server, but your frontend just needs to serve static files from the `dist` folder.

**Error**: `error Command "start" not found`

## Solution: Delete and Recreate Frontend Service

### Step 1: Delete the Current Frontend Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your **soyo-frontend** service
3. Go to **Settings** tab
4. Scroll to bottom
5. Click **Delete Web Service**
6. Confirm deletion

### Step 2: Create New Static Site

1. In Render Dashboard, click **New** → **Static Site**
2. Connect your GitHub repository
3. Configure as follows:

#### Configuration:
```
Name: soyo-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

#### Environment Variables:
```
VITE_API_URL=https://your-backend-service-name.onrender.com
```
(Replace `your-backend-service-name` with your actual backend service URL)

4. Click **Create Static Site**

### Step 3: Verify Deployment

Once deployed, you should see:
- ✅ Build successful
- ✅ Site live at `https://soyo-frontend.onrender.com`

---

## Alternative: Using Blueprint (Recommended)

If you want to start fresh with the updated configuration:

### Step 1: Delete Both Services

Delete both backend and frontend services from Render dashboard.

### Step 2: Push Updated Code

```bash
git add .
git commit -m "Fix render.yaml configuration"
git push origin main
```

### Step 3: Deploy via Blueprint

1. Go to Render Dashboard
2. Click **New** → **Blueprint**
3. Connect your repository
4. Render detects `render.yaml` automatically
5. Click **Apply**

### Step 4: Set Environment Variables

#### Backend (soyo-backend):
```env
MONGO_URI=mongodb+srv://your-username:password@cluster.mongodb.net/soyo?retryWrites=true&w=majority
SECRET=your-strong-secret-key
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (soyo-frontend):
```env
VITE_API_URL=https://soyo-backend.onrender.com
```

---

## Key Differences: Web Service vs Static Site

| Feature | Web Service | Static Site |
|---------|-------------|-------------|
| Type | Runs Node.js server | Serves static files |
| Start Command | Required (`npm start`) | Not needed |
| Cost | Uses compute hours | Free (doesn't count toward limit) |
| Best For | Backend APIs | React/Vue/Vite builds |

## Your Services Should Be:

- ✅ **Backend** = Web Service (needs to run Express server)
- ✅ **Frontend** = Static Site (just serves built React files)

---

## Troubleshooting

### Frontend Still Failing?

**Check Build Command**:
```bash
npm install && npm run build
```

**Check Publish Directory**:
```
dist
```

**Check Environment Variables**:
- `VITE_API_URL` must point to your backend URL

### Backend Connection Issues?

**Check CORS in backend/server.js**:
```javascript
app.use(cors({
  origin: ['https://soyo-frontend.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Can't Connect Frontend to Backend?

1. Get your backend URL from Render (e.g., `https://soyo-backend.onrender.com`)
2. Update frontend environment variable `VITE_API_URL`
3. **Rebuild frontend** (changes to env vars require rebuild)

---

## Quick Commands Reference

### Check if Backend is Running
```bash
curl https://soyo-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T...",
  "uptime": 123.45,
  "mongodb": "connected"
}
```

### Test Frontend Build Locally
```bash
cd frontend
npm install
npm run build
```

Should create `dist/` folder with built files.

---

## Need More Help?

See `RENDER_DEPLOYMENT.md` for comprehensive deployment guide.

**Common Issues**:
- Backend sleeping? Use a cron job to ping every 14 minutes
- CORS errors? Update backend CORS configuration
- Environment variables not working? Make sure to rebuild after changing them

---

Good luck with your deployment! 🚀
