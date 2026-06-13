require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Challenge = require('../models/Challenge');
const Badge = require('../models/Badge');
const SkillTree = require('../models/SkillTree');

const challengeData = require('./challenges');
const badgeData = require('./badges');
const skillTreeData = require('./skillTrees');

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...\n');

    // Clear existing data
    await Challenge.deleteMany({});
    await Badge.deleteMany({});
    await SkillTree.deleteMany({});

    // Seed challenges
    // Shuffle the challenges array using Fisher-Yates or simple random sort so the global challenge page is diverse
    const shuffledChallengeData = [...challengeData].sort(() => Math.random() - 0.5);
    const challenges = await Challenge.insertMany(shuffledChallengeData);
    console.log(`✅ Seeded ${challenges.length} challenges`);

    // Seed badges
    const badges = await Badge.insertMany(badgeData);
    console.log(`✅ Seeded ${badges.length} badges`);

    // Explicitly map tags to nodeIds so each node gets only perfectly matching questions
    const nodeTagMap = {
      // Algorithms
      'algo-basics': ['arrays', 'strings', 'hashing', 'math-basics'],
      'algo-search': ['searching'],
      'algo-sort': ['sorting'],
      'algo-recursion': ['recursion'],
      'algo-dp': ['dynamic-programming'],
      'algo-graphs': ['graphs'],
      'algo-master': ['algorithm-expert'],
      
      // Frontend
      'fe-html': ['html-css-layouts'],
      'fe-js': ['js-dom-manipulation', 'basic-ui-logic'],
      'fe-responsive': ['html-css-layouts'], // shares basic layout tags
      'fe-react': ['components', 'props-and-state', 'hooks', 'routing'],
      'fe-advanced': ['state-management', 'performance'],
      'fe-testing': ['web-apis'],
      'fe-master': ['system-ui'],

      // Backend
      'be-node': ['crud-apis'],
      'be-express': ['middleware-logic'],
      'be-db': ['sql-queries', 'schema-design', 'indexing-basics'],
      'be-auth': ['authentication-basics'],
      'be-scale': ['caching', 'rate-limiting', 'queue-systems', 'load-balancing'],
      'be-realtime': ['file-uploads', 'consistency-models'],
      'be-master': ['microservices'],

      // System Design
      'sd-basics': ['url-shortener', 'auth-system'],
      'sd-storage': ['file-uploader', 'distributed-cache'],
      'sd-compute': ['chat-system', 'notification-system'],
      'sd-distributed': ['news-feed', 'consistency-models'],
      'sd-interview': ['instagram', 'youtube', 'uber'],
      'sd-cloud': ['cdn-system'],
      'sd-master': ['search-engine']
    };

    const getChallengesByTags = (tagsArray) => {
      if (!tagsArray || tagsArray.length === 0) return [];
      return challenges.filter(c => c.tags.some(t => tagsArray.includes(t))).map(c => c._id);
    };
    
    const mappedSkillTreeData = skillTreeData.map(tree => {
      const newNodes = tree.nodes.map(node => {
        const requiredTags = nodeTagMap[node.nodeId] || [];
        const nodeChallengeIds = getChallengesByTags(requiredTags);
        
        // If the mapping resulted in no challenges, fallback to tier-based distribution
        if (nodeChallengeIds.length === 0) {
           let diffMapping = 'beginner';
           if (node.tier === 1) diffMapping = 'beginner';
           else if (node.tier === 2) diffMapping = 'intermediate';
           else if (node.tier === 3 || node.tier === 4) diffMapping = 'advanced';
           else if (node.tier === 5) diffMapping = 'expert';

           const category = tree.name.includes('Frontend') ? 'frontend' 
                        : tree.name.includes('Backend') ? 'backend' 
                        : tree.name.includes('System Design') ? 'system-design' 
                        : 'algorithms';
                        
           const fallbackChallenges = challenges.filter(c => c.category === category && c.difficulty === diffMapping).map(c => c._id);
           return { ...node, challengeIds: fallbackChallenges };
        }

        return { ...node, challengeIds: nodeChallengeIds };
      });
      
      return { ...tree, nodes: newNodes };
    });

    // Seed skill trees
    const skillTrees = await SkillTree.insertMany(mappedSkillTreeData);
    console.log(`✅ Seeded ${skillTrees.length} skill trees`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
