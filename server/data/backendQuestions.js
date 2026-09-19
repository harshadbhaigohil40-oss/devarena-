/**
 * Backend Development Roadmap — 100 Questions
 * Combines all 5 Tiers (7 Sections)
 * Compatible with existing DevArena Compiler & Execution Harness
 */

const tier1 = require('./tier1_node');
const tier2a = require('./tier2a_express');
const tier2b = require('./tier2b_databases');
const tier3 = require('./tier3_auth');
const tier4a = require('./tier4a_scaling');
const tier4b = require('./tier4b_realtime');
const tier5 = require('./tier5_expert');

const rawQuestions = [
  ...tier1,
  ...tier2a,
  ...tier2b,
  ...tier3,
  ...tier4a,
  ...tier4b,
  ...tier5
];

const diffMap = {
  'Easy': 'beginner',
  'Medium': 'intermediate',
  'Hard': 'advanced'
};

const backendQuestions = rawQuestions.map(q => {
  const origDiff = q.difficulty;
  const mappedDiff = diffMap[origDiff] || origDiff.toLowerCase();
  return {
    ...q,
    id: q.id,
    tier: q.tier,
    section: q.section,
    topic: q.topic,
    title: q.title,
    difficulty: mappedDiff,
    originalDifficulty: origDiff,
    pattern: q.pattern,
    description: q.description,
    category: 'backend'
  };
});

module.exports = backendQuestions;
