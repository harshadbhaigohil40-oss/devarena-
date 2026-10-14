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

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
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

    Object.assign(project, req.body);
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
