import mongoose from 'mongoose';
import { IMessage } from '../interfaces/Message';

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: [200, 'Subject cannot be more than 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [10000, 'Content cannot be more than 10000 characters'],
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for faster queries
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ recipient: 1, isRead: 1 });
MessageSchema.index({ relatedJob: 1 });
MessageSchema.index({ relatedApplication: 1 });
MessageSchema.index({ createdAt: -1 });

// Create a text index for searching
MessageSchema.index({
  subject: 'text',
  content: 'text',
});

// Create a virtual for conversation ID
MessageSchema.virtual('conversationId').get(function () {
  // Sort the IDs to ensure consistent conversation IDs
  const ids = [this.sender.toString(), this.recipient.toString()].sort();
  return ids.join('_');
});

// Create a static method to get conversations
MessageSchema.statics.getConversations = async function (userId: string) {
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { recipient: new mongoose.Types.ObjectId(userId) }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $lt: ['$sender', '$recipient'] },
            then: { $concat: [{ $toString: '$sender' }, '_', { $toString: '$recipient' }] },
            else: { $concat: [{ $toString: '$recipient' }, '_', { $toString: '$sender' }] },
          },
        },
        lastMessage: { $first: '$$ROOT' },
        messages: { $push: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: {
              if: { $and: [{ $eq: ['$recipient', new mongoose.Types.ObjectId(userId)] }, { $eq: ['$isRead', false] }] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        let: { senderId: '$lastMessage.sender', recipientId: '$lastMessage.recipient' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [{ $eq: ['$_id', '$$senderId'] }, { $eq: ['$_id', '$$recipientId'] }],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              role: 1,
            },
          },
        ],
        as: 'participants',
      },
    },
    {
      $project: {
        _id: 1,
        participants: 1,
        lastMessage: {
          content: '$lastMessage.content',
          sender: '$lastMessage.sender',
          createdAt: '$lastMessage.createdAt',
          isRead: '$lastMessage.isRead',
        },
        unreadCount: 1,
        createdAt: '$lastMessage.createdAt',
        updatedAt: '$lastMessage.updatedAt',
      },
    },
    {
      $sort: { 'lastMessage.createdAt': -1 },
    },
  ]);

  return conversations;
};

// Add the statics to the MessageSchema
interface MessageModel extends mongoose.Model<IMessage> {
  getConversations(userId: string): Promise<any[]>;
}

export default mongoose.model<IMessage, MessageModel>('Message', MessageSchema);

// Made with Bob
