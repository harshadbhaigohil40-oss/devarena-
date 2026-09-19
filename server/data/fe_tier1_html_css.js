/**
 * Tier 1 — HTML & CSS (35 Topics & Coding Challenges)
 * Node: fe-html
 * Difficulty: Beginner / Easy
 */

const feTier1HtmlCss = [
  // ─── HTML Fundamentals (1-10) ───
  {
    id: "fe-tier1-001",
    title: "HTML Document Structure & Doctype",
    slug: "fe-html-document-structure",
    tier: 1,
    section: "HTML & CSS",
    topic: "HTML Document Structure",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Document Structure",
    category: "frontend",
    tags: ["fe-html", "html", "document-structure", "fundamentals"],
    xpReward: 50,
    description: `## HTML Document Structure & Doctype

### Description
Every modern HTML document starts with a \`<!DOCTYPE html>\` declaration followed by root \`<html>\`, \`<head>\`, and \`<body>\` tags. The head contains metadata, page title, and charset settings, while the body encapsulates rendered content.

### Learning Objectives
- Understand the role of the HTML5 DOCTYPE declaration.
- Structure document hierarchy with proper \`lang\` attribute and metadata.
- Validate essential HTML tags required for compliant pages.

### Example
\`Input: { title: "DevArena", lang: "en" }\`
\`Output: "<!DOCTYPE html><html lang=\\"en\\"><head><title>DevArena</title></head><body></body></html>"\`

### Constraints
- Language defaults to \`"en"\` if omitted.
- Output string must have no extraneous whitespace between tags.`,
    starterCode: {
      javascript: `function buildHtmlDocument(title, lang = 'en') {
  // Return standard HTML5 document string
  return \`<!DOCTYPE html><html lang="\${lang}"><head><title>\${title}</title></head><body></body></html>\`;
}`,
      python: `def build_html_document(title, lang='en'):
    # Return standard HTML5 document string
    return f'<!DOCTYPE html><html lang="{lang}"><head><title>{title}</title></head><body></body></html>'`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>DevArena</title>
</head>
<body>
</body>
</html>`
    },
    testCases: [
      { input: '"DevArena", "en"', expectedOutput: '"<!DOCTYPE html><html lang=\\"en\\"><head><title>DevArena</title></head><body></body></html>"', isHidden: false },
      { input: '"My Portfolio", "es"', expectedOutput: '"<!DOCTYPE html><html lang=\\"es\\"><head><title>My Portfolio</title></head><body></body></html>"', isHidden: false },
      { input: '"App", "fr"', expectedOutput: '"<!DOCTYPE html><html lang=\\"fr\\"><head><title>App</title></head><body></body></html>"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-002",
    title: "Semantic HTML Layout Builder",
    slug: "fe-semantic-html-layout",
    tier: 1,
    section: "HTML & CSS",
    topic: "Semantic HTML",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Semantic HTML",
    category: "frontend",
    tags: ["fe-html", "semantic-html", "layout", "accessibility"],
    xpReward: 50,
    description: `## Semantic HTML Layout Builder

### Description
Semantic elements clearly describe their meaning to both browser and developer (e.g., \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<aside>\`, \`<footer>\`). They enhance accessibility for screen readers and improve SEO ranking.

### Learning Objectives
- Replace generic \`<div>\` structures with appropriate semantic container tags.
- Construct standard application shell layouts with header, main content, and footer.

### Example
\`Input: ["Home", "About"], "Welcome to DevArena"\`
\`Output: "<header><nav>Home | About</nav></header><main><p>Welcome to DevArena</p></main><footer>© 2026</footer>"\`

### Constraints
- Navigation items are separated by \`" | "\`.
- Footer always contains copyright notice \`"© 2026"\`.`,
    starterCode: {
      javascript: `function buildSemanticLayout(navLinks, mainContent) {
  const navStr = navLinks.join(' | ');
  return \`<header><nav>\${navStr}</nav></header><main><p>\${mainContent}</p></main><footer>© 2026</footer>\`;
}`,
      python: `def build_semantic_layout(nav_links, main_content):
    nav_str = ' | '.join(nav_links)
    return f'<header><nav>{nav_str}</nav></header><main><p>{main_content}</p></main><footer>© 2026</footer>'`
    },
    testCases: [
      { input: '["Home", "About"], "Welcome to DevArena"', expectedOutput: '"<header><nav>Home | About</nav></header><main><p>Welcome to DevArena</p></main><footer>© 2026</footer>"', isHidden: false },
      { input: '["Docs", "Blog", "Contact"], "Read our docs"', expectedOutput: '"<header><nav>Docs | Blog | Contact</nav></header><main><p>Read our docs</p></main><footer>© 2026</footer>"', isHidden: false },
      { input: '["Login"], "Please sign in"', expectedOutput: '"<header><nav>Login</nav></header><main><p>Please sign in</p></main><footer>© 2026</footer>"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-003",
    title: "Accessible Form Control Generator",
    slug: "fe-accessible-form-controls",
    tier: 1,
    section: "HTML & CSS",
    topic: "Accessible Forms",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-html", "forms", "accessibility", "aria"],
    xpReward: 50,
    description: `## Accessible Form Control Generator

### Description
Every form input must be associated with a \`<label>\` element using matching \`for\` and \`id\` attributes, or wrapped directly, to allow screen readers and assistive tech to announce the field accurately.

### Learning Objectives
- Generate properly bound \`<label for="id">\` and \`<input id="id">\` pairings.
- Support required fields with \`aria-required="true"\`.

### Example
\`Input: "username", "Username", "text", true\`
\`Output: "<label for=\\"username\\">Username</label><input type=\\"text\\" id=\\"username\\" name=\\"username\\" aria-required=\\"true\\"/>"\`

### Constraints
- If \`isRequired\` is false, omit \`aria-required\`.`,
    starterCode: {
      javascript: `function createAccessibleInput(id, label, type, isRequired) {
  const reqAttr = isRequired ? ' aria-required="true"' : '';
  return \`<label for="\${id}">\${label}</label><input type="\${type}" id="\${id}" name="\${id}"\${reqAttr}/>\`;
}`,
      python: `def create_accessible_input(id, label, type, is_required):
    req_attr = ' aria-required="true"' if is_required else ''
    return f'<label for="{id}">{label}</label><input type="{type}" id="{id}" name="{id}"{req_attr}/>'`
    },
    testCases: [
      { input: '"username", "Username", "text", true', expectedOutput: '"<label for=\\"username\\">Username</label><input type=\\"text\\" id=\\"username\\" name=\\"username\\" aria-required=\\"true\\"/>"', isHidden: false },
      { input: '"email", "Email Address", "email", false', expectedOutput: '"<label for=\\"email\\">Email Address</label><input type=\\"email\\" id=\\"email\\" name=\\"email\\"/>"', isHidden: false },
      { input: '"password", "Password", "password", true', expectedOutput: '"<label for=\\"password\\">Password</label><input type=\\"password\\" id=\\"password\\" name=\\"password\\" aria-required=\\"true\\"/>"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-004",
    title: "ARIA Roles and Attributes",
    slug: "fe-aria-roles-attributes",
    tier: 1,
    section: "HTML & CSS",
    topic: "ARIA Basics",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-html", "aria", "accessibility"],
    xpReward: 50,
    description: `## ARIA Roles and Attributes

### Description
Accessible Rich Internet Applications (WAI-ARIA) specifies roles and attributes like \`role="dialog"\`, \`aria-expanded\`, \`aria-haspopup\`, and \`aria-labelledby\` to bridge semantic gaps in dynamic widgets.

### Learning Objectives
- Formulate button toggles with proper \`aria-expanded\` state.
- Bind accessible controls to target popup elements.

### Example
\`Input: "menu-btn", "main-nav", true\`
\`Output: "<button id=\\"menu-btn\\" aria-haspopup=\\"true\\" aria-expanded=\\"true\\" aria-controls=\\"main-nav\\">Menu</button>"\`

### Constraints
- \`isExpanded\` is boolean \`true\` or \`false\`.`,
    starterCode: {
      javascript: `function createAriaButton(btnId, targetId, isExpanded) {
  return \`<button id="\${btnId}" aria-haspopup="true" aria-expanded="\${isExpanded}" aria-controls="\${targetId}">Menu</button>\`;
}`,
      python: `def create_aria_button(btn_id, target_id, is_expanded):
    exp_str = 'true' if is_expanded else 'false'
    return f'<button id="{btn_id}" aria-haspopup="true" aria-expanded="{exp_str}" aria-controls="{target_id}">Menu</button>'`
    },
    testCases: [
      { input: '"menu-btn", "main-nav", true', expectedOutput: '"<button id=\\"menu-btn\\" aria-haspopup=\\"true\\" aria-expanded=\\"true\\" aria-controls=\\"main-nav\\">Menu</button>"', isHidden: false },
      { input: '"dropdown-btn", "drop-list", false', expectedOutput: '"<button id=\\"dropdown-btn\\" aria-haspopup=\\"true\\" aria-expanded=\\"false\\" aria-controls=\\"drop-list\\">Menu</button>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-005",
    title: "Data Attributes & Dataset Parser",
    slug: "fe-data-attributes-dataset",
    tier: 1,
    section: "HTML & CSS",
    topic: "Data Attributes",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Document Structure",
    category: "frontend",
    tags: ["fe-html", "data-attributes", "dom"],
    xpReward: 50,
    description: `## Data Attributes & Dataset Parser

### Description
HTML \`data-*\` attributes store custom private data on elements. In JavaScript, these are accessible via the \`element.dataset\` object, converting hyphenated names (\`data-user-id\`) into camelCase (\`userId\`).

### Learning Objectives
- Convert key-value pairs into valid \`data-*\` HTML attribute strings.
- Transform camelCase keys into hyphenated attribute names.

### Example
\`Input: { userId: 42, role: "admin" }\`
\`Output: "data-user-id=\\"42\\" data-role=\\"admin\\""\`

### Constraints
- Keys must be sorted alphabetically in the output.`,
    starterCode: {
      javascript: `function serializeDataAttributes(obj) {
  return Object.keys(obj)
    .sort()
    .map(key => {
      const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return \`data-\${kebab}="\${obj[key]}"\`;
    })
    .join(' ');
}`,
      python: `import re

def serialize_data_attributes(obj):
    keys = sorted(obj.keys())
    parts = []
    for k in keys:
        kebab = re.sub(r'([A-Z])', r'-\\1', k).lower()
        parts.append(f'data-{kebab}="{obj[k]}"')
    return ' '.join(parts)`
    },
    testCases: [
      { input: '{"userId": 42, "role": "admin"}', expectedOutput: '"data-role=\\"admin\\" data-user-id=\\"42\\""', isHidden: false },
      { input: '{"tooltipPosition": "top"}', expectedOutput: '"data-tooltip-position=\\"top\\""', isHidden: false },
      { input: '{"count": 0, "isActive": true}', expectedOutput: '"data-count=\\"0\\" data-is-active=\\"true\\""', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-006",
    title: "Meta Tags & Open Graph SEO Generator",
    slug: "fe-meta-tags-open-graph",
    tier: 1,
    section: "HTML & CSS",
    topic: "Meta Tags",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "SEO",
    category: "frontend",
    tags: ["fe-html", "seo", "meta-tags"],
    xpReward: 50,
    description: `## Meta Tags & Open Graph SEO Generator

### Description
Proper SEO and social sharing preview cards rely on \`<meta>\` description tags and Open Graph protocol tags (\`og:title\`, \`og:description\`, \`og:image\`).

### Learning Objectives
- Generate SEO meta tags for description and viewport.
- Construct Open Graph tags for social scrapers.

### Example
\`Input: "DevArena", "Interactive coding arena", "https://devarena.com/og.png"\`
\`Output: "<meta name=\\"description\\" content=\\"Interactive coding arena\\"><meta property=\\"og:title\\" content=\\"DevArena\\"><meta property=\\"og:image\\" content=\\"https://devarena.com/og.png\\">"\`

### Constraints
- Concatenate tags directly with no whitespace between them.`,
    starterCode: {
      javascript: `function generateSeoMeta(title, desc, img) {
  return \`<meta name="description" content="\${desc}"><meta property="og:title" content="\${title}"><meta property="og:image" content="\${img}">\`;
}`,
      python: `def generate_seo_meta(title, desc, img):
    return f'<meta name="description" content="{desc}"><meta property="og:title" content="{title}"><meta property="og:image" content="{img}">'`
    },
    testCases: [
      { input: '"DevArena", "Interactive coding arena", "https://devarena.com/og.png"', expectedOutput: '"<meta name=\\"description\\" content=\\"Interactive coding arena\\"><meta property=\\"og:title\\" content=\\"DevArena\\"><meta property=\\"og:image\\" content=\\"https://devarena.com/og.png\\">"', isHidden: false },
      { input: '"My Blog", "Tech insights", "/banner.jpg"', expectedOutput: '"<meta name=\\"description\\" content=\\"Tech insights\\"><meta property=\\"og:title\\" content=\\"My Blog\\"><meta property=\\"og:image\\" content=\\"/banner.jpg\\">"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-007",
    title: "HTML Table Matrix Formatter",
    slug: "fe-html-table-matrix",
    tier: 1,
    section: "HTML & CSS",
    topic: "Tables",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Document Structure",
    category: "frontend",
    tags: ["fe-html", "tables", "semantic-html"],
    xpReward: 50,
    description: `## HTML Table Matrix Formatter

### Description
Accessible tabular data requires \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th>\` (with \`scope="col"\`), and \`<td>\` elements for screen readers.

### Learning Objectives
- Render structured 2D arrays into accessible HTML tables.
- Add \`scope="col"\` to all column header cells.

### Example
\`Input: ["Name", "Score"], [["Alice", 95], ["Bob", 88]]\`
\`Output: "<table><thead><tr><th scope=\\"col\\">Name</th><th scope=\\"col\\">Score</th></tr></thead><tbody><tr><td>Alice</td><td>95</td></tr><tr><td>Bob</td><td>88</td></tr></tbody></table>"\`

### Constraints
- Assume valid non-empty arrays with matching column counts.`,
    starterCode: {
      javascript: `function formatHtmlTable(headers, rows) {
  const ths = headers.map(h => \`<th scope="col">\${h}</th>\`).join('');
  const trs = rows.map(r => '<tr>' + r.map(c => \`<td>\${c}</td>\`).join('') + '</tr>').join('');
  return \`<table><thead><tr>\${ths}</tr></thead><tbody>\${trs}</tbody></table>\`;
}`,
      python: `def format_html_table(headers, rows):
    ths = ''.join(f'<th scope="col">{h}</th>' for h in headers)
    trs = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<table><thead><tr>{ths}</tr></thead><tbody>{trs}</tbody></table>'`
    },
    testCases: [
      { input: '["Name", "Score"], [["Alice", 95], ["Bob", 88]]', expectedOutput: '"<table><thead><tr><th scope=\\"col\\">Name</th><th scope=\\"col\\">Score</th></tr></thead><tbody><tr><td>Alice</td><td>95</td></tr><tr><td>Bob</td><td>88</td></tr></tbody></table>"', isHidden: false },
      { input: '["ID", "Status"], [[1, "OK"]]', expectedOutput: '"<table><thead><tr><th scope=\\"col\\">ID</th><th scope=\\"col\\">Status</th></tr></thead><tbody><tr><td>1</td><td>OK</td></tr></tbody></table>"', isHidden: false }
    ]
  },

  // ─── CSS Fundamentals & Specificity (8-14) ───
  {
    id: "fe-tier1-008",
    title: "CSS Specificity Calculator",
    slug: "fe-css-specificity-calculator",
    tier: 1,
    section: "HTML & CSS",
    topic: "Specificity",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Specificity",
    category: "frontend",
    tags: ["fe-html", "css", "specificity", "cascade"],
    xpReward: 50,
    description: `## CSS Specificity Calculator

### Description
CSS Specificity determines which styling rule is applied by browsers. It is calculated as a 3-part tuple: \`[IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements]\`.
Inline styles and \`!important\` take override precedence.

### Learning Objectives
- Calculate specificity tuple \`[a, b, c]\` for standard CSS selectors.
- Count IDs (\`#id\`), classes (\`.class\`), and tag names (\`div\`, \`p\`).

### Example
\`Input: "#header .nav li"\`
\`Output: [1, 1, 1]\` (1 ID, 1 class, 1 element)

### Constraints
- Selector contains only standard IDs, classes, and element tags separated by spaces.`,
    starterCode: {
      javascript: `function calculateSpecificity(selector) {
  let ids = 0, classes = 0, elements = 0;
  const parts = selector.trim().split(/\\s+/);
  for (const part of parts) {
    if (part.startsWith('#')) ids++;
    else if (part.startsWith('.')) classes++;
    else if (part.length > 0) elements++;
  }
  return [ids, classes, elements];
}`,
      python: `def calculate_specificity(selector):
    ids = 0
    classes = 0
    elements = 0
    parts = selector.strip().split()
    for part in parts:
        if part.startswith('#'):
            ids += 1
        elif part.startswith('.'):
            classes += 1
        elif len(part) > 0:
            elements += 1
    return [ids, classes, elements]`
    },
    testCases: [
      { input: '"#header .nav li"', expectedOutput: '[1,1,1]', isHidden: false },
      { input: '".btn .btn-primary"', expectedOutput: '[0,2,0]', isHidden: false },
      { input: '"nav ul li a"', expectedOutput: '[0,0,4]', isHidden: false },
      { input: '"#main"', expectedOutput: '[1,0,0]', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-009",
    title: "CSS Box Model Total Dimensions",
    slug: "fe-css-box-model-dimensions",
    tier: 1,
    section: "HTML & CSS",
    topic: "Box Model",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Box Model",
    category: "frontend",
    tags: ["fe-html", "css", "box-model"],
    xpReward: 50,
    description: `## CSS Box Model Total Dimensions

### Description
In CSS, the total rendered width depends on \`box-sizing\`:
- \`content-box\`: Total = \`width + 2*(padding + border + margin)\`
- \`border-box\`: Total = \`width + 2*margin\` (padding and border are absorbed inside width)

### Learning Objectives
- Differentiate between \`content-box\` and \`border-box\` sizing behaviors.
- Calculate exact computed box footprint.

### Example
\`Input: 200, 10, 2, 20, "border-box"\`
\`Output: 240\` (200 width + 20*2 margin)

### Constraints
- Inputs: width, padding, border, margin, boxSizing ("content-box" | "border-box").`,
    starterCode: {
      javascript: `function calculateTotalWidth(width, padding, border, margin, boxSizing) {
  if (boxSizing === 'border-box') {
    return width + (2 * margin);
  } else {
    return width + (2 * padding) + (2 * border) + (2 * margin);
  }
}`,
      python: `def calculate_total_width(width, padding, border, margin, box_sizing):
    if box_sizing == 'border-box':
        return width + (2 * margin)
    else:
        return width + (2 * padding) + (2 * border) + (2 * margin)`
    },
    testCases: [
      { input: '200, 10, 2, 20, "border-box"', expectedOutput: '240', isHidden: false },
      { input: '200, 10, 2, 20, "content-box"', expectedOutput: '264', isHidden: false },
      { input: '100, 0, 0, 15, "border-box"', expectedOutput: '130', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-010",
    title: "CSS Units Converter (px to rem)",
    slug: "fe-css-units-converter",
    tier: 1,
    section: "HTML & CSS",
    topic: "Units",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Typography",
    category: "frontend",
    tags: ["fe-html", "css", "units", "typography"],
    xpReward: 50,
    description: `## CSS Units Converter (px to rem)

### Description
Responsive typography and spacing recommend \`rem\` units relative to the root font size (browser default is typically 16px). Using rem ensures page scaling honors user accessibility settings.

### Learning Objectives
- Convert pixel values to \`rem\` string with up to 3 decimal places.
- Handle configurable root base sizes (default 16px).

### Example
\`Input: 24, 16\`
\`Output: "1.5rem"\`

### Constraints
- Omit trailing zeros if clean integer/decimal (e.g. \`1.5rem\` not \`1.500rem\`).`,
    starterCode: {
      javascript: `function pxToRem(px, base = 16) {
  const rem = parseFloat((px / base).toFixed(3));
  return \`\${rem}rem\`;
}`,
      python: `def px_to_rem(px, base=16):
    rem = round(px / base, 3)
    if rem == int(rem):
        rem = int(rem)
    return f'{rem}rem'`
    },
    testCases: [
      { input: '24, 16', expectedOutput: '"1.5rem"', isHidden: false },
      { input: '16, 16', expectedOutput: '"1rem"', isHidden: false },
      { input: '32, 16', expectedOutput: '"2rem"', isHidden: false },
      { input: '12, 16', expectedOutput: '"0.75rem"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-011",
    title: "CSS Color Formatter (Hex to RGBA)",
    slug: "fe-css-hex-to-rgba",
    tier: 1,
    section: "HTML & CSS",
    topic: "Colors",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "css", "colors"],
    xpReward: 50,
    description: `## CSS Color Formatter (Hex to RGBA)

### Description
Modern CSS supports opacity in colors via \`rgba(r, g, b, alpha)\`. Converting 6-character hex colors (\`#RRGGBB\`) into RGBA allows seamless background and backdrop transparency.

### Learning Objectives
- Parse hexadecimal RGB values into integer ranges 0-255.
- Format valid \`rgba(r, g, b, a)\` CSS strings.

### Example
\`Input: "#ffffff", 0.5\`
\`Output: "rgba(255, 255, 255, 0.5)"\`

### Constraints
- Hex input is always valid 6-char string with leading \`#\`.`,
    starterCode: {
      javascript: `function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
}`,
      python: `def hex_to_rgba(hex_str, alpha=1):
    clean = hex_str.lstrip('#')
    r = int(clean[0:2], 16)
    g = int(clean[2:4], 16)
    b = int(clean[4:6], 16)
    return f'rgba({r}, {g}, {b}, {alpha})'`
    },
    testCases: [
      { input: '"#ffffff", 0.5', expectedOutput: '"rgba(255, 255, 255, 0.5)"', isHidden: false },
      { input: '"#000000", 1', expectedOutput: '"rgba(0, 0, 0, 1)"', isHidden: false },
      { input: '"#ff0000", 0.8', expectedOutput: '"rgba(255, 0, 0, 0.8)"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-012",
    title: "CSS Z-Index Stacking Context Evaluator",
    slug: "fe-css-zindex-stacking",
    tier: 1,
    section: "HTML & CSS",
    topic: "Z-Index",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "css", "z-index", "positioning"],
    xpReward: 50,
    description: `## CSS Z-Index Stacking Context Evaluator

### Description
\`z-index\` only operates on positioned elements (elements where \`position\` is \`relative\`, \`absolute\`, \`fixed\`, or \`sticky\`). If \`position: static\`, z-index is disregarded.

### Learning Objectives
- Identify whether an element creates an active stacking layer.
- Return the effective layer index or 0 if static.

### Example
\`Input: "relative", 10\`
\`Output: 10\`
\`Input: "static", 999\`
\`Output: 0\``,
    starterCode: {
      javascript: `function getEffectiveZIndex(position, zIndex) {
  if (position === 'static' || !position) return 0;
  return zIndex;
}`,
      python: `def get_effective_z_index(position, z_index):
    if position == 'static' or not position:
        return 0
    return z_index`
    },
    testCases: [
      { input: '"relative", 10', expectedOutput: '10', isHidden: false },
      { input: '"static", 999', expectedOutput: '0', isHidden: false },
      { input: '"fixed", 100', expectedOutput: '100', isHidden: true }
    ]
  },

  // ─── CSS Layout: Flexbox & Grid (13-20) ───
  {
    id: "fe-tier1-013",
    title: "Flexbox Main Axis Alignment Mapper",
    slug: "fe-flexbox-main-axis",
    tier: 1,
    section: "HTML & CSS",
    topic: "Justify Content",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Flexbox",
    category: "frontend",
    tags: ["fe-html", "flexbox", "layout"],
    xpReward: 50,
    description: `## Flexbox Main Axis Alignment Mapper

### Description
In Flexbox, \`justify-content\` governs distribution along the main axis.
- \`center\`: groups items at center.
- \`space-between\`: first item at start, last at end, equal spacing between.
- \`space-around\`: equal space around each item.
- \`flex-start\`: packed at start.
- \`flex-end\`: packed at end.

### Learning Objectives
- Calculate pixel offsets for items along container width given total item widths and justify strategy.

### Example
\`Input: 300, [50, 50], "space-between"\`
\`Output: [0, 250]\` (first at 0, second at 300 - 50 = 250)

### Constraints
- Container width >= sum of item widths.`,
    starterCode: {
      javascript: `function calculateFlexOffsets(containerWidth, itemWidths, justify) {
  const totalItemWidth = itemWidths.reduce((a, b) => a + b, 0);
  const remaining = containerWidth - totalItemWidth;
  const n = itemWidths.length;

  if (justify === 'space-between') {
    if (n === 1) return [0];
    const gap = remaining / (n - 1);
    let cur = 0;
    return itemWidths.map((w, idx) => {
      const pos = cur;
      cur += w + gap;
      return Math.round(pos);
    });
  } else if (justify === 'center') {
    let cur = remaining / 2;
    return itemWidths.map(w => {
      const pos = cur;
      cur += w;
      return Math.round(pos);
    });
  } else {
    // flex-start
    let cur = 0;
    return itemWidths.map(w => {
      const pos = cur;
      cur += w;
      return pos;
    });
  }
}`,
      python: `def calculate_flex_offsets(container_width, item_widths, justify):
    total_item_width = sum(item_widths)
    remaining = container_width - total_item_width
    n = len(item_widths)
    if justify == 'space-between':
        if n == 1:
            return [0]
        gap = remaining / (n - 1)
        cur = 0.0
        res = []
        for w in item_widths:
            res.append(round(cur))
            cur += w + gap
        return res
    elif justify == 'center':
        cur = remaining / 2.0
        res = []
        for w in item_widths:
            res.append(round(cur))
            cur += w
        return res
    else:
        cur = 0
        res = []
        for w in item_widths:
            res.append(cur)
            cur += w
        return res`
    },
    testCases: [
      { input: '300, [50, 50], "space-between"', expectedOutput: '[0,250]', isHidden: false },
      { input: '200, [60, 40], "center"', expectedOutput: '[50,110]', isHidden: false },
      { input: '300, [100, 100], "flex-start"', expectedOutput: '[0,100]', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-014",
    title: "Flexbox Grow Free Space Distributor",
    slug: "fe-flexbox-grow-distribution",
    tier: 1,
    section: "HTML & CSS",
    topic: "Flex Grow",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Flexbox",
    category: "frontend",
    tags: ["fe-html", "flexbox", "layout"],
    xpReward: 50,
    description: `## Flexbox Grow Free Space Distributor

### Description
When a flex container has unused positive free space, \`flex-grow\` determines the proportion of remaining space each child consumes beyond its \`flex-basis\`.

### Learning Objectives
- Calculate item width after \`flex-grow\` expansion: \`width = basis + (remainingSpace * (grow / totalGrow))\`.

### Example
\`Input: 500, [100, 100], [1, 3]\`
\`Output: [175, 325]\` (Remaining space is 300; item1 gets 1/4 -> 75, item2 gets 3/4 -> 225)

### Constraints
- \`totalGrow > 0\`.`,
    starterCode: {
      javascript: `function distributeFlexGrow(containerWidth, bases, grows) {
  const usedBase = bases.reduce((a, b) => a + b, 0);
  const remaining = Math.max(0, containerWidth - usedBase);
  const totalGrow = grows.reduce((a, b) => a + b, 0);

  return bases.map((base, i) => {
    const extra = totalGrow > 0 ? (remaining * grows[i]) / totalGrow : 0;
    return Math.round(base + extra);
  });
}`,
      python: `def distribute_flex_grow(container_width, bases, grows):
    used_base = sum(bases)
    remaining = max(0, container_width - used_base)
    total_grow = sum(grows)
    return [round(bases[i] + ((remaining * grows[i]) / total_grow if total_grow > 0 else 0)) for i in range(len(bases))]`
    },
    testCases: [
      { input: '500, [100, 100], [1, 3]', expectedOutput: '[175,325]', isHidden: false },
      { input: '400, [100, 100], [1, 1]', expectedOutput: '[200,200]', isHidden: false },
      { input: '300, [100, 100, 100], [0, 1, 0]', expectedOutput: '[100,100,100]', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-015",
    title: "CSS Grid Auto-Fit Column Calculator",
    slug: "fe-css-grid-auto-fit",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Grid Fundamentals",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "CSS Grid",
    category: "frontend",
    tags: ["fe-html", "css-grid", "layout"],
    xpReward: 50,
    description: `## CSS Grid Auto-Fit Column Calculator

### Description
The CSS Grid pattern \`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))\` dynamically fits as many columns of at least \`minWidth\` as possible within \`containerWidth\` taking \`gap\` into account.

### Learning Objectives
- Compute the maximum number of columns that can fit in a given width.
- Formula: Find largest integer \`cols\` such that \`cols * minWidth + (cols - 1) * gap <= containerWidth\`.

### Example
\`Input: 800, 200, 20\`
\`Output: 3\` (3 * 200 + 2 * 20 = 640 <= 800; 4 columns would need 860)

### Constraints
- Minimum returned column count is 1.`,
    starterCode: {
      javascript: `function calculateGridColumns(containerWidth, minWidth, gap) {
  let cols = 1;
  while ((cols + 1) * minWidth + cols * gap <= containerWidth) {
    cols++;
  }
  return cols;
}`,
      python: `def calculate_grid_columns(container_width, min_width, gap):
    cols = 1
    while (cols + 1) * min_width + cols * gap <= container_width:
        cols += 1
    return cols`
    },
    testCases: [
      { input: '800, 200, 20', expectedOutput: '3', isHidden: false },
      { input: '1200, 250, 16', expectedOutput: '4', isHidden: false },
      { input: '300, 200, 10', expectedOutput: '1', isHidden: true }
    ]
  },

  // ─── CSS Practice UI Components (21-35) ───
  {
    id: "fe-tier1-016",
    title: "Build a Profile Card",
    slug: "fe-build-profile-card",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "components", "css", "cards"],
    xpReward: 50,
    description: `## Build a Profile Card

### Description
A profile card showcases user identity, avatar, title, and follower metrics. It requires proper semantic encapsulation using \`<article>\`, responsive styling classes, and accessibility alt text.

### Learning Objectives
- Generate structured profile card markup with image, heading, bio, and badge stats.

### Example
\`Input: "Alex", "Software Engineer", 1200\`
\`Output: "<article class=\\"profile-card\\"><h2>Alex</h2><p class=\\"role\\">Software Engineer</p><span class=\\"followers\\">1.2k followers</span></article>"\`

### Constraints
- If followers >= 1000, format with 'k' notation (e.g. 1200 -> "1.2k followers").`,
    starterCode: {
      javascript: `function buildProfileCard(name, role, followers) {
  const followStr = followers >= 1000 ? (followers / 1000).toFixed(1) + 'k' : followers;
  return \`<article class="profile-card"><h2>\${name}</h2><p class="role">\${role}</p><span class="followers">\${followStr} followers</span></article>\`;
}`,
      python: `def build_profile_card(name, role, followers):
    follow_str = f'{followers / 1000:.1f}k' if followers >= 1000 else str(followers)
    return f'<article class="profile-card"><h2>{name}</h2><p class="role">{role}</p><span class="followers">{follow_str} followers</span></article>'`
    },
    testCases: [
      { input: '"Alex", "Software Engineer", 1200', expectedOutput: '"<article class=\\"profile-card\\"><h2>Alex</h2><p class=\\"role\\">Software Engineer</p><span class=\\"followers\\">1.2k followers</span></article>"', isHidden: false },
      { input: '"Sarah", "Product Designer", 850', expectedOutput: '"<article class=\\"profile-card\\"><h2>Sarah</h2><p class=\\"role\\">Product Designer</p><span class=\\"followers\\">850 followers</span></article>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-017",
    title: "Build a Navigation Bar",
    slug: "fe-build-navigation-bar",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "navigation", "components"],
    xpReward: 50,
    description: `## Build a Navigation Bar

### Description
Navigation bars provide consistent sitewide navigation. Semantically, they use \`<nav>\` containing an unordered list \`<ul>\` and \`<a>\` links. The active page receives an \`active\` class and \`aria-current="page"\`.

### Learning Objectives
- Render accessible navigation links.
- Apply \`aria-current="page"\` to the active item.

### Example
\`Input: ["Home", "Arena", "Docs"], "Arena"\`
\`Output: "<nav><ul><li><a href=\\"/home\\">Home</a></li><li><a href=\\"/arena\\" class=\\"active\\" aria-current=\\"page\\">Arena</a></li><li><a href=\\"/docs\\">Docs</a></li></ul></nav>"\``,
    starterCode: {
      javascript: `function buildNavbar(items, activeItem) {
  const lis = items.map(item => {
    const slug = '/' + item.toLowerCase();
    const isActive = item.toLowerCase() === activeItem.toLowerCase();
    const attr = isActive ? ' class="active" aria-current="page"' : '';
    return \`<li><a href="\${slug}"\${attr}>\${item}</a></li>\`;
  }).join('');
  return \`<nav><ul>\${lis}</ul></nav>\`;
}`,
      python: `def build_navbar(items, active_item):
    lis = []
    for item in items:
        slug = '/' + item.lower()
        is_active = item.lower() == active_item.lower()
        attr = ' class="active" aria-current="page"' if is_active else ''
        lis.append(f'<li><a href="{slug}"{attr}>{item}</a></li>')
    return f'<nav><ul>{"".join(lis)}</ul></nav>'`
    },
    testCases: [
      { input: '["Home", "Arena", "Docs"], "Arena"', expectedOutput: '"<nav><ul><li><a href=\\"/home\\">Home</a></li><li><a href=\\"/arena\\" class=\\"active\\" aria-current=\\"page\\">Arena</a></li><li><a href=\\"/docs\\">Docs</a></li></ul></nav>"', isHidden: false },
      { input: '["Dashboard", "Settings"], "Dashboard"', expectedOutput: '"<nav><ul><li><a href=\\"/dashboard\\" class=\\"active\\" aria-current=\\"page\\">Dashboard</a></li><li><a href=\\"/settings\\">Settings</a></li></ul></nav>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-018",
    title: "Build a Pricing Card",
    slug: "fe-build-pricing-card",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "pricing", "components"],
    xpReward: 50,
    description: `## Build a Pricing Card

### Description
Pricing cards present subscription tiers with plan name, monthly price, and feature lists. Highlighted plans feature a "popular" badge and elevated card styling.

### Learning Objectives
- Render tier details, pricing, feature bullets, and call-to-action button.
- Dynamically inject \`featured\` CSS class when plan is popular.

### Example
\`Input: "Pro", 29, ["Unlimited access", "Priority support"], true\`
\`Output: "<div class=\\"pricing-card featured\\"><div class=\\"badge\\">Popular</div><h3>Pro</h3><div class=\\"price\\">$29/mo</div><ul><li>Unlimited access</li><li>Priority support</li></ul><button>Get Started</button></div>"\``,
    starterCode: {
      javascript: `function buildPricingCard(plan, price, features, isPopular) {
  const featClass = isPopular ? ' featured' : '';
  const badge = isPopular ? '<div class="badge">Popular</div>' : '';
  const lis = features.map(f => \`<li>\${f}</li>\`).join('');
  return \`<div class="pricing-card\${featClass}">\${badge}<h3>\${plan}</h3><div class="price">$\${price}/mo</div><ul>\${lis}</ul><button>Get Started</button></div>\`;
}`,
      python: `def build_pricing_card(plan, price, features, is_popular):
    feat_class = ' featured' if is_popular else ''
    badge = '<div class="badge">Popular</div>' if is_popular else ''
    lis = ''.join(f'<li>{f}</li>' for f in features)
    return f'<div class="pricing-card{feat_class}">{badge}<h3>{plan}</h3><div class="price">\${price}/mo</div><ul>{lis}</ul><button>Get Started</button></div>'`
    },
    testCases: [
      { input: '"Pro", 29, ["Unlimited access", "Priority support"], true', expectedOutput: '"<div class=\\"pricing-card featured\\"><div class=\\"badge\\">Popular</div><h3>Pro</h3><div class=\\"price\\">$29/mo</div><ul><li>Unlimited access</li><li>Priority support</li></ul><button>Get Started</button></div>"', isHidden: false },
      { input: '"Starter", 0, ["Community access"], false', expectedOutput: '"<div class=\\"pricing-card\\"><h3>Starter</h3><div class=\\"price\\">$0/mo</div><ul><li>Community access</li></ul><button>Get Started</button></div>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-019",
    title: "Build a Progress Bar",
    slug: "fe-build-progress-bar",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-html", "components", "accessibility"],
    xpReward: 50,
    description: `## Build a Progress Bar

### Description
Progress indicators visually convey task completion percentage while declaring ARIA attributes (\`role="progressbar"\`, \`aria-valuenow\`, \`aria-valuemin="0"\`, \`aria-valuemax="100"\`) for assistive technology.

### Learning Objectives
- Bind dynamic style width (\`width: X%\`) and ARIA percentage values clamped between 0 and 100.

### Example
\`Input: 75\`
\`Output: "<div class=\\"progress-track\\" role=\\"progressbar\\" aria-valuenow=\\"75\\" aria-valuemin=\\"0\\" aria-valuemax=\\"100\\"><div class=\\"progress-fill\\" style=\\"width: 75%;\\"></div></div>"\``,
    starterCode: {
      javascript: `function buildProgressBar(value) {
  const clamped = Math.min(100, Math.max(0, value));
  return \`<div class="progress-track" role="progressbar" aria-valuenow="\${clamped}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width: \${clamped}%;"></div></div>\`;
}`,
      python: `def build_progress_bar(value):
    clamped = min(100, max(0, value))
    return f'<div class="progress-track" role="progressbar" aria-valuenow="{clamped}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width: {clamped}%;"></div></div>'`
    },
    testCases: [
      { input: '75', expectedOutput: '"<div class=\\"progress-track\\" role=\\"progressbar\\" aria-valuenow=\\"75\\" aria-valuemin=\\"0\\" aria-valuemax=\\"100\\"><div class=\\"progress-fill\\" style=\\"width: 75%;\\"></div></div>"', isHidden: false },
      { input: '120', expectedOutput: '"<div class=\\"progress-track\\" role=\\"progressbar\\" aria-valuenow=\\"100\\" aria-valuemin=\\"0\\" aria-valuemax=\\"100\\"><div class=\\"progress-fill\\" style=\\"width: 100%;\\"></div></div>"', isHidden: false },
      { input: '-10', expectedOutput: '"<div class=\\"progress-track\\" role=\\"progressbar\\" aria-valuenow=\\"0\\" aria-valuemin=\\"0\\" aria-valuemax=\\"100\\"><div class=\\"progress-fill\\" style=\\"width: 0%;\\"></div></div>"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-020",
    title: "Build a Modal Dialog Shell",
    slug: "fe-build-modal-shell",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-html", "modal", "components", "accessibility"],
    xpReward: 50,
    description: `## Build a Modal Dialog Shell

### Description
Accessible modals require \`role="dialog"\`, \`aria-modal="true"\`, and an \`aria-labelledby\` association pointing to the dialog header.

### Learning Objectives
- Generate modal markup with backdrop overlay and close button.

### Example
\`Input: "modal-1", "Delete Project", "Are you sure?"\`
\`Output: "<div class=\\"modal-backdrop\\"><div role=\\"dialog\\" id=\\"modal-1\\" aria-modal=\\"true\\" aria-labelledby=\\"modal-1-title\\"><h2 id=\\"modal-1-title\\">Delete Project</h2><p>Are you sure?</p><button class=\\"close-btn\\" aria-label=\\"Close\\">×</button></div></div>"\``,
    starterCode: {
      javascript: `function buildModalShell(id, title, body) {
  return \`<div class="modal-backdrop"><div role="dialog" id="\${id}" aria-modal="true" aria-labelledby="\${id}-title"><h2 id="\${id}-title">\${title}</h2><p>\${body}</p><button class="close-btn" aria-label="Close">×</button></div></div>\`;
}`,
      python: `def build_modal_shell(id, title, body):
    return f'<div class="modal-backdrop"><div role="dialog" id="{id}" aria-modal="true" aria-labelledby="{id}-title"><h2 id="{id}-title">{title}</h2><p>{body}</p><button class="close-btn" aria-label="Close">×</button></div></div>'`
    },
    testCases: [
      { input: '"modal-1", "Delete Project", "Are you sure?"', expectedOutput: '"<div class=\\"modal-backdrop\\"><div role=\\"dialog\\" id=\\"modal-1\\" aria-modal=\\"true\\" aria-labelledby=\\"modal-1-title\\"><h2 id=\\"modal-1-title\\">Delete Project</h2><p>Are you sure?</p><button class=\\"close-btn\\" aria-label=\\"Close\\">×</button></div></div>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-021",
    title: "Build a Tooltip Positioning Calculator",
    slug: "fe-build-tooltip-position",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Positioning",
    category: "frontend",
    tags: ["fe-html", "tooltip", "css", "positioning"],
    xpReward: 50,
    description: `## Build a Tooltip Positioning Calculator

### Description
Tooltips position floating hints adjacent to a target button. Given target bounding box \`{ x, y, width, height }\` and tooltip dimensions \`{ width, height }\`, calculate top/left coordinates for \`"top"\` or \`"bottom"\` placement centered horizontally.

### Learning Objectives
- Calculate absolute coordinates:
  - Top placement: \`top = y - tooltip.height\`, \`left = x + (target.width - tooltip.width) / 2\`
  - Bottom placement: \`top = y + target.height\`, \`left = x + (target.width - tooltip.width) / 2\`

### Example
\`Input: { x: 100, y: 100, width: 80, height: 40 }, { width: 120, height: 30 }, "top"\`
\`Output: { top: 70, left: 80 }\``,
    starterCode: {
      javascript: `function calculateTooltipPos(target, tooltip, placement) {
  const left = Math.round(target.x + (target.width - tooltip.width) / 2);
  const top = placement === 'top' ? target.y - tooltip.height : target.y + target.height;
  return { top, left };
}`,
      python: `def calculate_tooltip_pos(target, tooltip, placement):
    left = round(target['x'] + (target['width'] - tooltip['width']) / 2)
    top = target['y'] - tooltip['height'] if placement == 'top' else target['y'] + target['height']
    return {'top': top, 'left': left}`
    },
    testCases: [
      { input: '{"x": 100, "y": 100, "width": 80, "height": 40}, {"width": 120, "height": 30}, "top"', expectedOutput: '{"top":70,"left":80}', isHidden: false },
      { input: '{"x": 200, "y": 150, "width": 100, "height": 50}, {"width": 100, "height": 25}, "bottom"', expectedOutput: '{"top":200,"left":200}', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-022",
    title: "Build a Loading Spinner Animation Generator",
    slug: "fe-build-loading-spinner",
    tier: 1,
    section: "HTML & CSS",
    topic: "Animations",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Animation",
    category: "frontend",
    tags: ["fe-html", "animation", "css"],
    xpReward: 50,
    description: `## Build a Loading Spinner Animation Generator

### Description
CSS loading spinners utilize circular border frames where one arc has transparent border and rotates via \`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\`.

### Learning Objectives
- Generate inline CSS snippet for a spinner of custom diameter and duration.

### Example
\`Input: 24, 0.8\`
\`Output: "width: 24px; height: 24px; border: 3px solid #ccc; border-top-color: #0070f3; border-radius: 50%; animation: spin 0.8s linear infinite;"\``,
    starterCode: {
      javascript: `function buildSpinnerStyle(sizePx, durationSec) {
  return \`width: \${sizePx}px; height: \${sizePx}px; border: 3px solid #ccc; border-top-color: #0070f3; border-radius: 50%; animation: spin \${durationSec}s linear infinite;\`;
}`,
      python: `def build_spinner_style(size_px, duration_sec):
    return f'width: {size_px}px; height: {size_px}px; border: 3px solid #ccc; border-top-color: #0070f3; border-radius: 50%; animation: spin {duration_sec}s linear infinite;'`
    },
    testCases: [
      { input: '24, 0.8', expectedOutput: '"width: 24px; height: 24px; border: 3px solid #ccc; border-top-color: #0070f3; border-radius: 50%; animation: spin 0.8s linear infinite;"', isHidden: false },
      { input: '40, 1', expectedOutput: '"width: 40px; height: 40px; border: 3px solid #ccc; border-top-color: #0070f3; border-radius: 50%; animation: spin 1s linear infinite;"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-023",
    title: "Build a Product Card Component",
    slug: "fe-build-product-card",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "ecommerce", "components"],
    xpReward: 50,
    description: `## Build a Product Card Component

### Description
E-commerce product cards display item thumbnail, title, price, discount percentage badge, and an Add to Cart button.

### Learning Objectives
- Format product cards with discounted price calculation: \`salePrice = price * (1 - discount/100)\`.

### Example
\`Input: "Mechanical Keyboard", 100, 20\`
\`Output: "<article class=\\"product-card\\"><h3>Mechanical Keyboard</h3><div class=\\"price\\"><span class=\\"original\\">$100</span> <span class=\\"sale\\">$80</span> <span class=\\"badge\\">-20%</span></div><button>Add to Cart</button></article>"\``,
    starterCode: {
      javascript: `function buildProductCard(title, price, discountPercent) {
  const sale = Math.round(price * (1 - discountPercent / 100));
  return \`<article class="product-card"><h3>\${title}</h3><div class="price"><span class="original">$\${price}</span> <span class="sale">$\${sale}</span> <span class="badge">-\${discountPercent}%</span></div><button>Add to Cart</button></article>\`;
}`,
      python: `def build_product_card(title, price, discount_percent):
    sale = round(price * (1 - discount_percent / 100))
    return f'<article class="product-card"><h3>{title}</h3><div class="price"><span class="original">\${price}</span> <span class="sale">\${sale}</span> <span class="badge">-{discount_percent}%</span></div><button>Add to Cart</button></article>'`
    },
    testCases: [
      { input: '"Mechanical Keyboard", 100, 20', expectedOutput: '"<article class=\\"product-card\\"><h3>Mechanical Keyboard</h3><div class=\\"price\\"><span class=\\"original\\">$100</span> <span class=\\"sale\\">$80</span> <span class=\\"badge\\">-20%</span></div><button>Add to Cart</button></article>"', isHidden: false },
      { input: '"Mousepad", 20, 10', expectedOutput: '"<article class=\\"product-card\\"><h3>Mousepad</h3><div class=\\"price\\"><span class=\\"original\\">$20</span> <span class=\\"sale\\">$18</span> <span class=\\"badge\\">-10%</span></div><button>Add to Cart</button></article>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-024",
    title: "Build a Two-Column Layout Sizer",
    slug: "fe-build-two-column-layout",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "layout", "flexbox", "grid"],
    xpReward: 50,
    description: `## Build a Two-Column Layout Sizer

### Description
A classic application layout consists of a fixed-width sidebar and a flexible main content area separated by a gap.

### Learning Objectives
- Calculate main area width: \`mainWidth = containerWidth - sidebarWidth - gap\`.
- Throw error or clamp to 0 if container is too narrow.

### Example
\`Input: 1200, 260, 24\`
\`Output: { sidebar: 260, main: 916 }\``,
    starterCode: {
      javascript: `function calculateTwoColumnWidths(containerWidth, sidebarWidth, gap) {
  const main = Math.max(0, containerWidth - sidebarWidth - gap);
  return { sidebar: sidebarWidth, main };
}`,
      python: `def calculate_two_column_widths(container_width, sidebar_width, gap):
    main = max(0, container_width - sidebar_width - gap)
    return {'sidebar': sidebar_width, 'main': main}`
    },
    testCases: [
      { input: '1200, 260, 24', expectedOutput: '{"sidebar":260,"main":916}', isHidden: false },
      { input: '800, 200, 20', expectedOutput: '{"sidebar":200,"main":580}', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-025",
    title: "Build a Dropdown Menu State Manager",
    slug: "fe-build-dropdown-menu",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Accessibility",
    category: "frontend",
    tags: ["fe-html", "dropdown", "components"],
    xpReward: 50,
    description: `## Build a Dropdown Menu State Manager

### Description
Dropdown menus require accessibility bindings: when closed, the menu has \`hidden\` attribute or \`display: none\` and \`aria-expanded="false"\`. When open, \`aria-expanded="true"\`.

### Learning Objectives
- Generate dropdown button and menu list markup matching expansion state.

### Example
\`Input: ["Profile", "Settings", "Logout"], true\`
\`Output: "<div class=\\"dropdown\\"><button aria-expanded=\\"true\\" aria-haspopup=\\"true\\">Menu</button><ul class=\\"menu-list\\"><li>Profile</li><li>Settings</li><li>Logout</li></ul></div>"\``,
    starterCode: {
      javascript: `function buildDropdown(items, isOpen) {
  const lis = items.map(i => \`<li>\${i}</li>\`).join('');
  const menu = isOpen ? \`<ul class="menu-list">\${lis}</ul>\` : \`<ul class="menu-list" hidden>\${lis}</ul>\`;
  return \`<div class="dropdown"><button aria-expanded="\${isOpen}" aria-haspopup="true">Menu</button>\${menu}</div>\`;
}`,
      python: `def build_dropdown(items, is_open):
    lis = ''.join(f'<li>{i}</li>' for i in items)
    exp_str = 'true' if is_open else 'false'
    menu = f'<ul class="menu-list">{lis}</ul>' if is_open else f'<ul class="menu-list" hidden>{lis}</ul>'
    return f'<div class="dropdown"><button aria-expanded="{exp_str}" aria-haspopup="true">Menu</button>{menu}</div>'`
    },
    testCases: [
      { input: '["Profile", "Settings", "Logout"], true', expectedOutput: '"<div class=\\"dropdown\\"><button aria-expanded=\\"true\\" aria-haspopup=\\"true\\">Menu</button><ul class=\\"menu-list\\"><li>Profile</li><li>Settings</li><li>Logout</li></ul></div>"', isHidden: false },
    ]
  },
  {
    id: "fe-tier1-026",
    title: "Build a Login Form Validator",
    slug: "fe-build-login-form",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Forms",
    category: "frontend",
    tags: ["fe-html", "forms", "validation"],
    xpReward: 50,
    description: `## Build a Login Form Validator

### Description
A standard login form requires email and password inputs with validation attributes like \`required\`, \`type="email"\`, and minimum password length rules.

### Learning Objectives
- Validate email presence and format.
- Ensure password meets minimum length threshold (e.g., 8 characters).

### Example
\`Input: "user@devarena.com", "secret123"\`
\`Output: { isValid: true, errors: [] }\`
\`Input: "invalid", "short"\`
\`Output: { isValid: false, errors: ["Invalid email", "Password must be at least 8 characters"] }\``,
    starterCode: {
      javascript: `function validateLoginForm(email, password) {
  const errors = [];
  if (!email || !email.includes('@')) errors.push('Invalid email');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  return { isValid: errors.length === 0, errors };
}`,
      python: `def validate_login_form(email, password):
    errors = []
    if not email or '@' not in email:
        errors.append('Invalid email')
    if not password or len(password) < 8:
        errors.append('Password must be at least 8 characters')
    return {'isValid': len(errors) == 0, 'errors': errors}`
    },
    testCases: [
      { input: '"user@devarena.com", "secret123"', expectedOutput: '{"isValid":true,"errors":[]}', isHidden: false },
      { input: '"invalid", "short"', expectedOutput: '{"isValid":false,"errors":["Invalid email","Password must be at least 8 characters"]}', isHidden: false },
      { input: '"test@domain.com", "123"', expectedOutput: '{"isValid":false,"errors":["Password must be at least 8 characters"]}', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-027",
    title: "Build a Registration Form Schema Validator",
    slug: "fe-build-registration-form",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Forms",
    category: "frontend",
    tags: ["fe-html", "forms", "validation"],
    xpReward: 50,
    description: `## Build a Registration Form Schema Validator

### Description
User registration demands username, email, password, and password confirmation with matching verification.

### Learning Objectives
- Validate all required fields.
- Verify that \`password\` and \`confirmPassword\` match exactly.

### Example
\`Input: "coder", "coder@dev.com", "pass1234", "pass1234"\`
\`Output: { valid: true, error: null }\``,
    starterCode: {
      javascript: `function validateRegistration(username, email, password, confirmPassword) {
  if (!username || username.length < 3) return { valid: false, error: 'Username must be at least 3 characters' };
  if (!email || !email.includes('@')) return { valid: false, error: 'Invalid email' };
  if (!password || password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (password !== confirmPassword) return { valid: false, error: 'Passwords do not match' };
  return { valid: true, error: null };
}`,
      python: `def validate_registration(username, email, password, confirm_password):
    if not username or len(username) < 3:
        return {'valid': False, 'error': 'Username must be at least 3 characters'}
    if not email or '@' not in email:
        return {'valid': False, 'error': 'Invalid email'}
    if not password or len(password) < 8:
        return {'valid': False, 'error': 'Password must be at least 8 characters'}
    if password != confirm_password:
        return {'valid': False, 'error': 'Passwords do not match'}
    return {'valid': True, 'error': None}`
    },
    testCases: [
      { input: '"coder", "coder@dev.com", "pass1234", "pass1234"', expectedOutput: '{"valid":true,"error":null}', isHidden: false },
      { input: '"ab", "coder@dev.com", "pass1234", "pass1234"', expectedOutput: '{"valid":false,"error":"Username must be at least 3 characters"}', isHidden: false },
      { input: '"coder", "coder@dev.com", "pass1234", "mismatch"', expectedOutput: '{"valid":false,"error":"Passwords do not match"}', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-028",
    title: "Build a Responsive Navbar State Toggle",
    slug: "fe-build-responsive-navbar-state",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "navigation", "responsive"],
    xpReward: 50,
    description: `## Build a Responsive Navbar State Toggle

### Description
Mobile navbars collapse links into a drawer behind a hamburger button. Toggling the button flips the boolean drawer state and returns updated ARIA attributes and classes.

### Learning Objectives
- Toggle open/closed navigation state.
- Update \`aria-expanded\` attribute and class strings accordingly.

### Example
\`Input: false\`
\`Output: { isOpen: true, ariaExpanded: "true", navClass: "nav-drawer open" }\``,
    starterCode: {
      javascript: `function toggleNavbar(currentState) {
  const isOpen = !currentState;
  return {
    isOpen,
    ariaExpanded: isOpen ? 'true' : 'false',
    navClass: isOpen ? 'nav-drawer open' : 'nav-drawer'
  };
}`,
      python: `def toggle_navbar(current_state):
    is_open = not current_state
    return {
        'isOpen': is_open,
        'ariaExpanded': 'true' if is_open else 'false',
        'navClass': 'nav-drawer open' if is_open else 'nav-drawer'
    }`
    },
    testCases: [
      { input: 'false', expectedOutput: '{"isOpen":true,"ariaExpanded":"true","navClass":"nav-drawer open"}', isHidden: false },
      { input: 'true', expectedOutput: '{"isOpen":false,"ariaExpanded":"false","navClass":"nav-drawer"}', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-029",
    title: "Build a CSS Grid Gallery Masonry Helper",
    slug: "fe-build-css-grid-gallery",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "CSS Grid",
    category: "frontend",
    tags: ["fe-html", "grid", "gallery"],
    xpReward: 50,
    description: `## Build a CSS Grid Gallery Masonry Helper

### Description
Image galleries with differing aspect ratios determine row span using \`grid-row-end: span X\` based on image height relative to a base grid row track.

### Learning Objectives
- Calculate row span: \`span = Math.ceil((imgHeight + rowGap) / (rowHeight + rowGap))\`.

### Example
\`Input: 300, 10, 10\`
\`Output: 16\` (image 300px with 10px track & 10px gap consumes 16 row units)

### Constraints
- Minimum row span is 1.`,
    starterCode: {
      javascript: `function calculateGalleryRowSpan(imgHeight, rowHeight, rowGap) {
  return Math.ceil((imgHeight + rowGap) / (rowHeight + rowGap));
}`,
      python: `import math

def calculate_gallery_row_span(img_height, row_height, row_gap):
    return math.ceil((img_height + row_gap) / (row_height + row_gap))`
    },
    testCases: [
      { input: '300, 10, 10', expectedOutput: '16', isHidden: false },
      { input: '150, 10, 10', expectedOutput: '8', isHidden: false },
      { input: '20, 10, 10', expectedOutput: '2', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-030",
    title: "Build a Flexbox Layout Space-Around Sizer",
    slug: "fe-build-flexbox-space-around",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Practice Questions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Flexbox",
    category: "frontend",
    tags: ["fe-html", "flexbox", "layout"],
    xpReward: 50,
    description: `## Build a Flexbox Layout Space-Around Sizer

### Description
With \`justify-content: space-around\`, free space is divided into \`2 * N\` equal units. Each item receives 1 unit of margin on both its left and right sides.

### Learning Objectives
- Calculate individual item center points along container width for space-around distribution.

### Example
\`Input: 600, 3, 100\` (Container 600px, 3 items of 100px each)
\`Output: [100, 300, 500]\` (Free space = 300; unit = 300 / 6 = 50; centers at 100, 300, 500)`,
    starterCode: {
      javascript: `function calculateSpaceAroundCenters(containerWidth, itemCount, itemWidth) {
  const freeSpace = containerWidth - (itemCount * itemWidth);
  const unit = freeSpace / (itemCount * 2);
  const centers = [];
  for (let i = 0; i < itemCount; i++) {
    const start = (2 * i + 1) * unit + (i * itemWidth);
    centers.push(Math.round(start + itemWidth / 2));
  }
  return centers;
}`,
      python: `def calculate_space_around_centers(container_width, item_count, item_width):
    free_space = container_width - (item_count * item_width)
    unit = free_space / (item_count * 2)
    centers = []
    for i in range(item_count):
        start = (2 * i + 1) * unit + (i * item_width)
        centers.append(round(start + item_width / 2))
    return centers`
    },
    testCases: [
      { input: '600, 3, 100', expectedOutput: '[100,300,500]', isHidden: false },
      { input: '400, 2, 100', expectedOutput: '[100,300]', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-031",
    title: "CSS Typography Fluid Clamp Calculator",
    slug: "fe-css-fluid-clamp",
    tier: 1,
    section: "HTML & CSS",
    topic: "Typography",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Typography",
    category: "frontend",
    tags: ["fe-html", "css", "typography"],
    xpReward: 50,
    description: `## CSS Typography Fluid Clamp Calculator

### Description
Fluid typography scales smoothly between screen sizes using CSS \`clamp(min, preferred, max)\`.

### Learning Objectives
- Calculate responsive font sizes bounded by minimum and maximum constraints.

### Example
\`Input: 16, 24, 32\`
\`Output: "clamp(1rem, 2.5vw + 1rem, 2rem)"\``,
    starterCode: {
      javascript: `function formatFluidClamp(minPx, maxPx) {
  const minRem = (minPx / 16).toFixed(1);
  const maxRem = (maxPx / 16).toFixed(1);
  return \`clamp(\${minRem}rem, 2.5vw + 1rem, \${maxRem}rem)\`;
}`,
      python: `def format_fluid_clamp(min_px, max_px):
    min_rem = f'{min_px / 16:.1f}'
    max_rem = f'{max_px / 16:.1f}'
    return f'clamp({min_rem}rem, 2.5vw + 1rem, {max_rem}rem)'`
    },
    testCases: [
      { input: '16, 32', expectedOutput: '"clamp(1.0rem, 2.5vw + 1rem, 2.0rem)"', isHidden: false },
      { input: '24, 48', expectedOutput: '"clamp(1.5rem, 2.5vw + 1rem, 3.0rem)"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-032",
    title: "CSS Box Shadow Generator",
    slug: "fe-css-box-shadow-generator",
    tier: 1,
    section: "HTML & CSS",
    topic: "Shadows",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "css", "shadows"],
    xpReward: 50,
    description: `## CSS Box Shadow Generator

### Description
The \`box-shadow\` property applies depth and elevation: \`offset-x offset-y blur-radius spread-radius color\`.

### Learning Objectives
- Generate elevation levels 1, 2, and 3 (subtle, medium, elevated).

### Example
\`Input: 1\`
\`Output: "0 1px 3px rgba(0, 0, 0, 0.12)"\`
\`Input: 2\`
\`Output: "0 4px 6px rgba(0, 0, 0, 0.15)"\``,
    starterCode: {
      javascript: `function getElevationShadow(level) {
  if (level === 1) return '0 1px 3px rgba(0, 0, 0, 0.12)';
  if (level === 2) return '0 4px 6px rgba(0, 0, 0, 0.15)';
  return '0 10px 20px rgba(0, 0, 0, 0.19)';
}`,
      python: `def get_elevation_shadow(level):
    if level == 1:
        return '0 1px 3px rgba(0, 0, 0, 0.12)'
    elif level == 2:
        return '0 4px 6px rgba(0, 0, 0, 0.15)'
    return '0 10px 20px rgba(0, 0, 0, 0.19)'`
    },
    testCases: [
      { input: '1', expectedOutput: '"0 1px 3px rgba(0, 0, 0, 0.12)"', isHidden: false },
      { input: '2', expectedOutput: '"0 4px 6px rgba(0, 0, 0, 0.15)"', isHidden: false },
      { input: '3', expectedOutput: '"0 10px 20px rgba(0, 0, 0, 0.19)"', isHidden: true }
    ]
  },
  {
    id: "fe-tier1-033",
    title: "CSS Variables Theme Token Formatter",
    slug: "fe-css-variables-theme",
    tier: 1,
    section: "HTML & CSS",
    topic: "CSS Variables",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Layout",
    category: "frontend",
    tags: ["fe-html", "css", "theme", "variables"],
    xpReward: 50,
    description: `## CSS Variables Theme Token Formatter

### Description
CSS Custom Properties (\`--variable-name\`) declared on \`:root\` enable dynamic runtime theme switching without recompilation.

### Learning Objectives
- Format an object of theme color tokens into a valid \`:root { ... }\` block.

### Example
\`Input: { primary: "#0070f3", bg: "#ffffff" }\`
\`Output: ":root { --primary: #0070f3; --bg: #ffffff; }"\``,
    starterCode: {
      javascript: `function formatThemeTokens(tokens) {
  const vars = Object.keys(tokens).map(k => \`--\${k}: \${tokens[k]};\`).join(' ');
  return \`:root { \${vars} }\`;
}`,
      python: `def format_theme_tokens(tokens):
    vars_str = ' '.join(f'--{k}: {tokens[k]};' for k in tokens)
    return f':root {{ {vars_str} }}'`
    },
    testCases: [
      { input: '{"primary": "#0070f3", "bg": "#ffffff"}', expectedOutput: '":root { --primary: #0070f3; --bg: #ffffff; }"', isHidden: false },
      { input: '{"accent": "#ff0080"}', expectedOutput: '":root { --accent: #ff0080; }"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-034",
    title: "HTML Image Picture Srcset Selector",
    slug: "fe-html-image-picture-srcset",
    tier: 1,
    section: "HTML & CSS",
    topic: "Images",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Responsive Design",
    category: "frontend",
    tags: ["fe-html", "images", "responsive", "html"],
    xpReward: 50,
    description: `## HTML Image Picture Srcset Selector

### Description
The \`<picture>\` element allows art direction and resolution switching using multiple \`<source>\` tags with \`media\` and \`srcset\` queries.

### Learning Objectives
- Construct an accessible \`<picture>\` element with mobile source, desktop source, and fallback \`<img>\`.

### Example
\`Input: "/small.jpg", "/large.jpg", "Hero banner"\`
\`Output: "<picture><source media=\\"(max-width: 768px)\\" srcset=\\"/small.jpg\\"><source media=\\"(min-width: 769px)\\" srcset=\\"/large.jpg\\"><img src=\\"/large.jpg\\" alt=\\"Hero banner\\"/></picture>"\``,
    starterCode: {
      javascript: `function buildPictureElement(mobileSrc, desktopSrc, altText) {
  return \`<picture><source media="(max-width: 768px)" srcset="\${mobileSrc}"><source media="(min-width: 769px)" srcset="\${desktopSrc}"><img src="\${desktopSrc}" alt="\${altText}"/></picture>\`;
}`,
      python: `def build_picture_element(mobile_src, desktop_src, alt_text):
    return f'<picture><source media="(max-width: 768px)" srcset="{mobile_src}"><source media="(min-width: 769px)" srcset="{desktop_src}"><img src="{desktop_src}" alt="{alt_text}"/></picture>'`
    },
    testCases: [
      { input: '"/small.jpg", "/large.jpg", "Hero banner"', expectedOutput: '"<picture><source media=\\"(max-width: 768px)\\" srcset=\\"/small.jpg\\"><source media=\\"(min-width: 769px)\\" srcset=\\"/large.jpg\\"><img src=\\"/large.jpg\\" alt=\\"Hero banner\\"/></picture>"', isHidden: false }
    ]
  },
  {
    id: "fe-tier1-035",
    title: "CSS Transitions Curve Interpolator",
    slug: "fe-css-transitions-timing",
    tier: 1,
    section: "HTML & CSS",
    topic: "Transitions",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Animation",
    category: "frontend",
    tags: ["fe-html", "css", "transitions"],
    xpReward: 50,
    description: `## CSS Transitions Curve Interpolator

### Description
CSS transitions take property, duration, timing-function (e.g. \`ease-in-out\`, \`cubic-bezier\`), and optional delay: \`transition: all 0.3s ease-in-out 0.1s\`.

### Learning Objectives
- Generate shorthand transition declarations.

### Example
\`Input: "transform", 300, "ease-out", 50\`
\`Output: "transform 300ms ease-out 50ms"\``,
    starterCode: {
      javascript: `function buildTransitionStyle(property, durationMs, timing, delayMs = 0) {
  return delayMs > 0
    ? \`\${property} \${durationMs}ms \${timing} \${delayMs}ms\`
    : \`\${property} \${durationMs}ms \${timing}\`;
}`,
      python: `def build_transition_style(property_name, duration_ms, timing, delay_ms=0):
    if delay_ms > 0:
        return f'{property_name} {duration_ms}ms {timing} {delay_ms}ms'
    return f'{property_name} {duration_ms}ms {timing}'`
    },
    testCases: [
      { input: '"transform", 300, "ease-out", 50', expectedOutput: '"transform 300ms ease-out 50ms"', isHidden: false },
      { input: '"opacity", 200, "linear", 0', expectedOutput: '"opacity 200ms linear"', isHidden: false }
    ]
  }
];

module.exports = feTier1HtmlCss;
