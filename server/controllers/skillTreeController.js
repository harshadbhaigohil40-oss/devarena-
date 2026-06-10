const SkillTree = require('../models/SkillTree');
const Submission = require('../models/Submission');
const { success, error } = require('../utils/responseHelper');

exports.listSkillTrees = async (req, res, next) => {
  try {
    const trees = await SkillTree.find().select('-nodes.challengeIds');
    success(res, { skillTrees: trees });
  } catch (err) { next(err); }
};

exports.getSkillTree = async (req, res, next) => {
  try {
    const tree = await SkillTree.findById(req.params.id);
    if (!tree) return error(res, 'Skill tree not found.', 404);

    // Get user's completed challenges if logged in
    let completedChallenges = new Set();
    if (req.user) {
      const solved = await Submission.find({
        userId: req.user._id,
        status: 'passed',
      }).distinct('challengeId');
      completedChallenges = new Set(solved.map(id => id.toString()));
    }

    // Add progress to each node
    const nodesWithProgress = tree.nodes.map(node => {
      const completedInNode = node.challengeIds.filter(id =>
        completedChallenges.has(id.toString())
      ).length;
      const totalInNode = node.challengeIds.length;

      return {
        ...node.toObject(),
        progress: totalInNode > 0 ? Math.round((completedInNode / totalInNode) * 100) : 0,
        completed: completedInNode,
        total: totalInNode,
        unlocked: node.tier === 1 || completedInNode > 0,
      };
    });

    success(res, {
      skillTree: {
        ...tree.toObject(),
        nodes: nodesWithProgress,
      },
    });
  } catch (err) { next(err); }
};
