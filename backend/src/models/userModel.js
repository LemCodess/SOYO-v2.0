const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const config = require('../config/env.config');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    image: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false, // Don't return refresh token by default
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Static signup method
 */
userSchema.statics.signup = async function (name, email, password) {
  // Validation is now handled by express-validator in the routes
  // But we still check for existing user
  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error('Email already in use');
  }

  const user = await this.create({ name, email, password });
  return user;
};

/**
 * Static login method
 */
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Incorrect password');
  }

  return user;
};

/**
 * Generate access token
 */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
};

/**
 * Generate refresh token
 */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiry,
  });
};

/**
 * Generate token pair and save refresh token
 */
userSchema.methods.generateTokens = async function () {
  const accessToken = this.generateAccessToken();
  const refreshToken = this.generateRefreshToken();

  // Save refresh token to database
  this.refreshToken = refreshToken;
  await this.save();

  return { accessToken, refreshToken };
};

/**
 * Remove sensitive data from JSON response
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
