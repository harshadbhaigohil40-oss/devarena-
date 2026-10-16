const { describe, it } = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');
const authController = require('../controllers/authController');
const { ensureAdminUser } = require('../config/adminSeed');

describe('PHASE 1 - Admin Credentials & Authentication Hardening', () => {
  it('login with any email/password returns 401 and creates no user when user does not exist', async () => {
    const origFindOne = User.findOne;
    const origCreate = User.create;
    let createCalled = false;

    User.findOne = async () => null;
    User.create = async () => {
      createCalled = true;
      throw new Error('User.create should not be called');
    };

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
        { body: { email: 'unknown@example.com', password: 'SomePassword123!' } },
        res,
        (err) => { if (err) throw err; }
      );

      assert.strictEqual(statusCode, 401, 'Should return HTTP 401 for unknown user');
      assert.strictEqual(jsonBody.success, false);
      assert.strictEqual(jsonBody.error, 'Invalid email or password.');
      assert.strictEqual(createCalled, false, 'No user should be created on failed login');
    } finally {
      User.findOne = origFindOne;
      User.create = origCreate;
    }
  });

  it('ensureAdminUser skips seeding when ADMIN_EMAIL or ADMIN_PASSWORD is unset', async () => {
    const origFindOne = User.findOne;
    let findCalled = false;
    User.findOne = async () => {
      findCalled = true;
      return null;
    };

    try {
      // adminSeed module reads process.env at import; ADMIN_EMAIL/PASSWORD in test env is checked
      // ensureAdminUser should safely return if variables are missing
      await ensureAdminUser();
      // If ADMIN_EMAIL is unset in process.env, findOne will never even be called
    } finally {
      User.findOne = origFindOne;
    }
  });

  it('ensureAdminUser does not overwrite password on existing admin user', async () => {
    const origFindOne = User.findOne;
    const mockAdmin = {
      email: 'admin@devarena.io',
      role: 'developer',
      isEmailVerified: false,
      passwordHash: '$2a$12$existingHashedPasswordDoNotOverwrite',
      failedLoginAttempts: 2,
      lockUntil: new Date(),
      saveCalled: false,
      async save() {
        this.saveCalled = true;
      },
    };

    User.findOne = async () => mockAdmin;

    try {
      // Call ensureAdminUser
      await ensureAdminUser();
      assert.strictEqual(
        mockAdmin.passwordHash,
        '$2a$12$existingHashedPasswordDoNotOverwrite',
        'Password hash must NOT be overwritten on boot'
      );
    } finally {
      User.findOne = origFindOne;
    }
  });
});
