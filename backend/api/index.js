require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const storiesRoutes = require('../routes/stories');
const userRoutes = require('../routes/user');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const UserImage = require('../models/userImageModel');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'soyo-profile-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
  },
});

// Upload endpoint - Now uses Cloudinary
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('=== UPLOAD ENDPOINT CALLED ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

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
    const User = require('../models/userModel');

    // Delete old profile picture from Cloudinary if exists
    const existingImage = await UserImage.findOne({ userId });
    if (existingImage && existingImage.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryId);
        console.log('✅ Old image deleted from Cloudinary');
      } catch (err) {
        console.log('⚠️ Could not delete old image from Cloudinary:', err.message);
      }
    }

    // Update or create UserImage record with Cloudinary URL
    const userImage = await UserImage.findOneAndUpdate(
      { userId },
      {
        image: req.file.filename,
        cloudinaryUrl: req.file.path,
        cloudinaryId: req.file.filename,
      },
      { new: true, upsert: true }
    );

    // Update User.image field with Cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        image: req.file.filename,
        cloudinaryUrl: req.file.path,
      },
      { new: true }
    ).select('-password');

    console.log('✅ Upload successful to Cloudinary!');
    console.log('Cloudinary URL:', req.file.path);
    console.log('Updated user:', updatedUser);

    res.json({
      success: true,
      result: userImage,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: req.file.path, // Return Cloudinary URL
        image: updatedUser.image,
        cloudinaryUrl: req.file.path,
      }
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ success: false, error: err.message || 'Database error' });
  }
});

// Delete profile picture endpoint - Now uses Cloudinary
app.delete('/api/user/delete-profile-picture', async (req, res) => {
  const { userId } = req.body;

  try {
    const User = require('../models/userModel');

    const userImage = await UserImage.findOne({ userId });
    if (userImage && userImage.cloudinaryId) {
      try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(userImage.cloudinaryId);
        console.log('✅ Image deleted from Cloudinary');
      } catch (err) {
        console.error('⚠️ Error deleting from Cloudinary:', err);
      }
    }

    // Remove from database
    await UserImage.findOneAndDelete({ userId });

    // Clear User.image field
    await User.findByIdAndUpdate(userId, {
      image: null,
      cloudinaryUrl: null,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({ success: false, error: 'Error deleting profile picture' });
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SOYO API - Serverless Edition" });
});

// API routes
app.use('/api/stories', storiesRoutes);
app.use('/api/user', userRoutes);

// MongoDB connection (for serverless, connection is cached)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = db;
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  });
}

// Export serverless handler for Vercel
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
