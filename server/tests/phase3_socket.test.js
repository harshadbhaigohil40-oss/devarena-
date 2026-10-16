const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const jwt = require('jsonwebtoken');
const { io: Client } = require('socket.io-client');
const { initSocket } = require('../config/socket');
const User = require('../models/User');
const Message = require('../models/Message');

describe('PHASE 3 - Socket.IO Authentication & Hardening', () => {
  let server, ioServer, port;
  const mockUserId = '507f1f77bcf86cd799439011';
  const otherUserId = '507f1f77bcf86cd799439022';
  const secret = process.env.JWT_SECRET || 'phase3-hardening-secret-for-jwt-testing-32-chars';
  process.env.JWT_SECRET = secret;

  before((t, done) => {
    server = http.createServer();
    ioServer = initSocket(server);
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  after((t, done) => {
    ioServer.close();
    server.close(done);
  });

  it('unauthenticated socket connection is rejected', (t, done) => {
    const client = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
    });

    client.on('connect_error', (err) => {
      assert.ok(err.message.includes('Authentication error'), 'Expected auth error');
      client.close();
      done();
    });

    client.on('connect', () => {
      client.close();
      done(new Error('Unauthenticated socket should not connect'));
    });
  });

  it('authenticated socket connects, auto-joins its room, and cannot join another room via join event', (t, done) => {
    const origFindById = User.findById;
    User.findById = () => ({
      select: async () => ({
        _id: mockUserId,
        username: 'validuser',
        role: 'developer',
      }),
    });

    const token = jwt.sign({ id: mockUserId, role: 'developer' }, secret);
    const client = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token },
      reconnection: false,
    });

    client.on('connect', () => {
      // Find the server-side socket instance
      const sockets = Array.from(ioServer.sockets.sockets.values());
      const serverSocket = sockets.find((s) => s.userId === mockUserId);

      assert.ok(serverSocket, 'Server socket should have attached userId');
      assert.ok(serverSocket.rooms.has(`user:${mockUserId}`), 'Socket must auto-join its own user room');

      // Attempt client-driven join event to another room
      client.emit('join', otherUserId);

      setTimeout(() => {
        assert.strictEqual(
          serverSocket.rooms.has(`user:${otherUserId}`),
          false,
          'Socket must not join another user room via join event'
        );
        client.close();
        User.findById = origFindById;
        done();
      }, 50);
    });

    client.on('connect_error', (err) => {
      client.close();
      User.findById = origFindById;
      done(err);
    });
  });

  it('send:message ignores spoofed senderId and validates receiverId', (t, done) => {
    const origFindById = User.findById;
    const origExists = User.exists;
    const origCreate = Message.create;

    User.findById = () => ({
      select: async () => ({
        _id: mockUserId,
        username: 'senderUser',
        role: 'developer',
      }),
    });
    User.exists = async () => true;

    let savedMessage = null;
    Message.create = async (payload) => {
      savedMessage = payload;
      return { _id: 'msg123', ...payload };
    };

    const token = jwt.sign({ id: mockUserId, role: 'developer' }, secret);
    const client = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token },
      reconnection: false,
    });

    client.on('connect', () => {
      // Send message with spoofed senderId
      client.emit('send:message', {
        senderId: 'spoofed_admin_id',
        receiverId: otherUserId,
        content: 'Legitimate chat content',
      });
    });

    client.on('message:sent', (msg) => {
      assert.ok(savedMessage, 'Message should have been saved');
      assert.strictEqual(
        savedMessage.senderId,
        mockUserId,
        'Sender ID must be derived from socket.userId, ignoring spoofed senderId'
      );
      assert.strictEqual(savedMessage.receiverId, otherUserId);
      assert.strictEqual(savedMessage.content, 'Legitimate chat content');

      client.close();
      User.findById = origFindById;
      User.exists = origExists;
      Message.create = origCreate;
      done();
    });

    client.on('connect_error', (err) => {
      client.close();
      User.findById = origFindById;
      User.exists = origExists;
      Message.create = origCreate;
      done(err);
    });
  });
});
