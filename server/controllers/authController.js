const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { success, error } = require('../utils/responseHelper');
const leaderboardService = require('../services/leaderboardService');
const emailService = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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

    const user = await User.create({
      username,
      email,
      passwordHash: password,
      role: role === 'recruiter' ? 'recruiter' : 'developer',
      verificationToken
    });

    if (user.role === 'developer') {
      await leaderboardService.updateEntry(user._id);
    }

    // Send verification email in the background to improve response time
    emailService.sendVerificationEmail(user.email, verificationToken).catch(e => console.error('Email failed to send', e));

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

    const user = await User.findOne({ email });
    if (!user) {
      return error(res, 'Invalid email or password.', 401);
    }

    // Check Account Lockout
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return error(res, 'Account is locked due to multiple failed login attempts. Try again later.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
      }
      await user.save();
      return error(res, 'Invalid email or password.', 401);
    }

    // Login successful
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    
    const { updateStreak } = require('../services/xpService');
    await updateStreak(user._id);

    // Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    success(res, {
      accessToken,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

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
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
      resetPasswordExpires: { $gt: Date.now() }
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
    const { credential } = req.body;
    if (!credential) return error(res, 'No Google credential provided', 400);

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      if (baseUsername.length < 3) baseUsername += 'user';
      let username = baseUsername;
      let counter = 1;
      while(await User.findOne({username})) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        username,
        email,
        authProvider: 'google',
        googleId: sub,
        isEmailVerified: true,
        avatar: picture,
      });
      await leaderboardService.updateEntry(user._id);
    } else {
      if (!user.googleId) {
        user.googleId = sub;
        if (user.authProvider !== 'google') {
           user.authProvider = 'google';
        }
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return error(res, 'Account is locked. Try again later.', 403);
    }
    
    const { updateStreak } = require('../services/xpService');
    await updateStreak(user._id);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    success(res, {
      accessToken,
      user: user.toJSON(),
    });

  } catch (err) {
    console.error('Google login error:', err);
    return error(res, 'Google authentication failed', 401);
  }
};

