import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApplicantProfile, JobApplication } from '../models/Applicant';
import Job from '../models/Job';
import User from '../models/User';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors';
import asyncWrapper from '../middleware/async';
import mongoose from 'mongoose';

/**
 * Create or update applicant profile
 * @route POST /api/v1/applicants/profile
 */
export const createOrUpdateProfile = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Check if profile already exists
  let profile = await ApplicantProfile.findOne({ userId });
  
  if (profile) {
    // Update existing profile
    profile = await ApplicantProfile.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, runValidators: true }
    );
  } else {
    // Create new profile
    profile = await ApplicantProfile.create({
      userId,
      ...req.body
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    profile
  });
});

/**
 * Get applicant profile
 * @route GET /api/v1/applicants/profile
 */
export const getProfile = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  const profile = await ApplicantProfile.findOne({ userId });
  
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    profile
  });
});

/**
 * Apply for a job
 * @route POST /api/v1/applicants/jobs/:jobId/apply
 */
export const applyForJob = asyncWrapper(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = req.user?.userId;
  
  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }
  
  // Check if application deadline has passed
  if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
    throw new BadRequestError('Application deadline has passed');
  }
  
  // Check if applicant profile exists
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  if (!applicantProfile) {
    throw new BadRequestError('Please create an applicant profile first');
  }
  
  // Check if already applied
  const existingApplication = await JobApplication.findOne({
    jobId,
    applicantId: applicantProfile._id
  });
  
  if (existingApplication) {
    throw new BadRequestError('You have already applied for this job');
  }
  
  // Create application
  const application = await JobApplication.create({
    jobId,
    applicantId: applicantProfile._id,
    resumeUrl: req.body.resumeUrl || applicantProfile.resume?.url,
    coverLetter: req.body.coverLetter,
    answers: req.body.answers || []
  });
  
  // Update job application count
  await Job.findByIdAndUpdate(jobId, {
    $inc: { applicationCount: 1 }
  });
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    application
  });
});

/**
 * Get all job applications for the current user
 * @route GET /api/v1/applicants/applications
 */
export const getMyApplications = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  if (!applicantProfile) {
    throw new NotFoundError('Applicant profile not found');
  }
  
  // Get applications with job details
  const applications = await JobApplication.find({
    applicantId: applicantProfile._id
  }).populate({
    path: 'jobId',
    select: 'title company location status applicationDeadline'
  });
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: applications.length,
    applications
  });
});

/**
 * Get a specific job application
 * @route GET /api/v1/applicants/applications/:applicationId
 */
export const getApplication = asyncWrapper(async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const userId = req.user?.userId;
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  if (!applicantProfile) {
    throw new NotFoundError('Applicant profile not found');
  }
  
  // Get application with job details
  const application = await JobApplication.findOne({
    _id: applicationId,
    applicantId: applicantProfile._id
  }).populate({
    path: 'jobId',
    select: 'title company location status applicationDeadline description requirements'
  });
  
  if (!application) {
    throw new NotFoundError(`No application found with id ${applicationId}`);
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    application
  });
});

/**
 * Withdraw a job application
 * @route PATCH /api/v1/applicants/applications/:applicationId/withdraw
 */
export const withdrawApplication = asyncWrapper(async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const userId = req.user?.userId;
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  if (!applicantProfile) {
    throw new NotFoundError('Applicant profile not found');
  }
  
  // Find and update application
  const application = await JobApplication.findOneAndUpdate(
    {
      _id: applicationId,
      applicantId: applicantProfile._id,
      status: { $nin: ['withdrawn', 'rejected', 'hired'] }
    },
    { status: 'withdrawn' },
    { new: true }
  );
  
  if (!application) {
    throw new NotFoundError(`No active application found with id ${applicationId}`);
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Application withdrawn successfully',
    application
  });
});

/**
 * Get recommended jobs based on applicant profile
 * @route GET /api/v1/applicants/recommended-jobs
 */
