const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const { initGemini, getModel } = require('../config/gemini');

const SEED_FILE = path.join(__dirname, '../data/system-design-seed.json');
const DELAY_MS = 6000; // 6 seconds to avoid Gemini rate limits (15 RPM)
const LIMIT = 10; // Only run 10 at a time for safety, user can rerun to get more

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function generateChallengeData(model, question) {
  const prompt = `You are an expert System Design instructor creating high-quality interview challenges for DevArena.
I have a problem title: "${question.title}" (Topic: ${question.topicId}, Difficulty: ${question.difficulty}).
Generate a JSON object matching this schema EXACTLY for this problem:
{
  "description": "Markdown string describing the system design problem clearly, including functional and non-functional requirements, and expected scale.",
  "starterCode": {
    "javascript": "// System Design boilerplate\\n// Outline your high-level architecture here",
    "python": "# System Design boilerplate\\n# Outline your high-level architecture here",
    "java": "// System Design boilerplate\\n// Outline your high-level architecture here",
    "cpp": "// System Design boilerplate\\n// Outline your high-level architecture here"
  },
  "testCases": [
    { "input": "Evaluate design", "expectedOutput": "Scalable and reliable architecture", "isHidden": false }
  ],
  "hints": ["String"]
}

IMPORTANT:
- Respond STRICTLY with a valid JSON object only. Do not wrap it in markdown code blocks.
- Since this is System Design, the starter code can just be comments outlining the approach.
- You MUST provide starterCode for all 4 languages: javascript, python, java, cpp.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse JSON from Gemini response.');
  
  return JSON.parse(jsonMatch[0]);
}

async function runSeed() {
  console.log('🌱 Starting DSA Bulk Seeding Process...');
  console.log(`Loading JSON from: ${SEED_FILE}`);
  
  let questions = [];
  try {
    const rawData = fs.readFileSync(SEED_FILE, 'utf8');
    questions = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Failed to read seed file:', err.message);
    process.exit(1);
  }

  console.log(`Found ${questions.length} questions in seed file.`);

  // Connect DB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }

  initGemini();
  const model = getModel();
  
  let processed = 0;
  let skipped = 0;
  let generated = 0;
  let errors = 0;

  for (const q of questions) {
    if (processed >= LIMIT) {
      console.log(`\n🛑 Reached safety limit of ${LIMIT} questions per run.`);
      console.log('Run the script again to process the next batch.');
      break;
    }

    const slug = generateSlug(q.title);
    
    // Check if already exists in DB
    const existing = await Challenge.findOne({ slug });
    if (existing) {
      console.log(`⏭️  Skipping [${slug}] - Already exists in database.`);
      skipped++;
      // Don't count skipped towards processed limit
      continue;
    }

    console.log(`\n🤖 Generating [${slug}] via Gemini...`);
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
      try {
        const generatedData = await generateChallengeData(model, q);
        
        const newChallenge = new Challenge({
          title: q.title,
          slug: slug,
          difficulty: q.difficulty.toLowerCase(),
          category: q.topicId.replace(/-/g, ''), // arrays-hashing -> arrayshashing
          tags: [q.topicId],
          xpReward: q.difficulty === 'Hard' ? 300 : (q.difficulty === 'Medium' ? 200 : 100),
          description: generatedData.description,
          starterCode: generatedData.starterCode,
          testCases: generatedData.testCases,
          hints: generatedData.hints,
          source: 'ai_generator',
          importedAt: new Date()
        });

        await newChallenge.save();
        console.log(`✅ Successfully saved [${slug}] to database!`);
        generated++;
        processed++; // Count only generated items towards the limit
        success = true;
        
        console.log(`⏳ Waiting ${DELAY_MS/1000}s to avoid rate limits...`);
        await sleep(DELAY_MS);
        
      } catch (err) {
        console.error(`❌ Error generating [${slug}] (Attempt ${attempts}):`, err.message);
        const msg = err.message.toLowerCase();
        if (msg.includes('429') || msg.includes('quota exceeded') || msg.includes('rate-limited') || msg.includes('exhausted') || msg.includes('failed after 3 attempts')) {
          console.log(`⏳ Rate limit hit. Sleeping for 65 seconds before retrying...`);
          await sleep(65000);
        } else {
          errors++;
          break; // Break the while loop if it's not a rate limit error
        }
      }
    }
  }

  console.log('\n=======================================');
  console.log('🎉 Seeding Process Complete!');
  console.log(`Skipped (Duplicates): ${skipped}`);
  console.log(`Generated & Saved: ${generated}`);
  console.log(`Errors: ${errors}`);
  console.log('=======================================');

  process.exit(0);
}

runSeed();
