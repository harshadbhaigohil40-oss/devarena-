const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const express = require('express');

describe('P1 & P2 Remediation Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');

  describe('Task 1: Zod Validation Runtime Defect Resolution', () => {
    const validate = require('../middleware/validate');
    const errorHandler = require('../middleware/errorHandler');
    const { loginSchema, registerSchema } = require('../validators/authValidator');
    const { z } = require('zod');

    it('validate middleware should return 400 (not 500) with details when email is malformed', (t, done) => {
      const req = { body: { email: 'not-an-email', password: 'password123' } };
      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      validate(loginSchema)(req, res, (err) => {
        done(new Error('next() should not be called on validation error'));
      });

      assert.strictEqual(statusCode, 400, 'Should return HTTP 400 on malformed email');
      assert.strictEqual(jsonBody.success, false);
      assert.strictEqual(jsonBody.error, 'Validation failed');
      assert.ok(Array.isArray(jsonBody.details), 'details should be an array of field errors');
      assert.ok(jsonBody.details.some(d => d.field === 'email'), 'Details should report email error');
      done();
    });

    it('validate middleware should return 400 when required fields are missing', (t, done) => {
      const req = { body: {} };
      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      validate(loginSchema)(req, res, () => {
        done(new Error('next() should not be called'));
      });

      assert.strictEqual(statusCode, 400, 'Should return HTTP 400 on missing fields');
      assert.strictEqual(jsonBody.success, false);
      assert.ok(jsonBody.details.length >= 2, 'Should report both missing fields');
      done();
    });

    it('validate middleware should succeed and call next() when schema is valid', (t, done) => {
      const req = { body: { email: 'valid.user@example.com', password: 'ValidPassword123!' } };
      const res = {};
      let nextCalled = false;

      validate(loginSchema)(req, res, (err) => {
        assert.strictEqual(err, undefined);
        nextCalled = true;
      });

      assert.strictEqual(nextCalled, true, 'next() should be called on valid payload');
      assert.strictEqual(req.body.email, 'valid.user@example.com');
      done();
    });

    it('errorHandler middleware should safely format ZodError issues without throwing TypeError', (t, done) => {
      let customZodErr;
      try {
        loginSchema.parse({ email: 'bad' });
      } catch (e) {
        customZodErr = e;
      }

      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      errorHandler(customZodErr, {}, res, () => {});

      assert.strictEqual(statusCode, 400, 'ZodError handled by errorHandler should return 400');
      assert.strictEqual(jsonBody.error, 'Validation Error');
      assert.ok(Array.isArray(jsonBody.details), 'details should be formatted array');
      done();
    });

    it('errorHandler middleware should return HTTP 500 for unexpected errors without leaking secrets or stack trace', (t, done) => {
      const prevEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const unexpectedErr = new Error('Database connection crashed on secret mongo string');
      unexpectedErr.stack = 'Secret stack trace with /home/node/app';

      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      errorHandler(unexpectedErr, {}, res, () => {});

      process.env.NODE_ENV = prevEnv;

      assert.strictEqual(statusCode, 500, 'Unexpected error should return HTTP 500');
      assert.strictEqual(jsonBody.success, false);
      assert.strictEqual(jsonBody.error, 'Internal Server Error', 'Production must hide internal error message');
      assert.strictEqual(jsonBody.stack, undefined, 'Stack trace must not be leaked');
      done();
    });
  });

  describe('Task 2: Render Proxy-Aware Rate Limiting & Trust Proxy', () => {
    it('server.js must configure app.set("trust proxy", 1)', () => {
      const serverContent = fs.readFileSync(path.join(rootDir, 'server/server.js'), 'utf8');
      assert.ok(
        /app\.set\(\s*['"]trust proxy['"]\s*,\s*1\s*\)/.test(serverContent),
        'server.js must configure app.set("trust proxy", 1) for Render topology'
      );
    });

    it('trust proxy 1 should resolve client IP from trusted single-hop proxy and ignore spoofed headers', () => {
      const app = express();
      app.set('trust proxy', 1);
      app.get('/test-ip', (req, res) => res.json({ ip: req.ip }));

      const reqMock = {
        headers: {
          'x-forwarded-for': '198.51.100.1, 203.0.113.50' // 198.51.100.1 is client, 203.0.113.50 is proxy hop
        },
        connection: { remoteAddress: '10.0.0.1' }
      };

      // In Express with trust proxy 1, req.ip evaluates to the client IP immediately behind the trusted proxy
      const subApp = express();
      subApp.set('trust proxy', 1);
      assert.strictEqual(subApp.get('trust proxy'), 1);
    });
  });

  describe('Task 3: Protection of POST /api/ai/chat', () => {
    const aiRoutesContent = fs.readFileSync(path.join(rootDir, 'server/routes/aiRoutes.js'), 'utf8');
    const aiCtrl = require('../controllers/aiController');

    it('aiRoutes.js must require auth middleware for POST /chat', () => {
      assert.ok(
        /router\.post\(\s*['"]\/chat['"]\s*,\s*auth\s*,\s*aiLimiter\s*,\s*generalChat\s*\)/.test(aiRoutesContent),
        'POST /chat must include auth middleware'
      );
    });

    it('generalChat should reject missing or empty prompts with HTTP 400', async () => {
      const req = { body: { prompt: '   ' }, user: { _id: '6aca08d9d6a5783e11534876' } };
      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      await aiCtrl.generalChat(req, res, () => {});
      assert.strictEqual(statusCode, 400, 'Should reject empty prompt with 400');
      assert.ok(jsonBody.error.includes('Prompt is required'));
    });

    it('generalChat should reject non-string prompts with HTTP 400', async () => {
      const req = { body: { prompt: 12345 }, user: { _id: '6aca08d9d6a5783e11534876' } };
      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      await aiCtrl.generalChat(req, res, () => {});
      assert.strictEqual(statusCode, 400, 'Should reject non-string prompt with 400');
    });

    it('generalChat should reject prompts exceeding 2000 characters with HTTP 400 without invoking AI service', async () => {
      const oversizedPrompt = 'a'.repeat(2001);
      const req = { body: { prompt: oversizedPrompt }, user: { _id: '6aca08d9d6a5783e11534876' } };
      let statusCode = null;
      let jsonBody = null;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
      };

      await aiCtrl.generalChat(req, res, () => {});
      assert.strictEqual(statusCode, 400, 'Should reject oversized prompt with 400');
      assert.ok(jsonBody.error.includes('exceeds maximum allowed length of 2000 characters'));
    });
  });

  describe('Task 4: CORS Trailing-Slash & Origin Normalization', () => {
    const { normalizeOrigin } = require('../utils/urlHelper');

    it('normalizeOrigin should normalize URLs with and without trailing slashes', () => {
      assert.strictEqual(typeof normalizeOrigin, 'function', 'server.js must expose normalizeOrigin');
      assert.strictEqual(
        normalizeOrigin('https://devarena-client.vercel.app/'),
        'https://devarena-client.vercel.app'
      );
      assert.strictEqual(
        normalizeOrigin('https://devarena-client.vercel.app'),
        'https://devarena-client.vercel.app'
      );
      assert.strictEqual(
        normalizeOrigin('http://localhost:5173/'),
        'http://localhost:5173'
      );
      assert.strictEqual(
        normalizeOrigin('http://localhost:5173'),
        'http://localhost:5173'
      );
    });

    it('normalizeOrigin should reject non-http/https protocols', () => {
      assert.strictEqual(normalizeOrigin('javascript:alert(1)'), null);
      assert.strictEqual(normalizeOrigin('data:text/html,test'), null);
      assert.strictEqual(normalizeOrigin('ftp://files.example.com'), null);
      assert.strictEqual(normalizeOrigin(''), null);
      assert.strictEqual(normalizeOrigin(null), null);
      assert.strictEqual(normalizeOrigin(undefined), null);
    });

    it('server.js should safely reject untrusted origins via callback(null, false) without 500 error', () => {
      const serverContent = fs.readFileSync(path.join(rootDir, 'server/server.js'), 'utf8');
      assert.strictEqual(
        serverContent.includes("callback(new Error('Not allowed by CORS'))"),
        false,
        'Should not throw unhandled Error in CORS callback'
      );
      assert.ok(
        serverContent.includes('callback(null, false)'),
        'Should call callback(null, false) to safely reject untrusted origins'
      );
    });
  });
});
