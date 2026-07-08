require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Challenge = require('./models/Challenge');
const SkillTree = require('./models/SkillTree');
const skillTreeData = require('./seeds/skillTrees');

const seedSpecificTree = async () => {
  try {
    await connectDB();
    console.log('🌱 Reverting Algorithm Mastery tree...');

    const challenges = await Challenge.find({});

    const nodeTagMap = {
      'algo-basics':    ['arrays','strings','hash-map','hash-set','bit-manipulation'],
      'algo-search':    ['searching','binary-search'],
      'algo-sort':      ['sorting','merge-sort'],
      'algo-recursion': ['recursion','backtracking'],
      'algo-dp':        ['dynamic-programming'],
      'algo-graphs':    ['graphs','dfs','bfs'],
      'algo-master':    ['algorithm-expert','design'],
    };

    const getChallengesByTags = (tagsArray) => {
      if (!tagsArray || tagsArray.length === 0) return [];
      return challenges.filter(c => c.tags.some(t => tagsArray.includes(t))).map(c => c._id);
    };

    const algoTreeData = skillTreeData.find(t => t.name === 'Algorithm Mastery');
    if (!algoTreeData) throw new Error("Algorithm Mastery not found in seed file");

    const category = 'algorithms';

    const newNodes = algoTreeData.nodes.map(node => {
      const requiredTags = nodeTagMap[node.nodeId] || [];
      let ids = getChallengesByTags(requiredTags);

      if (ids.length === 0) {
        const diffMap = { 1: 'beginner', 2: 'intermediate', 3: 'advanced', 4: 'advanced', 5: 'expert' };
        ids = challenges.filter(c => c.category === category && c.difficulty === diffMap[node.tier]).map(c => c._id);
      }

      return { ...node, challengeIds: ids };
    });

    const finalTreeData = { ...algoTreeData, nodes: newNodes };

    // Update in DB
    await SkillTree.findOneAndReplace({ name: 'Algorithm Mastery' }, finalTreeData);

    console.log('✅ Algorithm Mastery tree reverted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Revert error:', error.message);
    process.exit(1);
  }
};

seedSpecificTree();
