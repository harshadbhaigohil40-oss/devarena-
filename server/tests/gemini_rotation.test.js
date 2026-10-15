const { describe, it } = require('node:test');
const assert = require('node:assert');
const GeminiKeyManager = require('../services/geminiKeyManager');

describe('Gemini Key Rotation & Manager Verification', () => {
  it('should parse and deduplicate keys, removing quotes and dummy placeholders', () => {
    const rawKeys = ' "KEY_A" , KEY_B, your-gemini-api-key, KEY_A, KEY_C ';
    const manager = new GeminiKeyManager(rawKeys);
    assert.strictEqual(manager.getKeyCount(), 3);
    assert.strictEqual(manager.keys[0].key, 'KEY_A');
    assert.strictEqual(manager.keys[1].key, 'KEY_B');
    assert.strictEqual(manager.keys[2].key, 'KEY_C');
  });

  it('should distribute requests round-robin among healthy keys', async () => {
    const manager = new GeminiKeyManager('KEY_1,KEY_2,KEY_3');
    manager.keys[0].genAI.getGenerativeModel = () => ({
      generateContent: async () => ({ response: { text: () => 'Response 1' } })
    });
    manager.keys[1].genAI.getGenerativeModel = () => ({
      generateContent: async () => ({ response: { text: () => 'Response 2' } })
    });
    manager.keys[2].genAI.getGenerativeModel = () => ({
      generateContent: async () => ({ response: { text: () => 'Response 3' } })
    });

    const r1 = await manager.generateContent('q1');
    const r2 = await manager.generateContent('q2');
    const r3 = await manager.generateContent('q3');
    const r4 = await manager.generateContent('q4');

    assert.strictEqual(r1.response.text(), 'Response 1');
    assert.strictEqual(r2.response.text(), 'Response 2');
    assert.strictEqual(r3.response.text(), 'Response 3');
    assert.strictEqual(r4.response.text(), 'Response 1');
  });

  it('should automatically rotate to Key 2 when Key 1 encounters 429 quota exhaustion', async () => {
    const manager = new GeminiKeyManager('QUOTA_KEY,BACKUP_KEY');
    manager.keys[0].genAI.getGenerativeModel = () => ({
      generateContent: async () => {
        const err = new Error('429 Too Many Requests: Quota exceeded');
        err.status = 429;
        throw err;
      }
    });
    manager.keys[1].genAI.getGenerativeModel = () => ({
      generateContent: async () => ({ response: { text: () => 'Success from Backup' } })
    });

    const result = await manager.generateContent('test');
    assert.strictEqual(result.response.text(), 'Success from Backup');
    assert.ok(manager.keys[0].failedUntil > Date.now(), 'Failed key must be quarantined');
    assert.strictEqual(manager.keys[0].failureReason, 'rate_limit');
  });

  it('should automatically rotate to Key 2 when Key 1 has invalid credentials', async () => {
    const manager = new GeminiKeyManager('BAD_KEY,GOOD_KEY');
    manager.keys[0].genAI.getGenerativeModel = () => ({
      generateContent: async () => {
        const err = new Error('API key not valid. Please pass a valid API key.');
        err.status = 400;
        throw err;
      }
    });
    manager.keys[1].genAI.getGenerativeModel = () => ({
      generateContent: async () => ({ response: { text: () => 'Success from Good Key' } })
    });

    const result = await manager.generateContent('test');
    assert.strictEqual(result.response.text(), 'Success from Good Key');
    assert.strictEqual(manager.keys[0].failureReason, 'invalid_key');
  });

  it('should automatically rotate to Key 2 when Key 1 encounters 503 model overload', async () => {
    const manager = new GeminiKeyManager('OVERLOADED_KEY,GOOD_KEY');
    manager.keys[0].genAI.getGenerativeModel = () => ({
      generateContent: async () => {
        const err = new Error('503 Service Unavailable: The model is overloaded.');
        err.status = 503;
        throw err;
      }
    });
    manager.keys[1].genAI.getGenerativeModel = () => ({
      generateContent: async () => ({ response: { text: () => 'Success after overload' } })
    });

    const result = await manager.generateContent('test');
    assert.strictEqual(result.response.text(), 'Success after overload');
    assert.strictEqual(manager.keys[0].failureReason, 'model_overloaded');
  });

  it('should fail cleanly when all keys fail with quota errors', async () => {
    const manager = new GeminiKeyManager('KEY_A,KEY_B');
    const throw429 = async () => {
      const err = new Error('429 Too Many Requests: Quota exceeded');
      err.status = 429;
      throw err;
    };
    manager.keys[0].genAI.getGenerativeModel = () => ({ generateContent: throw429 });
    manager.keys[1].genAI.getGenerativeModel = () => ({ generateContent: throw429 });

    await assert.rejects(
      async () => { await manager.generateContent('test'); },
      /Failed after 2 attempt\(s\) across API keys/
    );
  });
});
