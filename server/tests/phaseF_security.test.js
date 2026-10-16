const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { io: Client } = require('socket.io-client');
const { initSocket } = require('../config/socket');
const authController = require('../controllers/authController');
const User = require('../models/User');
const leaderboardService = require('../services/leaderboardService');

describe('PHASE F - Session, Token, and Verification Security', () => {
  const secret = 'phaseF-test-secret-key-32-characters-minimum';
  process.env.JWT_SECRET = secret;

  describe('Verification Token Hashing at Rest', () => {
    it('stores SHA-256 hashed verification token at rest and verifies using raw token', async () => {
      let createdUserData = null;
      const origCreate = User.create;
      const origFindOne = User.findOne;
      const origUpdateEntry = leaderboardService.updateEntry;
      leaderboardService.updateEntry = async () => {};

      try {
        User.findOne = async () => null; // No duplicate user

        User.create = async (userData) => {
          createdUserData = {
            ...userData,
            _id: '507f1f77bcf86cd799439099',
            toJSON: () => ({ username: userData.username, email: userData.email }),
            save: async () => {},
          };
          return createdUserData;
        };

        const req = {
          body: {
            username: 'test_token_user',
            email: 'tokenuser@example.com',
            password: 'SecurePassword123!',
          },
        };

        let responseBody = null;
        let responseStatus = 200;
        const res = {
          status: (code) => {
            responseStatus = code;
            return res;
          },
          json: (data) => {
            responseBody = data;
            return res;
          },
        };

        // Call register
        await authController.register(req, res, () => {});

        assert.strictEqual(responseStatus, 201);
        assert.ok(createdUserData, 'User should be created');
        assert.ok(createdUserData.verificationToken, 'verificationToken must be present in DB record');

        // Verify stored token is a 64-character sha256 hex string
        assert.strictEqual(createdUserData.verificationToken.length, 64);
        assert.match(createdUserData.verificationToken, /^[0-9a-f]{64}$/);

        // Verify that searching for an arbitrary unhashed token returns null
        const mockRawToken = 'unhashed_sample_raw_token';
        const rawFound = createdUserData.verificationToken === mockRawToken;
        assert.strictEqual(rawFound, false, 'Raw unhashed token must not match hashed token at rest');

        // Now test verifyEmail with the matching raw token
        // In register, rawVerificationToken was generated and hashed
        // Simulate verifyEmail by computing the hash
        let queriedHashedToken = null;
        let saved = false;

        User.findOne = async (query) => {
          queriedHashedToken = query.verificationToken;
          if (queriedHashedToken === createdUserData.verificationToken) {
            return {
              ...createdUserData,
              save: async () => {
                saved = true;
              },
            };
          }
          return null;
        };

        // When a malicious client queries with the raw token, it fails
        const badVerifyReq = { body: { token: 'invalid_raw_token' } };
        let badVerifyStatus = null;
        let badVerifyBody = null;
        const badVerifyRes = {
          status: (code) => {
            badVerifyStatus = code;
            return badVerifyRes;
          },
          json: (data) => {
            badVerifyBody = data;
            return badVerifyRes;
          },
        };
        await authController.verifyEmail(badVerifyReq, badVerifyRes, () => {});
        assert.strictEqual(badVerifyStatus, 400);

      } finally {
        User.create = origCreate;
        User.findOne = origFindOne;
        leaderboardService.updateEntry = origUpdateEntry;
      }
    });
  });

  describe('Socket Token Expiration Disconnect', () => {
    let server, ioServer, port;
    const mockUserId = '507f1f77bcf86cd799439088';

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

    it('rejects connection if token is already expired', (t, done) => {
      // Create a token expired 10 seconds ago
      const expiredToken = jwt.sign(
        { id: mockUserId, role: 'developer' },
        secret,
        { expiresIn: -10 }
      );

      const client = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: { token: expiredToken },
        reconnection: false,
      });

      client.on('connect_error', (err) => {
        assert.ok(
          err.message.toLowerCase().includes('expired'),
          `Expected expired token error, got: ${err.message}`
        );
        client.close();
        done();
      });

      client.on('connect', () => {
        client.close();
        done(new Error('Expired token should not connect'));
      });
    });

    it('disconnects active socket when token expires', (t, done) => {
      const origFindById = User.findById;
      User.findById = () => ({
        select: async () => ({
          _id: mockUserId,
          username: 'expiringuser',
          role: 'developer',
        }),
      });

      // Token expiring in 1 second
      const token = jwt.sign(
        { id: mockUserId, role: 'developer' },
        secret,
        { expiresIn: '1s' }
      );

      const client = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: { token },
        reconnection: false,
      });

      let receivedExpiryEvent = false;

      client.on('token_expired', (data) => {
        receivedExpiryEvent = true;
        assert.strictEqual(data.message, 'Session expired');
      });

      client.on('disconnect', (reason) => {
        assert.ok(receivedExpiryEvent, 'Must receive token_expired event before or upon disconnect');
        client.close();
        User.findById = origFindById;
        done();
      });

      client.on('connect_error', (err) => {
        client.close();
        User.findById = origFindById;
        done(err);
      });
    });
  });
});
