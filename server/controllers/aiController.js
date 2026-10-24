const aiService = require('../services/aiService');
const { success, error } = require('../utils/responseHelper');
const pdfParse = require('pdf-parse');

const MAX_QUESTION_LENGTH = 2000;
const MAX_CODE_LENGTH = 50000;
const MAX_JOB_DESC_LENGTH = 5000;
const MAX_CHAT_PROMPT_LENGTH = 2000;
const ALLOWED_LANGUAGES = ['javascript', 'python', 'html'];

/**
 * Validates file signature (magic bytes) to prevent MIME-type spoofing
 */
function isValidFileSignature(buffer, mimetype) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 4) {
    return false;
  }

  if (mimetype === 'application/pdf') {
    // PDF magic bytes: %PDF- (0x25 0x50 0x44 0x46 0x2D)
    return buffer.length >= 5 && buffer.slice(0, 5).toString('ascii') === '%PDF-';
  }

  if (mimetype.startsWith('image/')) {
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const isPng = buffer.length >= 8 &&
      buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
      buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A;
    if (isPng) return true;

    // JPEG: FF D8 FF
    const isJpeg = buffer.length >= 3 &&
      buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    if (isJpeg) return true;

    // WebP: RIFF....WEBP
    const isWebp = buffer.length >= 12 &&
      buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
      buffer.slice(8, 12).toString('ascii') === 'WEBP';
    if (isWebp) return true;

    return false;
  }

  return false;
}

exports.getCareerAdvice = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return error(res, 'Question is required and must be non-empty text.', 400);
    }

    const cleanQuestion = question.trim();
    if (cleanQuestion.length > MAX_QUESTION_LENGTH) {
      return error(res, `Question exceeds maximum allowed length of ${MAX_QUESTION_LENGTH} characters.`, 400);
    }

    const advice = await aiService.getCareerAdvice(req.user, cleanQuestion);
    success(res, { advice });
  } catch (err) { next(err); }
};

exports.getSkillRecommendation = async (req, res, next) => {
  try {
    const recommendation = await aiService.getSkillRecommendation(req.user);
    success(res, { recommendation });
  } catch (err) { next(err); }
};

exports.getCodeReview = async (req, res, next) => {
  try {
    const { code, language = 'javascript' } = req.body;
    if (!code || typeof code !== 'string' || !code.trim()) {
      return error(res, 'Code is required.', 400);
    }

    if (code.length > MAX_CODE_LENGTH) {
      return error(res, `Code exceeds maximum allowed length of ${MAX_CODE_LENGTH} characters.`, 400);
    }

    if (!ALLOWED_LANGUAGES.includes(language)) {
      return error(res, `Unsupported language: ${language}. Allowed: ${ALLOWED_LANGUAGES.join(', ')}`, 400);
    }

    const review = await aiService.getCodeReview(code, language);
    success(res, { review });
  } catch (err) { next(err); }
};

exports.analyzeResume = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return error(res, 'File is required.', 400);
    }

    const { jobDescription } = req.body;
    if (jobDescription && (typeof jobDescription !== 'string' || jobDescription.length > MAX_JOB_DESC_LENGTH)) {
      return error(res, `Job description must be text under ${MAX_JOB_DESC_LENGTH} characters.`, 400);
    }

    // Enforce file signature verification
    if (!isValidFileSignature(req.file.buffer, req.file.mimetype)) {
      return error(res, 'Invalid file signature: file content does not match allowed PDF or Image format.', 400);
    }

    let resumeContent;
    if (req.file.mimetype === 'application/pdf') {
      let pdfData;
      try {
        pdfData = await pdfParse(req.file.buffer);
      } catch (parseError) {
        return error(res, 'Failed to parse PDF document. Ensure the file is a valid PDF.', 400);
      }

      if (!pdfData.text || pdfData.text.trim().length < 50) {
        return error(res, 'Could not extract sufficient text from PDF.', 400);
      }
      // Cap extracted resume text at 30,000 characters to prevent excessive token consumption
      resumeContent = pdfData.text.trim().slice(0, 30000);
    } else if (req.file.mimetype.startsWith('image/')) {
      resumeContent = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      };
    } else {
      return error(res, 'Unsupported file type. Only PDFs and Images are permitted.', 400);
    }

    const analysis = await aiService.analyzeResume(resumeContent, jobDescription ? jobDescription.trim() : '');
    success(res, { analysis });
  } catch (err) { next(err); }
};

exports.generateRoadmap = async (req, res, next) => {
  try {
    const { currentSkills, targetRole } = req.body;
    if (!currentSkills || !targetRole) {
      return error(res, 'Current skills and target role are required.', 400);
    }

    if (typeof targetRole !== 'string' || targetRole.trim().length === 0 || targetRole.length > 100) {
      return error(res, 'Target role must be a string up to 100 characters.', 400);
    }

    let skillsString;
    if (Array.isArray(currentSkills)) {
      if (currentSkills.length > 30) {
        return error(res, 'Cannot specify more than 30 current skills.', 400);
      }
      skillsString = currentSkills.map(s => String(s).trim()).filter(Boolean).join(', ');
    } else if (typeof currentSkills === 'string') {
      if (currentSkills.trim().length === 0 || currentSkills.length > 1000) {
        return error(res, 'Current skills text must be between 1 and 1000 characters.', 400);
      }
      skillsString = currentSkills.trim();
    } else {
      return error(res, 'Current skills must be a comma-separated string or array of skills.', 400);
    }

    if (!skillsString) {
      return error(res, 'Please provide at least one valid current skill.', 400);
    }

    const roadmap = await aiService.generateRoadmap(skillsString, targetRole.trim());
    success(res, { roadmap });
  } catch (err) { next(err); }
};

exports.generalChat = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return error(res, 'Prompt is required and must be non-empty text.', 400);
    }

    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length > MAX_CHAT_PROMPT_LENGTH) {
      return error(res, `Prompt exceeds maximum allowed length of ${MAX_CHAT_PROMPT_LENGTH} characters.`, 400);
    }

    const reply = await aiService.generalChat(cleanPrompt);
    success(res, { reply });
  } catch (err) { next(err); }
};

exports._testExports = {
  isValidFileSignature,
};
