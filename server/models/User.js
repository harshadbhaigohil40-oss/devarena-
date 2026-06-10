const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30, index: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['developer', 'recruiter', 'admin'], default: 'developer' },

  // Profile
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 500 },
  location: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },

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
  company: { type: String, default: '' },
  hiringFor: [String],

  // Stats
  challengesSolved: { type: Number, default: 0 },
  projectCount: { type: Number, default: 0 },

  // Security & Validation (Phase 1)
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
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
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
