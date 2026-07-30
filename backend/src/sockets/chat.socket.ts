import { verifyAccessToken } from '../utils/jwt.utils.js';
import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { Job } from '../models/Job.js';

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

        // Enforce job authorization
        const validJob = await Job.findOne({
          $or: [
            { customerId: userId, workerId: recipientId },
            { customerId: recipientId, workerId: userId },
          ],
          status: { $in: ['accepted', 'in-progress', 'worker-completed', 'completed'] },
        });

        if (!validJob) {
          return socket.emit('error', { message: 'Chat is disabled. You must have an active job with this user.' });
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

    // ----------------------------------------------------
    // LIVE LOCATION TRACKING
    // ----------------------------------------------------
    socket.on('subscribeToLocation', (workerId) => {
      const room = `location_${workerId}`;
      socket.join(room);
      console.log(`User ${userId} subscribed to location tracking for worker ${workerId}`);
    });

    socket.on('unsubscribeFromLocation', (workerId) => {
      const room = `location_${workerId}`;
      socket.leave(room);
      console.log(`User ${userId} unsubscribed from location tracking for worker ${workerId}`);
    });

    socket.on('updateLocation', async (data) => {
      const { latitude, longitude } = data;
      
      // Broadcast to anyone subscribed to this worker's location
      io.to(`location_${userId}`).emit('workerLocationUpdate', {
        workerId: userId,
        latitude,
        longitude,
        timestamp: new Date()
      });

      // Throttle DB updates (save max once per minute)
      try {
        const now = Date.now();
        const lastUpdate = (socket as any).lastLocationUpdate || 0;
        if (now - lastUpdate > 60000) { // 60 seconds
          (socket as any).lastLocationUpdate = now;
          
          // Using dynamic import or mongoose model if imported at top
          // We'll require it inside to avoid circular deps if any, or just import it at top
          const { WorkerProfile } = await import('../models/WorkerProfile.js');
          await WorkerProfile.findOneAndUpdate(
            { userId: userId },
            { $set: { latitude, longitude } }
          );
        }
      } catch (err) {
        console.error('Failed to update worker location in DB:', err);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: User ${userId} (${socket.id})`);
      if (onlineUsers.has(userId)) {
        const sockets = onlineUsers.get(userId);
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          
          // Update lastSeen
          try {
            const { User } = await import('../models/User.js');
            await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
          } catch (err) {
            console.error('Failed to update lastSeen in DB:', err);
          }
        }
      }
      // Broadcast updated list to all clients
      io.emit('onlineUsersList', Array.from(onlineUsers.keys()));
    });
  });
};
