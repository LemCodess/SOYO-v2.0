require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const storiesRoutes = require('./routes/stories');
const userRoutes = require('./routes/user');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UserImage = require('./models/userImageModel');

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
      'https://soyo-frontend.onrender.com', // Update with your actual frontend URL
      // Add your actual Render frontend URL here when deployed
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use('/public', express.static(path.join(__dirname, 'public')));

// Cloudinary configuration
const USE_CLOUDINARY = process.env.USE_CLOUDINARY === 'true';
let cloudinary, CloudinaryStorage;

if (USE_CLOUDINARY) {
  cloudinary = require('cloudinary').v2;
  CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('✅ Cloudinary storage enabled');
} else {
  console.log('📁 Local file storage enabled');
}

// Configure storage based on environment variable
const storage = USE_CLOUDINARY
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'soyo-profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/Images');
      },
      filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
      }
    });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880, // 5MB
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('=== UPLOAD ENDPOINT CALLED ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  console.log('Storage mode:', USE_CLOUDINARY ? 'Cloudinary' : 'Local');

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

    // Delete old profile picture if exists
    const existingImage = await UserImage.findOne({ userId });
    if (existingImage) {
      if (USE_CLOUDINARY && existingImage.cloudinaryId) {
        // Delete from Cloudinary
        try {
          await cloudinary.uploader.destroy(existingImage.cloudinaryId);
          console.log('✅ Old image deleted from Cloudinary');
        } catch (err) {
          console.log('⚠️ Could not delete old image from Cloudinary:', err.message);
        }
      } else if (!USE_CLOUDINARY && existingImage.image) {
        // Delete from local storage
        const oldImagePath = path.join(__dirname, 'public/Images', existingImage.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log('Could not delete old image:', err.message);
        });
      }
    }

    // Prepare data based on storage type
    let userImageData, userUpdateData, profilePictureUrl;

    if (USE_CLOUDINARY) {
      // Cloudinary storage
      userImageData = {
        image: req.file.filename,
        cloudinaryUrl: req.file.path,
        cloudinaryId: req.file.filename,
      };
      userUpdateData = {
        image: req.file.filename,
        cloudinaryUrl: req.file.path,
      };
      profilePictureUrl = req.file.path;
      console.log('✅ Upload successful to Cloudinary!');
      console.log('Cloudinary URL:', req.file.path);
    } else {
      // Local storage
      userImageData = {
        image: req.file.filename,
      };
      userUpdateData = {
        image: req.file.filename,
      };
      profilePictureUrl = `/public/Images/${req.file.filename}`;
      console.log('✅ Upload successful to local storage!');
      console.log('Filename:', req.file.filename);
      console.log('Profile URL:', profilePictureUrl);
    }

    // Update or create UserImage record
    const userImage = await UserImage.findOneAndUpdate(
      { userId },
      userImageData,
      { new: true, upsert: true }
    );

    // Update User.image field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      userUpdateData,
      { new: true }
    ).select('-password');

    console.log('Updated user:', updatedUser);

    res.json({
      success: true,
      result: userImage,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: profilePictureUrl,
        image: updatedUser.image,
        cloudinaryUrl: updatedUser.cloudinaryUrl
      }
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ success: false, error: err.message || 'Database error' });
  }
});

app.delete('/api/user/delete-profile-picture', async (req, res) => {
  const { userId } = req.body;

  try {
    const User = require('./models/userModel');

    const userImage = await UserImage.findOne({ userId });
    if (userImage) {
      if (USE_CLOUDINARY && userImage.cloudinaryId) {
        // Delete from Cloudinary
        try {
          await cloudinary.uploader.destroy(userImage.cloudinaryId);
          console.log('✅ Image deleted from Cloudinary');
        } catch (err) {
          console.error('⚠️ Error deleting from Cloudinary:', err);
        }
      } else if (!USE_CLOUDINARY && userImage.image) {
        // Delete from local storage
        const imagePath = path.join(__dirname, 'public/Images', userImage.image);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    }

    // Remove from database
    await UserImage.findOneAndDelete({ userId });

    // Clear User fields
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

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

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



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to DB and listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log('Database connection error:', error);
  });
