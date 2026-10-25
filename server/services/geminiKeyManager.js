const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

const DEFAULT_MODEL_LIST = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash-lite'
];

class GeminiKeyManager {
  /**
   * @param {string|string[]} keysInput Comma-separated keys or array of keys
   * @param {number} [coolOffPeriodMs=60000] Quarantine duration for rate-limited keys
   */
  constructor(keysInput, coolOffPeriodMs = 60 * 1000) {
    this.coolOffPeriodMs = coolOffPeriodMs;
    this.currentIndex = 0;
    this.keys = this._parseKeys(keysInput);
    this.preferredModel = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  }

  _parseKeys(keysInput) {
    if (!keysInput) return [];

    let rawList = [];
    if (Array.isArray(keysInput)) {
      rawList = keysInput;
    } else if (typeof keysInput === 'string') {
      rawList = keysInput.split(',');
    }

    // Clean keys, remove surrounding quotes, whitespace, and dummy placeholder values
    const cleaned = rawList
      .map(k => {
        if (typeof k !== 'string') return '';
        return k.trim().replace(/^["']|["']$/g, '').trim();
      })
      .filter(k => {
        if (!k || k.trim() === '') return false;
        const lower = k.toLowerCase();
        if (
          lower === 'your-gemini-api-key' ||
          lower === 'your-first-gemini-key' ||
          lower === 'your-second-gemini-key'
        ) {
          return false;
        }
        return true;
      });

    // Deduplicate
    const uniqueKeys = Array.from(new Set(cleaned));

    return uniqueKeys.map(key => ({
      key,
      maskedKey: key.length > 10 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '***',
      genAI: new GoogleGenerativeAI(key),
      failedUntil: 0,
      failureReason: null,
      totalRequests: 0,
      totalFailures: 0
    }));
  }

  /**
   * Returns total number of configured keys
   */
  getKeyCount() {
    return this.keys.length;
  }

  /**
   * Returns count of currently healthy (unquarantined) keys
   */
  getAvailableKeyCount() {
    const now = Date.now();
    return this.keys.filter(k => now >= k.failedUntil).length;
  }

  /**
   * Gets next available key using round-robin distribution among healthy keys
   */
  getNextAvailableKey() {
    const total = this.keys.length;
    if (total === 0) return null;

    const now = Date.now();
    for (let i = 0; i < total; i++) {
      const idx = (this.currentIndex + i) % total;
      const candidate = this.keys[idx];
      if (now >= candidate.failedUntil) {
        this.currentIndex = (idx + 1) % total;
        return candidate;
      }
    }
    return null;
  }

  /**
   * Legacy alias for backward compatibility
   */
  getAvailableKey() {
    return this.getNextAvailableKey();
  }

  /**
   * Determines if an error returned by Gemini or the network is rotatable
   */
  isRotatableError(error) {
    if (!error) return false;

    const status = error.status || error.statusCode || error.code;
    const msg = (error.message || '').toLowerCase();

    // HTTP status codes that indicate key or service issues
    if (status === 429 || status === 401 || status === 403 || status === 503 || status === 502 || status === 504 || status === 404) {
      return true;
    }

    // Rate limiting / quota exhaustion keywords
    if (
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('rate_limit') ||
      msg.includes('resource_exhausted') ||
      msg.includes('exhausted') ||
      msg.includes('too many requests')
    ) {
      return true;
    }

    // Invalid / unauthorized / expired key keywords
    if (
      msg.includes('api key not valid') ||
      msg.includes('api_key_invalid') ||
      msg.includes('invalid api key') ||
      msg.includes('unauthenticated') ||
      msg.includes('permission_denied') ||
      msg.includes('permission denied') ||
      msg.includes('consumer_invalid') ||
      msg.includes('consumer_suspended') ||
      msg.includes('key expired') ||
      msg.includes('billing not enabled') ||
      msg.includes('api_key_expired')
    ) {
      return true;
    }

    // Overloaded service / transient unavailability
    if (
      msg.includes('overloaded') ||
      msg.includes('model is overloaded') ||
      msg.includes('unavailable') ||
      msg.includes('503') ||
      msg.includes('bad gateway') ||
      msg.includes('gateway timeout')
    ) {
      return true;
    }

    // Transient connection / fetch errors
    if (
      msg.includes('fetch failed') ||
      msg.includes('econnreset') ||
      msg.includes('etimedout') ||
      msg.includes('connect_timeout') ||
      msg.includes('socket hang up') ||
      msg.includes('enotfound')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Quarantines a key based on the error encountered
   */
  markKeyFailed(keyObj, error) {
    if (!keyObj) return;

    const msg = (error?.message || '').toLowerCase();
    const status = error?.status || error?.statusCode || 0;

    let quarantineMs = this.coolOffPeriodMs; // default 60s
    let reason = 'rate_limit';

    if (
      status === 401 ||
      status === 403 ||
      msg.includes('api key not valid') ||
      msg.includes('api_key_invalid') ||
      msg.includes('invalid api key') ||
      msg.includes('unauthenticated') ||
      msg.includes('permission_denied') ||
      msg.includes('permission denied')
    ) {
      // Invalid/unauthenticated keys quarantined for 24 hours
      quarantineMs = 24 * 60 * 60 * 1000;
      reason = 'invalid_key';
    } else if (status === 503 || msg.includes('overloaded') || msg.includes('unavailable')) {
      quarantineMs = 30 * 1000; // 30s
      reason = 'model_overloaded';
    } else if (msg.includes('fetch failed') || msg.includes('econnreset') || msg.includes('etimedout')) {
      quarantineMs = 15 * 1000; // 15s
      reason = 'network_error';
    }

    keyObj.failedUntil = Date.now() + quarantineMs;
    keyObj.failureReason = reason;
    keyObj.totalFailures = (keyObj.totalFailures || 0) + 1;

    logger.warn({ key: keyObj.maskedKey, reason, quarantineSeconds: quarantineMs / 1000 }, '[GeminiKeyManager] Key quarantined');
  }

  /**
   * Wrapper around model.generateContent with automatic retry, key rotation, and model fallback
   */
  async generateContent(promptOrRequest, options = {}) {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys configured.');
    }

    const candidateModels = options.model
      ? [options.model]
      : Array.from(new Set([this.preferredModel, process.env.GEMINI_MODEL, ...DEFAULT_MODEL_LIST].filter(Boolean)));

    let lastError = null;
    const attemptedKeys = new Set();

    for (let mIdx = 0; mIdx < candidateModels.length; mIdx++) {
      const modelName = candidateModels[mIdx];
      const maxAttempts = this.keys.length;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Find an available key that has not yet been attempted in this request
        let keyObj = null;
        for (let i = 0; i < this.keys.length; i++) {
          const candidate = this.getNextAvailableKey();
          if (candidate && !attemptedKeys.has(candidate)) {
            keyObj = candidate;
            break;
          }
        }

        if (!keyObj) {
          keyObj = this.getNextAvailableKey();
        }

        if (!keyObj) {
          const sorted = [...this.keys].sort((a, b) => a.failedUntil - b.failedUntil);
          keyObj = sorted[0];
        }

        if (!keyObj) {
          break;
        }

        attemptedKeys.add(keyObj);
        keyObj.totalRequests = (keyObj.totalRequests || 0) + 1;

        try {
          const model = keyObj.genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(promptOrRequest);
          this.preferredModel = modelName;
          return result;
        } catch (error) {
          lastError = error;

          if (this.isRotatableError(error)) {
            this.markKeyFailed(keyObj, error);
            logger.info({ attempt: attempt + 1, maxAttempts, model: modelName }, '[GeminiKeyManager] Rotating to next available key...');
          } else {
            throw error;
          }
        }
      }

      // Check if failure was due to model-specific quota exhaustion or 404
      const errMsg = (lastError?.message || '').toLowerCase();
      const isModelIssue = lastError?.status === 404 ||
        errMsg.includes('quota') ||
        errMsg.includes('429') ||
        errMsg.includes('limit: 20') ||
        errMsg.includes('resource_exhausted');

      if (isModelIssue && mIdx < candidateModels.length - 1) {
        logger.warn({ failedModel: modelName, nextModel: candidateModels[mIdx + 1] }, '[GeminiKeyManager] Model quota or availability issue, falling back to next model...');
        for (const k of this.keys) {
          if (k.failureReason === 'rate_limit' || k.failureReason === 'model_overloaded') {
            k.failedUntil = 0;
          }
        }
      } else {
        break;
      }
    }

    if (lastError) {
      throw new Error(`Failed after ${attemptedKeys.size} attempt(s) across API keys. Last error: ${lastError.message}`);
    } else {
      throw new Error('All Gemini API keys are currently rate-limited, exhausted, or unavailable.');
    }
  }
}

module.exports = GeminiKeyManager;
