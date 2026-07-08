const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiKeyManager {
  constructor(keysString) {
    if (!keysString) {
      this.keys = [];
    } else {
      this.keys = keysString
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .map(key => ({
          key,
          genAI: new GoogleGenerativeAI(key),
          failedUntil: 0 // timestamp when it becomes available again
        }));
    }
    
    // Time to wait before retrying a rate-limited key (e.g., 60 seconds)
    this.coolOffPeriodMs = 60 * 1000;
  }

  getAvailableKey() {
    const now = Date.now();
    for (const keyObj of this.keys) {
      if (now >= keyObj.failedUntil) {
        return keyObj;
      }
    }
    return null;
  }

  markKeyFailed(keyObj) {
    console.warn(`[GeminiKeyManager] Key starting with ${keyObj.key.substring(0, 8)}... hit a limit. Quarantining for ${this.coolOffPeriodMs / 1000}s.`);
    keyObj.failedUntil = Date.now() + this.coolOffPeriodMs;
  }

  // Wrapper method that mimics the behavior of model.generateContent
  // but with automatic retry and key rotation.
  async generateContent(promptOrRequest) {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys configured.');
    }

    // Try up to the number of keys we have, plus 1 to be safe, but bounded.
    let maxAttempts = this.keys.length;
    let lastError = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const keyObj = this.getAvailableKey();
      
      if (!keyObj) {
        throw new Error('All Gemini API keys are currently rate-limited or exhausted.');
      }

      try {
        // Assume default model if we don't pass options? 
        // We will pass the model configuration via the wrapper if needed,
        // but typically in DevArena it's gemini-2.5-flash.
        const model = keyObj.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        // Execute the call
        const result = await model.generateContent(promptOrRequest);
        return result;
      } catch (error) {
        lastError = error;
        // Check if it's a 429 error (quota/rate limit)
        if (error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('exhausted')))) {
          this.markKeyFailed(keyObj);
          console.log(`[GeminiKeyManager] Rotating to the next available key... (Attempt ${attempt + 1}/${maxAttempts})`);
        } else {
          // If it's a different error, don't rotate, just throw it.
          throw error;
        }
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${lastError.message}`);
  }
}

module.exports = GeminiKeyManager;
