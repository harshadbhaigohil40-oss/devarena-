const { z } = require('zod');
const logger = require('../utils/logger');

const envSchema = z.object({
  MONGODB_URI: z
    .string({ required_error: 'MONGODB_URI is required' })
    .min(1, 'MONGODB_URI cannot be empty'),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET is required' })
    .min(32, 'JWT_SECRET must be at least 32 characters long')
    .refine(
      (val) => {
        const lower = val.toLowerCase();
        return (
          !lower.includes('your-secret') &&
          !lower.includes('example') &&
          !lower.includes('change-this') &&
          !lower.includes('secret-key-at-least-32-chars')
        );
      },
      { message: 'JWT_SECRET must not be an insecure default or example placeholder value' }
    ),
});

const optionalEnvVars = [
  'CLIENT_URL',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'GOOGLE_CLIENT_ID',
  'GEMINI_API_KEY',
  'RUNNER_URL',
];

function validateEnv(log = logger) {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const errorDetails = issues
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    log.error(`[FATAL] Startup environment validation failed:\n${errorDetails}`);

    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    return { valid: false, errors: issues };
  }

  // Warn on missing optional variables
  for (const varName of optionalEnvVars) {
    if (!process.env[varName]) {
      log.warn(`[WARN] Optional environment variable '${varName}' is not configured.`);
    }
  }

  return { valid: true, data: result.data };
}

module.exports = {
  validateEnv,
  envSchema,
};
