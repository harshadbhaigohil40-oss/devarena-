const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
}

const User = require('../server/models/User');

async function demoteLegacyAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/demoteLegacyAdmin.js <email>');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/devarena';
  await mongoose.connect(mongoUri);

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.error(`User with email "${email}" not found.`);
      process.exit(1);
    }

    user.role = 'developer';
    user.refreshToken = null;
    await user.save();

    console.log(`Successfully demoted ${user.email} to developer and revoked refresh token.`);
  } catch (err) {
    console.error('Failed to demote user:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  demoteLegacyAdmin();
}

module.exports = { demoteLegacyAdmin };
