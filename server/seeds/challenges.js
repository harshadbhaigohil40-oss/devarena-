const challenges = [
  // Beginner Challenges (Arrays, Strings, Hash Maps)
  {
    title: 'Two Sum', slug: 'two-sum',
    description: '## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\n### Constraints\n- Each input would have exactly one solution\n- You may not use the same element twice',
    difficulty: 'beginner', category: 'algorithms', tags: ['arrays', 'hash-map'], xpReward: 50,
    starterCode: { javascript: 'function twoSum(nums, target) {\n  // Your code here\n}', python: 'def two_sum(nums, target):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: true }
    ],
    solution: '...', hints: ['Think about using a hash map']
  },
  {
    title: 'Reverse String', slug: 'reverse-string',
    description: '## Reverse String\n\nWrite a function that reverses an array of characters in-place (for this challenge, just return the reversed array).\n\n### Example\n`Input: ["h","e","l","l","o"]`\n`Output: ["o","l","l","e","h"]`',
    difficulty: 'beginner', category: 'algorithms', tags: ['strings', 'two-pointers'], xpReward: 50,
    starterCode: { javascript: 'function reverseString(s) {\n  // Your code here\n}', python: 'def reverse_string(s):\n    # Your code here\n    pass' },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { input: '["H","a","n"]', expectedOutput: '["n","a","H"]', isHidden: false }
    ],
    hints: ['Use two pointers', 'Swap from both ends']
  },
  {
    title: 'Valid Anagram', slug: 'valid-anagram',
    description: '## Valid Anagram\n\nGiven two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n### Example\n`Input: "anagram", "nagaram"`\n`Output: true`',
    difficulty: 'beginner', category: 'algorithms', tags: ['strings', 'hash-map'], xpReward: 50,
    starterCode: { javascript: 'function isAnagram(s, t) {\n  // Your code here\n}', python: 'def is_anagram(s, t):\n    # Your code here\n    pass' },
    testCases: [
      { input: '"anagram", "nagaram"', expectedOutput: 'true', isHidden: false },
      { input: '"rat", "car"', expectedOutput: 'false', isHidden: false }
    ],
    hints: ['Count character frequencies']
  },
  {
    title: 'Contains Duplicate', slug: 'contains-duplicate',
    description: '## Contains Duplicate\n\nGiven an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.\n\n### Example\n`Input: [1,2,3,1]`\n`Output: true`',
    difficulty: 'beginner', category: 'algorithms', tags: ['arrays', 'hash-set'], xpReward: 50,
    starterCode: { javascript: 'function containsDuplicate(nums) {\n  // Your code here\n}', python: 'def contains_duplicate(nums):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: 'true', isHidden: false },
      { input: '[1,2,3,4]', expectedOutput: 'false', isHidden: false }
    ],
    hints: ['A Set data structure can be very helpful here']
  },
  {
    title: 'Single Number', slug: 'single-number',
    description: '## Single Number\n\nGiven a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\nYou must implement a solution with a linear runtime complexity and use only constant extra space.\n\n### Example\n`Input: [4,1,2,1,2]`\n`Output: 4`',
    difficulty: 'beginner', category: 'algorithms', tags: ['arrays', 'bit-manipulation'], xpReward: 50,
    starterCode: { javascript: 'function singleNumber(nums) {\n  // Your code here\n}', python: 'def single_number(nums):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[2,2,1]', expectedOutput: '1', isHidden: false },
      { input: '[4,1,2,1,2]', expectedOutput: '4', isHidden: false }
    ],
    hints: ['Consider XOR bitwise operation']
  },

  // Intermediate Challenges
  {
    title: 'Maximum Subarray', slug: 'maximum-subarray',
    description: '## Maximum Subarray\n\nGiven an integer array `nums`, find the subarray which has the largest sum and return its sum.\n\n### Example\n`Input: [-2,1,-3,4,-1,2,1,-5,4]`\n`Output: 6` (subarray [4,-1,2,1] has the largest sum = 6)',
    difficulty: 'intermediate', category: 'algorithms', tags: ['arrays', 'dynamic-programming'], xpReward: 100,
    starterCode: { javascript: 'function maxSubArray(nums) {\n  // Your code here\n}', python: 'def max_sub_array(nums):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { input: '[1]', expectedOutput: '1', isHidden: false },
      { input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true }
    ],
    hints: ['Kadane\'s Algorithm is the best approach']
  },
  {
    title: 'Climbing Stairs', slug: 'climbing-stairs',
    description: '## Climbing Stairs\n\nYou are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n### Example\n`Input: n = 3`\n`Output: 3`',
    difficulty: 'intermediate', category: 'algorithms', tags: ['math', 'dynamic-programming'], xpReward: 100,
    starterCode: { javascript: 'function climbStairs(n) {\n  // Your code here\n}', python: 'def climb_stairs(n):\n    # Your code here\n    pass' },
    testCases: [
      { input: '2', expectedOutput: '2', isHidden: false },
      { input: '3', expectedOutput: '3', isHidden: false },
      { input: '5', expectedOutput: '8', isHidden: true }
    ],
    hints: ['This is closely related to the Fibonacci sequence']
  },
  {
    title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock',
    description: '## Best Time to Buy and Sell Stock\n\nYou are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\nReturn the maximum profit you can achieve. If you cannot achieve any profit, return 0.\n\n### Example\n`Input: [7,1,5,3,6,4]`\n`Output: 5` (Buy on day 2 at price 1, sell on day 5 at price 6)',
    difficulty: 'intermediate', category: 'algorithms', tags: ['arrays', 'dynamic-programming'], xpReward: 100,
    starterCode: { javascript: 'function maxProfit(prices) {\n  // Your code here\n}', python: 'def max_profit(prices):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false },
      { input: '[7,6,4,3,1]', expectedOutput: '0', isHidden: false }
    ],
    hints: ['Track the minimum price seen so far']
  },
  {
    title: 'Missing Number', slug: 'missing-number',
    description: '## Missing Number\n\nGiven an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n### Example\n`Input: [3,0,1]`\n`Output: 2`',
    difficulty: 'intermediate', category: 'algorithms', tags: ['arrays', 'math', 'bit-manipulation'], xpReward: 100,
    starterCode: { javascript: 'function missingNumber(nums) {\n  // Your code here\n}', python: 'def missing_number(nums):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[3,0,1]', expectedOutput: '2', isHidden: false },
      { input: '[0,1]', expectedOutput: '2', isHidden: false },
      { input: '[9,6,4,2,3,5,7,0,1]', expectedOutput: '8', isHidden: true }
    ],
    hints: ['Can you use the mathematical formula for the sum of the first N numbers?']
  },

  // Advanced Challenges
  {
    title: 'Find the Duplicate Number', slug: 'find-the-duplicate-number',
    description: '## Find the Duplicate Number\n\nGiven an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.\nThere is only one repeated number in `nums`, return this repeated number.\nYou must solve the problem without modifying the array `nums` and uses only constant extra space.\n\n### Example\n`Input: [1,3,4,2,2]`\n`Output: 2`',
    difficulty: 'advanced', category: 'algorithms', tags: ['arrays', 'two-pointers', 'binary-search'], xpReward: 200,
    starterCode: { javascript: 'function findDuplicate(nums) {\n  // Your code here\n}', python: 'def find_duplicate(nums):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[1,3,4,2,2]', expectedOutput: '2', isHidden: false },
      { input: '[3,1,3,4,2]', expectedOutput: '3', isHidden: false }
    ],
    hints: ['Can you think of this array as a Linked List and detect a cycle?', 'Floyd\'s Tortoise and Hare algorithm']
  },
  {
    title: 'Product of Array Except Self', slug: 'product-of-array-except-self',
    description: '## Product of Array Except Self\n\nGiven an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.\n\n### Example\n`Input: [1,2,3,4]`\n`Output: [24,12,8,6]`',
    difficulty: 'advanced', category: 'algorithms', tags: ['arrays', 'prefix-sum'], xpReward: 200,
    starterCode: { javascript: 'function productExceptSelf(nums) {\n  // Your code here\n}', python: 'def product_except_self(nums):\n    # Your code here\n    pass' },
    testCases: [
      { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', isHidden: false },
      { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]', isHidden: false }
    ],
    hints: ['Calculate left products and right products separately']
  },

  // Frontend Challenges
  {
    title: 'CSS Flexbox Centering', slug: 'css-flexbox-centering',
    description: '## Center a Div\n\nWrite a CSS snippet that perfectly centers a child div inside a parent div using Flexbox.',
    difficulty: 'beginner', category: 'frontend', tags: ['css', 'flexbox'], xpReward: 50,
    starterCode: { javascript: 'function centerDiv() {\n  return "display: flex; justify-content: center; align-items: center;";\n}', python: 'def center_div():\n    return "display: flex; justify-content: center; align-items: center;"' },
    testCases: [ { input: '""', expectedOutput: '"display: flex; justify-content: center; align-items: center;"', isHidden: false } ],
    hints: ['justify-content and align-items are your friends']
  },
  {
    title: 'React useState Hook', slug: 'react-usestate-hook',
    description: '## React Counter\n\nReturn a string representation of a simple React counter component using useState.',
    difficulty: 'intermediate', category: 'frontend', tags: ['react', 'hooks'], xpReward: 100,
    starterCode: { javascript: 'function getCounterCode() {\n  return "const [count, setCount] = useState(0);";\n}', python: 'def get_counter_code():\n    return "const [count, setCount] = useState(0);"' },
    testCases: [ { input: '""', expectedOutput: '"const [count, setCount] = useState(0);"', isHidden: false } ],
    hints: ['useState returns an array with state and setter']
  },

  // Backend Challenges
  {
    title: 'Node.js Express Route', slug: 'nodejs-express-route',
    description: '## Simple GET Route\n\nReturn the code string to create a simple GET route in Express.js that returns "Hello World".',
    difficulty: 'beginner', category: 'backend', tags: ['nodejs', 'express'], xpReward: 50,
    starterCode: { javascript: 'function getExpressRoute() {\n  return "app.get(\'/\', (req, res) => res.send(\'Hello World\'));";\n}', python: 'def get_express_route():\n    return "app.get(\'/\', (req, res) => res.send(\'Hello World\'));"' },
    testCases: [ { input: '""', expectedOutput: '"app.get(\'/\', (req, res) => res.send(\'Hello World\'));"', isHidden: false } ],
    hints: ['app.get(path, handler)']
  },
  {
    title: 'SQL Inner Join', slug: 'sql-inner-join',
    description: '## SQL Inner Join\n\nReturn a SQL query string that selects all columns from users and orders using an INNER JOIN on user_id.',
    difficulty: 'intermediate', category: 'backend', tags: ['sql', 'database'], xpReward: 100,
    starterCode: { javascript: 'function getJoinQuery() {\n  return "SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;";\n}', python: 'def get_join_query():\n    return "SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;"' },
    testCases: [ { input: '""', expectedOutput: '"SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;"', isHidden: false } ],
    hints: ['INNER JOIN table ON condition']
  },

  // System Design Challenges
  {
    title: 'Load Balancing Strategy', slug: 'load-balancing-strategy',
    description: '## Round Robin\n\nWrite a function that simulates Round Robin load balancing. Given an array of servers `["A", "B", "C"]` and a request number `n`, return the server that should handle the request.',
    difficulty: 'beginner', category: 'system-design', tags: ['load-balancing', 'architecture'], xpReward: 50,
    starterCode: { javascript: 'function roundRobin(servers, n) {\n  return servers[n % servers.length];\n}', python: 'def round_robin(servers, n):\n    return servers[n % len(servers)]' },
    testCases: [
      { input: '["A", "B", "C"], 0', expectedOutput: '"A"', isHidden: false },
      { input: '["A", "B", "C"], 4', expectedOutput: '"B"', isHidden: false }
    ],
    hints: ['Use the modulo operator']
  },
  {
    title: 'CAP Theorem Basics', slug: 'cap-theorem-basics',
    description: '## CAP Theorem\n\nReturn the two properties of the CAP theorem that a NoSQL database like MongoDB prioritizes when partitioning occurs.',
    difficulty: 'intermediate', category: 'system-design', tags: ['databases', 'cap'], xpReward: 100,
    starterCode: { javascript: 'function capPriorities() {\n  return "Consistency and Partition Tolerance";\n}', python: 'def cap_priorities():\n    return "Consistency and Partition Tolerance"' },
    testCases: [ { input: '""', expectedOutput: '"Consistency and Partition Tolerance"', isHidden: false } ],
    hints: ['MongoDB is typically CP']
  }
];

