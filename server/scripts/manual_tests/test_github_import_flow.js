const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const { importFromGithub } = require('../../controllers/adminChallengeController');
const { initGemini } = require('../../config/gemini');
const Challenge = require('../../models/Challenge');

async function runTest() {
  console.log('--- Starting GitHub Import Flow Test ---');
  
  // 1. Init DB and Gemini
  await mongoose.connect(process.env.MONGODB_URI);
  initGemini();
  console.log('Connected to DB and Gemini initialized.');

  // 2. Mock Req and Res
  const req = {
    body: {
      githubUrl: 'https://raw.githubusercontent.com/bollwarm/DataStructuresAlgorithms/master/02_algorithms/02_searching/binary_search.py'
    }
  };

  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.data = data;
      return this;
    }
  };

  const next = (err) => {
    console.error('Error from next():', err);
  };

  // 3. Test Import (Import -> Pending)
  console.log('\nStep 1: Testing importFromGithub...');
  await importFromGithub(req, res, next);
  
  if (res.statusCode !== 200) {
    console.error('Import Failed:', res.data);
    process.exit(1);
  }
  
  const generatedChallenge = res.data.data?.challenge;
  console.log('✅ Import Successful!');
  console.log('Generated Challenge:', JSON.stringify(generatedChallenge, null, 2));

  // 4. Test Approve -> Published flow
  console.log('\nStep 2: Simulating Review & Approve -> Publish');
  
  const newDbChallenge = new Challenge({
    ...generatedChallenge,
    _id: new mongoose.Types.ObjectId(), // fresh ID
    slug: generatedChallenge.slug + '-test-flow'
  });
  
  try {
    await newDbChallenge.save();
    console.log('✅ Challenge saved to database (Published).');
    
    // Clean up
    await Challenge.deleteOne({ _id: newDbChallenge._id });
    console.log('✅ Cleaned up test challenge from database.');
  } catch (err) {
    console.error('Failed to save challenge to DB:', err);
  }

  console.log('\n--- Test Flow Complete ---');
  process.exit(0);
}

runTest();
