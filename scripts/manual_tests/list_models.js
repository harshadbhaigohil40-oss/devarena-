require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const https = require('https');

async function listModels() {
  const keysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
  if (!keysString) {
    console.error('No API keys configured.');
    return;
  }
  const apiKey = keysString.split(',')[0].trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const models = JSON.parse(data);
      console.log(models.models ? models.models.map(m => m.name).join('\n') : models);
    });
  }).on('error', err => {
    console.error('Error fetching models:', err.message);
  });
}

listModels();
