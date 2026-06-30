import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'name email roles')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'senderId',
          select: 'name',
        },
      })
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 'Conversations retrieved successfully', { conversations });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Check if conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return sendError(res, 'Conversation not found', 404);
    }

    if (!conversation.participants.includes(userId)) {
      return sendError(res, 'Access denied. You are not a participant in this conversation.', 403);
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    return sendSuccess(res, 'Messages retrieved successfully', { messages });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    if (senderId === recipientId) {
      return sendError(res, 'You cannot start a conversation with yourself', 400);
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return sendError(res, 'Recipient not found', 404);
    }

    // Check if conversation already exists between the two
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
      });
      await conversation.save();
    }

    // Populate details
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email roles')
      .populate('lastMessage');

    return sendSuccess(res, 'Conversation ready', { conversation: populatedConversation });
  } catch (error) {
    next(error);
  }
};
