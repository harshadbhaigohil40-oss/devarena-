const Project = require('../models/Project');
const User = require('../models/User');
const XPEvent = require('../models/XPEvent');
const { awardXP } = require('../services/xpService');
const { success, error, paginated } = require('../utils/responseHelper');
const { XP_REWARDS } = require('../../shared/xpConfig');
const { escapeRegex, clampPagination } = require('../utils/queryHelper');
const { isValidHttpUrl } = require('../utils/urlHelper');

exports.listProjects = async (req, res, next) => {
  try {
    const { search, tag, userId } = req.query;
    const { page, limit, skip } = clampPagination(req.query, 12, 100);
    const filter = {};

    if (userId) filter.userId = userId;
    if (tag) filter.tags = tag;
    if (search && typeof search === 'string') {
      filter.title = { $regex: escapeRegex(search), $options: 'i' };
    }

    const projects = await Project.find(filter)
      .populate('userId', 'username avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);
    paginated(res, projects, total, page, limit);
  } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
  try {
    // Atomically increment views without read-modify-write
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('userId', 'username avatar level bio');

    if (!project) return error(res, 'Project not found.', 404);

    success(res, { project });
  } catch (err) { next(err); }
};

function validateUrl(str) {
  if (!str || typeof str !== 'string') return true;
  const trimmed = str.trim();
  if (trimmed === '') return true;
  return isValidHttpUrl(trimmed);
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

    if (liveUrl && !validateUrl(liveUrl)) {
      return error(res, 'Invalid liveUrl: only http: and https: protocols are permitted.', 400);
    }
    if (repoUrl && !validateUrl(repoUrl)) {
      return error(res, 'Invalid repoUrl: only http: and https: protocols are permitted.', 400);
    }
    if (thumbnailUrl && !validateUrl(thumbnailUrl)) {
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

    // Cap project-creation XP: award only for the first N projects per user
    // (configured in shared/xpConfig.js) and not on re-create after delete.
    const maxRewardedProjects = XP_REWARDS.project?.maxRewardedProjects ?? 5;
    const rewardedCount = await XPEvent.countDocuments({ userId: req.userId, source: 'project' });
    if (rewardedCount < maxRewardedProjects) {
      await awardXP(req.userId, XP_REWARDS.project.create, 'project', project._id, `Created project: ${project.title}`);
    }

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

    if (liveUrl !== undefined && !validateUrl(liveUrl)) {
      return error(res, 'Invalid liveUrl: only http: and https: protocols are permitted.', 400);
    }
    if (repoUrl !== undefined && !validateUrl(repoUrl)) {
      return error(res, 'Invalid repoUrl: only http: and https: protocols are permitted.', 400);
    }
    if (thumbnailUrl !== undefined && !validateUrl(thumbnailUrl)) {
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
    const query = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.userId };

    const project = await Project.findOneAndDelete(query);
    if (!project) return error(res, 'Project not found or unauthorized.', 404);

    await User.findByIdAndUpdate(project.userId, { $inc: { projectCount: -1 } });

    success(res, { message: 'Project deleted.' });
  } catch (err) { next(err); }
};

exports.likeProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.userId;

    const existing = await Project.findOne({ _id: projectId, likedBy: userId });
    let updated;
    let liked;

    if (existing) {
      // Atomically remove like
      updated = await Project.findOneAndUpdate(
        { _id: projectId, likedBy: userId },
        {
          $pull: { likedBy: userId },
          $inc: { likes: -1 },
        },
        { new: true }
      );
      liked = false;
    } else {
      // Atomically add like
      updated = await Project.findOneAndUpdate(
        { _id: projectId, likedBy: { $ne: userId } },
        {
          $addToSet: { likedBy: userId },
          $inc: { likes: 1 },
        },
        { new: true }
      );
      liked = true;
    }

    if (!updated) {
      const fallback = await Project.findById(projectId);
      if (!fallback) return error(res, 'Project not found.', 404);
      return success(res, { likes: fallback.likes, liked: fallback.likedBy.includes(userId) });
    }

    success(res, { likes: updated.likes, liked });
  } catch (err) { next(err); }
};
