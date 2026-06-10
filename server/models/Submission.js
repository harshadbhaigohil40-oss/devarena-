const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },

  code: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },

  testResults: [{
    testCaseIndex: Number,
    passed: Boolean,
    output: String,
    executionTime: Number,
  }],
  xpEarned: { type: Number, default: 0 },

  submittedAt: { type: Date, default: Date.now, index: true },
});

// Compound index for checking user's submissions per challenge
submissionSchema.index({ userId: 1, challengeId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
