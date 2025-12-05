require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const storiesRoutes = require('./routes/stories');
const userRoutes = require('./routes/user');
const cors = require('cors');
const upload = require('./middleware/uploadMemory');
const { uploadToCloudinary, deleteFromCloudinary } = require('./config/cloudinary');
const UserImage = require('./models/userImageModel');
const connectDB = require('./utils/db');

const app = express();
console.log('MONGO_URI:', process.env.MONGO_URI);

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      process.env.FRONTEND_URL, // Frontend URL from environment variable
    ].filter(Boolean); // Remove undefined values

    // In production, also allow Vercel preview deployments
    if (allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === 'development' ||
        (origin && origin.includes('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// CLOUDINARY-ONLY UPLOAD ENDPOINT
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('=== CLOUDINARY UPLOAD ENDPOINT CALLED ===');
  console.log('Request body:', req.body);
  console.log('File buffer size:', req.file?.buffer?.length);

  const { userId } = req.body;

  if (!userId) {
    console.log('ERROR: No userId provided');
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  if (!req.file) {
    console.log('ERROR: No file uploaded');
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    const User = require('./models/userModel');

    // Delete old profile picture from Cloudinary if exists
    const existingUser = await User.findById(userId);
    if (existingUser && existingUser.profileImagePublicId) {
      try {
        await deleteFromCloudinary(existingUser.profileImagePublicId);
        console.log('✅ Old image deleted from Cloudinary');
      } catch (err) {
        console.log('⚠️ Could not delete old image from Cloudinary:', err.message);
      }
    }

    // Upload new image to Cloudinary from buffer
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'soyo-profile-pictures'
    );

    console.log('✅ Upload successful to Cloudinary!');
    console.log('Cloudinary URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // Update User model with new profile image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: uploadResult.secure_url,
        profileImagePublicId: uploadResult.public_id,
      },
      { new: true }
    ).select('-password');

    // Update or create UserImage record (for backwards compatibility)
    await UserImage.findOneAndUpdate(
      { userId },
      {
        image: uploadResult.public_id,
        cloudinaryUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
      },
      { new: true, upsert: true }
    );

    console.log('Updated user:', updatedUser);

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: uploadResult.secure_url,
      }
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ success: false, error: err.message || 'Upload failed' });
  }
});

// DELETE PROFILE PICTURE ENDPOINT
app.delete('/api/user/delete-profile-picture', async (req, res) => {
  const { userId } = req.body;

  try {
    const User = require('./models/userModel');

    const user = await User.findById(userId);
    if (user && user.profileImagePublicId) {
      try {
        await deleteFromCloudinary(user.profileImagePublicId);
        console.log('✅ Image deleted from Cloudinary');
      } catch (err) {
        console.error('⚠️ Error deleting from Cloudinary:', err);
      }
    }

    // Remove from UserImage collection
    await UserImage.findOneAndDelete({ userId });

    // Clear User fields
    await User.findByIdAndUpdate(userId, {
      profileImage: null,
      profileImagePublicId: null,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({ success: false, error: 'Error deleting profile picture' });
  }
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Database connection middleware for serverless
if (process.env.NODE_ENV === 'production') {
  // For Vercel serverless, connect on demand
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ error: 'Database connection failed' });
    }
  });
}

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the app" });
});

// Health check endpoint for monitoring and Docker
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use('/api/stories', storiesRoutes);
app.use('/api/user', userRoutes);

// For local development only
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(process.env.PORT || 5000, () => {
        console.log('Connected to DB and listening on port', process.env.PORT || 5000);
      });
    })
    .catch((error) => {
      console.log('Database connection error:', error);
    });
}

// Export for Vercel serverless
module.exports = app;
