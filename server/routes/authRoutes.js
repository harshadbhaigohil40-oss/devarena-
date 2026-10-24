const router = require('express').Router();
const {
  register, login, refresh, logout, getMe,
  verifyEmail, forgotPassword, resetPassword, googleLogin,
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  verifyEmailSchema,
  googleLoginSchema,
} = require('../validators/authValidator');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', auth, logout);
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), verifyEmail);
router.get('/verify-email', authLimiter, verifyEmail);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.get('/me', auth, getMe);

// REMOVED: /reset-lockout — this unauthenticated endpoint allowed any caller
// to unlock a brute-force-locked account, nullifying the lockout protection.
// Accounts unlock automatically after 15 minutes via the lockUntil expiry.

module.exports = router;
