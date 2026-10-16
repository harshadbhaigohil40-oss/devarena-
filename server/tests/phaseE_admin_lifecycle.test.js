const { describe, it } = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');
const { register, googleLogin } = require('../controllers/authController');
const { ensureAdminUser } = require('../config/adminSeed');
const { promoteAdmin } = require('../../scripts/promoteAdmin');

describe('PHASE E - Admin Account Lifecycle Hardening', () => {
  const originalAdminEmail = process.env.ADMIN_EMAIL;
  const originalAdminPassword = process.env.ADMIN_PASSWORD;

  it('register() with ADMIN_EMAIL is rejected with 400', async () => {
    process.env.ADMIN_EMAIL = 'system.admin@devarena.example.com';

    let resCode = 0;
    let resJson = null;
    const mockRes = {
      status: (code) => {
        resCode = code;
        return mockRes;
      },
      json: (data) => {
        resJson = data;
        return mockRes;
      },
    };

    const mockReq = {
      body: {
        username: 'sysadmin',
        email: 'system.admin@devarena.example.com',
        password: 'Password123!',
      },
    };

    try {
      await register(mockReq, mockRes, () => {});
      assert.strictEqual(resCode, 400, 'Must reject registration with ADMIN_EMAIL with HTTP 400');
      assert.strictEqual(resJson.success, false);
      assert.ok(resJson.error.includes('reserved for system administration'));
    } finally {
      if (originalAdminEmail) process.env.ADMIN_EMAIL = originalAdminEmail;
      else delete process.env.ADMIN_EMAIL;
    }
  });

  it('googleLogin() with ADMIN_EMAIL on a new account is rejected with 403', async () => {
    process.env.ADMIN_EMAIL = 'google.admin@devarena.example.com';
    process.env.GOOGLE_CLIENT_ID = 'devarena-google-client-id';

    const { OAuth2Client } = require('google-auth-library');
    const origVerify = OAuth2Client.prototype.verifyIdToken;

    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        iss: 'https://accounts.google.com',
        aud: 'devarena-google-client-id',
        sub: 'google-sub-12345',
        email: 'google.admin@devarena.example.com',
        email_verified: true,
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    });

    let resCode = 0;
    let resJson = null;
    const mockRes = {
      status: (code) => {
        resCode = code;
        return mockRes;
      },
      json: (data) => {
        resJson = data;
        return mockRes;
      },
    };

    const mockReq = {
      body: {
        credential: 'mock-google-id-token',
      },
    };

    try {
      await googleLogin(mockReq, mockRes, () => {});
      assert.strictEqual(resCode, 403, 'Must reject googleLogin taking over ADMIN_EMAIL with 403');
      assert.strictEqual(resJson.success, false);
      assert.ok(resJson.error.includes('reserved for system administration'));
    } finally {
      OAuth2Client.prototype.verifyIdToken = origVerify;
      if (originalAdminEmail) process.env.ADMIN_EMAIL = originalAdminEmail;
      else delete process.env.ADMIN_EMAIL;
    }
  });

  it('adminSeed() leaves a role="developer" user untouched', async () => {
    process.env.ADMIN_EMAIL = 'existing.user@devarena.example.com';
    process.env.ADMIN_PASSWORD = 'SeedAdminPassword123!';

    const origFindOne = User.findOne;
    let saveCalled = false;
    const fakeDeveloperUser = {
      email: 'existing.user@devarena.example.com',
      role: 'developer',
      isEmailVerified: true,
      save: async () => {
        saveCalled = true;
      },
    };

    User.findOne = async ({ email }) => {
      if (email === 'existing.user@devarena.example.com') {
        return fakeDeveloperUser;
      }
      return null;
    };

    try {
      await ensureAdminUser();
      assert.strictEqual(fakeDeveloperUser.role, 'developer', 'Role must remain developer');
      assert.strictEqual(saveCalled, false, 'User must not be modified or saved');
    } finally {
      User.findOne = origFindOne;
      if (originalAdminEmail) process.env.ADMIN_EMAIL = originalAdminEmail;
      else delete process.env.ADMIN_EMAIL;
      if (originalAdminPassword) process.env.ADMIN_PASSWORD = originalAdminPassword;
      else delete process.env.ADMIN_PASSWORD;
    }
  });

  it('scripts/promoteAdmin.js requires --yes flag and promotes successfully when verified', async () => {
    const origFindOne = User.findOne;

    let saved = false;
    const mockUser = {
      email: 'candidate@devarena.example.com',
      role: 'developer',
      isEmailVerified: true,
      refreshToken: 'active-refresh-token',
      save: async () => {
        saved = true;
      },
      toJSON: () => ({ email: 'candidate@devarena.example.com', role: mockUser.role }),
    };

    User.findOne = async ({ email }) => {
      if (email === 'candidate@devarena.example.com') {
        return mockUser;
      }
      return null;
    };

    try {
      // 1. Without --yes flag: must reject and not change user
      const dryResult = await promoteAdmin('candidate@devarena.example.com', false);
      assert.strictEqual(dryResult.success, false);
      assert.strictEqual(dryResult.reason, 'missing_yes');
      assert.strictEqual(mockUser.role, 'developer');
      assert.strictEqual(saved, false);

      // 2. With unverified email: must reject
      mockUser.isEmailVerified = false;
      const unverifiedResult = await promoteAdmin('candidate@devarena.example.com', true);
      assert.strictEqual(unverifiedResult.success, false);
      assert.strictEqual(unverifiedResult.reason, 'unverified');
      assert.strictEqual(mockUser.role, 'developer');

      // 3. With --yes and verified email: must succeed
      mockUser.isEmailVerified = true;
      const successResult = await promoteAdmin('candidate@devarena.example.com', true);
      assert.strictEqual(successResult.success, true);
      assert.strictEqual(mockUser.role, 'admin');
      assert.strictEqual(mockUser.refreshToken, null, 'Must revoke refresh token on role elevation');
      assert.strictEqual(saved, true);
    } finally {
      User.findOne = origFindOne;
    }
  });
});
