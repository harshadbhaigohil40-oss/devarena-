// Test the JS compiler locally without needing the server running
const vm = require('vm');

function parseArgs(inputStr) {
  if (!inputStr || inputStr.trim() === '""' || inputStr.trim() === "''") return [];
  const wrapped = `[${inputStr}]`;
  try {
    return JSON.parse(wrapped);
  } catch (_) {
    try {
      const sandbox = { Math, String, Number, Array, Object };
      vm.createContext(sandbox);
      return vm.runInContext(`(function(){ return [${inputStr}]; })()`, sandbox, { timeout: 500 });
    } catch (_2) {
      return [inputStr];
    }
  }
}

function evaluateJS(code, testCases, category, starterCode) {
  return testCases.map((tc, index) => {
    try {
      const sandbox = {
        console: { log: () => {} },
        Math, String, Number, Boolean, Array, Object, Set, Map,
        parseInt, parseFloat, isNaN, isFinite, JSON,
        Promise, setTimeout: () => {}, Buffer,
        require: () => ({})
      };
      vm.createContext(sandbox);

      let functionName = '';
      const sources = [starterCode, code].filter(Boolean);
      for (const src of sources) {
        const m = src.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/) ||
                  src.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:function|\()/) ||
                  src.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{/);
        if (m) { functionName = m[1]; break; }
      }

      const args = parseArgs(tc.input);

      const runner = functionName
        ? `${code}
(function __runner__() {
  const __fn__ = typeof ${functionName} === 'function' ? ${functionName} : (new ${functionName}());
  return __fn__(${args.map((_, i) => `__args__[${i}]`).join(', ')});
})()`
        : code;

      vm.runInContext(`var __args__ = ${JSON.stringify(args)};`, sandbox, { timeout: 500 });
      const script = new vm.Script(runner);
      const rawResult = script.runInContext(sandbox, { timeout: 2000 });

      const resultStr = rawResult === undefined ? 'undefined' : JSON.stringify(rawResult);
      const normalizedResult = resultStr.replace(/\s+/g, '');
      const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
      const passed = normalizedResult === normalizedExpected;

      return { passed, expected: tc.expectedOutput, got: resultStr, input: tc.input };
    } catch (e) {
      return { passed: false, expected: tc.expectedOutput, got: 'ERROR', input: tc.input, error: e.message };
    }
  });
}

// ──────────────────────────────────────────────────────
// Test cases: simulate solving each challenge correctly
// ──────────────────────────────────────────────────────
const tests = [
  {
    name: 'Two Sum',
    starter: 'function twoSum(nums, target) {\n  // Your code here\n}',
    solution: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map[diff] !== undefined) return [map[diff], i];
    map[nums[i]] = i;
  }
}`,
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' },
    ],
  },
  {
    name: 'Contains Duplicate',
    starter: 'function containsDuplicate(nums) {\n  // Your code here\n}',
    solution: `function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}`,
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: 'true' },
      { input: '[1,2,3,4]', expectedOutput: 'false' },
    ],
  },
  {
    name: 'Valid Anagram',
    starter: 'function isAnagram(s, t) {\n  // Your code here\n}',
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) { count[c] = (count[c] || 0) - 1; if (count[c] < 0) return false; }
  return true;
}`,
    testCases: [
      { input: '"anagram", "nagaram"', expectedOutput: 'true' },
      { input: '"rat", "car"', expectedOutput: 'false' },
    ],
  },
  {
    name: 'Single Number',
    starter: 'function singleNumber(nums) {\n  // Your code here\n}',
    solution: `function singleNumber(nums) {
  return nums.reduce((a, b) => a ^ b, 0);
}`,
    testCases: [
      { input: '[2,2,1]', expectedOutput: '1' },
      { input: '[4,1,2,1,2]', expectedOutput: '4' },
    ],
  },
  {
    name: 'Binary Search',
    starter: 'function binarySearch(nums, target) {\n  // Your code here\n}',
    solution: `function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`,
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' },
    ],
  },
  {
    name: 'HTTP Status Codes',
    starter: 'function getStatusCode(status) {\n  // Your code here\n}',
    solution: `function getStatusCode(status) {
  const map = {"Not Found": 404, "OK": 200, "Internal Server Error": 500};
  return map[status];
}`,
    testCases: [
      { input: '"Not Found"', expectedOutput: '404' },
      { input: '"OK"', expectedOutput: '200' },
      { input: '"Internal Server Error"', expectedOutput: '500' },
    ],
  },
  {
    name: 'Maximum Subarray',
    starter: 'function maxSubArray(nums) {\n  // Your code here\n}',
    solution: `function maxSubArray(nums) {
  let max = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}`,
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
    ],
  },
  {
    name: 'Number of Islands',
    starter: 'function numIslands(grid) {\n  // Your code here\n}',
    solution: `function numIslands(grid) {
  let count = 0;
  function dfs(i, j) {
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] === "0") return;
    grid[i][j] = "0";
    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);
  }
  for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[0].length; j++)
      if (grid[i][j] === "1") { count++; dfs(i,j); }
  return count;
}`,
    testCases: [
      { input: '[["1","1","0"],["1","0","0"],["0","0","1"]]', expectedOutput: '2' },
    ],
  },
];

console.log('═══════════════════════════════════════════');
console.log('  DEVARENA JS COMPILER TEST');
console.log('═══════════════════════════════════════════\n');

let totalPassed = 0, totalFailed = 0;

tests.forEach(test => {
  console.log(`📝 ${test.name}`);
  const results = evaluateJS(test.solution, test.testCases, 'algorithms', test.starter);
  results.forEach((r, i) => {
    if (r.passed) {
      totalPassed++;
      console.log(`  ✅ Test ${i+1}: PASS  (input: ${r.input})`);
    } else {
      totalFailed++;
      console.log(`  ❌ Test ${i+1}: FAIL  (input: ${r.input})`);
      console.log(`     Expected: ${r.expected}`);
      console.log(`     Got:      ${r.got}`);
      if (r.error) console.log(`     Error:    ${r.error}`);
    }
  });
  console.log('');
});

console.log('═══════════════════════════════════════════');
console.log(`  RESULTS: ${totalPassed} passed, ${totalFailed} failed`);
console.log('═══════════════════════════════════════════');
