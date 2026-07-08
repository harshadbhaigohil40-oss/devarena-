require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { initGemini } = require('./config/gemini');
const { analyzeResume } = require('./services/aiService');

async function run() {
  try {
    initGemini();
    console.log("Initialized Gemini");
    
    // Just pass a dummy resume string instead of parsing PDF to isolate the issue
    const resumeText = "John Doe. Software Engineer. 5 years of experience in JavaScript, React, Node.js.";
    
    console.log("Calling analyzeResume...");
    const result = await analyzeResume(resumeText, "");
    console.log("Success:", result);
  } catch (err) {
    console.error("Error testing analyzeResume:", err);
  }
}

run();
