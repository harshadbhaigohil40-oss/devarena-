/**
 * Tier 3 — React (32 Topics & Coding Challenges)
 * Node: fe-react
 * Difficulty: Medium
 */

const feTier3React = [
  // ─── React Hooks & Core Architecture (1-12) ───
  {
    id: "fe-react-001",
    title: "useState Functional Updater Evaluator",
    slug: "fe-use-state-functional-updater",
    tier: 3,
    section: "React",
    topic: "useState",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State",
    category: "frontend",
    tags: ["fe-react", "react", "hooks", "useState"],
    xpReward: 100,
    description: `## useState Functional Updater Evaluator

### Description
In React, calling \`setCount(prev => prev + 1)\` queues functional state updates. Multiple queued updates execute sequentially against the accumulated value, whereas direct value updates (\`setCount(10)\`) overwrite the value. Simulate this queue where functional updates are represented as operation strings (e.g. \`"+1"\`, \`"-2"\`, \`"*2"\`) and direct assignments as raw numbers.

### Learning Objectives
- Process queued state mutations sequentially, distinguishing functional updates from direct assignments.

### Example
\`Input: 0, ["+1", 10, "+1"]\`
\`Output: 11\` (0 + 1 = 1; direct set to 10; 10 + 1 = 11)`,
    starterCode: {
      javascript: `function evaluateStateUpdates(initialState, updates) {
  let state = initialState;
  for (const u of updates) {
    if (typeof u === 'string' && u.startsWith('+')) {
      state += Number(u.slice(1));
    } else if (typeof u === 'string' && u.startsWith('-')) {
      state -= Number(u.slice(1));
    } else if (typeof u === 'string' && u.startsWith('*')) {
      state *= Number(u.slice(1));
    } else {
      state = Number(u);
    }
  }
  return state;
}`,
      python: `def evaluate_state_updates(initial_state, updates):
    state = initial_state
    for u in updates:
        if isinstance(u, str) and u.startswith('+'):
            state += int(u[1:])
        elif isinstance(u, str) and u.startswith('-'):
            state -= int(u[1:])
        elif isinstance(u, str) and u.startswith('*'):
            state *= int(u[1:])
        else:
            state = int(u)
    return state`
    },
    testCases: [
      { input: '0, ["+1", "+2"]', expectedOutput: '3', isHidden: false },
      { input: '0, ["+1", 10, "+1"]', expectedOutput: '11', isHidden: false },
      { input: '5, ["*2", "-3"]', expectedOutput: '7', isHidden: true }
    ]
  },
  {
    id: "fe-react-002",
    title: "useEffect Dependency Change Detector",
    slug: "fe-use-effect-dep-change",
    tier: 3,
    section: "React",
    topic: "useEffect",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Hooks",
    category: "frontend",
    tags: ["fe-react", "react", "hooks", "useEffect"],
    xpReward: 100,
    description: `## useEffect Dependency Change Detector

### Description
React's \`useEffect(fn, deps)\` runs on initial mount and re-runs on subsequent renders only if any item in the \`deps\` array has changed via shallow comparison (\`Object.is\`).

### Learning Objectives
- Compare previous and current dependency arrays using \`Object.is\` shallow comparison.
- Return \`true\` if effect should fire (deps changed or no deps passed).

### Example
\`Input: [1, "hello"], [1, "hello"]\`
\`Output: false\` (no change)
\`Input: [1, "hello"], [1, "world"]\`
\`Output: true\` (second dependency changed)`,
    starterCode: {
      javascript: `function shouldEffectRun(prevDeps, nextDeps) {
  if (!prevDeps || !nextDeps) return true;
  if (prevDeps.length !== nextDeps.length) return true;
  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) return true;
  }
  return false;
}`,
      python: `def should_effect_run(prev_deps, next_deps):
    if prev_deps is None or next_deps is None:
        return True
    if len(prev_deps) != len(next_deps):
        return True
    for p, n in zip(prev_deps, next_deps):
        if p != n:
            return True
    return False`
    },
    testCases: [
      { input: '[1, "hello"], [1, "hello"]', expectedOutput: 'false', isHidden: false },
      { input: '[1, "hello"], [1, "world"]', expectedOutput: 'true', isHidden: false },
      { input: 'null, [1]', expectedOutput: 'true', isHidden: true }
    ]
  },
  {
    id: "fe-react-003",
    title: "React Router Route Parameters Extractor",
    slug: "fe-react-router-params",
    tier: 3,
    section: "React",
    topic: "React Router",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Routing",
    category: "frontend",
    tags: ["fe-react", "react-router", "routing"],
    xpReward: 100,
    description: `## React Router Route Parameters Extractor

### Description
React Router matches parameterized paths like \`"/challenges/:category/:slug"\` against actual URL paths like \`"/challenges/frontend/fe-html-basics"\`, extracting named parameters into a params dictionary.

### Learning Objectives
- Parse route path templates and extract dynamic parameters.

### Example
\`Input: "/challenges/:category/:slug", "/challenges/frontend/fe-html-basics"\`
\`Output: { category: "frontend", slug: "fe-html-basics" }\``,
    starterCode: {
      javascript: `function extractRouteParams(pattern, pathname) {
  const patParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = pathParts[i];
    } else if (patParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}`,
      python: `def extract_route_params(pattern, pathname):
    pat_parts = [p for p in pattern.split('/') if p]
    path_parts = [p for p in pathname.split('/') if p]
    if len(pat_parts) != len(path_parts):
        return None
    params = {}
    for pat, path in zip(pat_parts, path_parts):
        if pat.startswith(':'):
            params[pat[1:]] = path
        elif pat != path:
            return None
    return params`
    },
    testCases: [
      { input: '"/challenges/:category/:slug", "/challenges/frontend/fe-html-basics"', expectedOutput: '{"category":"frontend","slug":"fe-html-basics"}', isHidden: false },
      { input: '"/user/:id", "/user/42"', expectedOutput: '{"id":"42"}', isHidden: false },
      { input: '"/user/:id", "/posts/42"', expectedOutput: 'null', isHidden: true }
    ]
  },
  {
    id: "fe-react-004",
    title: "Optimistic UI State Reducer",
    slug: "fe-optimistic-ui-reducer",
    tier: 3,
    section: "React",
    topic: "Optimistic UI",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Optimistic UI",
    category: "frontend",
    tags: ["fe-react", "optimistic-ui", "state"],
    xpReward: 100,
    description: `## Optimistic UI State Reducer

### Description
Optimistic updates apply user actions immediately to UI before server confirmation. If the server request succeeds, the state is committed; if it fails, state rolls back to a saved snapshot.

### Learning Objectives
- Manage snapshot checkpoints and handle \`APPLY\`, \`SUCCESS\`, and \`ROLLBACK\` events.

### Example
\`Input: { likes: 10, snapshot: null }, { type: "APPLY_LIKE" }\`
\`Output: { likes: 11, snapshot: 10 }\`
\`Input: { likes: 11, snapshot: 10 }, { type: "ROLLBACK" }\`
\`Output: { likes: 10, snapshot: null }\``,
    starterCode: {
      javascript: `function optimisticReducer(state, action) {
  switch (action.type) {
    case 'APPLY_LIKE':
      return { likes: state.likes + 1, snapshot: state.likes };
    case 'SUCCESS':
      return { likes: state.likes, snapshot: null };
    case 'ROLLBACK':
      return { likes: state.snapshot !== null ? state.snapshot : state.likes, snapshot: null };
    default:
      return state;
  }
}`,
      python: `def optimistic_reducer(state, action):
    a_type = action.get('type')
    likes = state.get('likes', 0)
    snapshot = state.get('snapshot')
    if a_type == 'APPLY_LIKE':
        return {'likes': likes + 1, 'snapshot': likes}
    elif a_type == 'SUCCESS':
        return {'likes': likes, 'snapshot': None}
    elif a_type == 'ROLLBACK':
        return {'likes': snapshot if snapshot is not None else likes, 'snapshot': None}
    return state`
    },
    testCases: [
      { input: '{"likes":10,"snapshot":null}, {"type":"APPLY_LIKE"}', expectedOutput: '{"likes":11,"snapshot":10}', isHidden: false },
      { input: '{"likes":11,"snapshot":10}, {"type":"ROLLBACK"}', expectedOutput: '{"likes":10,"snapshot":null}', isHidden: false },
      { input: '{"likes":11,"snapshot":10}, {"type":"SUCCESS"}', expectedOutput: '{"likes":11,"snapshot":null}', isHidden: true }
    ]
  },
  {
    id: "fe-react-005",
    title: "Context API Value Propagation Tree",
    slug: "fe-context-api-tree",
    tier: 3,
    section: "React",
    topic: "Context API",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Context",
    category: "frontend",
    tags: ["fe-react", "context", "react"],
    xpReward: 100,
    description: `## Context API Value Propagation Tree

### Description
React Context allows child components to read the nearest parent \`<ThemeContext.Provider value={...}>\`. If no Provider is found above in the component tree, it falls back to the context default value.

### Learning Objectives
- Resolve context value by climbing component parent hierarchy.

### Example
\`Input: [{ id: "root", providerValue: "light" }, { id: "card", providerValue: null }, { id: "btn", providerValue: null }], "default-theme"\`
\`Output: "light"\` (inherits from root Provider)`,
    starterCode: {
      javascript: `function resolveContextValue(ancestors, defaultValue) {
  // Search from closest ancestor backwards to root
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (ancestors[i].providerValue !== null && ancestors[i].providerValue !== undefined) {
      return ancestors[i].providerValue;
    }
  }
  return defaultValue;
}`,
      python: `def resolve_context_value(ancestors, default_value):
    for node in reversed(ancestors):
        val = node.get('providerValue')
        if val is not None:
            return val
    return default_value`
    },
    testCases: [
      { input: '[{"id":"root","providerValue":"light"},{"id":"card","providerValue":null}], "dark"', expectedOutput: '"light"', isHidden: false },
      { input: '[{"id":"root","providerValue":null}], "default-val"', expectedOutput: '"default-val"', isHidden: false }
    ]
  },
  {
    id: "fe-react-006",
    title: "Error Boundary Error State Catcher",
    slug: "fe-error-boundary-state",
    tier: 3,
    section: "React",
    topic: "Error Boundaries",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "error-boundary", "react"],
    xpReward: 100,
    description: `## Error Boundary Error State Catcher

### Description
Class components implementing \`static getDerivedStateFromError(error)\` update state to display fallback UI when a descendant component throws an unhandled rendering error.

### Learning Objectives
- Transition error boundary state between normal and error views.

### Example
\`Input: { hasError: false, error: null }, "TypeError: Cannot read property 'map' of undefined"\`
\`Output: { hasError: true, error: "TypeError: Cannot read property 'map' of undefined" }\``,
    starterCode: {
      javascript: `function getDerivedStateFromError(errorMsg) {
  return {
    hasError: true,
    error: errorMsg
  };
}`,
      python: `def get_derived_state_from_error(error_msg):
    return {
        'hasError': True,
        'error': error_msg
    }`
    },
    testCases: [
      { input: '"Network error"', expectedOutput: '{"hasError":true,"error":"Network error"}', isHidden: false }
    ]
  },

  // ─── 20 React Practice Questions (7-26) ───
  {
    id: "fe-react-007",
    title: "Build a Counter Component Hook",
    slug: "fe-react-counter-component",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Hooks",
    category: "frontend",
    tags: ["fe-react", "counter", "practice"],
    xpReward: 100,
    description: `## Build a Counter Component Hook

### Description
Implement the core logic for a \`useCounter(initialValue, min, max)\` hook returning current count and dispatch functions: \`increment\`, \`decrement\`, \`reset\`.

### Learning Objectives
- Manage state bounds and custom hook actions.

### Example
\`Input: 0, 0, 10, ["inc", "inc", "dec"]\`
\`Output: 1\``,
    starterCode: {
      javascript: `function simulateCounterHook(initialVal, min, max, actions) {
  let count = initialVal;
  for (const act of actions) {
    if (act === 'inc') count = Math.min(max, count + 1);
    else if (act === 'dec') count = Math.max(min, count - 1);
    else if (act === 'reset') count = initialVal;
  }
  return count;
}`,
      python: `def simulate_counter_hook(initial_val, min_val, max_val, actions):
    count = initial_val
    for act in actions:
        if act == 'inc':
            count = min(max_val, count + 1)
        elif act == 'dec':
            count = max(min_val, count - 1)
        elif act == 'reset':
            count = initial_val
    return count`
    },
    testCases: [
      { input: '0, 0, 10, ["inc", "inc", "dec"]', expectedOutput: '1', isHidden: false },
      { input: '5, 0, 10, ["inc", "reset"]', expectedOutput: '5', isHidden: false }
    ]
  },
  {
    id: "fe-react-008",
    title: "Build a Searchable List Component",
    slug: "fe-react-searchable-list",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "search", "list"],
    xpReward: 100,
    description: `## Build a Searchable List Component

### Description
Given a list of strings and a search input value, filter the list in real-time, highlighting matches or returning matching subsets.

### Learning Objectives
- Combine \`useState\` search queries with derived filtered array calculations.

### Example
\`Input: ["JavaScript", "TypeScript", "Python", "Rust"], "script"\`
\`Output: ["JavaScript", "TypeScript"]\``,
    starterCode: {
      javascript: `function filterSearchableList(items, searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  return items.filter(item => item.toLowerCase().includes(term));
}`,
      python: `def filter_searchable_list(items, search_term):
    term = search_term.lower().strip()
    return [i for i in items if term in i.lower()]`
    },
    testCases: [
      { input: '["JavaScript", "TypeScript", "Python", "Rust"], "script"', expectedOutput: '["JavaScript","TypeScript"]', isHidden: false },
      { input: '["React", "Vue", "Angular"], "a"', expectedOutput: '["React","Angular"]', isHidden: false }
    ]
  },
  {
    id: "fe-react-009",
    title: "Build a Pagination Component Window Sizer",
    slug: "fe-react-pagination-component",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Pagination",
    category: "frontend",
    tags: ["fe-react", "pagination", "ui"],
    xpReward: 100,
    description: `## Build a Pagination Component Window Sizer

### Description
When displaying pagination numbers across large total pages (e.g. 20 pages), display a sliding window of page numbers centered around \`currentPage\` with at most \`windowSize\` buttons.

### Learning Objectives
- Calculate dynamic pagination page buttons bounded by total pages.

### Example
\`Input: 20, 5, 5\` (20 total pages, current page 5, window 5)
\`Output: [3, 4, 5, 6, 7]\``,
    starterCode: {
      javascript: `function getPaginationWindow(totalPages, currentPage, windowSize = 5) {
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + windowSize - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - windowSize + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}`,
      python: `def get_pagination_window(total_pages, current_page, window_size=5):
    half = window_size // 2
    start = max(1, current_page - half)
    end = start + window_size - 1
    if end > total_pages:
        end = total_pages
        start = max(1, end - window_size + 1)
    return list(range(start, end + 1))`
    },
    testCases: [
      { input: '20, 5, 5', expectedOutput: '[3,4,5,6,7]', isHidden: false },
      { input: '5, 1, 5', expectedOutput: '[1,2,3,4,5]', isHidden: false },
      { input: '20, 19, 5', expectedOutput: '[16,17,18,19,20]', isHidden: true }
    ]
  },
  {
    id: "fe-react-010",
    title: "Build a Multi-Step Form Wizard Controller",
    slug: "fe-react-multi-step-form",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Forms",
    category: "frontend",
    tags: ["fe-react", "forms", "wizard"],
    xpReward: 100,
    description: `## Build a Multi-Step Form Wizard Controller

### Description
A checkout wizard navigates through steps (\`"profile"\`, \`"shipping"\`, \`"payment"\`, \`"review"\`).
Given current step, action (\`"next"\` or \`"prev"\`), and step validation boolean, return updated step and completion status.

### Learning Objectives
- Guard step transitions with validation gates.

### Example
\`Input: "shipping", "next", true, ["profile", "shipping", "payment", "review"]\`
\`Output: { currentStep: "payment", isFirst: false, isLast: false }\``,
    starterCode: {
      javascript: `function navigateWizard(currentStep, action, isValid, steps) {
  const idx = steps.indexOf(currentStep);
  if (action === 'next' && !isValid) {
    return { currentStep, isFirst: idx === 0, isLast: idx === steps.length - 1, error: 'Step validation failed' };
  }
  const nextIdx = action === 'next' ? Math.min(steps.length - 1, idx + 1) : Math.max(0, idx - 1);
  return {
    currentStep: steps[nextIdx],
    isFirst: nextIdx === 0,
    isLast: nextIdx === steps.length - 1
  };
}`,
      python: `def navigate_wizard(current_step, action, is_valid, steps):
    idx = steps.index(current_step)
    if action == 'next' and not is_valid:
        return {'currentStep': current_step, 'isFirst': idx == 0, 'isLast': idx == len(steps) - 1, 'error': 'Step validation failed'}
    next_idx = min(len(steps) - 1, idx + 1) if action == 'next' else max(0, idx - 1)
    return {
        'currentStep': steps[next_idx],
        'isFirst': next_idx == 0,
        'isLast': next_idx == len(steps) - 1
    }`
    },
    testCases: [
      { input: '"shipping", "next", true, ["profile", "shipping", "payment", "review"]', expectedOutput: '{"currentStep":"payment","isFirst":false,"isLast":false}', isHidden: false },
      { input: '"shipping", "next", false, ["profile", "shipping", "payment"]', expectedOutput: '{"currentStep":"shipping","isFirst":false,"isLast":false,"error":"Step validation failed"}', isHidden: false }
    ]
  },
  {
    id: "fe-react-011",
    title: "Build a Shopping Cart State Reducer",
    slug: "fe-react-shopping-cart",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State",
    category: "frontend",
    tags: ["fe-react", "cart", "ecommerce"],
    xpReward: 100,
    description: `## Build a Shopping Cart State Reducer

### Description
Manage shopping cart items:
- \`ADD_ITEM\`: adds new item or increments quantity if already in cart
- \`REMOVE_ITEM\`: decrements quantity or removes if quantity reaches 0
Compute updated items and total cart price.

### Learning Objectives
- Implement complex nested object arithmetic inside immutable state updates.

### Example
\`Input: [], { type: "ADD", item: { id: 1, name: "Keyboard", price: 50 } }\`
\`Output: { items: [{ id: 1, name: "Keyboard", price: 50, quantity: 1 }], total: 50 }\``,
    starterCode: {
      javascript: `function cartReducer(stateItems, action) {
  let items = [...stateItems];
  if (action.type === 'ADD') {
    const existing = items.find(i => i.id === action.item.id);
    if (existing) {
      items = items.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      items.push({ ...action.item, quantity: 1 });
    }
  } else if (action.type === 'REMOVE') {
    items = items
      .map(i => i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0);
  }
  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  return { items, total };
}`,
      python: `def cart_reducer(state_items, action):
    items = [dict(i) for i in state_items]
    a_type = action.get('type')
    if a_type == 'ADD':
        item = action.get('item')
        found = False
        for i in items:
            if i['id'] == item['id']:
                i['quantity'] += 1
                found = True
                break
        if not found:
            new_item = dict(item)
            new_item['quantity'] = 1
            items.append(new_item)
    elif a_type == 'REMOVE':
        remove_id = action.get('id')
        new_items = []
        for i in items:
            if i['id'] == remove_id:
                i['quantity'] -= 1
                if i['quantity'] > 0:
                    new_items.append(i)
            else:
                new_items.append(i)
        items = new_items
    total = sum(i['price'] * i['quantity'] for i in items)
    return {'items': items, 'total': total}`
    },
    testCases: [
      { input: '[], {"type":"ADD","item":{"id":1,"name":"Keyboard","price":50}}', expectedOutput: '{"items":[{"id":1,"name":"Keyboard","price":50,"quantity":1}],"total":50}', isHidden: false },
      { input: '[{"id":1,"name":"Keyboard","price":50,"quantity":1}], {"type":"ADD","item":{"id":1,"name":"Keyboard","price":50}}', expectedOutput: '{"items":[{"id":1,"name":"Keyboard","price":50,"quantity":2}],"total":100}', isHidden: false },
      { input: '[{"id":1,"name":"Keyboard","price":50,"quantity":1}], {"type":"REMOVE","id":1}', expectedOutput: '{"items":[],"total":0}', isHidden: true }
    ]
  },
  {
    id: "fe-react-012",
    title: "Build a Product Details Variant Selector",
    slug: "fe-react-variant-selector",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "ecommerce", "variants"],
    xpReward: 100,
    description: `## Build a Product Details Variant Selector

### Description
E-commerce products have combinations of color and size variants. Given an inventory list of \`[{ color: "black", size: "M", sku: "101", inStock: true }]\` and user selections, find matching SKU and stock status.

### Learning Objectives
- Match composite key states against multi-attribute matrix records.

### Example
\`Input: [{ color: "black", size: "M", sku: "101", inStock: true }], "black", "M"\`
\`Output: { found: true, sku: "101", inStock: true }\``,
    starterCode: {
      javascript: `function selectVariant(variants, selectedColor, selectedSize) {
  const match = variants.find(v => v.color === selectedColor && v.size === selectedSize);
  if (!match) return { found: false, sku: null, inStock: false };
  return { found: true, sku: match.sku, inStock: match.inStock };
}`,
      python: `def select_variant(variants, selected_color, selected_size):
    for v in variants:
        if v.get('color') == selected_color and v.get('size') == selected_size:
            return {'found': True, 'sku': v.get('sku'), 'inStock': v.get('inStock', False)}
    return {'found': False, 'sku': None, 'inStock': False}`
    },
    testCases: [
      { input: '[{"color":"black","size":"M","sku":"101","inStock":true}], "black", "M"', expectedOutput: '{"found":true,"sku":"101","inStock":true}', isHidden: false },
      { input: '[{"color":"black","size":"M","sku":"101","inStock":true}], "red", "L"', expectedOutput: '{"found":false,"sku":null,"inStock":false}', isHidden: false }
    ]
  },
  {
    id: "fe-react-013",
    title: "Build an Infinite Scroll Page Appender",
    slug: "fe-react-infinite-scroll",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Pagination",
    category: "frontend",
    tags: ["fe-react", "infinite-scroll", "lists"],
    xpReward: 100,
    description: `## Build an Infinite Scroll Page Appender

### Description
In infinite scrolling, reaching the viewport bottom appends the next page of items. Given existing items, new page items, and total available records, return updated items array and \`hasMore\` flag.

### Learning Objectives
- Deduplicate and append new pages to infinite feed list.

### Example
\`Input: [1, 2], [3, 4], 6\`
\`Output: { items: [1, 2, 3, 4], hasMore: true }\``,
    starterCode: {
      javascript: `function appendInfiniteScroll(existingItems, newItems, totalRecords) {
  const set = new Set(existingItems);
  for (const item of newItems) set.add(item);
  const items = Array.from(set);
  return {
    items,
    hasMore: items.length < totalRecords
  };
}`,
      python: `def append_infinite_scroll(existing_items, new_items, total_records):
    combined = list(existing_items)
    for x in new_items:
        if x not in combined:
            combined.append(x)
    return {'items': combined, 'hasMore': len(combined) < total_records}`
    },
    testCases: [
      { input: '[1, 2], [3, 4], 6', expectedOutput: '{"items":[1,2,3,4],"hasMore":true}', isHidden: false },
      { input: '[1, 2, 3, 4], [5, 6], 6', expectedOutput: '{"items":[1,2,3,4,5,6],"hasMore":false}', isHidden: false }
    ]
  },
  {
    id: "fe-react-014",
    title: "Build a Theme Switcher State Context",
    slug: "fe-react-theme-switcher",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Context",
    category: "frontend",
    tags: ["fe-react", "theme", "context"],
    xpReward: 50,
    description: `## Build a Theme Switcher State Context

### Description
Toggle theme between \`"light"\` and \`"dark"\` mode, returning the updated theme and corresponding document dataset class attribute.

### Learning Objectives
- Toggle binary UI state and apply appropriate CSS class tokens.

### Example
\`Input: "light"\`
\`Output: { theme: "dark", htmlClass: "dark" }\``,
    starterCode: {
      javascript: `function toggleTheme(currentTheme) {
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  return {
    theme: nextTheme,
    htmlClass: nextTheme
  };
}`,
      python: `def toggle_theme(current_theme):
    next_theme = 'dark' if current_theme == 'light' else 'light'
    return {'theme': next_theme, 'htmlClass': next_theme}`
    },
    testCases: [
      { input: '"light"', expectedOutput: '{"theme":"dark","htmlClass":"dark"}', isHidden: false },
      { input: '"dark"', expectedOutput: '{"theme":"light","htmlClass":"light"}', isHidden: false }
    ]
  },
  {
    id: "fe-react-015",
    title: "Build an Authentication Protected Route Guard",
    slug: "fe-react-protected-route-guard",
    tier: 3,
    section: "React",
    topic: "Protected Routes",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Routing",
    category: "frontend",
    tags: ["fe-react", "auth", "routing"],
    xpReward: 100,
    description: `## Build an Authentication Protected Route Guard

### Description
Protected routes check authentication status and user roles. If not authenticated, redirect to \`"/login?redirect=" + path\`. If authenticated but role is insufficient, redirect to \`"/unauthorized"\`. If valid, allow render.

### Learning Objectives
- Model React Router navigation guards and authorization gates.

### Example
\`Input: { isAuthenticated: false }, "admin", "/admin/dashboard"\`
\`Output: { canActivate: false, redirectUrl: "/login?redirect=/admin/dashboard" }\``,
    starterCode: {
      javascript: `function checkRouteAuth(user, requiredRole, targetPath) {
  if (!user || !user.isAuthenticated) {
    return { canActivate: false, redirectUrl: \`/login?redirect=\${targetPath}\` };
  }
  if (requiredRole && user.role !== requiredRole) {
    return { canActivate: false, redirectUrl: '/unauthorized' };
  }
  return { canActivate: true, redirectUrl: null };
}`,
      python: `def check_route_auth(user, required_role, target_path):
    if not user or not user.get('isAuthenticated'):
        return {'canActivate': False, 'redirectUrl': f'/login?redirect={target_path}'}
    if required_role and user.get('role') != required_role:
        return {'canActivate': False, 'redirectUrl': '/unauthorized'}
    return {'canActivate': True, 'redirectUrl': None}`
    },
    testCases: [
      { input: '{"isAuthenticated":false}, "admin", "/admin/dashboard"', expectedOutput: '{"canActivate":false,"redirectUrl":"/login?redirect=/admin/dashboard"}', isHidden: false },
      { input: '{"isAuthenticated":true,"role":"user"}, "admin", "/admin"', expectedOutput: '{"canActivate":false,"redirectUrl":"/unauthorized"}', isHidden: false },
    ]
  },
  {
    id: "fe-react-016",
    title: "Build a Debounced Search Hook State",
    slug: "fe-react-debounced-search-hook",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Hooks",
    category: "frontend",
    tags: ["fe-react", "hooks", "search"],
    xpReward: 100,
    description: `## Build a Debounced Search Hook State

### Description
In React search inputs, \`useDebounce(searchTerm, delay)\` stores the immediate typing value in input state but only updates the debounced query after \`delay\` ms of inactivity.
Given sequence of keystrokes with timestamps, return when the debounced query updates.

### Learning Objectives
- Coordinate fast interactive UI state with slow deferred search requests.

### Example
\`Input: [{ key: "r", time: 0 }, { key: "re", time: 50 }, { key: "rea", time: 100 }], 300\`
\`Output: { finalQuery: "rea", updateTime: 400 }\``,
    starterCode: {
      javascript: `function simulateDebouncedSearch(keystrokes, delay) {
  if (keystrokes.length === 0) return { finalQuery: '', updateTime: 0 };
  const last = keystrokes[keystrokes.length - 1];
  return {
    finalQuery: last.key,
    updateTime: last.time + delay
  };
}`,
      python: `def simulate_debounced_search(keystrokes, delay):
    if not keystrokes:
        return {'finalQuery': '', 'updateTime': 0}
    last = keystrokes[-1]
    return {
        'finalQuery': last['key'],
        'updateTime': last['time'] + delay
    }`
    },
    testCases: [
      { input: '[{"key":"r","time":0},{"key":"re","time":50},{"key":"rea","time":100}], 300', expectedOutput: '{"finalQuery":"rea","updateTime":400}', isHidden: false }
    ]
  },
  {
    id: "fe-react-017",
    title: "Build a Dashboard Analytics Aggregator",
    slug: "fe-react-dashboard-aggregator",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "dashboard", "state"],
    xpReward: 100,
    description: `## Build a Dashboard Analytics Aggregator

### Description
Aggregate raw analytics events \`[{ type: "visit", value: 1 }, { type: "signup", value: 1 }]\` into dashboard metric cards: \`{ totalVisits, totalSignups, conversionRate }\`.

### Learning Objectives
- Compute derived summary metrics for dashboard visualization.

### Example
\`Input: [{ type: "visit" }, { type: "visit" }, { type: "signup" }]\`
\`Output: { visits: 2, signups: 1, conversionPercent: 50 }\``,
    starterCode: {
      javascript: `function aggregateDashboard(events) {
  let visits = 0, signups = 0;
  for (const e of events) {
    if (e.type === 'visit') visits++;
    if (e.type === 'signup') signups++;
  }
  const conversionPercent = visits > 0 ? Math.round((signups / visits) * 100) : 0;
  return { visits, signups, conversionPercent };
}`,
      python: `def aggregate_dashboard(events):
    visits = sum(1 for e in events if e.get('type') == 'visit')
    signups = sum(1 for e in events if e.get('type') == 'signup')
    conv = round((signups / visits) * 100) if visits > 0 else 0
    return {'visits': visits, 'signups': signups, 'conversionPercent': conv}`
    },
    testCases: [
      { input: '[{"type":"visit"},{"type":"visit"},{"type":"signup"}]', expectedOutput: '{"visits":2,"signups":1,"conversionPercent":50}', isHidden: false }
    ]
  },
  {
    id: "fe-react-018",
    title: "Virtual DOM Tree Reconciliation Diff",
    slug: "fe-react-vdom-reconciliation",
    tier: 3,
    section: "React",
    topic: "Reconciliation",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "vdom", "reconciliation"],
    xpReward: 100,
    description: `## Virtual DOM Tree Reconciliation Diff

### Description
React's reconciliation algorithm compares old and new VNode trees. If tags differ, it replaces the subtree; if props differ, it updates props; if children differ, it re-keys or patches children.
Given old and new node representations, determine operation: \`"REPLACE"\` | \`"UPDATE_PROPS"\` | \`"NOOP"\`.

### Learning Objectives
- Understand Virtual DOM diffing heuristics.

### Example
\`Input: { type: "div", props: { id: "a" } }, { type: "span", props: { id: "a" } }\`
\`Output: "REPLACE"\`
\`Input: { type: "div", props: { id: "a" } }, { type: "div", props: { id: "b" } }\`
\`Output: "UPDATE_PROPS"\``,
    starterCode: {
      javascript: `function diffVNodes(oldNode, newNode) {
  if (oldNode.type !== newNode.type) return 'REPLACE';
  const oldProps = JSON.stringify(oldNode.props || {});
  const newProps = JSON.stringify(newNode.props || {});
  if (oldProps !== newProps) return 'UPDATE_PROPS';
  return 'NOOP';
}`,
      python: `import json

def diff_vnodes(old_node, new_node):
    if old_node.get('type') != new_node.get('type'):
        return 'REPLACE'
    old_props = json.dumps(old_node.get('props', {}), sort_keys=True)
    new_props = json.dumps(new_node.get('props', {}), sort_keys=True)
    if old_props != new_props:
        return 'UPDATE_PROPS'
    return 'NOOP'`
    },
    testCases: [
      { input: '{"type":"div","props":{"id":"a"}}, {"type":"span","props":{"id":"a"}}', expectedOutput: '"REPLACE"', isHidden: false },
      { input: '{"type":"div","props":{"id":"a"}}, {"type":"div","props":{"id":"b"}}', expectedOutput: '"UPDATE_PROPS"', isHidden: false },
      { input: '{"type":"div","props":{"id":"a"}}, {"type":"div","props":{"id":"a"}}', expectedOutput: '"NOOP"', isHidden: true }
    ]
  },
  {
    id: "fe-react-019",
    title: "Controlled vs Uncontrolled Form Field Sync",
    slug: "fe-react-controlled-form-sync",
    tier: 3,
    section: "React",
    topic: "Controlled Components",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Forms",
    category: "frontend",
    tags: ["fe-react", "forms", "controlled"],
    xpReward: 100,
    description: `## Controlled vs Uncontrolled Form Field Sync

### Description
In a controlled component, state drives the input value (\`value={val}\`). When user types, an \`onChange\` event fires to update state.
Given current state \`"Alex"\` and keystroke event \`{ target: { value: "Alexander" } }\`, compute updated form state.

### Learning Objectives
- Formulate React controlled input single source of truth handlers.

### Example
\`Input: "Alex", { value: "Alexander" }\`
\`Output: "Alexander"\``,
    starterCode: {
      javascript: `function handleControlledChange(currentState, eventPayload) {
  return eventPayload.value;
}`,
      python: `def handle_controlled_change(current_state, event_payload):
    return event_payload.get('value')`
    },
    testCases: [
      { input: '"Alex", {"value":"Alexander"}', expectedOutput: '"Alexander"', isHidden: false },
      { input: '"", {"value":"hello"}', expectedOutput: '"hello"', isHidden: false }
    ]
  },
  {
    id: "fe-react-020",
    title: "Lifting State Up Multi-Input Syncer",
    slug: "fe-react-lifting-state-up",
    tier: 3,
    section: "React",
    topic: "Lifting State Up",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State",
    category: "frontend",
    tags: ["fe-react", "state", "lifting-state"],
    xpReward: 100,
    description: `## Lifting State Up Multi-Input Syncer

### Description
When two sibling inputs must stay in sync (e.g. Celsius and Fahrenheit converters), state is lifted to their common parent.
Given temperature in Celsius, return \`{ celsius, fahrenheit }\` where \`F = Math.round((C * 9/5) + 32)\`.

### Learning Objectives
- Maintain shared state in parent component propagating derived values to children.

### Example
\`Input: 0\`
\`Output: { celsius: 0, fahrenheit: 32 }\`
\`Input: 100\`
\`Output: { celsius: 100, fahrenheit: 212 }\``,
    starterCode: {
      javascript: `function syncTemperature(celsius) {
  const fahrenheit = Math.round((celsius * 9 / 5) + 32);
  return { celsius, fahrenheit };
}`,
      python: `def sync_temperature(celsius):
    fahrenheit = round((celsius * 9 / 5) + 32)
    return {'celsius': celsius, 'fahrenheit': fahrenheit}`
    },
    testCases: [
      { input: '0', expectedOutput: '{"celsius":0,"fahrenheit":32}', isHidden: false },
      { input: '100', expectedOutput: '{"celsius":100,"fahrenheit":212}', isHidden: false },
      { input: '25', expectedOutput: '{"celsius":25,"fahrenheit":77}', isHidden: true }
    ]
  },
  {
    id: "fe-react-021",
    title: "useRef Previous Value Tracker",
    slug: "fe-react-use-ref-prev-value",
    tier: 3,
    section: "React",
    topic: "useRef",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Hooks",
    category: "frontend",
    tags: ["fe-react", "hooks", "useRef"],
    xpReward: 100,
    description: `## useRef Previous Value Tracker

### Description
\`useRef\` holds mutable references across renders without triggering a re-render. A classic pattern is tracking the \`previous\` value of a prop or state variable.
Given a sequence of values \`[v1, v2, v3, ...]\`, return an array of \`{ current, previous }\` states across renders.

### Learning Objectives
- Understand ref mutation timing inside \`useEffect\` execution cycles.

### Example
\`Input: [10, 20, 30]\`
\`Output: [{ current: 10, previous: null }, { current: 20, previous: 10 }, { current: 30, previous: 20 }]\``,
    starterCode: {
      javascript: `function trackPreviousValues(values) {
  let prev = null;
  const history = [];
  for (const v of values) {
    history.push({ current: v, previous: prev });
    prev = v;
  }
  return history;
}`,
      python: `def track_previous_values(values):
    prev = None
    history = []
    for v in values:
        history.append({'current': v, 'previous': prev})
        prev = v
    return history`
    },
    testCases: [
      { input: '[10, 20, 30]', expectedOutput: '[{"current":10,"previous":null},{"current":20,"previous":10},{"current":30,"previous":20}]', isHidden: false }
    ]
  },
  {
    id: "fe-react-022",
    title: "useMemo Computation Cache Evaluator",
    slug: "fe-react-use-memo-cache",
    tier: 3,
    section: "React",
    topic: "useMemo",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Memoization",
    category: "frontend",
    tags: ["fe-react", "hooks", "useMemo"],
    xpReward: 100,
    description: `## useMemo Computation Cache Evaluator

### Description
\`useMemo(() => compute(a, b), [a, b])\` caches the computed value until dependencies change.
Given dependency sequences across 3 renders, return the count of times the computation was re-executed.

### Learning Objectives
- Verify memoization skips recomputation when dependency references remain identical.

### Example
\`Input: [[1, 2], [1, 2], [1, 3]]\`
\`Output: 2\` (Computed on render 1; skipped on render 2; recomputed on render 3)`,
    starterCode: {
      javascript: `function countMemoComputations(depsHistory) {
  if (depsHistory.length === 0) return 0;
  let count = 1;
  let prev = depsHistory[0];
  for (let i = 1; i < depsHistory.length; i++) {
    const cur = depsHistory[i];
    const changed = cur.some((v, idx) => !Object.is(v, prev[idx]));
    if (changed) {
      count++;
      prev = cur;
    }
  }
  return count;
}`,
      python: `def count_memo_computations(deps_history):
    if not deps_history:
        return 0
    count = 1
    prev = deps_history[0]
    for cur in deps_history[1:]:
        changed = any(p != c for p, c in zip(prev, cur))
        if changed:
            count += 1
            prev = cur
    return count`
    },
    testCases: [
      { input: '[[1, 2], [1, 2], [1, 3]]', expectedOutput: '2', isHidden: false },
      { input: '[[1], [1], [1]]', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: "fe-react-023",
    title: "React Lists and Keys Conflict Resolver",
    slug: "fe-react-lists-keys-conflict",
    tier: 3,
    section: "React",
    topic: "Lists and Keys",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "keys", "lists"],
    xpReward: 100,
    description: `## React Lists and Keys Conflict Resolver

### Description
React keys must be unique among siblings. Using array index as key causes state corruption when items are inserted, deleted, or reordered.
Given an array of raw items without IDs, generate stable unique keys using content hashing or incremental prefixing: \`{ key: "item-0", value: item }\`.

### Learning Objectives
- Format stable sibling keys for deterministic reconciliation.

### Example
\`Input: ["Apple", "Banana", "Apple"]\`
\`Output: ["item-0-Apple", "item-1-Banana", "item-2-Apple"]\``,
    starterCode: {
      javascript: `function generateStableKeys(items) {
  return items.map((item, idx) => \`item-\${idx}-\${item}\`);
}`,
      python: `def generate_stable_keys(items):
    return [f'item-{idx}-{item}' for idx, item in enumerate(items)]`
    },
    testCases: [
      { input: '["Apple", "Banana", "Apple"]', expectedOutput: '["item-0-Apple","item-1-Banana","item-2-Apple"]', isHidden: false }
    ]
  },
  {
    id: "fe-react-024",
    title: "Custom Hook useToggle Simulator",
    slug: "fe-react-use-toggle-simulator",
    tier: 3,
    section: "React",
    topic: "Custom Hooks",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Hooks",
    category: "frontend",
    tags: ["fe-react", "hooks", "custom-hooks"],
    xpReward: 50,
    description: `## Custom Hook useToggle Simulator

### Description
A \`useToggle(initialState)\` hook returns \`[value, toggle(optionalValue)]\`. If no value passed, it flips boolean; if explicit value passed, it sets that value.

### Learning Objectives
- Model custom hook return tuple and dispatch behavior.

### Example
\`Input: false, [null, null, true]\`
\`Output: true\` (false -> true -> false -> true)`,
    starterCode: {
      javascript: `function simulateUseToggle(initialState, actions) {
  let val = initialState;
  for (const act of actions) {
    val = act !== null ? act : !val;
  }
  return val;
}`,
      python: `def simulate_use_toggle(initial_state, actions):
    val = initial_state
    for act in actions:
        val = act if act is not None else not val
    return val`
    },
    testCases: [
      { input: 'false, [null, null, true]', expectedOutput: 'true', isHidden: false },
      { input: 'true, [null]', expectedOutput: 'false', isHidden: false }
    ]
  },
  {
    id: "fe-react-025",
    title: "React Portals Target DOM Node Resolver",
    slug: "fe-react-portals-resolver",
    tier: 3,
    section: "React",
    topic: "React Portals",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "portals", "dom"],
    xpReward: 100,
    description: `## React Portals Target DOM Node Resolver

### Description
\`ReactDOM.createPortal(children, domNode)\` renders modal content outside parent DOM hierarchy (typically mounting onto \`document.body\` or \`#modal-root\`), preventing CSS \`overflow: hidden\` or \`z-index\` clipping.
Given available container IDs and target container ID, return \`{ mounted: boolean, mountPoint: string }\`.

### Learning Objectives
- Mount overlays to detached portal container roots.

### Example
\`Input: ["root", "modal-root"], "modal-root"\`
\`Output: { mounted: true, mountPoint: "modal-root" }\``,
    starterCode: {
      javascript: `function resolvePortalMount(containerIds, targetId) {
  const exists = containerIds.includes(targetId);
  return {
    mounted: exists,
    mountPoint: exists ? targetId : 'body'
  };
}`,
      python: `def resolve_portal_mount(container_ids, target_id):
    exists = target_id in container_ids
    return {
        'mounted': exists,
        'mountPoint': target_id if exists else 'body'
    }`
    },
    testCases: [
      { input: '["root", "modal-root"], "modal-root"', expectedOutput: '{"mounted":true,"mountPoint":"modal-root"}', isHidden: false },
      { input: '["root"], "modal-root"', expectedOutput: '{"mounted":false,"mountPoint":"body"}', isHidden: false }
    ]
  },
  {
    id: "fe-react-026",
    title: "Product Listing Multi-Criteria Sorter & Filter",
    slug: "fe-react-product-listing-filter",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "ecommerce", "filtering"],
    xpReward: 100,
    description: `## Product Listing Multi-Criteria Sorter & Filter

### Description
Filter product catalog by maximum price and category, then sort by \`"price-asc"\` or \`"price-desc"\`.

### Learning Objectives
- Pipe array operations cleanly inside a memoized selector.

### Example
\`Input: [{ name: "A", price: 20, cat: "tech" }, { name: "B", price: 80, cat: "tech" }], "tech", 50, "price-asc"\`
\`Output: [{ name: "A", price: 20, cat: "tech" }]\``,
    starterCode: {
      javascript: `function filterAndSortProducts(products, category, maxPrice, sortOrder) {
  const filtered = products.filter(p => {
    const catMatch = !category || p.cat === category;
    const priceMatch = p.price <= maxPrice;
    return catMatch && priceMatch;
  });
  return filtered.sort((a, b) => {
    return sortOrder === 'price-asc' ? a.price - b.price : b.price - a.price;
  });
}`,
      python: `def filter_and_sort_products(products, category, max_price, sort_order):
    filtered = [p for p in products if (not category or p.get('cat') == category) and p.get('price', 0) <= max_price]
    rev = sort_order != 'price-asc'
    return sorted(filtered, key=lambda p: p.get('price', 0), reverse=rev)`
    },
    testCases: [
      { input: '[{"name":"A","price":20,"cat":"tech"},{"name":"B","price":80,"cat":"tech"}], "tech", 50, "price-asc"', expectedOutput: '[{"name":"A","price":20,"cat":"tech"}]', isHidden: false },
      { input: '[{"name":"A","price":20,"cat":"tech"},{"name":"B","price":10,"cat":"tech"}], "tech", 50, "price-asc"', expectedOutput: '[{"name":"B","price":10,"cat":"tech"},{"name":"A","price":20,"cat":"tech"}]', isHidden: false }
    ]
  },
  {
    id: "fe-react-027",
    title: "Build an Autocomplete Dropdown State",
    slug: "fe-react-autocomplete-dropdown",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "autocomplete", "ui"],
    xpReward: 100,
    description: `## Build an Autocomplete Dropdown State

### Description
Manage autocomplete state: as user types query, filter suggestions and track highlighted suggestion index on arrow keys (\`"DOWN"\`, \`"UP"\`).

### Learning Objectives
- Handle keyboard navigation index clamping across filtered suggestions.

### Example
\`Input: ["React", "Redux", "Router"], "re", 0, "DOWN"\`
\`Output: { filtered: ["React", "Redux"], highlightedIndex: 1 }\``,
    starterCode: {
      javascript: `function handleAutocompleteNav(options, query, highlightedIndex, action) {
  const filtered = options.filter(o => o.toLowerCase().startsWith(query.toLowerCase()));
  let idx = highlightedIndex;
  if (action === 'DOWN') {
    idx = Math.min(filtered.length - 1, idx + 1);
  } else if (action === 'UP') {
    idx = Math.max(0, idx - 1);
  }
  return { filtered, highlightedIndex: idx };
}`,
      python: `def handle_autocomplete_nav(options, query, highlighted_index, action):
    q = query.lower()
    filtered = [o for o in options if o.lower().startswith(q)]
    idx = highlighted_index
    if action == 'DOWN':
        idx = min(len(filtered) - 1, idx + 1)
    elif action == 'UP':
        idx = max(0, idx - 1)
    return {'filtered': filtered, 'highlightedIndex': idx}`
    },
    testCases: [
      { input: '["React", "Redux", "Router"], "re", 0, "DOWN"', expectedOutput: '{"filtered":["React","Redux"],"highlightedIndex":1}', isHidden: false }
    ]
  },
  {
    id: "fe-react-028",
    title: "Authentication UI Login State Machine",
    slug: "fe-react-auth-state-machine",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "State",
    category: "frontend",
    tags: ["fe-react", "auth", "state-machine"],
    xpReward: 100,
    description: `## Authentication UI Login State Machine

### Description
A login state machine handles:
- \`"IDLE"\` -> submit event -> \`"LOADING"\`
- \`"LOADING"\` -> resolve -> \`"AUTHENTICATED"\`
- \`"LOADING"\` -> reject -> \`"ERROR"\`
Given current state and event, return next state.

### Learning Objectives
- Implement finite state machine transitions for user authentication flows.

### Example
\`Input: "IDLE", "SUBMIT"\`
\`Output: "LOADING"\`
\`Input: "LOADING", "SUCCESS"\`
\`Output: "AUTHENTICATED"\``,
    starterCode: {
      javascript: `function transitionAuth(state, event) {
  const map = {
    IDLE: { SUBMIT: 'LOADING' },
    LOADING: { SUCCESS: 'AUTHENTICATED', ERROR: 'ERROR' },
    ERROR: { RETRY: 'LOADING', RESET: 'IDLE' },
    AUTHENTICATED: { LOGOUT: 'IDLE' }
  };
  return map[state]?.[event] || state;
}`,
      python: `def transition_auth(state, event):
    trans_map = {
        'IDLE': {'SUBMIT': 'LOADING'},
        'LOADING': {'SUCCESS': 'AUTHENTICATED', 'ERROR': 'ERROR'},
        'ERROR': {'RETRY': 'LOADING', 'RESET': 'IDLE'},
        'AUTHENTICATED': {'LOGOUT': 'IDLE'}
    }
    return trans_map.get(state, {}).get(event, state)`
    },
    testCases: [
      { input: '"IDLE", "SUBMIT"', expectedOutput: '"LOADING"', isHidden: false },
      { input: '"LOADING", "SUCCESS"', expectedOutput: '"AUTHENTICATED"', isHidden: false },
      { input: '"LOADING", "ERROR"', expectedOutput: '"ERROR"', isHidden: true }
    ]
  },
  {
    id: "fe-react-029",
    title: "Component Composition Children Filter",
    slug: "fe-react-children-filter",
    tier: 3,
    section: "React",
    topic: "Component Composition",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Composition",
    category: "frontend",
    tags: ["fe-react", "composition", "children"],
    xpReward: 50,
    description: `## Component Composition Children Filter

### Description
Component composition slots children elements into sections. Given a list of child component descriptors \`[{ slot: "header", text: "Title" }, { slot: "body", text: "Content" }]\`, partition children into designated layout slots: \`{ header: [...], body: [...], footer: [...] }\`.

### Learning Objectives
- Slot component children by matching metadata attributes.

### Example
\`Input: [{ slot: "header", text: "Title" }, { slot: "body", text: "Post" }]\`
\`Output: { header: ["Title"], body: ["Post"], footer: [] }\``,
    starterCode: {
      javascript: `function partitionSlots(children) {
  const slots = { header: [], body: [], footer: [] };
  for (const c of children) {
    if (slots[c.slot]) slots[c.slot].push(c.text);
  }
  return slots;
}`,
      python: `def partition_slots(children):
    slots = {'header': [], 'body': [], 'footer': []}
    for c in children:
        s = c.get('slot')
        if s in slots:
            slots[s].append(c.get('text'))
    return slots`
    },
    testCases: [
      { input: '[{"slot":"header","text":"Title"},{"slot":"body","text":"Post"}]', expectedOutput: '{"header":["Title"],"body":["Post"],"footer":[]}', isHidden: false }
    ]
  },
  {
    id: "fe-react-030",
    title: "Loading and Error States UI Resolver",
    slug: "fe-react-loading-error-states",
    tier: 3,
    section: "React",
    topic: "Loading States",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Data Fetching",
    category: "frontend",
    tags: ["fe-react", "loading", "error-handling"],
    xpReward: 50,
    description: `## Loading and Error States UI Resolver

### Description
Handle standard API query states:
- If \`isLoading\`: return \`{ view: "spinner", message: "Loading..." }\`
- If \`error\`: return \`{ view: "error", message: error }\`
- If \`data\` is empty array: return \`{ view: "empty", message: "No records found" }\`
- Else: return \`{ view: "content", count: data.length }\`

### Learning Objectives
- Implement clean branch resolution for asynchronous component rendering.

### Example
\`Input: true, null, null\`
\`Output: { view: "spinner", message: "Loading..." }\``,
    starterCode: {
      javascript: `function resolveFetchView(isLoading, error, data) {
  if (isLoading) return { view: 'spinner', message: 'Loading...' };
  if (error) return { view: 'error', message: error };
  if (!data || data.length === 0) return { view: 'empty', message: 'No records found' };
  return { view: 'content', count: data.length };
}`,
      python: `def resolve_fetch_view(is_loading, error, data):
    if is_loading:
        return {'view': 'spinner', 'message': 'Loading...'}
    if error:
        return {'view': 'error', 'message': error}
    if not data or len(data) == 0:
        return {'view': 'empty', 'message': 'No records found'}
    return {'view': 'content', 'count': len(data)}`
    },
    testCases: [
      { input: 'true, null, null', expectedOutput: '{"view":"spinner","message":"Loading..."}', isHidden: false },
      { input: 'false, "Failed to fetch", null', expectedOutput: '{"view":"error","message":"Failed to fetch"}', isHidden: false },
      { input: 'false, null, [1, 2, 3]', expectedOutput: '{"view":"content","count":3}', isHidden: true }
    ]
  },
  {
    id: "fe-react-031",
    title: "Accordion Component Single/Multi Controller",
    slug: "fe-react-accordion-controller",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Component Architecture",
    category: "frontend",
    tags: ["fe-react", "accordion", "practice"],
    xpReward: 50,
    description: `## Accordion Component Single/Multi Controller

### Description
In React accordion components, maintain open section IDs. When an open item is clicked, close it. When a closed item is clicked, open it (closing all others in single mode, or appending in multi mode).

### Learning Objectives
- Encapsulate interactive disclosure component state.

### Example
\`Input: ["1"], "2", false\`
\`Output: ["2"]\` (single mode closes "1" and opens "2")`,
    starterCode: {
      javascript: `function handleAccordionClick(openIds, targetId, isMulti) {
  const isOpen = openIds.includes(targetId);
  if (isMulti) {
    return isOpen ? openIds.filter(id => id !== targetId) : [...openIds, targetId];
  } else {
    return isOpen ? [] : [targetId];
  }
}`,
      python: `def handle_accordion_click(open_ids, target_id, is_multi):
    is_open = target_id in open_ids
    if is_multi:
        return [i for i in open_ids if i != target_id] if is_open else open_ids + [target_id]
    else:
        return [] if is_open else [target_id]`
    },
    testCases: [
      { input: '["1"], "2", false', expectedOutput: '["2"]', isHidden: false },
      { input: '["1"], "2", true', expectedOutput: '["1","2"]', isHidden: false }
    ]
  },
  {
    id: "fe-react-032",
    title: "Modal Component State & Keyboard Dismissal",
    slug: "fe-react-modal-keyboard-dismiss",
    tier: 3,
    section: "React",
    topic: "React Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-react", "modal", "accessibility"],
    xpReward: 50,
    description: `## Modal Component State & Keyboard Dismissal

### Description
Accessible React modals close when the \`Escape\` key is pressed or when clicking the backdrop overlay outside the dialog container.
Given current \`isOpen\` boolean and event \`{ key: "Escape" }\` or \`{ target: "backdrop" }\`, return updated \`isOpen\` state.

### Learning Objectives
- Bind accessibility dismiss triggers to modal state lifecycle.

### Example
\`Input: true, { key: "Escape" }\`
\`Output: false\`
\`Input: true, { key: "Enter" }\`
\`Output: true\``,
    starterCode: {
      javascript: `function handleModalDismiss(isOpen, event) {
  if (!isOpen) return false;
  if (event.key === 'Escape' || event.target === 'backdrop') {
    return false;
  }
  return true;
}`,
      python: `def handle_modal_dismiss(is_open, event):
    if not is_open:
        return False
    if event.get('key') == 'Escape' or event.get('target') == 'backdrop':
        return False
    return True`
    },
    testCases: [
      { input: 'true, {"key":"Escape"}', expectedOutput: 'false', isHidden: false },
      { input: 'true, {"target":"backdrop"}', expectedOutput: 'false', isHidden: false },
      { input: 'true, {"key":"Enter"}', expectedOutput: 'true', isHidden: true }
    ]
  }
];

module.exports = feTier3React;
