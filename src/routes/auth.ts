import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
} from '../controllers/auth';
import authenticateUser from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticateUser, getCurrentUser);

/**
 * @route   PATCH /api/v1/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/update-profile', authenticateUser, updateProfile);

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.patch('/change-password', authenticateUser, changePassword);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateUser, logout);

export default router;

// Made with Bob