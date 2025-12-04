# SOYO (Story Of Your Own)

> A modern MERN stack platform for creative writers to share and discover stories.

## 🌐 Live Demo

**🚀 [https://soyo-app.vercel.app](https://soyo-app.vercel.app)**

---

## ✨ Features

### For Writers
- 📝 **Rich Text Editor** - Write stories with formatting using React Quill
- 💾 **Auto-Save Drafts** - Never lose your work
- 🌍 **Multi-Language Support** - Write in English or Bangla (বাংলা)
- 🏷️ **10 Story Categories** - Action, Adventure, Fanfiction, Fantasy, Horror, Humor, Mystery, Poetry, Romance, Science Fiction
- 📖 **Chapter Management** - Organize your stories into chapters
- 🔒 **Privacy Controls** - Publish or keep as drafts

### For Readers
- 🔍 **Advanced Search** - Find stories by title, author, category, or tags
- 🎯 **Smart Filters** - Filter by category, language, and sort options
- 👤 **Author Profiles** - View all stories from your favorite authors
- 📱 **Responsive Design** - Read on any device
- 🎨 **Category Badges** - Visual story categorization

### User Management
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 👤 **User Profiles** - Customizable profile with bio and avatar
- 🖼️ **Profile Pictures** - Upload images (local or Cloudinary)
- 📊 **User Dashboard** - Manage your published stories and drafts

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18.0.0 or higher
- **MongoDB** (local or Atlas)
- **npm** v9.0.0 or higher

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd CSE471-Project-sorting_complete_18th_sept

# Install all dependencies (root, backend, frontend)
npm run install:all
```

### 2. Configure Environment Variables

#### Backend Configuration
Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/soyo

# JWT Configuration
SECRET=your_jwt_secret_key_min_32_chars

# Cloudinary Configuration (Optional - for cloud image storage)
USE_CLOUDINARY=false
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend Configuration
Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed Database (Optional but Recommended)

Populate your database with sample users and stories:

```bash
cd backend
npm run seed
```

This creates:
- ✅ 5 sample users (Password: `SecurePass123!`)
- ✅ 15 diverse stories across all categories
- ✅ Includes English and Bangla content

**Sample Login Credentials:**
```
Email: sarah.mitchell@example.com
Password: SecurePass123!
```

### 4. Run Development Servers

```bash
# From root directory - runs both backend and frontend
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access the application:**
- 🟣 **Frontend**: http://localhost:5173
- 🔵 **Backend API**: http://localhost:5000
- 🏥 **Health Check**: http://localhost:5000/health

---


## 🗂️ Project Structure

```
CSE471-Project-sorting_complete_18th_sept/
├── api/                       # Vercel serverless functions
│   └── index.js              # Backend entry point for Vercel
│
├── backend/
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth & validation middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   │   └── db.js           # Database connection (serverless-optimized)
│   ├── public/              # Static files (local storage only)
│   ├── server.js            # Express server entry point
│   ├── seedDatabase.js      # Database seeding script
│   ├── nodemon.json         # Nodemon configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (auth)
│   │   ├── config/          # Configuration files
│   │   │   └── api.config.js # API base URL configuration
│   │   ├── api/             # API utilities
│   │   ├── hooks/           # Custom React hooks
│   │   ├── router/          # Route configuration
│   │   ├── styles/          # CSS styles
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── public/              # Static assets
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── scripts/                  # Utility scripts
├── vercel.json              # Vercel deployment configuration
├── .vercelignore            # Files to exclude from Vercel deployment
├── .env.example             # Environment variables template
├── VERCEL_DEPLOYMENT.md     # Detailed deployment guide
├── README.md                # This file
└── package.json             # Root package (monorepo scripts)
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel configuration for routing and builds |
| `api/index.js` | Serverless function wrapper for Express app |
| `backend/server.js` | Express app (exports for serverless, runs locally in dev) |
| `backend/utils/db.js` | MongoDB connection with pooling for serverless |
| `frontend/vite.config.js` | Vite build configuration and dev server proxy |
| `.vercelignore` | Excludes unnecessary files from deployment |

---


## 🌐 API Endpoints

### Authentication
```
POST   /api/user/signup      - Register new user
POST   /api/user/login       - Login user
GET    /api/user/profile     - Get user profile (protected)
```

### Stories
```
GET    /api/stories/published        - Get all published stories
GET    /api/stories/drafts          - Get user's drafts (protected)
GET    /api/stories/:id             - Get story by ID
POST   /api/stories                 - Create/update story (protected)
DELETE /api/stories/:id             - Delete story (protected)
```

### User Profile
```
POST   /upload                              - Upload profile picture
DELETE /api/user/delete-profile-picture    - Delete profile picture
```

---

## 🧪 Testing with Seed Data

The seed script creates realistic test data:

### Sample Users (All with password: `SecurePass123!`)
1. sarah.mitchell@example.com - Sarah Mitchell
2. james.chen@example.com - James Chen
3. priya.sharma@example.com - Priya Sharma
4. alex.rivera@example.com - Alex Rivera
5. emma.thompson@example.com - Emma Thompson


## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Protected Routes** - Middleware validation
- ✅ **CORS Configuration** - Controlled cross-origin requests
- ✅ **Input Validation** - Server-side validation
- ✅ **SQL Injection Prevention** - Mongoose parameterized queries


## 📝 Development Notes

### Code Style
- ES6+ JavaScript
- Functional React components with hooks
- Async/await for asynchronous operations
- Mongoose for MongoDB ODM

### State Management
- React Context API for authentication
- Local state for component-specific data
- localStorage for auth token persistence

### Styling
- Custom CSS with BEM-like naming
- Responsive design with media queries
- CSS variables for theming




