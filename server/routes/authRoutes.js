const router = require('express').Router();
const { register, login, refresh, logout, getMe, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', auth, getMe);

module.exports = router;
