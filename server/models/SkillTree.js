const mongoose = require('mongoose');

const skillTreeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🌳' },
  color: { type: String, default: '#6c5ce7' },

  nodes: [{
    nodeId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    xpRequired: { type: Number, default: 0 },
    challengeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    connections: [String],
    tier: { type: Number, default: 1 },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('SkillTree', skillTreeSchema);
