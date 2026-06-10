const Application = require('../models/Application');
const User = require('../models/User');

// Get all applications for the logged-in recruiter
exports.getPipeline = async (req, res, next) => {
  try {
    const pipeline = await Application.find({ recruiterId: req.userId })
      .populate('developerId', 'username level xp topSkills')
      .sort({ updatedAt: -1 });

    res.json({
      status: 'success',
      data: { pipeline }
    });
  } catch (err) {
    next(err);
  }
};

// Add a developer to the pipeline (Sourced)
exports.addToPipeline = async (req, res, next) => {
  try {
    const { developerId } = req.body;

    const existing = await Application.findOne({ recruiterId: req.userId, developerId });
    if (existing) {
      return res.status(400).json({ status: 'error', error: 'Developer already in pipeline' });
    }

    const application = await Application.create({
      recruiterId: req.userId,
      developerId,
      status: 'Sourced'
    });

    await application.populate('developerId', 'username level xp topSkills');

    res.status(201).json({
      status: 'success',
      data: { application }
    });
  } catch (err) {
    next(err);
  }
};

// Update pipeline status (drag and drop)
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: id, recruiterId: req.userId },
      { status, notes },
      { new: true, runValidators: true }
    ).populate('developerId', 'username level xp topSkills');

    if (!application) {
      return res.status(404).json({ status: 'error', error: 'Application not found' });
    }

    res.json({
      status: 'success',
      data: { application }
    });
  } catch (err) {
    next(err);
  }
};

// Remove from pipeline
exports.removeFromPipeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findOneAndDelete({ _id: id, recruiterId: req.userId });

    if (!application) {
      return res.status(404).json({ status: 'error', error: 'Application not found' });
    }

    res.json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
