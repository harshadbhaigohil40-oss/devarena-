/**
 * Admin Challenge Review Controller
 * Manages generated challenge files: list, view, edit, delete, approve, import.
 * Operates on JSON files in server/generated/ — does NOT touch the compiler or runner.
 */
const fs = require('fs');
const path = require('path');
const Challenge = require('../models/Challenge');
const { success, error } = require('../utils/responseHelper');

const GENERATED_DIR = path.join(__dirname, '..', 'generated');

// Helper: read all generated files and return flat challenge list
function readAllGenerated() {
  if (!fs.existsSync(GENERATED_DIR)) return [];
  const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
  const all = [];
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, file), 'utf8'));
      data.forEach(c => {
        c._sourceFile = file;
        if (typeof c.approved === 'undefined') c.approved = false;
      });
      all.push(...data);
    } catch (e) { /* skip corrupt files */ }
  }
  return all;
}

// Helper: save challenges back to their source file
function saveToFile(fileName, challenges) {
  const filePath = path.join(GENERATED_DIR, fileName);
  // Strip internal metadata before saving
  const clean = challenges.map(c => {
    const copy = { ...c };
    delete copy._sourceFile;
    return copy;
  });
  fs.writeFileSync(filePath, JSON.stringify(clean, null, 2), 'utf8');
}

// GET /api/admin/challenges/generated — List all generated challenges with filters
exports.listGenerated = async (req, res, next) => {
  try {
    const { search, tree, difficulty, status, sortBy, minScore, maxScore, badge } = req.query;
    let challenges = readAllGenerated();

    // Perform on-the-fly quality scoring if not already present
    challenges = challenges.map(c => {
      const q = scoreChallenge(c, challenges);
      return {
        ...c,
        qualityScore: c.qualityScore !== undefined ? c.qualityScore : q.score,
        qualityBadge: c.qualityBadge !== undefined ? c.qualityBadge : q.badge,
        qualityBreakdown: c.qualityBreakdown !== undefined ? c.qualityBreakdown : q.breakdown
      };
    });

    // Filter by skill tree (derive from filename)
    if (tree) {
      challenges = challenges.filter(c => c._sourceFile.startsWith(tree));
    }

    // Filter by difficulty
    if (difficulty) {
      challenges = challenges.filter(c => c.difficulty === difficulty);
    }

    // Filter by approval status
    if (status === 'approved') {
      challenges = challenges.filter(c => c.approved === true);
    } else if (status === 'pending') {
      challenges = challenges.filter(c => !c.approved);
    }

    // Filter by score range
    if (minScore) {
      challenges = challenges.filter(c => c.qualityScore >= parseInt(minScore));
    }
    if (maxScore) {
      challenges = challenges.filter(c => c.qualityScore <= parseInt(maxScore));
    }

    // Filter by badge
    if (badge) {
      challenges = challenges.filter(c => c.qualityBadge?.toLowerCase() === badge.toLowerCase());
    }

    // Search by title or slug
    if (search) {
      const q = search.toLowerCase();
      challenges = challenges.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort challenges
    if (sortBy) {
      if (sortBy === 'score_desc') {
        challenges.sort((a, b) => b.qualityScore - a.qualityScore);
      } else if (sortBy === 'score_asc') {
        challenges.sort((a, b) => a.qualityScore - b.qualityScore);
      } else if (sortBy === 'title_asc') {
        challenges.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    // Summary stats
    const stats = {
      total: challenges.length,
      approved: challenges.filter(c => c.approved).length,
      pending: challenges.filter(c => !c.approved).length,
    };

    success(res, { challenges, stats });
  } catch (err) { next(err); }
};

// GET /api/admin/challenges/generated/files — List generated files with counts
exports.listFiles = async (req, res, next) => {
  try {
    if (!fs.existsSync(GENERATED_DIR)) {
      return success(res, { files: [] });
    }
    const fileNames = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
    const files = fileNames.map(name => {
      const data = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, name), 'utf8'));
      return {
        name,
        total: data.length,
        approved: data.filter(c => c.approved).length,
        pending: data.filter(c => !c.approved).length,
      };
    });
    success(res, { files });
  } catch (err) { next(err); }
};

