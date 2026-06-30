import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { Review } from '../models/Review.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { generateAccessToken } from '../utils/jwt.utils.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return sendError(res, 'Current password is required to set a new password', 400);
      }
      const isMatch = await (user as any).comparePassword(currentPassword);
      if (!isMatch) {
        return sendError(res, 'Incorrect current password', 400);
      }
      user.password = newPassword;
    }

    await user.save();

    // Generate a fresh access token containing updated details (like name changes or new token params)
    const accessToken = generateAccessToken(user);

    return sendSuccess(res, 'Profile updated successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const becomeWorker = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.roles.includes('worker')) {
      return sendError(res, 'User is already a worker', 400);
    }

    // Add worker to roles list
    user.roles.push('worker');
    await user.save();

    const accessToken = generateAccessToken(user);

    return sendSuccess(res, 'Successfully updated role. Proceed to profile setup.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    // Delete associated worker profile if exists
    await WorkerProfile.findOneAndDelete({ userId });
    
    // Delete associated reviews
    await Review.deleteMany({ customerId: userId });
    
    // Delete associated conversations and messages
    const userConversations = await Conversation.find({ participants: userId });
    const conversationIds = userConversations.map((c) => c._id);
    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversationId: { $in: conversationIds } });
      await Conversation.deleteMany({ _id: { $in: conversationIds } });
    }
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    return sendSuccess(res, 'Your account and all associated profiles/reviews/chats have been deleted successfully');
  } catch (error) {
    next(error);
  }
};
