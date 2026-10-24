const { z } = require('zod');

exports.registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and hyphens'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  role: z.enum(['developer', 'recruiter']).optional()
});

exports.loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

exports.resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters')
});

exports.forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

exports.verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required').max(256)
});

exports.googleLoginSchema = z.object({
  credential: z.string().max(8192).optional(),
  token: z.string().max(8192).optional()
}).refine(data => Boolean(data.credential || data.token), {
  message: 'No Google credential or token provided'
});
