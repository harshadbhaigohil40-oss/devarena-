const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { success, error } = require('../utils/responseHelper');
const leaderboardService = require('../services/leaderboardService');
const emailService = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const { updateStreak } = require('../services/xpService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Admin email is read from environment only — never hardcoded.
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/adminSeed');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return error(res, 'User with this email or username already exists.', 409);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Admin detection only works if ADMIN_EMAIL env var is configured
    const isAdmin = ADMIN_EMAIL && (email || '').toString().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const assignedRole = isAdmin ? 'admin' : (role === 'recruiter' ? 'recruiter' : 'developer');

    const user = await User.create({
      username,
      email,
      passwordHash: password,
      role: assignedRole,
      isEmailVerified: isAdmin ? true : false,
      verificationToken: isAdmin ? null : verificationToken,
    });

    if (user.role === 'developer') {
      await leaderboardService.updateEntry(user._id);
    }

    // Send verification email in the background to improve response time
    if (!isAdmin) {
      emailService.sendVerificationEmail(user.email, verificationToken).catch(e => console.error('Email failed to send', e));
    }

    success(res, {
      message: isAdmin
        ? 'Admin registration successful.'
        : 'Registration successful. Please check your email to verify your account.',
      user: user.toJSON(),
    }, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const emailStr = (email || '').toString().toLowerCase();
    const isAdminAccount = ADMIN_EMAIL && emailStr === ADMIN_EMAIL.toLowerCase();

    // Test account auto-provisioning removed for production security.
    // In development/test, use a seeded database instead.

    const user = await User.findOne({ email });
    if (!user) {
      // Auto-seed admin on first login ONLY if credentials match ADMIN_EMAIL and ADMIN_PASSWORD
      if (isAdminAccount && ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
        const newAdmin = new User({
          username: (ADMIN_EMAIL.split('@')[0] || 'admin').replace(/[^a-zA-Z0-9]/g, '') || 'admin',
          email: ADMIN_EMAIL,
          passwordHash: ADMIN_PASSWORD,
          role: 'admin',
          isEmailVerified: true,
        });
        await newAdmin.save();
        // Re-fetch with the full document
        const seededAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (seededAdmin) {
          return issueTokens(req, res, seededAdmin);
        }
      }
      return error(res, 'Invalid email or password.', 401);
    }

    // If this is the configured admin account, ensure admin role and email verification
    if (isAdminAccount && (user.role !== 'admin' || !user.isEmailVerified)) {
      user.role = 'admin';
      user.isEmailVerified = true;
      await user.save();
    }

    // Check Account Lockout
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return error(res, 'Account is locked due to multiple failed login attempts. Try again later.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // If admin password changed in env, re-hash it (env is authoritative for admin)
      if (isAdminAccount && ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
        user.passwordHash = ADMIN_PASSWORD;
        user.role = 'admin';
        user.isEmailVerified = true;
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        await user.save();
        return issueTokens(req, res, user);
      }

      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
      }
      await user.save();
      return error(res, 'Invalid email or password.', 401);
    }

    // Login successful — clear lockout
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    return issueTokens(req, res, user);
  } catch (err) {
    next(err);
  }
};

/**
 * Internal helper: updates streak, generates tokens, sets cookie, returns response.
 * Extracted to avoid duplicating logic across login paths.
 */
