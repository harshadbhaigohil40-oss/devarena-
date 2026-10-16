const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
}

const User = require('../server/models/User');

async function promoteAdmin(email, hasYes) {
  if (!email) {
    console.error('Usage: node scripts/promoteAdmin.js <email> --yes');
    return { success: false, reason: 'missing_email' };
  }

  if (!hasYes) {
    console.warn('⚠️  Warning: --yes confirmation flag is required to promote a user to admin. No changes made.');
    return { success: false, reason: 'missing_yes' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.error(`❌ User with email "${email}" not found.`);
    return { success: false, reason: 'not_found' };
  }

  if (!user.isEmailVerified) {
    console.error(`❌ Cannot promote user "${user.email}". Account email must be verified first.`);
    return { success: false, reason: 'unverified' };
  }

  user.role = 'admin';
  user.refreshToken = null;
  await user.save();

  console.log(`✅ Successfully promoted ${user.email} to admin.`);
  console.log(JSON.stringify(user.toJSON ? user.toJSON() : user, null, 2));
  return { success: true, user };
}

async function cli() {
  const args = process.argv.slice(2);
  const email = args.find(a => !a.startsWith('-'));
  const hasYes = args.includes('--yes');

  if (!email) {
    console.error('Usage: node scripts/promoteAdmin.js <email> --yes');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/devarena';
  await mongoose.connect(mongoUri);

  try {
    const result = await promoteAdmin(email, hasYes);
    if (!result.success) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Failed to promote user:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  cli();
}

module.exports = { promoteAdmin };
