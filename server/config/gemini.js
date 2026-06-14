const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key') {
    console.error('❌ Gemini API key not configured. AI features will fail.');
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

const getModel = () => {
  if (!model) {
    throw new Error('Gemini AI is not configured or initialized.');
  }
  return model;
};

const isAvailable = () => model !== null;

module.exports = { initGemini, getModel, isAvailable };
