import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Message from '../models/Message';
import User from '../models/User';
import asyncWrapper from '../middleware/async';
import { BadRequestError, NotFoundError } from '../errors';
import mongoose from 'mongoose';

/**
 * Get all conversations for the current user
 * @route GET /api/v1/messages/conversations
 */
export const getConversations = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  const conversations = await Message.getConversations(userId as string);
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: conversations.length,
    conversations,
  });
});

/**
 * Get messages for a specific conversation
 * @route GET /api/v1/messages/conversations/:conversationId
 */
export const getConversationMessages = asyncWrapper(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user?.userId;
  
  // Parse the conversation ID to get the participant IDs
  const participantIds = conversationId.split('_');
  
  // Ensure the current user is part of the conversation
  if (!participantIds.includes(userId as string)) {
    throw new BadRequestError('You are not part of this conversation');
  }
  
  // Get all messages for the conversation
  const messages = await Message.find({
    $or: [
      { sender: participantIds[0], recipient: participantIds[1] },
      { sender: participantIds[1], recipient: participantIds[0] },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('relatedJob', 'position company')
    .populate('relatedApplication');
  
  // Mark messages as read if the current user is the recipient
  await Message.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: messages.length,
    messages,
  });
});

/**
 * Send a new message
 * @route POST /api/v1/messages
 */
export const sendMessage = asyncWrapper(async (req: Request, res: Response) => {
  const { recipient, subject, content, relatedJob, relatedApplication, attachments } = req.body;
  const sender = req.user?.userId;
  
  // Check if recipient exists
  const recipientUser = await User.findById(recipient);
  if (!recipientUser) {
    throw new NotFoundError(`No user found with id ${recipient}`);
  }
  
  // Create the message
  const message = await Message.create({
    sender,
    recipient,
    subject,
    content,
    relatedJob,
    relatedApplication,
    attachments,
  });
  
  // Populate sender and recipient details
  await message.populate('sender', 'name email role');
  await message.populate('recipient', 'name email role');
  
  // Populate related job and application if provided
  if (relatedJob) {
    await message.populate('relatedJob', 'position company');
  }
  
  if (relatedApplication) {
    await message.populate('relatedApplication');
  }
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message,
  });
});

/**
 * Mark a message as read
 * @route PATCH /api/v1/messages/:messageId/read
 */
export const markMessageAsRead = asyncWrapper(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user?.userId;
  
  // Find the message
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new NotFoundError(`No message found with id ${messageId}`);
  }
  
  // Ensure the current user is the recipient
  if (message.recipient.toString() !== userId) {
    throw new BadRequestError('You are not the recipient of this message');
  }
  
  // Mark as read
  message.isRead = true;
  message.readAt = new Date();
  await message.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message,
  });
});

/**
 * Delete a message
 * @route DELETE /api/v1/messages/:messageId
 */
export const deleteMessage = asyncWrapper(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user?.userId;
  
  // Find the message
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new NotFoundError(`No message found with id ${messageId}`);
  }
  
  // Ensure the current user is the sender or recipient
  if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
    throw new BadRequestError('You are not authorized to delete this message');
  }
  
  // Delete the message
  await message.remove();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Message deleted successfully',
  });
});

/**
 * Get unread message count
 * @route GET /api/v1/messages/unread/count
 */
export const getUnreadMessageCount = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  const count = await Message.countDocuments({
    recipient: userId,
    isRead: false,
  });
  
  res.status(StatusCodes.OK).json({
    success: true,
    count,
  });
});

/**
 * Search messages
 * @route GET /api/v1/messages/search
 */
export const searchMessages = asyncWrapper(async (req: Request, res: Response) => {
  const { query } = req.query;
  const userId = req.user?.userId;
  
  if (!query) {
    throw new BadRequestError('Search query is required');
  }
  
  const messages = await Message.find({
    $and: [
      { $or: [{ sender: userId }, { recipient: userId }] },
      { $text: { $search: query as string } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('relatedJob', 'position company')
    .populate('relatedApplication');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: messages.length,
    messages,
  });
});

// Made with Bob
