import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import asyncWrapper from '../middleware/async';
import { BadRequestError, UnauthenticatedError, NotFoundError } from '../errors';
import config from '../config';

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email, and password');
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email already in use');
  }
  
  // Validate role if provided
  const validRoles = ['user', 'employer', 'admin'];
  if (role && !validRoles.includes(role)) {
    throw new BadRequestError(`Role must be one of: ${validRoles.join(', ')}`);
  }
  
  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user', // Default to user
  });
  
  // Generate JWT token using User model method
  const token = user.createJWT();
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 */
export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Check if email and password are provided
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  
  // Find user by email and include password field
  const user = await User.findOne({ email }).select('+password');
  
  // Check if user exists
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Generate JWT token using User model method
  const token = user.createJWT();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

/**
 * Get current user
 * @route GET /api/v1/auth/me
 */
export const getCurrentUser = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Find user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Update user profile
 * @route PATCH /api/v1/auth/update-profile
 */
export const updateProfile = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { name, email } = req.body;
  
  const updateData: any = {};
  
  if (name) {
    updateData.name = name;
  }
  
  if (email) {
    // Check if email is already in use by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }
    
    updateData.email = email;
  }
  
  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No update data provided');
  }
  
  // Find and update user
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Change password
 * @route PATCH /api/v1/auth/change-password
 */
export const changePassword = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new BadRequestError('Current password and new password are required');
  }
  
  // Find user with password field
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Check if current password is correct
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Current password is incorrect');
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Logout user (client-side token removal)
 * @route POST /api/v1/auth/logout
 */
export const logout = asyncWrapper(async (req: Request, res: Response) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  // This endpoint is provided for consistency and can be extended with token blacklisting
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logout successful',
  });
});

