const { describe, it } = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const User = require('../models/User');
const { toPublicProfile } = require('../models/User');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const Message = require('../models/Message');

describe('PHASE 2 - Data Leak Prevention & Session Hardening', () => {
  it('getConversations positive projection excludes passwordHash, refreshToken, verificationToken, resetPasswordToken, googleId, email', async () => {
    const origAggregate = Message.aggregate;

    // Simulate aggregation pipeline execution
    Message.aggregate = async (pipeline) => {
      const projectStage = pipeline.find((stage) => stage.$project);
      assert.ok(projectStage, 'Pipeline must include $project stage');
      assert.strictEqual(projectStage.$project['user.password'], undefined, 'Must not use negative exclusion for user.password');
      assert.strictEqual(projectStage.$project['user.email'], undefined, 'Must not use negative exclusion for user.email');
      assert.strictEqual(projectStage.$project['user.username'], 1, 'Must positively project user.username');
      assert.strictEqual(projectStage.$project['user.avatar'], 1, 'Must positively project user.avatar');
      assert.strictEqual(projectStage.$project['user.level'], 1, 'Must positively project user.level');
      assert.strictEqual(projectStage.$project['user.role'], 1, 'Must positively project user.role');
      assert.strictEqual(projectStage.$project.lastMessage, 1, 'Must project lastMessage');

      return [
        {
          _id: 'conv123',
          lastMessage: { content: 'hello', createdAt: new Date() },
          user: {
            _id: 'user123',
            username: 'dev_user',
            avatar: 'avatar.png',
            level: 3,
            role: 'developer',
          },
        },
      ];
    };

    try {
      let jsonBody = null;
      const res = {
        json(data) {
          jsonBody = data;
          return this;
        },
      };

      await messageController.getConversations({ userId: 'currentUser123' }, res, () => {});

      assert.strictEqual(jsonBody.status, 'success');
      const convUser = jsonBody.data.conversations[0].user;
      assert.strictEqual(convUser.passwordHash, undefined);
      assert.strictEqual(convUser.refreshToken, undefined);
      assert.strictEqual(convUser.verificationToken, undefined);
      assert.strictEqual(convUser.resetPasswordToken, undefined);
      assert.strictEqual(convUser.googleId, undefined);
      assert.strictEqual(convUser.email, undefined);
      assert.strictEqual(convUser.username, 'dev_user');
    } finally {
      Message.aggregate = origAggregate;
    }
  });

  it('logout invalidates the refresh token in the database', async () => {
    const origFindByIdAndUpdate = User.findByIdAndUpdate;
    let updatedUserId = null;
    let updatePayload = null;

    User.findByIdAndUpdate = async (id, update) => {
      updatedUserId = id;
      updatePayload = update;
      return { _id: id };
    };

    let clearedCookie = null;
    let jsonBody = null;
    const req = {
      userId: 'user_to_logout_123',
    };
    const res = {
      clearCookie(name) {
        clearedCookie = name;
      },
      status(code) {
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    try {
      await authController.logout(req, res, () => {});
      assert.strictEqual(updatedUserId, 'user_to_logout_123');
      assert.strictEqual(updatePayload.refreshToken, null, 'Logout must set refreshToken to null');
      assert.strictEqual(clearedCookie, 'refreshToken');
      assert.strictEqual(jsonBody.success, true);
    } finally {
      User.findByIdAndUpdate = origFindByIdAndUpdate;
    }
  });

  it('refresh tokens are hashed at rest with sha256', async () => {
    const origFindOne = User.findOne;
    let queriedFilter = null;

    User.findOne = async (filter) => {
      queriedFilter = filter;
      return null;
    };

    const rawToken = 'test_raw_refresh_token_string';
    const expectedHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    let statusCode = null;
    const req = {
      cookies: {
        refreshToken: rawToken,
      },
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json() {
        return this;
      },
    };

    try {
      await authController.refresh(req, res, () => {});
      assert.ok(queriedFilter && queriedFilter.refreshToken, 'Should query by refreshToken hash');
      assert.strictEqual(queriedFilter.refreshToken, expectedHash, 'Should query with sha256 hash of raw token');
      assert.strictEqual(statusCode, 403, 'Unknown token hash returns 403');
    } finally {
      User.findOne = origFindOne;
    }
  });

  it('login rejects unverified email with HTTP 403 for local accounts', async () => {
    const origFindOne = User.findOne;
    const unverifiedUser = {
      email: 'unverified@example.com',
      authProvider: 'local',
      isEmailVerified: false,
    };

    User.findOne = async () => unverifiedUser;

    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    try {
      await authController.login(
        { body: { email: 'unverified@example.com', password: 'password123' } },
        res,
        () => {}
      );

      assert.strictEqual(statusCode, 403, 'Unverified user must receive 403');
      assert.strictEqual(jsonBody.success, false);
      assert.ok(jsonBody.error.includes('verify your email'));
    } finally {
      User.findOne = origFindOne;
    }
  });

  it('public profile endpoint never returns email or sensitive session tokens', async () => {
    const origFindById = User.findById;

    const mockUserDoc = {
      _id: 'user_pub_123',
      username: 'alice_coder',
      email: 'alice@secret.com',
      passwordHash: 'secret_hash',
      refreshToken: 'secret_refresh',
      verificationToken: 'secret_verify',
      verificationTokenExpires: new Date(Date.now() + 10000),
      resetPasswordToken: 'secret_reset',
      resetPasswordExpires: new Date(Date.now() + 10000),
      failedLoginAttempts: 3,
      lockUntil: new Date(),
      googleId: 'google_12345',
      bio: 'Full stack developer',
      level: 5,
      xp: 2500,
      toObject() {
        return { ...this };
      },
    };

    User.findById = async () => mockUserDoc;

    let jsonBody = null;
    const res = {
      status(code) {
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    try {
      await userController.getProfile({ params: { id: 'user_pub_123' } }, res, () => {});

      assert.strictEqual(jsonBody.success, true);
      const pubUser = jsonBody.data.user;
      assert.strictEqual(pubUser.email, undefined, 'Public profile must NOT expose email');
      assert.strictEqual(pubUser.passwordHash, undefined);
      assert.strictEqual(pubUser.refreshToken, undefined);
      assert.strictEqual(pubUser.verificationToken, undefined);
      assert.strictEqual(pubUser.resetPasswordToken, undefined);
      assert.strictEqual(pubUser.googleId, undefined);
      assert.strictEqual(pubUser.username, 'alice_coder');
    } finally {
      User.findById = origFindById;
    }
  });
});
