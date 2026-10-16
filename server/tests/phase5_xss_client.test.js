const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { updateProfileSchema } = require('../controllers/userController');
const { isValidHttpUrl } = require('../utils/urlHelper');

describe('Phase 5: XSS and Client Hardening', () => {
  describe('isValidHttpUrl helper', () => {
    it('accepts valid http and https URLs', () => {
      assert.strictEqual(isValidHttpUrl('https://github.com/developer'), true);
      assert.strictEqual(isValidHttpUrl('http://example.com/portfolio'), true);
      assert.strictEqual(isValidHttpUrl('https://sub.domain.org/path?q=1#frag'), true);
    });

    it('rejects malicious javascript:, data:, and invalid schemes', () => {
      assert.strictEqual(isValidHttpUrl('javascript:alert(1)'), false);
      assert.strictEqual(isValidHttpUrl('javascript:void(0)'), false);
      assert.strictEqual(isValidHttpUrl('data:text/html,<script>alert(1)</script>'), false);
      assert.strictEqual(isValidHttpUrl('vbscript:msgbox(1)'), false);
      assert.strictEqual(isValidHttpUrl('file:///etc/passwd'), false);
      assert.strictEqual(isValidHttpUrl('not a url'), false);
      assert.strictEqual(isValidHttpUrl(''), false);
      assert.strictEqual(isValidHttpUrl(null), false);
      assert.strictEqual(isValidHttpUrl(undefined), false);
    });
  });

  describe('updateProfileSchema validation', () => {
    it('rejects javascript: URLs in githubUrl, linkedinUrl, portfolioUrl, avatar with validation errors', () => {
      const maliciousPayloads = [
        { githubUrl: 'javascript:alert(1)' },
        { linkedinUrl: 'javascript:alert(document.cookie)' },
        { portfolioUrl: 'javascript:fetch("https://attacker.com")' },
        { avatar: 'data:text/html,<script>steal()</script>' },
      ];

      for (const payload of maliciousPayloads) {
        const result = updateProfileSchema.safeParse(payload);
        assert.strictEqual(result.success, false, `Expected ${JSON.stringify(payload)} to be rejected`);
      }
    });

    it('accepts valid http and https URLs for profile links', () => {
      const validPayload = {
        githubUrl: 'https://github.com/gooddev',
        linkedinUrl: 'https://linkedin.com/in/gooddev',
        portfolioUrl: 'https://gooddev.io',
        avatar: 'https://cdn.example.com/avatars/user123.png',
        bio: 'Full stack developer building cool stuff',
        location: 'San Francisco, CA',
        company: 'DevArena Inc',
        hiringFor: ['React Engineer', 'Node.js Architect'],
      };

      const result = updateProfileSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
    });

    it('enforces maximum length boundaries on fields', () => {
      // Over 500 chars for bio
      const longBio = 'a'.repeat(501);
      const resBio = updateProfileSchema.safeParse({ bio: longBio });
      assert.strictEqual(resBio.success, false);

      // Over 100 chars for location
      const longLocation = 'b'.repeat(101);
      const resLoc = updateProfileSchema.safeParse({ location: longLocation });
      assert.strictEqual(resLoc.success, false);

      // Over 50 chars for individual hiring role
      const resHiring = updateProfileSchema.safeParse({ hiringFor: ['x'.repeat(51)] });
      assert.strictEqual(resHiring.success, false);
    });

    it('allows clearing profile URL fields with empty string or omitting them', () => {
      const clearPayload = {
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        avatar: '',
      };
      const result = updateProfileSchema.safeParse(clearPayload);
      assert.strictEqual(result.success, true);
    });
  });

  describe('Client Hardening Verification', () => {
    it('verifies ChallengeDetail.jsx iframes remove allow-same-origin', () => {
      const challengeDetailPath = path.resolve(__dirname, '../../client/src/features/challenges/ChallengeDetail.jsx');
      const content = fs.readFileSync(challengeDetailPath, 'utf8');

      // Assert sandbox="allow-scripts" is present
      assert.ok(content.includes('sandbox="allow-scripts"'), 'iframe must have sandbox="allow-scripts"');

      // Assert allow-same-origin is NOT present
      assert.ok(!content.includes('allow-same-origin'), 'iframe sandbox must NOT contain allow-same-origin');
    });

    it('verifies client/vercel.json contains CSP and security headers and no onrender.com', () => {
      const vercelPath = path.resolve(__dirname, '../../client/vercel.json');
      const vercelJson = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

      assert.ok(vercelJson.headers && vercelJson.headers.length > 0, 'vercel.json must define headers');
      const rootHeaders = vercelJson.headers[0].headers;

      const csp = rootHeaders.find(h => h.key === 'Content-Security-Policy');
      assert.ok(csp, 'CSP header must be present');
      assert.ok(csp.value.includes("frame-ancestors 'none'"), 'CSP must include frame-ancestors none');
      assert.ok(csp.value.includes("https://accounts.google.com"), 'CSP must include Google accounts domain');

      const xfo = rootHeaders.find(h => h.key === 'X-Frame-Options');
      assert.strictEqual(xfo?.value, 'DENY');

      const xcto = rootHeaders.find(h => h.key === 'X-Content-Type-Options');
      assert.strictEqual(xcto?.value, 'nosniff');

      // Assert no hardcoded onrender.com rewrite
      const rawText = fs.readFileSync(vercelPath, 'utf8');
      assert.ok(!rawText.includes('onrender.com'), 'vercel.json must not have onrender.com');
    });

    it('verifies client helpers and Profile.jsx link rendering sanity', () => {
      const profilePath = path.resolve(__dirname, '../../client/src/pages/Profile.jsx');
      const profileContent = fs.readFileSync(profilePath, 'utf8');

      // Must import and use isValidHttpUrl
      assert.ok(profileContent.includes('isValidHttpUrl'), 'Profile.jsx must use isValidHttpUrl');
      assert.ok(profileContent.includes('rel="noopener noreferrer"'), 'Profile links must include rel="noopener noreferrer"');
    });
  });
});
