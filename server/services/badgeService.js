const User = require('../models/User');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const Submission = require('../models/Submission');
const Project = require('../models/Project');
const XPEvent = require('../models/XPEvent');
const { levelFromXP } = require('../../shared/xpConfig');
const { emitBadgeUnlocked } = require('./socketService');
const notificationService = require('./notificationService');

// In-memory cache for Badge definitions
let cachedBadges = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getCachedBadges() {
  const now = Date.now();
  if (cachedBadges && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return cachedBadges;
  }
  cachedBadges = await Badge.find().lean();
  cacheTimestamp = now;
  return cachedBadges;
}

const evaluateBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  const allBadges = await getCachedBadges();

  // Query already earned badges from UserBadge model
  const userBadges = await UserBadge.find({ userId }).select('badgeId').lean();
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId.toString()));

  const newBadges = [];

  // Get user stats
  const [challengeCount, projectCount] = await Promise.all([
    Submission.countDocuments({ userId, status: 'passed' }),
    Project.countDocuments({ userId }),
  ]);

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge._id.toString())) continue;

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
      try {
        // Enforce uniqueness via UserBadge compound index (userId, badgeId)
        await UserBadge.create({
          userId,
          badgeId: badge._id,
        });
      } catch (err) {
        if (err.code === 11000) {
          // Already awarded concurrently, skip
          continue;
        }
        throw err;
      }

      newBadges.push(badge);

      // Recompute level after badge XP bonuses
      if (badge.xpBonus > 0) {
        const updated = await User.findByIdAndUpdate(
          userId,
          { $inc: { xp: badge.xpBonus } },
          { new: true }
        );
        const newLevel = levelFromXP(updated.xp);
        if (newLevel !== updated.level) {
          await User.findByIdAndUpdate(userId, { level: newLevel });
        }

        await XPEvent.create({
          userId,
          amount: badge.xpBonus,
          source: 'badge',
          sourceId: badge._id,
          description: `Badge unlocked: ${badge.name}`,
        });
      }

      // Update recentBadges display cache (keep max 5)
      await User.findByIdAndUpdate(userId, {
        $push: {
          recentBadges: {
            $each: [{
              badgeId: badge._id,
              name: badge.name,
              icon: badge.icon,
              earnedAt: new Date(),
            }],
            $position: 0,
            $slice: 5,
          },
        },
      });

      // Create notification and emit real-time event
      await notificationService.createNotification({
        userId,
        title: '🏅 Badge Unlocked!',
        message: `You earned the "${badge.name}" badge! ${badge.description || ''}`.trim(),
        type: 'success',
        link: `/profile/${userId}`,
      });
      emitBadgeUnlocked(userId, badge);
    }
  }

  return newBadges;
};

const getUserBadges = async (userId) => {
  const userBadges = await UserBadge.find({ userId })
    .populate('badgeId')
    .sort({ earnedAt: -1 })
    .lean();

  return userBadges
    .filter(ub => ub.badgeId)
    .map(ub => ({
      ...ub.badgeId,
      earnedAt: ub.earnedAt,
    }));
};

module.exports = {
  evaluateBadges,
  getUserBadges,
  getCachedBadges,
};
