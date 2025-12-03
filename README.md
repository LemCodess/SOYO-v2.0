# SOYO (Story Of Your Own)

> A modern MERN stack platform for creative writers to share and discover stories.


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

## 📜 Available Scripts

### Root Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both backend and frontend concurrently |
| `npm run dev:backend` | Run backend only |
| `npm run dev:frontend` | Run frontend only |
| `npm run install:all` | Install dependencies for all packages |
| `npm run build` | Build frontend for production |
| `npm run clean` | Remove all node_modules and build files |

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run seed` | Populate database with sample data |

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🗂️ Project Structure

```
CSE471-Project-sorting_complete_18th_sept/
├── backend/
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── public/            # Static files (uploaded images)
│   ├── server.js          # Express server entry point
│   ├── seedDatabase.js    # Database seeding script
│   ├── nodemon.json       # Nodemon configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (auth)
│   │   ├── config/        # Configuration files
│   │   ├── api/           # API utilities
│   │   └── App.jsx        # Main app component
│   ├── public/            # Static assets
│   └── package.json
│
└── package.json           # Root package (scripts)
```

---

## 🔧 Configuration Details

### Image Storage Options

SOYO supports two image storage methods:

#### 1. Local Storage (Default)
Images stored in `backend/public/Images/`

```env
USE_CLOUDINARY=false
```

**Pros:** Simple, no external dependencies
**Cons:** Not suitable for cloud deployments

#### 2. Cloudinary (Recommended for Production)
Images stored on Cloudinary CDN

```env
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Pros:**
- Works on any hosting platform
- CDN for fast global delivery
- Automatic image optimization
- Free tier available

**Cons:** Requires external account

**Get Cloudinary Credentials:** https://cloudinary.com/users/register/free

---

## 🎨 Story Categories

| Category | Description |
|----------|-------------|
| 📚 **Action** | High-intensity, adrenaline-pumping stories |
| 🗺️ **Adventure** | Journeys, quests, and explorations |
| ✍️ **Fanfiction** | Stories based on existing works |
| 🐉 **Fantasy** | Magical worlds and mythical creatures |
| 👻 **Horror** | Scary and suspenseful tales |
| 😄 **Humor** | Comedic and lighthearted stories |
| 🔍 **Mystery** | Detective stories and puzzles |
| 📖 **Poetry** | Verse and poetic narratives |
| 💕 **Romance** | Love stories and relationships |
| 🚀 **Science Fiction** | Futuristic and technological tales |

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

### Sample Stories
- **The Last Dragon Keeper** (Fantasy)
- **Echoes in the Code** (Science Fiction)
- **The Midnight Library** (Mystery)
- **Cosmic Café** (Humor)
- **When Stars Collide** (Romance)
- **The Haunting of Blackwood Manor** (Horror)
- **অন্ধকারের আলো** (Poetry - Bangla)
- **Sword of the Shinobi** (Fanfiction)
- And 7 more diverse stories!

Each story includes:
- 2 complete chapters with real content
- HTML-formatted text
- Proper author attribution
- Realistic tags and descriptions

---

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Protected Routes** - Middleware validation
- ✅ **CORS Configuration** - Controlled cross-origin requests
- ✅ **Input Validation** - Server-side validation
- ✅ **SQL Injection Prevention** - Mongoose parameterized queries

---

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill //F //PID <PID_NUMBER>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
- Verify `MONGO_URI` in `backend/.env`
- Check MongoDB Atlas whitelist (allow your IP)
- Ensure database user has proper permissions

### Frontend Can't Connect to Backend
- Check `VITE_API_URL` in `frontend/.env`
- Verify backend is running on port 5000
- Check browser console for CORS errors

### Stories Not Appearing on Homepage
- Run `npm run seed` to populate database
- Verify MongoDB connection is successful
- Check that stories have `status: 'published'`

---

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

---

## 🚢 Deployment

### Backend Deployment (Any Platform)

1. **Set Environment Variables** on your platform
2. **With Cloudinary** (Recommended):
   ```env
   USE_CLOUDINARY=true
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
3. **Build command**: `npm install`
4. **Start command**: `npm start`

### Frontend Deployment

1. **Build**: `npm run build`
2. **Deploy** `frontend/dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting

3. **Update** `VITE_API_URL` to your backend URL


