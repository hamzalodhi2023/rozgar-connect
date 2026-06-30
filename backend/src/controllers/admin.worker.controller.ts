import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { Review } from '../models/Review.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const getAllWorkerProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workers = await WorkerProfile.find().populate('userId', 'name email').sort({ createdAt: -1 });
    return sendSuccess(res, 'All worker profiles retrieved successfully', { workers });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const profile = await WorkerProfile.findById(id);
    if (!profile) {
      return sendError(res, 'Worker profile not found', 404);
    }

    // Delete associated reviews
    await Review.deleteMany({ workerId: id });

    // Remove worker role from user
    await User.findByIdAndUpdate(profile.userId, {
      $pull: { roles: 'worker' },
    });

    // Delete associated conversations and messages for the worker's user
    const userConversations = await Conversation.find({ participants: profile.userId });
    const conversationIds = userConversations.map((c) => c._id);
    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversationId: { $in: conversationIds } });
      await Conversation.deleteMany({ _id: { $in: conversationIds } });
    }

    // Delete profile
    await WorkerProfile.findByIdAndDelete(id);

    return sendSuccess(res, 'Worker profile and associated chats deleted successfully, user role demoted to customer');
  } catch (error) {
    next(error);
  }
};

export const verifyWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const profile = await WorkerProfile.findById(id);
    if (!profile) {
      return sendError(res, 'Worker profile not found', 404);
    }

    profile.isVerified = true;
    profile.verificationStatus = 'verified';
    await profile.save();

    return sendSuccess(res, 'Worker profile verified successfully', { profile });
  } catch (error) {
    next(error);
  }
};

export const rejectWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const profile = await WorkerProfile.findById(id);
    if (!profile) {
      return sendError(res, 'Worker profile not found', 404);
    }

    profile.isVerified = false;
    profile.verificationStatus = 'rejected';
    await profile.save();

    return sendSuccess(res, 'Worker verification rejected successfully', { profile });
  } catch (error) {
    next(error);
  }
};
