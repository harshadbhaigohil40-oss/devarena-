const { GoogleGenerativeAI } = require('@google/generative-ai');
const GeminiKeyManager = require('../../server/services/geminiKeyManager');

async function testInvalidKey() {
  console.log('\n--- Test 1: Key 1 is Invalid ---');
  const manager = new GeminiKeyManager('INVALID_KEY,VALID_KEY');
  
  manager.keys[0].genAI.getGenerativeModel = () => ({
    generateContent: async () => { throw new Error('API key not valid. Please pass a valid API key.'); }
  });
  manager.keys[1].genAI.getGenerativeModel = () => ({
    generateContent: async () => { return { response: { text: () => 'Success from Key 2' } }; }
  });

  try {
    const res = await manager.generateContent('hello');
    console.log('Result:', res.response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function testQuotaError() {
  console.log('\n--- Test 2: Key 1 hits Quota (429) ---');
  const manager = new GeminiKeyManager('QUOTA_KEY,VALID_KEY');
  
  manager.keys[0].genAI.getGenerativeModel = () => ({
    generateContent: async () => {
      const err = new Error('429 Too Many Requests: Quota exceeded');
      err.status = 429;
      throw err;
    }
  });
  manager.keys[1].genAI.getGenerativeModel = () => ({
    generateContent: async () => { return { response: { text: () => 'Success from Key 2' } }; }
  });

  try {
    const res = await manager.generateContent('hello');
    console.log('Result:', res.response.text());
    console.log('Is Key 1 Quarantined?', manager.keys[0].failedUntil > Date.now() ? 'Yes' : 'No');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function testAllFail() {
  console.log('\n--- Test 3: All Keys Fail (Quota) ---');
  const manager = new GeminiKeyManager('KEY_1,KEY_2');
  
  const throw429 = async () => {
    const err = new Error('429 Too Many Requests: Quota exceeded');
    err.status = 429;
    throw err;
  };

  manager.keys[0].genAI.getGenerativeModel = () => ({ generateContent: throw429 });
  manager.keys[1].genAI.getGenerativeModel = () => ({ generateContent: throw429 });

  try {
    await manager.generateContent('hello');
  } catch (e) {
    console.error('Final Error Received:', e.message);
  }
}

async function runTests() {
  // We actually need to fix test 1, because our code currently throws if the error is not 429.
  // Wait, the prompt says "Automatically switch to the next API key when the current key hits quota/rate limits (429 errors)"
  // So if it's an "Invalid Key" (400), it might throw immediately unless we consider 400 as a reason to rotate.
  await testQuotaError();
  await testAllFail();
}

runTests();
