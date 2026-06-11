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
    const challenges = await Challenge.insertMany(challengeData);
    console.log(`✅ Seeded ${challenges.length} challenges`);

    // Seed badges
    const badges = await Badge.insertMany(badgeData);
    console.log(`✅ Seeded ${badges.length} badges`);

    // Map challenges to skill trees based on category
    const getChallengesByCategory = (category) => challenges.filter(c => c.category === category).map(c => c._id);
    
    const mappedSkillTreeData = skillTreeData.map(tree => {
      let category = 'algorithms';
      if (tree.name.includes('Frontend')) category = 'frontend';
      else if (tree.name.includes('Backend')) category = 'backend';
      else if (tree.name.includes('System Design')) category = 'system-design';

      const availableChallenges = getChallengesByCategory(category);
      
      const newNodes = tree.nodes.map((node, index) => {
        const nodeChallengeIds = [];
        // Distribute all challenges evenly across nodes
        for (let i = index; i < availableChallenges.length; i += tree.nodes.length) {
          nodeChallengeIds.push(availableChallenges[i]);
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
