const Project = require('../models/Project');
const User = require('../models/User');
const { awardXP } = require('../services/xpService');
const { success, error, paginated } = require('../utils/responseHelper');
const { XP_REWARDS } = require('../../shared/xpConfig');

exports.listProjects = async (req, res, next) => {
  try {
    const { search, tag, page = 1, limit = 12, userId } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const projects = await Project.find(filter)
      .populate('userId', 'username avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);
    paginated(res, projects, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('userId', 'username avatar level bio');
    if (!project) return error(res, 'Project not found.', 404);

    // Increment views
    project.views += 1;
    await project.save();

    success(res, { project });
  } catch (err) { next(err); }
};

function isValidHttpUrl(str) {
  if (!str || typeof str !== 'string') return true;
  const trimmed = str.trim();
  if (trimmed === '') return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

exports.createProject = async (req, res, next) => {
  try {
    const { title, description, liveUrl, repoUrl, techStack, tags, thumbnailUrl } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return error(res, 'Project title is required.', 400);
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return error(res, 'Project description is required.', 400);
    }

    if (liveUrl && !isValidHttpUrl(liveUrl)) {
      return error(res, 'Invalid liveUrl: only http: and https: protocols are permitted.', 400);
    }
    if (repoUrl && !isValidHttpUrl(repoUrl)) {
      return error(res, 'Invalid repoUrl: only http: and https: protocols are permitted.', 400);
    }
    if (thumbnailUrl && !isValidHttpUrl(thumbnailUrl)) {
      return error(res, 'Invalid thumbnailUrl: only http: and https: protocols are permitted.', 400);
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      liveUrl: liveUrl ? liveUrl.trim() : '',
      repoUrl: repoUrl ? repoUrl.trim() : '',
      thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : '',
      techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : []),
      tags: Array.isArray(tags) ? tags : [],
      userId: req.userId,
    });

    // Award XP
    await awardXP(req.userId, XP_REWARDS.project.create, 'project', project._id, `Created project: ${project.title}`);

    // Update user project count
    await User.findByIdAndUpdate(req.userId, { $inc: { projectCount: 1 } });

    success(res, { project }, 201);
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return error(res, 'Project not found or unauthorized.', 404);

    const { title, description, liveUrl, repoUrl, techStack, tags, thumbnailUrl } = req.body;

    if (liveUrl !== undefined && !isValidHttpUrl(liveUrl)) {
      return error(res, 'Invalid liveUrl: only http: and https: protocols are permitted.', 400);
    }
    if (repoUrl !== undefined && !isValidHttpUrl(repoUrl)) {
      return error(res, 'Invalid repoUrl: only http: and https: protocols are permitted.', 400);
    }
    if (thumbnailUrl !== undefined && !isValidHttpUrl(thumbnailUrl)) {
      return error(res, 'Invalid thumbnailUrl: only http: and https: protocols are permitted.', 400);
    }

    if (title !== undefined) project.title = String(title).trim();
    if (description !== undefined) project.description = String(description).trim();
    if (liveUrl !== undefined) project.liveUrl = liveUrl ? liveUrl.trim() : '';
    if (repoUrl !== undefined) project.repoUrl = repoUrl ? repoUrl.trim() : '';
    if (thumbnailUrl !== undefined) project.thumbnailUrl = thumbnailUrl ? thumbnailUrl.trim() : '';
    if (techStack !== undefined) {
      project.techStack = Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : []);
    }
    if (tags !== undefined) {
      project.tags = Array.isArray(tags) ? tags : [];
    }

    await project.save();

    success(res, { project });
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) return error(res, 'Project not found or unauthorized.', 404);

    await User.findByIdAndUpdate(req.userId, { $inc: { projectCount: -1 } });

    success(res, { message: 'Project deleted.' });
  } catch (err) { next(err); }
};

exports.likeProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return error(res, 'Project not found.', 404);

    const isLiked = project.likedBy.includes(req.userId);
    if (isLiked) {
      project.likedBy.pull(req.userId);
      project.likes -= 1;
    } else {
      project.likedBy.push(req.userId);
      project.likes += 1;
    }
    await project.save();

    success(res, { likes: project.likes, liked: !isLiked });
  } catch (err) { next(err); }
};
