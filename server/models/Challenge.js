const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], required: true, index: true },
  category: { type: String, required: true, index: true },
  tags: [String],

  xpReward: { type: Number, required: true },

  starterCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false },
  }],
  solution: { type: String, default: '' },
  hints: [String],

  // Stats
  completionCount: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 0 },
  avgCompletionTime: { type: Number, default: 0 },

  // Skill tree linkage
  skillTreeId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillTree' },
  prerequisiteChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Challenge', challengeSchema);
