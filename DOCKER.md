# Docker Deployment Guide for SOYO

This guide will help you dockerize and deploy the SOYO (Story Of Your Own) MERN stack application.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) installed (version 1.29 or higher)
- MongoDB Atlas account with a cluster created
- Cloudinary account (optional, for image storage)

## Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ... (backend code)
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── ... (frontend code)
├── docker-compose.yml
├── .env.example
└── DOCKER.md (this file)
```

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# MongoDB Atlas URI
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/soyo?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
SECRET=your-super-secret-jwt-key

# Cloudinary Configuration
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# API URL (for Docker networking)
VITE_API_URL=http://localhost:5000
```

### 2. Build and Run with Docker Compose

Build and start all services:

```bash
docker-compose up --build
```

Or run in detached mode (background):

```bash
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 4. Stop the Application

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

## Manual Docker Build (Without Compose)

If you prefer to build and run containers individually:

### Build Images

```bash
# Build backend
docker build -t soyo-backend ./backend

# Build frontend
docker build -t soyo-frontend --build-arg VITE_API_URL=http://localhost:5000 ./frontend
```

### Run Containers

```bash
# Create a network
docker network create soyo-network

# Run backend
docker run -d \
  --name soyo-backend \
  --network soyo-network \
  -p 5000:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e MONGO_URI="your-mongodb-uri" \
  -e SECRET="your-jwt-secret" \
  -e USE_CLOUDINARY=true \
  -e CLOUDINARY_CLOUD_NAME="your-cloud-name" \
  -e CLOUDINARY_API_KEY="your-api-key" \
  -e CLOUDINARY_API_SECRET="your-api-secret" \
  soyo-backend

# Run frontend
docker run -d \
  --name soyo-frontend \
  --network soyo-network \
  -p 3000:80 \
  soyo-frontend
```

## Environment Variables Reference

### Backend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | 5000 |
| `NODE_ENV` | Node environment | No | production |
| `MONGO_URI` | MongoDB Atlas connection string | Yes | - |
| `SECRET` | JWT secret key | Yes | - |
| `USE_CLOUDINARY` | Enable Cloudinary for images | No | true |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | If USE_CLOUDINARY=true | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | If USE_CLOUDINARY=true | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | If USE_CLOUDINARY=true | - |

### Frontend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | http://localhost:5000 |

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user with password
4. Whitelist IP addresses (for Docker, use `0.0.0.0/0` for testing, or your specific IP for production)
5. Get the connection string and replace `<username>`, `<password>`, and `<database>` with your values

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/soyo?retryWrites=true&w=majority
```

## Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret
4. Add these to your `.env` file

## Free Docker Hosting Platforms

You can deploy your Dockerized app to these free platforms:

### 1. **Render.com** (Recommended)

**Pros**: Easy to use, free tier available, supports Docker
**Limits**: 750 hours/month

**Steps**:
1. Push your code to GitHub
2. Create account at [Render.com](https://render.com)
3. Create a new "Web Service" for backend
4. Connect your GitHub repo
5. Select Docker as the environment
6. Set environment variables in Render dashboard
7. Repeat for frontend (or use static site)

### 2. **Railway.app**

**Pros**: Simple deployment, generous free tier
**Limits**: $5 free credit/month

**Steps**:
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub repo
4. Railway auto-detects Dockerfile
5. Set environment variables
6. Deploy

### 3. **Fly.io**

**Pros**: Good free tier, edge deployment
**Limits**: 3 shared VMs free

**Steps**:
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch --dockerfile backend/Dockerfile

# Deploy
flyctl deploy
```

### 4. **Heroku** (with Docker)

**Note**: Heroku removed free tier in November 2022, but you can use student credits

**Steps**:
```bash
# Login to Heroku
heroku login

# Create app
heroku create soyo-backend

# Login to container registry
heroku container:login

# Push and release backend
cd backend
heroku container:push web -a soyo-backend
heroku container:release web -a soyo-backend

# Set environment variables
heroku config:set MONGO_URI="your-uri" -a soyo-backend
```

## Docker Compose Commands

```bash
# Build and start services
docker-compose up --build

# Start services (without rebuild)
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs (live)
docker-compose logs -f

# Rebuild specific service
docker-compose build backend

# Restart specific service
docker-compose restart backend

# Execute command in running container
docker-compose exec backend sh
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Frontend on port 8080
  - "5001:5000"  # Backend on port 5001
```

### Can't Connect to MongoDB Atlas

1. Check your connection string is correct
2. Ensure your IP is whitelisted in MongoDB Atlas (Network Access)
3. For Docker, try whitelisting `0.0.0.0/0` (allow from anywhere) for testing

### Frontend Can't Reach Backend

1. Ensure `VITE_API_URL` points to the correct backend URL
2. For local Docker: `http://localhost:5000`
3. For cloud deployment: use the actual backend URL

### Container Keeps Restarting

Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

Common issues:
- Missing environment variables
- Invalid MongoDB connection string
- Port conflicts

### Build Fails

1. Ensure you have enough disk space
2. Clear Docker cache:
```bash
docker system prune -a
```

3. Try building without cache:
```bash
docker-compose build --no-cache
```

## Production Considerations

1. **Use specific Node versions** in Dockerfiles (not `latest`)
2. **Set NODE_ENV=production** for backend
3. **Use secrets management** instead of `.env` files
4. **Enable HTTPS** with a reverse proxy (nginx, Caddy, or cloud provider)
5. **Set up monitoring** and logging
6. **Configure CORS** properly for your domain
7. **Implement rate limiting** on backend
8. **Use health checks** (already configured in docker-compose.yml)
9. **Whitelist specific IPs** in MongoDB Atlas instead of `0.0.0.0/0`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Nginx Configuration](https://nginx.org/en/docs/)

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Check Docker and Docker Compose versions

---

Happy Deploying!
