const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isValidHttpUrl } = require('../utils/urlHelper');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30, index: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  passwordHash: { type: String }, // Optional for Google Auth
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, default: null, index: true },
  role: { type: String, enum: ['developer', 'recruiter', 'admin'], default: 'developer' },

  // Profile
  avatar: {
    type: String,
    default: '',
    maxlength: 500,
    validate: {
      validator: (v) => !v || isValidHttpUrl(v),
      message: 'Avatar must be a valid http or https URL',
    },
  },
  bio: { type: String, default: '', maxlength: 500 },
  location: { type: String, default: '', maxlength: 100 },
  githubUrl: {
    type: String,
    default: '',
    maxlength: 500,
    validate: {
      validator: (v) => !v || isValidHttpUrl(v),
      message: 'GitHub URL must be a valid http or https URL',
    },
  },
  linkedinUrl: {
    type: String,
    default: '',
    maxlength: 500,
    validate: {
      validator: (v) => !v || isValidHttpUrl(v),
      message: 'LinkedIn URL must be a valid http or https URL',
    },
  },
  portfolioUrl: {
    type: String,
    default: '',
    maxlength: 500,
    validate: {
      validator: (v) => !v || isValidHttpUrl(v),
      message: 'Portfolio URL must be a valid http or https URL',
    },
  },

  // Gamification
  xp: { type: Number, default: 0, index: true },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },

  // Embedded hot data (bounded)
  recentBadges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
  }],
  topSkills: [{
    skillId: String,
    name: String,
    level: Number,
  }],

  // Recruiter-specific
  company: { type: String, default: '', maxlength: 100 },
  hiringFor: [{ type: String, maxlength: 50 }],

  // Stats
  challengesSolved: { type: Number, default: 0 },
  projectCount: { type: Number, default: 0 },

  // Security & Validation (Phase 1 & 2)
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  refreshToken: { type: String, default: null },
}, {
  timestamps: true,
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash || !candidatePassword) return false;
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.failedLoginAttempts;
  delete obj.lockUntil;
  delete obj.googleId;
  return obj;
};

function toPublicProfile(user) {
  if (!user) return null;
  const raw = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  const obj = { ...raw };
  delete obj.email;
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.failedLoginAttempts;
  delete obj.lockUntil;
  delete obj.googleId;
  return obj;
}

userSchema.methods.toPublicProfile = function () {
  return toPublicProfile(this);
};

const User = mongoose.model('User', userSchema);
User.toPublicProfile = toPublicProfile;
module.exports = User;
module.exports.toPublicProfile = toPublicProfile;