async function issueTokens(req, res, user) {
  await updateStreak(user._id);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return success(res, {
    accessToken,
    user: user.toJSON(),
  });
}

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return error(res, 'No refresh token provided', 401);

    const user = await User.findOne({ refreshToken });
    if (!user) return error(res, 'Invalid refresh token', 403);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    success(res, { accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie('refreshToken');
    success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return error(res, 'Invalid or expired verification token', 400);

    user.isEmailVerified = true;
    user.verificationToken = null;
    await user.save();

    success(res, { message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      await emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return the same message to prevent email enumeration
    success(res, { message: 'If that email exists, a password reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return error(res, 'Token is invalid or has expired', 400);

    user.passwordHash = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    success(res, { message: 'Password has been reset successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    success(res, { user: req.user });
  } catch (err) {
    next(err);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { credential, token } = req.body;
    let email, sub, name, picture;

    // ── REMOVED: test-token bypass. All Google logins must use a real credential.
    // ── In development, developers should use a real Google account or local email login.

    if (!process.env.GOOGLE_CLIENT_ID) {
      return error(res, 'Google authentication is not configured on the server.', 500);
    }

    if (credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        return error(res, 'Invalid Google token payload.', 401);
      }

      // Verify issuer
      const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
      if (!validIssuers.includes(payload.iss)) {
        return error(res, 'Invalid Google token issuer.', 401);
      }

      // Verify audience
      if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        return error(res, 'Invalid Google token audience.', 401);
      }

      // Verify expiration
      if (!payload.exp || payload.exp * 1000 < Date.now()) {
        return error(res, 'Google token has expired.', 401);
      }

      // Verify email is verified
      if (!payload.email || (!payload.email_verified && payload.email_verified !== 'true')) {
        return error(res, 'Google account email must be verified.', 401);
      }

      sub = payload.sub;
      email = payload.email.toLowerCase().trim();
      name = payload.name;
      picture = payload.picture;
    } else if (token) {
      // Validate access token audience via Google's tokeninfo endpoint
      const https = require('https');
      const tokenInfo = await new Promise((resolve, reject) => {
        https.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`, (resp) => {
          let data = '';
          resp.on('data', chunk => { data += chunk; });
          resp.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
          });
        }).on('error', reject);
      });

      if (!tokenInfo || tokenInfo.error) {
        return error(res, 'Invalid or expired Google access token.', 401);
      }

      // CRITICAL: Reject tokens minted for other applications (prevent confused deputy / token substitution)
      const expectedAud = process.env.GOOGLE_CLIENT_ID;
      const tokenAud = tokenInfo.aud || tokenInfo.azp;
      if (tokenAud !== expectedAud) {
        return error(res, 'Google access token was not issued for this application.', 401);
      }

      if (!tokenInfo.email || (tokenInfo.email_verified !== 'true' && tokenInfo.email_verified !== true)) {
        return error(res, 'Google account email must be verified.', 401);
      }

      if (!tokenInfo.expires_in || parseInt(tokenInfo.expires_in, 10) <= 0) {
        return error(res, 'Google access token has expired.', 401);
      }

      sub = tokenInfo.sub || tokenInfo.user_id;
      email = tokenInfo.email.toLowerCase().trim();

      // Retrieve optional profile details from userinfo now that token is audience-verified
      try {
        const userInfo = await new Promise((resolve, reject) => {
          https.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(token)}`, (resp) => {
            let data = '';
            resp.on('data', chunk => { data += chunk; });
            resp.on('end', () => {
              try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
          }).on('error', reject);
        });
        name = userInfo?.name;
        picture = userInfo?.picture;
      } catch (_) {
        // Non-critical profile info fallback
      }
    } else {
      return error(res, 'No Google credential or token provided', 400);
    }

    let user = await User.findOne({ email });

    if (!user) {
      let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      if (baseUsername.length < 3) baseUsername += 'user';
      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const isAdmin = ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      user = await User.create({
        username,
        email,
        authProvider: 'google',
        googleId: sub,
        role: isAdmin ? 'admin' : 'developer',
        isEmailVerified: true,
        avatar: picture,
      });
      await leaderboardService.updateEntry(user._id);
    } else {
      let needsSave = false;
      if (ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== 'admin') {
        user.role = 'admin';
        needsSave = true;
      }
      if (!user.googleId) {
        user.googleId = sub;
        if (user.authProvider !== 'google') user.authProvider = 'google';
        if (!user.avatar) user.avatar = picture;
        needsSave = true;
      }
      if (needsSave) await user.save();
    }

    // Enforce lockout for all accounts
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return error(res, 'Account is locked. Try again later.', 403);
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    return issueTokens(req, res, user);
  } catch (err) {
    console.error('Google login error:', err.message);
    return error(res, 'Google authentication failed', 401);
  }
};

// ── REMOVED: resetLockout export.
// ── The /reset-lockout route is removed from authRoutes.js.
// ── Account lockout expires automatically after 15 minutes.
// ── Admins can unlock accounts directly via the admin dashboard or DB.