// PUT /api/admin/challenges/generated/:slug — Edit a generated challenge
exports.editGenerated = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    if (!fs.existsSync(GENERATED_DIR)) {
      return error(res, 'No generated challenges found.', 404);
    }

    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
    let found = false;

    for (const file of files) {
      const filePath = path.join(GENERATED_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const idx = data.findIndex(c => c.slug === slug);

      if (idx !== -1) {
        // Merge updates, preserving fields not in the update
        const merged = { ...data[idx], ...updates, slug: updates.slug || slug };
        // Re-score the updated challenge
        const q = scoreChallenge(merged, data);
        merged.qualityScore = q.score;
        merged.qualityBadge = q.badge;
        merged.qualityBreakdown = q.breakdown;
        
        data[idx] = merged;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        found = true;
        return success(res, { challenge: data[idx] });
      }
    }

    if (!found) return error(res, 'Challenge not found.', 404);
  } catch (err) { next(err); }
};

// DELETE /api/admin/challenges/generated/:slug — Delete a generated challenge
exports.deleteGenerated = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!fs.existsSync(GENERATED_DIR)) {
      return error(res, 'No generated challenges found.', 404);
    }

    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(GENERATED_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const filtered = data.filter(c => c.slug !== slug);

      if (filtered.length < data.length) {
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf8');
        return success(res, { message: `Deleted "${slug}" from ${file}` });
      }
    }

    return error(res, 'Challenge not found.', 404);
  } catch (err) { next(err); }
};

// POST /api/admin/challenges/generated/:slug/approve — Approve a challenge
exports.approveGenerated = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { approved } = req.body; // true or false

    if (!fs.existsSync(GENERATED_DIR)) {
      return error(res, 'No generated challenges found.', 404);
    }

    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(GENERATED_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const idx = data.findIndex(c => c.slug === slug);

      if (idx !== -1) {
        data[idx].approved = approved !== false;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return success(res, { challenge: data[idx] });
      }
    }

    return error(res, 'Challenge not found.', 404);
  } catch (err) { next(err); }
};

// POST /api/admin/challenges/generated/approve-bulk — Approve multiple
exports.approveBulk = async (req, res, next) => {
  try {
    const { slugs, approved } = req.body;
    if (!Array.isArray(slugs)) return error(res, 'slugs must be an array', 400);

    const slugSet = new Set(slugs);
    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
    let count = 0;

    for (const file of files) {
      const filePath = path.join(GENERATED_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let modified = false;
      data.forEach(c => {
        if (slugSet.has(c.slug)) {
          c.approved = approved !== false;
          modified = true;
          count++;
        }
      });
      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      }
    }

    success(res, { message: `Updated ${count} challenges`, count });
  } catch (err) { next(err); }
};

