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
    if (!req.file) return error(res, 'PDF file is required.', 400);
    const { jobDescription } = req.body;

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return error(res, 'Could not extract sufficient text from PDF.', 400);
    }

    const analysis = await aiService.analyzeResume(resumeText, jobDescription);
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
