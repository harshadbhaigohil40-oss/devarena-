const SkillTree = require('../models/SkillTree');
const Submission = require('../models/Submission');
const { success, error } = require('../utils/responseHelper');

exports.listSkillTrees = async (req, res, next) => {
  try {
    const trees = await SkillTree.find();
    
    let completedChallenges = new Set();
    if (req.user) {
      const solved = await Submission.find({
        userId: req.user._id,
        status: 'passed',
      }).distinct('challengeId');
      completedChallenges = new Set(solved.map(id => id.toString()));
    }

    const treesWithProgress = trees.map(tree => {
      let totalChallenges = 0;
      let solvedChallenges = 0;

      tree.nodes.forEach(node => {
        totalChallenges += node.challengeIds.length;
        solvedChallenges += node.challengeIds.filter(id => completedChallenges.has(id.toString())).length;
      });

      const obj = tree.toObject();
      delete obj.nodes; // omit nodes payload
      obj.progress = totalChallenges > 0 ? Math.round((solvedChallenges / totalChallenges) * 100) : 0;
      return obj;
    });

    success(res, { skillTrees: treesWithProgress });
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
        unlocked: !!(node.tier === 1 || completedInNode > 0 || (req.user && req.user.xp >= node.xpRequired)),
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
