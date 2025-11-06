import express from 'express';
import {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  publishJob,
  closeJob,
  archiveJob,
  getJobStats,
} from '../controllers/jobs';
import authenticateUser from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/v1/jobs/stats
 * @desc    Get job statistics for current user
 * @access  Private
 */
router.get('/stats', authenticateUser, getJobStats);

/**
 * @route   GET /api/v1/jobs/my-jobs
 * @desc    Get jobs created by current user
 * @access  Private
 */
router.get('/my-jobs', authenticateUser, getMyJobs);

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs with filtering
 * @access  Public
 */
router.get('/', getAllJobs);

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job
 * @access  Private (Employer/Admin)
 */
router.post('/', authenticateUser, createJob);

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Get a single job by ID
 * @access  Public
 */
router.get('/:id', getJob);

/**
 * @route   PATCH /api/v1/jobs/:id
 * @desc    Update a job
 * @access  Private (Creator only)
 */
router.patch('/:id', authenticateUser, updateJob);

/**
 * @route   DELETE /api/v1/jobs/:id
 * @desc    Delete a job
 * @access  Private (Creator only)
 */
router.delete('/:id', authenticateUser, deleteJob);

/**
 * @route   PATCH /api/v1/jobs/:id/publish
 * @desc    Publish a job
 * @access  Private (Creator only)
 */
router.patch('/:id/publish', authenticateUser, publishJob);

/**
 * @route   PATCH /api/v1/jobs/:id/close
 * @desc    Close job applications
 * @access  Private (Creator only)
 */
router.patch('/:id/close', authenticateUser, closeJob);

/**
 * @route   PATCH /api/v1/jobs/:id/archive
 * @desc    Archive a job
 * @access  Private (Creator only)
 */
router.patch('/:id/archive', authenticateUser, archiveJob);

export default router;

