import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Job from '../models/Job';
import asyncWrapper from '../middleware/async';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors';

/**
 * Create a new job
 * @route POST /api/v1/jobs
 */
export const createJob = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Add createdBy field
  req.body.createdBy = userId;
  
  // Create job
  const job = await Job.create(req.body);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Job created successfully',
    job,
  });
});

/**
 * Get all jobs with filtering, sorting, and pagination
 * @route GET /api/v1/jobs
 */
export const getAllJobs = asyncWrapper(async (req: Request, res: Response) => {
  const {
    status,
    jobType,
    experience,
    location,
    company,
    search,
    sort,
    page = 1,
    limit = 10,
  } = req.query;
  
  // Build query
  const query: any = {};
  
  // Filter by status (default to published for public access)
  if (status) {
    query.status = status;
  } else {
    query.status = 'published';
  }
  
  // Filter by job type
  if (jobType) {
    query.jobType = jobType;
  }
  
  // Filter by experience level
  if (experience) {
    query.experience = experience;
  }
  
  // Filter by location
  if (location) {
    query['location.city'] = { $regex: location, $options: 'i' };
  }
  
  // Filter by company
  if (company) {
    query.company = { $regex: company, $options: 'i' };
  }
  
  // Text search
  if (search) {
    query.$text = { $search: search as string };
  }
  
  // Sorting
  let sortOption: any = { createdAt: -1 }; // Default: newest first
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'company') {
    sortOption = { company: 1 };
  } else if (sort === 'position') {
    sortOption = { position: 1 };
  }
  
  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  
  // Execute query
  const jobs = await Job.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);
  
  // Get total count
  const total = await Job.countDocuments(query);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: jobs.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    jobs,
  });
});

/**
 * Get a single job by ID
 * @route GET /api/v1/jobs/:id
 */
export const getJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const job = await Job.findById(id).populate('createdBy', 'name email');
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${id}`);
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    job,
  });
});

/**
 * Update a job
 * @route PATCH /api/v1/jobs/:id
 */
export const updateJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find job
  const job = await Job.findById(id);
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${id}`);
  }
  
  // Check if user is the creator
  if (job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to update this job');
  }
  
  // Update job
  const updatedJob = await Job.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Job updated successfully',
    job: updatedJob,
  });
});

/**
 * Delete a job
 * @route DELETE /api/v1/jobs/:id
 */
export const deleteJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find job
  const job = await Job.findById(id);
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${id}`);
  }
  
  // Check if user is the creator
  if (job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to delete this job');
  }
  
  // Delete job
  await Job.findByIdAndDelete(id);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

/**
 * Get jobs created by the current user
 * @route GET /api/v1/jobs/my-jobs
 */
export const getMyJobs = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { status, page = 1, limit = 10 } = req.query;
  
  // Build query
  const query: any = { createdBy: userId };
  
  if (status) {
    query.status = status;
  }
  
  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  
  // Execute query
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
  
  // Get total count
  const total = await Job.countDocuments(query);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: jobs.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    jobs,
  });
});

/**
 * Publish a job (change status from draft to published)
 * @route PATCH /api/v1/jobs/:id/publish
 */
export const publishJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find job
  const job = await Job.findById(id);
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${id}`);
  }
  
  // Check if user is the creator
  if (job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to publish this job');
  }
  
  // Check if job is already published
  if (job.status === 'published') {
    throw new BadRequestError('Job is already published');
  }
  
  // Update status to published
  job.status = 'published';
  await job.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Job published successfully',
    job,
  });
});

/**
 * Close a job (change applicationStatus to closed)
 * @route PATCH /api/v1/jobs/:id/close
 */
export const closeJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find job
  const job = await Job.findById(id);
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${id}`);
  }
  
  // Check if user is the creator
  if (job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to close this job');
  }
  
  // Check if job is already closed
  if (job.applicationStatus === 'closed') {
    throw new BadRequestError('Job applications are already closed');
  }
  
  // Update applicationStatus to closed
  job.applicationStatus = 'closed';
  await job.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Job applications closed successfully',
    job,
  });
});

/**
 * Archive a job
 * @route PATCH /api/v1/jobs/:id/archive
 */
export const archiveJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find job
  const job = await Job.findById(id);
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${id}`);
  }
  
  // Check if user is the creator
  if (job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to archive this job');
  }
  
  // Update status to archived
  job.status = 'archived';
  await job.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Job archived successfully',
    job,
  });
});

/**
 * Get job statistics for the current user
 * @route GET /api/v1/jobs/stats
 */
export const getJobStats = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Get counts by status
  const stats = await Job.aggregate([
    { $match: { createdBy: userId } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 }
    }}
  ]);
  
  // Format stats
  const formattedStats = stats.reduce((acc: any, stat: any) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
  
  // Get total jobs
  const total = await Job.countDocuments({ createdBy: userId });
  
  res.status(StatusCodes.OK).json({
    success: true,
    stats: {
      total,
      byStatus: formattedStats,
    },
  });
});

// Made with Bob