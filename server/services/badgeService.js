const User = require('../models/User');
const Badge = require('../models/Badge');
const Submission = require('../models/Submission');
const Project = require('../models/Project');
const { emitBadgeUnlocked } = require('./socketService');

const evaluateBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  const allBadges = await Badge.find();
  const earnedBadgeIds = user.recentBadges.map(b => b.badgeId?.toString());
  // Get full earned badges list from XP events
  const XPEvent = require('../models/XPEvent');
  const badgeEvents = await XPEvent.find({ userId, source: 'badge' });
  const allEarnedIds = new Set([
    ...earnedBadgeIds,
    ...badgeEvents.map(e => e.sourceId?.toString()),
  ]);

  const newBadges = [];

  // Get user stats
  const challengeCount = await Submission.countDocuments({ userId, status: 'passed' });
  const projectCount = await Project.countDocuments({ userId });

  for (const badge of allBadges) {
    if (allEarnedIds.has(badge._id.toString())) continue;

    let earned = false;

    switch (badge.criteria.type) {
      case 'xp_threshold':
        earned = user.xp >= badge.criteria.value;
        break;
      case 'challenge_count':
        earned = challengeCount >= badge.criteria.value;
        break;
      case 'streak_days':
        earned = user.streak >= badge.criteria.value;
        break;
      case 'project_count':
        earned = projectCount >= badge.criteria.value;
        break;
      case 'skill_level':
        earned = user.topSkills?.some(s => s.level >= badge.criteria.value) || false;
        break;
    }

    if (earned) {
      newBadges.push(badge);

      // Add to recent badges (keep max 5)
      user.recentBadges.unshift({
        badgeId: badge._id,
        name: badge.name,
        icon: badge.icon,
        earnedAt: new Date(),
      });
      if (user.recentBadges.length > 5) {
        user.recentBadges = user.recentBadges.slice(0, 5);
      }

      // Emit real-time notification
      emitBadgeUnlocked(userId, badge);

      // Log XP bonus
      if (badge.xpBonus > 0) {
        await require('../models/XPEvent').create({
          userId,
          amount: badge.xpBonus,
          source: 'badge',
          sourceId: badge._id,
          description: `Badge unlocked: ${badge.name}`,
        });
        user.xp += badge.xpBonus;
      }
    }
  }

  if (newBadges.length > 0) {
    await user.save();
  }

  return newBadges;
};

const getUserBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  const XPEvent = require('../models/XPEvent');
  const badgeEvents = await XPEvent.find({ userId, source: 'badge' }).sort({ createdAt: -1 });
  const badgeIds = badgeEvents.map(e => e.sourceId).filter(Boolean);

  // Also include recent badges
  const recentIds = user.recentBadges.map(b => b.badgeId).filter(Boolean);
  const allIds = [...new Set([...badgeIds, ...recentIds])];

  const badges = await Badge.find({ _id: { $in: allIds } });
  return badges;
};

module.exports = { evaluateBadges, getUserBadges };
