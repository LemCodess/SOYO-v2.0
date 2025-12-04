# 🚀 Vercel Deployment Guide for SOYO

This guide will help you deploy your MERN stack application to Vercel.

---

## ✅ Pre-Deployment Checklist

All necessary files have been created and configured:

- ✅ `vercel.json` - Vercel configuration
- ✅ `backend/utils/db.js` - Database connection utility for serverless
- ✅ `backend/server.js` - Modified for Vercel compatibility
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `.env.example` - Environment variables template
- ✅ Frontend API config - Updated for production
- ✅ CORS config - Updated to allow Vercel domains

---

## 📋 Required Environment Variables

You need to set these in the Vercel Dashboard:



---

## 🔧 Deployment Steps

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy to Vercel

From your project root directory:

```bash
vercel --prod
```

**That's it!** Vercel will:
1. Detect the `vercel.json` configuration
2. Install all dependencies
3. Build the frontend
4. Set up serverless functions for the backend
5. Deploy everything

---

## 🌐 Setting Up Environment Variables in Vercel Dashboard

After your first deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all the variables from the list above
5. Set them for **Production**, **Preview**, and **Development** environments
6. **Redeploy** your project for changes to take effect:
   ```bash
   vercel --prod
   ```

---

## 📁 Project Structure

```
your-project/
├── frontend/                 # React frontend
│   ├── dist/                # Build output (auto-generated)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express backend
│   ├── server.js            # Main entry (modified for Vercel)
│   ├── utils/
│   │   └── db.js           # Database connection utility
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── package.json
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to ignore
└── package.json             # Root package.json
```

---

## 🔍 How It Works

### Frontend
- Built using `vite build`
- Output goes to `frontend/dist`
- Served as static files from Vercel CDN

### Backend
- Runs as Vercel Serverless Functions
- Each request triggers a function execution
- Database connection uses connection pooling
- Maximum execution time: 10 seconds (configurable)

### Routing
- `/` → Frontend (static files)
- `/api/*` → Backend serverless function
- `/upload` → Backend serverless function
- `/public/*` → Backend serverless function

---

## 🔒 Important Changes Made

### 1. Backend Server (backend/server.js)
- ✅ Added serverless-compatible database connection
- ✅ Exports Express app for Vercel
- ✅ Forces Cloudinary in production
- ✅ Updated CORS to allow Vercel domains
- ✅ Conditional `app.listen()` (only in development)

### 2. Database Connection (backend/utils/db.js)
- ✅ Connection pooling for serverless
- ✅ Reuses connections across function invocations
- ✅ Proper timeout handling

### 3. Frontend API Config (frontend/src/config/api.config.js)
- ✅ Uses relative URLs in production
- ✅ Uses localhost in development
- ✅ Configurable via environment variable

### 4. File Uploads
- ⚠️ **Local storage disabled in production**
- ✅ Automatically uses Cloudinary in production
- 📝 You **MUST** set up Cloudinary credentials

---

## ⚡ Testing Your Deployment

### 1. Check API Health
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1.234,
  "mongodb": "connected"
}
```

### 2. Test Frontend
Visit: `https://your-project.vercel.app`

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution:** Check your `MONGO_URI` in Vercel environment variables

### Issue: "CORS error"
**Solution:** Set `FRONTEND_URL` to your Vercel domain in environment variables

### Issue: "File upload not working"
**Solution:** Verify Cloudinary credentials are set correctly

### Issue: "Function timeout"
**Solution:** Increase `maxDuration` in `vercel.json` (max 60s for Pro plan)

### Issue: "Module not found"
**Solution:** Run `npm install` in both frontend and backend locally, then redeploy

---

## 📊 Monitoring

View logs in the Vercel Dashboard:
1. Go to your project
2. Click on **Deployments**
3. Select a deployment
4. Click **View Function Logs**

---

## 🔄 Redeploying

To redeploy after making changes:

```bash
# Deploy to production
vercel --prod

# Or push to your connected Git repository
git add .
git commit -m "your commit message"
git push origin main
```

Vercel will automatically redeploy if you've connected your Git repository.

---

## 🎯 Next Steps

1. ✅ Set up Cloudinary account if you haven't already
2. ✅ Add all environment variables in Vercel Dashboard
3. ✅ Run `vercel --prod` to deploy
4. ✅ Test all functionality
5. ✅ Set up custom domain (optional)
6. ✅ Enable Vercel Analytics (optional)

---

## 📞 Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## ⚠️ Important Notes

1. **File Storage:** Local file uploads won't persist on Vercel. Always use Cloudinary in production.
2. **Function Limits:** Free tier has 10-second function timeout. Pro has up to 60 seconds.
3. **Cold Starts:** First request might be slower due to serverless cold start.
4. **Database:** Use MongoDB Atlas for best performance with Vercel.
5. **Environment Variables:** Changes require redeployment to take effect.

---

**Your project is now ready for deployment! 🎉**
