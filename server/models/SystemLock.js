const mongoose = require('mongoose');

const systemLockSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  lastResetAt: { type: Date, default: null },
  lockedBy: { type: String, default: null },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SystemLock', systemLockSchema);