export const getRecommendedJobs = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  if (!applicantProfile) {
    throw new NotFoundError('Applicant profile not found');
  }
  
  // Extract skills from profile
  const skills = applicantProfile.skills.map((skill: any) => skill.name);
  
  // Get job titles from work experience
  const jobTitles = applicantProfile.workExperience.map((exp: any) => exp.position);
  
  // Get already applied job IDs
  const appliedJobs = await JobApplication.find({
    applicantId: applicantProfile._id
  }).select('jobId');
  
  const appliedJobIds = appliedJobs.map((app: any) => app.jobId);
  
  // Find matching jobs
  const recommendedJobs = await Job.find({
    _id: { $nin: appliedJobIds },
    status: 'open',
    $or: [
      { 'skills.required': { $in: skills } },
      { 'skills.preferred': { $in: skills } },
      { title: { $in: jobTitles.map((title: string) => new RegExp(title, 'i')) } }
    ],
    ...(applicantProfile.isRemoteOnly ? { isRemote: true } : {}),
    ...(applicantProfile.preferredJobTypes?.length ? 
      { jobType: { $in: applicantProfile.preferredJobTypes } } : {})
  })
  .sort({ createdAt: -1 })
  .limit(10);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: recommendedJobs.length,
    jobs: recommendedJobs
  });
});

/**
 * Get applicant profile by ID (for employers)
 * @route GET /api/v1/applicants/:applicantId
 */
export const getApplicantById = asyncWrapper(async (req: Request, res: Response) => {
  const { applicantId } = req.params;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const user = await User.findById(userId);
  if (!user || user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized to access this resource');
  }
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findById(applicantId);
  if (!applicantProfile) {
    throw new NotFoundError(`No applicant found with id ${applicantId}`);
  }
  
  // Get user details
  const applicantUser = await User.findById(applicantProfile.userId).select('name email');
  
  res.status(StatusCodes.OK).json({
    success: true,
    applicant: {
      ...applicantProfile.toObject(),
      user: applicantUser
    }
  });
});

/**
 * Update application status (for employers)
 * @route PATCH /api/v1/applicants/applications/:applicationId/status
 */
