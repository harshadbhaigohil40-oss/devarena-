/**
 * DevArena Challenge Importer
 * Imports generated JSON challenge files into MongoDB.
 * Usage: node scripts/importChallenges.js [--file <filename>] [--all]
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Challenge = require('../models/Challenge');

const GENERATED_DIR = path.join(__dirname, '..', 'generated');

async function importFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📂 Importing: ${fileName}`);

  const raw = fs.readFileSync(filePath, 'utf8');
  const challenges = JSON.parse(raw);

  if (!Array.isArray(challenges) || challenges.length === 0) {
    console.log(`   ⚠️  Empty or invalid file, skipping.`);
    return { imported: 0, skipped: 0 };
  }

  let imported = 0;
  let skipped = 0;

  for (const challenge of challenges) {
    try {
      // Check for duplicate slug
      const exists = await Challenge.findOne({ slug: challenge.slug });
      if (exists) {
        skipped++;
        continue;
      }

      // Validate required fields
      if (!challenge.title || !challenge.slug || !challenge.difficulty || !challenge.category) {
        console.log(`   ⚠️  Skipping invalid challenge: ${challenge.title || 'untitled'}`);
        skipped++;
        continue;
      }

      // Ensure difficulty is valid
      const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (!validDifficulties.includes(challenge.difficulty)) {
        challenge.difficulty = 'intermediate';
      }

      // Ensure xpReward
      if (!challenge.xpReward) {
        const xpMap = { beginner: 50, intermediate: 100, advanced: 200, expert: 300 };
        challenge.xpReward = xpMap[challenge.difficulty];
      }

      await Challenge.create({
        title: challenge.title,
        slug: challenge.slug,
        description: challenge.description || '',
        difficulty: challenge.difficulty,
        category: challenge.category,
        tags: challenge.tags || [],
        xpReward: challenge.xpReward,
        starterCode: {
          javascript: challenge.starterCode?.javascript || '',
          python: challenge.starterCode?.python || '',
        },
        testCases: (challenge.testCases || []).map(tc => ({
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || '',
          isHidden: tc.isHidden || false,
        })),
        solution: challenge.solution || '',
        hints: challenge.hints || [],
      });

      imported++;
    } catch (err) {
      if (err.code === 11000) {
        skipped++; // Duplicate key
      } else {
        console.error(`   ❌ Error importing "${challenge.title}": ${err.message}`);
        skipped++;
      }
    }
  }

  console.log(`   ✅ Imported: ${imported} | Skipped: ${skipped} (duplicates/invalid)`);
  return { imported, skipped };
}

async function main() {
  const args = process.argv.slice(2);
  const fileFlag = args.indexOf('--file');
  const allFlag = args.includes('--all');

  if (!allFlag && fileFlag === -1) {
    console.log('\n📋 Usage:');
    console.log('  node scripts/importChallenges.js --all                  Import all generated files');
    console.log('  node scripts/importChallenges.js --file <filename.json> Import a specific file');
    console.log(`\n📁 Generated files directory: ${GENERATED_DIR}`);

    if (fs.existsSync(GENERATED_DIR)) {
      const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
      console.log(`\nAvailable files (${files.length}):`);
      files.forEach(f => {
        const data = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, f), 'utf8'));
        console.log(`  📄 ${f} (${data.length} challenges)`);
      });
    }
    process.exit(0);
  }

  await connectDB();

  let totalImported = 0;
  let totalSkipped = 0;

  if (allFlag) {
    if (!fs.existsSync(GENERATED_DIR)) {
      console.error('❌ No generated/ directory found. Run generate first.');
      process.exit(1);
    }

    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
    console.log(`\n🚀 Importing ${files.length} files from generated/\n`);

    for (const file of files) {
      const result = await importFile(path.join(GENERATED_DIR, file));
      totalImported += result.imported;
      totalSkipped += result.skipped;
    }
  } else {
    const fileName = args[fileFlag + 1];
    const filePath = path.join(GENERATED_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    const result = await importFile(filePath);
    totalImported = result.imported;
    totalSkipped = result.skipped;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 Import complete!`);
  console.log(`   ✅ Imported: ${totalImported}`);
  console.log(`   ⏭️  Skipped:  ${totalSkipped}`);

  const totalChallenges = await Challenge.countDocuments();
  console.log(`   📊 Total challenges in DB: ${totalChallenges}\n`);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
