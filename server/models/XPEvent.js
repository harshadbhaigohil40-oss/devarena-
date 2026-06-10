const mongoose = require('mongoose');

const xpEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  amount: { type: Number, required: true },
  source: { type: String, enum: ['challenge', 'project', 'badge', 'streak', 'daily_login'], required: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('XPEvent', xpEventSchema);
