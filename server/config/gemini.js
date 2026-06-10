const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key') {
    console.warn('⚠️  Gemini API key not configured — AI features will use mock responses');
    return null;
  }
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    console.log('✅ Gemini AI initialized');
    return model;
  } catch (error) {
    console.error('❌ Gemini init error:', error.message);
    return null;
  }
};

const getModel = () => model;
const isAvailable = () => model !== null;

module.exports = { initGemini, getModel, isAvailable };
