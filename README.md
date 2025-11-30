# 🎨 SOYO v2.0 - Story Of Your Own

A MERN stack story writing and sharing platform.

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for:
- Root (concurrently)
- Backend (Express, MongoDB, etc.)
- Frontend (React, Vite, etc.)

### 2. Setup Environment

```bash
npm run setup
```

This creates `.env` files from examples. Then edit:
- `backend/.env` - Add your MongoDB URI and JWT secrets
- `frontend/.env` - Update API URL if needed (default: localhost:5000)

### 3. Run Development Servers

```bash
npm run dev
```

This runs **both** backend and frontend concurrently:
- 🔵 Backend: http://localhost:5000
- 🟣 Frontend: http://localhost:5173

---

## 📜 Available Scripts

### Development
```bash
npm run dev              # Run both backend + frontend
npm run dev:backend      # Run backend only
npm run dev:frontend     # Run frontend only
```

### Build
```bash
npm run build            # Build frontend for production
npm run build:frontend   # Same as above
```

---


---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_min_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_characters
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)** - Complete documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - What changed in v2.0
- **[RECOMMENDED_STRUCTURE.md](./RECOMMENDED_STRUCTURE.md)** - Monorepo best practices

---