const generateMassiveChallenges = () => {
  const allChallenges = [...challenges];

  const topics = {
    'algorithms': ['Binary Tree', 'Graph Traversal', 'Dynamic Programming', 'Sliding Window', 'Two Pointers', 'Merge Sort', 'Hash Map', 'Trie', 'Heap', 'Backtracking'],
    'frontend': ['React State', 'CSS Grid', 'Flexbox', 'DOM Manipulation', 'Web Performance', 'Accessibility', 'Redux', 'Vue.js Basics', 'WebSockets UI', 'Canvas API'],
    'backend': ['REST API Design', 'GraphQL', 'JWT Auth', 'SQL Joins', 'NoSQL Indexing', 'Redis Caching', 'Docker Containers', 'Microservices', 'Rate Limiting', 'Cron Jobs'],
    'system-design': ['Database Sharding', 'Load Balancing', 'Message Queues', 'Content Delivery Network (CDN)', 'CAP Theorem', 'Leader Election', 'Data Replication', 'API Gateway', 'Event Sourcing', 'Distributed Locks']
  };

  const actionVerbs = ['Implement', 'Design', 'Optimize', 'Build', 'Refactor', 'Debug', 'Create', 'Analyze'];

  Object.keys(topics).forEach(category => {
    const baseForCategory = challenges.filter(c => c.category === category);
    if (baseForCategory.length === 0) return;
    
    let count = baseForCategory.length;
    
    while (count < 100) {
      const template = baseForCategory[count % baseForCategory.length];
      const topic = topics[category][count % topics[category].length];
      const verb = actionVerbs[count % actionVerbs.length];
      
      const newTitle = `${verb} ${topic} - Level ${count + 1}`;
      
      allChallenges.push({
        ...template,
        title: newTitle,
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `## ${newTitle}\n\nYour task is to ${verb.toLowerCase()} a solution related to **${topic}**.\n\n### Requirements\n- Ensure optimal performance.\n- Handle edge cases properly.\n- Follow best practices for ${category}.`,
        difficulty: count < 30 ? 'beginner' : (count < 70 ? 'intermediate' : 'advanced'),
        xpReward: count < 30 ? 50 : (count < 70 ? 100 : 200),
      });
      count++;
    }
  });
  
  return allChallenges;
};

module.exports = generateMassiveChallenges();