// POST /api/admin/challenges/import — Import approved challenges into MongoDB
exports.importApproved = async (req, res, next) => {
  try {
    const allChallenges = readAllGenerated();
    const approved = allChallenges.filter(c => c.approved);

    if (approved.length === 0) {
      return error(res, 'No approved challenges to import.', 400);
    }

    let imported = 0;
    let skipped = 0;
    const errors = [];
    const processedSlugs = new Set();
    const processedTitles = new Set();

    for (const c of approved) {
      try {
        // ─── STAGE 1: VALILDATION ───
        
        // 1. Title/Slug uniqueness in current batch
        if (processedSlugs.has(c.slug)) {
          errors.push(`${c.slug}: Duplicate slug in the approved batch.`);
          continue;
        }
        if (processedTitles.has(c.title?.toLowerCase())) {
          errors.push(`${c.slug}: Duplicate title "${c.title}" in the approved batch.`);
          continue;
        }

        // 2. Title/Slug validation
        if (!c.title || c.title.trim().length < 3) {
          errors.push(`${c.slug || 'unknown'}: Title must be at least 3 characters.`);
          continue;
        }
        if (!c.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.slug)) {
          errors.push(`${c.title || 'unknown'}: Invalid or missing slug format.`);
          continue;
        }

        // 3. Database uniqueness check
        const existsSlug = await Challenge.findOne({ slug: c.slug });
        if (existsSlug) {
          skipped++;
          continue;
        }
        const existsTitle = await Challenge.findOne({ title: new RegExp(`^${c.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
        if (existsTitle) {
          errors.push(`${c.slug}: Title "${c.title}" already exists in MongoDB.`);
          continue;
        }

        // 4. Starter code validation
        const jsCode = c.starterCode?.javascript || '';
        const pyCode = c.starterCode?.python || '';
        if (!jsCode.trim() || !pyCode.trim()) {
          errors.push(`${c.slug}: Missing starter code for javascript or python.`);
          continue;
        }
        if (!jsCode.includes('function') && !jsCode.includes('=>') && !jsCode.includes('class')) {
          errors.push(`${c.slug}: JavaScript starter code must define a function or class.`);
          continue;
        }

        // 5. Test cases validation
        const tests = c.testCases || [];
        if (tests.length === 0) {
          errors.push(`${c.slug}: Must contain at least one test case.`);
          continue;
        }
        const hasVisible = tests.some(t => !t.isHidden);
        const hasHidden = tests.some(t => t.isHidden);
        if (!hasVisible || !hasHidden) {
          errors.push(`${c.slug}: Must have at least one visible AND one hidden test case.`);
          continue;
        }

        let testCaseError = false;
        for (let i = 0; i < tests.length; i++) {
          const tc = tests[i];
          if (tc.input === undefined || tc.input === null || tc.input === '' ||
              tc.expectedOutput === undefined || tc.expectedOutput === null || tc.expectedOutput === '') {
            errors.push(`${c.slug}: Test case #${i + 1} has empty input or expected output.`);
            testCaseError = true;
            break;
          }
        }
        if (testCaseError) continue;

        // ─── STAGE 2: IMPORT ───
        const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
        let diff = c.difficulty;
        if (!validDifficulties.includes(diff)) diff = 'intermediate';

        const xpMap = { beginner: 50, intermediate: 100, advanced: 200, expert: 300 };
        const xpReward = c.xpReward || xpMap[diff];

        await Challenge.create({
          title: c.title,
          slug: c.slug,
          description: c.description || '',
          difficulty: diff,
          category: c.category,
          tags: c.tags || [],
          xpReward: xpReward,
          starterCode: {
            javascript: jsCode,
            python: pyCode,
          },
          testCases: tests.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: !!tc.isHidden,
          })),
          solution: c.solution || '',
          hints: c.hints || [],
        });

        processedSlugs.add(c.slug);
        processedTitles.add(c.title.toLowerCase());
        imported++;
      } catch (err) {
        errors.push(`${c.slug || 'unknown'}: ${err.message}`);
      }
    }

    const totalInDB = await Challenge.countDocuments();

    success(res, {
      message: `Import complete`,
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      totalInDB,
    });
  } catch (err) { next(err); }
};

