require('dotenv').config({path: './.env'});
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./server/models/User');
const jwt = require('jsonwebtoken');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/devarena', { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne();
  if (!user) { console.log('no user'); process.exit(1); }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devarena_super_secret_key_2026_secure');
  
  try {
    const res = await axios.post(`http://localhost:5000/api/ai/chat`, 
      { prompt: 'Hello' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data);
  } catch(e) {
    console.log(e.response ? e.response.data : e.message);
  }
  process.exit();
}
test();
