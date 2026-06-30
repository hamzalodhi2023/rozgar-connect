import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { Review } from '../models/Review.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkers = await WorkerProfile.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Group users by roles
    const customersCount = await User.countDocuments({ roles: 'customer' });
    const workersCount = await User.countDocuments({ roles: 'worker' });
    const adminsCount = await User.countDocuments({ roles: 'admin' });

    return sendSuccess(res, 'Admin stats retrieved successfully', {
      stats: {
        totalUsers,
        totalWorkers,
        totalReviews,
        customersCount,
        workersCount,
        adminsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
    return sendSuccess(res, 'All users retrieved successfully', { users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return sendError(res, 'You cannot delete your own admin account', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Delete associated worker profile if exists
    await WorkerProfile.findOneAndDelete({ userId: id });

    // Delete associated reviews
    await Review.deleteMany({ customerId: id });

    // Delete associated conversations and messages
    const userConversations = await Conversation.find({ participants: id });
    const conversationIds = userConversations.map((c) => c._id);
    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversationId: { $in: conversationIds } });
      await Conversation.deleteMany({ _id: { $in: conversationIds } });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return sendSuccess(res, 'User and all associated profiles/reviews/chats deleted successfully');
  } catch (error) {
    next(error);
  }
};

// DEV ONLY SEED: promotes a user to admin for testing
export const seedAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    const user: any = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
      await user.save();
    }

    return sendSuccess(res, `User ${email} has been promoted to admin successfully`, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return sendError(res, 'You cannot deactivate your own admin account', 400);
    }

    const user: any = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return sendSuccess(res, `User status updated to ${user.isActive ? 'Active' : 'Inactive'} successfully`, {
      userId: user._id,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};
