const nodemailer = require('nodemailer');

const isSmtpConfigured = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const createTransporter = async () => {
  // In production, strictly require configured SMTP. NEVER fall back to Ethereal test inboxes.
  if (process.env.NODE_ENV === 'production') {
    if (!isSmtpConfigured()) {
      return null;
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Non-production environments (development / test)
  if (isSmtpConfigured()) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Automated test mode: never make outbound network requests
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  // Local development mode: allow Ethereal test inbox for local debugging
  if (process.env.NODE_ENV === 'development') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (e) {
      console.warn('[EmailService] Could not initialize Ethereal test account:', e.message);
      return null;
    }
  }

  return null;
};

exports.sendVerificationEmail = async (email, token) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('[EmailService] Outgoing email skipped: SMTP is not configured in production.');
      }
      return false;
    }

    const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DEVARENA" <noreply@devarena.com>',
      to: email,
      subject: 'Verify your DEVARENA account',
      html: `
        <h2>Welcome to DEVARENA!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${url}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    if (process.env.NODE_ENV === 'development' && info) {
      console.log('✉️ Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    // Fail safely without leaking credentials in logs
    console.error('[EmailService] Failed to send verification email:', error.message);
    return false;
  }
};

exports.sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('[EmailService] Outgoing email skipped: SMTP is not configured in production.');
      }
      return false;
    }

    const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DEVARENA" <noreply@devarena.com>',
      to: email,
      subject: 'DEVARENA Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${url}">Reset Password</a>
        <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    if (process.env.NODE_ENV === 'development' && info) {
      console.log('✉️ Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    // Fail safely without leaking credentials in logs
    console.error('[EmailService] Failed to send password reset email:', error.message);
    return false;
  }
};

// Internal exports for testing
exports.isSmtpConfigured = isSmtpConfigured;
exports.createTransporter = createTransporter;
