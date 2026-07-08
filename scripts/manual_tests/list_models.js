require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const https = require('https');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const models = JSON.parse(data);
      console.log(models.models.map(m => m.name).join('\n'));
    });
  }).on('error', err => {
    console.error('Error fetching models:', err.message);
  });
}

listModels();
