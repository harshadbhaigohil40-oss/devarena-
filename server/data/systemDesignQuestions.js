/**
 * System Design Roadmap — 245 Topics & Real Interview Questions
 * Combines all 5 Tiers (7 Sections)
 * Compatible with existing DevArena Compiler & Execution Harness
 */

const tier1 = require('./sd_tier1_fundamentals');
const tier2Storage = require('./sd_tier2_storage');
const tier2Compute = require('./sd_tier2_compute');
const tier3 = require('./sd_tier3_distributed');
const tier4Interview = require('./sd_tier4_interview');
const tier4Cloud = require('./sd_tier4_cloud');
const tier5 = require('./sd_tier5_architect');

const rawQuestions = [
  ...tier1,
  ...tier2Storage,
  ...tier2Compute,
  ...tier3,
  ...tier4Interview,
  ...tier4Cloud,
  ...tier5
];

const diffMap = {
  'Easy': 'beginner',
  'Medium': 'intermediate',
  'Hard': 'advanced',
  'Advanced': 'expert'
};

const conflictingSlugs = new Set([
  'horizontal-scaling',
  'rate-limiting',
  'cache-invalidation',
  'stream-processing',
  'design-a-rate-limiter',
  'design-a-notification-system'
]);

const systemDesignQuestions = rawQuestions.map((q, idx) => {
  const origDiff = q.difficulty || (q.tier === 1 ? 'Easy' : q.tier <= 3 ? 'Medium' : 'Hard');
  const mappedDiff = diffMap[origDiff] || origDiff.toLowerCase();
  const slug = conflictingSlugs.has(q.slug) ? `sd-${q.slug}` : q.slug;
  return {
    ...q,
    id: q.id || `sd-${idx + 1}`,
    tier: q.tier,
    section: q.section,
    topic: q.topic || q.title,
    title: q.title,
    slug,
    difficulty: mappedDiff,
    originalDifficulty: origDiff,
    pattern: q.pattern,
    description: q.description,
    category: 'system-design',
    xpReward: q.xpReward || (origDiff === 'Hard' ? 200 : (origDiff === 'Medium' ? 100 : 50))
  };
});

module.exports = systemDesignQuestions;
