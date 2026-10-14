const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  repoUrl: { type: String, default: '' },

  techStack: [String],
  tags: [String],

  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },

  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
