/**
 * Image Migration Script
 * Migrates existing local profile pictures to Cloudinary
 *
 * Usage:
 *   1. Make sure backend/.env has Cloudinary credentials
 *   2. Run: node backend/scripts/migrate-images.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const UserImage = require('../models/userImageModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  console.log('🚀 Starting image migration to Cloudinary...\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Verify Cloudinary credentials
    console.log('🔐 Verifying Cloudinary credentials...');
    await cloudinary.api.ping();
    console.log('✅ Cloudinary credentials verified\n');

    // Find all user images
    const userImages = await UserImage.find({});
    console.log(`📸 Found ${userImages.length} user images in database\n`);

    if (userImages.length === 0) {
      console.log('ℹ️  No images to migrate. Exiting...');
      process.exit(0);
    }

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const userImage of userImages) {
      const filename = userImage.image;
      const localPath = path.join(__dirname, '../public/Images', filename);

      console.log(`\n📤 Processing: ${filename}`);

      // Check if already migrated
      if (userImage.cloudinaryUrl) {
        console.log(`   ⏭️  Already migrated - Skipping`);
        skippedCount++;
        continue;
      }

      // Check if file exists locally
      if (!fs.existsSync(localPath)) {
        console.log(`   ⚠️  File not found locally - Skipping`);
        skippedCount++;
        continue;
      }

      try {
        // Upload to Cloudinary
        console.log(`   ⏳ Uploading to Cloudinary...`);
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'soyo-profile-pictures',
          public_id: `profile_${userImage.userId}`,
          overwrite: true,
          transformation: [
            { width: 500, height: 500, crop: 'limit' }
          ]
        });

        console.log(`   ✅ Uploaded: ${result.secure_url}`);

        // Update UserImage record
        await UserImage.findByIdAndUpdate(userImage._id, {
          cloudinaryUrl: result.secure_url,
          cloudinaryId: result.public_id,
        });

        // Update User record
        await User.findByIdAndUpdate(userImage.userId, {
          cloudinaryUrl: result.secure_url,
        });

        console.log(`   ✅ Database updated`);
        migratedCount++;

      } catch (uploadError) {
        console.error(`   ❌ Error uploading: ${uploadError.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration Complete!\n');
    console.log(`   ✅ Successfully migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    if (migratedCount > 0) {
      console.log('📋 Next Steps:');
      console.log('   1. Verify images in Cloudinary dashboard');
      console.log('   2. Test profile picture display in your app');
      console.log('   3. (Optional) Delete local images after verification:\n');
      console.log('      rm -rf backend/public/Images/*\n');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run migration
migrateImages();
