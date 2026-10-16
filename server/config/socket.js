const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');
const { normalizeOrigin } = require('../utils/urlHelper');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowedOrigins = new Set(
          (process.env.CLIENT_URL || 'http://localhost:5173')
            .split(',')
            .map(normalizeOrigin)
            .filter(Boolean)
        );
        const normalizedIncoming = normalizeOrigin(origin);
        if (normalizedIncoming && allowedOrigins.has(normalizedIncoming)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid token'));
      }

      const user = await User.findById(decoded.id).select('_id username role');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    // Auto-join private room for authenticated user
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);
    console.log(`🔌 Socket connected: ${socket.id} (user: ${socket.userId})`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });

    // Handle private messaging
    socket.on('send:message', async (data) => {
      try {
        // Rate-limit per socket: 20 msgs/10s
        const now = Date.now();
        if (!socket.messageTimestamps) socket.messageTimestamps = [];
        socket.messageTimestamps = socket.messageTimestamps.filter((t) => now - t < 10000);
        if (socket.messageTimestamps.length >= 20) {
          socket.emit('message:error', { error: 'Rate limit exceeded. Maximum 20 messages per 10 seconds.' });
          return;
        }
        socket.messageTimestamps.push(now);

        const { receiverId, content } = data || {};

        // Ignore senderId from payload, use authenticated socket.userId
        const senderId = socket.userId;

        // Validate receiverId: valid ObjectId, user exists, not self
        if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
          socket.emit('message:error', { error: 'Invalid receiver ID format.' });
          return;
        }

        if (receiverId.toString() === senderId.toString()) {
          socket.emit('message:error', { error: 'Cannot send messages to yourself.' });
          return;
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
          socket.emit('message:error', { error: 'Recipient does not exist.' });
          return;
        }

        // Validate content: string, 1-2000 chars
        if (typeof content !== 'string') {
          socket.emit('message:error', { error: 'Message content must be a string.' });
          return;
        }

        const trimmedContent = content.trim();
        if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
          socket.emit('message:error', { error: 'Message content must be between 1 and 2000 characters.' });
          return;
        }

        // Save to DB
        const message = await Message.create({
          senderId,
          receiverId,
          content: trimmedContent,
        });

        // Broadcast to receiver
        io.to(`user:${receiverId}`).emit('receive:message', message);

        // Send confirmation back to sender
        socket.emit('message:sent', message);
      } catch (err) {
        console.error('Message error:', err);
        socket.emit('message:error', { error: 'Failed to send message.' });
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
