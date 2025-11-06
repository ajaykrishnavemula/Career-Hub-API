import express from 'express';
import {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getMyCompanies,
  addTeamMember,
  removeTeamMember,
  addReview,
  getCompanyReviews,
} from '../controllers/companies';
import authenticateUser from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/v1/companies/my-companies
 * @desc    Get companies managed by current user
 * @access  Private
 */
router.get('/my-companies', authenticateUser, getMyCompanies);

/**
 * @route   GET /api/v1/companies
 * @desc    Get all companies with filtering
 * @access  Public
 */
router.get('/', getAllCompanies);

/**
 * @route   POST /api/v1/companies
 * @desc    Create a new company
 * @access  Private
 */
router.post('/', authenticateUser, createCompany);

/**
 * @route   GET /api/v1/companies/:identifier
 * @desc    Get a single company by ID or slug
 * @access  Public
 */
router.get('/:identifier', getCompany);

/**
 * @route   PATCH /api/v1/companies/:id
 * @desc    Update a company
 * @access  Private (Owner/Admin only)
 */
router.patch('/:id', authenticateUser, updateCompany);

/**
 * @route   DELETE /api/v1/companies/:id
 * @desc    Delete a company
 * @access  Private (Owner only)
 */
router.delete('/:id', authenticateUser, deleteCompany);

/**
 * @route   POST /api/v1/companies/:id/team
 * @desc    Add a team member to a company
 * @access  Private (Owner/Admin only)
 */
router.post('/:id/team', authenticateUser, addTeamMember);

/**
 * @route   DELETE /api/v1/companies/:id/team/:memberId
 * @desc    Remove a team member from a company
 * @access  Private (Owner/Admin only)
 */
router.delete('/:id/team/:memberId', authenticateUser, removeTeamMember);

/**
 * @route   POST /api/v1/companies/:id/reviews
 * @desc    Add a review to a company
 * @access  Private
 */
router.post('/:id/reviews', authenticateUser, addReview);

/**
 * @route   GET /api/v1/companies/:id/reviews
 * @desc    Get company reviews
 * @access  Public
 */
router.get('/:id/reviews', getCompanyReviews);

export default router;

