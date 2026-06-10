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

    // Seed skill trees
    const skillTrees = await SkillTree.insertMany(skillTreeData);
    console.log(`✅ Seeded ${skillTrees.length} skill trees`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
