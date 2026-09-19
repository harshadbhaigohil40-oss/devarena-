/**
 * Tier 2 — JavaScript (38 Topics & Coding Challenges)
 * Node: fe-js
 * Difficulty: Easy / Medium
 */

const feTier2Javascript = [
  // ─── JavaScript Fundamentals & Core (1-10) ───
  {
    id: "fe-tier2-001",
    title: "Reverse an Array",
    slug: "fe-reverse-an-array",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "javascript"],
    xpReward: 50,
    description: `## Reverse an Array

### Description
Reverse a given array in-place or return a new reversed array without using the built-in \`Array.prototype.reverse()\`.

### Learning Objectives
- Use two pointers (left and right) swapping elements towards the center.
- Understand O(n) time and O(1) auxiliary space constraints.

### Example
\`Input: [1, 2, 3, 4, 5]\`
\`Output: [5, 4, 3, 2, 1]\``,
    starterCode: {
      javascript: `function reverseArray(arr) {
  const res = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    res.push(arr[i]);
  }
  return res;
}`,
      python: `def reverse_array(arr):
    return arr[::-1]`
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '[5,4,3,2,1]', isHidden: false },
      { input: '["a", "b", "c"]', expectedOutput: '["c","b","a"]', isHidden: false },
      { input: '[42]', expectedOutput: '[42]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-002",
    title: "Find Maximum Value",
    slug: "fe-find-maximum-value",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "math"],
    xpReward: 50,
    description: `## Find Maximum Value

### Description
Given an array of numbers, return the maximum numeric value.

### Learning Objectives
- Iterate through an array tracking highest seen value.
- Handle negative numbers and single-element arrays properly.

### Example
\`Input: [3, 7, 2, 9, 5]\`
\`Output: 9\``,
    starterCode: {
      javascript: `function findMax(nums) {
  if (nums.length === 0) return null;
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) max = nums[i];
  }
  return max;
}`,
      python: `def find_max(nums):
    if not nums:
        return None
    return max(nums)`
    },
    testCases: [
      { input: '[3, 7, 2, 9, 5]', expectedOutput: '9', isHidden: false },
      { input: '[-10, -3, -50]', expectedOutput: '-3', isHidden: false },
      { input: '[100]', expectedOutput: '100', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-003",
    title: "Remove Duplicates from Array",
    slug: "fe-remove-duplicates",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "hash-set"],
    xpReward: 50,
    description: `## Remove Duplicates from Array

### Description
Given an array containing duplicate primitives, return an array containing only the unique elements in their first-seen order.

### Learning Objectives
- Leverage JavaScript \`Set\` or hash map for O(n) deduplication.

### Example
\`Input: [1, 2, 2, 3, 4, 4, 1]\`
\`Output: [1, 2, 3, 4]\``,
    starterCode: {
      javascript: `function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}`,
      python: `def remove_duplicates(arr):
    seen = set()
    res = []
    for x in arr:
        if x not in seen:
            seen.add(x)
            res.append(x)
    return res`
    },
    testCases: [
      { input: '[1, 2, 2, 3, 4, 4, 1]', expectedOutput: '[1,2,3,4]', isHidden: false },
      { input: '["cat", "dog", "cat"]', expectedOutput: '["cat","dog"]', isHidden: false },
      { input: '[5, 5, 5, 5]', expectedOutput: '[5]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-004",
    title: "Count Character Frequency",
    slug: "fe-count-character-frequency",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Objects",
    category: "frontend",
    tags: ["fe-js", "strings", "hash-map"],
    xpReward: 50,
    description: `## Count Character Frequency

### Description
Given a string, return an object mapping each character to its occurrence count.

### Learning Objectives
- Iterate over string characters and build frequency dictionary.

### Example
\`Input: "frontend"\`
\`Output: { "f": 1, "r": 1, "o": 1, "n": 2, "t": 1, "e": 1, "d": 1 }\``,
    starterCode: {
      javascript: `function countCharFrequency(str) {
  const counts = {};
  for (const ch of str) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}`,
      python: `def count_char_frequency(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    return counts`
    },
    testCases: [
      { input: '"hello"', expectedOutput: '{"h":1,"e":1,"l":2,"o":1}', isHidden: false },
      { input: '"aab"', expectedOutput: '{"a":2,"b":1}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-005",
    title: "Group Objects by Property",
    slug: "fe-group-objects-by-property",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Objects",
    category: "frontend",
    tags: ["fe-js", "objects", "arrays"],
    xpReward: 100,
    description: `## Group Objects by Property

### Description
Given an array of objects and a key name, return an object where keys are the property values and values are arrays of matching objects (equivalent to \`Object.groupBy\`).

### Learning Objectives
- Aggregate array items by categorized property key using \`reduce\`.

### Example
\`Input: [{ role: "admin", name: "Alice" }, { role: "user", name: "Bob" }, { role: "admin", name: "Charlie" }], "role"\`
\`Output: { admin: [{ role: "admin", name: "Alice" }, { role: "admin", name: "Charlie" }], user: [{ role: "user", name: "Bob" }] }\``,
    starterCode: {
      javascript: `function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const val = item[key];
    if (!acc[val]) acc[val] = [];
    acc[val].push(item);
    return acc;
  }, {});
}`,
      python: `def group_by(items, key):
    res = {}
    for item in items:
        val = item.get(key)
        if val not in res:
            res[val] = []
        res[val].append(item)
    return res`
    },
    testCases: [
      { input: '[{"role":"admin","name":"Alice"},{"role":"user","name":"Bob"},{"role":"admin","name":"Charlie"}], "role"', expectedOutput: '{"admin":[{"role":"admin","name":"Alice"},{"role":"admin","name":"Charlie"}],"user":[{"role":"user","name":"Bob"}]}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-006",
    title: "Flatten an Array",
    slug: "fe-flatten-an-array",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "recursion"],
    xpReward: 100,
    description: `## Flatten an Array

### Description
Recursively flatten an arbitrarily nested array of numbers into a flat 1D array without using \`Array.prototype.flat()\`.

### Learning Objectives
- Write recursive array traversal inspecting each element with \`Array.isArray\`.

### Example
\`Input: [1, [2, [3, 4], 5], 6]\`
\`Output: [1, 2, 3, 4, 5, 6]\``,
    starterCode: {
      javascript: `function flatten(arr) {
  let res = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item));
    } else {
      res.push(item);
    }
  }
  return res;
}`,
      python: `def flatten(arr):
    res = []
    for item in arr:
        if isinstance(item, list):
            res.extend(flatten(item))
        else:
            res.append(item)
    return res`
    },
    testCases: [
      { input: '[1, [2, [3, 4], 5], 6]', expectedOutput: '[1,2,3,4,5,6]', isHidden: false },
      { input: '[[[1]]]', expectedOutput: '[1]', isHidden: false },
      { input: '[1, 2, 3]', expectedOutput: '[1,2,3]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-007",
    title: "Find Duplicate Values in Array",
    slug: "fe-find-duplicate-values",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "hash-set"],
    xpReward: 50,
    description: `## Find Duplicate Values in Array

### Description
Return a sorted array of all elements that appear more than once in the input array.

### Learning Objectives
- Track frequencies or visited elements to detect duplicates.

### Example
\`Input: [4, 3, 2, 7, 8, 2, 3, 1]\`
\`Output: [2, 3]\``,
    starterCode: {
      javascript: `function findDuplicates(nums) {
  const seen = new Set();
  const dups = new Set();
  for (const n of nums) {
    if (seen.has(n)) dups.add(n);
    else seen.add(n);
  }
  return Array.from(dups).sort((a, b) => a - b);
}`,
      python: `def find_duplicates(nums):
    seen = set()
    dups = set()
    for n in nums:
        if n in seen:
            dups.add(n)
        else:
            seen.add(n)
    return sorted(list(dups))`
    },
    testCases: [
      { input: '[4, 3, 2, 7, 8, 2, 3, 1]', expectedOutput: '[2,3]', isHidden: false },
      { input: '[1, 1, 2]', expectedOutput: '[1]', isHidden: false },
      { input: '[1, 2, 3]', expectedOutput: '[]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-008",
    title: "Sort Objects by Property",
    slug: "fe-sort-objects-by-property",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Objects",
    category: "frontend",
    tags: ["fe-js", "sorting", "objects"],
    xpReward: 50,
    description: `## Sort Objects by Property

### Description
Given an array of objects, sort them in ascending order based on a specified numeric or string property key without mutating the original array.

### Learning Objectives
- Use \`Array.prototype.sort\` with a comparator function handling strings and numbers.

### Example
\`Input: [{ name: "B", age: 30 }, { name: "A", age: 20 }], "age"\`
\`Output: [{ name: "A", age: 20 }, { name: "B", age: 30 }]\``,
    starterCode: {
      javascript: `function sortByProperty(arr, prop) {
  return [...arr].sort((a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
    return 0;
  });
}`,
      python: `def sort_by_property(arr, prop):
    return sorted(arr, key=lambda x: x.get(prop))`
    },
    testCases: [
      { input: '[{"name":"B","age":30},{"name":"A","age":20}], "age"', expectedOutput: '[{"name":"A","age":20},{"name":"B","age":30}]', isHidden: false },
      { input: '[{"name":"Z"},{"name":"A"}], "name"', expectedOutput: '[{"name":"A"},{"name":"Z"}]', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-009",
    title: "Implement Array Chunking",
    slug: "fe-implement-array-chunking",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "pagination"],
    xpReward: 100,
    description: `## Implement Array Chunking

### Description
Given an array and a chunk \`size\`, divide the array into subarrays of at most \`size\` elements (essential for frontend pagination and batching).

### Learning Objectives
- Slice arrays incrementally into nested chunk groups.

### Example
\`Input: [1, 2, 3, 4, 5], 2\`
\`Output: [[1, 2], [3, 4], [5]]\``,
    starterCode: {
      javascript: `function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}`,
      python: `def chunk_array(arr, size):
    res = []
    for i in range(0, len(arr), size):
        res.append(arr[i:i + size])
    return res`
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5], 2', expectedOutput: '[[1,2],[3,4],[5]]', isHidden: false },
      { input: '[1, 2, 3, 4], 2', expectedOutput: '[[1,2],[3,4]]', isHidden: false },
      { input: '[1, 2, 3], 5', expectedOutput: '[[1,2,3]]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-010",
    title: "Implement Deep Clone",
    slug: "fe-implement-deep-clone",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Objects",
    category: "frontend",
    tags: ["fe-js", "objects", "recursion"],
    xpReward: 100,
    description: `## Implement Deep Clone

### Description
Create a deep copy of a nested object or array such that mutating the clone never impacts the original data structure.

### Learning Objectives
- Differentiate between shallow copying (\`Object.assign\`, spread) and deep recursion.
- Handle nested objects, arrays, and primitive primitives.

### Example
\`Input: { a: 1, b: { c: 2, d: [3, 4] } }\`
\`Output: { a: 1, b: { c: 2, d: [3, 4] } }\``,
    starterCode: {
      javascript: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  const copy = {};
  for (const key of Object.keys(obj)) {
    copy[key] = deepClone(obj[key]);
  }
  return copy;
}`,
      python: `def deep_clone(obj):
    if obj is None or not isinstance(obj, (dict, list)):
        return obj
    if isinstance(obj, list):
        return [deep_clone(x) for x in obj]
    copy = {}
    for k, v in obj.items():
        copy[k] = deep_clone(v)
    return copy`
    },
    testCases: [
      { input: '{"a":1,"b":{"c":2,"d":[3,4]}}', expectedOutput: '{"a":1,"b":{"c":2,"d":[3,4]}}', isHidden: false },
      { input: '[{"x":10},{"y":20}]', expectedOutput: '[{"x":10},{"y":20}]', isHidden: false }
    ]
  },

  // ─── DOM & Browser API Simulators (11-20) ───
  {
    id: "fe-tier2-011",
    title: "Build a Todo App State Reducer",
    slug: "fe-build-todo-app-reducer",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State Management",
    category: "frontend",
    tags: ["fe-js", "todo", "state", "dom"],
    xpReward: 100,
    description: `## Build a Todo App State Reducer

### Description
Manage standard Todo app actions (\`ADD\`, \`TOGGLE\`, \`DELETE\`) immutably.
- \`ADD\`: \`{ type: "ADD", payload: { id, text } }\` adds todo with \`completed: false\`
- \`TOGGLE\`: \`{ type: "TOGGLE", payload: id }\` flips completed boolean
- \`DELETE\`: \`{ type: "DELETE", payload: id }\` removes item

### Learning Objectives
- Implement state reducer with immutable array operations (\`concat\`, \`map\`, \`filter\`).

### Example
\`Input: [], { type: "ADD", payload: { id: 1, text: "Learn React" } }\`
\`Output: [{ id: 1, text: "Learn React", completed: false }]\``,
    starterCode: {
      javascript: `function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { ...action.payload, completed: false }];
    case 'TOGGLE':
      return state.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
}`,
      python: `def todo_reducer(state, action):
    a_type = action.get('type')
    payload = action.get('payload')
    if a_type == 'ADD':
        new_item = dict(payload)
        new_item['completed'] = False
        return state + [new_item]
    elif a_type == 'TOGGLE':
        return [dict(t, completed=not t['completed']) if t['id'] == payload else t for t in state]
    elif a_type == 'DELETE':
        return [t for t in state if t['id'] != payload]
    return state`
    },
    testCases: [
      { input: '[], {"type":"ADD","payload":{"id":1,"text":"Learn React"}}', expectedOutput: '[{"id":1,"text":"Learn React","completed":false}]', isHidden: false },
      { input: '[{"id":1,"text":"Test","completed":false}], {"type":"TOGGLE","payload":1}', expectedOutput: '[{"id":1,"text":"Test","completed":true}]', isHidden: false },
      { input: '[{"id":1,"text":"Test","completed":false}], {"type":"DELETE","payload":1}', expectedOutput: '[]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-012",
    title: "Build a Counter Component State",
    slug: "fe-build-counter-state",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "State Management",
    category: "frontend",
    tags: ["fe-js", "counter", "state"],
    xpReward: 50,
    description: `## Build a Counter Component State

### Description
Implement a bounded counter with step size and min/max limits. Given \`current\`, \`action\` ("increment" | "decrement" | "reset"), \`step\`, \`min\`, and \`max\`, compute next value.

### Learning Objectives
- Handle bounded clamping arithmetic.

### Example
\`Input: 5, "increment", 2, 0, 10\`
\`Output: 7\`
\`Input: 9, "increment", 3, 0, 10\`
\`Output: 10\` (clamped at max)`,
    starterCode: {
      javascript: `function updateCounter(current, action, step, min, max) {
  if (action === 'reset') return 0;
  if (action === 'increment') return Math.min(max, current + step);
  if (action === 'decrement') return Math.max(min, current - step);
  return current;
}`,
      python: `def update_counter(current, action, step, min_val, max_val):
    if action == 'reset':
        return 0
    if action == 'increment':
        return min(max_val, current + step)
    if action == 'decrement':
        return max(min_val, current - step)
    return current`
    },
    testCases: [
      { input: '5, "increment", 2, 0, 10', expectedOutput: '7', isHidden: false },
      { input: '9, "increment", 3, 0, 10', expectedOutput: '10', isHidden: false },
      { input: '2, "decrement", 5, 0, 10', expectedOutput: '0', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-013",
    title: "Build a Stopwatch Time Formatter",
    slug: "fe-build-stopwatch-formatter",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "stopwatch", "time"],
    xpReward: 50,
    description: `## Build a Stopwatch Time Formatter

### Description
Stopwatches format elapsed milliseconds into \`MM:SS.ms\` (2 digits minutes, 2 digits seconds, 2 digits centiseconds).

### Learning Objectives
- Format time units with padding (\`padStart(2, '0')\`).

### Example
\`Input: 65420\` (65.42 seconds)
\`Output: "01:05.42"\``,
    starterCode: {
      javascript: `function formatStopwatch(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  const pad = (n) => String(n).padStart(2, '0');
  return \`\${pad(minutes)}:\${pad(seconds)}.\${pad(centis)}\`;
}`,
      python: `def format_stopwatch(ms):
    minutes = ms // 60000
    seconds = (ms % 60000) // 1000
    centis = (ms % 1000) // 10
    return f'{minutes:02d}:{seconds:02d}.{centis:02d}'`
    },
    testCases: [
      { input: '65420', expectedOutput: '"01:05.42"', isHidden: false },
      { input: '0', expectedOutput: '"00:00.00"', isHidden: false },
      { input: '5000', expectedOutput: '"00:05.00"', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-014",
    title: "Build a Countdown Timer Remaining Calculator",
    slug: "fe-build-countdown-timer",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "timer", "time"],
    xpReward: 50,
    description: `## Build a Countdown Timer Remaining Calculator

### Description
Given target timestamp and current timestamp, compute remaining days, hours, minutes, and seconds: \`{ days, hours, minutes, seconds, isExpired }\`.

### Learning Objectives
- Decompose millisecond differences into standard human time units.

### Example
\`Input: 100000, 0\`
\`Output: { days: 0, hours: 0, minutes: 1, seconds: 40, isExpired: false }\``,
    starterCode: {
      javascript: `function calculateCountdown(targetMs, currentMs) {
  const diff = targetMs - currentMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isExpired: false };
}`,
      python: `def calculate_countdown(target_ms, current_ms):
    diff = target_ms - current_ms
    if diff <= 0:
        return {'days': 0, 'hours': 0, 'minutes': 0, 'seconds': 0, 'isExpired': True}
    days = diff // (1000 * 60 * 60 * 24)
    hours = (diff // (1000 * 60 * 60)) % 24
    minutes = (diff // 1000 // 60) % 60
    seconds = (diff // 1000) % 60
    return {'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds, 'isExpired': False}`
    },
    testCases: [
      { input: '100000, 0', expectedOutput: '{"days":0,"hours":0,"minutes":1,"seconds":40,"isExpired":false}', isHidden: false },
      { input: '500, 1000', expectedOutput: '{"days":0,"hours":0,"minutes":0,"seconds":0,"isExpired":true}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-015",
    title: "Build Tabs Component State Switcher",
    slug: "fe-build-tabs-switcher",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "tabs", "accessibility", "dom"],
    xpReward: 50,
    description: `## Build Tabs Component State Switcher

### Description
A tab navigation panel manages active tab indices, ensuring associated \`tabpanel\` displays while previous panels are hidden. ARIA specifications require \`selected: true\` on active tab and \`hidden: false\` on active panel.

### Learning Objectives
- Update list of tabs and panels marking the active index.

### Example
\`Input: ["Tab 1", "Tab 2"], 1\`
\`Output: { activeIndex: 1, tabs: [{ label: "Tab 1", selected: false }, { label: "Tab 2", selected: true }] }\``,
    starterCode: {
      javascript: `function switchTab(labels, activeIndex) {
  const tabs = labels.map((label, idx) => ({
    label,
    selected: idx === activeIndex
  }));
  return { activeIndex, tabs };
}`,
      python: `def switch_tab(labels, active_index):
    tabs = [{'label': l, 'selected': i == active_index} for i, l in enumerate(labels)]
    return {'activeIndex': active_index, 'tabs': tabs}`
    },
    testCases: [
      { input: '["Tab 1", "Tab 2"], 1', expectedOutput: '{"activeIndex":1,"tabs":[{"label":"Tab 1","selected":false},{"label":"Tab 2","selected":true}]}', isHidden: false },
      { input: '["Overview", "Code", "Reviews"], 0', expectedOutput: '{"activeIndex":0,"tabs":[{"label":"Overview","selected":true},{"label":"Code","selected":false},{"label":"Reviews","selected":false}]}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-016",
    title: "Build an Accordion Multi-Select State",
    slug: "fe-build-accordion-state",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "accordion", "state"],
    xpReward: 50,
    description: `## Build an Accordion Multi-Select State

### Description
Accordions can allow single expansion or multi-expansion. Given open item IDs \`[id1, ...]\`, target \`clickedId\`, and \`allowMultiple\` flag, return updated open IDs array.

### Learning Objectives
- Toggle presence in array or replace entirely based on mode.

### Example
\`Input: ["faq-1"], "faq-2", true\`
\`Output: ["faq-1", "faq-2"]\`
\`Input: ["faq-1"], "faq-2", false\`
\`Output: ["faq-2"]\``,
    starterCode: {
      javascript: `function toggleAccordion(openIds, clickedId, allowMultiple) {
  const isOpen = openIds.includes(clickedId);
  if (allowMultiple) {
    return isOpen ? openIds.filter(id => id !== clickedId) : [...openIds, clickedId];
  } else {
    return isOpen ? [] : [clickedId];
  }
}`,
      python: `def toggle_accordion(open_ids, clicked_id, allow_multiple):
    is_open = clicked_id in open_ids
    if allow_multiple:
        return [i for i in open_ids if i != clicked_id] if is_open else open_ids + [clicked_id]
    else:
        return [] if is_open else [clicked_id]`
    },
    testCases: [
      { input: '["faq-1"], "faq-2", true', expectedOutput: '["faq-1","faq-2"]', isHidden: false },
      { input: '["faq-1"], "faq-2", false', expectedOutput: '["faq-2"]', isHidden: false },
      { input: '["faq-1"], "faq-1", false', expectedOutput: '[]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-017",
    title: "Build a Search Filter Function",
    slug: "fe-build-search-filter",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "search", "filter"],
    xpReward: 50,
    description: `## Build a Search Filter Function

### Description
Given a query string and a list of items, return all items that match the query case-insensitively across multiple fields (e.g. title and tags).

### Learning Objectives
- Filter array elements with normalized substring matching.

### Example
\`Input: [{ title: "React", tags: ["frontend", "ui"] }, { title: "Docker", tags: ["devops"] }], "front"\`
\`Output: [{ title: "React", tags: ["frontend", "ui"] }]\``,
    starterCode: {
      javascript: `function filterItems(items, query) {
  const q = query.toLowerCase().trim();
  if (!q) return items;
  return items.filter(item => {
    const titleMatch = item.title && item.title.toLowerCase().includes(q);
    const tagMatch = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
    return titleMatch || tagMatch;
  });
}`,
      python: `def filter_items(items, query):
    q = query.lower().strip()
    if not q:
        return items
    res = []
    for item in items:
        title_match = 'title' in item and q in item['title'].lower()
        tag_match = 'tags' in item and any(q in t.lower() for t in item['tags'])
        if title_match or tag_match:
            res.append(item)
    return res`
    },
    testCases: [
      { input: '[{"title":"React","tags":["frontend","ui"]},{"title":"Docker","tags":["devops"]}], "front"', expectedOutput: '[{"title":"React","tags":["frontend","ui"]}]', isHidden: false },
      { input: '[{"title":"Node"},{"title":"React"}], "vue"', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-018",
    title: "Build an Image Gallery Carousel Indexer",
    slug: "fe-build-gallery-carousel",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "carousel", "gallery"],
    xpReward: 50,
    description: `## Build an Image Gallery Carousel Indexer

### Description
Circular carousels wrap navigation seamlessly: clicking "next" on the last slide navigates to index 0, and clicking "prev" on slide 0 wraps to \`total - 1\`.

### Learning Objectives
- Implement modulo wrapping: \`(current + dir + total) % total\`.

### Example
\`Input: 0, "prev", 5\`
\`Output: 4\` (0 - 1 wrapped around 5 slides)
\`Input: 4, "next", 5\`
\`Output: 0\``,
    starterCode: {
      javascript: `function navigateCarousel(currentIndex, direction, total) {
  const delta = direction === 'next' ? 1 : -1;
  return (currentIndex + delta + total) % total;
}`,
      python: `def navigate_carousel(current_index, direction, total):
    delta = 1 if direction == 'next' else -1
    return (current_index + delta + total) % total`
    },
    testCases: [
      { input: '0, "prev", 5', expectedOutput: '4', isHidden: false },
      { input: '4, "next", 5', expectedOutput: '0', isHidden: false },
      { input: '2, "next", 5', expectedOutput: '3', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-019",
    title: "Build a Form Schema Validator",
    slug: "fe-build-form-schema-validator",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Forms",
    category: "frontend",
    tags: ["fe-js", "forms", "validation"],
    xpReward: 100,
    description: `## Build a Form Schema Validator

### Description
Validate form data against a declarative schema of field validation rules (e.g. \`required\`, \`minLength\`), returning \`{ isValid, errors }\`.

### Learning Objectives
- Evaluate field constraints against validation schemas.

### Example
\`Input: { username: "a" }, { username: { minLength: 3, message: "Too short" } }\`
\`Output: { isValid: false, errors: { username: "Too short" } }\``,
    starterCode: {
      javascript: `function validateFormSchema(formData, rules) {
  const errors = {};
  for (const field of Object.keys(rules)) {
    const val = formData[field];
    const rule = rules[field];
    if (rule.required && (val === undefined || val === null || val === '')) {
      errors[field] = rule.message || 'Required';
    } else if (rule.minLength && (!val || val.length < rule.minLength)) {
      errors[field] = rule.message || 'Too short';
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}`,
      python: `def validate_form_schema(form_data, rules):
    errors = {}
    for field, rule in rules.items():
        val = form_data.get(field)
        if rule.get('required') and (val is None or val == ''):
            errors[field] = rule.get('message', 'Required')
        elif rule.get('minLength') and (val is None or len(str(val)) < rule['minLength']):
            errors[field] = rule.get('message', 'Too short')
    return {'isValid': len(errors) == 0, 'errors': errors}`
    },
    testCases: [
      { input: '{"username":"okuser"}, {"username":{"minLength":3,"message":"Too short"}}', expectedOutput: '{"isValid":true,"errors":{}}', isHidden: false },
      { input: '{"username":"a"}, {"username":{"minLength":3,"message":"Too short"}}', expectedOutput: '{"isValid":false,"errors":{"username":"Too short"}}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-020",
    title: "Local Storage State Synchronizer",
    slug: "fe-local-storage-sync",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Browser Storage",
    category: "frontend",
    tags: ["fe-js", "storage", "dom"],
    xpReward: 50,
    description: `## Local Storage State Synchronizer

### Description
Browser LocalStorage only stores strings. Serializing and deserializing state requires \`JSON.stringify\` on write and \`JSON.parse\` with fallback on read.

### Learning Objectives
- Safely parse JSON storage string with default fallback value if invalid or null.

### Example
\`Input: "{\\"theme\\":\\"dark\\"}", { theme: "light" }\`
\`Output: { theme: "dark" }\`
\`Input: null, { theme: "light" }\`
\`Output: { theme: "light" }\``,
    starterCode: {
      javascript: `function safeGetStorage(rawStr, fallback) {
  if (!rawStr) return fallback;
  try {
    return JSON.parse(rawStr);
  } catch (e) {
    return fallback;
  }
}`,
      python: `import json

def safe_get_storage(raw_str, fallback):
    if not raw_str:
        return fallback
    try:
        return json.loads(raw_str)
    except Exception:
        return fallback`
    },
    testCases: [
      { input: '"{\\"theme\\":\\"dark\\"}", {"theme":"light"}', expectedOutput: '{"theme":"dark"}', isHidden: false },
      { input: 'null, {"theme":"light"}', expectedOutput: '{"theme":"light"}', isHidden: false },
      { input: '"invalid-json", {"count":0}', expectedOutput: '{"count":0}', isHidden: true }
    ]
  },

  // ─── Asynchronous JavaScript (21-28) ───
  {
    id: "fe-tier2-021",
    title: "Implement Debounce Simulator",
    slug: "fe-implement-debounce",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Closures",
    category: "frontend",
    tags: ["fe-js", "debounce", "closures", "async"],
    xpReward: 100,
    description: `## Implement Debounce Simulator

### Description
Debouncing delays function invocation until a cooldown period has elapsed since the last call. Given a sequence of event call timestamps \`[t1, t2, ...]\` and a \`delay\`, determine timestamps when the debounced function actually fires.

### Learning Objectives
- Model debounce timer cancellations and execution triggers.

### Example
\`Input: [0, 50, 100, 300], 100\`
\`Output: [200, 400]\` (Calls at 0 and 50 are canceled by call at 100 which fires at 100+100=200; call at 300 fires at 300+100=400)`,
    starterCode: {
      javascript: `function simulateDebounce(callTimestamps, delay) {
  const executions = [];
  for (let i = 0; i < callTimestamps.length; i++) {
    const isLastOrSufficientGap = (i === callTimestamps.length - 1) || (callTimestamps[i + 1] - callTimestamps[i] > delay);
    if (isLastOrSufficientGap) {
      executions.push(callTimestamps[i] + delay);
    }
  }
  return executions;
}`,
      python: `def simulate_debounce(call_timestamps, delay):
    executions = []
    n = len(call_timestamps)
    for i in range(n):
        is_last = (i == n - 1)
        if is_last or (call_timestamps[i + 1] - call_timestamps[i] > delay):
            executions.append(call_timestamps[i] + delay)
    return executions`
    },
    testCases: [
      { input: '[0, 50, 100, 300], 100', expectedOutput: '[200,400]', isHidden: false },
      { input: '[0, 200, 400], 50', expectedOutput: '[50,250,450]', isHidden: false },
      { input: '[10, 20, 30], 100', expectedOutput: '[130]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-022",
    title: "Implement Throttle Simulator",
    slug: "fe-implement-throttle",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Closures",
    category: "frontend",
    tags: ["fe-js", "throttle", "closures", "async"],
    xpReward: 100,
    description: `## Implement Throttle Simulator

### Description
Throttling guarantees that a function executes at most once per time window. Given timestamps of incoming events \`[t1, t2, ...]\` and a throttle \`interval\`, return which event timestamps are allowed through.

### Learning Objectives
- Implement leading-edge throttling gating.

### Example
\`Input: [0, 20, 80, 110, 150], 100\`
\`Output: [0, 110]\` (0 fires; 20 and 80 dropped because < 100; 110 fires; 150 dropped because < 210)`,
    starterCode: {
      javascript: `function simulateThrottle(timestamps, interval) {
  if (timestamps.length === 0) return [];
  const allowed = [timestamps[0]];
  let lastFired = timestamps[0];
  for (let i = 1; i < timestamps.length; i++) {
    if (timestamps[i] - lastFired >= interval) {
      allowed.push(timestamps[i]);
      lastFired = timestamps[i];
    }
  }
  return allowed;
}`,
      python: `def simulate_throttle(timestamps, interval):
    if not timestamps:
        return []
    allowed = [timestamps[0]]
    last_fired = timestamps[0]
    for t in timestamps[1:]:
        if t - last_fired >= interval:
            allowed.append(t)
            last_fired = t
    return allowed`
    },
    testCases: [
      { input: '[0, 20, 80, 110, 150], 100', expectedOutput: '[0,110]', isHidden: false },
      { input: '[0, 50, 100, 150, 200], 100', expectedOutput: '[0,100,200]', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-023",
    title: "Implement Promise.all Polyfill Logic",
    slug: "fe-promise-all-polyfill",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Promises",
    category: "frontend",
    tags: ["fe-js", "promises", "async"],
    xpReward: 100,
    description: `## Implement Promise.all Polyfill Logic

### Description
\`Promise.all\` takes an array of promises and resolves when all have completed, or rejects immediately when the first rejection occurs.

### Learning Objectives
- Manage asynchronous concurrency counters.

### Example
\`Input: [1, 2, 3]\`
\`Output: [1, 2, 3]\``,
    starterCode: {
      javascript: `function promiseAllMock(items) {
  return Promise.all(items.map(x => Promise.resolve(x)));
}`,
      python: `def promise_all_mock(items):
    return list(items)`
    },
    testCases: [
      { input: '[1, 2, 3]', expectedOutput: '[1,2,3]', isHidden: false },
      { input: '["a", "b"]', expectedOutput: '["a","b"]', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-024",
    title: "Create a Retry Function Simulator",
    slug: "fe-retry-function-simulator",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Promises",
    category: "frontend",
    tags: ["fe-js", "async", "retry"],
    xpReward: 100,
    description: `## Create a Retry Function Simulator

### Description
Network requests often fail intermittently. A retry simulator executes up to \`maxAttempts\` times before giving up. Given attempt outcomes (e.g. \`["fail", "fail", "success"]\`) and \`maxAttempts\`, return \`{ success: boolean, attempts: number }\`.

### Learning Objectives
- Simulate transient error recovery loops with attempt bounds.

### Example
\`Input: ["fail", "fail", "success"], 3\`
\`Output: { success: true, attempts: 3 }\``,
    starterCode: {
      javascript: `function simulateRetry(outcomes, maxAttempts) {
  let attempts = 0;
  for (const outcome of outcomes) {
    attempts++;
    if (outcome === 'success') {
      return { success: true, attempts };
    }
    if (attempts >= maxAttempts) break;
  }
  return { success: false, attempts };
}`,
      python: `def simulate_retry(outcomes, max_attempts):
    attempts = 0
    for outcome in outcomes:
        attempts += 1
        if outcome == 'success':
            return {'success': True, 'attempts': attempts}
        if attempts >= max_attempts:
            break
    return {'success': False, 'attempts': attempts}`
    },
    testCases: [
      { input: '["fail", "fail", "success"], 3', expectedOutput: '{"success":true,"attempts":3}', isHidden: false },
      { input: '["fail", "fail", "fail"], 2', expectedOutput: '{"success":false,"attempts":2}', isHidden: false },
      { input: '["success"], 3', expectedOutput: '{"success":true,"attempts":1}', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-025",
    title: "Create a Timeout Wrapper Simulator",
    slug: "fe-timeout-wrapper-simulator",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Promises",
    category: "frontend",
    tags: ["fe-js", "async", "timeout"],
    xpReward: 100,
    description: `## Create a Timeout Wrapper Simulator

### Description
If a promise takes longer than \`timeoutMs\` to resolve, the wrapper rejects with a timeout error. Given task duration \`durationMs\` and \`timeoutMs\`, return \`{ timedOut: boolean, resolved: boolean }\`.

### Learning Objectives
- Model \`Promise.race\` against a timer reject.

### Example
\`Input: 200, 100\`
\`Output: { timedOut: true, resolved: false }\``,
    starterCode: {
      javascript: `function simulateTimeout(durationMs, timeoutMs) {
  const timedOut = durationMs > timeoutMs;
  return { timedOut, resolved: !timedOut };
}`,
      python: `def simulate_timeout(duration_ms, timeout_ms):
    timed_out = duration_ms > timeout_ms
    return {'timedOut': timed_out, 'resolved': not timed_out}`
    },
    testCases: [
      { input: '200, 100', expectedOutput: '{"timedOut":true,"resolved":false}', isHidden: false },
      { input: '50, 100', expectedOutput: '{"timedOut":false,"resolved":true}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-026",
    title: "Build an Async Search Filter",
    slug: "fe-build-async-search",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Async",
    category: "frontend",
    tags: ["fe-js", "search", "async"],
    xpReward: 100,
    description: `## Build an Async Search Filter

### Description
In typeahead search, users trigger multiple asynchronous requests. Only results corresponding to the latest query timestamp should be returned, discarding stale results (race condition prevention).

### Learning Objectives
- Track monotonic request sequence IDs to ignore stale responses.

### Example
\`Input: [{ id: 1, query: "re", res: ["react"] }, { id: 2, query: "red", res: ["redux"] }], 2\`
\`Output: ["redux"]\``,
    starterCode: {
      javascript: `function resolveLatestQuery(responses, latestId) {
  const match = responses.find(r => r.id === latestId);
  return match ? match.res : [];
}`,
      python: `def resolve_latest_query(responses, latest_id):
    for r in responses:
        if r.get('id') == latest_id:
            return r.get('res', [])
    return []`
    },
    testCases: [
      { input: '[{"id":1,"query":"re","res":["react"]},{"id":2,"query":"red","res":["redux"]}], 2', expectedOutput: '["redux"]', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-027",
    title: "Build an Autocomplete Trie Matcher",
    slug: "fe-build-autocomplete-matcher",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Strings",
    category: "frontend",
    tags: ["fe-js", "autocomplete", "strings"],
    xpReward: 100,
    description: `## Build an Autocomplete Trie Matcher

### Description
Given a dictionary of search queries and a user prefix, return up to \`limit\` queries that start with the prefix, sorted alphabetically.

### Learning Objectives
- Filter and slice prefix matches efficiently.

### Example
\`Input: ["react", "redux", "refactor", "render", "router"], "re", 3\`
\`Output: ["react", "redux", "refactor"]\``,
    starterCode: {
      javascript: `function autocompleteSearch(words, prefix, limit = 5) {
  const p = prefix.toLowerCase();
  return words
    .filter(w => w.toLowerCase().startsWith(p))
    .sort()
    .slice(0, limit);
}`,
      python: `def autocomplete_search(words, prefix, limit=5):
    p = prefix.lower()
    matches = [w for w in words if w.lower().startswith(p)]
    matches.sort()
    return matches[:limit]`
    },
    testCases: [
      { input: '["react", "redux", "refactor", "render", "router"], "re", 3', expectedOutput: '["react","redux","refactor"]', isHidden: false },
      { input: '["apple", "banana", "apricot"], "ap", 5', expectedOutput: '["apple","apricot"]', isHidden: false },
      { input: '["cat", "dog"], "z", 5', expectedOutput: '[]', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-028",
    title: "Build a Paginated API Client Batcher",
    slug: "fe-build-paginated-client",
    tier: 2,
    section: "JavaScript",
    topic: "Asynchronous JavaScript",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Pagination",
    category: "frontend",
    tags: ["fe-js", "pagination", "api"],
    xpReward: 100,
    description: `## Build a Paginated API Client Batcher

### Description
Given total count, pageSize, and currentPage (1-indexed), calculate pagination metadata: \`{ totalPages, hasPrev, hasNext, offset, limit }\`.

### Learning Objectives
- Calculate pagination offsets and navigation booleans.

### Example
\`Input: 55, 10, 2\`
\`Output: { totalPages: 6, hasPrev: true, hasNext: true, offset: 10, limit: 10 }\``,
    starterCode: {
      javascript: `function getPaginationMeta(total, pageSize, page) {
  const totalPages = Math.ceil(total / pageSize);
  return {
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    offset: (page - 1) * pageSize,
    limit: pageSize
  };
}`,
      python: `import math

def get_pagination_meta(total, page_size, page):
    total_pages = math.ceil(total / page_size)
    return {
        'totalPages': total_pages,
        'hasPrev': page > 1,
        'hasNext': page < total_pages,
        'offset': (page - 1) * page_size,
        'limit': page_size
    }`
    },
    testCases: [
      { input: '55, 10, 2', expectedOutput: '{"totalPages":6,"hasPrev":true,"hasNext":true,"offset":10,"limit":10}', isHidden: false },
      { input: '20, 10, 1', expectedOutput: '{"totalPages":2,"hasPrev":false,"hasNext":true,"offset":0,"limit":10}', isHidden: false },
      { input: '20, 10, 2', expectedOutput: '{"totalPages":2,"hasPrev":true,"hasNext":false,"offset":10,"limit":10}', isHidden: true }
    ]
  },

  // ─── Modern JS & Language Features (29-38) ───
  {
    id: "fe-tier2-029",
    title: "Currying Function Converter",
    slug: "fe-currying-function",
    tier: 2,
    section: "JavaScript",
    topic: "Functions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Closures",
    category: "frontend",
    tags: ["fe-js", "currying", "functional-programming"],
    xpReward: 100,
    description: `## Currying Function Converter

### Description
Currying converts a function with multiple arguments \`f(a, b, c)\` into nested unary functions \`f(a)(b)(c)\`.

### Learning Objectives
- Accumulate arguments using closures until arity is satisfied.

### Example
\`Input: 2, 3\` (for add(a)(b))
\`Output: 5\``,
    starterCode: {
      javascript: `function curryAdd(a) {
  return function(b) {
    return a + b;
  };
}`,
      python: `def curry_add(a):
    return lambda b: a + b`
    },
    testCases: [
      { input: '2, 3', expectedOutput: '5', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-030",
    title: "Memoize Function Wrapper",
    slug: "fe-memoize-function",
    tier: 2,
    section: "JavaScript",
    topic: "Functions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Closures",
    category: "frontend",
    tags: ["fe-js", "memoize", "performance"],
    xpReward: 100,
    description: `## Memoize Function Wrapper

### Description
Memoization caches function results keyed by their input arguments, preventing expensive recomputation on subsequent calls.

### Learning Objectives
- Cache previous returns using a key serializer and dictionary.

### Example
\`Input: [2, 3], [2, 3]\`
\`Output: { result: 5, cacheHits: 1 }\``,
    starterCode: {
      javascript: `function simulateMemoize(calls) {
  const cache = new Map();
  let hits = 0;
  let lastResult = null;
  for (const args of calls) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      hits++;
      lastResult = cache.get(key);
    } else {
      lastResult = args.reduce((a, b) => a + b, 0);
      cache.set(key, lastResult);
    }
  }
  return { result: lastResult, cacheHits: hits };
}`,
      python: `import json

def simulate_memoize(calls):
    cache = {}
    hits = 0
    last_res = None
    for args in calls:
        key = json.dumps(args)
        if key in cache:
            hits += 1
            last_res = cache[key]
        else:
            last_res = sum(args)
            cache[key] = last_res
    return {'result': last_res, 'cacheHits': hits}`
    },
    testCases: [
      { input: '[[2, 3], [2, 3]]', expectedOutput: '{"result":5,"cacheHits":1}', isHidden: false },
      { input: '[[1, 2], [3, 4], [1, 2]]', expectedOutput: '{"result":3,"cacheHits":1}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-031",
    title: "URL Query Parameters Parser",
    slug: "fe-url-query-parser",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Browser APIs",
    category: "frontend",
    tags: ["fe-js", "url", "browser-apis"],
    xpReward: 50,
    description: `## URL Query Parameters Parser

### Description
Parse a URL query string (e.g. \`"?track=frontend&page=2"\`) into an object of key-value pairs without using the URLSearchParams class.

### Learning Objectives
- Split query strings on \`&\` and \`=\`, decoding URI components.

### Example
\`Input: "?track=frontend&page=2"\`
\`Output: { track: "frontend", page: "2" }\``,
    starterCode: {
      javascript: `function parseQueryString(qs) {
  if (!qs) return {};
  const clean = qs.startsWith('?') ? qs.slice(1) : qs;
  const res = {};
  const pairs = clean.split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [k, v] = pair.split('=');
    res[decodeURIComponent(k)] = decodeURIComponent(v || '');
  }
  return res;
}`,
      python: `import urllib.parse

def parse_query_string(qs):
    if not qs:
        return {}
    clean = qs[1:] if qs.startswith('?') else qs
    res = {}
    pairs = clean.split('&')
    for pair in pairs:
        if not pair:
            continue
        parts = pair.split('=')
        k = urllib.parse.unquote(parts[0])
        v = urllib.parse.unquote(parts[1]) if len(parts) > 1 else ''
        res[k] = v
    return res`
    },
    testCases: [
      { input: '"?track=frontend&page=2"', expectedOutput: '{"track":"frontend","page":"2"}', isHidden: false },
      { input: '"?search=hello%20world"', expectedOutput: '{"search":"hello world"}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-032",
    title: "Optional Chaining & Nullish Coalescing Evaluator",
    slug: "fe-optional-chaining-evaluator",
    tier: 2,
    section: "JavaScript",
    topic: "JavaScript Fundamentals",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "ES6+",
    category: "frontend",
    tags: ["fe-js", "es6", "nullish"],
    xpReward: 50,
    description: `## Optional Chaining & Nullish Coalescing Evaluator

### Description
Safely traverse nested object paths \`user?.profile?.settings?.theme\` falling back to a default value if any step is \`null\` or \`undefined\` (\`?? defaultValue\`).

### Learning Objectives
- Implement safe path traversal: \`path.split('.').reduce(...)\`.

### Example
\`Input: { user: { profile: { theme: "dark" } } }, "user.profile.theme", "light"\`
\`Output: "dark"\`
\`Input: {}, "user.profile.theme", "light"\`
\`Output: "light"\``,
    starterCode: {
      javascript: `function safeGet(obj, path, defaultValue) {
  const parts = path.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur === null || cur === undefined) return defaultValue;
    cur = cur[part];
  }
  return cur !== null && cur !== undefined ? cur : defaultValue;
}`,
      python: `def safe_get(obj, path, default_value):
    parts = path.split('.')
    cur = obj
    for part in parts:
        if cur is None or not isinstance(cur, dict):
            return default_value
        cur = cur.get(part)
    return cur if cur is not None else default_value`
    },
    testCases: [
      { input: '{"user":{"profile":{"theme":"dark"}}}, "user.profile.theme", "light"', expectedOutput: '"dark"', isHidden: false },
      { input: '{}, "user.profile.theme", "light"', expectedOutput: '"light"', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-033",
    title: "Event Delegation Path Matcher",
    slug: "fe-event-delegation-matcher",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "DOM",
    category: "frontend",
    tags: ["fe-js", "events", "dom"],
    xpReward: 100,
    description: `## Event Delegation Path Matcher

### Description
Event delegation captures events at a parent container and inspects target element ancestry matching a selector (e.g. \`.btn-delete\`). Given a DOM node element path \`[{ tag, className }, ...]\` from target up to root, return the closest matching element or null.

### Learning Objectives
- Emulate \`element.closest(selector)\` up the event bubble hierarchy.

### Example
\`Input: [{ tag: "span", className: "icon" }, { tag: "button", className: "btn-delete" }, { tag: "div", className: "list" }], "btn-delete"\`
\`Output: { tag: "button", className: "btn-delete" }\``,
    starterCode: {
      javascript: `function findClosestMatch(path, targetClass) {
  for (const node of path) {
    if (node.className && node.className.split(' ').includes(targetClass)) {
      return node;
    }
  }
  return null;
}`,
      python: `def find_closest_match(path, target_class):
    for node in path:
        if 'className' in node and target_class in node['className'].split():
            return node
    return None`
    },
    testCases: [
      { input: '[{"tag":"span","className":"icon"},{"tag":"button","className":"btn-delete"},{"tag":"div","className":"list"}], "btn-delete"', expectedOutput: '{"tag":"button","className":"btn-delete"}', isHidden: false },
      { input: '[{"tag":"p","className":"text"}], "btn"', expectedOutput: 'null', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-034",
    title: "Object Flattening Utility",
    slug: "fe-object-flattening",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Objects",
    category: "frontend",
    tags: ["fe-js", "objects", "recursion"],
    xpReward: 100,
    description: `## Object Flattening Utility

### Description
Flatten a deeply nested object into single-level dot-notation keys: \`{ "user.address.city": "SF" }\`.

### Learning Objectives
- Recursively flatten object keys into concatenated strings.

### Example
\`Input: { a: 1, b: { c: 2, d: { e: 3 } } }\`
\`Output: { "a": 1, "b.c": 2, "b.d.e": 3 }\``,
    starterCode: {
      javascript: `function flattenObject(obj, prefix = '') {
  let res = {};
  for (const key of Object.keys(obj)) {
    const propName = prefix ? \`\${prefix}.\${key}\` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(res, flattenObject(obj[key], propName));
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}`,
      python: `def flatten_object(obj, prefix=''):
    res = {}
    for k, v in obj.items():
        prop_name = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            res.update(flatten_object(v, prop_name))
        else:
            res[prop_name] = v
    return res`
    },
    testCases: [
      { input: '{"a":1,"b":{"c":2,"d":{"e":3}}}', expectedOutput: '{"a":1,"b.c":2,"b.d.e":3}', isHidden: false },
      { input: '{"name":"Alex"}', expectedOutput: '{"name":"Alex"}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-035",
    title: "Regular Expression Email & URL Validator",
    slug: "fe-regex-email-url-validator",
    tier: 2,
    section: "JavaScript",
    topic: "Regular Expressions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Validation",
    category: "frontend",
    tags: ["fe-js", "regex", "validation"],
    xpReward: 50,
    description: `## Regular Expression Email & URL Validator

### Description
Validate that an input matches standard email or HTTPS URL formats using regex.

### Learning Objectives
- Formulate anchored regex patterns with capture groups.

### Example
\`Input: "user@example.com", "email"\`
\`Output: true\`
\`Input: "https://devarena.com", "url"\`
\`Output: true\``,
    starterCode: {
      javascript: `function validateFormat(input, formatType) {
  if (formatType === 'email') {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input);
  } else if (formatType === 'url') {
    return /^https?:\\/\\/[^\\s/$.?#].[^\\s]*$/.test(input);
  }
  return false;
}`,
      python: `import re

def validate_format(input_str, format_type):
    if format_type == 'email':
        return bool(re.match(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', input_str))
    elif format_type == 'url':
        return bool(re.match(r'^https?://[^\\s/$.?#].[^\\s]*$', input_str))
    return False`
    },
    testCases: [
      { input: '"user@example.com", "email"', expectedOutput: 'true', isHidden: false },
      { input: '"invalid-email", "email"', expectedOutput: 'false', isHidden: false },
      { input: '"https://devarena.com", "url"', expectedOutput: 'true', isHidden: true }
    ]
  },
  {
    id: "fe-tier2-036",
    title: "Array Difference & Intersection",
    slug: "fe-array-diff-intersection",
    tier: 2,
    section: "JavaScript",
    topic: "Arrays and Objects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Arrays",
    category: "frontend",
    tags: ["fe-js", "arrays", "sets"],
    xpReward: 50,
    description: `## Array Difference & Intersection

### Description
Given two arrays, return an object containing their intersection (elements present in both) and difference (elements in first but not second): \`{ intersection: [...], difference: [...] }\`.

### Learning Objectives
- Use Sets for O(n + m) set operations.

### Example
\`Input: [1, 2, 3], [2, 3, 4]\`
\`Output: { intersection: [2, 3], difference: [1] }\``,
    starterCode: {
      javascript: `function arrayDiffAndIntersect(arr1, arr2) {
  const s2 = new Set(arr2);
  const intersection = arr1.filter(x => s2.has(x));
  const difference = arr1.filter(x => !s2.has(x));
  return { intersection, difference };
}`,
      python: `def array_diff_and_intersect(arr1, arr2):
    s2 = set(arr2)
    intersection = [x for x in arr1 if x in s2]
    difference = [x for x in arr1 if x not in s2]
    return {'intersection': intersection, 'difference': difference}`
    },
    testCases: [
      { input: '[1, 2, 3], [2, 3, 4]', expectedOutput: '{"intersection":[2,3],"difference":[1]}', isHidden: false },
      { input: '["a", "b"], ["c"]', expectedOutput: '{"intersection":[],"difference":["a","b"]}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-037",
    title: "Custom Event Bus Pub/Sub",
    slug: "fe-custom-event-bus",
    tier: 2,
    section: "JavaScript",
    topic: "DOM & Browser",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Design Patterns",
    category: "frontend",
    tags: ["fe-js", "events", "pubsub"],
    xpReward: 100,
    description: `## Custom Event Bus Pub/Sub

### Description
Implement an Event Bus that registers callbacks for event names and dispatches payloads: \`on(event, fn)\`, \`emit(event, data)\`.

### Learning Objectives
- Build publisher-subscriber architecture in vanilla JavaScript.

### Example
\`Input: "order", { id: 101 }\`
\`Output: { event: "order", payload: { id: 101 }, listenerCount: 1 }\``,
    starterCode: {
      javascript: `function simulateEventBus(event, payload, registeredEvents) {
  const count = registeredEvents.filter(e => e === event).length;
  return { event, payload, listenerCount: count };
}`,
      python: `def simulate_event_bus(event, payload, registered_events):
    count = registered_events.count(event)
    return {'event': event, 'payload': payload, 'listenerCount': count}`
    },
    testCases: [
      { input: '"order", {"id":101}, ["order", "user"]', expectedOutput: '{"event":"order","payload":{"id":101},"listenerCount":1}', isHidden: false }
    ]
  },
  {
    id: "fe-tier2-038",
    title: "Array Reduce Pipeline Composer",
    slug: "fe-pipe-compose-functions",
    tier: 2,
    section: "JavaScript",
    topic: "Functions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Functional Programming",
    category: "frontend",
    tags: ["fe-js", "functional", "pipe"],
    xpReward: 100,
    description: `## Array Reduce Pipeline Composer

### Description
Create a pipe function that composes a sequence of operations left-to-right on an initial input value.
Given initial value \`x\` and operation steps \`[["add", 2], ["multiply", 3]]\`, compute final value.

### Learning Objectives
- Implement functional pipelines using \`Array.prototype.reduce\`.

### Example
\`Input: 5, [["add", 2], ["multiply", 3]]\`
\`Output: 21\` ((5 + 2) * 3 = 21)`,
    starterCode: {
      javascript: `function executePipeline(initialValue, ops) {
  return ops.reduce((acc, [op, val]) => {
    if (op === 'add') return acc + val;
    if (op === 'subtract') return acc - val;
    if (op === 'multiply') return acc * val;
    if (op === 'divide') return acc / val;
    return acc;
  }, initialValue);
}`,
      python: `def execute_pipeline(initial_value, ops):
    acc = initial_value
    for op, val in ops:
        if op == 'add':
            acc += val
        elif op == 'subtract':
            acc -= val
        elif op == 'multiply':
            acc *= val
        elif op == 'divide':
            acc /= val
    return acc`
    },
    testCases: [
      { input: '5, [["add", 2], ["multiply", 3]]', expectedOutput: '21', isHidden: false },
      { input: '10, [["subtract", 4], ["divide", 2]]', expectedOutput: '3', isHidden: false }
    ]
  }
];

module.exports = feTier2Javascript;
