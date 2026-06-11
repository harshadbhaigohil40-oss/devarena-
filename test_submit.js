const axios = require('axios');
const mongoose = require('mongoose');

async function testSubmissions() {
  try {
    // Connect DB to get a user and challenge
    await mongoose.connect('mongodb://127.0.0.1:27017/devarena', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const User = require('./server/models/User');
    const Challenge = require('./server/models/Challenge');

    const user = await User.findOne();
    const challenge = await Challenge.findOne({ slug: 'two-sum' });

    if (!user || !challenge) {
      console.log('User or Challenge not found');
      return;
    }

    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devarena_super_secret_key_2026_secure', { expiresIn: '1d' });

    console.log('Got token');

    const api = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { Authorization: `Bearer ${token}` }
    });

    const wrongCode = `function twoSum(nums, target) { return [0, 0]; }`;
    const correctCode = `function twoSum(nums, target) {
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          if (nums[i] + nums[j] == target) return [i, j];
        }
      }
    }`;

    console.log('Submitting wrong code...');
    let res1 = await api.post(`/challenges/${challenge._id}/submit`, { code: wrongCode, language: 'javascript' });
    console.log('Wrong code allPassed:', res1.data.data.allPassed);

    console.log('Submitting correct code...');
    let res2 = await api.post(`/challenges/${challenge._id}/submit`, { code: correctCode, language: 'javascript' });
    console.log('Correct code allPassed:', res2.data.data.allPassed);

  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  } finally {
    mongoose.disconnect();
  }
}

testSubmissions();
