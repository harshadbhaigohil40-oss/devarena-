require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // We can't list models directly with the Node SDK easily unless we fetch from REST or it might be supported in recent SDKs
  // Let's just try to call a well-known model: gemini-1.5-pro
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent("hello");
    console.log("gemini-1.5-pro works");
  } catch (e) {
    console.log("gemini-1.5-pro failed:", e.message);
  }
}
run();
