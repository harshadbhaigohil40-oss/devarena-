const { z } = require('zod');
const { isValidHttpUrl } = require('../utils/urlHelper');

const safeUrlSchema = z
  .string()
  .max(500, 'URL cannot exceed 500 characters')
  .refine(val => !val || isValidHttpUrl(val), {
    message: 'Must be a valid http or https URL',
  })
  .optional()
  .or(z.literal(''));

exports.createProjectSchema = z.object({
  title: z
    .string({ required_error: 'Project title is required.' })
    .min(1, 'Project title cannot be empty.')
    .max(100, 'Project title cannot exceed 100 characters.')
    .trim(),
  description: z
    .string({ required_error: 'Project description is required.' })
    .min(1, 'Project description cannot be empty.')
    .max(2000, 'Project description cannot exceed 2000 characters.')
    .trim(),
  liveUrl: safeUrlSchema,
  repoUrl: safeUrlSchema,
  thumbnailUrl: safeUrlSchema,
  techStack: z
    .union([
      z.array(z.string().max(50, 'Each tech stack item cannot exceed 50 characters')).max(20, 'Maximum 20 tech stack items allowed'),
      z.string().max(500, 'Tech stack string cannot exceed 500 characters')
    ])
    .optional(),
  tags: z
    .array(z.string().max(50, 'Each tag cannot exceed 50 characters'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
});

exports.updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title cannot be empty.')
    .max(100, 'Project title cannot exceed 100 characters.')
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, 'Project description cannot be empty.')
    .max(2000, 'Project description cannot exceed 2000 characters.')
    .trim()
    .optional(),
  liveUrl: safeUrlSchema,
  repoUrl: safeUrlSchema,
  thumbnailUrl: safeUrlSchema,
  techStack: z
    .union([
      z.array(z.string().max(50, 'Each tech stack item cannot exceed 50 characters')).max(20, 'Maximum 20 tech stack items allowed'),
      z.string().max(500, 'Tech stack string cannot exceed 500 characters')
    ])
    .optional(),
  tags: z
    .array(z.string().max(50, 'Each tag cannot exceed 50 characters'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
});