export const updateApplicationStatus = asyncWrapper(async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { status, notes } = req.body;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const user = await User.findById(userId);
  if (!user || user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized to access this resource');
  }
  
  // Validate status
  const validStatuses = ['screening', 'interview', 'offer', 'hired', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Find application
  const application = await JobApplication.findById(applicationId);
  if (!application) {
    throw new NotFoundError(`No application found with id ${applicationId}`);
  }
  
  // Check if job belongs to employer
  const job = await Job.findById(application.jobId);
  if (!job || job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to update this application');
  }
  
  // Update application
  const updatedApplication = await JobApplication.findByIdAndUpdate(
    applicationId,
    { 
      status,
      $push: notes ? {
        notes: {
          content: notes,
          createdBy: userId,
          createdAt: new Date()
        }
      } : {}
    },
    { new: true }
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Application status updated to ${status}`,
    application: updatedApplication
  });
});

/**
 * Schedule an interview (for employers)
 * @route POST /api/v1/applicants/applications/:applicationId/interviews
 */
export const scheduleInterview = asyncWrapper(async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { scheduledFor, duration, type, location, interviewers } = req.body;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const user = await User.findById(userId);
  if (!user || user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized to access this resource');
  }
  
  // Find application
  const application = await JobApplication.findById(applicationId);
  if (!application) {
    throw new NotFoundError(`No application found with id ${applicationId}`);
  }
  
  // Check if job belongs to employer
  const job = await Job.findById(application.jobId);
  if (!job || job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to update this application');
  }
  
  // Validate interview data
  if (!scheduledFor || !duration || !type) {
    throw new BadRequestError('Please provide scheduledFor, duration, and type');
  }
  
  // Update application status to interview if not already
  if (application.status !== 'interview') {
    application.status = 'interview';
  }
  
  // Add interview to application
  application.interviews.push({
    scheduledFor: new Date(scheduledFor),
    duration,
    type,
    location,
    interviewers: interviewers || [new mongoose.Types.ObjectId(userId)]
  });
  
  await application.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Interview scheduled successfully',
    application
  });
});

/**
 * Add interview feedback (for employers)
 * @route POST /api/v1/applicants/applications/:applicationId/interviews/:interviewId/feedback
 */
export const addInterviewFeedback = asyncWrapper(async (req: Request, res: Response) => {
  const { applicationId, interviewId } = req.params;
  const { rating, strengths, weaknesses, notes, recommendation } = req.body;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const user = await User.findById(userId);
  if (!user || user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized to access this resource');
  }
  
  // Validate feedback data
  if (!rating || !recommendation) {
    throw new BadRequestError('Please provide rating and recommendation');
  }
  
  // Find application
  const application = await JobApplication.findById(applicationId);
  if (!application) {
    throw new NotFoundError(`No application found with id ${applicationId}`);
  }
  
  // Check if job belongs to employer
  const job = await Job.findById(application.jobId);
  if (!job || job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to update this application');
  }
  
  // Find interview
  const interview = application.interviews.id(interviewId);
  if (!interview) {
    throw new NotFoundError(`No interview found with id ${interviewId}`);
  }
  
  // Add feedback
  interview.feedback.push({
    rating,
    strengths: strengths || [],
    weaknesses: weaknesses || [],
    notes,
    recommendation,
    createdBy: new mongoose.Types.ObjectId(userId),
    createdAt: new Date()
  });
  
  await application.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Interview feedback added successfully',
    application
  });
});

/**
 * Get all applications for a job (for employers)
 * @route GET /api/v1/applicants/jobs/:jobId/applications
 */
export const getJobApplications = asyncWrapper(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const user = await User.findById(userId);
  if (!user || user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized to access this resource');
  }
  
  // Check if job exists and belongs to employer
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  });
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }
  
  // Get applications
  const applications = await JobApplication.find({ jobId })
    .populate({
      path: 'applicantId',
      select: 'headline skills workExperience education'
    });
  
  // Get applicant user details
  const applicantIds = applications.map((app: any) =>
    (app.applicantId as any).userId
  );
  
  const applicantUsers = await User.find({
    _id: { $in: applicantIds }
  }).select('name email');
  
  const userMap = applicantUsers.reduce((map: Record<string, any>, user: any) => {
    map[user._id.toString()] = user;
    return map;
  }, {} as Record<string, any>);
  
  // Combine application data with user data
  const enrichedApplications = applications.map((app: any) => {
    const applicantProfile = app.applicantId as any;
    return {
      ...app.toObject(),
      applicant: {
        ...applicantProfile,
        user: userMap[applicantProfile.userId.toString()]
      }
    };
  });
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: applications.length,
    applications: enrichedApplications
  });
});

/**
 * Get application statistics (for employers)
 * @route GET /api/v1/applicants/jobs/:jobId/stats
 */
export const getJobApplicationStats = asyncWrapper(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const user = await User.findById(userId);
  if (!user || user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized to access this resource');
  }
  
  // Check if job exists and belongs to employer
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  });
  
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }
  
  // Get application stats
  const stats = await JobApplication.aggregate([
    { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
  ]);
  
  // Format stats
  const formattedStats = stats.reduce((acc: Record<string, number>, stat: any) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {} as Record<string, number>);
  
  // Get total applications
  const totalApplications = await JobApplication.countDocuments({ jobId });
  
  // Get applications over time
  const applicationsOverTime = await JobApplication.aggregate([
    { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' } },
      count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } }
  ]);
  
  res.status(StatusCodes.OK).json({
    success: true,
    stats: {
      total: totalApplications,
      byStatus: formattedStats,
      overTime: applicationsOverTime
    }
  });
});

// Made with Bob
