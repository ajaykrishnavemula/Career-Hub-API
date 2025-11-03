import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Company from '../models/Company';
import Job from '../models/Job';
import asyncWrapper from '../middleware/async';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors';

/**
 * Create a new company
 * @route POST /api/v1/companies
 */
export const createCompany = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Add createdBy field
  req.body.createdBy = userId;
  
  // Add creator as owner in team members
  if (!req.body.teamMembers) {
    req.body.teamMembers = [];
  }
  req.body.teamMembers.push({
    userId,
    role: 'owner',
  });
  
  // Create company
  const company = await Company.create(req.body);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Company created successfully',
    company,
  });
});

/**
 * Get all companies with filtering, sorting, and pagination
 * @route GET /api/v1/companies
 */
export const getAllCompanies = asyncWrapper(async (req: Request, res: Response) => {
  const {
    industry,
    companySize,
    location,
    search,
    isVerified,
    sort,
    page = 1,
    limit = 10,
  } = req.query;
  
  // Build query
  const query: any = {};
  
  // Filter by industry
  if (industry) {
    query.industry = industry;
  }
  
  // Filter by company size
  if (companySize) {
    query.companySize = companySize;
  }
  
  // Filter by location
  if (location) {
    query.$or = [
      { 'locations.city': { $regex: location, $options: 'i' } },
      { 'locations.country': { $regex: location, $options: 'i' } },
      { 'headquarters.city': { $regex: location, $options: 'i' } },
      { 'headquarters.country': { $regex: location, $options: 'i' } },
    ];
  }
  
  // Filter by verification status
  if (isVerified !== undefined) {
    query.isVerified = isVerified === 'true';
  }
  
  // Text search
  if (search) {
    query.$text = { $search: search as string };
  }
  
  // Sorting
  let sortOption: any = { createdAt: -1 }; // Default: newest first
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'name') {
    sortOption = { name: 1 };
  } else if (sort === 'rating') {
    sortOption = { averageRating: -1 };
  }
  
  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  
  // Execute query
  const companies = await Company.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .select('-reviews -teamMembers'); // Exclude large arrays for list view
  
  // Get total count
  const total = await Company.countDocuments(query);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: companies.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    companies,
  });
});

/**
 * Get a single company by ID or slug
 * @route GET /api/v1/companies/:identifier
 */
export const getCompany = asyncWrapper(async (req: Request, res: Response) => {
  const { identifier } = req.params;
  
  // Try to find by ID first, then by slug
  let company = await Company.findById(identifier).populate('createdBy', 'name email');
  
  if (!company) {
    company = await Company.findOne({ slug: identifier }).populate('createdBy', 'name email');
  }
  
  if (!company) {
    throw new NotFoundError(`No company found with identifier ${identifier}`);
  }
  
  // Get job count for this company
  const jobCount = await Job.countDocuments({ 
    company: company.name,
    status: 'published'
  });
  
  res.status(StatusCodes.OK).json({
    success: true,
    company: {
      ...company.toObject(),
      jobCount,
    },
  });
});

/**
 * Update a company
 * @route PATCH /api/v1/companies/:id
 */
export const updateCompany = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find company
  const company = await Company.findById(id);
  
  if (!company) {
    throw new NotFoundError(`No company found with id ${id}`);
  }
  
  // Check if user is authorized (owner or admin)
  const teamMember = company.teamMembers.find(
    (member: any) => member.userId.toString() === userId
  );
  
  if (!teamMember || !['owner', 'admin'].includes(teamMember.role)) {
    throw new UnauthenticatedError('Not authorized to update this company');
  }
  
  // Don't allow updating certain fields
  delete req.body.createdBy;
  delete req.body.teamMembers;
  delete req.body.reviews;
  delete req.body.averageRating;
  
  // Update company
  const updatedCompany = await Company.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Company updated successfully',
    company: updatedCompany,
  });
});

/**
 * Delete a company
 * @route DELETE /api/v1/companies/:id
 */
export const deleteCompany = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  // Find company
  const company = await Company.findById(id);
  
  if (!company) {
    throw new NotFoundError(`No company found with id ${id}`);
  }
  
  // Check if user is the owner
  const teamMember = company.teamMembers.find(
    (member: any) => member.userId.toString() === userId
  );
  
  if (!teamMember || teamMember.role !== 'owner') {
    throw new UnauthenticatedError('Only company owner can delete the company');
  }
  
  // Delete company
  await Company.findByIdAndDelete(id);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Company deleted successfully',
  });
});

/**
 * Get companies created by or managed by the current user
 * @route GET /api/v1/companies/my-companies
 */
