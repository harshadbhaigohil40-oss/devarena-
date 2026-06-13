require('dotenv').config();
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
    const challenge = await Challenge.findOne({ category: 'backend' });

    if (!user || !challenge) {
      console.log('User or Challenge not found');
      return;
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devarena_super_secret_key_2026_secure', { expiresIn: '1d' });

    const api = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { Authorization: `Bearer ${token}` }
    });

    const wrongCodePy = `def generate_token(payload):\n  return undefined_var_python`;
    const correctCodePy = `import json\ndef generate_token(payload):\n  return json.dumps(payload)`;

    console.log('Submitting wrong code (Py)...');
    let res1 = await api.post(`/challenges/${challenge._id}/submit`, { code: wrongCodePy, language: 'python' });
    console.log('Wrong code Py allPassed:', res1.data.data.allPassed);
    if (!res1.data.data.allPassed) console.log('Error output:\n', res1.data.data.submission.testResults[0].output);

    console.log('Submitting correct code (Py)...');
    let res2 = await api.post(`/challenges/${challenge._id}/submit`, { code: correctCodePy, language: 'python' });
    console.log('Correct code Py allPassed:', res2.data.data.allPassed);

    const wrongCodeJS = `function generate_token(payload) {\n  return undefined_var_js;\n}`;
    const correctCodeJS = `function generate_token(payload) {\n  return JSON.stringify(payload);\n}`;

    console.log('Submitting wrong code (JS)...');
    let res3 = await api.post(`/challenges/${challenge._id}/submit`, { code: wrongCodeJS, language: 'javascript' });
    console.log('Wrong code JS allPassed:', res3.data.data.allPassed);
    if (!res3.data.data.allPassed) console.log('Error output:\n', res3.data.data.submission.testResults[0].output);

    console.log('Submitting correct code (JS)...');
    let res4 = await api.post(`/challenges/${challenge._id}/submit`, { code: correctCodeJS, language: 'javascript' });
    console.log('Correct code JS allPassed:', res4.data.data.allPassed);

  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  } finally {
    mongoose.disconnect();
  }
}

testSubmissions();
