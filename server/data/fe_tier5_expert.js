/**
 * Tier 5 — Frontend Expert (25 Topics & Coding Challenges)
 * Node: fe-master
 * Difficulty: Hard / Advanced
 */

const feTier5Expert = [
  // ─── Architecture & Performance (1-10) ───
  {
    id: "fe-exp-001",
    title: "Core Web Vitals Metric Evaluator (LCP, INP, CLS)",
    slug: "fe-core-web-vitals-evaluator",
    tier: 5,
    section: "Frontend Expert",
    topic: "Core Web Vitals",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-master", "performance", "web-vitals"],
    xpReward: 300,
    description: `## Core Web Vitals Metric Evaluator (LCP, INP, CLS)

### Description
Google Core Web Vitals define user experience thresholds:
- Largest Contentful Paint (LCP): Good <= 2500ms, Needs Improvement <= 4000ms, Poor > 4000ms
- Interaction to Next Paint (INP): Good <= 200ms, Needs Improvement <= 500ms, Poor > 500ms
- Cumulative Layout Shift (CLS): Good <= 0.1, Needs Improvement <= 0.25, Poor > 0.25
Given metric values, return score rating for each and overall pass boolean.

### Learning Objectives
- Evaluate real-world frontend performance metrics against Google SEO ranking standards.

### Example
\`Input: 2100, 150, 0.05\`
\`Output: { lcp: "good", inp: "good", cls: "good", passes: true }\``,
    starterCode: {
      javascript: `function evaluateWebVitals(lcpMs, inpMs, clsScore) {
  const getLcp = (v) => v <= 2500 ? 'good' : v <= 4000 ? 'needs-improvement' : 'poor';
  const getInp = (v) => v <= 200 ? 'good' : v <= 500 ? 'needs-improvement' : 'poor';
  const getCls = (v) => v <= 0.1 ? 'good' : v <= 0.25 ? 'needs-improvement' : 'poor';

  const lcp = getLcp(lcpMs);
  const inp = getInp(inpMs);
  const cls = getCls(clsScore);
  const passes = lcp === 'good' && inp === 'good' && cls === 'good';

  return { lcp, inp, cls, passes };
}`,
      python: `def evaluate_web_vitals(lcp_ms, inp_ms, cls_score):
    lcp = 'good' if lcp_ms <= 2500 else 'needs-improvement' if lcp_ms <= 4000 else 'poor'
    inp = 'good' if inp_ms <= 200 else 'needs-improvement' if inp_ms <= 500 else 'poor'
    cls = 'good' if cls_score <= 0.1 else 'needs-improvement' if cls_score <= 0.25 else 'poor'
    passes = lcp == 'good' and inp == 'good' and cls == 'good'
    return {'lcp': lcp, 'inp': inp, 'cls': cls, 'passes': passes}`
    },
    testCases: [
      { input: '2100, 150, 0.05', expectedOutput: '{"lcp":"good","inp":"good","cls":"good","passes":true}', isHidden: false },
      { input: '4200, 150, 0.05', expectedOutput: '{"lcp":"poor","inp":"good","cls":"good","passes":false}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-002",
    title: "Tree Shaking Dead Code Eliminator",
    slug: "fe-tree-shaking-eliminator",
    tier: 5,
    section: "Frontend Expert",
    topic: "Tree Shaking",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Bundle Optimization",
    category: "frontend",
    tags: ["fe-master", "bundling", "tree-shaking"],
    xpReward: 300,
    description: `## Tree Shaking Dead Code Eliminator

### Description
Tree shaking static analysis (ES module import/export graph) drops unused exports from production bundles.
Given module export names \`["add", "subtract", "multiply", "divide"]\` and imported symbol names \`["add", "multiply"]\`, return stripped dead code exports.

### Learning Objectives
- Detect unused exported AST nodes to trim bundle footprint.

### Example
\`Input: ["add", "subtract", "multiply", "divide"], ["add", "multiply"]\`
\`Output: ["subtract", "divide"]\``,
    starterCode: {
      javascript: `function getTreeShakenExports(exportedSymbols, usedSymbols) {
  const used = new Set(usedSymbols);
  return exportedSymbols.filter(s => !used.has(s));
}`,
      python: `def get_tree_shaken_exports(exported_symbols, used_symbols):
    used = set(used_symbols)
    return [s for s in exported_symbols if s not in used]`
    },
    testCases: [
      { input: '["add", "subtract", "multiply", "divide"], ["add", "multiply"]', expectedOutput: '["subtract","divide"]', isHidden: false },
      { input: '["a", "b"], ["a", "b"]', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-003",
    title: "Service Worker Caching Strategy Resolver",
    slug: "fe-service-worker-caching-strategy",
    tier: 5,
    section: "Frontend Expert",
    topic: "Service Workers",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "PWA",
    category: "frontend",
    tags: ["fe-master", "service-workers", "pwa", "caching"],
    xpReward: 300,
    description: `## Service Worker Caching Strategy Resolver

### Description
Service Workers route requests using tailored caching strategies:
- Static assets (images, fonts, bundles): \`"CacheFirst"\` (fast load, cache until version bump)
- API mutation requests: \`"NetworkOnly"\` (always dynamic)
- Content articles & documents: \`"StaleWhileRevalidate"\` (instant cache render with background refresh)
Given URL pathname, determine appropriate strategy.

### Learning Objectives
- Design offline-first caching architectures for Progressive Web Apps.

### Example
\`Input: "/assets/app.bundle.js"\`
\`Output: "CacheFirst"\`
\`Input: "/api/checkout"\`
\`Output: "NetworkOnly"\``,
    starterCode: {
      javascript: `function resolveCacheStrategy(pathname) {
  if (pathname.startsWith('/api/')) return 'NetworkOnly';
  if (pathname.match(/\\.(js|css|png|jpg|svg|woff2)$/)) return 'CacheFirst';
  return 'StaleWhileRevalidate';
}`,
      python: `import re

def resolve_cache_strategy(pathname):
    if pathname.startswith('/api/'):
        return 'NetworkOnly'
    if re.search(r'\\.(js|css|png|jpg|svg|woff2)$', pathname):
        return 'CacheFirst'
    return 'StaleWhileRevalidate'`
    },
    testCases: [
      { input: '"/assets/app.bundle.js"', expectedOutput: '"CacheFirst"', isHidden: false },
      { input: '"/api/checkout"', expectedOutput: '"NetworkOnly"', isHidden: false },
      { input: '"/blog/post-1"', expectedOutput: '"StaleWhileRevalidate"', isHidden: false }
    ]
  },
  {
    id: "fe-exp-004",
    title: "Content Security Policy (CSP) Directives Formatter",
    slug: "fe-csp-directives-formatter",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Security",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Security",
    category: "frontend",
    tags: ["fe-master", "security", "csp"],
    xpReward: 300,
    description: `## Content Security Policy (CSP) Directives Formatter

### Description
Content Security Policy (CSP) HTTP headers prevent Cross-Site Scripting (XSS) and data injection by declaring trusted script, style, and image origins.
Given a directives object \`{ "default-src": ["'self'"], "script-src": ["'self'", "https://apis.google.com"] }\`, format the standard CSP header string.

### Learning Objectives
- Construct strict, compliant Content Security Policy strings.

### Example
\`Input: { "default-src": ["'self'"], "script-src": ["'self'", "https://cdn.example.com"] }\`
\`Output: "default-src 'self'; script-src 'self' https://cdn.example.com;"\``,
    starterCode: {
      javascript: `function formatCspHeader(directives) {
  return Object.keys(directives)
    .map(key => \`\${key} \${directives[key].join(' ')};\`)
    .join(' ');
}`,
      python: `def format_csp_header(directives):
    return ' '.join(f"{k} {' '.join(v)};" for k, v in directives.items())`
    },
    testCases: [
      { input: '{"default-src":["\'self\'"],"script-src":["\'self\'","https://cdn.example.com"]}', expectedOutput: '"default-src \'self\'; script-src \'self\' https://cdn.example.com;"', isHidden: false }
    ]
  },
  {
    id: "fe-exp-005",
    title: "XSS Input Sanitizer & Escaper",
    slug: "fe-xss-input-sanitizer",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Security",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Security",
    category: "frontend",
    tags: ["fe-master", "security", "xss"],
    xpReward: 300,
    description: `## XSS Input Sanitizer & Escaper

### Description
Escape raw user input before interpolating into HTML templates to prevent Cross-Site Scripting (XSS):
- \`&\` -> \`&amp;\`
- \`<\` -> \`&lt;\`
- \`>\` -> \`&gt;\`
- \`"\` -> \`&quot;\`
- \`'\` -> \`&#39;\`

### Learning Objectives
- Sanitize untrusted input strings avoiding DOM-based XSS attacks.

### Example
\`Input: "<script>alert('xss')</script>"\`
\`Output: "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"\``,
    starterCode: {
      javascript: `function sanitizeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}`,
      python: `def sanitize_html(s):
    return (s.replace('&', '&amp;')
             .replace('<', '&lt;')
             .replace('>', '&gt;')
             .replace('"', '&quot;')
             .replace("'", '&#39;'))`
    },
    testCases: [
      { input: '"<script>alert(\'xss\')</script>"', expectedOutput: '"&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"', isHidden: false },
      { input: '"hello & world"', expectedOutput: '"hello &amp; world"', isHidden: false }
    ]
  },
  {
    id: "fe-exp-006",
    title: "A/B Testing Deterministic Variant Allocator",
    slug: "fe-ab-testing-allocator",
    tier: 5,
    section: "Frontend Expert",
    topic: "A/B Testing",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Feature Flags",
    category: "frontend",
    tags: ["fe-master", "ab-testing", "flags"],
    xpReward: 300,
    description: `## A/B Testing Deterministic Variant Allocator

### Description
Allocate users consistently to test variants (A or B) using a numeric hash of their \`userId + experimentName\`.
If hash modulo 100 < \`weightA\`, assign \`"control"\`; else assign \`"variant"\`.

### Learning Objectives
- Implement deterministic bucketing for experimentation platforms without server roundtrips.

### Example
\`Input: "user-123", "checkout-redesign", 50\`
\`Output: "control"\` or \`"variant"\``,
    starterCode: {
      javascript: `function allocateExperiment(userId, experimentKey, weightA = 50) {
  let hash = 0;
  const str = userId + ':' + experimentKey;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const bucket = hash % 100;
  return bucket < weightA ? 'control' : 'variant';
}`,
      python: `def allocate_experiment(user_id, experiment_key, weight_a=50):
    hash_val = 0
    s = f'{user_id}:{experiment_key}'
    for ch in s:
        hash_val = (hash_val * 31 + ord(ch)) & 0xFFFFFFFF
    bucket = hash_val % 100
    return 'control' if bucket < weight_a else 'variant'`
    },
    testCases: [
      { input: '"user-123", "checkout-v2", 50', expectedOutput: '"variant"', isHidden: false },
      { input: '"user-999", "checkout-v2", 100', expectedOutput: '"control"', isHidden: false }
    ]
  },
  {
    id: "fe-exp-007",
    title: "Web Worker Offload Task Chunking",
    slug: "fe-web-worker-task-chunking",
    tier: 5,
    section: "Frontend Expert",
    topic: "Web Workers",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-master", "web-workers", "concurrency"],
    xpReward: 300,
    description: `## Web Worker Offload Task Chunking

### Description
Heavy computations (cryptography, large dataset sorting) must be offloaded to Web Workers or chunked onto the main thread via \`requestIdleCallback\` to prevent UI frame freezing (> 16ms).
Given total array size and chunk size, calculate batch partition bounds.

### Learning Objectives
- Divide intensive computational jobs into non-blocking worker batches.

### Example
\`Input: 10, 3\`
\`Output: [[0, 2], [3, 5], [6, 8], [9, 9]]\``,
    starterCode: {
      javascript: `function createWorkerBatches(totalItems, batchSize) {
  const batches = [];
  for (let i = 0; i < totalItems; i += batchSize) {
    batches.push([i, Math.min(totalItems - 1, i + batchSize - 1)]);
  }
  return batches;
}`,
      python: `def create_worker_batches(total_items, batch_size):
    batches = []
    for i in range(0, total_items, batch_size):
        batches.append([i, min(total_items - 1, i + batch_size - 1)])
    return batches`
    },
    testCases: [
      { input: '10, 3', expectedOutput: '[[0,2],[3,5],[6,8],[9,9]]', isHidden: false },
      { input: '4, 2', expectedOutput: '[[0,1],[2,3]]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-008",
    title: "Offline Sync Conflict Resolver (Last-Write-Wins)",
    slug: "fe-offline-sync-lww",
    tier: 5,
    section: "Frontend Expert",
    topic: "Offline Synchronization",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Architecture",
    category: "frontend",
    tags: ["fe-master", "offline", "sync"],
    xpReward: 300,
    description: `## Offline Sync Conflict Resolver (Last-Write-Wins)

### Description
When a client reconnects after working offline, local edits must be merged with remote server changes. In Last-Write-Wins (LWW), compare timestamp fields: the record with the newer timestamp takes precedence.
Given client record and server record \`{ id, data, updatedAt }\`, return the winner record.

### Learning Objectives
- Implement deterministic conflict resolution strategies for offline-first web apps.

### Example
\`Input: { id: 1, title: "Client Edit", updatedAt: 200 }, { id: 1, title: "Server Edit", updatedAt: 150 }\`
\`Output: { id: 1, title: "Client Edit", updatedAt: 200 }\``,
    starterCode: {
      javascript: `function resolveLwwConflict(clientRecord, serverRecord) {
  return clientRecord.updatedAt >= serverRecord.updatedAt ? clientRecord : serverRecord;
}`,
      python: `def resolve_lww_conflict(client_record, server_record):
    return client_record if client_record['updatedAt'] >= server_record['updatedAt'] else server_record`
    },
    testCases: [
      { input: '{"id":1,"title":"Client Edit","updatedAt":200}, {"id":1,"title":"Server Edit","updatedAt":150}', expectedOutput: '{"id":1,"title":"Client Edit","updatedAt":200}', isHidden: false },
      { input: '{"id":1,"title":"Old Client","updatedAt":100}, {"id":1,"title":"New Server","updatedAt":300}', expectedOutput: '{"id":1,"title":"New Server","updatedAt":300}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-009",
    title: "WCAG Color Contrast Ratio Calculator",
    slug: "fe-wcag-color-contrast",
    tier: 5,
    section: "Frontend Expert",
    topic: "WCAG",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-master", "wcag", "accessibility"],
    xpReward: 300,
    description: `## WCAG Color Contrast Ratio Calculator

### Description
WCAG 2.1 AA demands minimum 4.5:1 contrast for normal text and 3:1 for large text.
Given relative luminances \`L1\` and \`L2\` (between 0 and 1), contrast ratio is \`(max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)\`.
Return ratio rounded to 2 decimal places and boolean \`meetsNormalAA\`.

### Learning Objectives
- Implement automated WCAG color compliance checks for design tokens.

### Example
\`Input: 1.0, 0.0\` (Pure White vs Pure Black)
\`Output: { ratio: 21.0, meetsNormalAA: true }\``,
    starterCode: {
      javascript: `function calculateContrastRatio(l1, l2) {
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  const ratio = parseFloat(((max + 0.05) / (min + 0.05)).toFixed(2));
  return {
    ratio,
    meetsNormalAA: ratio >= 4.5
  };
}`,
      python: `def calculate_contrast_ratio(l1, l2):
    max_l = max(l1, l2)
    min_l = min(l1, l2)
    ratio = round((max_l + 0.05) / (min_l + 0.05), 2)
    return {
        'ratio': ratio,
        'meetsNormalAA': ratio >= 4.5
    }`
    },
    testCases: [
      { input: '1.0, 0.0', expectedOutput: '{"ratio":21,"meetsNormalAA":true}', isHidden: false },
      { input: '0.2, 0.15', expectedOutput: '{"ratio":1.25,"meetsNormalAA":false}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-010",
    title: "Internationalization (i18n) Pluralization & Token Interpolator",
    slug: "fe-i18n-pluralization-interpolator",
    tier: 5,
    section: "Frontend Expert",
    topic: "Internationalization",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Architecture",
    category: "frontend",
    tags: ["fe-master", "i18n", "localization"],
    xpReward: 300,
    description: `## Internationalization (i18n) Pluralization & Token Interpolator

### Description
Localize strings with dynamic counts and token replacements:
- \`count === 1\`: use \`one\` form
- \`count !== 1\`: use \`other\` form
Replace \`{count}\` and \`{user}\` tokens with actual values.

### Learning Objectives
- Build internationalized template interpolation engines.

### Example
\`Input: { one: "{user} has {count} notification", other: "{user} has {count} notifications" }, 3, "Alex"\`
\`Output: "Alex has 3 notifications"\``,
    starterCode: {
      javascript: `function interpolateI18n(templates, count, user) {
  const template = count === 1 ? templates.one : templates.other;
  return template.replace('{count}', count).replace('{user}', user);
}`,
      python: `def interpolate_i18n(templates, count, user):
    template = templates.get('one') if count == 1 else templates.get('other')
    return template.replace('{count}', str(count)).replace('{user}', user)`
    },
    testCases: [
      { input: '{"one":"{user} has {count} notification","other":"{user} has {count} notifications"}, 3, "Alex"', expectedOutput: '"Alex has 3 notifications"', isHidden: false },
      { input: '{"one":"{user} has {count} notification","other":"{user} has {count} notifications"}, 1, "Sarah"', expectedOutput: '"Sarah has 1 notification"', isHidden: false }
    ]
  },

  // ─── 15 Frontend Expert Projects (11-25) ───
  {
    id: "fe-exp-011",
    title: "Build a Production Dashboard Widget Layout Engine",
    slug: "fe-project-production-dashboard",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Enterprise Architecture",
    category: "frontend",
    tags: ["fe-master", "dashboard", "widgets"],
    xpReward: 300,
    description: `## Build a Production Dashboard Widget Layout Engine

### Description
In enterprise dashboards, users arrange customizable grid widgets: \`[{ id, colSpan, rowSpan }]\`.
Given a 12-column grid system, pack widgets row-by-row, returning how many rows are consumed.

### Learning Objectives
- Construct 12-column layout bin-packing algorithms for dynamic dashboards.

### Example
\`Input: [6, 6, 12, 4, 4, 4]\` (Items consume 6 cols, 6 cols, etc.)
\`Output: 3\` (Row 1: 6+6=12, Row 2: 12, Row 3: 4+4+4=12)`,
    starterCode: {
      javascript: `function calculateDashboardRows(colSpans, gridWidth = 12) {
  let rows = 1;
  let currentRowWidth = 0;
  for (const span of colSpans) {
    if (currentRowWidth + span <= gridWidth) {
      currentRowWidth += span;
    } else {
      rows++;
      currentRowWidth = span;
    }
  }
  return rows;
}`,
      python: `def calculate_dashboard_rows(col_spans, grid_width=12):
    if not col_spans:
        return 0
    rows = 1
    current_row = 0
    for span in col_spans:
        if current_row + span <= grid_width:
            current_row += span
        else:
            rows += 1
            current_row = span
    return rows`
    },
    testCases: [
      { input: '[6, 6, 12, 4, 4, 4]', expectedOutput: '3', isHidden: false },
      { input: '[12, 12]', expectedOutput: '2', isHidden: false }
    ]
  },
  {
    id: "fe-exp-012",
    title: "Build a Design System Component Variant Factory",
    slug: "fe-project-design-system-factory",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Design Systems",
    category: "frontend",
    tags: ["fe-master", "design-systems", "components"],
    xpReward: 300,
    description: `## Build a Design System Component Variant Factory

### Description
Modern design systems (CVA / Stitches) compose component classes based on variant props: \`size\`, \`intent\`, \`disabled\`.
Given a variant map and user prop selections, generate combined CSS classes.

### Learning Objectives
- Implement Class Variance Authority (CVA) style class resolution.

### Example
\`Input: { intent: "primary", size: "lg", disabled: true }\`
\`Output: "btn btn-primary btn-lg btn-disabled"\``,
    starterCode: {
      javascript: `function createButtonClasses({ intent = 'primary', size = 'md', disabled = false } = {}) {
  const classes = ['btn', \`btn-\${intent}\`, \`btn-\${size}\`];
  if (disabled) classes.push('btn-disabled');
  return classes.join(' ');
}`,
      python: `def create_button_classes(props=None):
    if props is None:
        props = {}
    intent = props.get('intent', 'primary')
    size = props.get('size', 'md')
    disabled = props.get('disabled', False)
    classes = ['btn', f'btn-{intent}', f'btn-{size}']
    if disabled:
        classes.append('btn-disabled')
    return ' '.join(classes)`
    },
    testCases: [
      { input: '{"intent":"primary","size":"lg","disabled":true}', expectedOutput: '"btn btn-primary btn-lg btn-disabled"', isHidden: false },
      { input: '{"intent":"secondary","size":"sm","disabled":false}', expectedOutput: '"btn btn-secondary btn-sm"', isHidden: false }
    ]
  },
  {
    id: "fe-exp-013",
    title: "Build a Real-Time Chat Interface Message Deduplicator",
    slug: "fe-project-realtime-chat-dedupe",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Real-Time Architecture",
    category: "frontend",
    tags: ["fe-master", "websockets", "chat"],
    xpReward: 300,
    description: `## Build a Real-Time Chat Interface Message Deduplicator

### Description
In WebSocket chat applications, network reconnects cause duplicate message delivery. Deduplicate incoming message stream maintaining strict ascending timestamp order: \`[{ id, text, timestamp }]\`.

### Learning Objectives
- Buffer, sort, and deduplicate asynchronous real-time message streams.

### Example
\`Input: [{ id: "m1", time: 10 }, { id: "m2", time: 20 }, { id: "m1", time: 10 }]\`
\`Output: [{ id: "m1", time: 10 }, { id: "m2", time: 20 }]\``,
    starterCode: {
      javascript: `function dedupeChatStream(messages) {
  const map = new Map();
  for (const m of messages) {
    if (!map.has(m.id)) map.set(m.id, m);
  }
  return Array.from(map.values()).sort((a, b) => a.time - b.time);
}`,
      python: `def dedupe_chat_stream(messages):
    seen = {}
    for m in messages:
        if m['id'] not in seen:
            seen[m['id']] = m
    res = list(seen.values())
    res.sort(key=lambda x: x['time'])
    return res`
    },
    testCases: [
      { input: '[{"id":"m1","time":10},{"id":"m2","time":20},{"id":"m1","time":10}]', expectedOutput: '[{"id":"m1","time":10},{"id":"m2","time":20}]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-014",
    title: "Build a Real-Time Dashboard Metrics Rolling Window",
    slug: "fe-project-realtime-metrics-window",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Real-Time Architecture",
    category: "frontend",
    tags: ["fe-master", "streaming", "realtime"],
    xpReward: 300,
    description: `## Build a Real-Time Dashboard Metrics Rolling Window

### Description
Maintain a fixed rolling window of the latest \`N\` metrics data points (e.g. 10 points) discarding the oldest when new streaming events arrive. Return current window array and moving average.

### Learning Objectives
- Implement FIFO ring buffers for real-time live telemetry charting.

### Example
\`Input: [10, 20, 30], 40, 3\` (Buffer currently [10, 20, 30], new point 40, max 3)
\`Output: { window: [20, 30, 40], movingAverage: 30 }\``,
    starterCode: {
      javascript: `function updateRollingWindow(currentWindow, newPoint, maxSize = 10) {
  const window = [...currentWindow, newPoint];
  while (window.length > maxSize) {
    window.shift();
  }
  const avg = Math.round(window.reduce((a, b) => a + b, 0) / window.length);
  return { window, movingAverage: avg };
}`,
      python: `def update_rolling_window(current_window, new_point, max_size=10):
    window = list(current_window) + [new_point]
    while len(window) > max_size:
        window.pop(0)
    avg = round(sum(window) / len(window))
    return {'window': window, 'movingAverage': avg}`
    },
    testCases: [
      { input: '[10, 20, 30], 40, 3', expectedOutput: '{"window":[20,30,40],"movingAverage":30}', isHidden: false },
      { input: '[10], 20, 3', expectedOutput: '{"window":[10,20],"movingAverage":15}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-015",
    title: "Build an Offline-First Sync Queue Dispatcher",
    slug: "fe-project-offline-sync-queue",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Offline Synchronization",
    category: "frontend",
    tags: ["fe-master", "offline", "sync"],
    xpReward: 300,
    description: `## Build an Offline-First Sync Queue Dispatcher

### Description
While offline, mutating requests (POST, PUT, DELETE) are stored in an IndexedDB queue. Upon network reconnection, the queue drains chronologically.
Given a queue of mutations and server status \`"online" | "offline"\`, return processed mutations and remaining queue.

### Learning Objectives
- Implement persistent client-side mutation queues for background sync.

### Example
\`Input: [{ id: 1, action: "like" }, { id: 2, action: "comment" }], "online"\`
\`Output: { processedCount: 2, remainingQueue: [] }\``,
    starterCode: {
      javascript: `function processSyncQueue(queue, networkStatus) {
  if (networkStatus !== 'online') {
    return { processedCount: 0, remainingQueue: queue };
  }
  return { processedCount: queue.length, remainingQueue: [] };
}`,
      python: `def process_sync_queue(queue, network_status):
    if network_status != 'online':
        return {'processedCount': 0, 'remainingQueue': queue}
    return {'processedCount': len(queue), 'remainingQueue': []}`
    },
    testCases: [
      { input: '[{"id":1,"action":"like"},{"id":2,"action":"comment"}], "online"', expectedOutput: '{"processedCount":2,"remainingQueue":[]}', isHidden: false },
      { input: '[{"id":1,"action":"like"}], "offline"', expectedOutput: '{"processedCount":0,"remainingQueue":[{"id":1,"action":"like"}]}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-016",
    title: "Build a PWA Web App Manifest Validator",
    slug: "fe-project-pwa-manifest-validator",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "PWA",
    category: "frontend",
    tags: ["fe-master", "pwa", "manifest"],
    xpReward: 300,
    description: `## Build a PWA Web App Manifest Validator

### Description
A compliant Progressive Web App (PWA) manifest requires:
- \`name\` or \`short_name\`
- \`start_url\`
- \`display\` set to \`"standalone"\`, \`"fullscreen"\`, or \`"minimal-ui"\`
- \`icons\` array containing at least one icon >= 192px
Return \`{ isInstallable: boolean, errors: string[] }\`.

### Learning Objectives
- Validate browser installability criteria for progressive web apps.

### Example
\`Input: { name: "DevArena", start_url: "/", display: "standalone", icons: [{ size: 192 }] }\`
\`Output: { isInstallable: true, errors: [] }\``,
    starterCode: {
      javascript: `function validatePwaManifest(manifest) {
  const errors = [];
  if (!manifest.name && !manifest.short_name) errors.push('Missing name');
  if (!manifest.start_url) errors.push('Missing start_url');
  if (!['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)) {
    errors.push('Invalid display mode');
  }
  const hasValidIcon = manifest.icons && manifest.icons.some(i => i.size >= 192);
  if (!hasValidIcon) errors.push('Missing icon >= 192px');

  return { isInstallable: errors.length === 0, errors };
}`,
      python: `def validate_pwa_manifest(manifest):
    errors = []
    if not manifest.get('name') and not manifest.get('short_name'):
        errors.append('Missing name')
    if not manifest.get('start_url'):
        errors.append('Missing start_url')
    if manifest.get('display') not in ['standalone', 'fullscreen', 'minimal-ui']:
        errors.append('Invalid display mode')
    icons = manifest.get('icons', [])
    if not any(i.get('size', 0) >= 192 for i in icons):
        errors.append('Missing icon >= 192px')
    return {'isInstallable': len(errors) == 0, 'errors': errors}`
    },
    testCases: [
      { input: '{"name":"DevArena","start_url":"/","display":"standalone","icons":[{"size":192}]}', expectedOutput: '{"isInstallable":true,"errors":[]}', isHidden: false },
      { input: '{"display":"browser"}', expectedOutput: '{"isInstallable":false,"errors":["Missing name","Missing start_url","Invalid display mode","Missing icon >= 192px"]}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-017",
    title: "Build a Virtualized Data Grid Multi-Axis Window",
    slug: "fe-project-virtualized-data-grid",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Expert Projects",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-master", "grid", "virtualization"],
    xpReward: 300,
    description: `## Build a Virtualized Data Grid Multi-Axis Window

### Description
2D Data grids virtualize both rows (vertical scroll) and columns (horizontal scroll).
Given \`scrollTop\`, \`scrollLeft\`, \`rowHeight\`, \`colWidth\`, \`viewportHeight\`, and \`viewportWidth\`, return bounding index coordinates:
\`{ startRow, endRow, startCol, endCol }\`.

### Learning Objectives
- Implement dual-axis scrolling window slicing for high-performance spreadsheets.

### Example
\`Input: 200, 300, 50, 100, 300, 400\`
\`Output: { startRow: 4, endRow: 10, startCol: 3, endCol: 7 }\``,
    starterCode: {
      javascript: `function calculate2DVirtualWindow(scrollTop, scrollLeft, rowHeight, colWidth, viewH, viewW) {
  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = startRow + Math.ceil(viewH / rowHeight);
  const startCol = Math.floor(scrollLeft / colWidth);
  const endCol = startCol + Math.ceil(viewW / colWidth);

  return { startRow, endRow, startCol, endCol };
}`,
      python: `import math

def calculate_2d_virtual_window(scroll_top, scroll_left, row_height, col_width, view_h, view_w):
    start_row = int(scroll_top // row_height)
    end_row = start_row + math.ceil(view_h / row_height)
    start_col = int(scroll_left // col_width)
    end_col = start_col + math.ceil(view_w / col_width)
    return {
        'startRow': start_row,
        'endRow': end_row,
        'startCol': start_col,
        'endCol': end_col
    }`
    },
    testCases: [
      { input: '200, 300, 50, 100, 300, 400', expectedOutput: '{"startRow":4,"endRow":10,"startCol":3,"endCol":7}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-018",
    title: "Build a Micro Frontend Module Federation Remote Loader",
    slug: "fe-project-module-federation-loader",
    tier: 5,
    section: "Frontend Expert",
    topic: "Micro Frontends",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Enterprise Architecture",
    category: "frontend",
    tags: ["fe-master", "module-federation", "webpack"],
    xpReward: 300,
    description: `## Build a Micro Frontend Module Federation Remote Loader

### Description
Webpack Module Federation exposes remote modules dynamically: \`loadRemote(remoteName, modulePath)\`.
Given remotes registry \`{ "orderApp": "https://orders.internal.com/remoteEntry.js" }\`, resolve remote bundle URI.

### Learning Objectives
- Configure runtime container discovery for federated frontend architecture.

### Example
\`Input: "orderApp", "OrderList", { orderApp: "https://orders.com/remoteEntry.js" }\`
\`Output: { remoteUrl: "https://orders.com/remoteEntry.js", module: "OrderList" }\``,
    starterCode: {
      javascript: `function resolveRemoteModule(remoteName, moduleName, remotesMap) {
  const remoteUrl = remotesMap[remoteName];
  if (!remoteUrl) throw new Error(\`Remote \${remoteName} not configured\`);
  return { remoteUrl, module: moduleName };
}`,
      python: `def resolve_remote_module(remote_name, module_name, remotes_map):
    if remote_name not in remotes_map:
        raise ValueError(f'Remote {remote_name} not configured')
    return {'remoteUrl': remotes_map[remote_name], 'module': module_name}`
    },
    testCases: [
      { input: '"orderApp", "OrderList", {"orderApp":"https://orders.com/remoteEntry.js"}', expectedOutput: '{"remoteUrl":"https://orders.com/remoteEntry.js","module":"OrderList"}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-019",
    title: "Build a Multi-Tenant Theme & Permission Resolver",
    slug: "fe-project-multi-tenant-theme",
    tier: 5,
    section: "Frontend Expert",
    topic: "Multi-Tenant Frontend Architecture",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Enterprise Architecture",
    category: "frontend",
    tags: ["fe-master", "multi-tenant", "theme"],
    xpReward: 300,
    description: `## Build a Multi-Tenant Theme & Permission Resolver

### Description
In multi-tenant SaaS frontends, tenants have custom brand colors, logos, and allowed feature flags.
Given tenant configurations map and active \`tenantId\`, return resolved tenant configuration.

### Learning Objectives
- Dynamically brand and permission enterprise white-labeled frontends.

### Example
\`Input: "acme", { acme: { primaryColor: "#ff0000", features: ["analytics"] } }\`
\`Output: { primaryColor: "#ff0000", features: ["analytics"] }\``,
    starterCode: {
      javascript: `function resolveTenantConfig(tenantId, tenants) {
  return tenants[tenantId] || { primaryColor: '#0070f3', features: [] };
}`,
      python: `def resolve_tenant_config(tenant_id, tenants):
    return tenants.get(tenant_id, {'primaryColor': '#0070f3', 'features': []})`
    },
    testCases: [
      { input: '"acme", {"acme":{"primaryColor":"#ff0000","features":["analytics"]}}', expectedOutput: '{"primaryColor":"#ff0000","features":["analytics"]}', isHidden: false },
      { input: '"unknown", {}', expectedOutput: '{"primaryColor":"#0070f3","features":[]}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-020",
    title: "Build a Real-Time Collaboration Cursor Tracker",
    slug: "fe-project-realtime-collaboration-cursor",
    tier: 5,
    section: "Frontend Expert",
    topic: "Real-Time Frontend Architecture",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Real-Time Architecture",
    category: "frontend",
    tags: ["fe-master", "collaboration", "realtime"],
    xpReward: 300,
    description: `## Build a Real-Time Collaboration Cursor Tracker

### Description
In collaborative applications (Figma, Google Docs), clients broadcast cursor coordinates \`{ userId, x, y, color }\`. Stale cursors (inactive for > 5000ms) are pruned.
Given active cursors map and current timestamp, return valid active user cursors.

### Learning Objectives
- Synchronize multi-user real-time presence indicators.

### Example
\`Input: [{ id: "u1", x: 100, y: 150, lastActive: 1000 }], 3000\`
\`Output: [{ id: "u1", x: 100, y: 150 }]\``,
    starterCode: {
      javascript: `function pruneStaleCursors(cursors, nowMs, timeoutMs = 5000) {
  return cursors
    .filter(c => nowMs - c.lastActive <= timeoutMs)
    .map(({ id, x, y }) => ({ id, x, y }));
}`,
      python: `def prune_stale_cursors(cursors, now_ms, timeout_ms=5000):
    return [{'id': c['id'], 'x': c['x'], 'y': c['y']} for c in cursors if now_ms - c['lastActive'] <= timeout_ms]`
    },
    testCases: [
      { input: '[{"id":"u1","x":100,"y":150,"lastActive":1000}], 3000', expectedOutput: '[{"id":"u1","x":100,"y":150}]', isHidden: false },
      { input: '[{"id":"u1","x":100,"y":150,"lastActive":1000}], 8000', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-021",
    title: "Build an Accessible Design System Token System",
    slug: "fe-project-accessible-design-tokens",
    tier: 5,
    section: "Frontend Expert",
    topic: "Design Systems",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Design Systems",
    category: "frontend",
    tags: ["fe-master", "tokens", "design-systems"],
    xpReward: 300,
    description: `## Build an Accessible Design System Token System

### Description
Generate composite semantic design tokens pairing background and foreground text colors while verifying WCAG contrast compliance.
Given token pairings \`[{ bg: "#000", text: "#fff", contrast: 21.0 }]\`, filter only fully compliant tokens (contrast >= 4.5).

### Learning Objectives
- Enforce accessibility guardrails directly within design token build pipelines.

### Example
\`Input: [{ name: "btn-pri", contrast: 5.2 }, { name: "btn-subtle", contrast: 3.1 }]\`
\`Output: ["btn-pri"]\``,
    starterCode: {
      javascript: `function filterCompliantTokens(tokens, minContrast = 4.5) {
  return tokens
    .filter(t => t.contrast >= minContrast)
    .map(t => t.name);
}`,
      python: `def filter_compliant_tokens(tokens, min_contrast=4.5):
    return [t['name'] for t in tokens if t.get('contrast', 0) >= min_contrast]`
    },
    testCases: [
      { input: '[{"name":"btn-pri","contrast":5.2},{"name":"btn-subtle","contrast":3.1}]', expectedOutput: '["btn-pri"]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-022",
    title: "Critical Rendering Path Resource Budget Auditor",
    slug: "fe-crp-resource-auditor",
    tier: 5,
    section: "Frontend Expert",
    topic: "Critical Rendering Path",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-master", "crp", "performance"],
    xpReward: 300,
    description: `## Critical Rendering Path Resource Budget Auditor

### Description
The Critical Rendering Path (CRP) demands that critical CSS and synchronous scripts stay within the initial TCP 14KB congestion window.
Given total bytes of render-blocking resources, check if within budget: \`{ exceedsBudget: boolean, totalBytes: number }\`.

### Learning Objectives
- Audit critical head scripts and inline styles against first packet limits.

### Example
\`Input: [5000, 6000], 14336\` (5kb + 6kb = 11kb <= 14kb)
\`Output: { exceedsBudget: false, totalBytes: 11000 }\``,
    starterCode: {
      javascript: `function auditCrpBudget(resourceBytes, budget = 14336) {
  const totalBytes = resourceBytes.reduce((a, b) => a + b, 0);
  return {
    exceedsBudget: totalBytes > budget,
    totalBytes
  };
}`,
      python: `def audit_crp_budget(resource_bytes, budget=14336):
    total = sum(resource_bytes)
    return {
        'exceedsBudget': total > budget,
        'totalBytes': total
    }`
    },
    testCases: [
      { input: '[5000, 6000], 14336', expectedOutput: '{"exceedsBudget":false,"totalBytes":11000}', isHidden: false },
      { input: '[10000, 8000], 14336', expectedOutput: '{"exceedsBudget":true,"totalBytes":18000}', isHidden: false }
    ]
  },
  {
    id: "fe-exp-023",
    title: "Memory Leak Event Listener Retainer Checker",
    slug: "fe-memory-leak-checker",
    tier: 5,
    section: "Frontend Expert",
    topic: "Memory Management",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Performance",
    category: "frontend",
    tags: ["fe-master", "memory-leaks", "performance"],
    xpReward: 300,
    description: `## Memory Leak Event Listener Retainer Checker

### Description
Component unmount lifecycles must remove window and document event listeners. Unremoved listeners retain detached DOM nodes in memory.
Given added listener IDs and removed listener IDs, return orphaned listener IDs causing memory leaks.

### Learning Objectives
- Detect detached DOM and closure memory leaks in Single Page Applications.

### Example
\`Input: ["scroll", "resize", "click"], ["scroll", "click"]\`
\`Output: ["resize"]\``,
    starterCode: {
      javascript: `function findLeakedListeners(added, removed) {
  const removedSet = new Set(removed);
  return added.filter(id => !removedSet.has(id));
}`,
      python: `def find_leaked_listeners(added, removed):
    removed_set = set(removed)
    return [x for x in added if x not in removed_set]`
    },
    testCases: [
      { input: '["scroll", "resize", "click"], ["scroll", "click"]', expectedOutput: '["resize"]', isHidden: false },
      { input: '["scroll"], ["scroll"]', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-024",
    title: "Large-Scale Monorepo Package Dependency Topology",
    slug: "fe-monorepo-dependency-topology",
    tier: 5,
    section: "Frontend Expert",
    topic: "Monorepos",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Enterprise Architecture",
    category: "frontend",
    tags: ["fe-master", "monorepo", "architecture"],
    xpReward: 300,
    description: `## Large-Scale Monorepo Package Dependency Topology

### Description
In monorepos (Turborepo, Nx), shared UI component libraries sit at the base of the dependency graph: \`ui -> utils -> core\`.
Given package dependency mappings, return ordered build execution queue.

### Learning Objectives
- Understand topological dependency sorting in enterprise monorepos.

### Example
\`Input: { "web": ["ui"], "ui": ["utils"], "utils": [] }\`
\`Output: ["utils", "ui", "web"]\``,
    starterCode: {
      javascript: `function getMonorepoBuildOrder(depGraph) {
  const visited = new Set();
  const order = [];

  function visit(node) {
    if (visited.has(node)) return;
    visited.add(node);
    const deps = depGraph[node] || [];
    for (const d of deps) {
      visit(d);
    }
    order.push(node);
  }

  for (const pkg of Object.keys(depGraph)) {
    visit(pkg);
  }
  return order;
}`,
      python: `def get_monorepo_build_order(dep_graph):
    visited = set()
    order = []
    def visit(node):
        if node in visited:
            return
        visited.add(node)
        deps = dep_graph.get(node, [])
        for d in deps:
            visit(d)
        order.append(node)
    for pkg in dep_graph:
        visit(pkg)
    return order`
    },
    testCases: [
      { input: '{"web":["ui"],"ui":["utils"],"utils":[]}', expectedOutput: '["utils","ui","web"]', isHidden: false }
    ]
  },
  {
    id: "fe-exp-025",
    title: "Frontend Error Observability Fingerprinter",
    slug: "fe-error-observability-fingerprint",
    tier: 5,
    section: "Frontend Expert",
    topic: "Frontend Observability",
    difficulty: "expert",
    originalDifficulty: "Advanced",
    pattern: "Observability",
    category: "frontend",
    tags: ["fe-master", "observability", "sentry"],
    xpReward: 300,
    description: `## Frontend Error Observability Fingerprinter

### Description
Error tracking systems (Sentry, Datadog) group recurring runtime exceptions into issues by fingerprinting error name, message, and top stack frame.
Given error payload \`{ name: "TypeError", message: "x is undefined", file: "Button.jsx", line: 42 }\`, compute unique issue fingerprint string.

### Learning Objectives
- Formulate deterministic grouping hashes for production frontend observability.

### Example
\`Input: "TypeError", "Cannot read null", "App.jsx", 20\`
\`Output: "TypeError:Cannot read null:App.jsx:20"\``,
    starterCode: {
      javascript: `function generateErrorFingerprint(name, message, file, line) {
  return \`\${name}:\${message}:\${file}:\${line}\`;
}`,
      python: `def generate_error_fingerprint(name, message, file, line):
    return f'{name}:{message}:{file}:{line}'`
    },
    testCases: [
      { input: '"TypeError", "Cannot read null", "App.jsx", 20', expectedOutput: '"TypeError:Cannot read null:App.jsx:20"', isHidden: false }
    ]
  }
];

module.exports = feTier5Expert;
