# 🏗️ SOYO v2.0 - Architecture Overview

## 📐 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                          │
│                    (React 18 + Vite)                          │
│                                                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │   Pages    │  │ Components │  │   Router   │             │
│  │  Home      │  │  Login     │  │ Protected  │             │
│  │  Profile   │  │  Navbar    │  │  Route     │             │
│  │  Writing   │  │ LazyQuill  │  └────────────┘             │
│  │  Story     │  └────────────┘                              │
│  └─────┬──────┘                                               │
│        │                                                       │
│        ▼                                                       │
│  ┌──────────────────────────────────────────┐                │
│  │           API LAYER                       │                │
│  │  - Axios with Interceptors                │                │
│  │  - Auto Token Refresh                     │                │
│  │  - Error Handling                         │                │
│  │  - Auth API  │ Story API  │ Image API    │                │
│  └──────────────┬────────────────────────────┘                │
│                 │                                              │
└─────────────────┼──────────────────────────────────────────────┘
                  │
                  │ HTTPS
                  │
┌─────────────────▼──────────────────────────────────────────────┐
│                     MIDDLEWARE LAYER                           │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  Helmet  │ │   CORS   │ │   Rate   │ │   XSS    │         │
│  │ Security │ │  Config  │ │  Limit   │ │  Clean   │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │   Auth   │ │Validation│ │  Morgan  │ │  Multer  │         │
│  │   JWT    │ │ express- │ │  Logger  │ │  Upload  │         │
│  │          │ │validator │ │          │ │          │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────────┐
│                     ROUTING LAYER                              │
│                                                                 │
│  /api/auth/*        /api/stories/*       /api/user/*          │
│  ┌──────────┐      ┌──────────┐         ┌──────────┐         │
│  │  Signup  │      │  Create  │         │  Upload  │         │
│  │  Login   │      │  Update  │         │  Picture │         │
│  │  Refresh │      │  List    │         │  Delete  │         │
│  │  Logout  │      │  Delete  │         └──────────┘         │
│  └─────┬────┘      └─────┬────┘                               │
│        │                 │                                     │
└────────┼─────────────────┼─────────────────────────────────────┘
         │                 │
         ▼                 ▼
┌────────────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                             │
│                   (HTTP Request/Response)                      │
│                                                                 │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐            │
│  │    Auth    │   │   Story    │   │   Image    │            │
│  │ Controller │   │ Controller │   │ Controller │            │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘            │
│        │                │                │                     │
└────────┼────────────────┼────────────────┼─────────────────────┘
         │                │                │
         ▼                ▼                ▼
┌────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                               │
│                (Business Logic)                                │
│                                                                 │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐            │
│  │    Auth    │   │   Story    │   │   Image    │            │
│  │  Service   │   │  Service   │   │  Service   │            │
│  │            │   │            │   │            │            │
│  │ • Register │   │ • Create   │   │ • Upload   │            │
│  │ • Login    │   │ • Update   │   │ • Delete   │            │
│  │ • Refresh  │   │ • Search   │   │ • Get      │            │
│  │ • Logout   │   │ • Delete   │   │            │            │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘            │
│        │                │                │                     │
└────────┼────────────────┼────────────────┼─────────────────────┘
         │                │                │
         ▼                ▼                ▼
┌────────────────────────────────────────────────────────────────┐
│                     MODEL LAYER                                │
│              (Database Schema & Methods)                       │
│                                                                 │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐            │
│  │    User    │   │   Story    │   │ UserImage  │            │
│  │   Model    │   │   Model    │   │   Model    │            │
│  │            │   │            │   │            │            │
│  │ • Schema   │   │ • Schema   │   │ • Schema   │            │
│  │ • Methods  │   │ • Indexes  │   │ • Methods  │            │
│  │ • Hooks    │   │ • Methods  │   │            │            │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘            │
│        │                │                │                     │
└────────┼────────────────┼────────────────┼─────────────────────┘
         │                │                │
         ▼                ▼                ▼
┌────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                              │
│                   (MongoDB Atlas)                              │
│                                                                 │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐            │
│  │   users    │   │  stories   │   │ userimages │            │
│  │ Collection │   │ Collection │   │ Collection │            │
│  └────────────┘   └────────────┘   └────────────┘            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: User Login

```
1. User clicks "Login" on frontend
   │
   ▼
2. Login.jsx collects email/password
   │
   ▼
3. Calls authAPI.login(email, password)
   │
   ▼
4. api/auth.api.js → axiosInstance.post('/api/auth/login', {...})
   │
   ▼
5. Axios interceptor adds headers (if token exists)
   │
   ▼
6. Request hits backend server.js
   │
   ▼
7. Middleware chain:
   │
   ├─> Morgan (logs request)
   ├─> Helmet (security headers)
   ├─> CORS (origin check)
   ├─> Rate limiter (check attempts)
   ├─> Body parser (parse JSON)
   └─> Auth rate limiter (stricter limit)
   │
   ▼
8. Routes to /api/auth/login
   │
   ▼
9. Validation middleware (express-validator)
   │
   ▼
10. auth.controller.login()
    │
    ├─> Extract email/password from req.body
    │
    ▼
11. authService.loginUser(email, password)
    │
    ├─> User.login(email, password)  [Model static method]
    │   ├─> Find user by email
    │   ├─> Compare password with bcrypt
    │   └─> Return user
    │
    ├─> user.generateTokens()  [Model instance method]
    │   ├─> Generate access token (15 min)
    │   ├─> Generate refresh token (7 days)
    │   ├─> Save refresh token to DB
    │   └─> Return tokens
    │
    ├─> logger.info('User logged in')
    │
    └─> Return { user, accessToken, refreshToken }
    │
    ▼
12. Controller sends response
    │
    ▼
13. Response flows back to frontend
    │
    ▼
14. Axios interceptor (no action on success)
    │
    ▼
15. authAPI.login resolves with data
    │
    ▼
16. Login.jsx receives tokens
    │
    ├─> localStorage.setItem('accessToken', ...)
    ├─> localStorage.setItem('refreshToken', ...)
    ├─> localStorage.setItem('userId', ...)
    ├─> localStorage.setItem('userName', ...)
    │
    ▼
17. toast.success('Login successful!')
    │
    ▼
18. Redirect to /home
```

---

## 🔄 Token Refresh Flow

```
1. User makes API request with expired access token
   │
   ▼
2. Axios sends request with Authorization: Bearer <expired_token>
   │
   ▼
3. Backend auth middleware verifies token
   │
   └─> jwt.verify() throws TokenExpiredError
   │
   ▼
4. Auth middleware throws ApiError(401, 'Token expired')
   │
   ▼
5. Response: { success: false, error: 'Access token expired...' }
   │
   ▼
6. Axios response interceptor catches 401 error
   │
   ├─> Checks if error message includes 'expired'
   │
   ▼
7. Gets refreshToken from localStorage
   │
   ▼
8. Sends POST /api/auth/refresh-token { refreshToken }
   │
   ▼
9. Backend verifies refresh token
   │
   ├─> jwt.verify(refreshToken, JWT_REFRESH_SECRET)
   ├─> Find user by ID
   ├─> Check stored refreshToken matches
   │
   ▼
10. Generate new access token
    │
    ▼
11. Return { accessToken: <new_token> }
    │
    ▼
12. Interceptor receives new token
    │
    ├─> localStorage.setItem('accessToken', newToken)
    ├─> Update axios headers
    │
    ▼
13. Retry original failed request with new token
    │
    ▼
14. Request succeeds
    │
    ▼
15. User never noticed token expired! ✨
```

---

## 📦 Data Flow: Profile Picture Upload

```
1. User selects image file
   │
   ▼
2. Profile.jsx calls userImageAPI.uploadProfilePicture(file)
   │
   ▼
3. API creates FormData, appends file
   │
   ▼
4. axiosInstance.post('/api/user/upload-profile-picture', formData)
   │
   └─> Sets Content-Type: multipart/form-data
   │
   ▼
5. Backend receives request
   │
   ▼
6. Middleware chain:
   │
   ├─> Auth middleware (verify JWT)
   ├─> Multer middleware (handle file upload)
   │   ├─> Validates MIME type (image/jpeg, image/png, etc.)
   │   ├─> Checks file size (max 5MB)
   │   ├─> Generates unique filename
   │   └─> Saves to uploads/images/
   │
   ▼
7. userImage.controller.uploadProfilePicture()
   │
   ├─> Check if req.file exists
   │
   ▼
8. userImageService.uploadProfilePicture(userId, filename)
   │
   ├─> Find existing UserImage by userId
   │
   ├─> If exists:
   │   └─> Delete old image file from filesystem
   │
   ├─> UserImage.findOneAndUpdate({ userId }, { image: filename }, { upsert: true })
   │
   ├─> User.findByIdAndUpdate(userId, { image: filename })
   │
   ├─> logger.info('Profile picture uploaded')
   │
   └─> Return { success: true, image: filename, imageUrl: '/uploads/images/...' }
   │
   ▼
9. Controller sends success response
   │
   ▼
10. Frontend receives response
    │
    ├─> toast.success('Profile picture uploaded!')
    ├─> setImageUrl(response.data.imageUrl)
    ├─> localStorage.setItem('profileImageUrl', ...)
    │
    ▼
11. UI updates immediately with new image ✅
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Request                                 │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 1:    │
              │    Helmet     │  ← Security headers
              │ (CSP, HSTS)   │     (XSS, clickjacking)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 2:    │
              │     CORS      │  ← Origin validation
              │  (whitelist)  │     (only allowed domains)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 3:    │
              │  Rate Limit   │  ← DDoS protection
              │ (100 req/15m) │     (brute force)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 4:    │
              │   XSS Clean   │  ← Script injection
              │               │     prevention
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 5:    │
              │ Mongo Sanitize│  ← NoSQL injection
              │               │     prevention
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 6:    │
              │  Validation   │  ← Input validation
              │ (exp-validator)│    (schema, types)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Layer 7:    │
              │      Auth     │  ← JWT verification
              │ (if protected)│     (authorization)
              └───────┬───────┘
                      │
                      ▼
            ┌─────────────────┐
            │   Application   │
            │     Logic       │
            └─────────────────┘
```

---

## 📁 Module Dependencies

### Backend

```
server.js
  ├─ config/
  │   ├─ env.config.js (dotenv)
  │   ├─ db.config.js (mongoose)
  │   └─ multer.config.js (multer)
  │
  ├─ middleware/
  │   ├─ auth.js (jsonwebtoken, models)
  │   ├─ errorHandler.js (utils/logger)
  │   └─ security.js (helmet, cors, rate-limit, xss, mongo-sanitize)
  │
  ├─ routes/
  │   ├─ auth.routes.js (controllers, validators, middleware)
  │   ├─ story.routes.js (controllers, validators, middleware)
  │   └─ userImage.routes.js (controllers, middleware, config)
  │
  ├─ controllers/
  │   ├─ auth.controller.js (services)
  │   ├─ story.controller.js (services)
  │   └─ userImage.controller.js (services)
  │
  ├─ services/
  │   ├─ auth.service.js (models, utils)
  │   ├─ story.service.js (models, utils)
  │   └─ userImage.service.js (models, utils, fs)
  │
  ├─ models/
  │   ├─ userModel.js (mongoose, bcrypt, validator, jsonwebtoken)
  │   ├─ storyModel.js (mongoose)
  │   └─ userImageModel.js (mongoose)
  │
  ├─ validators/
  │   ├─ auth.validator.js (express-validator)
  │   └─ story.validator.js (express-validator)
  │
  └─ utils/
      ├─ ApiError.js
      └─ logger.js (winston)
```

### Frontend

```
main.jsx
  ├─ App.jsx
  │   ├─ router/ProtectedRoute.jsx
  │   ├─ components/
  │   │   ├─ Navbar
  │   │   ├─ Login (api/auth.api)
  │   │   ├─ SignUpForm (api/auth.api)
  │   │   └─ LazyQuill (react-quill)
  │   │
  │   └─ pages/
  │       ├─ Home (api/story.api)
  │       ├─ Profile (api/userImage.api, api/story.api)
  │       ├─ Writing (api/story.api)
  │       ├─ Chapters (api/story.api, LazyQuill)
  │       └─ Story (api/story.api)
  │
  ├─ api/
  │   ├─ axios.js (axios, config)
  │   ├─ auth.api.js (axios, config)
  │   ├─ story.api.js (axios, config)
  │   ├─ userImage.api.js (axios, config)
  │   └─ index.js
  │
  ├─ config/
  │   └─ api.config.js
  │
  ├─ utils/
  │   ├─ toast.js (styles/toast.css)
  │   └─ errorHandler.js (toast)
  │
  └─ styles/
      ├─ toast.css
      └─ loader.css
```

---

## 🎯 Design Patterns Used

1. **Service Layer Pattern**
   - Controllers: HTTP layer
   - Services: Business logic
   - Models: Data access

2. **Repository Pattern**
   - Mongoose models as repositories
   - Abstracted database operations

3. **Middleware Chain Pattern**
   - Sequential request processing
   - Composable security layers

4. **Factory Pattern**
   - Axios instance creation
   - Logger configuration

5. **Singleton Pattern**
   - Database connection
   - Logger instance
   - Toast notification

6. **Higher-Order Component**
   - ProtectedRoute wrapper
   - LazyQuill suspense wrapper

7. **Dependency Injection**
   - Services injected into controllers
   - Config injected into modules

---

**Production-Ready Architecture ✅**
**Scalable, Secure, Maintainable**
