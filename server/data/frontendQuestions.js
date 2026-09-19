/**
 * Frontend Engineering Roadmap — 205 Questions
 * Combines all 5 Tiers (7 Sections)
 * Compatible with existing DevArena Compiler & Execution Harness
 */

const tier1 = require('./fe_tier1_html_css');
const tier2Js = require('./fe_tier2_javascript');
const tier2Responsive = require('./fe_tier2_responsive');
const tier3React = require('./fe_tier3_react');
const tier4Advanced = require('./fe_tier4_advanced_react');
const tier4Testing = require('./fe_tier4_testing');
const tier5Expert = require('./fe_tier5_expert');

const rawQuestions = [
  ...tier1,
  ...tier2Js,
  ...tier2Responsive,
  ...tier3React,
  ...tier4Advanced,
  ...tier4Testing,
  ...tier5Expert
];

const diffMap = {
  'Easy': 'beginner',
  'Medium': 'intermediate',
  'Hard': 'advanced',
  'Advanced': 'expert',
  'beginner': 'beginner',
  'intermediate': 'intermediate',
  'advanced': 'advanced',
  'expert': 'expert'
};

const origDiffMap = {
  'beginner': 'Easy',
  'intermediate': 'Medium',
  'advanced': 'Hard',
  'expert': 'Advanced'
};

const xpMap = {
  'beginner': 50,
  'intermediate': 100,
  'advanced': 200,
  'expert': 300
};

const frontendQuestions = rawQuestions.map((q, idx) => {
  const mappedDiff = diffMap[q.difficulty] || 'intermediate';
  const origDiff = q.originalDifficulty || origDiffMap[mappedDiff] || 'Medium';

  return {
    ...q,
    id: q.id || `fe-${idx + 1}`,
    tier: q.tier,
    section: q.section,
    topic: q.topic || q.title,
    title: q.title,
    slug: q.slug,
    difficulty: mappedDiff,
    originalDifficulty: origDiff,
    pattern: q.pattern || 'Frontend Implementation',
    description: q.description,
    category: 'frontend',
    tags: Array.isArray(q.tags) ? q.tags : ['frontend'],
    xpReward: q.xpReward || xpMap[mappedDiff] || 100,
    starterCode: q.starterCode,
    testCases: q.testCases,
    hints: q.hints || []
  };
});

module.exports = frontendQuestions;
