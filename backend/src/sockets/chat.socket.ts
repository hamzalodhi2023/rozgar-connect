import { verifyAccessToken } from '../utils/jwt.utils.js';
import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';

const onlineUsers = new Map(); // userId -> Set of socketIds

export const setupChatSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.user = decoded;
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`Socket connected: User ${userId} (${socket.id})`);

    // Add user to online user map
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Send the current list of online users to the newly connected user
    socket.emit('onlineUsersList', Array.from(onlineUsers.keys()));
    // Broadcast updated list to all other clients
    io.emit('onlineUsersList', Array.from(onlineUsers.keys()));

    // Join a personal room based on user ID
    socket.join(`user_${userId}`);

    // Join specific conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Handle user typing
    socket.on('typing', (data) => {
      const { conversationId } = data;
      if (conversationId) {
        socket.to(`conversation_${conversationId}`).emit('userTyping', {
          conversationId,
          userId,
          typing: true,
        });
      }
    });

    // Handle user stop typing
    socket.on('stopTyping', (data) => {
      const { conversationId } = data;
      if (conversationId) {
        socket.to(`conversation_${conversationId}`).emit('userTyping', {
          conversationId,
          userId,
          typing: false,
        });
      }
    });

    // Handle sending message
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, content, recipientId } = data;

        if (!conversationId || !content) {
          return socket.emit('error', { message: 'Conversation ID and content are required' });
        }

        // Save message to Database
        const message = new Message({
          conversationId,
          senderId: userId,
          content,
        });
        await message.save();

        // Update Conversation's lastMessage
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
        });

        const populatedMessage = await Message.findById(message._id).populate('senderId', 'name');

        // Broadcast to conversation room (realtime messages in active chat)
        io.to(`conversation_${conversationId}`).emit('newMessage', populatedMessage);

        // Also emit to the recipient's personal room to trigger active chat lists updates
        io.to(`user_${recipientId}`).emit('newConversationUpdate', {
          conversationId,
          lastMessage: populatedMessage,
        });

        // Send confirmation back to sender for updating conversation list too
        socket.emit('messageSent', populatedMessage);

      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: User ${userId} (${socket.id})`);
      if (onlineUsers.has(userId)) {
        const sockets = onlineUsers.get(userId);
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
      // Broadcast updated list to all clients
      io.emit('onlineUsersList', Array.from(onlineUsers.keys()));
    });
  });
};
