# 🚀 SOYO - Vercel Deployment Guide

Complete guide to deploy SOYO (Story Of Your Own) MERN stack application on Vercel with Cloudinary integration.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Cloudinary Setup](#cloudinary-setup)
5. [Local Testing](#local-testing)
6. [Vercel Deployment](#vercel-deployment)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Accounts
- **GitHub Account** - For code repository
- **Vercel Account** - For hosting (sign up at https://vercel.com)
- **MongoDB Atlas Account** - For database (you already have this)
- **Cloudinary Account** - For image storage (FREE tier sufficient)

### Required Software
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** - For version control

---

## 📁 Project Structure

Your project now has this structure for Vercel deployment:

```
CSE471-Project-sorting_complete_18th_sept/
├── backend/
│   ├── api/
│   │   └── index.js          ← NEW: Serverless entry point (replaces server.js)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │   ├── userModel.js       ← Updated: Added cloudinaryUrl field
│   │   └── userImageModel.js  ← Updated: Added cloudinaryUrl & cloudinaryId
│   ├── routes/
│   ├── .env                   ← Update with Cloudinary credentials
│   ├── .env.example           ← NEW: Template for environment variables
│   ├── package.json
│   └── server.js              ← Keep for local development
│
├── frontend/
│   ├── src/
│   ├── .env.example           ← NEW: Template for frontend env vars
│   └── package.json
│
├── vercel.json                ← NEW: Vercel configuration
└── DEPLOYMENT.md              ← This file

```

### What Changed?

#### ✅ Backend Changes
1. **Created `backend/api/index.js`** - Serverless function handler
2. **Replaced Multer local storage** with Cloudinary integration
3. **Updated models** - Added cloudinaryUrl and cloudinaryId fields
4. **Updated controller** - Returns Cloudinary URLs for profile pictures
5. **Removed `app.listen()`** from serverless handler (kept in server.js for dev)

#### ✅ Frontend Changes
- **No breaking changes!** Frontend already uses relative URLs which work with Vercel routing

#### ✅ Configuration Files
- **vercel.json** - Tells Vercel how to build and route requests
- **.env.example** files - Templates for environment variables

---

## 🔐 Environment Setup

### Step 1: Cloudinary Setup

#### Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up for FREE account (25GB storage, 25GB bandwidth/month)
3. Verify your email

#### Get Cloudinary Credentials
1. Log in to Cloudinary dashboard
2. Go to **Dashboard** → You'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. **IMPORTANT**: Copy these values - you'll need them for .env

#### Configure Cloudinary Upload Preset (Optional)
1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Note your preset name (or use default)

### Step 2: Update Backend .env

Open `backend/.env` and add these Cloudinary variables:

```env
# ========================================
# Cloudinary Configuration (REQUIRED)
# ========================================
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Your complete backend/.env should look like:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/soyo?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Client Configuration
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration (NEW)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload Configuration
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Legacy
SECRET=one
```

### Step 3: Frontend .env (Optional)

Create `frontend/.env` (optional, not required for Vercel):

```env
# Leave empty to use relative URLs (recommended for Vercel)
VITE_API_URL=
```

---

## 🧪 Local Testing

### Test Cloudinary Integration Locally

1. **Start Backend** (using new serverless structure):
```bash
cd backend
node api/index.js
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```

3. **Test Profile Picture Upload**:
   - Navigate to http://localhost:5173
   - Log in to your account
   - Go to Profile page
   - Upload a new profile picture
   - Check Cloudinary dashboard - image should appear in `soyo-profile-pictures` folder

4. **Verify in Cloudinary**:
   - Go to Cloudinary Dashboard → Media Library
   - Look for folder: `soyo-profile-pictures`
   - Your uploaded image should be there

### Troubleshooting Local Testing

#### Error: "Invalid Cloudinary credentials"
- Double-check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env
- Make sure there are no extra spaces or quotes

#### Error: "Cannot connect to database"
- Verify MONGO_URI is correct
- Check MongoDB Atlas whitelist includes your IP

#### Upload works but image doesn't show
- Check browser console for errors
- Verify cloudinaryUrl is being returned from API
- Check Network tab in DevTools for the /api/user/profile response

---

## 🌐 Vercel Deployment

### Step 1: Prepare Repository

1. **Initialize Git** (if not already):
```bash
cd CSE471-Project-sorting_complete_18th_sept
git init
git add .
git commit -m "Prepare for Vercel deployment with Cloudinary"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create new repository: `soyo-app` (or any name)
   - **DO NOT** initialize with README

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/soyo-app.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import Repository**:
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and import `soyo-app`

3. **Configure Build Settings**:

Vercel will auto-detect settings, but verify:

```
Framework Preset: Other
Build Command: (leave default)
Output Directory: (leave default)
Install Command: npm install
```

4. **Configure Root Directory**:
   - Click "Edit" next to Root Directory
   - Set to: `.` (project root)

### Step 3: Environment Variables

**CRITICAL**: Add these environment variables in Vercel:

1. Click **Environment Variables** tab
2. Add each variable one by one:

```
Name: MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/soyo?retryWrites=true&w=majority

Name: JWT_SECRET
Value: your_jwt_secret_here

Name: JWT_REFRESH_SECRET
Value: your_jwt_refresh_secret_here

Name: JWT_EXPIRY
Value: 15m

Name: JWT_REFRESH_EXPIRY
Value: 7d

Name: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name

Name: CLOUDINARY_API_KEY
Value: your_api_key

Name: CLOUDINARY_API_SECRET
Value: your_api_secret

Name: MAX_FILE_SIZE
Value: 5242880

Name: CLIENT_URL
Value: https://your-app.vercel.app (You'll update this after deployment)

Name: NODE_ENV
Value: production
```

**Important Notes**:
- Make sure CLOUDINARY variables match your dashboard exactly
- JWT secrets should be strong random strings
- CLIENT_URL will be updated after first deployment

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. **Vercel will give you a URL**: `https://your-app-name.vercel.app`

### Step 5: Update CLIENT_URL

1. Copy your Vercel deployment URL
2. Go back to **Project Settings** → **Environment Variables**
3. Update `CLIENT_URL` to your Vercel URL: `https://your-app-name.vercel.app`
4. **Redeploy** (Deployments → Click ••• → Redeploy)

---

## ✅ Post-Deployment

### Verify Deployment

#### 1. Test API Endpoint
```bash
curl https://your-app-name.vercel.app/
```
Expected response:
```json
{"message": "Welcome to SOYO API - Serverless Edition"}
```

#### 2. Test Frontend
- Visit `https://your-app-name.vercel.app`
- You should see the SOYO homepage
- Try signup/login
- Test profile picture upload

#### 3. Verify Cloudinary
- Upload a profile picture
- Check Cloudinary dashboard
- Image should appear in `soyo-profile-pictures` folder

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Click "Add"
3. Enter your domain (e.g., `soyo.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `CLIENT_URL` environment variable

---

## 🔍 Troubleshooting

### Common Issues

#### Issue: "502 Bad Gateway"
**Cause**: Backend function timing out or database connection failed

**Solution**:
- Check Vercel function logs (Project → Functions → Logs)
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access (add 0.0.0.0/0 for Vercel)

#### Issue: "Profile picture upload fails"
**Cause**: Cloudinary credentials incorrect or missing

**Solution**:
- Verify Cloudinary env vars in Vercel dashboard
- Check API key has upload permissions
- Look at Vercel function logs for specific error

#### Issue: "Old profile pictures still showing local URLs"
**Cause**: Existing users have old `/public/Images/...` URLs in database

**Solution**: Two options:
1. **Ask users to re-upload** - Simplest solution
2. **Run migration script** (see below)

#### Issue: "CORS errors in production"
**Cause**: CLIENT_URL not set correctly

**Solution**:
- Update CLIENT_URL in Vercel environment variables
- Redeploy the project

### Viewing Logs

#### Vercel Function Logs
1. Go to Vercel dashboard
2. Select your project
3. Click "Functions" tab
4. Click on `api/index.js` function
5. View real-time logs

#### Browser Console
- Right-click → Inspect → Console
- Look for errors from API calls

---

## 📊 Migration: Existing Images to Cloudinary

If you have existing profile pictures in `backend/public/Images`, you can migrate them to Cloudinary:

### Option 1: Manual Re-upload (Recommended)
- Ask users to re-upload their profile pictures
- Old images will automatically be replaced

### Option 2: Automated Migration Script

Create `backend/scripts/migrate-images.js`:

```javascript
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const UserImage = require('../models/userImageModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  try {
    const userImages = await UserImage.find({});

    for (const userImage of userImages) {
      const localPath = path.join(__dirname, '../public/Images', userImage.image);

      if (fs.existsSync(localPath)) {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'soyo-profile-pictures',
        });

        // Update database
        await UserImage.findByIdAndUpdate(userImage._id, {
          cloudinaryUrl: result.secure_url,
          cloudinaryId: result.public_id,
        });

        await User.findByIdAndUpdate(userImage.userId, {
          cloudinaryUrl: result.secure_url,
        });

        console.log(`✅ Migrated ${userImage.image}`);
      }
    }

    console.log('🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

migrateImages();
```

Run migration:
```bash
cd backend
node scripts/migrate-images.js
```

---

## 🎯 Deployment Checklist

Before going live, verify:

- [ ] All environment variables set in Vercel
- [ ] Cloudinary account active and credentials correct
- [ ] MongoDB Atlas network access includes Vercel IPs (0.0.0.0/0)
- [ ] CLIENT_URL updated to production URL
- [ ] Test signup/login functionality
- [ ] Test profile picture upload
- [ ] Test story creation and reading
- [ ] Check browser console for errors
- [ ] Verify images appear in Cloudinary dashboard
- [ ] Check Vercel function logs for errors

---

## 📚 Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Cloudinary Documentation**: https://cloudinary.com/documentation
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Vite Production Build**: https://vitejs.dev/guide/build.html

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Vercel Logs** first
2. **Check Browser Console** for frontend errors
3. **Verify Environment Variables** are set correctly
4. **Test Cloudinary** credentials separately
5. **Check MongoDB Atlas** network access

---

## 🎉 Success!

If everything works:
- ✅ Your app is live on Vercel
- ✅ Images are stored in Cloudinary
- ✅ Database is on MongoDB Atlas
- ✅ Fully serverless architecture
- ✅ Auto-scaling and CDN included

**Your app URL**: `https://your-app-name.vercel.app`

Congratulations! 🚀
