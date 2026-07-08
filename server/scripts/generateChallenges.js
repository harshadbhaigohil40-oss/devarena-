/**
 * DevArena Challenge Generator
 * Uses Gemini AI to bulk-generate challenges matching the Challenge.js schema.
 * Usage: node scripts/generateChallenges.js --tree <treeName> [--batch <size>]
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── Config ───
const OUTPUT_DIR = path.join(__dirname, '..', 'generated');
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

// ─── Skill Tree Definitions (mirrors skillTrees.js + seeds/index.js nodeTagMap) ───
const TREE_CONFIG = {
  frontend: {
    category: 'frontend',
    nodes: [
      { nodeId: 'fe-html', title: 'HTML & CSS', tier: 1, difficulty: 'beginner', tags: ['html-css-layouts'],
        topics: 'HTML5 semantics, CSS selectors, Flexbox, Grid, box model, forms, tables, accessibility basics, semantic elements, CSS variables' },
      { nodeId: 'fe-js', title: 'JavaScript', tier: 2, difficulty: 'intermediate', tags: ['js-dom-manipulation'],
        topics: 'ES6+, closures, promises, async/await, DOM manipulation, event handling, array methods, destructuring, template literals, modules' },
      { nodeId: 'fe-responsive', title: 'Responsive Design', tier: 2, difficulty: 'intermediate', tags: ['html-css-layouts'],
        topics: 'Media queries, mobile-first design, viewport units, responsive images, fluid typography, CSS Grid responsive patterns' },
      { nodeId: 'fe-react', title: 'React', tier: 3, difficulty: 'advanced', tags: ['hooks', 'closures'],
        topics: 'Components, props, state, hooks (useState, useEffect, useRef, useMemo), JSX, event handling, conditional rendering, lists and keys' },
      { nodeId: 'fe-advanced', title: 'Advanced React', tier: 4, difficulty: 'advanced', tags: ['state-management', 'performance'],
        topics: 'Context API, Redux patterns, React.memo, useCallback, code splitting, lazy loading, error boundaries, custom hooks, render optimization' },
      { nodeId: 'fe-testing', title: 'Testing', tier: 4, difficulty: 'advanced', tags: ['web-apis'],
        topics: 'Unit testing concepts, test assertions, mocking, DOM testing patterns, integration tests, test-driven development logic' },
      { nodeId: 'fe-master', title: 'Frontend Expert', tier: 5, difficulty: 'expert', tags: ['system-ui', 'design-patterns'],
        topics: 'Design system architecture, micro-frontends, SSR concepts, web workers, service workers, performance budgets, accessibility at scale' },
    ]
  },
  backend: {
    category: 'backend',
    nodes: [
      { nodeId: 'be-node', title: 'Node.js Basics', tier: 1, difficulty: 'beginner', tags: ['crud-apis', 'http'],
        topics: 'Modules, require/import, file system operations, HTTP basics, event loop, callbacks, buffers, streams, npm basics, environment variables' },
      { nodeId: 'be-express', title: 'Express.js', tier: 2, difficulty: 'intermediate', tags: ['middleware-logic', 'parsing'],
        topics: 'Routing, middleware, request/response objects, query parsing, body parsing, error handling middleware, REST API design, status codes' },
      { nodeId: 'be-db', title: 'Databases', tier: 2, difficulty: 'intermediate', tags: ['sql-queries', 'schema-design'],
        topics: 'MongoDB queries, SQL basics, schema design, CRUD operations, indexing, aggregation, joins, normalization, data modeling' },
      { nodeId: 'be-auth', title: 'Authentication', tier: 3, difficulty: 'advanced', tags: ['authentication-basics', 'jwt'],
        topics: 'JWT structure, token validation, password hashing, OAuth concepts, session management, RBAC, refresh tokens, security headers' },
      { nodeId: 'be-scale', title: 'Scaling', tier: 4, difficulty: 'advanced', tags: ['caching', 'rate-limiting'],
        topics: 'Redis caching, rate limiting algorithms, queue systems, background jobs, connection pooling, horizontal scaling, load balancing' },
      { nodeId: 'be-realtime', title: 'Real-time', tier: 4, difficulty: 'advanced', tags: ['queue-systems'],
        topics: 'WebSocket concepts, pub/sub patterns, event-driven architecture, message queues, SSE, real-time data sync, socket rooms' },
      { nodeId: 'be-master', title: 'Backend Expert', tier: 5, difficulty: 'expert', tags: ['microservices', 'load-balancing'],
        topics: 'Microservices patterns, API gateway design, service discovery, circuit breaker, CQRS, event sourcing, distributed tracing' },
    ]
  },
  algorithms: {
    category: 'algorithms',
    nodes: [
      { nodeId: 'algo-basics', title: 'Algorithm Basics', tier: 1, difficulty: 'beginner', tags: ['arrays', 'strings', 'hash-map'],
        topics: 'Arrays, strings, hash maps, sets, two pointers, sliding window, prefix sum, frequency counting, basic math, bit manipulation' },
      { nodeId: 'algo-search', title: 'Searching', tier: 2, difficulty: 'intermediate', tags: ['searching', 'binary-search'],
        topics: 'Linear search, binary search, search insert position, first/last occurrence, peak element, rotated array search, matrix search' },
      { nodeId: 'algo-sort', title: 'Sorting', tier: 2, difficulty: 'intermediate', tags: ['sorting', 'merge-sort'],
        topics: 'Bubble sort, selection sort, insertion sort, merge sort, quick sort, counting sort, sort colors, custom comparators' },
      { nodeId: 'algo-recursion', title: 'Recursion', tier: 3, difficulty: 'advanced', tags: ['recursion', 'backtracking'],
        topics: 'Recursive thinking, backtracking, permutations, combinations, subsets, N-Queens, Sudoku, generate parentheses, tree recursion' },
      { nodeId: 'algo-dp', title: 'Dynamic Programming', tier: 4, difficulty: 'advanced', tags: ['dynamic-programming'],
        topics: 'Memoization, tabulation, 1D DP, 2D DP, knapsack, LIS, LCS, coin change, matrix chain, interval DP, bitmask DP' },
      { nodeId: 'algo-graphs', title: 'Graph Algorithms', tier: 4, difficulty: 'advanced', tags: ['graphs', 'dfs', 'bfs'],
        topics: 'BFS, DFS, topological sort, Dijkstra, Bellman-Ford, Floyd-Warshall, MST (Prim/Kruskal), union-find, cycle detection' },
      { nodeId: 'algo-master', title: 'Algorithm Expert', tier: 5, difficulty: 'expert', tags: ['algorithm-expert'],
        topics: 'Segment trees, Fenwick trees, tries, advanced DP, competitive programming, FAANG interview problems, hard graph problems' },
    ]
  },
  systemdesign: {
    category: 'system-design',
    nodes: [
      { nodeId: 'sd-basics', title: 'Fundamentals', tier: 1, difficulty: 'beginner', tags: ['url-shortener', 'load-balancing', 'encoding'],
        topics: 'Scalability, CAP theorem, load balancing, caching basics, API design, client-server architecture, latency vs throughput, hashing' },
      { nodeId: 'sd-storage', title: 'Storage Systems', tier: 2, difficulty: 'intermediate', tags: ['file-uploader', 'distributed-cache', 'caching'],
        topics: 'SQL vs NoSQL, database sharding, replication, indexing, data consistency, Redis, Elasticsearch, TTL-based caching' },
      { nodeId: 'sd-compute', title: 'Compute', tier: 2, difficulty: 'intermediate', tags: ['chat-system', 'notification-system'],
        topics: 'API gateway, reverse proxy, containers, serverless, rate limiting, token bucket, load balancer algorithms, autoscaling' },
      { nodeId: 'sd-distributed', title: 'Distributed Systems', tier: 3, difficulty: 'advanced', tags: ['news-feed', 'distributed'],
        topics: 'Distributed caching, event-driven systems, Kafka, message queues, consistency models, distributed transactions, consensus' },
      { nodeId: 'sd-interview', title: 'Interview Prep', tier: 4, difficulty: 'advanced', tags: ['instagram', 'sharding'],
        topics: 'Design Twitter, Design WhatsApp, Design Uber, Design Dropbox, Design Spotify, Design Amazon, system design interview patterns' },
      { nodeId: 'sd-cloud', title: 'Cloud Architecture', tier: 4, difficulty: 'advanced', tags: ['cdn-system'],
        topics: 'AWS/GCP/Azure patterns, CDN design, cloud storage, monitoring, multi-region deployment, infrastructure as code' },
      { nodeId: 'sd-master', title: 'Architect', tier: 5, difficulty: 'expert', tags: ['search-engine', 'probabilistic'],
        topics: 'Design YouTube, Design Netflix, Design LinkedIn, global scale systems, multi-region architecture, high availability patterns' },
    ]
  }
};

// ─── Gemini Setup ───
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ─── Prompt Builder ───
function buildPrompt(node, category, count) {
  return `You are a coding challenge generator for DevArena, a gamified developer learning platform.

Generate exactly ${count} UNIQUE coding challenges for the "${node.title}" node (Tier ${node.tier}) in the "${category}" skill tree.

Topics to cover: ${node.topics}
Difficulty: "${node.difficulty}"
Category: "${category}"
Tags to use: ${JSON.stringify(node.tags)}

XP rewards by difficulty: beginner=50, intermediate=100, advanced=200, expert=300

CRITICAL RULES:
1. Each challenge MUST be a pure algorithmic/logic function that takes input and returns output.
2. NO I/O, NO console.log, NO file operations, NO network calls, NO classes with side effects.
3. Functions must be testable: given input → expected output.
4. Test case inputs/outputs must be simple strings that can be parsed (numbers, arrays, objects, strings).
5. Each challenge must have 2-3 test cases (at least 1 visible, at least 1 hidden).
6. Slugs must be unique, lowercase, hyphenated.
7. Descriptions must use markdown with ## title, explanation, and ### Example section.
8. Starter code must have both javascript and python versions.
9. Include 1-2 hints per challenge.
10. Make challenges progressively harder within the batch.
11. Use real-world scenarios relevant to ${node.title}.

Output ONLY a valid JSON array. No markdown fences, no explanation. Just the raw JSON array.

Each object in the array must match this exact schema:
{
  "title": "Challenge Title",
  "slug": "challenge-title",
  "difficulty": "${node.difficulty}",
  "category": "${category}",
  "tags": ${JSON.stringify(node.tags)},
  "xpReward": <number>,
  "description": "## Title\\n\\nDescription text\\n\\n### Example\\n\`input\` → \`output\`",
  "starterCode": {
    "javascript": "function name(params) {\\n  // Your code here\\n}",
    "python": "def name(params):\\n    # Your code here\\n    pass"
  },
  "testCases": [
    { "input": "value", "expectedOutput": "value", "isHidden": false },
    { "input": "value", "expectedOutput": "value", "isHidden": true }
  ],
  "hints": ["Hint 1", "Hint 2"]
}`;
}

// ─── Utility: sleep ───
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Generate a single batch ───
async function generateBatch(node, category, count) {
  const prompt = buildPrompt(node, category, count);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`   🤖 Gemini call (attempt ${attempt}/${MAX_RETRIES})...`);
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Extract JSON array
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in response');

      const challenges = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(challenges) || challenges.length === 0) {
        throw new Error('Parsed result is not a valid array');
      }

      // Validate each challenge
      const valid = challenges.filter(c =>
        c.title && c.slug && c.difficulty && c.category &&
        c.tags && c.starterCode?.javascript && c.starterCode?.python &&
        c.testCases?.length > 0 && c.description
      );

      console.log(`   ✅ Got ${valid.length}/${challenges.length} valid challenges`);
      return valid;
    } catch (err) {
      console.error(`   ❌ Attempt ${attempt} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`   ⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  console.error(`   🚫 All ${MAX_RETRIES} attempts failed for ${node.nodeId}`);
  return [];
}

// ─── Duplicate Detection ───
function deduplicateChallenges(existing, newChallenges) {
  const existingSlugs = new Set(existing.map(c => c.slug));
  const existingTitles = new Set(existing.map(c => c.title.toLowerCase()));

  return newChallenges.filter(c => {
    if (existingSlugs.has(c.slug)) {
      console.log(`   ⚠️  Skipping duplicate slug: ${c.slug}`);
      return false;
    }
    if (existingTitles.has(c.title.toLowerCase())) {
      console.log(`   ⚠️  Skipping duplicate title: ${c.title}`);
      return false;
    }
    existingSlugs.add(c.slug);
    existingTitles.add(c.title.toLowerCase());
    return true;
  });
}

// ─── Main Runner ───
async function main() {
  const args = process.argv.slice(2);
  const treeFlag = args.indexOf('--tree');
  const batchFlag = args.indexOf('--batch');
  const nodeFlag = args.indexOf('--node');

  const treeName = treeFlag !== -1 ? args[treeFlag + 1] : null;
  const batchSize = batchFlag !== -1 ? parseInt(args[batchFlag + 1]) : 25;
  const targetNode = nodeFlag !== -1 ? args[nodeFlag + 1] : null;

  if (!treeName || !TREE_CONFIG[treeName]) {
    console.log('\n📋 Usage: node scripts/generateChallenges.js --tree <name> [--batch <size>] [--node <nodeId>]');
    console.log('\nAvailable trees:', Object.keys(TREE_CONFIG).join(', '));
    console.log('Batch sizes: 25, 50, 100 (default: 25)');
    console.log('\nExamples:');
    console.log('  node scripts/generateChallenges.js --tree frontend --batch 25');
    console.log('  node scripts/generateChallenges.js --tree algorithms --node algo-dp --batch 50');
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not set in .env');
    process.exit(1);
  }

  const tree = TREE_CONFIG[treeName];
  const nodes = targetNode ? tree.nodes.filter(n => n.nodeId === targetNode) : tree.nodes;

  if (nodes.length === 0) {
    console.error(`❌ Node "${targetNode}" not found in ${treeName}`);
    process.exit(1);
  }

  // Ensure output dir
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\n🚀 DevArena Challenge Generator`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Tree:       ${treeName}`);
  console.log(`Batch size: ${batchSize} per node`);
  console.log(`Nodes:      ${nodes.map(n => n.nodeId).join(', ')}`);
  console.log(`Output:     ${OUTPUT_DIR}\n`);

  let totalGenerated = 0;

  for (const node of nodes) {
    const fileName = `${treeName}-${node.nodeId.replace(/^[a-z]+-/, '')}.json`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // Load existing file if present
    let existing = [];
    if (fs.existsSync(filePath)) {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`📂 Loaded ${existing.length} existing challenges from ${fileName}`);
    }

    console.log(`\n🌿 Generating for: ${node.title} (${node.nodeId}, Tier ${node.tier})`);

    // Generate in sub-batches of 10 to avoid Gemini truncation
    const subBatchSize = Math.min(batchSize, 10);
    const iterations = Math.ceil(batchSize / subBatchSize);
    let batchResults = [];

    for (let i = 0; i < iterations; i++) {
      const remaining = batchSize - batchResults.length;
      const thisCount = Math.min(subBatchSize, remaining);
      if (thisCount <= 0) break;

      console.log(`   📦 Sub-batch ${i + 1}/${iterations} (${thisCount} challenges)...`);
      const generated = await generateBatch(node, tree.category, thisCount);
      batchResults.push(...generated);

      // Rate limit between calls
      if (i < iterations - 1) await sleep(2000);
    }

    // Deduplicate against existing
    const unique = deduplicateChallenges(existing, batchResults);
    const merged = [...existing, ...unique];

    // Save
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`   💾 Saved ${merged.length} total challenges to ${fileName} (+${unique.length} new)`);
    totalGenerated += unique.length;

    // Cooldown between nodes
    await sleep(2000);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 Generation complete! ${totalGenerated} new challenges generated.`);
  console.log(`📁 Files saved to: ${OUTPUT_DIR}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
