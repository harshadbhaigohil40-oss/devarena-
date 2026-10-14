const aiService = require('../services/aiService');
const { success, error } = require('../utils/responseHelper');

exports.getCareerAdvice = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return error(res, 'Question is required.', 400);

    const advice = await aiService.getCareerAdvice(req.user, question);
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
    if (!code) return error(res, 'Code is required.', 400);

    const review = await aiService.getCodeReview(code, language);
    success(res, { review });
  } catch (err) { next(err); }
};

const pdfParse = require('pdf-parse');

exports.analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'File is required.', 400);
    const { jobDescription } = req.body;

    let resumeContent;
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      if (!pdfData.text || pdfData.text.trim().length < 50) {
        return error(res, 'Could not extract sufficient text from PDF.', 400);
      }
      resumeContent = pdfData.text;
    } else if (req.file.mimetype.startsWith('image/')) {
      resumeContent = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      };
    } else {
      return error(res, 'Unsupported file type.', 400);
    }

    const analysis = await aiService.analyzeResume(resumeContent, jobDescription);
    success(res, { analysis });
  } catch (err) { next(err); }
};

exports.generateRoadmap = async (req, res, next) => {
  try {
    const { currentSkills, targetRole } = req.body;
    if (!currentSkills || !targetRole) {
      return error(res, 'Current skills and target role are required.', 400);
    }

    const roadmap = await aiService.generateRoadmap(currentSkills, targetRole);
    success(res, { roadmap });
  } catch (err) { next(err); }
};

exports.generalChat = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return error(res, 'Prompt is required.', 400);

    const reply = await aiService.generalChat(prompt);
    success(res, { reply });
  } catch (err) { next(err); }
};
