const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

describe('Comprehensive Security Remediation Suite', () => {
  const rootDir = path.resolve(__dirname, '../..');

  describe('1. Rate Limiting Hardening', () => {
    it('authRoutes.js must protect /refresh with rate limiting', () => {
      const authRoutesPath = path.join(rootDir, 'server/routes/authRoutes.js');
      const content = fs.readFileSync(authRoutesPath, 'utf8');
      assert.ok(
        /router\.post\(\s*['"]\/refresh['"]\s*,\s*authLimiter/i.test(content),
        'Expected router.post("/refresh", authLimiter, ...) in authRoutes.js'
      );
    });

    it('rateLimiter.js must configure HTTP 429 status code explicitly', () => {
      const rateLimiter = require('../middleware/rateLimiter');
      const rateLimiterSource = fs.readFileSync(path.join(rootDir, 'server/middleware/rateLimiter.js'), 'utf8');
      assert.ok(rateLimiterSource.includes('statusCode: 429'), 'rateLimiter.js must set statusCode: 429');
      assert.strictEqual(typeof rateLimiter.authLimiter, 'function');
      assert.strictEqual(typeof rateLimiter.apiLimiter, 'function');
      assert.strictEqual(typeof rateLimiter.runLimiter, 'function');
      assert.strictEqual(typeof rateLimiter.submitLimiter, 'function');
      assert.strictEqual(typeof rateLimiter.aiLimiter, 'function');
    });
  });

  describe('2. Input Validation & Mass Assignment Prevention', () => {
    const { registerSchema, googleLoginSchema, verifyEmailSchema, forgotPasswordSchema } = require('../validators/authValidator');
    const { createProjectSchema } = require('../validators/projectValidator');

    it('registerSchema rejects usernames with XSS/scripts or dangerous characters', () => {
      const invalidUsernames = [
        '<script>alert(1)</script>',
        'user<name>',
        'user name',
        'user@domain',
        'user!#$%',
        'ab', // too short (<3)
        'a'.repeat(35), // too long (>30)
      ];

      for (const username of invalidUsernames) {
        const result = registerSchema.safeParse({
          username,
          email: 'valid@example.com',
          password: 'Password123!',
        });
        assert.strictEqual(result.success, false, `Expected username "${username}" to be rejected`);
      }

      // Valid usernames
      const validResult = registerSchema.safeParse({
        username: 'alice_coder-99',
        email: 'alice@example.com',
        password: 'Password123!',
      });
      assert.strictEqual(validResult.success, true);
    });

    it('registerSchema rejects passwords exceeding maximum safe length (bcrypt DoS prevention)', () => {
      const longPassword = 'A'.repeat(200);
      const result = registerSchema.safeParse({
        username: 'alice_coder',
        email: 'alice@example.com',
        password: longPassword,
      });
      assert.strictEqual(result.success, false, 'Expected oversized password to be rejected');
    });

    it('googleLoginSchema requires credential or token', () => {
      assert.strictEqual(googleLoginSchema.safeParse({}).success, false);
      assert.strictEqual(googleLoginSchema.safeParse({ credential: 'valid_credential' }).success, true);
      assert.strictEqual(googleLoginSchema.safeParse({ token: 'valid_access_token' }).success, true);
    });

    it('verifyEmailSchema validates verification token length constraints', () => {
      assert.strictEqual(verifyEmailSchema.safeParse({}).success, false);
      assert.strictEqual(verifyEmailSchema.safeParse({ token: '' }).success, false);
      assert.strictEqual(verifyEmailSchema.safeParse({ token: 'a'.repeat(300) }).success, false);
      assert.strictEqual(verifyEmailSchema.safeParse({ token: 'valid_verification_token' }).success, true);
    });

    it('forgotPasswordSchema validates email format', () => {
      assert.strictEqual(forgotPasswordSchema.safeParse({}).success, false);
      assert.strictEqual(forgotPasswordSchema.safeParse({ email: 'not-an-email' }).success, false);
      assert.strictEqual(forgotPasswordSchema.safeParse({ email: 'developer@example.com' }).success, true);
    });

    it('createProjectSchema rejects dangerous liveUrl schemes like javascript:', () => {
      const result = createProjectSchema.safeParse({
        title: 'My Project',
        description: 'A safe project description',
        liveUrl: 'javascript:alert(1)',
      });
      assert.strictEqual(result.success, false, 'Expected javascript: scheme to be rejected');
    });

    it('createProjectSchema validates length constraints on title and description', () => {
      const result = createProjectSchema.safeParse({
        title: 'A'.repeat(150), // exceeds 100
        description: 'Valid description',
      });
      assert.strictEqual(result.success, false, 'Expected oversized title to be rejected');
    });

    it('createChallenge explicitly whitelists fields to prevent mass assignment', () => {
      const challengeCtrlSource = fs.readFileSync(path.join(rootDir, 'server/controllers/challengeController.js'), 'utf8');
      assert.strictEqual(
        challengeCtrlSource.includes('...req.body'),
        false,
        'createChallenge should not spread raw ...req.body into Challenge.create'
      );
    });
  });

  describe('3. Authentication & Account Lockout Enforcement', () => {
    const authController = require('../controllers/authController');
    const User = require('../models/User');

    it('login enforces account lockout after multiple failed attempts', async () => {
      const origFindOne = User.findOne;
      const origFindByIdAndUpdate = User.findByIdAndUpdate;

      try {
        const mockUser = {
          _id: '507f1f77bcf86cd799439011',
          email: 'locked@example.com',
          passwordHash: 'some_hash',
          failedLoginAttempts: 4,
          comparePassword: async () => false, // simulate wrong password
        };

        User.findOne = async () => mockUser;

        let updatedFields = null;
        User.findByIdAndUpdate = async (id, fields) => {
          updatedFields = fields;
          return { ...mockUser, ...fields };
        };

        let resStatus = null;
        let resBody = null;
        const res = {
          status: (code) => { resStatus = code; return res; },
          json: (data) => { resBody = data; return res; }
        };

        // 5th attempt failure
        await authController.login({ body: { email: 'locked@example.com', password: 'wrong' } }, res, () => {});

        assert.strictEqual(resStatus, 401);
        assert.ok(resBody && resBody.error, 'Should return error body');
        assert.ok(updatedFields, 'User record should be updated on failed login');
        assert.ok(updatedFields.lockUntil instanceof Date, 'User should be locked out on 5th failed attempt');
        assert.ok(updatedFields.lockUntil.getTime() > Date.now(), 'lockUntil timestamp should be in the future');
      } finally {
        User.findOne = origFindOne;
        User.findByIdAndUpdate = origFindByIdAndUpdate;
      }
    });

    it('login rejects attempts when account is already locked with HTTP 423', async () => {
      const origFindOne = User.findOne;
      try {
        const lockedUser = {
          _id: '507f1f77bcf86cd799439012',
          email: 'locked_out@example.com',
          passwordHash: 'some_hash',
          lockUntil: new Date(Date.now() + 10 * 60 * 1000), // locked for 10 more minutes
          comparePassword: async () => true,
        };

        User.findOne = async () => lockedUser;

        let resStatus = null;
        let resBody = null;
        const res = {
          status: (code) => { resStatus = code; return res; },
          json: (data) => { resBody = data; return res; }
        };

        await authController.login({ body: { email: 'locked_out@example.com', password: 'any' } }, res, () => {});

        assert.strictEqual(resStatus, 423, 'Locked accounts must receive HTTP 423 status');
        assert.ok(resBody.error.includes('Account is temporarily locked'));
      } finally {
        User.findOne = origFindOne;
      }
    });

    it('auth middleware blocks locked accounts even if JWT has not expired', async () => {
      const { auth } = require('../middleware/auth');
      const jwt = require('jsonwebtoken');
      const origFindById = User.findById;
      const origSecret = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'audit-test-secret-key-at-least-32-chars-long';

      try {
        const token = jwt.sign({ id: 'user_123', role: 'developer' }, process.env.JWT_SECRET);
        User.findById = () => ({
          select: async () => ({
            _id: 'user_123',
            lockUntil: new Date(Date.now() + 15 * 60 * 1000), // locked
          }),
        });

        const req = { header: (name) => name === 'Authorization' ? `Bearer ${token}` : null };
        let resStatus = null;
        let resBody = null;
        const res = {
          status: (code) => { resStatus = code; return res; },
          json: (data) => { resBody = data; return res; }
        };

        await auth(req, res, () => assert.fail('Should not call next() for locked account'));

        assert.strictEqual(resStatus, 403);
        assert.ok(resBody.error.includes('Account is temporarily locked'));
      } finally {
        User.findById = origFindById;
        process.env.JWT_SECRET = origSecret;
      }
    });
  });

  describe('4. Authorization & Scoped CORS Protection', () => {
    const { isAllowedOrigin } = require('../utils/urlHelper');

    it('isAllowedOrigin allows legitimate DevArena Vercel domains', () => {
      assert.strictEqual(isAllowedOrigin('https://devarena-client.vercel.app'), true);
      assert.strictEqual(isAllowedOrigin('https://devarena.vercel.app'), true);
      assert.strictEqual(isAllowedOrigin('https://devarena-preview-pr12.vercel.app'), true);
    });

    it('isAllowedOrigin strictly blocks arbitrary attacker Vercel subdomains', () => {
      assert.strictEqual(isAllowedOrigin('https://attacker-phishing.vercel.app'), false);
      assert.strictEqual(isAllowedOrigin('https://malicious-site.vercel.app'), false);
      assert.strictEqual(isAllowedOrigin('https://notdevarena.vercel.app'), false);
    });

    it('projectController verifies ownership on project deletion', async () => {
      const projectController = require('../controllers/projectController');
      const Project = require('../models/Project');
      const origFindOneAndDelete = Project.findOneAndDelete;

      try {
        let queriedFilter = null;
        Project.findOneAndDelete = async (filter) => {
          queriedFilter = filter;
          return null; // Not found / unauthorized
        };

        const req = {
          params: { id: 'proj_123' },
          userId: 'user_dev_456',
          user: { role: 'developer' }
        };
        let resStatus = null;
        const res = {
          status: (code) => { resStatus = code; return res; },
          json: () => res
        };

        await projectController.deleteProject(req, res, () => {});

        assert.strictEqual(resStatus, 404);
        assert.strictEqual(queriedFilter.userId, 'user_dev_456', 'Ownership check must be in query for developer');
      } finally {
        Project.findOneAndDelete = origFindOneAndDelete;
      }
    });
  });

  describe('5. Secrets Management & Clean Git State', () => {
    it('.env.example contains safe placeholders and RATE_LIMIT_BYPASS_SECRET', () => {
      const envExamplePath = path.join(rootDir, '.env.example');
      const content = fs.readFileSync(envExamplePath, 'utf8');

      assert.ok(content.includes('RATE_LIMIT_BYPASS_SECRET='), '.env.example should document RATE_LIMIT_BYPASS_SECRET');
      assert.strictEqual(content.includes('harshad#98'), false, 'Real password must not be in .env.example');
      assert.strictEqual(content.includes('AQ.Ab8RN'), false, 'Real Gemini keys must not be in .env.example');
    });

    it('.gitignore ignores sensitive credential and backup files', () => {
      const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
      assert.ok(gitignore.includes('.env'));
      assert.ok(gitignore.includes('*credentials*'));
      assert.ok(gitignore.includes('*backup*'));
    });
  });

  describe('6. File Upload Security & Magic Byte Signature Validation', () => {
    const { _testExports } = require('../controllers/aiController');
    const { isValidFileSignature } = _testExports;

    it('isValidFileSignature accepts valid PDF file signatures (%PDF-)', () => {
      const pdfBuffer = Buffer.from('%PDF-1.7 sample pdf content here');
      assert.strictEqual(isValidFileSignature(pdfBuffer, 'application/pdf'), true);
    });

    it('isValidFileSignature rejects spoofed PDF files containing malicious script/executables', () => {
      const fakePdfBuffer = Buffer.from('<?php echo "malware"; ?>');
      assert.strictEqual(isValidFileSignature(fakePdfBuffer, 'application/pdf'), false);

      const exeBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00');
      assert.strictEqual(isValidFileSignature(exeBuffer, 'application/pdf'), false);
    });

    it('isValidFileSignature validates genuine PNG and JPEG signatures', () => {
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
      assert.strictEqual(isValidFileSignature(pngBuffer, 'image/png'), true);

      // JPEG: FF D8 FF
      const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
      assert.strictEqual(isValidFileSignature(jpegBuffer, 'image/jpeg'), true);

      // WebP: RIFF....WEBP
      const webpBuffer = Buffer.from('RIFF\x00\x00\x00\x00WEBPVP8 ');
      assert.strictEqual(isValidFileSignature(webpBuffer, 'image/webp'), true);

      // Spoofed image
      const spoofedImg = Buffer.from('#!/bin/bash\nrm -rf /');
      assert.strictEqual(isValidFileSignature(spoofedImg, 'image/png'), false);
    });
  });

  describe('7. Centralized Error Handling & Client XSS Prevention', () => {
    const errorHandler = require('../middleware/errorHandler');

    it('errorHandler handles Multer LIMIT_FILE_SIZE with HTTP 413', () => {
      const multerErr = new Error('File too large');
      multerErr.name = 'MulterError';
      multerErr.code = 'LIMIT_FILE_SIZE';

      let statusCode = null;
      let jsonBody = null;
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { jsonBody = data; return res; }
      };

      errorHandler(multerErr, {}, res, () => {});

      assert.strictEqual(statusCode, 413);
      assert.strictEqual(jsonBody.success, false);
      assert.ok(jsonBody.error.includes('File size exceeds'));
    });

    it('errorHandler handles express.json() parse errors with clean HTTP 400', () => {
      const syntaxErr = new SyntaxError('Unexpected token in JSON');
      syntaxErr.status = 400;
      syntaxErr.body = '{"bad json"';

      let statusCode = null;
      let jsonBody = null;
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { jsonBody = data; return res; }
      };

      errorHandler(syntaxErr, {}, res, () => {});

      assert.strictEqual(statusCode, 400);
      assert.strictEqual(jsonBody.success, false);
      assert.ok(jsonBody.error.includes('Invalid JSON payload'));
    });

    it('ChatMarkdown.jsx component sanitizes javascript: and data: pseudo-protocols', () => {
      const chatMdSource = fs.readFileSync(path.join(rootDir, 'client/src/components/ui/ChatMarkdown.jsx'), 'utf8');
      assert.ok(chatMdSource.includes('chat-link-unsafe'), 'ChatMarkdown should reject unsafe pseudo-protocols');
      assert.ok(chatMdSource.includes('^https?:\\/\\/'), 'ChatMarkdown must enforce http(s) protocols');
    });
  });
});
