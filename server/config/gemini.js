const GeminiKeyManager = require('../services/geminiKeyManager');

let keyManager = null;
let modelWrapper = null;

const initGemini = () => {
  // Support both GEMINI_API_KEYS (comma separated) and legacy GEMINI_API_KEY
  const keysString = [process.env.GEMINI_API_KEYS, process.env.GEMINI_API_KEY]
    .filter(Boolean)
    .join(',');

  if (!keysString || keysString.trim() === '') {
    console.error('❌ Gemini API key(s) not configured. AI features will fail.');
    return null;
  }
  try {
    keyManager = new GeminiKeyManager(keysString);
    if (keyManager.getKeyCount() === 0) {
      console.error('❌ No valid Gemini API keys configured. AI features will fail.');
      return null;
    }
    
    // Create a mock model object that delegates generateContent to the KeyManager
    modelWrapper = {
      generateContent: (prompt, options) => keyManager.generateContent(prompt, options)
    };
    
    console.log(`✅ Gemini AI initialized with key rotation support (${keyManager.getKeyCount()} key(s) loaded)`);
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

const getKeyManager = () => keyManager;

module.exports = { initGemini, getModel, isAvailable, getKeyManager, GeminiKeyManager };
