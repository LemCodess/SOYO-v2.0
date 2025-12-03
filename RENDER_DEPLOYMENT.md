# Deploying SOYO to Render.com

This guide will help you deploy your MERN stack application to Render.com (free tier available).

## Prerequisites

- GitHub account with your code pushed
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
- Render.com account (free)

## Deployment Options

You have two options for deploying to Render:

### Option 1: Using render.yaml (Blueprint - Recommended)
### Option 2: Manual Setup (Web Services)

---

## Option 1: Using render.yaml (Blueprint Deployment)

This is the easiest method - it deploys both backend and frontend automatically.

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Add Render configuration"
git push origin main
```

### Step 2: Create Blueprint on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select your repository (SOYO-v2.0)
5. Render will detect `render.yaml` automatically
6. Click **"Apply"**

### Step 3: Set Environment Variables

After the blueprint is created, you need to set the environment variables for each service:

#### Backend Environment Variables

Go to the backend service and set:

```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/soyo?retryWrites=true&w=majority
SECRET=your-strong-jwt-secret
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend Environment Variables

Go to the frontend service and set:

```env
VITE_API_URL=https://soyo-backend.onrender.com
```

Replace `soyo-backend` with your actual backend service name on Render.

### Step 4: Deploy

Click **"Deploy"** and wait for both services to build and deploy.

---

## Option 2: Manual Setup (Separate Services)

If you prefer more control, deploy backend and frontend separately.

### Deploy Backend

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New"** → **"Web Service"**
   - Connect your GitHub repository

2. **Configure Backend Service**
   - **Name**: `soyo-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**:
     ```
     npm install
     ```
   - **Start Command**:
     ```
     npm start
     ```
   - **Plan**: Free

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/soyo?retryWrites=true&w=majority
   SECRET=your-strong-random-secret
   USE_CLOUDINARY=true
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Create Service**

### Deploy Frontend

1. **Create New Static Site**
   - Click **"New"** → **"Static Site"**
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `soyo-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://soyo-backend.onrender.com
   ```
   (Use the URL from your backend service)

4. **Configure Redirects/Rewrites**
   - Render automatically handles SPA routing for Vite builds
   - If needed, create `frontend/_redirects` file:
   ```
   /*    /index.html   200
   ```

5. **Create Static Site**

---

## MongoDB Atlas Configuration

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user:
   - Username: `soyo-user` (or your choice)
   - Password: Generate a strong password
   - Save credentials securely

### Step 2: Whitelist IPs

1. Go to **Network Access** in MongoDB Atlas
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed for Render's dynamic IPs
   - For production, consider using a VPN or Atlas's IP access list

### Step 3: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<database>` with your values

Example:
```
mongodb+srv://soyo-user:MyPassword123@cluster0.xxxxx.mongodb.net/soyo?retryWrites=true&w=majority
```

---

## Cloudinary Configuration

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Add to Render environment variables

---

## Troubleshooting

### Build Failed: "vite: not found"

**Cause**: Dependencies not installed correctly

**Solution**: Use the updated build commands:
- For root deployment: `npm run build` (now includes `npm install`)
- For subdirectory deployment: `cd frontend && npm install && npm run build`

### Cannot Connect to MongoDB

**Issue**: Connection timeout or authentication failed

**Solutions**:
1. Check your MONGO_URI is correct
2. Verify MongoDB Atlas network access allows 0.0.0.0/0
3. Ensure database user credentials are correct
4. Check if the database name in the URI matches your database

### Frontend Can't Reach Backend

**Issue**: CORS errors or network errors

**Solutions**:
1. Verify `VITE_API_URL` points to your actual backend URL
2. Ensure backend CORS is configured to allow your frontend domain
3. Check backend service is running (not sleeping)
4. Update frontend environment variables and redeploy

### Free Tier Limitations

Render free tier services:
- **Spin down after 15 minutes** of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- 750 hours/month free (multiple services share this)

**Workaround**: Use a cron job service to ping your backend every 14 minutes:
```bash
curl https://soyo-backend.onrender.com/api/health
```

Use services like [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com).

### Backend Crashes on Start

**Check logs**:
1. Go to your service on Render
2. Click **"Logs"** tab
3. Look for error messages

**Common issues**:
- Missing environment variables
- Invalid MongoDB connection string
- Port binding issues (use `process.env.PORT`)

---

## Build Command Reference

### Root Level Deployment

If Render is building from the project root:

**Build Command**:
```bash
npm run build
```

This now includes `npm install` for frontend dependencies.

### Subdirectory Deployment

If deploying from `backend/` or `frontend/` subdirectories:

**Backend**:
```bash
npm install
```

**Frontend**:
```bash
npm install && npm run build
```

---

## Environment Variables Quick Reference

### Backend Required Variables

| Variable | Example | Required |
|----------|---------|----------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.net/db` | Yes |
| `SECRET` | `your-jwt-secret` | Yes |
| `USE_CLOUDINARY` | `true` | Yes |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud` | If USE_CLOUDINARY=true |
| `CLOUDINARY_API_KEY` | `123456789` | If USE_CLOUDINARY=true |
| `CLOUDINARY_API_SECRET` | `secret123` | If USE_CLOUDINARY=true |
| `NODE_ENV` | `production` | No (auto-set) |
| `PORT` | `5000` | No (auto-set by Render) |

### Frontend Required Variables

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://soyo-backend.onrender.com` | Yes |

---

## Updating Your Deployment

### Update Code

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy.

### Update Environment Variables

1. Go to your service on Render
2. Click **"Environment"** tab
3. Edit variables
4. Click **"Save Changes"**
5. Render will redeploy automatically

### Manual Redeploy

1. Go to your service
2. Click **"Manual Deploy"** dropdown
3. Select **"Deploy latest commit"**

---

## Custom Domain (Optional)

### For Frontend

1. Go to your frontend service on Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `www.soyo.com`)
4. Update DNS records as instructed by Render
5. Render provides free SSL certificates

### For Backend

1. Go to your backend service
2. Add custom domain (e.g., `api.soyo.com`)
3. Update `VITE_API_URL` in frontend to use new domain
4. Redeploy frontend

---

## Health Checks

Render automatically monitors your services. To add a custom health check:

### Backend

Create a health check endpoint in `server.js`:

```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
```

Then in Render:
1. Go to service **"Settings"**
2. **Health Check Path**: `/api/health`

---

## Cost Optimization

### Free Tier Tips

1. **Combine services** if possible to stay within 750 hours/month
2. **Use static site** for frontend (doesn't count toward hours)
3. **Monitor usage** in Render dashboard
4. **Scale down** when not actively developing

### Upgrade Options

- **Starter Plan**: $7/month per service (no sleep, more resources)
- **Standard Plan**: $25/month per service (more CPU/RAM)

---

## Security Best Practices

1. **Strong Secrets**: Use long, random strings for `SECRET`
2. **Environment Variables**: Never commit secrets to Git
3. **CORS Configuration**: Restrict to your frontend domain in production
4. **MongoDB Access**: Use specific IP allowlisting when possible
5. **Rate Limiting**: Add rate limiting middleware to backend
6. **HTTPS**: Always use HTTPS (Render provides this free)

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Getting Help

If you encounter issues:

1. Check Render logs
2. Review error messages carefully
3. Verify all environment variables are set
4. Test MongoDB connection locally
5. Join [Render Community](https://community.render.com/)

---

**Congratulations!** Your SOYO application is now deployed on Render!
