const User = require('../models/User');

const ADMIN_EMAIL = 'harshadbhaigohil40@gmail.com';
const ADMIN_PASSWORD = '963852741';

/**
 * Ensures the administrator account exists with role 'admin',
 * the specified credentials, and verified email status.
 * This runs automatically on server start to guarantee admin access in all environments.
 */
const ensureAdminUser = async () => {
  try {
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminUser) {
      console.log(`⚡ Creating admin user for ${ADMIN_EMAIL}...`);
      adminUser = new User({
        username: 'harshadbhaigohil40',
        email: ADMIN_EMAIL,
        passwordHash: ADMIN_PASSWORD, // Pre-save hook hashes this with bcrypt
        role: 'admin',
        isEmailVerified: true,
      });
      await adminUser.save();
      console.log(`✅ Admin user created successfully with role 'admin'.`);
    } else {
      let needsSave = false;

      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        needsSave = true;
      }

      if (!adminUser.isEmailVerified) {
        adminUser.isEmailVerified = true;
        needsSave = true;
      }

      if (adminUser.lockUntil || adminUser.failedLoginAttempts > 0) {
        adminUser.lockUntil = null;
        adminUser.failedLoginAttempts = 0;
        needsSave = true;
      }

      const isMatch = await adminUser.comparePassword(ADMIN_PASSWORD);
      if (!isMatch) {
        // Assign plaintext password; pre-save hook will hash it
        adminUser.passwordHash = ADMIN_PASSWORD;
        needsSave = true;
      }

      if (needsSave) {
        await adminUser.save();
        console.log(`✅ Admin user ${ADMIN_EMAIL} updated (role: admin, verified, password confirmed).`);
      } else {
        console.log(`✅ Admin user ${ADMIN_EMAIL} is up-to-date with role 'admin'.`);
      }
    }
    return adminUser;
  } catch (err) {
    console.error('❌ Error ensuring admin user:', err.message);
  }
};

module.exports = {
  ensureAdminUser,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
