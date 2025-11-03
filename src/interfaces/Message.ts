import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  subject: string;
  content: string;
  relatedJob?: mongoose.Types.ObjectId;
  relatedApplication?: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  attachments?: Array<{
    url: string;
    filename: string;
    fileType: string;
    fileSize: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation {
  _id: string;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
  }>;
  lastMessage: {
    content: string;
    sender: mongoose.Types.ObjectId;
    createdAt: Date;
    isRead: boolean;
  };
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Made with Bob
