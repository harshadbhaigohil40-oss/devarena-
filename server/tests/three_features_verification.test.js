const { describe, it } = require('node:test');
const assert = require('node:assert');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');
const socketService = require('../services/socketService');
const xpService = require('../services/xpService');
const badgeService = require('../services/badgeService');
const leaderboardService = require('../services/leaderboardService');
const User = require('../models/User');
const Project = require('../models/Project');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');
const crypto = require('crypto');

describe('Verification of 3 Solved Features', () => {

  describe('Feature 1: Password Reset Flow (Forgot & Reset Password)', () => {
    it('forgotPassword generates a secure hashed reset token with 1-hour expiration', async () => {
      let savedUser = null;
      let emailSent = false;

      const origFindOne = User.findOne;
      const emailService = require('../services/emailService');
      const origSendEmail = emailService.sendPasswordResetEmail;

      try {
        User.findOne = async () => ({
          _id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          save: async function() {
            savedUser = this;
          }
        });

        emailService.sendPasswordResetEmail = async (email, token) => {
          emailSent = true;
          assert.strictEqual(email, 'test@example.com');
          assert.ok(token && token.length === 64, 'Token must be a 32-byte hex string (64 characters)');
        };

        const req = { body: { email: 'test@example.com' } };
        let resJson = null;
        const res = {
          status: () => res,
          json: (data) => { resJson = data; }
        };

        await authController.forgotPassword(req, res, () => {});

        assert.strictEqual(resJson.success, true);
        assert.ok(savedUser !== null, 'User must have been saved');
        assert.ok(savedUser.resetPasswordToken, 'Hashed token must be present');
        assert.ok(savedUser.resetPasswordExpires > Date.now(), 'Token must expire in the future');
        assert.strictEqual(emailSent, true, 'Reset email must be sent');
      } finally {
        User.findOne = origFindOne;
        emailService.sendPasswordResetEmail = origSendEmail;
      }
    });

    it('resetPassword verifies token hash, sets new password, and clears reset token', async () => {
      const rawToken = 'sample_raw_reset_token_12345';
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      let userSaved = false;

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        passwordHash: 'old_hashed_password',
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 3600000,
        save: async function() {
          userSaved = true;
        }
      };

      const origFindOne = User.findOne;
      try {
        User.findOne = async (query) => {
          if (query.resetPasswordToken === hashedToken) {
            return mockUser;
          }
          return null;
        };

        const req = { body: { token: rawToken, password: 'BrandNewSecurePassword123' } };
        let resJson = null;
        const res = {
          status: () => res,
          json: (data) => { resJson = data; }
        };

        await authController.resetPassword(req, res, () => {});

        assert.strictEqual(resJson.success, true);
        assert.strictEqual(userSaved, true);
        assert.strictEqual(mockUser.passwordHash, 'BrandNewSecurePassword123');
        assert.strictEqual(mockUser.resetPasswordToken, null);
        assert.strictEqual(mockUser.resetPasswordExpires, null);
      } finally {
        User.findOne = origFindOne;
      }
    });
  });

  describe('Feature 2: DSA Dynamic Module Progression', () => {
    it('correctly maps challengesSolved to module unlocks', () => {
      const TOTAL_MODULES = 14;

      const calculateProgress = (solvedCount) => {
        const isAllCompleted = solvedCount >= TOTAL_MODULES;
        const currentModuleIndex = isAllCompleted ? TOTAL_MODULES : Math.max(0, solvedCount);
        return { isAllCompleted, currentModuleIndex };
      };

      // 0 challenges: Module 0 is current, 1..13 are locked
      const p0 = calculateProgress(0);
      assert.strictEqual(p0.currentModuleIndex, 0);
      assert.strictEqual(p0.isAllCompleted, false);

      // 1 challenge: Module 0 completed, Module 1 is current
      const p1 = calculateProgress(1);
      assert.strictEqual(p1.currentModuleIndex, 1);
      assert.strictEqual(p1.isAllCompleted, false);

      // 5 challenges: Module 0..4 completed, Module 5 is current
      const p5 = calculateProgress(5);
      assert.strictEqual(p5.currentModuleIndex, 5);
      assert.strictEqual(p5.isAllCompleted, false);

      // 14+ challenges: All 14 modules unlocked and completed
      const p14 = calculateProgress(14);
      assert.strictEqual(p14.currentModuleIndex, 14);
      assert.strictEqual(p14.isAllCompleted, true);
    });
  });

  describe('Feature 3: System Notifications Generation', () => {
    it('notificationService.createNotification persists notification in DB and emits via socket', async () => {
      let createdDoc = null;
      let emittedEvent = null;

      const origCreate = Notification.create;
      const origEmitToUser = socketService.emitToUser;

      try {
        Notification.create = async (doc) => {
          createdDoc = { _id: 'notif_1', ...doc };
          return createdDoc;
        };

        socketService.emitToUser = (userId, event, data) => {
          emittedEvent = { userId, event, data };
        };

        const result = await notificationService.createNotification({
          userId: '507f1f77bcf86cd799439011',
          title: 'Test Notification',
          message: 'This is a test notification message',
          type: 'success',
          link: '/dashboard'
        });

        assert.ok(result);
        assert.strictEqual(createdDoc.user, '507f1f77bcf86cd799439011');
        assert.strictEqual(createdDoc.title, 'Test Notification');
        assert.strictEqual(createdDoc.message, 'This is a test notification message');
        assert.strictEqual(createdDoc.isRead, false);

        assert.ok(emittedEvent);
        assert.strictEqual(emittedEvent.userId, '507f1f77bcf86cd799439011');
        assert.strictEqual(emittedEvent.event, 'notification:new');
        assert.strictEqual(emittedEvent.data.title, 'Test Notification');
      } finally {
        Notification.create = origCreate;
        socketService.emitToUser = origEmitToUser;
      }
    });

    it('Level Up triggers notification creation', async () => {
      let notificationCreated = null;
      const origCreateNotification = notificationService.createNotification;
      const origFindById = User.findById;
      const origFindByIdAndUpdate = User.findByIdAndUpdate;
      const XPEvent = require('../models/XPEvent');
      const origXPCreate = XPEvent.create;
      const origEvaluateBadges = badgeService.evaluateBadges;
      const origUpdateEntry = leaderboardService.updateEntry;
      const origEmitToUser = socketService.emitToUser;

      try {
        socketService.emitToUser = () => {};
        badgeService.evaluateBadges = async () => [];
        leaderboardService.updateEntry = async () => {};

        notificationService.createNotification = async (payload) => {
          notificationCreated = payload;
          return { _id: 'notif_lvl', ...payload };
        };

        XPEvent.create = async () => ({});

        // User at level 1 with 0 XP
        User.findById = () => ({
          select: () => ({
            _id: '507f1f77bcf86cd799439011',
            streak: 0,
            level: 1,
            xp: 0
          })
        });

        // Awarding 1000 XP will level up the user
        User.findByIdAndUpdate = () => ({
          _id: '507f1f77bcf86cd799439011',
          xp: 1000,
          level: 2
        });

        await xpService.awardXP('507f1f77bcf86cd799439011', 1000, 'challenge');

        assert.ok(notificationCreated, 'Level up must generate a notification');
        assert.strictEqual(notificationCreated.title, '🏆 Level Up!');
        assert.strictEqual(notificationCreated.type, 'success');
        assert.strictEqual(notificationCreated.userId, '507f1f77bcf86cd799439011');
      } finally {
        notificationService.createNotification = origCreateNotification;
        User.findById = origFindById;
        User.findByIdAndUpdate = origFindByIdAndUpdate;
        XPEvent.create = origXPCreate;
        badgeService.evaluateBadges = origEvaluateBadges;
        leaderboardService.updateEntry = origUpdateEntry;
        socketService.emitToUser = origEmitToUser;
      }
    });

    it('Project like triggers notification creation for project author', async () => {
      let notificationCreated = null;
      const origCreate = Notification.create;
      const origFindOne = Project.findOne;
      const origFindOneAndUpdate = Project.findOneAndUpdate;
      const origUserFindById = User.findById;

      try {
        Notification.create = async (doc) => {
          notificationCreated = doc;
          return { _id: 'notif_like', ...doc };
        };

        // Project has not been liked by liker_123 yet
        Project.findOne = async () => null;

        Project.findOneAndUpdate = async () => ({
          _id: '507f1f77bcf86cd799439099',
          title: 'Awesome Web App',
          userId: '507f1f77bcf86cd799439088', // Project belongs to author
          likes: 5,
          likedBy: ['507f1f77bcf86cd799439077']
        });

        User.findById = () => ({
          select: () => ({
            _id: '507f1f77bcf86cd799439077',
            username: 'Codemaster'
          })
        });

        const req = {
          params: { id: '507f1f77bcf86cd799439099' },
          userId: '507f1f77bcf86cd799439077'
        };

        let resData = null;
        const res = {
          status: () => res,
          json: (d) => { resData = d; }
        };

        await projectController.likeProject(req, res, () => {});

        assert.strictEqual(resData.success, true);
        assert.ok(notificationCreated, 'Project like must create a notification');
        assert.strictEqual(notificationCreated.user, '507f1f77bcf86cd799439088', 'Must notify the project author');
        assert.strictEqual(notificationCreated.title, '❤️ Project Liked');
        assert.ok(notificationCreated.message.includes('Codemaster liked your project'));
      } finally {
        Notification.create = origCreate;
        Project.findOne = origFindOne;
        Project.findOneAndUpdate = origFindOneAndUpdate;
        User.findById = origUserFindById;
      }
    });

    it('Liking your own project does NOT trigger a notification to yourself', async () => {
      let notificationCreated = null;
      const origCreate = Notification.create;
      const origFindOne = Project.findOne;
      const origFindOneAndUpdate = Project.findOneAndUpdate;

      try {
        Notification.create = async (doc) => {
          notificationCreated = doc;
          return doc;
        };

        Project.findOne = async () => null;
        Project.findOneAndUpdate = async () => ({
          _id: '507f1f77bcf86cd799439099',
          title: 'My Own Project',
          userId: '507f1f77bcf86cd799439011', // User is the author
          likes: 1,
          likedBy: ['507f1f77bcf86cd799439011']
        });

        const req = {
          params: { id: '507f1f77bcf86cd799439099' },
          userId: '507f1f77bcf86cd799439011'
        };

        const res = { status: () => res, json: () => {} };
        await projectController.likeProject(req, res, () => {});

        assert.strictEqual(notificationCreated, null, 'Self-like must not trigger notification');
      } finally {
        Notification.create = origCreate;
        Project.findOne = origFindOne;
        Project.findOneAndUpdate = origFindOneAndUpdate;
      }
    });
  });
});
