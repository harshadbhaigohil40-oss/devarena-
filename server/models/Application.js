const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Sourced', 'Contacted', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
    default: 'Sourced'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Ensure a recruiter can only have one application pipeline per developer
applicationSchema.index({ recruiterId: 1, developerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
