const GeminiKeyManager = require('../services/geminiKeyManager');

let keyManager = null;
let modelWrapper = null;

const initGemini = () => {
  // Support both new GEMINI_API_KEYS (comma separated) and legacy GEMINI_API_KEY
  const keysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
  if (!keysString || keysString === 'your-gemini-api-key') {
    console.error('❌ Gemini API key(s) not configured. AI features will fail.');
    return null;
  }
  try {
    keyManager = new GeminiKeyManager(keysString);
    
    // Create a mock model object that delegates generateContent to the KeyManager
    modelWrapper = {
      generateContent: (prompt) => keyManager.generateContent(prompt)
    };
    
    console.log('✅ Gemini AI initialized with key rotation support');
    return modelWrapper;
  } catch (error) {
    console.error('❌ Gemini init error:', error.message);
    return null;
  }
};

const getModel = () => {
  if (!modelWrapper) {
    throw new Error('Gemini AI is not configured or initialized.');
  }
  return modelWrapper;
};

const isAvailable = () => modelWrapper !== null;

module.exports = { initGemini, getModel, isAvailable, GeminiKeyManager };
