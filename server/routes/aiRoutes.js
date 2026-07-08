const router = require('express').Router();
const multer = require('multer');
const { getCareerAdvice, getSkillRecommendation, getCodeReview, analyzeResume, generateRoadmap, generalChat } = require('../controllers/aiController');
const { auth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// Setup multer for resume PDF uploads (stored in memory as buffer)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only PDFs and Images are allowed.'));
  }
});

router.post('/career-advice', auth, aiLimiter, getCareerAdvice);
router.post('/skill-recommendation', auth, aiLimiter, getSkillRecommendation);
router.post('/code-review', auth, aiLimiter, getCodeReview);
router.post('/analyze-resume', auth, aiLimiter, upload.single('resume'), analyzeResume);
router.post('/generate-roadmap', auth, aiLimiter, generateRoadmap);
router.post('/chat', aiLimiter, generalChat);

module.exports = router;
