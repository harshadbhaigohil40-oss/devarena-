const mongoose = require('mongoose');

const urlValidator = {
  validator: function (v) {
    if (!v || v === '') return true;
    try {
      const url = new URL(v);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  },
  message: props => `Invalid URL '${props.value}': only http: and https: protocols are permitted.`
};

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  title: { type: String, required: true, maxlength: 100, trim: true },
  description: { type: String, required: true, maxlength: 2000, trim: true },
  thumbnailUrl: { type: String, default: '', validate: urlValidator, maxlength: 500 },
  liveUrl: { type: String, default: '', validate: urlValidator, maxlength: 500 },
  repoUrl: { type: String, default: '', validate: urlValidator, maxlength: 500 },

  techStack: [{ type: String, maxlength: 50 }],
  tags: [{ type: String, maxlength: 50 }],

  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },

  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
