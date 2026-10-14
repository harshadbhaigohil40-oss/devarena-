const { z } = require('zod');

exports.registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['developer', 'recruiter']).optional()
});

exports.loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

exports.resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
