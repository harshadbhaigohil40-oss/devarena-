const nodemailer = require('nodemailer');

const createTransporter = async () => {
  // In development, use Ethereal Email for testing without a real SMTP
  if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
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
  }

  // Production configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.sendVerificationEmail = async (email, token) => {
  const transporter = await createTransporter();
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const info = await transporter.sendMail({
    from: '"DEVARENA" <noreply@devarena.com>',
    to: email,
    subject: 'Verify your DEVARENA account',
    html: `
      <h2>Welcome to DEVARENA!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${url}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('✉️ Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

exports.sendPasswordResetEmail = async (email, token) => {
  const transporter = await createTransporter();
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: '"DEVARENA" <noreply@devarena.com>',
    to: email,
    subject: 'DEVARENA Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${url}">Reset Password</a>
      <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('✉️ Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};
