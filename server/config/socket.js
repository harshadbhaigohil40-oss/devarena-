const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });

    // Handle private messaging
    socket.on('send:message', async (data) => {
      try {
        const Message = require('../models/Message');
        const { senderId, receiverId, content } = data;
        
        // Save to DB
        const message = await Message.create({ senderId, receiverId, content });
        
        // Broadcast to receiver
        io.to(`user:${receiverId}`).emit('receive:message', message);
        
        // Send confirmation back to sender
        socket.emit('message:sent', message);
      } catch (err) {
        console.error('Message error:', err);
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
