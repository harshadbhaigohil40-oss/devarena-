const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

describe('P1 Remediation Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');

  describe('1. Stored XSS Mitigation: URL Validation & Content Security Policy', () => {
    const Project = require('../models/Project');

    it('Project schema should reject javascript: pseudo-protocol in liveUrl and repoUrl', () => {
      const p1 = new Project({
        userId: '6aca08d9d6a5783e11534876',
        title: 'Exploit Project',
        description: 'Testing XSS',
        liveUrl: 'javascript:alert(document.domain)',
      });
      const err1 = p1.validateSync();
      assert.ok(err1, 'Schema should produce validation error for javascript: liveUrl');
      assert.ok(err1.errors.liveUrl, 'Validation error should be on liveUrl');

      const p2 = new Project({
        userId: '6aca08d9d6a5783e11534876',
        title: 'Exploit Repo',
        description: 'Testing XSS',
        repoUrl: 'data:text/html,<script>alert(1)</script>',
      });
      const err2 = p2.validateSync();
      assert.ok(err2, 'Schema should produce validation error for data: repoUrl');
      assert.ok(err2.errors.repoUrl, 'Validation error should be on repoUrl');
    });

    it('Project schema should accept valid http: and https: URLs', () => {
      const p = new Project({
        userId: '6aca08d9d6a5783e11534876',
        title: 'Safe Project',
        description: 'Testing valid URLs',
        liveUrl: 'https://my-app.vercel.app',
        repoUrl: 'http://github.com/my-user/my-repo',
      });
      const err = p.validateSync();
      assert.strictEqual(err, undefined, 'Schema should not produce errors for valid http/https URLs');
    });

    it('projectController.js should validate URLs and protect against mass assignment', () => {
      const ctrlContent = fs.readFileSync(path.join(rootDir, 'server/controllers/projectController.js'), 'utf8');
      assert.ok(ctrlContent.includes('isValidHttpUrl'), 'projectController.js should define isValidHttpUrl');
      assert.ok(ctrlContent.includes('only http: and https: protocols are permitted'), 'Controller should reject non-http protocols');
      assert.strictEqual(/Object\.assign\(project,\s*req\.body\)/.test(ctrlContent), false, 'updateProject should not use unrestricted Object.assign');
    });

    it('server.js should configure Content Security Policy and preserve COOP popups', () => {
      const serverContent = fs.readFileSync(path.join(rootDir, 'server/server.js'), 'utf8');
      assert.ok(serverContent.includes('contentSecurityPolicy:'), 'server.js should define contentSecurityPolicy');
      assert.strictEqual(serverContent.includes('contentSecurityPolicy: false'), false, 'contentSecurityPolicy should not be false');
      assert.ok(serverContent.includes('same-origin-allow-popups'), 'COOP same-origin-allow-popups must be preserved for Google OAuth');
    });
  });

  describe('2. Google OAuth: Strict ID Token & Audience Verification', () => {
    it('authController.js should strictly verify Google token audience against GOOGLE_CLIENT_ID', () => {
      const authContent = fs.readFileSync(path.join(rootDir, 'server/controllers/authController.js'), 'utf8');

      // Check ID token audience check
      assert.ok(authContent.includes('payload.aud !== process.env.GOOGLE_CLIENT_ID'), 'Must check payload.aud against GOOGLE_CLIENT_ID');
      assert.ok(authContent.includes('validIssuers.includes(payload.iss)'), 'Must check payload.iss against valid Google issuers');
      assert.ok(authContent.includes('payload.email_verified'), 'Must check payload.email_verified');
    });

    it('authController.js should validate access token audience via tokeninfo and reject unvalidated userinfo', () => {
      const authContent = fs.readFileSync(path.join(rootDir, 'server/controllers/authController.js'), 'utf8');

      assert.ok(authContent.includes('tokeninfo?access_token='), 'Must query tokeninfo for access tokens');
      assert.ok(authContent.includes('tokenAud !== expectedAud'), 'Must reject access tokens whose audience does not match GOOGLE_CLIENT_ID');
      assert.ok(authContent.includes('tokenInfo.email_verified'), 'Must verify email_verified on access token');
    });

    it('googleLogin should fail closed if GOOGLE_CLIENT_ID is unset', async () => {
      const authController = require('../controllers/authController');
      const origClientId = process.env.GOOGLE_CLIENT_ID;
      try {
        delete process.env.GOOGLE_CLIENT_ID;
        let statusCode = null;
        let jsonResponse = null;
        const res = {
          status: (code) => { statusCode = code; return res; },
          json: (data) => { jsonResponse = data; return res; }
        };
        await authController.googleLogin({ body: { credential: 'dummy' } }, res, () => {});
        assert.strictEqual(statusCode, 500, 'Should return 500 when GOOGLE_CLIENT_ID is not configured');
      } finally {
        if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId;
      }
    });
  });

  describe('3. Email Service: No Production Fallback to Ethereal & Safe Failure', () => {
    const emailService = require('../services/emailService');

    it('isSmtpConfigured should return false when SMTP variables are missing', () => {
      const origHost = process.env.SMTP_HOST;
      try {
        delete process.env.SMTP_HOST;
        assert.strictEqual(emailService.isSmtpConfigured(), false);
      } finally {
        if (origHost) process.env.SMTP_HOST = origHost;
      }
    });

    it('createTransporter should return null in production mode when SMTP is missing', async () => {
      const origEnv = process.env.NODE_ENV;
      const origHost = process.env.SMTP_HOST;
      try {
        process.env.NODE_ENV = 'production';
        delete process.env.SMTP_HOST;

        const transporter = await emailService.createTransporter();
        assert.strictEqual(transporter, null, 'Must never create an Ethereal transporter in production');
      } finally {
        process.env.NODE_ENV = origEnv;
        if (origHost) process.env.SMTP_HOST = origHost;
      }
    });

    it('sendVerificationEmail and sendPasswordResetEmail should return false and not crash when SMTP is missing in production', async () => {
      const origEnv = process.env.NODE_ENV;
      const origHost = process.env.SMTP_HOST;
      try {
        process.env.NODE_ENV = 'production';
        delete process.env.SMTP_HOST;

        const res1 = await emailService.sendVerificationEmail('test@example.com', 'test-token');
        assert.strictEqual(res1, false, 'sendVerificationEmail should return false when SMTP is missing in production');

        const res2 = await emailService.sendPasswordResetEmail('test@example.com', 'test-token');
        assert.strictEqual(res2, false, 'sendPasswordResetEmail should return false when SMTP is missing in production');
      } finally {
        process.env.NODE_ENV = origEnv;
        if (origHost) process.env.SMTP_HOST = origHost;
      }
    });
  });
});
