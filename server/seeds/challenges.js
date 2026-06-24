const challenges = [
  // ═══════════════════ ALGORITHM MASTERY ═══════════════════
  // Tier 1 — Basics
  { title:'Two Sum',slug:'two-sum',difficulty:'beginner',category:'algorithms',tags:['arrays','hash-map'],xpReward:50,
    description:'## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to target.\n\n### Example\n`Input: [2,7,11,15], 9` → `Output: [0,1]`',
    starterCode:{javascript:'function twoSum(nums, target) {\n  // Your code here\n}',python:'def two_sum(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[2,7,11,15], 9',expectedOutput:'[0,1]',isHidden:false},{input:'[3,2,4], 6',expectedOutput:'[1,2]',isHidden:false},{input:'[3,3], 6',expectedOutput:'[0,1]',isHidden:true}],
    hints:['Use a hash map to store seen values']},

  { title:'Contains Duplicate',slug:'contains-duplicate',difficulty:'beginner',category:'algorithms',tags:['arrays','hash-set'],xpReward:50,
    description:'## Contains Duplicate\n\nReturn `true` if any value appears at least twice in the array.\n\n### Example\n`[1,2,3,1]` → `true`',
    starterCode:{javascript:'function containsDuplicate(nums) {\n  // Your code here\n}',python:'def contains_duplicate(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3,1]',expectedOutput:'true',isHidden:false},{input:'[1,2,3,4]',expectedOutput:'false',isHidden:false},{input:'[1,1,1,3,3,4,3,2,4,2]',expectedOutput:'true',isHidden:true}],
    hints:['Use a Set']},

  { title:'Valid Anagram',slug:'valid-anagram',difficulty:'beginner',category:'algorithms',tags:['strings','hash-map'],xpReward:50,
    description:'## Valid Anagram\n\nReturn `true` if `t` is an anagram of `s`.\n\n### Example\n`"anagram", "nagaram"` → `true`',
    starterCode:{javascript:'function isAnagram(s, t) {\n  // Your code here\n}',python:'def is_anagram(s, t):\n    # Your code here\n    pass'},
    testCases:[{input:'"anagram", "nagaram"',expectedOutput:'true',isHidden:false},{input:'"rat", "car"',expectedOutput:'false',isHidden:false}],
    hints:['Count character frequencies']},

  { title:'Single Number',slug:'single-number',difficulty:'beginner',category:'algorithms',tags:['arrays','bit-manipulation'],xpReward:50,
    description:'## Single Number\n\nEvery element appears twice except one. Find the single one.\n\n### Example\n`[4,1,2,1,2]` → `4`',
    starterCode:{javascript:'function singleNumber(nums) {\n  // Your code here\n}',python:'def single_number(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[2,2,1]',expectedOutput:'1',isHidden:false},{input:'[4,1,2,1,2]',expectedOutput:'4',isHidden:false}],
    hints:['XOR cancels duplicates']},

  // Tier 2 — Searching
  { title:'Binary Search',slug:'binary-search',difficulty:'intermediate',category:'algorithms',tags:['searching','binary-search'],xpReward:100,
    description:'## Binary Search\n\nGiven sorted array `nums` and `target`, return index or -1.\n\n### Example\n`[-1,0,3,5,9,12], 9` → `4`',
    starterCode:{javascript:'function binarySearch(nums, target) {\n  // Your code here\n}',python:'def binary_search(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[-1,0,3,5,9,12], 9',expectedOutput:'4',isHidden:false},{input:'[-1,0,3,5,9,12], 2',expectedOutput:'-1',isHidden:false},{input:'[5], 5',expectedOutput:'0',isHidden:true}],
    hints:['Use left and right pointers']},

  // Tier 2 — Sorting
  { title:'Sort Array',slug:'sort-array',difficulty:'intermediate',category:'algorithms',tags:['sorting','merge-sort'],xpReward:100,
    description:'## Sort an Array\n\nSort the array in ascending order.\n\n### Example\n`[5,2,3,1]` → `[1,2,3,5]`',
    starterCode:{javascript:'function sortArray(nums) {\n  // Your code here\n}',python:'def sort_array(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[5,2,3,1]',expectedOutput:'[1,2,3,5]',isHidden:false},{input:'[5,1,1,2,0,0]',expectedOutput:'[0,0,1,1,2,5]',isHidden:false}],
    hints:['Merge sort is O(n log n)']},

  // Tier 3 — Recursion
  { title:'Generate Parentheses',slug:'generate-parentheses',difficulty:'advanced',category:'algorithms',tags:['recursion','backtracking'],xpReward:200,
    description:'## Generate Parentheses\n\nGenerate all valid combinations of `n` pairs of parentheses.\n\n### Example\n`3` → `["((()))","(()())","(())()","()(())","()()()"]`',
    starterCode:{javascript:'function generateParenthesis(n) {\n  // Your code here\n}',python:'def generate_parenthesis(n):\n    # Your code here\n    pass'},
    testCases:[{input:'3',expectedOutput:'["((()))","(()())","(())()","()(())","()()()"]',isHidden:false},{input:'1',expectedOutput:'["()"]',isHidden:false}],
    hints:['Use backtracking with open/close counts']},

  // Tier 4 — DP
  { title:'Climbing Stairs',slug:'climbing-stairs',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming','math'],xpReward:200,
    description:'## Climbing Stairs\n\nYou can climb 1 or 2 steps. How many distinct ways to reach the top?\n\n### Example\n`3` → `3`',
    starterCode:{javascript:'function climbStairs(n) {\n  // Your code here\n}',python:'def climb_stairs(n):\n    # Your code here\n    pass'},
    testCases:[{input:'2',expectedOutput:'2',isHidden:false},{input:'3',expectedOutput:'3',isHidden:false},{input:'5',expectedOutput:'8',isHidden:true}],
    hints:['Fibonacci pattern: f(n) = f(n-1) + f(n-2)']},

  { title:'Maximum Subarray',slug:'maximum-subarray',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming','arrays'],xpReward:200,
    description:'## Maximum Subarray\n\nFind the subarray with the largest sum.\n\n### Example\n`[-2,1,-3,4,-1,2,1,-5,4]` → `6`',
    starterCode:{javascript:'function maxSubArray(nums) {\n  // Your code here\n}',python:'def max_sub_array(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[-2,1,-3,4,-1,2,1,-5,4]',expectedOutput:'6',isHidden:false},{input:'[1]',expectedOutput:'1',isHidden:false},{input:'[5,4,-1,7,8]',expectedOutput:'23',isHidden:true}],
    hints:["Kadane's Algorithm"]},

  // Tier 4 — Graphs
  { title:'Number of Islands',slug:'number-of-islands',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Number of Islands\n\nGiven a 2D grid of `1`s (land) and `0`s (water), count the number of islands.\n\n### Example\n`[[1,1,0],[1,0,0],[0,0,1]]` → `2`',
    starterCode:{javascript:'function numIslands(grid) {\n  // Your code here\n}',python:'def num_islands(grid):\n    # Your code here\n    pass'},
    testCases:[{input:'[["1","1","0"],["1","0","0"],["0","0","1"]]',expectedOutput:'2',isHidden:false},{input:'[["1","1","1"],["0","1","0"],["1","1","1"]]',expectedOutput:'1',isHidden:true}],
    hints:['DFS/BFS to mark visited land']},

  // Tier 5 — Expert
  { title:'LRU Cache',slug:'lru-cache',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','design'],xpReward:300,
    description:'## LRU Cache\n\nImplement a function that simulates LRU cache operations. Given capacity and operations array, return get results.\n\n### Example\n`2, [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]` → `[1,-1]`',
    starterCode:{javascript:'function lruCache(capacity, operations) {\n  // Your code here\n}',python:'def lru_cache(capacity, operations):\n    # Your code here\n    pass'},
    testCases:[{input:'2, [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]',expectedOutput:'[1,-1]',isHidden:false}],
    hints:['Use a Map for O(1) access + track insertion order']},

  // ═══════════════════ FRONTEND ENGINEERING ═══════════════════
  // Tier 1
  { title:'Reverse String',slug:'reverse-string',difficulty:'beginner',category:'frontend',tags:['html-css-layouts','strings'],xpReward:50,
    description:'## Reverse String\n\nReverse an array of characters.\n\n### Example\n`["h","e","l","l","o"]` → `["o","l","l","e","h"]`',
    starterCode:{javascript:'function reverseString(s) {\n  // Your code here\n}',python:'def reverse_string(s):\n    # Your code here\n    pass'},
    testCases:[{input:'["h","e","l","l","o"]',expectedOutput:'["o","l","l","e","h"]',isHidden:false},{input:'["H","a","n"]',expectedOutput:'["n","a","H"]',isHidden:false}],
    hints:['Two pointers swap']},

  { title:'Palindrome Check',slug:'palindrome-check',difficulty:'beginner',category:'frontend',tags:['js-dom-manipulation','strings'],xpReward:50,
    description:'## Palindrome Check\n\nReturn `true` if the string reads the same backward.\n\n### Example\n`"racecar"` → `true`',
    starterCode:{javascript:'function isPalindrome(s) {\n  // Your code here\n}',python:'def is_palindrome(s):\n    # Your code here\n    pass'},
    testCases:[{input:'"racecar"',expectedOutput:'true',isHidden:false},{input:'"hello"',expectedOutput:'false',isHidden:false}],
    hints:['Compare string with its reverse']},

  // Tier 2
  { title:'Debounce Function',slug:'debounce-function',difficulty:'intermediate',category:'frontend',tags:['hooks','closures'],xpReward:100,
    description:'## Debounce\n\nReturn the delay value passed in (simplified debounce concept).\n\n### Example\n`300` → `300`',
    starterCode:{javascript:'function debounce(delay) {\n  // Your code here\n}',python:'def debounce(delay):\n    # Your code here\n    pass'},
    testCases:[{input:'300',expectedOutput:'300',isHidden:false},{input:'500',expectedOutput:'500',isHidden:false}],
    hints:['Return the delay']},

  // Tier 3
  { title:'Flatten Nested Array',slug:'flatten-nested-array',difficulty:'advanced',category:'frontend',tags:['state-management','recursion'],xpReward:200,
    description:'## Flatten Array\n\nFlatten a nested array to given depth.\n\n### Example\n`[1,[2,[3,[4]]]], 2` → `[1,2,3,[4]]`',
    starterCode:{javascript:'function flattenArray(arr, depth) {\n  // Your code here\n}',python:'def flatten_array(arr, depth):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,[2,[3,[4]]]], 1',expectedOutput:'[1,2,[3,[4]]]',isHidden:false},{input:'[1,[2,[3,[4]]]], 2',expectedOutput:'[1,2,3,[4]]',isHidden:false}],
    hints:['Recursive flatten with depth counter']},

  // Tier 4
  { title:'Deep Clone Object',slug:'deep-clone-object',difficulty:'advanced',category:'frontend',tags:['performance','web-apis'],xpReward:200,
    description:'## Deep Clone\n\nCreate a deep clone of a nested object.\n\n### Example\n`{"a":1,"b":{"c":2}}` → `{"a":1,"b":{"c":2}}`',
    starterCode:{javascript:'function deepClone(obj) {\n  // Your code here\n}',python:'def deep_clone(obj):\n    # Your code here\n    pass'},
    testCases:[{input:'{"a":1,"b":{"c":2}}',expectedOutput:'{"a":1,"b":{"c":2}}',isHidden:false}],
    hints:['Recursively copy nested objects']},

  // Tier 5
  { title:'Event Emitter',slug:'event-emitter',difficulty:'expert',category:'frontend',tags:['system-ui','design-patterns'],xpReward:300,
    description:'## Event Emitter\n\nReturn the number of listeners registered for the given event count.\n\n### Example\n`3` → `3`',
    starterCode:{javascript:'function eventEmitterCount(n) {\n  return n;\n}',python:'def event_emitter_count(n):\n    return n'},
    testCases:[{input:'3',expectedOutput:'3',isHidden:false},{input:'0',expectedOutput:'0',isHidden:false}],
    hints:['Track listeners in a map']},

  // ═══════════════════ BACKEND ENGINEERING ═══════════════════
  // Tier 1
  { title:'HTTP Status Codes',slug:'http-status-codes',difficulty:'beginner',category:'backend',tags:['crud-apis','http'],xpReward:50,
    description:'## HTTP Status\n\nReturn the HTTP status code for "Not Found".\n\n### Example\n`"Not Found"` → `404`',
    starterCode:{javascript:'function getStatusCode(status) {\n  // Your code here\n}',python:'def get_status_code(status):\n    # Your code here\n    pass'},
    testCases:[{input:'"Not Found"',expectedOutput:'404',isHidden:false},{input:'"OK"',expectedOutput:'200',isHidden:false},{input:'"Internal Server Error"',expectedOutput:'500',isHidden:true}],
    hints:['Use a lookup map']},

  { title:'Parse Query String',slug:'parse-query-string',difficulty:'beginner',category:'backend',tags:['middleware-logic','parsing'],xpReward:50,
    description:'## Parse Query String\n\nParse `"a=1&b=2"` into `{"a":"1","b":"2"}`.\n\n### Example\n`"a=1&b=2"` → `{"a":"1","b":"2"}`',
    starterCode:{javascript:'function parseQuery(qs) {\n  // Your code here\n}',python:'def parse_query(qs):\n    # Your code here\n    pass'},
    testCases:[{input:'"a=1&b=2"',expectedOutput:'{"a":"1","b":"2"}',isHidden:false},{input:'"x=hello"',expectedOutput:'{"x":"hello"}',isHidden:false}],
    hints:['Split by & then by =']},

  // Tier 2
  { title:'JWT Payload Decode',slug:'jwt-payload-decode',difficulty:'intermediate',category:'backend',tags:['authentication-basics','jwt'],xpReward:100,
    description:'## JWT Parts\n\nReturn the number of parts in a JWT token string.\n\n### Example\n`"header.payload.signature"` → `3`',
    starterCode:{javascript:'function jwtParts(token) {\n  // Your code here\n}',python:'def jwt_parts(token):\n    # Your code here\n    pass'},
    testCases:[{input:'"header.payload.signature"',expectedOutput:'3',isHidden:false},{input:'"a.b.c"',expectedOutput:'3',isHidden:false}],
    hints:['Split by dot']},

  // Tier 3
  { title:'Rate Limiter',slug:'rate-limiter',difficulty:'advanced',category:'backend',tags:['caching','rate-limiting'],xpReward:200,
    description:'## Rate Limiter\n\nGiven max requests and current count, return `true` if request is allowed.\n\n### Example\n`5, 3` → `true`',
    starterCode:{javascript:'function isAllowed(max, current) {\n  // Your code here\n}',python:'def is_allowed(max_req, current):\n    # Your code here\n    pass'},
    testCases:[{input:'5, 3',expectedOutput:'true',isHidden:false},{input:'5, 5',expectedOutput:'false',isHidden:false},{input:'10, 0',expectedOutput:'true',isHidden:true}],
    hints:['Compare current < max']},

  // Tier 4
  { title:'Consistent Hash',slug:'consistent-hash',difficulty:'expert',category:'backend',tags:['load-balancing','microservices'],xpReward:300,
    description:'## Consistent Hashing\n\nGiven servers array and a key number, return which server handles it (modular hash).\n\n### Example\n`["A","B","C"], 7` → `"B"`',
    starterCode:{javascript:'function consistentHash(servers, key) {\n  // Your code here\n}',python:'def consistent_hash(servers, key):\n    # Your code here\n    pass'},
    testCases:[{input:'["A","B","C"], 7',expectedOutput:'"B"',isHidden:false},{input:'["X","Y"], 4',expectedOutput:'"X"',isHidden:false}],
    hints:['key % servers.length']},

  // ═══════════════════ SYSTEM DESIGN ═══════════════════
  // Tier 1
  { title:'Round Robin LB',slug:'round-robin-lb',difficulty:'beginner',category:'system-design',tags:['url-shortener','load-balancing'],xpReward:50,
    description:'## Round Robin\n\nGiven servers and request number n, return which server handles it.\n\n### Example\n`["A","B","C"], 4` → `"B"`',
    starterCode:{javascript:'function roundRobin(servers, n) {\n  // Your code here\n}',python:'def round_robin(servers, n):\n    # Your code here\n    pass'},
    testCases:[{input:'["A","B","C"], 0',expectedOutput:'"A"',isHidden:false},{input:'["A","B","C"], 4',expectedOutput:'"B"',isHidden:false}],
    hints:['n % servers.length']},

  { title:'Base62 Encode',slug:'base62-encode',difficulty:'beginner',category:'system-design',tags:['url-shortener','encoding'],xpReward:50,
    description:'## Base62 Encode\n\nReturn the length of base62 encoding needed for a number.\n\n### Example\n`100` → `2`',
    starterCode:{javascript:'function base62Length(num) {\n  // Your code here\n}',python:'def base62_length(num):\n    # Your code here\n    pass'},
    testCases:[{input:'0',expectedOutput:'1',isHidden:false},{input:'100',expectedOutput:'2',isHidden:false},{input:'62',expectedOutput:'2',isHidden:true}],
    hints:['Divide by 62 repeatedly']},

  // Tier 2
  { title:'Cache Hit Rate',slug:'cache-hit-rate',difficulty:'intermediate',category:'system-design',tags:['chat-system','caching'],xpReward:100,
    description:'## Cache Hit Rate\n\nGiven hits and total requests, return hit rate as percentage (integer).\n\n### Example\n`75, 100` → `75`',
    starterCode:{javascript:'function cacheHitRate(hits, total) {\n  // Your code here\n}',python:'def cache_hit_rate(hits, total):\n    # Your code here\n    pass'},
    testCases:[{input:'75, 100',expectedOutput:'75',isHidden:false},{input:'0, 50',expectedOutput:'0',isHidden:false},{input:'33, 100',expectedOutput:'33',isHidden:true}],
    hints:['Math.floor(hits/total * 100)']},

  // Tier 3
  { title:'Partition Data',slug:'partition-data',difficulty:'advanced',category:'system-design',tags:['news-feed','distributed'],xpReward:200,
    description:'## Data Partitioning\n\nGiven total items and partition count, return items per partition.\n\n### Example\n`100, 3` → `[34,33,33]`',
    starterCode:{javascript:'function partition(total, parts) {\n  // Your code here\n}',python:'def partition(total, parts):\n    # Your code here\n    pass'},
    testCases:[{input:'100, 3',expectedOutput:'[34,33,33]',isHidden:false},{input:'10, 2',expectedOutput:'[5,5]',isHidden:false}],
    hints:['Distribute remainder across first partitions']},

  // Tier 4
  { title:'Sharding Key',slug:'sharding-key',difficulty:'advanced',category:'system-design',tags:['instagram','sharding'],xpReward:200,
    description:'## Shard Selection\n\nGiven a user ID and shard count, return which shard the user belongs to.\n\n### Example\n`12345, 8` → `1`',
    starterCode:{javascript:'function getShard(userId, shardCount) {\n  // Your code here\n}',python:'def get_shard(user_id, shard_count):\n    # Your code here\n    pass'},
    testCases:[{input:'12345, 8',expectedOutput:'1',isHidden:false},{input:'100, 10',expectedOutput:'0',isHidden:false}],
    hints:['userId % shardCount']},

  // Tier 5
  { title:'Bloom Filter Size',slug:'bloom-filter-size',difficulty:'expert',category:'system-design',tags:['search-engine','probabilistic'],xpReward:300,
    description:'## Bloom Filter\n\nGiven n items and false positive rate p (as percentage integer), return optimal bit array size m = ceil(n * 10).\n\n### Example\n`1000, 1` → `10000`',
    starterCode:{javascript:'function bloomFilterSize(n, p) {\n  // Your code here\n}',python:'def bloom_filter_size(n, p):\n    # Your code here\n    pass'},
    testCases:[{input:'1000, 1',expectedOutput:'10000',isHidden:false},{input:'500, 5',expectedOutput:'5000',isHidden:false}],
    hints:['m = ceil(n * 10)']},

  // ═══════════════════ CROSS-CATEGORY BONUS ═══════════════════
  { title:'Best Time to Buy Stock',slug:'best-time-to-buy-stock',difficulty:'intermediate',category:'algorithms',tags:['arrays','dynamic-programming'],xpReward:100,
    description:'## Buy and Sell Stock\n\nMaximize profit from one buy and one sell.\n\n### Example\n`[7,1,5,3,6,4]` → `5`',
    starterCode:{javascript:'function maxProfit(prices) {\n  // Your code here\n}',python:'def max_profit(prices):\n    # Your code here\n    pass'},
    testCases:[{input:'[7,1,5,3,6,4]',expectedOutput:'5',isHidden:false},{input:'[7,6,4,3,1]',expectedOutput:'0',isHidden:false}],
    hints:['Track minimum price seen so far']},

  { title:'Missing Number',slug:'missing-number',difficulty:'intermediate',category:'algorithms',tags:['arrays','math'],xpReward:100,
    description:'## Missing Number\n\nFind the missing number in range [0, n].\n\n### Example\n`[3,0,1]` → `2`',
    starterCode:{javascript:'function missingNumber(nums) {\n  // Your code here\n}',python:'def missing_number(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[3,0,1]',expectedOutput:'2',isHidden:false},{input:'[0,1]',expectedOutput:'2',isHidden:false},{input:'[9,6,4,2,3,5,7,0,1]',expectedOutput:'8',isHidden:true}],
    hints:['Sum formula: n*(n+1)/2']},

  { title:'Product Except Self',slug:'product-except-self',difficulty:'advanced',category:'algorithms',tags:['arrays','prefix-sum'],xpReward:200,
    description:'## Product Except Self\n\nReturn array where each element is product of all others.\n\n### Example\n`[1,2,3,4]` → `[24,12,8,6]`',
    starterCode:{javascript:'function productExceptSelf(nums) {\n  // Your code here\n}',python:'def product_except_self(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3,4]',expectedOutput:'[24,12,8,6]',isHidden:false},{input:'[-1,1,0,-3,3]',expectedOutput:'[0,0,9,0,0]',isHidden:false}],
    hints:['Left products × right products']},
];

module.exports = challenges;
