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

    await Challenge.deleteMany({});
    await Badge.deleteMany({});
    await SkillTree.deleteMany({});

    const challenges = await Challenge.insertMany(challengeData);
    console.log(`✅ Seeded ${challenges.length} challenges`);

    const badges = await Badge.insertMany(badgeData);
    console.log(`✅ Seeded ${badges.length} badges`);

    // Map node IDs → challenge tags
    const nodeTagMap = {
      // Algorithm Mastery
      'algo-basics':    ['arrays','strings','hash-map','hash-set','bit-manipulation'],
      'algo-search':    ['searching','binary-search'],
      'algo-sort':      ['sorting','merge-sort'],
      'algo-recursion': ['recursion','backtracking'],
      'algo-dp':        ['dynamic-programming'],
      'algo-graphs':    ['graphs','dfs','bfs'],
      'algo-master':    ['algorithm-expert','design'],
      // Frontend
      'fe-html':        ['html-css-layouts'],
      'fe-js':          ['js-dom-manipulation'],
      'fe-responsive':  ['html-css-layouts'],
      'fe-react':       ['hooks','closures'],
      'fe-advanced':    ['state-management','performance'],
      'fe-testing':     ['web-apis'],
      'fe-master':      ['system-ui','design-patterns'],
      // Backend
      'be-node':        ['crud-apis','http'],
      'be-express':     ['middleware-logic','parsing'],
      'be-db':          ['sql-queries','schema-design'],
      'be-auth':        ['authentication-basics','jwt'],
      'be-scale':       ['caching','rate-limiting'],
      'be-realtime':    ['queue-systems'],
      'be-master':      ['microservices','load-balancing'],
      // System Design
      'sd-basics':      ['url-shortener','load-balancing','encoding'],
      'sd-storage':     ['file-uploader','distributed-cache','caching'],
      'sd-compute':     ['chat-system','notification-system'],
      'sd-distributed': ['news-feed','distributed'],
      'sd-interview':   ['instagram','sharding'],
      'sd-cloud':       ['cdn-system'],
      'sd-master':      ['search-engine','probabilistic'],
    };

    const getChallengesByTags = (tagsArray) => {
      if (!tagsArray || tagsArray.length === 0) return [];
      return challenges.filter(c => c.tags.some(t => tagsArray.includes(t))).map(c => c._id);
    };

    const mappedSkillTreeData = skillTreeData.map(tree => {
      const category = tree.name.includes('Frontend') ? 'frontend'
        : tree.name.includes('Backend') ? 'backend'
        : tree.name.includes('System Design') ? 'system-design'
        : 'algorithms';

      const newNodes = tree.nodes.map(node => {
        const requiredTags = nodeTagMap[node.nodeId] || [];
        let ids = getChallengesByTags(requiredTags);

        // Fallback: tier-based difficulty within same category
        if (ids.length === 0) {
          const diffMap = { 1: 'beginner', 2: 'intermediate', 3: 'advanced', 4: 'advanced', 5: 'expert' };
          ids = challenges.filter(c => c.category === category && c.difficulty === diffMap[node.tier]).map(c => c._id);
        }

        return { ...node, challengeIds: ids };
      });

      return { ...tree, nodes: newNodes };
    });

    const skillTrees = await SkillTree.insertMany(mappedSkillTreeData);
    console.log(`✅ Seeded ${skillTrees.length} skill trees`);

    // Print mapping summary
    mappedSkillTreeData.forEach(tree => {
      console.log(`\n📊 ${tree.name}:`);
      tree.nodes.forEach(n => console.log(`   ${n.nodeId} (Tier ${n.tier}): ${n.challengeIds.length} challenges`));
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
