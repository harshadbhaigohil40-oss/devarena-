require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { initGemini, getModel } = require('./config/gemini');

async function testGemini() {
  console.log('Testing Gemini API Key...');
  console.log('Key snippet:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) + '...' : 'undefined');
  
  const model = initGemini();
  if (!model) {
    console.error('FAILED: Model did not initialize. Check if the key is empty or placeholder.');
    return;
  }

  try {
    const result = await model.generateContent('Say exactly: API KEY IS WORKING');
    const response = await result.response;
    console.log('\\n✅ SUCCESS! Chatbot replied:');
    console.log(response.text());
  } catch (err) {
    console.error('\\n❌ FAILED: The Gemini API returned an error:');
    console.error(err.message);
  }
}

testGemini();
