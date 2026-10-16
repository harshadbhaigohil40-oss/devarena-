const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { success, error } = require('../utils/responseHelper');
const leaderboardService = require('../services/leaderboardService');
const emailService = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const { updateStreak } = require('../services/xpService');
const logger = require('../utils/logger');

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

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
    const normalizedEmail = (email || '').toLowerCase().trim();

    if (adminEmail && normalizedEmail === adminEmail) {
      return error(res, 'This email is reserved for system administration. Sign in with the seeded credentials.', 400);
    }

    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
    if (existingUser) {
      return error(res, 'User with this email or username already exists.', 409);
    }

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const verificationToken = hashToken(rawVerificationToken);
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const assignedRole = role === 'recruiter' ? 'recruiter' : 'developer';

    const user = await User.create({
      username,
      email: normalizedEmail,
      passwordHash: password,
      role: assignedRole,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    if (user.role === 'developer') {
      await leaderboardService.updateEntry(user._id);
    }

    // Send verification email in the background to improve response time
    emailService.sendVerificationEmail(user.email, rawVerificationToken).catch(e => logger.error({ err: e }, 'Email failed to send'));

    success(res, {
      message: 'Registration successful. Please check your email to verify your account.',
      user: user.toJSON(),
    }, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return error(res, 'Invalid email or password.', 401);
    }

    // Reject unverified emails with 403, except Google accounts
    if (user.authProvider !== 'google' && user.isEmailVerified === false) {
      return error(res, 'Please verify your email address before logging in.', 403);
    }

    // If account was created via Google OAuth and has no password hash
    if (!user.passwordHash && user.authProvider === 'google') {
      return error(res, 'This account is registered with Google. Please use "Continue with Google" to log in.', 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid email or password.', 401);
    }

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
  const rawRefreshToken = generateRefreshToken();

  user.refreshToken = hashToken(rawRefreshToken);
  await user.save();

  res.cookie('refreshToken', rawRefreshToken, {
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
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) return error(res, 'No refresh token provided', 401);

    const hashedToken = hashToken(rawRefreshToken);
    const user = await User.findOne({ refreshToken: hashedToken });
    if (!user) return error(res, 'Invalid refresh token', 403);

    const newAccessToken = generateAccessToken(user);
    const newRawRefreshToken = generateRefreshToken();

    user.refreshToken = hashToken(newRawRefreshToken);
    await user.save();

    res.cookie('refreshToken', newRawRefreshToken, {
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
    const userId = req.userId || req.user?._id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
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
    if (!token) return error(res, 'Verification token is required', 400);

    const hashedToken = hashToken(token);
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) return error(res, 'Invalid or expired verification token', 400);

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      return error(res, 'Verification token has expired. Please request a new one.', 400);
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
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
    user.refreshToken = null;
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
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
    if (adminEmail && email === adminEmail) {
      return error(res, 'This email is reserved for system administration. Sign in with the seeded credentials.', 403);
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

      user = await User.create({
        username,
        email,
        authProvider: 'google',
        googleId: sub,
        role: 'developer',
        isEmailVerified: true,
        avatar: picture,
      });
      await leaderboardService.updateEntry(user._id);
    } else {
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = sub;
        if (user.authProvider !== 'google') user.authProvider = 'google';
        if (!user.avatar) user.avatar = picture;
        needsSave = true;
      }
      if (needsSave) await user.save();
    }

    return issueTokens(req, res, user);
  } catch (err) {
    logger.error({ err }, 'Google login error');
    return error(res, 'Google authentication failed', 401);
  }
};

// ── REMOVED: resetLockout export.
// ── The /reset-lockout route is removed from authRoutes.js.
// ── Account lockout expires automatically after 15 minutes.
// ── Admins can unlock accounts directly via the admin dashboard or DB.
