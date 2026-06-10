const router = require('express').Router();
const { register, login, refresh, logout, getMe, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../validators/authValidator');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.get('/me', auth, getMe);

module.exports = router;