export const getMyCompanies = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { page = 1, limit = 10 } = req.query;
  
  // Find companies where user is a team member
  const query = {
    'teamMembers.userId': userId,
  };
  
  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  
  // Execute query
  const companies = await Company.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
  
  // Get total count
  const total = await Company.countDocuments(query);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: companies.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    companies,
  });
});

/**
 * Add a team member to a company
 * @route POST /api/v1/companies/:id/team
 */
export const addTeamMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { userId: newMemberId, role } = req.body;
  
  if (!newMemberId || !role) {
    throw new BadRequestError('Please provide userId and role');
  }
  
  // Validate role
  const validRoles = ['admin', 'recruiter', 'viewer'];
  if (!validRoles.includes(role)) {
    throw new BadRequestError(`Role must be one of: ${validRoles.join(', ')}`);
  }
  
  // Find company
  const company = await Company.findById(id);
  
  if (!company) {
    throw new NotFoundError(`No company found with id ${id}`);
  }
  
  // Check if user is authorized (owner or admin)
  const teamMember = company.teamMembers.find(
    (member: any) => member.userId.toString() === userId
  );
  
  if (!teamMember || !['owner', 'admin'].includes(teamMember.role)) {
    throw new UnauthenticatedError('Not authorized to add team members');
  }
  
  // Check if member already exists
  const existingMember = company.teamMembers.find(
    (member: any) => member.userId.toString() === newMemberId
  );
  
  if (existingMember) {
    throw new BadRequestError('User is already a team member');
  }
  
  // Add team member
  company.teamMembers.push({
    userId: newMemberId,
    role,
    addedAt: new Date(),
  });
  
  await company.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Team member added successfully',
    company,
  });
});

/**
 * Remove a team member from a company
 * @route DELETE /api/v1/companies/:id/team/:memberId
 */
export const removeTeamMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const userId = req.user?.userId;
  
  // Find company
  const company = await Company.findById(id);
  
  if (!company) {
    throw new NotFoundError(`No company found with id ${id}`);
  }
  
  // Check if user is authorized (owner or admin)
  const teamMember = company.teamMembers.find(
    (member: any) => member.userId.toString() === userId
  );
  
  if (!teamMember || !['owner', 'admin'].includes(teamMember.role)) {
    throw new UnauthenticatedError('Not authorized to remove team members');
  }
  
  // Find member to remove
  const memberToRemove = company.teamMembers.find(
    (member: any) => member.userId.toString() === memberId
  );
  
  if (!memberToRemove) {
    throw new NotFoundError('Team member not found');
  }
  
  // Don't allow removing the owner
  if (memberToRemove.role === 'owner') {
    throw new BadRequestError('Cannot remove company owner');
  }
  
  // Remove team member
  company.teamMembers = company.teamMembers.filter(
    (member: any) => member.userId.toString() !== memberId
  );
  
  await company.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Team member removed successfully',
    company,
  });
});

/**
 * Add a review to a company
 * @route POST /api/v1/companies/:id/reviews
 */
export const addReview = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { rating, title, review, pros, cons, isAnonymous } = req.body;
  
  if (!rating || !title || !review) {
    throw new BadRequestError('Please provide rating, title, and review');
  }
  
  // Find company
  const company = await Company.findById(id);
  
  if (!company) {
    throw new NotFoundError(`No company found with id ${id}`);
  }
  
  // Check if user already reviewed
  const existingReview = company.reviews.find(
    (r: any) => r.userId.toString() === userId
  );
  
  if (existingReview) {
    throw new BadRequestError('You have already reviewed this company');
  }
  
  // Add review
  company.reviews.push({
    userId,
    rating,
    title,
    review,
    pros,
    cons,
    isAnonymous: isAnonymous || false,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  await company.save();
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Review submitted successfully and is pending approval',
    company,
  });
});

/**
 * Get company reviews
 * @route GET /api/v1/companies/:id/reviews
 */
export const getCompanyReviews = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  // Find company
  const company = await Company.findById(id);
  
  if (!company) {
    throw new NotFoundError(`No company found with id ${id}`);
  }
  
  // Get approved reviews only
  const approvedReviews = company.reviews.filter(
    (review: any) => review.status === 'approved'
  );
  
  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  
  const paginatedReviews = approvedReviews.slice(skip, skip + limitNum);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: paginatedReviews.length,
    total: approvedReviews.length,
    page: pageNum,
    pages: Math.ceil(approvedReviews.length / limitNum),
    averageRating: company.averageRating,
    reviews: paginatedReviews,
  });
});

// Made with Bob