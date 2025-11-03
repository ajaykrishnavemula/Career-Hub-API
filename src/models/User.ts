import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config';
import { UserModel } from '../interfaces/User';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'employer'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (this: UserModel) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token
UserSchema.methods.createJWT = function (this: UserModel) {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      isEmailVerified: this.isEmailVerified,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

// Generate refresh token
UserSchema.methods.createRefreshToken = function (this: UserModel) {
  return jwt.sign(
    { userId: this._id },
    config.refreshTokenSecret,
    {
      expiresIn: config.refreshTokenExpiresIn,
    }
  );
};

// Compare password
UserSchema.methods.comparePassword = async function (this: UserModel, candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
UserSchema.methods.isLocked = function (this: UserModel) {
  // Check if account is locked and lock time has not expired
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = async function (this: UserModel) {
  // Increment login attempts
  this.loginAttempts += 1;

  // Lock account if max attempts reached
  if (this.loginAttempts >= config.maxLoginAttempts) {
    this.lockUntil = new Date(Date.now() + config.lockTime);
  }

  await this.save();
};

// Generate verification token
UserSchema.methods.generateVerificationToken = function (this: UserModel) {
  // Generate token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to verificationToken field
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expiration (24 hours)
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return verificationToken;
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function (this: UserModel) {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration (10 minutes)
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export default mongoose.model<UserModel>('User', UserSchema);

