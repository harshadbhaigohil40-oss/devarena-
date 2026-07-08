require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { initGemini, getModel } = require('../../server/config/gemini');

async function run() {
  initGemini();
  const model = getModel();
  // We can't list models directly with the Node SDK easily unless we fetch from REST or it might be supported in recent SDKs
  // Let's just try to call a well-known model
  try {
    const result = await model.generateContent("hello");
    console.log("model works:", result.response.text());
  } catch (e) {
    console.log("model failed:", e.message);
  }
}
run();