// ─── Quality Scoring Engine ───
function scoreChallenge(c, allChallenges = []) {
  let score = 0;
  const breakdown = {};

  // 1. Title quality (0-15): length (10 pts), capitalization (5 pts)
  const title = c.title || '';
  const titleLen = title.length;
  const titleLenScore = titleLen >= 10 && titleLen <= 60 ? 10 : titleLen >= 5 ? 6 : titleLen > 0 ? 3 : 0;
  const startsWithCapital = /^[A-Z]/.test(title);
  const notAllCaps = title !== title.toUpperCase() || titleLen < 5;
  const capitalizationScore = (startsWithCapital && notAllCaps) ? 5 : 2;
  breakdown.title = titleLenScore + capitalizationScore;
  score += breakdown.title;

  // 2. Slug quality (0-10): format (5 pts), match with title (5 pts)
  const slug = c.slug || '';
  const slugValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length > 3;
  const expectedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const slugMatches = slug === expectedSlug || slug.includes(expectedSlug) || expectedSlug.includes(slug);
  breakdown.slug = (slugValid ? 5 : 0) + (slugMatches ? 5 : 2);
  score += breakdown.slug;

  // 3. Difficulty accuracy (0-10): valid difficulty (5 pts), matches XP reward (5 pts)
  const validDiffs = ['beginner', 'intermediate', 'advanced', 'expert'];
  const diffValid = validDiffs.includes(c.difficulty);
  const xpMap = { beginner: 50, intermediate: 100, advanced: 200, expert: 300 };
  const expectedXp = xpMap[c.difficulty];
  const xpMatches = expectedXp && c.xpReward === expectedXp;
  breakdown.difficulty = (diffValid ? 5 : 0) + (xpMatches ? 5 : 2);
  score += breakdown.difficulty;

  // 4. Test case quality (0-20): count (8 pts), has visible (4 pts), has hidden (4 pts), non-empty (4 pts)
  const tests = c.testCases || [];
  const countScore = tests.length >= 3 ? 8 : tests.length * 2.5;
  const hasVisible = tests.some(t => !t.isHidden);
  const hasHidden = tests.some(t => t.isHidden);
  const allHaveIO = tests.length > 0 && tests.every(t => t.input !== undefined && t.input !== '' && t.expectedOutput !== undefined && t.expectedOutput !== '');
  breakdown.testCases = Math.round(countScore + (hasVisible ? 4 : 0) + (hasHidden ? 4 : 0) + (allHaveIO ? 4 : 0));
  score += breakdown.testCases;

  // 5. Starter code quality (0-15): JS syntax (8 pts), Python syntax (7 pts)
  const js = c.starterCode?.javascript || '';
  const py = c.starterCode?.python || '';
  const jsValid = js.length > 10 && (js.includes('function') || js.includes('=>') || js.includes('class'));
  const pyValid = py.length > 10 && (py.includes('def') || py.includes('class'));
  breakdown.starterCode = (jsValid ? 8 : 0) + (pyValid ? 7 : 0);
  score += breakdown.starterCode;

  // 6. Tag quality (0-10): presence (5 pts), format/lowercase (5 pts)
  const tags = c.tags || [];
  const tagsPresent = tags.length >= 1;
  const tagsFormat = tagsPresent && tags.every(t => /^[a-z0-9-]+$/.test(t));
  breakdown.tags = (tagsPresent ? 5 : 0) + (tagsFormat ? 5 : 0);
  score += breakdown.tags;

  // 7. Real-world relevance (0-10): description length (5 pts), key real-world terms (5 pts)
  const desc = c.description || '';
  const descLenScore = desc.length > 120 ? 5 : desc.length > 50 ? 3 : 0;
  const scenarioTerms = ['scenario', 'simulate', 'design', 'user', 'build', 'implement', 'create', 'engine', 'system', 'database', 'api', 'server', 'application', 'network', 'process'];
  const hasScenarioTerm = scenarioTerms.some(term => desc.toLowerCase().includes(term));
  breakdown.relevance = descLenScore + (hasScenarioTerm ? 5 : 1);
  score += breakdown.relevance;

  // 8. Duplicate probability (0-10): exact title/slug overlap count in the full collection
  const dupSlugs = allChallenges.filter(ch => ch.slug === slug).length;
  const dupTitles = allChallenges.filter(ch => ch.title?.toLowerCase() === title.toLowerCase()).length;
  // c is included in allChallenges, so 1 means unique
  const dupCount = Math.max(dupSlugs, dupTitles) - 1;
  breakdown.duplicate = dupCount === 0 ? 10 : dupCount === 1 ? 5 : 0;
  score += breakdown.duplicate;

  const badge = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Average' : 'Poor';

  return { score, badge, breakdown };
}

// POST /api/admin/challenges/generated/:slug/quality — Score a challenge
exports.scoreChallenge = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const all = readAllGenerated();
    const challenge = all.find(c => c.slug === slug);
    if (!challenge) return error(res, 'Challenge not found.', 404);

    const quality = scoreChallenge(challenge, all);

    // Save the score to the file
    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(GENERATED_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const idx = data.findIndex(c => c.slug === slug);
      if (idx !== -1) {
        data[idx].qualityScore = quality.score;
        data[idx].qualityBadge = quality.badge;
        data[idx].qualityBreakdown = quality.breakdown;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        break;
      }
    }

    success(res, { quality });
  } catch (err) { next(err); }
};

