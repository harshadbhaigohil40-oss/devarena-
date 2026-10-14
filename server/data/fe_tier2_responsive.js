/**
 * Tier 2 — Responsive Design (25 Topics & Coding Challenges)
 * Node: fe-responsive
 * Difficulty: Easy / Medium
 */

const feTier2Responsive = [
  {
    id: "fe-resp-001",
    title: "Media Query Breakpoint Classifier",
    slug: "fe-breakpoint-classifier",
    tier: 2,
    section: "Responsive Design",
    topic: "Breakpoints",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "media-queries", "breakpoints"],
    xpReward: 50,
    description: `## Media Query Breakpoint Classifier

### Description
Classify screen width into standard mobile-first breakpoints:
- \`< 640px\`: \`"sm"\` (mobile)
- \`640px - 767px\`: \`"md"\` (tablet)
- \`768px - 1023px\`: \`"lg"\` (small desktop)
- \`1024px - 1279px\`: \`"xl"\` (desktop)
- \`>= 1280px\`: \`"2xl"\` (wide monitor)

### Learning Objectives
- Map viewport dimensions to standard responsive breakpoints.

### Example
\`Input: 720\`
\`Output: "md"\``,
    starterCode: {
      javascript: `function getBreakpoint(width) {
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
}`,
      python: `def get_breakpoint(width):
    if width < 640:
        return 'sm'
    if width < 768:
        return 'md'
    if width < 1024:
        return 'lg'
    if width < 1280:
        return 'xl'
    return '2xl'`
    },
    testCases: [
      { input: '720', expectedOutput: '"md"', isHidden: false },
      { input: '375', expectedOutput: '"sm"', isHidden: false },
      { input: '1440', expectedOutput: '"2xl"', isHidden: false },
      { input: '1024', expectedOutput: '"xl"', isHidden: true }
    ]
  },
  {
    id: "fe-resp-002",
    title: "CSS clamp() Value Calculator",
    slug: "fe-css-clamp-calculator",
    tier: 2,
    section: "Responsive Design",
    topic: "clamp()",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "css", "clamp"],
    xpReward: 100,
    description: `## CSS clamp() Value Calculator

### Description
The CSS \`clamp(min, val, max)\` function clamps an intermediate value between defined lower and upper bounds: \`Math.max(min, Math.min(val, max))\`.

### Learning Objectives
- Implement the exact mathematical behavior of CSS \`clamp()\`.

### Example
\`Input: 16, 24, 32\`
\`Output: 24\`
\`Input: 16, 12, 32\`
\`Output: 16\` (clamped at minimum)`,
    starterCode: {
      javascript: `function computeClamp(minVal, preferredVal, maxVal) {
  return Math.max(minVal, Math.min(preferredVal, maxVal));
}`,
      python: `def compute_clamp(min_val, preferred_val, max_val):
    return max(min_val, min(preferred_val, max_val))`
    },
    testCases: [
      { input: '16, 24, 32', expectedOutput: '24', isHidden: false },
      { input: '16, 12, 32', expectedOutput: '16', isHidden: false },
      { input: '16, 40, 32', expectedOutput: '32', isHidden: true }
    ]
  },
  {
    id: "fe-resp-003",
    title: "Viewport Units to Pixels Converter",
    slug: "fe-viewport-units-converter",
    tier: 2,
    section: "Responsive Design",
    topic: "Viewport Units",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "viewport", "units"],
    xpReward: 50,
    description: `## Viewport Units to Pixels Converter

### Description
Given viewport dimensions \`{ width, height }\`, convert a viewport unit string (e.g. \`"50vw"\` or \`"20vh"\`) into calculated pixels.

### Learning Objectives
- \`1vw = 1% of viewport width\`, \`1vh = 1% of viewport height\`.

### Example
\`Input: { width: 1920, height: 1080 }, "50vw"\`
\`Output: 960\``,
    starterCode: {
      javascript: `function viewportToPx(viewport, unitStr) {
  const val = parseFloat(unitStr);
  if (unitStr.endsWith('vw')) {
    return Math.round((val / 100) * viewport.width);
  } else if (unitStr.endsWith('vh')) {
    return Math.round((val / 100) * viewport.height);
  }
  return 0;
}`,
      python: `def viewport_to_px(viewport, unit_str):
    val = float(unit_str[:-2])
    if unit_str.endswith('vw'):
        return round((val / 100) * viewport['width'])
    elif unit_str.endswith('vh'):
        return round((val / 100) * viewport['height'])
    return 0`
    },
    testCases: [
      { input: '{"width":1920,"height":1080}, "50vw"', expectedOutput: '960', isHidden: false },
      { input: '{"width":1920,"height":1080}, "10vh"', expectedOutput: '108', isHidden: false }
    ]
  },
  {
    id: "fe-resp-004",
    title: "Fluid Typography Formula Calculator",
    slug: "fe-fluid-typography-formula",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Typography",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Typography",
    category: "frontend",
    tags: ["fe-responsive", "typography", "css"],
    xpReward: 100,
    description: `## Fluid Typography Formula Calculator

### Description
Fluid typography interpolates linearly between min font size at min viewport and max font size at max viewport.
Formula: \`fontSize = minFont + (maxFont - minFont) * ((currentViewport - minViewport) / (maxViewport - minViewport))\` clamped between minFont and maxFont.

### Learning Objectives
- Compute linear interpolation with boundary clamping.

### Example
\`Input: 16, 24, 400, 1200, 800\`
\`Output: 20\` (At 800px viewport, halfway between 400 and 1200, font is halfway between 16 and 24)`,
    starterCode: {
      javascript: `function calculateFluidFontSize(minFont, maxFont, minViewport, maxViewport, currentViewport) {
  if (currentViewport <= minViewport) return minFont;
  if (currentViewport >= maxViewport) return maxFont;
  const ratio = (currentViewport - minViewport) / (maxViewport - minViewport);
  const size = minFont + (maxFont - minFont) * ratio;
  return Math.round(size);
}`,
      python: `def calculate_fluid_font_size(min_font, max_font, min_viewport, max_viewport, current_viewport):
    if current_viewport <= min_viewport:
        return min_font
    if current_viewport >= max_viewport:
        return max_font
    ratio = (current_viewport - min_viewport) / (max_viewport - min_viewport)
    return round(min_font + (max_font - min_font) * ratio)`
    },
    testCases: [
      { input: '16, 24, 400, 1200, 800', expectedOutput: '20', isHidden: false },
      { input: '16, 24, 400, 1200, 320', expectedOutput: '16', isHidden: false },
      { input: '16, 24, 400, 1200, 1400', expectedOutput: '24', isHidden: true }
    ]
  },
  {
    id: "fe-resp-005",
    title: "Container Queries Breakpoint Evaluator",
    slug: "fe-container-queries-evaluator",
    tier: 2,
    section: "Responsive Design",
    topic: "Container Queries",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Container Queries",
    category: "frontend",
    tags: ["fe-responsive", "container-queries", "layout"],
    xpReward: 100,
    description: `## Container Queries Breakpoint Evaluator

### Description
CSS Container Queries evaluate styling relative to a parent container width rather than the viewport. Given container width and an array of breakpoints \`[{ minWidth: 400, layout: "stacked" }, { minWidth: 700, layout: "horizontal" }]\`, return the active layout rule.

### Learning Objectives
- Evaluate CSS \`@container (min-width: X)\` cascade behavior.

### Example
\`Input: 500, [{ minWidth: 0, layout: "single" }, { minWidth: 400, layout: "stacked" }, { minWidth: 700, layout: "horizontal" }]\`
\`Output: "stacked"\``,
    starterCode: {
      javascript: `function resolveContainerQuery(containerWidth, rules) {
  // Sort rules descending by minWidth
  const sorted = [...rules].sort((a, b) => b.minWidth - a.minWidth);
  for (const rule of sorted) {
    if (containerWidth >= rule.minWidth) {
      return rule.layout;
    }
  }
  return 'default';
}`,
      python: `def resolve_container_query(container_width, rules):
    sorted_rules = sorted(rules, key=lambda r: r['minWidth'], reverse=True)
    for rule in sorted_rules:
        if container_width >= rule['minWidth']:
            return rule['layout']
    return 'default'`
    },
    testCases: [
      { input: '500, [{"minWidth":0,"layout":"single"},{"minWidth":400,"layout":"stacked"},{"minWidth":700,"layout":"horizontal"}]', expectedOutput: '"stacked"', isHidden: false },
      { input: '800, [{"minWidth":0,"layout":"single"},{"minWidth":400,"layout":"stacked"},{"minWidth":700,"layout":"horizontal"}]', expectedOutput: '"horizontal"', isHidden: false }
    ]
  },
  {
    id: "fe-resp-006",
    title: "Touch Target Minimum Size Validator",
    slug: "fe-touch-target-validator",
    tier: 2,
    section: "Responsive Design",
    topic: "Touch-Friendly Interfaces",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-responsive", "touch", "accessibility"],
    xpReward: 50,
    description: `## Touch Target Minimum Size Validator

### Description
WCAG 2.5.5 specifies that interactive touch targets should be at least 44x44 CSS pixels (or 48x48 on Android) to prevent misclicks on touch-enabled devices.

### Learning Objectives
- Validate element dimensions: \`width >= 44 && height >= 44\`.

### Example
\`Input: 48, 48\`
\`Output: { accessible: true, missingWidth: 0, missingHeight: 0 }\`
\`Input: 30, 44\`
\`Output: { accessible: false, missingWidth: 14, missingHeight: 0 }\``,
    starterCode: {
      javascript: `function validateTouchTarget(width, height) {
  const missingWidth = Math.max(0, 44 - width);
  const missingHeight = Math.max(0, 44 - height);
  return {
    accessible: missingWidth === 0 && missingHeight === 0,
    missingWidth,
    missingHeight
  };
}`,
      python: `def validate_touch_target(width, height):
    missing_w = max(0, 44 - width)
    missing_h = max(0, 44 - height)
    return {
        'accessible': missing_w == 0 and missing_h == 0,
        'missingWidth': missing_w,
        'missingHeight': missing_h
    }`
    },
    testCases: [
      { input: '48, 48', expectedOutput: '{"accessible":true,"missingWidth":0,"missingHeight":0}', isHidden: false },
      { input: '30, 44', expectedOutput: '{"accessible":false,"missingWidth":14,"missingHeight":0}', isHidden: false },
      { input: '44, 44', expectedOutput: '{"accessible":true,"missingWidth":0,"missingHeight":0}', isHidden: true }
    ]
  },
  {
    id: "fe-resp-007",
    title: "Responsive Image Srcset DPI Matcher",
    slug: "fe-responsive-srcset-dpi",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Images",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Images",
    category: "frontend",
    tags: ["fe-responsive", "images", "srcset"],
    xpReward: 50,
    description: `## Responsive Image Srcset DPI Matcher

### Description
High-density displays (Retina) load 2x or 3x asset resolutions using \`srcset="image.png 1x, image@2x.png 2x"\`. Given device pixel ratio (DPR), pick the optimal image source from candidate map \`{ 1: "img.png", 2: "img@2x.png", 3: "img@3x.png" }\`.

### Learning Objectives
- Select candidate asset matching or exceeding DPR.

### Example
\`Input: 2, { 1: "img.png", 2: "img@2x.png", 3: "img@3x.png" }\`
\`Output: "img@2x.png"\``,
    starterCode: {
      javascript: `function selectDpiImage(dpr, candidates) {
  const roundedDpr = Math.min(3, Math.max(1, Math.round(dpr)));
  return candidates[roundedDpr] || candidates[1];
}`,
      python: `def select_dpi_image(dpr, candidates):
    rounded = min(3, max(1, round(dpr)))
    return candidates.get(rounded, candidates.get(1))`
    },
    testCases: [
      { input: '2, {"1":"img.png","2":"img@2x.png","3":"img@3x.png"}', expectedOutput: '"img@2x.png"', isHidden: false },
      { input: '1, {"1":"img.png","2":"img@2x.png"}', expectedOutput: '"img.png"', isHidden: false }
    ]
  },
  {
    id: "fe-resp-008",
    title: "Aspect Ratio Height Calculator",
    slug: "fe-aspect-ratio-calculator",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Images",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-responsive", "aspect-ratio", "layout"],
    xpReward: 50,
    description: `## Aspect Ratio Height Calculator

### Description
To prevent Cumulative Layout Shift (CLS), responsive image and video containers preserve aspect ratios (\`16:9\`, \`4:3\`, \`1:1\`). Given width and aspect ratio string \`"W:H"\`, return computed height.

### Learning Objectives
- Compute height: \`height = Math.round(width * (H / W))\`.

### Example
\`Input: 640, "16:9"\`
\`Output: 360\``,
    starterCode: {
      javascript: `function calculateAspectHeight(width, ratioStr) {
  const [w, h] = ratioStr.split(':').map(Number);
  return Math.round(width * (h / w));
}`,
      python: `def calculate_aspect_height(width, ratio_str):
    w, h = [float(x) for x in ratio_str.split(':')]
    return round(width * (h / w))`
    },
    testCases: [
      { input: '640, "16:9"', expectedOutput: '360', isHidden: false },
      { input: '400, "1:1"', expectedOutput: '400', isHidden: false },
      { input: '800, "4:3"', expectedOutput: '600', isHidden: true }
    ]
  },
  {
    id: "fe-resp-009",
    title: "Device Orientation Classifier",
    slug: "fe-device-orientation-classifier",
    tier: 2,
    section: "Responsive Design",
    topic: "Orientation",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "orientation"],
    xpReward: 50,
    description: `## Device Orientation Classifier

### Description
CSS media query \`(orientation: portrait)\` matches when height exceeds or equals width; otherwise \`(orientation: landscape)\` matches.

### Learning Objectives
- Return \`"portrait"\` if \`height >= width\`, else \`"landscape"\`.

### Example
\`Input: 375, 812\`
\`Output: "portrait"\`
\`Input: 812, 375\`
\`Output: "landscape"\``,
    starterCode: {
      javascript: `function getOrientation(width, height) {
  return height >= width ? 'portrait' : 'landscape';
}`,
      python: `def get_orientation(width, height):
    return 'portrait' if height >= width else 'landscape'`
    },
    testCases: [
      { input: '375, 812', expectedOutput: '"portrait"', isHidden: false },
      { input: '812, 375', expectedOutput: '"landscape"', isHidden: false }
    ]
  },
  {
    id: "fe-resp-010",
    title: "Flex Wrap Break Lines Counter",
    slug: "fe-flex-wrap-counter",
    tier: 2,
    section: "Responsive Design",
    topic: "Flexbox for Responsive Design",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Flexbox",
    category: "frontend",
    tags: ["fe-responsive", "flexbox", "layout"],
    xpReward: 100,
    description: `## Flex Wrap Break Lines Counter

### Description
In a flex container with \`flex-wrap: wrap\` and \`gap\`, items wrap to a new line whenever the next item exceeds remaining row capacity. Given container width, item widths array, and gap, calculate how many rows are formed.

### Learning Objectives
- Accumulate items along lines accounting for intervening gap spaces.

### Example
\`Input: 500, [200, 200, 200], 20\`
\`Output: 2\` (Line 1 holds 200 + 20 + 200 = 420 <= 500; 3rd item wraps to line 2)`,
    starterCode: {
      javascript: `function countFlexLines(containerWidth, itemWidths, gap) {
  if (itemWidths.length === 0) return 0;
  let lines = 1;
  let curWidth = itemWidths[0];
  for (let i = 1; i < itemWidths.length; i++) {
    const nextWidth = curWidth + gap + itemWidths[i];
    if (nextWidth <= containerWidth) {
      curWidth = nextWidth;
    } else {
      lines++;
      curWidth = itemWidths[i];
    }
  }
  return lines;
}`,
      python: `def count_flex_lines(container_width, item_widths, gap):
    if not item_widths:
        return 0
    lines = 1
    cur_width = item_widths[0]
    for w in item_widths[1:]:
        if cur_width + gap + w <= container_width:
            cur_width += gap + w
        else:
            lines += 1
            cur_width = w
    return lines`
    },
    testCases: [
      { input: '500, [200, 200, 200], 20', expectedOutput: '2', isHidden: false },
      { input: '600, [100, 100, 100], 10', expectedOutput: '1', isHidden: false },
      { input: '300, [200, 200, 200], 10', expectedOutput: '3', isHidden: true }
    ]
  },

  // ─── Responsive Practice Projects (11-20) ───
  {
    id: "fe-resp-011",
    title: "Responsive Portfolio Grid Sizer",
    slug: "fe-project-responsive-portfolio",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "portfolio", "grid"],
    xpReward: 50,
    description: `## Responsive Portfolio Grid Sizer

### Description
A portfolio page switches project column cards across devices:
- Mobile (< 640px): 1 column
- Tablet (640px - 1023px): 2 columns
- Desktop (>= 1024px): 3 columns
Given viewport width, return column count and per-card width with 16px gap.

### Learning Objectives
- Compute card widths: \`cardWidth = Math.floor((containerWidth - (cols - 1) * gap) / cols)\`.

### Example
\`Input: 1000, 16\` (Tablet: 2 cols)
\`Output: { columns: 2, cardWidth: 492 }\``,
    starterCode: {
      javascript: `function getPortfolioCardLayout(viewportWidth, gap = 16) {
  const cols = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : 3;
  const cardWidth = Math.floor((viewportWidth - (cols - 1) * gap) / cols);
  return { columns: cols, cardWidth };
}`,
      python: `def get_portfolio_card_layout(viewport_width, gap=16):
    cols = 1 if viewport_width < 640 else 2 if viewport_width < 1024 else 3
    card_width = (viewport_width - (cols - 1) * gap) // cols
    return {'columns': cols, 'cardWidth': card_width}`
    },
    testCases: [
      { input: '1000, 16', expectedOutput: '{"columns":2,"cardWidth":492}', isHidden: false },
      { input: '500, 16', expectedOutput: '{"columns":1,"cardWidth":500}', isHidden: false },
      { input: '1200, 16', expectedOutput: '{"columns":3,"cardWidth":389}', isHidden: true }
    ]
  },
  {
    id: "fe-resp-012",
    title: "Responsive Landing Page Hero Sizer",
    slug: "fe-project-responsive-landing",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "landing-page", "hero"],
    xpReward: 50,
    description: `## Responsive Landing Page Hero Sizer

### Description
Landing page hero sections stack image below text on mobile, and place them side-by-side on desktop (>= 768px). Return \`{ direction: "column" | "row", textAlign: "center" | "left" }\`.

### Learning Objectives
- Map viewport threshold to Flexbox layout direction.

### Example
\`Input: 600\`
\`Output: { direction: "column", textAlign: "center" }\`
\`Input: 900\`
\`Output: { direction: "row", textAlign: "left" }\``,
    starterCode: {
      javascript: `function getLandingHeroLayout(viewportWidth) {
  const isDesktop = viewportWidth >= 768;
  return {
    direction: isDesktop ? 'row' : 'column',
    textAlign: isDesktop ? 'left' : 'center'
  };
}`,
      python: `def get_landing_hero_layout(viewport_width):
    is_desktop = viewport_width >= 768
    return {
        'direction': 'row' if is_desktop else 'column',
        'textAlign': 'left' if is_desktop else 'center'
    }`
    },
    testCases: [
      { input: '600', expectedOutput: '{"direction":"column","textAlign":"center"}', isHidden: false },
      { input: '900', expectedOutput: '{"direction":"row","textAlign":"left"}', isHidden: false }
    ]
  },
  {
    id: "fe-resp-013",
    title: "Responsive Dashboard Widget Layout",
    slug: "fe-project-responsive-dashboard",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "CSS Grid",
    category: "frontend",
    tags: ["fe-responsive", "dashboard", "grid"],
    xpReward: 100,
    description: `## Responsive Dashboard Widget Layout

### Description
A metrics dashboard arranges 4 metric widgets:
- Mobile: 1 col x 4 rows
- Tablet: 2 cols x 2 rows
- Desktop: 4 cols x 1 row
Given width, return \`{ columns: number, rows: number }\`.

### Learning Objectives
- Determine multi-dimensional grid distribution based on breakpoints.

### Example
\`Input: 800\`
\`Output: { columns: 2, rows: 2 }\``,
    starterCode: {
      javascript: `function getDashboardGrid(viewportWidth) {
  if (viewportWidth < 640) return { columns: 1, rows: 4 };
  if (viewportWidth < 1024) return { columns: 2, rows: 2 };
  return { columns: 4, rows: 1 };
}`,
      python: `def get_dashboard_grid(viewport_width):
    if viewport_width < 640:
        return {'columns': 1, 'rows': 4}
    if viewport_width < 1024:
        return {'columns': 2, 'rows': 2}
    return {'columns': 4, 'rows': 1}`
    },
    testCases: [
      { input: '800', expectedOutput: '{"columns":2,"rows":2}', isHidden: false },
      { input: '400', expectedOutput: '{"columns":1,"rows":4}', isHidden: false },
      { input: '1200', expectedOutput: '{"columns":4,"rows":1}', isHidden: true }
    ]
  },
  {
    id: "fe-resp-014",
    title: "Responsive E-commerce Filter Drawer State",
    slug: "fe-project-ecommerce-filter",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Adaptive UI",
    category: "frontend",
    tags: ["fe-responsive", "ecommerce", "drawer"],
    xpReward: 100,
    description: `## Responsive E-commerce Filter Drawer State

### Description
In e-commerce, filters display as a sticky left sidebar on desktop (>= 1024px), but collapse into an off-canvas drawer on mobile/tablet. Given viewport width and mobile drawer open boolean, return \`{ mode: "sidebar" | "drawer", isVisible: boolean }\`.

### Learning Objectives
- Render adaptive component mode depending on breakpoint.

### Example
\`Input: 1200, false\`
\`Output: { mode: "sidebar", isVisible: true }\`
\`Input: 600, false\`
\`Output: { mode: "drawer", isVisible: false }\``,
    starterCode: {
      javascript: `function getFilterDisplayState(viewportWidth, isDrawerOpen) {
  if (viewportWidth >= 1024) {
    return { mode: 'sidebar', isVisible: true };
  }
  return { mode: 'drawer', isVisible: isDrawerOpen };
}`,
      python: `def get_filter_display_state(viewport_width, is_drawer_open):
    if viewport_width >= 1024:
        return {'mode': 'sidebar', 'isVisible': True}
    return {'mode': 'drawer', 'isVisible': is_drawer_open}`
    },
    testCases: [
      { input: '1200, false', expectedOutput: '{"mode":"sidebar","isVisible":true}', isHidden: false },
      { input: '600, false', expectedOutput: '{"mode":"drawer","isVisible":false}', isHidden: false },
      { input: '600, true', expectedOutput: '{"mode":"drawer","isVisible":true}', isHidden: true }
    ]
  },
  {
    id: "fe-resp-015",
    title: "Responsive Blog Layout Sidebar Toggle",
    slug: "fe-project-blog-sidebar-toggle",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-responsive", "blog", "sidebar"],
    xpReward: 50,
    description: `## Responsive Blog Layout Sidebar Toggle

### Description
A blog post page displays table of contents and author bio in a side column when width >= 900px. Below 900px, the sidebar is placed at the article bottom.
Return layout configuration \`{ layout: "two-column" | "stacked", sidebarPosition: "aside" | "bottom" }\`.

### Learning Objectives
- Switch semantic structure based on viewport bounds.

### Example
\`Input: 1000\`
\`Output: { layout: "two-column", sidebarPosition: "aside" }\``,
    starterCode: {
      javascript: `function getBlogLayoutConfig(viewportWidth) {
  const isTwoCol = viewportWidth >= 900;
  return {
    layout: isTwoCol ? 'two-column' : 'stacked',
    sidebarPosition: isTwoCol ? 'aside' : 'bottom'
  };
}`,
      python: `def get_blog_layout_config(viewport_width):
    is_two_col = viewport_width >= 900
    return {
        'layout': 'two-column' if is_two_col else 'stacked',
        'sidebarPosition': 'aside' if is_two_col else 'bottom'
    }`
    },
    testCases: [
      { input: '1000', expectedOutput: '{"layout":"two-column","sidebarPosition":"aside"}', isHidden: false },
      { input: '600', expectedOutput: '{"layout":"stacked","sidebarPosition":"bottom"}', isHidden: false }
    ]
  },
  {
    id: "fe-resp-016",
    title: "Responsive Pricing Page Stacker",
    slug: "fe-project-pricing-stacker",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Flexbox",
    category: "frontend",
    tags: ["fe-responsive", "pricing", "cards"],
    xpReward: 50,
    description: `## Responsive Pricing Page Stacker

### Description
Pricing cards display horizontally side-by-side with equal flex-basis on desktop, but stack vertically on mobile (< 768px). Return \`{ flexDirection: "row" | "column", cardBasis: string }\`.

### Learning Objectives
- Configure flex-direction and basis responsively.

### Example
\`Input: 800\`
\`Output: { flexDirection: "row", cardBasis: "33.333%" }\`
\`Input: 500\`
\`Output: { flexDirection: "column", cardBasis: "100%" }\``,
    starterCode: {
      javascript: `function getPricingFlexConfig(viewportWidth) {
  const isRow = viewportWidth >= 768;
  return {
    flexDirection: isRow ? 'row' : 'column',
    cardBasis: isRow ? '33.333%' : '100%'
  };
}`,
      python: `def get_pricing_flex_config(viewport_width):
    is_row = viewport_width >= 768
    return {
        'flexDirection': 'row' if is_row else 'column',
        'cardBasis': '33.333%' if is_row else '100%'
    }`
    },
    testCases: [
      { input: '800', expectedOutput: '{"flexDirection":"row","cardBasis":"33.333%"}', isHidden: false },
      { input: '500', expectedOutput: '{"flexDirection":"column","cardBasis":"100%"}', isHidden: false }
    ]
  },
  {
    id: "fe-resp-017",
    title: "Responsive Navigation System Mode",
    slug: "fe-project-nav-system-mode",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Mobile First",
    category: "frontend",
    tags: ["fe-responsive", "navigation"],
    xpReward: 50,
    description: `## Responsive Navigation System Mode

### Description
Site navigation renders inline horizontal links when \`width >= 768px\`. Below 768px, it shows a hamburger icon that reveals a full-screen drawer. Return \`{ type: "inline" | "drawer", showHamburger: boolean }\`.

### Learning Objectives
- Toggle header controls across mobile and desktop breakpoints.

### Example
\`Input: 1024\`
\`Output: { type: "inline", showHamburger: false }\``,
    starterCode: {
      javascript: `function getNavSystemMode(viewportWidth) {
  const isInline = viewportWidth >= 768;
  return {
    type: isInline ? 'inline' : 'drawer',
    showHamburger: !isInline
  };
}`,
      python: `def get_nav_system_mode(viewport_width):
    is_inline = viewport_width >= 768
    return {
        'type': 'inline' if is_inline else 'drawer',
        'showHamburger': not is_inline
    }`
    },
    testCases: [
      { input: '1024', expectedOutput: '{"type":"inline","showHamburger":false}', isHidden: false },
      { input: '600', expectedOutput: '{"type":"drawer","showHamburger":true}', isHidden: false }
    ]
  },
  {
    id: "fe-resp-018",
    title: "Responsive Admin Panel Sidebar Collapse",
    slug: "fe-project-admin-sidebar-collapse",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Adaptive UI",
    category: "frontend",
    tags: ["fe-responsive", "admin", "sidebar"],
    xpReward: 100,
    description: `## Responsive Admin Panel Sidebar Collapse

### Description
In an admin panel, the sidebar operates in 3 modes:
- Wide desktop (>= 1200px): \`"expanded"\` (width: 250px)
- Small desktop/tablet (768px - 1199px): \`"collapsed-icons-only"\` (width: 64px)
- Mobile (< 768px): \`"hidden-drawer"\` (width: 0px)
Return \`{ mode: string, sidebarWidth: number, mainContentOffset: number }\`.

### Learning Objectives
- Manage multi-tiered layout states in enterprise web portals.

### Example
\`Input: 900\`
\`Output: { mode: "collapsed-icons-only", sidebarWidth: 64, mainContentOffset: 64 }\``,
    starterCode: {
      javascript: `function getAdminSidebarLayout(viewportWidth) {
  if (viewportWidth >= 1200) {
    return { mode: 'expanded', sidebarWidth: 250, mainContentOffset: 250 };
  }
  if (viewportWidth >= 768) {
    return { mode: 'collapsed-icons-only', sidebarWidth: 64, mainContentOffset: 64 };
  }
  return { mode: 'hidden-drawer', sidebarWidth: 0, mainContentOffset: 0 };
}`,
      python: `def get_admin_sidebar_layout(viewport_width):
    if viewport_width >= 1200:
        return {'mode': 'expanded', 'sidebarWidth': 250, 'mainContentOffset': 250}
    if viewport_width >= 768:
        return {'mode': 'collapsed-icons-only', 'sidebarWidth': 64, 'mainContentOffset': 64}
    return {'mode': 'hidden-drawer', 'sidebarWidth': 0, 'mainContentOffset': 0}`
    },
    testCases: [
      { input: '900', expectedOutput: '{"mode":"collapsed-icons-only","sidebarWidth":64,"mainContentOffset":64}', isHidden: false },
      { input: '1440', expectedOutput: '{"mode":"expanded","sidebarWidth":250,"mainContentOffset":250}', isHidden: false },
      { input: '400', expectedOutput: '{"mode":"hidden-drawer","sidebarWidth":0,"mainContentOffset":0}', isHidden: true }
    ]
  },
  {
    id: "fe-resp-019",
    title: "Responsive Product Grid Auto-Fit Sizer",
    slug: "fe-project-product-grid-sizer",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "CSS Grid",
    category: "frontend",
    tags: ["fe-responsive", "ecommerce", "grid"],
    xpReward: 100,
    description: `## Responsive Product Grid Auto-Fit Sizer

### Description
Given total container width, minimum card width, and grid gap, calculate the exact card width allocated by \`repeat(auto-fit, minmax(minCardWidth, 1fr))\`.

### Learning Objectives
- Calculate column count \`N = Math.floor((containerWidth + gap) / (minCardWidth + gap))\`.
- Divide remaining width equally: \`cardWidth = (containerWidth - (N - 1) * gap) / N\`.

### Example
\`Input: 900, 200, 20\`
\`Output: { cols: 4, cardWidth: 210 }\``,
    starterCode: {
      javascript: `function calculateAutoFitCardWidth(containerWidth, minCardWidth, gap) {
  const cols = Math.max(1, Math.floor((containerWidth + gap) / (minCardWidth + gap)));
  const cardWidth = Math.floor((containerWidth - (cols - 1) * gap) / cols);
  return { cols, cardWidth };
}`,
      python: `def calculate_auto_fit_card_width(container_width, min_card_width, gap):
    cols = max(1, (container_width + gap) // (min_card_width + gap))
    card_width = (container_width - (cols - 1) * gap) // cols
    return {'cols': cols, 'cardWidth': card_width}`
    },
    testCases: [
      { input: '900, 200, 20', expectedOutput: '{"cols":4,"cardWidth":210}', isHidden: false },
      { input: '300, 200, 10', expectedOutput: '{"cols":1,"cardWidth":300}', isHidden: false }
    ]
  },
  {
    id: "fe-resp-020",
    title: "Responsive Image Gallery Masonry Layout",
    slug: "fe-project-gallery-masonry",
    tier: 2,
    section: "Responsive Design",
    topic: "Practice projects",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-responsive", "gallery", "masonry"],
    xpReward: 100,
    description: `## Responsive Image Gallery Masonry Layout

### Description
A multi-column masonry gallery assigns each incoming image card to the column with the minimum current height. Given column count and image heights, return column height totals.

### Learning Objectives
- Implement greedy column binning for balanced vertical layouts.

### Example
\`Input: 2, [100, 150, 200, 80]\`
\`Output: [300, 230]\` (100 -> col0, 150 -> col1, 200 -> col0 (100+200=300), 80 -> col1 (150+80=230))`,
    starterCode: {
      javascript: `function computeMasonryColumnHeights(numCols, itemHeights) {
  const cols = new Array(numCols).fill(0);
  for (const h of itemHeights) {
    let minIdx = 0;
    for (let i = 1; i < numCols; i++) {
      if (cols[i] < cols[minIdx]) minIdx = i;
    }
    cols[minIdx] += h;
  }
  return cols;
}`,
      python: `def compute_masonry_column_heights(num_cols, item_heights):
    cols = [0] * num_cols
    for h in item_heights:
        min_idx = cols.index(min(cols))
        cols[min_idx] += h
    return cols`
    },
    testCases: [
      { input: '2, [100, 150, 200, 80]', expectedOutput: '[300,230]', isHidden: false },
      { input: '3, [50, 50, 50, 50]', expectedOutput: '[100,50,50]', isHidden: false }
    ]
  },
  {
    id: "fe-resp-021",
    title: "Responsive Table Card Transformer",
    slug: "fe-responsive-table-card-transformer",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Tables",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "tables", "mobile"],
    xpReward: 100,
    description: `## Responsive Table Card Transformer

### Description
On small screens (< 600px), multi-column HTML tables collapse into stacked cards with \`data-label\` attributes for cell headers. Transform a table matrix into key-value card objects.

### Learning Objectives
- Map tabular records to mobile-friendly key-value card records.

### Example
\`Input: ["Name", "Role"], [["Alice", "Dev"], ["Bob", "Design"]]\`
\`Output: [{ "Name": "Alice", "Role": "Dev" }, { "Name": "Bob", "Role": "Design" }]\``,
    starterCode: {
      javascript: `function tableToCards(headers, rows) {
  return rows.map(row => {
    const card = {};
    headers.forEach((h, i) => {
      card[h] = row[i];
    });
    return card;
  });
}`,
      python: `def table_to_cards(headers, rows):
    return [{headers[i]: row[i] for i in range(len(headers))} for row in rows]`
    },
    testCases: [
      { input: '["Name", "Role"], [["Alice", "Dev"], ["Bob", "Design"]]', expectedOutput: '[{"Name":"Alice","Role":"Dev"},{"Name":"Bob","Role":"Design"}]', isHidden: false }
    ]
  },
  {
    id: "fe-resp-022",
    title: "Responsive Font Scale Ratio Generator",
    slug: "fe-font-scale-ratio",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Typography",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Typography",
    category: "frontend",
    tags: ["fe-responsive", "typography", "scale"],
    xpReward: 50,
    description: `## Responsive Font Scale Ratio Generator

### Description
Design systems use modular type scales (e.g. Major Third 1.25 on desktop, Minor Third 1.2 on mobile). Given base size 16px and ratio, return font sizes for \`[body, h3, h2, h1]\` rounded to nearest px.

### Learning Objectives
- Compute modular typographic hierarchy: \`base * ratio^level\`.

### Example
\`Input: 16, 1.25\`
\`Output: [16, 20, 25, 31]\``,
    starterCode: {
      javascript: `function getModularScale(base, ratio) {
  return [0, 1, 2, 3].map(level => Math.round(base * Math.pow(ratio, level)));
}`,
      python: `def get_modular_scale(base, ratio):
    return [round(base * (ratio ** level)) for level in range(4)]`
    },
    testCases: [
      { input: '16, 1.25', expectedOutput: '[16,20,25,31]', isHidden: false },
      { input: '16, 1.2', expectedOutput: '[16,19,23,28]', isHidden: false }
    ]
  },
  {
    id: "fe-resp-023",
    title: "CSS min() and max() Evaluator",
    slug: "fe-css-min-max-evaluator",
    tier: 2,
    section: "Responsive Design",
    topic: "min() and max()",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-responsive", "css", "min-max"],
    xpReward: 50,
    description: `## CSS min() and max() Evaluator

### Description
Evaluate CSS \`min(val1, val2)\` or \`max(val1, val2)\` calculations:
- \`min\`: sets maximum ceiling (e.g. \`width: min(100%, 800px)\`)
- \`max\`: sets minimum floor (e.g. \`font-size: max(16px, 2vw)\`)

### Learning Objectives
- Differentiate CSS min/max boundary constraints.

### Example
\`Input: "min", 800, 600\`
\`Output: 600\`
\`Input: "max", 16, 12\`
\`Output: 16\``,
    starterCode: {
      javascript: `function evaluateMinMax(fn, val1, val2) {
  return fn === 'min' ? Math.min(val1, val2) : Math.max(val1, val2);
}`,
      python: `def evaluate_min_max(fn, val1, val2):
    return min(val1, val2) if fn == 'min' else max(val1, val2)`
    },
    testCases: [
      { input: '"min", 800, 600', expectedOutput: '600', isHidden: false },
      { input: '"max", 16, 12', expectedOutput: '16', isHidden: false }
    ]
  },
  {
    id: "fe-resp-024",
    title: "Fluid Container Max Width & Padding Resolver",
    slug: "fe-fluid-container-padding",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Containers",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "containers", "layout"],
    xpReward: 50,
    description: `## Fluid Container Max Width & Padding Resolver

### Description
Content containers apply 16px gutter on mobile (< 768px) and 32px on desktop, capping content width at \`maxWidth\` (e.g. 1200px) centered via \`margin: 0 auto\`.
Given viewport width and maxWidth, return computed inner content width.

### Learning Objectives
- Compute inner width: \`Math.min(maxWidth, viewportWidth - 2 * padding)\`.

### Example
\`Input: 800, 1200\` (Tablet, 32px padding each side -> 800 - 64 = 736)
\`Output: 736\`
\`Input: 1400, 1200\` (Capped at maxWidth)
\`Output: 1200\``,
    starterCode: {
      javascript: `function getContainerInnerWidth(viewportWidth, maxWidth) {
  const padding = viewportWidth < 768 ? 16 : 32;
  const available = viewportWidth - (2 * padding);
  return Math.min(maxWidth, Math.max(0, available));
}`,
      python: `def get_container_inner_width(viewport_width, max_width):
    padding = 16 if viewport_width < 768 else 32
    available = viewport_width - (2 * padding)
    return min(max_width, max(0, available))`
    },
    testCases: [
      { input: '800, 1200', expectedOutput: '736', isHidden: false },
      { input: '1400, 1200', expectedOutput: '1200', isHidden: false },
      { input: '375, 1200', expectedOutput: '343', isHidden: true }
    ]
  },
  {
    id: "fe-resp-025",
    title: "Responsive Nav Link Stacker vs Collapser",
    slug: "fe-responsive-nav-link-stacker",
    tier: 2,
    section: "Responsive Design",
    topic: "Responsive Navigation",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Layout",
    category: "frontend",
    tags: ["fe-responsive", "navigation", "layout"],
    xpReward: 50,
    description: `## Responsive Nav Link Stacker vs Collapser

### Description
Calculate whether a horizontal navigation bar can fit its links given container width and total links width with 24px gaps, or if it must collapse into an overflow drawer button.

### Learning Objectives
- Compare required navigation width against available container capacity.

### Example
\`Input: 500, [80, 80, 80], 24\`
\`Output: { fits: true, requiredWidth: 288 }\` (3 links * 80 + 2 * 24 = 288 <= 500)
\`Input: 250, [80, 80, 80], 24\`
\`Output: { fits: false, requiredWidth: 288 }\``,
    starterCode: {
      javascript: `function checkNavFit(containerWidth, linkWidths, gap = 24) {
  const totalLinkWidth = linkWidths.reduce((a, b) => a + b, 0);
  const totalGaps = Math.max(0, linkWidths.length - 1) * gap;
  const requiredWidth = totalLinkWidth + totalGaps;
  return {
    fits: requiredWidth <= containerWidth,
    requiredWidth
  };
}`,
      python: `def check_nav_fit(container_width, link_widths, gap=24):
    total_link = sum(link_widths)
    total_gaps = max(0, len(link_widths) - 1) * gap
    req = total_link + total_gaps
    return {
        'fits': req <= container_width,
        'requiredWidth': req
    }`
    },
    testCases: [
      { input: '500, [80, 80, 80], 24', expectedOutput: '{"fits":true,"requiredWidth":288}', isHidden: false },
      { input: '250, [80, 80, 80], 24', expectedOutput: '{"fits":false,"requiredWidth":288}', isHidden: false }
    ]
  }
];

module.exports = feTier2Responsive;
