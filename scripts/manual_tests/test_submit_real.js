require('dotenv').config({path: './.env'});
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./server/models/User');
const Challenge = require('./server/models/Challenge');
const jwt = require('jsonwebtoken');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/devarena', { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne();
  if (!user) { console.log('no user'); process.exit(1); }
  const challenge = await Challenge.findOne({ slug: 'two-sum' });
  if (!challenge) { console.log('no challenge'); process.exit(1); }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devarena_super_secret_key_2026_secure');
  
  const code = `function twoSum(nums, target) {
    for(let i=0; i<nums.length; i++) {
      for(let j=i+1; j<nums.length; j++) {
        if(nums[i]+nums[j] === target) return [i, j];
      }
    }
  }`;
  
  try {
    const res = await axios.post(`http://localhost:5000/api/challenges/${challenge._id}/submit`, 
      { code, language: 'javascript' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.log(e.response ? e.response.data : e.message);
  }
  process.exit();
}
test();
