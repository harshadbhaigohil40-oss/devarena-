const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, enum: ['achievement', 'streak', 'skill', 'community', 'special'], required: true },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], required: true },

  criteria: {
    type: { type: String, enum: ['xp_threshold', 'challenge_count', 'streak_days', 'skill_level', 'project_count'], required: true },
    value: { type: Number, required: true },
  },

  xpBonus: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Badge', badgeSchema);
