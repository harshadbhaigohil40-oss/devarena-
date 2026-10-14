const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config({ path: './.env' });

async function testAuth() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devarena');
  console.log('Connected to DB');

  const user = await User.findOne({ email: 'test@example.com' });
  if (user) {
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Deleted existing test user');
  }

  const newUser = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'password123',
    role: 'developer'
  });
  console.log('Created user:', newUser.email, 'passwordHash:', newUser.passwordHash);

  const isMatch = await newUser.comparePassword('password123');
  console.log('Password match:', isMatch);

  process.exit(0);
}

testAuth();
