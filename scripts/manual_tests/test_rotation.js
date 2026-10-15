const { GoogleGenerativeAI } = require('@google/generative-ai');
const GeminiKeyManager = require('../../server/services/geminiKeyManager');

async function testInvalidKey() {
  console.log('\n--- Test 1: Key 1 is Invalid (Rotates to Key 2) ---');
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
    console.log('Is Key 1 Quarantined?', manager.keys[0].failedUntil > Date.now() ? 'Yes' : 'No');
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

async function testOverloadError() {
  console.log('\n--- Test 3: Key 1 hits 503 Overloaded (Rotates to Key 2) ---');
  const manager = new GeminiKeyManager('OVERLOADED_KEY,VALID_KEY');
  
  manager.keys[0].genAI.getGenerativeModel = () => ({
    generateContent: async () => {
      const err = new Error('503 Service Unavailable: The model is overloaded. Please try again later.');
      err.status = 503;
      throw err;
    }
  });
  manager.keys[1].genAI.getGenerativeModel = () => ({
    generateContent: async () => { return { response: { text: () => 'Success from Key 2 after 503' } }; }
  });

  try {
    const res = await manager.generateContent('hello');
    console.log('Result:', res.response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function testRoundRobin() {
  console.log('\n--- Test 4: Round-Robin Load Distribution ---');
  const manager = new GeminiKeyManager('KEY_A,KEY_B,KEY_C');
  
  manager.keys[0].genAI.getGenerativeModel = () => ({
    generateContent: async () => ({ response: { text: () => 'Response from KEY_A' } })
  });
  manager.keys[1].genAI.getGenerativeModel = () => ({
    generateContent: async () => ({ response: { text: () => 'Response from KEY_B' } })
  });
  manager.keys[2].genAI.getGenerativeModel = () => ({
    generateContent: async () => ({ response: { text: () => 'Response from KEY_C' } })
  });

  const res1 = await manager.generateContent('q1');
  const res2 = await manager.generateContent('q2');
  const res3 = await manager.generateContent('q3');
  const res4 = await manager.generateContent('q4');

  console.log('Call 1:', res1.response.text());
  console.log('Call 2:', res2.response.text());
  console.log('Call 3:', res3.response.text());
  console.log('Call 4:', res4.response.text());
}

async function testAllFail() {
  console.log('\n--- Test 5: All Keys Fail (Quota) ---');
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
    console.log('Final Error Successfully Caught:', e.message);
  }
}

async function runTests() {
  await testInvalidKey();
  await testQuotaError();
  await testOverloadError();
  await testRoundRobin();
  await testAllFail();
}

runTests();
