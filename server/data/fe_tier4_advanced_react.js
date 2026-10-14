/**
 * Tier 4 — Advanced React (25 Topics & Coding Challenges)
 * Node: fe-advanced
 * Difficulty: Medium / Hard
 */

const feTier4AdvancedReact = [
  {
    id: "fe-adv-001",
    title: "Build a Virtualized List Window Calculator",
    slug: "fe-build-virtualized-list",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-advanced", "virtualization", "performance"],
    xpReward: 200,
    description: `## Build a Virtualized List Window Calculator

### Description
List virtualization renders only the items visible in the current viewport window plus overscan buffers.
Given \`scrollTop\`, \`itemHeight\`, \`containerHeight\`, \`totalItems\`, and \`overscan = 2\`, compute:
\`{ startIndex, endIndex, offsetY, visibleCount }\`.

### Learning Objectives
- Calculate virtual scrolling slicing indices and top offset translation to handle 100k+ DOM items efficiently.

### Example
\`Input: 200, 50, 400, 1000, 2\`
\`Output: { startIndex: 2, endIndex: 13, offsetY: 100, visibleCount: 12 }\``,
    starterCode: {
      javascript: `function calculateVirtualWindow(scrollTop, itemHeight, containerHeight, totalItems, overscan = 2) {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const rawStart = Math.floor(scrollTop / itemHeight);
  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalItems - 1, rawStart + visibleCount + overscan);
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleCount: Math.max(0, endIndex - startIndex + 1)
  };
}`,
      python: `import math

def calculate_virtual_window(scroll_top, item_height, container_height, total_items, overscan=2):
    visible_count = math.ceil(container_height / item_height)
    raw_start = int(scroll_top // item_height)
    start_index = max(0, raw_start - overscan)
    end_index = min(total_items - 1, raw_start + visible_count + overscan)
    offset_y = start_index * item_height
    return {
        'startIndex': start_index,
        'endIndex': end_index,
        'offsetY': offset_y,
        'visibleCount': max(0, end_index - start_index + 1)
    }`
    },
    testCases: [
      { input: '200, 50, 400, 1000, 2', expectedOutput: '{"startIndex":2,"endIndex":13,"offsetY":100,"visibleCount":12}', isHidden: false },
      { input: '0, 40, 200, 100, 1', expectedOutput: '{"startIndex":0,"endIndex":6,"offsetY":0,"visibleCount":7}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-002",
    title: "Build a Global State Store (Zustand/Redux Style)",
    slug: "fe-build-global-state-store",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "State Management",
    category: "frontend",
    tags: ["fe-advanced", "state-management", "store"],
    xpReward: 200,
    description: `## Build a Global State Store (Zustand/Redux Style)

### Description
Implement a minimal state store simulator:
- \`getState()\`: returns current state
- \`setState(partialOrFn)\`: merges updates and notifies listeners
- \`subscribe(listener)\`: adds listener callback
Given initial state and operations, return final state and listener dispatch counts.

### Learning Objectives
- Build an observable pub/sub state container decoupled from React rendering.

### Example
\`Input: { count: 0 }, [{ type: "set", val: { count: 1 } }, { type: "set", val: { count: 2 } }]\`
\`Output: { finalState: { count: 2 }, notificationCount: 2 }\``,
    starterCode: {
      javascript: `function simulateGlobalStore(initialState, actions) {
  let state = { ...initialState };
  let notifications = 0;
  for (const act of actions) {
    if (act.type === 'set') {
      const update = typeof act.val === 'function' ? act.val(state) : act.val;
      state = { ...state, ...update };
      notifications++;
    }
  }
  return { finalState: state, notificationCount: notifications };
}`,
      python: `def simulate_global_store(initial_state, actions):
    state = dict(initial_state)
    notifications = 0
    for act in actions:
        if act.get('type') == 'set':
            val = act.get('val')
            update = val(state) if callable(val) else val
            state.update(update)
            notifications += 1
    return {'finalState': state, 'notificationCount': notifications}`
    },
    testCases: [
      { input: '{"count":0}, [{"type":"set","val":{"count":1}},{"type":"set","val":{"count":2}}]', expectedOutput: '{"finalState":{"count":2},"notificationCount":2}', isHidden: false },
      { input: '{"user":"guest"}, [{"type":"set","val":{"user":"admin"}}]', expectedOutput: '{"finalState":{"user":"admin"},"notificationCount":1}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-003",
    title: "React Query Stale-While-Revalidate Cache",
    slug: "fe-react-query-swr-cache",
    tier: 4,
    section: "Advanced React",
    topic: "React Query Concepts",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Server State",
    category: "frontend",
    tags: ["fe-advanced", "react-query", "caching"],
    xpReward: 200,
    description: `## React Query Stale-While-Revalidate Cache

### Description
React Query caches server data by key. If elapsed time since fetch is less than \`staleTime\`, data is \`"fresh"\` (no fetch triggered). If between \`staleTime\` and \`cacheTime\`, data is \`"stale"\` (served from cache while background refetch triggers). If older than \`cacheTime\`, entry is garbage collected (\`"expired"\`).
Given \`cachedAt\`, \`now\`, \`staleTime\`, and \`cacheTime\`, return cache status.

### Learning Objectives
- Model SWR lifecycle states (\`"fresh"\`, \`"stale"\`, \`"expired"\`).

### Example
\`Input: 1000, 3000, 5000, 10000\` (elapsed: 2000 < staleTime: 5000)
\`Output: "fresh"\`
\`Input: 1000, 7000, 5000, 10000\` (elapsed: 6000 > staleTime: 5000, < cacheTime: 10000)
\`Output: "stale"\``,
    starterCode: {
      javascript: `function getQueryCacheStatus(cachedAt, now, staleTime, cacheTime) {
  const elapsed = now - cachedAt;
  if (elapsed < staleTime) return 'fresh';
  if (elapsed < cacheTime) return 'stale';
  return 'expired';
}`,
      python: `def get_query_cache_status(cached_at, now, stale_time, cache_time):
    elapsed = now - cached_at
    if elapsed < stale_time:
        return 'fresh'
    if elapsed < cache_time:
        return 'stale'
    return 'expired'`
    },
    testCases: [
      { input: '1000, 3000, 5000, 10000', expectedOutput: '"fresh"', isHidden: false },
      { input: '1000, 7000, 5000, 10000', expectedOutput: '"stale"', isHidden: false },
      { input: '1000, 15000, 5000, 10000', expectedOutput: '"expired"', isHidden: true }
    ]
  },
  {
    id: "fe-adv-004",
    title: "Build a Compound Component State Manager",
    slug: "fe-build-compound-component",
    tier: 4,
    section: "Advanced React",
    topic: "Compound Components",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Design",
    category: "frontend",
    tags: ["fe-advanced", "compound-components", "patterns"],
    xpReward: 100,
    description: `## Build a Compound Component State Manager

### Description
Compound components (like \`<Select>\`, \`<Select.Option>\`) share implicit state through context. Given active option value and list of options \`[{ value, label }]\`, return compound state: \`{ selectedOption, optionsWithActive: [{ value, label, isSelected }] }\`.

### Learning Objectives
- Distribute parent state to child elements without explicit prop drilling.

### Example
\`Input: [{ value: "1", label: "One" }, { value: "2", label: "Two" }], "2"\`
\`Output: { selectedValue: "2", options: [{ value: "1", label: "One", isSelected: false }, { value: "2", label: "Two", isSelected: true }] }\``,
    starterCode: {
      javascript: `function buildCompoundSelectState(options, selectedValue) {
  const mapped = options.map(opt => ({
    ...opt,
    isSelected: opt.value === selectedValue
  }));
  return { selectedValue, options: mapped };
}`,
      python: `def build_compound_select_state(options, selected_value):
    mapped = [dict(opt, isSelected=(opt['value'] == selected_value)) for opt in options]
    return {'selectedValue': selected_value, 'options': mapped}`
    },
    testCases: [
      { input: '[{"value":"1","label":"One"},{"value":"2","label":"Two"}], "2"', expectedOutput: '{"selectedValue":"2","options":[{"value":"1","label":"One","isSelected":false},{"value":"2","label":"Two","isSelected":true}]}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-005",
    title: "Build a Modal Manager Stack",
    slug: "fe-build-modal-manager",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State Management",
    category: "frontend",
    tags: ["fe-advanced", "modal", "manager"],
    xpReward: 100,
    description: `## Build a Modal Manager Stack

### Description
A centralized Modal Manager maintains a stack of active modals (supporting nested dialogs, confirmations on top of forms).
- \`OPEN\`: pushes \`{ id, component, props }\` onto stack
- \`CLOSE\`: pops topmost modal or closes by id
Return current active modal (top of stack) and stack depth.

### Learning Objectives
- Manage LIFO dialog navigation stacks with backdrop esc key bindings.

### Example
\`Input: [], [{ type: "OPEN", id: "edit-form" }, { type: "OPEN", id: "confirm-dialog" }]\`
\`Output: { activeModalId: "confirm-dialog", count: 2 }\``,
    starterCode: {
      javascript: `function manageModalStack(initialStack, actions) {
  let stack = [...initialStack];
  for (const act of actions) {
    if (act.type === 'OPEN') {
      stack.push(act.id);
    } else if (act.type === 'CLOSE') {
      if (act.id) stack = stack.filter(id => id !== act.id);
      else stack.pop();
    }
  }
  return {
    activeModalId: stack.length > 0 ? stack[stack.length - 1] : null,
    count: stack.length
  };
}`,
      python: `def manage_modal_stack(initial_stack, actions):
    stack = list(initial_stack)
    for act in actions:
        if act.get('type') == 'OPEN':
            stack.append(act.get('id'))
        elif act.get('type') == 'CLOSE':
            if act.get('id'):
                stack = [i for i in stack if i != act.get('id')]
            elif stack:
                stack.pop()
    return {
        'activeModalId': stack[-1] if stack else None,
        'count': len(stack)
    }`
    },
    testCases: [
      { input: '[], [{"type":"OPEN","id":"edit-form"},{"type":"OPEN","id":"confirm-dialog"}]', expectedOutput: '{"activeModalId":"confirm-dialog","count":2}', isHidden: false },
      { input: '["edit-form"], [{"type":"CLOSE"}]', expectedOutput: '{"activeModalId":null,"count":0}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-006",
    title: "Build a Reusable Data Table Sorter & Column Selector",
    slug: "fe-build-reusable-data-table",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Component Design",
    category: "frontend",
    tags: ["fe-advanced", "table", "components"],
    xpReward: 200,
    description: `## Build a Reusable Data Table Sorter & Column Selector

### Description
A headless data table takes column definitions \`[{ key, title, sortable }]\`, filters visible columns by user preference, and sorts rows by a selected column key and order.

### Learning Objectives
- Implement decoupled data table transformation pipelines.

### Example
\`Input: [{ key: "name" }, { key: "age" }], ["name", "age"], [{ name: "B", age: 30 }, { name: "A", age: 20 }], "age", "asc"\`
\`Output: [{ name: "A", age: 20 }, { name: "B", age: 30 }]\``,
    starterCode: {
      javascript: `function processDataTable(columns, visibleKeys, rows, sortKey, sortOrder) {
  const activeCols = columns.filter(c => visibleKeys.includes(c.key));
  const sorted = [...rows].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted.map(row => {
    const obj = {};
    activeCols.forEach(c => { obj[c.key] = row[c.key]; });
    return obj;
  });
}`,
      python: `def process_data_table(columns, visible_keys, rows, sort_key, sort_order):
    active_keys = [c['key'] for c in columns if c['key'] in visible_keys]
    rev = sort_order != 'asc'
    sorted_rows = sorted(rows, key=lambda r: r.get(sort_key), reverse=rev)
    return [{k: r[k] for k in active_keys if k in r} for r in sorted_rows]`
    },
    testCases: [
      { input: '[{"key":"name"},{"key":"age"}], ["name","age"], [{"name":"B","age":30},{"name":"A","age":20}], "age", "asc"', expectedOutput: '[{"name":"A","age":20},{"name":"B","age":30}]', isHidden: false }
    ]
  },
  {
    id: "fe-adv-007",
    title: "Build a Drag-and-Drop Array Reorderer",
    slug: "fe-build-drag-and-drop",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Design",
    category: "frontend",
    tags: ["fe-advanced", "drag-and-drop", "arrays"],
    xpReward: 100,
    description: `## Build a Drag-and-Drop Array Reorderer

### Description
In drag-and-drop lists (like react-beautiful-dnd or dnd-kit), dragging an item from \`sourceIndex\` to \`destinationIndex\` shifts items between them.
Given an array, source index, and destination index, return reordered array immutably.

### Learning Objectives
- Perform array splice and re-insertion without side effects.

### Example
\`Input: ["A", "B", "C", "D"], 0, 2\` (Move "A" to index 2)
\`Output: ["B", "C", "A", "D"]\``,
    starterCode: {
      javascript: `function reorderArray(list, sourceIndex, destinationIndex) {
  const res = Array.from(list);
  const [removed] = res.splice(sourceIndex, 1);
  res.splice(destinationIndex, 0, removed);
  return res;
}`,
      python: `def reorder_array(item_list, source_index, destination_index):
    res = list(item_list)
    item = res.pop(source_index)
    res.insert(destination_index, item)
    return res`
    },
    testCases: [
      { input: '["A", "B", "C", "D"], 0, 2', expectedOutput: '["B","C","A","D"]', isHidden: false },
      { input: '["A", "B", "C"], 2, 0', expectedOutput: '["C","A","B"]', isHidden: false }
    ]
  },
  {
    id: "fe-adv-008",
    title: "useTransition Non-Blocking State Scheduler",
    slug: "fe-use-transition-scheduler",
    tier: 4,
    section: "Advanced React",
    topic: "Concurrent Rendering",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Concurrent Mode",
    category: "frontend",
    tags: ["fe-advanced", "concurrent", "useTransition"],
    xpReward: 200,
    description: `## useTransition Non-Blocking State Scheduler

### Description
React 18's \`useTransition\` separates urgent updates (typing in an input) from non-urgent transition updates (filtering a large graph). Urgent updates yield immediately while transition updates set \`isPending = true\` until complete.
Given urgent value and transition value, return \`{ urgentValue, deferredValue, isPending }\`.

### Learning Objectives
- Decouple urgent input responses from heavy list transitions.

### Example
\`Input: "react", "re", true\`
\`Output: { urgentValue: "react", deferredValue: "re", isPending: true }\``,
    starterCode: {
      javascript: `function getTransitionState(urgent, deferred, isPending) {
  return {
    urgentValue: urgent,
    deferredValue: deferred,
    isPending
  };
}`,
      python: `def get_transition_state(urgent, deferred, is_pending):
    return {
        'urgentValue': urgent,
        'deferredValue': deferred,
        'isPending': is_pending
    }`
    },
    testCases: [
      { input: '"react", "re", true', expectedOutput: '{"urgentValue":"react","deferredValue":"re","isPending":true}', isHidden: false },
      { input: '"react", "react", false', expectedOutput: '{"urgentValue":"react","deferredValue":"react","isPending":false}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-009",
    title: "Higher-Order Component Props Decorator",
    slug: "fe-hoc-props-decorator",
    tier: 4,
    section: "Advanced React",
    topic: "Higher-Order Components",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Design",
    category: "frontend",
    tags: ["fe-advanced", "hoc", "patterns"],
    xpReward: 100,
    description: `## Higher-Order Component Props Decorator

### Description
A Higher-Order Component (HOC) is a pure function taking a component and returning an enhanced component injected with supplementary props (e.g. \`withTheme\`, \`withAuth\`).
Given component props and HOC injected props, return merged props with collision resolution (injected props take precedence).

### Learning Objectives
- Understand prop composition and decorator patterns in React.

### Example
\`Input: { title: "Card" }, { theme: "dark" }\`
\`Output: { title: "Card", theme: "dark" }\``,
    starterCode: {
      javascript: `function mergeHocProps(baseProps, injectedProps) {
  return { ...baseProps, ...injectedProps };
}`,
      python: `def merge_hoc_props(base_props, injected_props):
    res = dict(base_props)
    res.update(injected_props)
    return res`
    },
    testCases: [
      { input: '{"title":"Card"}, {"theme":"dark"}', expectedOutput: '{"title":"Card","theme":"dark"}', isHidden: false },
      { input: '{"id":1,"role":"guest"}, {"role":"admin"}', expectedOutput: '{"id":1,"role":"admin"}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-010",
    title: "Render Props Slot Injector",
    slug: "fe-render-props-injector",
    tier: 4,
    section: "Advanced React",
    topic: "Render Props",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Design",
    category: "frontend",
    tags: ["fe-advanced", "render-props", "patterns"],
    xpReward: 100,
    description: `## Render Props Slot Injector

### Description
The render prop pattern delegates visual rendering to a slot template formatter while retaining state logic internally.
Given state \`{ count: 5 }\` and a slot template \`"Count: {count}"\`, replace each \`{key}\` placeholder with the corresponding state value.

### Learning Objectives
- Share stateful logic by decoupling state computation from visual presentation.

### Example
\`Input: { count: 5 }, "Count: {count}"\`
\`Output: "Count: 5"\``,
    starterCode: {
      javascript: `function executeRenderProp(state, template) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => state[key] !== undefined ? String(state[key]) : '');
}`,
      python: `import re

def execute_render_prop(state, template):
    return re.sub(r'\\{(\\w+)\\}', lambda m: str(state.get(m.group(1), '')), template)`
    },
    testCases: [
      { input: '{"count":5}, "Count: {count}"', expectedOutput: '"Count: 5"', isHidden: false },
      { input: '{"user":"Alice","role":"Admin"}, "Hello {user} ({role})"', expectedOutput: '"Hello Alice (Admin)"', isHidden: false },
      { input: '{"items":0}, "Found {items} items"', expectedOutput: '"Found 0 items"', isHidden: true }
    ]
  },
  {
    id: "fe-adv-011",
    title: "SSR vs CSR Hydration Mismatch Detector",
    slug: "fe-ssr-hydration-mismatch",
    tier: 4,
    section: "Advanced React",
    topic: "Hydration",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "SSR",
    category: "frontend",
    tags: ["fe-advanced", "ssr", "hydration"],
    xpReward: 200,
    description: `## SSR vs CSR Hydration Mismatch Detector

### Description
Hydration mismatches happen when HTML produced by server-side rendering differs from client initial render (e.g. \`Date.now()\`, \`window.innerWidth\`).
Given server HTML string and client HTML string, detect if hydration will mismatch and return \`{ isMatch: boolean, diffIndex: number }\`.

### Learning Objectives
- Guarantee deterministic server rendering matches client markup.

### Example
\`Input: "<div>Hello</div>", "<div>Hello</div>"\`
\`Output: { isMatch: true, diffIndex: -1 }\`
\`Input: "<div>Sun</div>", "<div>Mon</div>"\`
\`Output: { isMatch: false, diffIndex: 5 }\``,
    starterCode: {
      javascript: `function checkHydrationMatch(serverHtml, clientHtml) {
  if (serverHtml === clientHtml) {
    return { isMatch: true, diffIndex: -1 };
  }
  const minLen = Math.min(serverHtml.length, clientHtml.length);
  for (let i = 0; i < minLen; i++) {
    if (serverHtml[i] !== clientHtml[i]) {
      return { isMatch: false, diffIndex: i };
    }
  }
  return { isMatch: false, diffIndex: minLen };
}`,
      python: `def check_hydration_match(server_html, client_html):
    if server_html == client_html:
        return {'isMatch': True, 'diffIndex': -1}
    min_len = min(len(server_html), len(client_html))
    for i in range(min_len):
        if server_html[i] != client_html[i]:
            return {'isMatch': False, 'diffIndex': i}
    return {'isMatch': False, 'diffIndex': min_len}`
    },
    testCases: [
      { input: '"<div>Hello</div>", "<div>Hello</div>"', expectedOutput: '{"isMatch":true,"diffIndex":-1}', isHidden: false },
      { input: '"<div>Sun</div>", "<div>Mon</div>"', expectedOutput: '{"isMatch":false,"diffIndex":5}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-012",
    title: "React Fiber Priority Scheduler",
    slug: "fe-react-fiber-priority-scheduler",
    tier: 4,
    section: "Advanced React",
    topic: "React Fiber",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Concurrent Mode",
    category: "frontend",
    tags: ["fe-advanced", "fiber", "scheduler"],
    xpReward: 200,
    description: `## React Fiber Priority Scheduler

### Description
React Fiber assigns priority lanes to work items:
1. \`ImmediatePriority\` (clicks, inputs)
2. \`UserBlockingPriority\` (scrolls, drags)
3. \`NormalPriority\` (data fetches)
4. \`LowPriority\` (analytics, prefetching)
Sort task queues so higher priority tasks execute first.

### Learning Objectives
- Prioritize concurrent task execution using numeric priority levels.

### Example
\`Input: [{ name: "Analytics", prio: 4 }, { name: "Click", prio: 1 }, { name: "Fetch", prio: 3 }]\`
\`Output: ["Click", "Fetch", "Analytics"]\``,
    starterCode: {
      javascript: `function scheduleFiberTasks(tasks) {
  return [...tasks].sort((a, b) => a.prio - b.prio).map(t => t.name);
}`,
      python: `def schedule_fiber_tasks(tasks):
    sorted_tasks = sorted(tasks, key=lambda t: t.get('prio', 99))
    return [t['name'] for t in sorted_tasks]`
    },
    testCases: [
      { input: '[{"name":"Analytics","prio":4},{"name":"Click","prio":1},{"name":"Fetch","prio":3}]', expectedOutput: '["Click","Fetch","Analytics"]', isHidden: false },
      { input: '[{"name":"A","prio":2},{"name":"B","prio":1}]', expectedOutput: '["B","A"]', isHidden: false }
    ]
  },
  {
    id: "fe-adv-013",
    title: "Build an Infinite Query Cursor Paginator",
    slug: "fe-build-infinite-query",
    tier: 4,
    section: "Advanced React",
    topic: "React Query Concepts",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Server State",
    category: "frontend",
    tags: ["fe-advanced", "infinite-query", "pagination"],
    xpReward: 200,
    description: `## Build an Infinite Query Cursor Paginator

### Description
\`useInfiniteQuery\` aggregates multiple page fetches into a single flattened data list and retrieves \`nextCursor\` from page metadata.
Given array of fetched pages \`[{ data: [1, 2], nextCursor: "cur_2" }, { data: [3, 4], nextCursor: null }]\`, return flattened data and final cursor.

### Learning Objectives
- Aggregate paginated API queries and manage cursor progression.

### Example
\`Input: [{ data: [1, 2], nextCursor: "c2" }, { data: [3, 4], nextCursor: null }]\`
\`Output: { items: [1, 2, 3, 4], nextCursor: null, hasNextPage: false }\``,
    starterCode: {
      javascript: `function flattenInfinitePages(pages) {
  const items = pages.flatMap(p => p.data);
  const lastPage = pages[pages.length - 1];
  const nextCursor = lastPage ? lastPage.nextCursor : null;
  return {
    items,
    nextCursor,
    hasNextPage: Boolean(nextCursor)
  };
}`,
      python: `def flatten_infinite_pages(pages):
    items = []
    for p in pages:
        items.extend(p.get('data', []))
    last_p = pages[-1] if pages else {}
    next_cur = last_p.get('nextCursor')
    return {
        'items': items,
        'nextCursor': next_cur,
        'hasNextPage': bool(next_cur)
    }`
    },
    testCases: [
      { input: '[{"data":[1,2],"nextCursor":"c2"},{"data":[3,4],"nextCursor":null}]', expectedOutput: '{"items":[1,2,3,4],"nextCursor":null,"hasNextPage":false}', isHidden: false },
      { input: '[{"data":["a"],"nextCursor":"c1"}]', expectedOutput: '{"items":["a"],"nextCursor":"c1","hasNextPage":true}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-014",
    title: "Build a Form Management Validation System",
    slug: "fe-build-form-management-system",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Forms",
    category: "frontend",
    tags: ["fe-advanced", "forms", "validation"],
    xpReward: 200,
    description: `## Build a Form Management Validation System

### Description
Form libraries (React Hook Form / Formik) track field values, dirty flags, touched state, and synchronous error messages.
Given form values, touched fields array, declarative rules (e.g. \`pattern\`, \`required\`), and initial values, return form state summary: \`{ touchedErrors, isDirty, isValid }\`.

### Learning Objectives
- Display validation errors only for fields the user has already touched.

### Example
\`Input: { email: "bad" }, ["email"], { email: { pattern: "@", message: "Invalid" } }, { email: "" }\`
\`Output: { touchedErrors: { email: "Invalid" }, isDirty: true, isValid: false }\``,
    starterCode: {
      javascript: `function manageFormState(values, touched, rules, initialValues) {
  const touchedErrors = {};
  let isValid = true;
  let isDirty = false;

  for (const k of Object.keys(rules)) {
    const rule = rules[k];
    const val = values[k] || '';
    let err = null;
    if (rule.required && !val) err = rule.message || 'Required';
    else if (rule.pattern && !val.includes(rule.pattern)) err = rule.message || 'Invalid';

    if (err) {
      isValid = false;
      if (touched.includes(k)) touchedErrors[k] = err;
    }
  }

  for (const k of Object.keys(values)) {
    if (values[k] !== initialValues[k]) isDirty = true;
  }

  return { touchedErrors, isDirty, isValid };
}`,
      python: `def manage_form_state(values, touched, rules, initial_values):
    touched_errors = {}
    is_valid = True
    is_dirty = any(values.get(k) != initial_values.get(k) for k in values)
    for k, rule in rules.items():
        val = str(values.get(k, ''))
        err = None
        if rule.get('required') and not val:
            err = rule.get('message', 'Required')
        elif rule.get('pattern') and rule['pattern'] not in val:
            err = rule.get('message', 'Invalid')
        if err:
            is_valid = False
            if k in touched:
                touched_errors[k] = err
    return {'touchedErrors': touched_errors, 'isDirty': is_dirty, 'isValid': is_valid}`
    },
    testCases: [
      { input: '{"email":"bad"}, ["email"], {"email":{"pattern":"@","message":"Invalid"}}, {"email":""}', expectedOutput: '{"touchedErrors":{"email":"Invalid"},"isDirty":true,"isValid":false}', isHidden: false },
      { input: '{"email":"test@example.com"}, ["email"], {"email":{"pattern":"@","message":"Invalid"}}, {"email":"test@example.com"}', expectedOutput: '{"touchedErrors":{},"isDirty":false,"isValid":true}', isHidden: false },
      { input: '{"email":"bad"}, [], {"email":{"pattern":"@","message":"Invalid"}}, {"email":""}', expectedOutput: '{"touchedErrors":{},"isDirty":true,"isValid":false}', isHidden: true }
    ]
  },
  {
    id: "fe-adv-015",
    title: "Optimize a Slow React Application Profiler",
    slug: "fe-optimize-slow-react-app",
    tier: 4,
    section: "Advanced React",
    topic: "Advanced React Challenges",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-advanced", "performance", "profiler"],
    xpReward: 200,
    description: `## Optimize a Slow React Application Profiler

### Description
The React DevTools Profiler records render duration and commit times. Identify which components exceed a performance budget (> 16ms, causing frame drops) and should be wrapped in \`React.memo\`.

### Learning Objectives
- Audit commit logs and detect wasted renders exceeding the 60fps frame budget.

### Example
\`Input: [{ name: "Card", duration: 8 }, { name: "FeedList", duration: 25 }, { name: "Header", duration: 2 }]\`
\`Output: ["FeedList"]\``,
    starterCode: {
      javascript: `function findSlowComponents(profileRenders, budgetMs = 16) {
  return profileRenders
    .filter(r => r.duration > budgetMs)
    .map(r => r.name);
}`,
      python: `def find_slow_components(profile_renders, budget_ms=16):
    return [r['name'] for r in profile_renders if r.get('duration', 0) > budget_ms]`
    },
    testCases: [
      { input: '[{"name":"Card","duration":8},{"name":"FeedList","duration":25},{"name":"Header","duration":2}]', expectedOutput: '["FeedList"]', isHidden: false },
      { input: '[{"name":"A","duration":30},{"name":"B","duration":40}]', expectedOutput: '["A","B"]', isHidden: false }
    ]
  },
  {
    id: "fe-adv-016",
    title: "React.memo Custom arePropsEqual Comparator",
    slug: "fe-react-memo-are-props-equal",
    tier: 4,
    section: "Advanced React",
    topic: "React.memo",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Memoization",
    category: "frontend",
    tags: ["fe-advanced", "memo", "performance"],
    xpReward: 100,
    description: `## React.memo Custom arePropsEqual Comparator

### Description
By default, \`React.memo\` performs shallow prop comparison. A custom \`arePropsEqual(prevProps, nextProps)\` comparator returns \`true\` to skip rendering or \`false\` to re-render.
Given specified comparison keys, determine if component render should be skipped.

### Learning Objectives
- Compare deep or specific prop keys to avoid unnecessary re-rendering.

### Example
\`Input: { id: 1, text: "hello" }, { id: 1, text: "hello", onClick: () => {} }, ["id", "text"]\`
\`Output: true\` (relevant keys unchanged)`,
    starterCode: {
      javascript: `function arePropsEqualByKeys(prevProps, nextProps, keys) {
  for (const k of keys) {
    if (!Object.is(prevProps[k], nextProps[k])) return false;
  }
  return true;
}`,
      python: `def are_props_equal_by_keys(prev_props, next_props, keys):
    for k in keys:
        if prev_props.get(k) != next_props.get(k):
            return False
    return True`
    },
    testCases: [
      { input: '{"id":1,"text":"hello"}, {"id":1,"text":"hello"}, ["id","text"]', expectedOutput: 'true', isHidden: false },
      { input: '{"id":1,"text":"hello"}, {"id":1,"text":"world"}, ["id","text"]', expectedOutput: 'false', isHidden: false }
    ]
  },
  {
    id: "fe-adv-017",
    title: "Code Splitting Dynamic Import Matcher",
    slug: "fe-code-splitting-matcher",
    tier: 4,
    section: "Advanced React",
    topic: "Code Splitting",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-advanced", "code-splitting", "performance"],
    xpReward: 100,
    description: `## Code Splitting Dynamic Import Matcher

### Description
React.lazy dynamically imports route bundles: \`const Admin = React.lazy(() => import('./Admin'))\`.
Given requested route path and split bundle routes map \`{ "/admin": "admin.chunk.js", "/analytics": "analytics.chunk.js" }\`, return chunk to download.

### Learning Objectives
- Match routes to lazy chunks.

### Example
\`Input: "/admin", { "/admin": "admin.chunk.js", "/settings": "settings.chunk.js" }\`
\`Output: "admin.chunk.js"\``,
    starterCode: {
      javascript: `function resolveChunkForRoute(route, chunks) {
  return chunks[route] || 'main.chunk.js';
}`,
      python: `def resolve_chunk_for_route(route, chunks):
    return chunks.get(route, 'main.chunk.js')`
    },
    testCases: [
      { input: '"/admin", {"/admin":"admin.chunk.js","/settings":"settings.chunk.js"}', expectedOutput: '"admin.chunk.js"', isHidden: false },
      { input: '"/unknown", {"/admin":"admin.chunk.js"}', expectedOutput: '"main.chunk.js"', isHidden: false }
    ]
  },
  {
    id: "fe-adv-018",
    title: "Headless UI Component Dropdown Logic",
    slug: "fe-headless-dropdown-logic",
    tier: 4,
    section: "Advanced React",
    topic: "Headless Components",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Design",
    category: "frontend",
    tags: ["fe-advanced", "headless", "components"],
    xpReward: 100,
    description: `## Headless UI Component Dropdown Logic

### Description
Headless UI components (like Radix UI or Headless UI) provide behavior and accessibility props without styles: \`getButtonProps()\`, \`getMenuProps()\`, \`getItemProps(idx)\`.
Given state \`{ isOpen: true, activeIndex: 0 }\`, return computed accessibility attribute descriptors.

### Learning Objectives
- Generate headless ARIA prop getters.

### Example
\`Input: true, 0\`
\`Output: { buttonProps: { "aria-expanded": "true", "aria-haspopup": "true" }, menuProps: { role: "menu" } }\``,
    starterCode: {
      javascript: `function getHeadlessDropdownProps(isOpen, activeIndex) {
  return {
    buttonProps: {
      'aria-expanded': isOpen ? 'true' : 'false',
      'aria-haspopup': 'true'
    },
    menuProps: {
      role: 'menu',
      hidden: !isOpen
    }
  };
}`,
      python: `def get_headless_dropdown_props(is_open, active_index):
    return {
        'buttonProps': {
            'aria-expanded': 'true' if is_open else 'false',
            'aria-haspopup': 'true'
        },
        'menuProps': {
            'role': 'menu',
            'hidden': not is_open
        }
    }`
    },
    testCases: [
      { input: 'true, 0', expectedOutput: '{"buttonProps":{"aria-expanded":"true","aria-haspopup":"true"},"menuProps":{"role":"menu","hidden":false}}', isHidden: false },
      { input: 'false, -1', expectedOutput: '{"buttonProps":{"aria-expanded":"false","aria-haspopup":"true"},"menuProps":{"role":"menu","hidden":true}}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-019",
    title: "useId Accessible Label Association",
    slug: "fe-use-id-association",
    tier: 4,
    section: "Advanced React",
    topic: "useId",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-advanced", "useId", "accessibility"],
    xpReward: 50,
    description: `## useId Accessible Label Association

### Description
React 18's \`useId()\` generates unique IDs stable across server and client renders to associate form inputs with labels and hint text.
Given a base generated ID \`":r1:"\`, format linked IDs for input, label, and description: \`{ inputId, labelId, descId }\`.

### Learning Objectives
- Prevent duplicate ID collisions in component instances.

### Example
\`Input: ":r1:"\`
\`Output: { inputId: ":r1:-input", labelId: ":r1:-label", descId: ":r1:-desc" }\``,
    starterCode: {
      javascript: `function formatUseIdBindings(baseId) {
  return {
    inputId: \`\${baseId}-input\`,
    labelId: \`\${baseId}-label\`,
    descId: \`\${baseId}-desc\`
  };
}`,
      python: `def format_use_id_bindings(base_id):
    return {
        'inputId': f'{base_id}-input',
        'labelId': f'{base_id}-label',
        'descId': f'{base_id}-desc'
    }`
    },
    testCases: [
      { input: '":r1:"', expectedOutput: '{"inputId":":r1:-input","labelId":":r1:-label","descId":":r1:-desc"}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-020",
    title: "Design System Theme Variable Generator",
    slug: "fe-design-system-theme-gen",
    tier: 4,
    section: "Advanced React",
    topic: "Design Systems",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Design Systems",
    category: "frontend",
    tags: ["fe-advanced", "design-systems", "tokens"],
    xpReward: 100,
    description: `## Design System Theme Variable Generator

### Description
Generate design tokens mapping semantic colors to theme values: \`{ [tokenName]: cssColor }\`.

### Learning Objectives
- Structure token architectures for design systems.

### Example
\`Input: "dark", { light: { bg: "#fff", text: "#000" }, dark: { bg: "#000", text: "#fff" } }\`
\`Output: { bg: "#000", text: "#fff" }\``,
    starterCode: {
      javascript: `function getThemeTokens(mode, themes) {
  return themes[mode] || themes['light'];
}`,
      python: `def get_theme_tokens(mode, themes):
    return themes.get(mode, themes.get('light', {}))`
    },
    testCases: [
      { input: '"dark", {"light":{"bg":"#fff","text":"#000"},"dark":{"bg":"#000","text":"#fff"}}', expectedOutput: '{"bg":"#000","text":"#fff"}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-021",
    title: "Suspense Fallback State Resolver",
    slug: "fe-suspense-fallback-state",
    tier: 4,
    section: "Advanced React",
    topic: "Suspense",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-advanced", "suspense", "react"],
    xpReward: 100,
    description: `## Suspense Fallback State Resolver

### Description
React \`<Suspense fallback={<Skeleton />}>\` displays fallback UI while lazy components or data-fetching promises are pending.
Given status \`"pending" | "resolved" | "rejected"\`, return whether to render fallback or children.

### Learning Objectives
- Understand promise throw/catch mechanics inside Suspense boundaries.

### Example
\`Input: "pending"\`
\`Output: { render: "fallback" }\`
\`Input: "resolved"\`
\`Output: { render: "children" }\``,
    starterCode: {
      javascript: `function resolveSuspense(status) {
  return status === 'pending' ? { render: 'fallback' } : { render: 'children' };
}`,
      python: `def resolve_suspense(status):
    return {'render': 'fallback'} if status == 'pending' else {'render': 'children'}`
    },
    testCases: [
      { input: '"pending"', expectedOutput: '{"render":"fallback"}', isHidden: false },
      { input: '"resolved"', expectedOutput: '{"render":"children"}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-022",
    title: "Redux Middleware Pipeline Logger",
    slug: "fe-redux-middleware-pipeline",
    tier: 4,
    section: "Advanced React",
    topic: "Redux",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State Management",
    category: "frontend",
    tags: ["fe-advanced", "redux", "middleware"],
    xpReward: 100,
    description: `## Redux Middleware Pipeline Logger

### Description
Redux middleware intercepts dispatched actions \`(store) => (next) => (action)\` allowing logging, analytics, or asynchronous actions (redux-thunk).
Given action and previous state, compute logged event summary: \`{ actionType: string, prevState: any, nextState: any }\`.

### Learning Objectives
- Implement action dispatch interception pipelines.

### Example
\`Input: { type: "INC" }, { count: 0 }, { count: 1 }\`
\`Output: { actionType: "INC", prev: 0, next: 1 }\``,
    starterCode: {
      javascript: `function logMiddlewareAction(action, prevState, nextState) {
  return {
    actionType: action.type,
    prev: prevState.count,
    next: nextState.count
  };
}`,
      python: `def log_middleware_action(action, prev_state, next_state):
    return {
        'actionType': action.get('type'),
        'prev': prev_state.get('count'),
        'next': next_state.get('count')
    }`
    },
    testCases: [
      { input: '{"type":"INC"}, {"count":0}, {"count":1}', expectedOutput: '{"actionType":"INC","prev":0,"next":1}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-023",
    title: "Micro Frontend Event Broker",
    slug: "fe-micro-frontend-broker",
    tier: 4,
    section: "Advanced React",
    topic: "Micro Frontends",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Architecture",
    category: "frontend",
    tags: ["fe-advanced", "micro-frontends", "pubsub"],
    xpReward: 200,
    description: `## Micro Frontend Event Broker

### Description
Micro Frontends communicate across isolated application boundaries using a custom event bus or window postMessage.
Given registered micro apps and a broadcast message, return receipt confirmations: \`{ broadcasted: boolean, recipients: string[] }\`.

### Learning Objectives
- Facilitate decoupled cross-application communication in micro frontend architectures.

### Example
\`Input: ["cartApp", "navApp", "authApp"], "USER_LOGIN"\`
\`Output: { broadcasted: true, recipients: ["cartApp", "navApp", "authApp"] }\``,
    starterCode: {
      javascript: `function broadcastMicroFrontend(microApps, message) {
  return {
    broadcasted: true,
    recipients: microApps
  };
}`,
      python: `def broadcast_micro_frontend(micro_apps, message):
    return {
        'broadcasted': True,
        'recipients': list(micro_apps)
    }`
    },
    testCases: [
      { input: '["cartApp", "navApp", "authApp"], "USER_LOGIN"', expectedOutput: '{"broadcasted":true,"recipients":["cartApp","navApp","authApp"]}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-024",
    title: "useDeferredValue Stale Lag Detector",
    slug: "fe-use-deferred-value-lag",
    tier: 4,
    section: "Advanced React",
    topic: "Concurrent Rendering",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Concurrent Mode",
    category: "frontend",
    tags: ["fe-advanced", "useDeferredValue", "performance"],
    xpReward: 100,
    description: `## useDeferredValue Stale Lag Detector

### Description
\`useDeferredValue(val)\` defers updating secondary UI until main updates have completed, causing deferred value to lag behind current value while rendering is busy.
Given current and deferred values, return \`{ isStale: boolean }\`.

### Learning Objectives
- Detect when deferred content is lagging to render opacity dimming overlays.

### Example
\`Input: "search-query", "search"\`
\`Output: { isStale: true }\`
\`Input: "done", "done"\`
\`Output: { isStale: false }\``,
    starterCode: {
      javascript: `function checkDeferredStaleness(currentVal, deferredVal) {
  return { isStale: currentVal !== deferredVal };
}`,
      python: `def check_deferred_staleness(current_val, deferred_val):
    return {'isStale': current_val != deferred_val}`
    },
    testCases: [
      { input: '"search-query", "search"', expectedOutput: '{"isStale":true}', isHidden: false },
      { input: '"done", "done"', expectedOutput: '{"isStale":false}', isHidden: false }
    ]
  },
  {
    id: "fe-adv-025",
    title: "React Component Render Counter Hook",
    slug: "fe-react-render-counter-hook",
    tier: 4,
    section: "Advanced React",
    topic: "React Performance Optimization",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-advanced", "performance", "hooks"],
    xpReward: 50,
    description: `## React Component Render Counter Hook

### Description
Track component re-render frequency using a ref counter: increments on every render cycle.
Given previous render count, return updated render count.

### Learning Objectives
- Instrument components to identify runaway re-renders.

### Example
\`Input: 4\`
\`Output: 5\``,
    starterCode: {
      javascript: `function incrementRenderCount(prevCount) {
  return prevCount + 1;
}`,
      python: `def increment_render_count(prev_count):
    return prev_count + 1`
    },
    testCases: [
      { input: '4', expectedOutput: '5', isHidden: false },
      { input: '0', expectedOutput: '1', isHidden: false }
    ]
  }
];

module.exports = feTier4AdvancedReact;
