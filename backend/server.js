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
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

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
    const User = require('./models/userModel');

    // Delete old profile picture if exists
    const existingImage = await UserImage.findOne({ userId });
    if (existingImage && existingImage.image) {
      const oldImagePath = path.join(__dirname, 'public/Images', existingImage.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log('Could not delete old image:', err.message);
      });
    }

    // Update or create UserImage record
    const userImage = await UserImage.findOneAndUpdate(
      { userId },
      { image: req.file.filename },
      { new: true, upsert: true }
    );

    // Update User.image field - THIS IS THE KEY FIX
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: req.file.filename },
      { new: true }
    ).select('-password');

    const profilePictureUrl = `/public/Images/${req.file.filename}`;

    console.log('✅ Upload successful!');
    console.log('Filename:', req.file.filename);
    console.log('Profile URL:', profilePictureUrl);
    console.log('Updated user:', updatedUser);

    res.json({
      success: true,
      result: userImage,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: profilePictureUrl,
        image: updatedUser.image
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

    const userImage = await UserImage.findOneAndDelete({ userId });
    if (userImage) {
      const imagePath = path.join(__dirname, 'public/Images', userImage.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    // Also clear User.image field - IMPORTANT FIX
    await User.findByIdAndUpdate(userId, { image: null });

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
