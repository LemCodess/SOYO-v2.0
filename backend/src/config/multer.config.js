const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('./env.config');
const ApiError = require('../utils/ApiError');

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

/**
 * Configure storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname_userId_timestamp.ext
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const userId = req.user?._id || req.body?.userId || 'unknown';
    cb(null, `${file.fieldname}_${userId}_${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter - validate MIME type
 */
const fileFilter = (req, file, cb) => {
  if (config.allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type. Allowed types: ${config.allowedImageTypes.join(', ')}`), false);
  }
};

/**
 * Configure multer
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});

/**
 * Multer error handler
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, `File too large. Maximum size: ${config.maxFileSize / (1024 * 1024)}MB`));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError(400, 'Unexpected file field'));
    }
    return next(new ApiError(400, `File upload error: ${err.message}`));
  }
  next(err);
};

module.exports = {
  upload,
  handleMulterError,
};
