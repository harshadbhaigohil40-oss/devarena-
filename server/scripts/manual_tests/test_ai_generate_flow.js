const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const { generateWithAI } = require('../../controllers/adminChallengeController');
const { initGemini } = require('../../config/gemini');

async function runTest() {
  console.log('--- Starting AI Generator Flow Test ---');
  
  await mongoose.connect(process.env.MONGODB_URI);
  initGemini();
  console.log('Connected to DB and Gemini initialized.');

  const req = {
    body: {
      topic: 'Algorithms',
      difficulty: 'beginner',
      language: 'JavaScript',
      count: 1
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

  console.log('\nStep 1: Testing generateWithAI...');
  await generateWithAI(req, res, next);
  
  if (res.statusCode !== 200) {
    console.error('Generation Failed:', res.data);
    process.exit(1);
  }
  
  console.log('✅ Generation Successful!');
  console.log('Generated Challenges:', JSON.stringify(res.data?.data?.challenges || res.data?.challenges, null, 2));

  console.log('\n--- Test Flow Complete ---');
  process.exit(0);
}

runTest();
