const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

describe('Security Remediation Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');

  describe('C-1 & C-3: No Hardcoded Admin Credentials or Emails in Tracked Source Files', () => {
    it('adminSeed.js should not contain hardcoded plaintext credentials', () => {
      const adminSeedPath = path.join(rootDir, 'server/config/adminSeed.js');
      const content = fs.readFileSync(adminSeedPath, 'utf8');

      assert.strictEqual(/ADMIN_EMAIL\s*=\s*['"][^'"]+@/.test(content), false, 'Hardcoded ADMIN_EMAIL found in adminSeed.js');
      assert.strictEqual(/ADMIN_PASSWORD\s*=\s*['"][^'"]+['"]/.test(content), false, 'Hardcoded ADMIN_PASSWORD found in adminSeed.js');
      assert.ok(content.includes('process.env.ADMIN_EMAIL'), 'adminSeed.js should read ADMIN_EMAIL from process.env');
      assert.ok(content.includes('process.env.ADMIN_PASSWORD'), 'adminSeed.js should read ADMIN_PASSWORD from process.env');
    });

    it('AuthContext.jsx should not contain hardcoded personal owner emails or fake sessions', () => {
      const authCtxPath = path.join(rootDir, 'client/src/context/AuthContext.jsx');
      const content = fs.readFileSync(authCtxPath, 'utf8');

      assert.strictEqual(/harshadbhaigohil/i.test(content), false, 'Hardcoded owner email/username found in AuthContext.jsx');
      assert.strictEqual(content.includes('fallbackUser'), false, 'Fake fallback session found in AuthContext.jsx');
      assert.strictEqual(content.includes('fallbackToken'), false, 'Fake fallback token found in AuthContext.jsx');
    });

    it('main.jsx should not contain hardcoded Google OAuth Client ID fallback', () => {
      const mainPath = path.join(rootDir, 'client/src/main.jsx');
      const content = fs.readFileSync(mainPath, 'utf8');

      assert.strictEqual(
        content.includes('55973889780-mgireamp6l5bnvtnsh4hsn02u2gr3luo.apps.googleusercontent.com'),
        false,
        'Hardcoded Google OAuth Client ID fallback found in main.jsx'
      );
    });
  });

  describe('C-4: Unauthenticated Reset Lockout Endpoint Elimination', () => {
    it('authRoutes.js must not register /reset-lockout endpoint', () => {
      const authRoutesPath = path.join(rootDir, 'server/routes/authRoutes.js');
      const content = fs.readFileSync(authRoutesPath, 'utf8');

      assert.strictEqual(/router\.post\(\s*['"]\/reset-lockout['"]/i.test(content), false, 'Found active /reset-lockout route in authRoutes.js');
    });

    it('authController.js must not export resetLockout handler', () => {
      const authController = require('../controllers/authController');
      assert.strictEqual(typeof authController.resetLockout, 'undefined', 'resetLockout should not be exported');
    });
  });

  describe('C-5: Test Account Auto-Provisioning in Production Eliminated', () => {
    it('authController.js must not contain isTestOrDevAccount auto-creation logic', () => {
      const authCtrlPath = path.join(rootDir, 'server/controllers/authController.js');
      const content = fs.readFileSync(authCtrlPath, 'utf8');

      assert.strictEqual(content.includes('isTestOrDevAccount'), false, 'Found isTestOrDevAccount in authController.js');
      assert.strictEqual(content.includes('testToken'), false, 'Found testToken in authController.js');
    });
  });

  describe('H-3: Rate Limiter Email-Pattern Bypass Eliminated', () => {
    it('rateLimiter.js must not bypass limits based on email string matching', () => {
      const rateLimiterPath = path.join(rootDir, 'server/middleware/rateLimiter.js');
      const content = fs.readFileSync(rateLimiterPath, 'utf8');

      assert.strictEqual(
        /email\.includes\(['"]test['"]\)/.test(content),
        false,
        'Found email string matching bypass in rateLimiter.js'
      );
      assert.strictEqual(
        /email\.includes\(['"]admin['"]\)/.test(content),
        false,
        'Found email string matching bypass in rateLimiter.js'
      );
    });
  });

  describe('C-6: Python and JS Execution Sandbox Defenses', () => {
    const { _testExports } = require('../controllers/submissionController');
    const {
      detectPyBannedImports,
      detectJSBannedPatterns,
      evaluatePython,
      evaluateJS,
    } = _testExports;

    it('should detect banned Python imports directly and with aliases', () => {
      assert.ok(detectPyBannedImports('import os'));
      assert.ok(detectPyBannedImports('import sys'));
      assert.ok(detectPyBannedImports('import subprocess'));
      assert.ok(detectPyBannedImports('from os import path'));
      assert.ok(detectPyBannedImports('import os as my_os'));
      assert.ok(detectPyBannedImports('import socket'));
      assert.ok(detectPyBannedImports('import shutil'));
    });

    it('should detect Python encoding bypass tricks', () => {
      assert.ok(detectPyBannedImports('__import__("\\x6fs")'));
      assert.ok(detectPyBannedImports('__import__("\\u006fs")'));
      assert.ok(detectPyBannedImports('chr(111) + chr(115)'));
    });

    it('should detect Python dynamic execution and file I/O primitives', () => {
      assert.ok(detectPyBannedImports('eval("1 + 1")'));
      assert.ok(detectPyBannedImports('exec("print(1)")'));
      assert.ok(detectPyBannedImports('compile("pass", "", "exec")'));
      assert.ok(detectPyBannedImports('open("/etc/passwd", "r")'));
      assert.ok(detectPyBannedImports('getattr(object, "attr")'));
    });

    it('should allow benign Python code to pass static checks', () => {
      assert.strictEqual(
        detectPyBannedImports(`
def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []
`),
        null
      );
    });

    it('should safely execute valid Python solutions and return correct answers', () => {
      const code = `
def add(a, b):
    return a + b
`;
      const testCases = [
        { input: '2, 3', expectedOutput: '5' },
        { input: '10, -4', expectedOutput: '6' },
      ];
      const results = evaluatePython(code, testCases, 'algorithms', 'def add(a, b):');

      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].passed, true, `Expected test 1 to pass: ${results[0].output}`);
      assert.strictEqual(results[1].passed, true, `Expected test 2 to pass: ${results[1].output}`);
    });

    it('should block attempts to read environment secrets from Python', () => {
      const exploitCode = `
def get_secret():
    import os
    return os.environ.get('JWT_SECRET', 'none')
`;
      const testCases = [{ input: '', expectedOutput: 'null' }];
      const results = evaluatePython(exploitCode, testCases, 'algorithms', 'def get_secret():');

      assert.strictEqual(results[0].passed, false);
      assert.ok(results[0].output.includes('Security Error'));
    });

    it('should detect banned JavaScript primitives', () => {
      assert.ok(detectJSBannedPatterns('process.exit(1)'));
      assert.ok(detectJSBannedPatterns('require("child_process")'));
      assert.ok(detectJSBannedPatterns('child_process.exec("whoami")'));
      assert.ok(detectJSBannedPatterns('Function("return process")()'));
    });

    it('should safely execute valid JavaScript solutions', () => {
      const code = `
function multiply(a, b) {
  return a * b;
}
`;
      const testCases = [
        { input: '3, 4', expectedOutput: '12' },
        { input: '5, 0', expectedOutput: '0' },
      ];
      const results = evaluateJS(code, testCases, 'algorithms', 'function multiply(a, b) {}');

      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].passed, true);
      assert.strictEqual(results[1].passed, true);
    });
  });
});