// POST /api/admin/challenges/score-all — Score all generated challenges
exports.scoreAll = async (req, res, next) => {
  try {
    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
    const all = readAllGenerated();
    let scored = 0;

    for (const file of files) {
      const filePath = path.join(GENERATED_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      data.forEach(c => {
        const q = scoreChallenge(c, all);
        c.qualityScore = q.score;
        c.qualityBadge = q.badge;
        c.qualityBreakdown = q.breakdown;
        scored++;
      });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    success(res, { message: `Scored ${scored} challenges`, scored });
  } catch (err) { next(err); }
};

// POST /api/admin/challenges/generated/:slug/ai-review — Gemini AI review
exports.aiReview = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const all = readAllGenerated();
    const c = all.find(ch => ch.slug === slug);
    if (!c) return error(res, 'Challenge not found.', 404);

    const { getModel } = require('../config/gemini');
    const model = getModel();

    const prompt = `You are a senior coding challenge reviewer for DevArena, a gamified developer learning platform.

Review this challenge and provide a quality analysis:

Title: ${c.title}
Slug: ${c.slug}
Difficulty: ${c.difficulty}
Category: ${c.category}
Tags: ${JSON.stringify(c.tags)}
XP: ${c.xpReward}
Description: ${c.description}
JS Starter: ${c.starterCode?.javascript}
Python Starter: ${c.starterCode?.python}
Test Cases: ${JSON.stringify(c.testCases)}
Hints: ${JSON.stringify(c.hints)}

Respond STRICTLY in this JSON format (no markdown fences):
{
  "overallScore": <0-100>,
  "verdict": "<Excellent|Good|Average|Poor>",
  "issues": ["<issue 1>", "<issue 2>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>"],
  "improvedTitle": "<better title if needed or same>",
  "improvedDescription": "<improved markdown description>",
  "improvedStarterCode": {
    "javascript": "<improved JS starter>",
    "python": "<improved Python starter>"
  },
  "improvedTestCases": [
    { "input": "<value>", "expectedOutput": "<value>", "isHidden": false }
  ],
  "improvedHints": ["<hint1>", "<hint2>"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');

    const review = JSON.parse(jsonMatch[0]);
    success(res, { review });
  } catch (err) {
    console.error('AI Review error:', err.message);
    error(res, 'AI review failed: ' + err.message, 500);
  }
};

// GET /api/admin/challenges/analytics — Challenge analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const all = readAllGenerated();
    const totalInDB = await Challenge.countDocuments();

    // Per-tree breakdown
    const treeMap = {};
    const diffMap = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    let totalScore = 0;
    let scoredCount = 0;

    all.forEach(c => {
      const treeName = (c._sourceFile || '').split('-')[0] || 'unknown';
      if (!treeMap[treeName]) treeMap[treeName] = { total: 0, approved: 0, pending: 0, avgScore: 0, scores: [] };
      treeMap[treeName].total++;
      if (c.approved) treeMap[treeName].approved++;
      else treeMap[treeName].pending++;
      if (c.qualityScore) { treeMap[treeName].scores.push(c.qualityScore); totalScore += c.qualityScore; scoredCount++; }
      if (diffMap[c.difficulty] !== undefined) diffMap[c.difficulty]++;
    });

    // Compute averages
    Object.values(treeMap).forEach(t => {
      t.avgScore = t.scores.length > 0 ? Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) : 0;
      delete t.scores;
    });

    const qualityDistribution = {
      excellent: all.filter(c => c.qualityScore >= 90).length,
      good: all.filter(c => c.qualityScore >= 75 && c.qualityScore < 90).length,
      average: all.filter(c => c.qualityScore >= 60 && c.qualityScore < 75).length,
      poor: all.filter(c => c.qualityScore > 0 && c.qualityScore < 60).length,
      unscored: all.filter(c => !c.qualityScore).length,
    };

    success(res, {
      generated: all.length,
      approved: all.filter(c => c.approved).length,
      imported: totalInDB,
      avgQualityScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
      perTree: treeMap,
      perDifficulty: diffMap,
      qualityDistribution,
    });
  } catch (err) { next(err); }
};
