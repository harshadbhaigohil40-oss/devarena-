/**
 * TIER 2A — EXPRESS.JS (12 Questions)
 */

module.exports = [
  {
    id: "express-001",
    tier: 2,
    section: "Express.js",
    topic: "Express.js",
    title: "Create an Express Server",
    difficulty: "Easy",
    pattern: "Basic Server",
    description: "Create an Express server simulation with a GET / endpoint returning `{ message: 'Welcome to Express API', status: 200 }`.",
    slug: "create-an-express-server",
    category: "backend",
    tags: ["be-express", "expressjs", "Basic Server"],
    xpReward: 50,
    starterCode: {
      javascript: `function expressServer(method, path) {\n  if (method === 'GET' && path === '/') {\n    return { status: 200, message: 'Welcome to Express API' };\n  }\n  return { status: 404, message: 'Not Found' };\n}`,
      python: `def express_server(method, path):\n    if method == 'GET' and path == '/':\n        return { "status": 200, "message": "Welcome to Express API" }\n    return { "status": 404, "message": "Not Found" }`
    },
    testCases: [
      { input: `"GET", "/"`, expectedOutput: `{"status":200,"message":"Welcome to Express API"}`, isHidden: false },
      { input: `"POST", "/"`, expectedOutput: `{"status":404,"message":"Not Found"}`, isHidden: true }
    ],
    hints: ["app.get('/', (req, res) => res.json({ message: 'Welcome to Express API', status: 200 }))"]
  },
  {
    id: "express-002",
    tier: 2,
    section: "Express.js",
    topic: "Routing",
    title: "Create Multiple Routes",
    difficulty: "Easy",
    pattern: "Express Router",
    description: "Create routes for users, products, and orders: return `{ resource: path.slice(1), count: number }`.",
    slug: "create-multiple-routes",
    category: "backend",
    tags: ["be-express", "expressjs", "Routing", "Express Router"],
    xpReward: 50,
    starterCode: {
      javascript: `function handleRoutes(path) {\n  const counts = { '/users': 10, '/products': 50, '/orders': 5 };\n  if (counts[path] !== undefined) {\n    return { resource: path.slice(1), count: counts[path] };\n  }\n  return { error: 'Route not found' };\n}`,
      python: `def handle_routes(path):\n    counts = { '/users': 10, '/products': 50, '/orders': 5 }\n    if path in counts:\n        return { "resource": path[1:], "count": counts[path] }\n    return { "error": "Route not found" }`
    },
    testCases: [
      { input: `"/users"`, expectedOutput: `{"resource":"users","count":10}`, isHidden: false },
      { input: `"/products"`, expectedOutput: `{"resource":"products","count":50}`, isHidden: false },
      { input: `"/unknown"`, expectedOutput: `{"error":"Route not found"}`, isHidden: true }
    ],
    hints: ["express.Router() allows modularizing endpoint routes."]
  },
  {
    id: "express-003",
    tier: 2,
    section: "Express.js",
    topic: "Routing",
    title: "Route Parameters",
    difficulty: "Easy",
    pattern: "Dynamic Parameters",
    description: "Extract named parameter values from a URL path using a route template like `/users/:id`.",
    slug: "route-parameters",
    category: "backend",
    tags: ["be-express", "expressjs", "Routing", "Dynamic Parameters"],
    xpReward: 50,
    starterCode: {
      javascript: `function extractParams(pattern, path) {\n  const patternParts = pattern.split('/');\n  const pathParts = path.split('/');\n  const params = {};\n  patternParts.forEach((part, i) => {\n    if (part.startsWith(':')) {\n      params[part.slice(1)] = pathParts[i];\n    }\n  });\n  return params;\n}`,
      python: `def extract_params(pattern, path):\n    pattern_parts = pattern.split('/')\n    path_parts = path.split('/')\n    params = {}\n    for i, part in enumerate(pattern_parts):\n        if part.startswith(':'):\n            params[part[1:]] = path_parts[i]\n    return params`
    },
    testCases: [
      { input: `"/users/:id", "/users/42"`, expectedOutput: `{"id":"42"}`, isHidden: false },
      { input: `"/posts/:postId/comments/:commentId", "/posts/10/comments/99"`, expectedOutput: `{"postId":"10","commentId":"99"}`, isHidden: false }
    ],
    hints: ["req.params contains route parameters matched by Express."]
  },
  {
    id: "express-004",
    tier: 2,
    section: "Express.js",
    topic: "Request Handling",
    title: "Query Parameters",
    difficulty: "Easy",
    pattern: "Query Parameters",
    description: "Filter an array of product items using query parameters (category and minPrice).",
    slug: "query-parameters",
    category: "backend",
    tags: ["be-express", "expressjs", "Request Handling", "Query Parameters"],
    xpReward: 50,
    starterCode: {
      javascript: `function filterProducts(products, category, minPrice) {\n  return products.filter(p => {\n    const matchCat = !category || p.category === category;\n    const matchPrice = minPrice === undefined || minPrice === null || p.price >= minPrice;\n    return matchCat && matchPrice;\n  });\n}`,
      python: `def filter_products(products, category, min_price):\n    return [p for p in products if (not category or p.get('category') == category) and (min_price is None or p.get('price', 0) >= min_price)]`
    },
    testCases: [
      { input: `[{"name":"Phone","category":"electronics","price":300},{"name":"Shirt","category":"clothing","price":40}], "electronics", 100`, expectedOutput: `[{"name":"Phone","category":"electronics","price":300}]`, isHidden: false },
      { input: `[{"name":"Book","category":"media","price":15}], "media", 20`, expectedOutput: `[]`, isHidden: true }
    ],
    hints: ["req.query contains URL query string parameters."]
  },
  {
    id: "express-005",
    tier: 2,
    section: "Express.js",
    topic: "Middleware",
    title: "Custom Middleware",
    difficulty: "Easy",
    pattern: "Express Middleware",
    description: "Create middleware that logs the HTTP method and requested URL into a formatted string `[METHOD] URL`.",
    slug: "custom-middleware",
    category: "backend",
    tags: ["be-express", "expressjs", "Middleware", "Express Middleware"],
    xpReward: 50,
    starterCode: {
      javascript: `function logRequest(method, url) {\n  // Your code here\n  return \`[\${method.toUpperCase()}] \${url}\`;\n}`,
      python: `def log_request(method, url):\n    # Your code here\n    return f"[{method.upper()}] {url}"`
    },
    testCases: [
      { input: `"get", "/api/users"`, expectedOutput: `"[GET] /api/users"`, isHidden: false },
      { input: `"post", "/login"`, expectedOutput: `"[POST] /login"`, isHidden: true }
    ],
    hints: ["Express middleware takes (req, res, next) and can inspect or modify req."]
  },
  {
    id: "express-006",
    tier: 2,
    section: "Express.js",
    topic: "Middleware",
    title: "Authentication Middleware",
    difficulty: "Medium",
    pattern: "Middleware Chain",
    description: "Create auth middleware that validates an Authorization header. If format is 'Bearer <token>', return `{ authenticated: true, token }`, else `{ authenticated: false, status: 401 }`.",
    slug: "authentication-middleware",
    category: "backend",
    tags: ["be-express", "expressjs", "Middleware", "Middleware Chain"],
    xpReward: 100,
    starterCode: {
      javascript: `function checkAuthHeader(header) {\n  if (!header || !header.startsWith('Bearer ')) {\n    return { authenticated: false, status: 401 };\n  }\n  const token = header.slice(7).trim();\n  return { authenticated: Boolean(token), token };\n}`,
      python: `def check_auth_header(header):\n    if not header or not header.startswith('Bearer '):\n        return { "authenticated": False, "status": 401 }\n    token = header[7:].strip()\n    return { "authenticated": bool(token), "token": token }`
    },
    testCases: [
      { input: `"Bearer secret123"`, expectedOutput: `{"authenticated":true,"token":"secret123"}`, isHidden: false },
      { input: `"Basic user:pass"`, expectedOutput: `{"authenticated":false,"status":401}`, isHidden: false }
    ],
    hints: ["Inspect req.headers.authorization and extract Bearer token."]
  },
  {
    id: "express-007",
    tier: 2,
    section: "Express.js",
    topic: "REST API",
    title: "REST CRUD API",
    difficulty: "Medium",
    pattern: "CRUD",
    description: "Build endpoints for CRUD operations: given a user list, operation ('CREATE','READ','UPDATE','DELETE'), and item payload, return the updated user list.",
    slug: "rest-crud-api",
    category: "backend",
    tags: ["be-express", "expressjs", "REST API", "CRUD"],
    xpReward: 100,
    starterCode: {
      javascript: `function handleCrud(users, op, payload) {\n  if (op === 'CREATE') return [...users, payload];\n  if (op === 'READ') return users.find(u => u.id === payload.id) || null;\n  if (op === 'UPDATE') return users.map(u => u.id === payload.id ? { ...u, ...payload } : u);\n  if (op === 'DELETE') return users.filter(u => u.id !== payload.id);\n  return users;\n}`,
      python: `def handle_crud(users, op, payload):\n    if op == 'CREATE': return users + [payload]\n    if op == 'READ': return next((u for u in users if u['id'] == payload['id']), None)\n    if op == 'UPDATE': return [{**u, **payload} if u['id'] == payload['id'] else u for u in users]\n    if op == 'DELETE': return [u for u in users if u['id'] != payload['id']]\n    return users`
    },
    testCases: [
      { input: `[{"id":1,"name":"Alice"}], "CREATE", {"id":2,"name":"Bob"}`, expectedOutput: `[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]`, isHidden: false },
      { input: `[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}], "DELETE", {"id":1}`, expectedOutput: `[{"id":2,"name":"Bob"}]`, isHidden: false }
    ],
    hints: ["Standard HTTP methods: POST for CREATE, GET for READ, PUT/PATCH for UPDATE, DELETE for DELETE."]
  },
  {
    id: "express-008",
    tier: 2,
    section: "Express.js",
    topic: "Validation",
    title: "Request Body Validation",
    difficulty: "Medium",
    pattern: "Input Validation",
    description: "Validate that a request body contains all required fields. Return `{ valid: true }` if present, else `{ valid: false, missing: [...] }`.",
    slug: "request-body-validation",
    category: "backend",
    tags: ["be-express", "expressjs", "Validation", "Input Validation"],
    xpReward: 100,
    starterCode: {
      javascript: `function validateBody(body, requiredFields) {\n  const missing = requiredFields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');\n  return missing.length === 0 ? { valid: true } : { valid: false, missing };\n}`,
      python: `def validate_body(body, required_fields):\n    missing = [f for f in required_fields if body.get(f) in [None, '']]\n    return { "valid": True } if not missing else { "valid": False, "missing": missing }`
    },
    testCases: [
      { input: `{"name":"Alex","email":"alex@dev.com"}, ["name","email"]`, expectedOutput: `{"valid":true}`, isHidden: false },
      { input: `{"name":"Alex"}, ["name","email","password"]`, expectedOutput: `{"valid":false,"missing":["email","password"]}`, isHidden: false }
    ],
    hints: ["Use validation libraries like Joi, Zod, or express-validator in production."]
  },
  {
    id: "express-009",
    tier: 2,
    section: "Express.js",
    topic: "Error Handling",
    title: "Centralized Error Handler",
    difficulty: "Medium",
    pattern: "Express Error Middleware",
    description: "Create centralized error middleware that accepts an error object and returns a consistent JSON response: `{ status, error }` with fallback status 500.",
    slug: "centralized-error-handler",
    category: "backend",
    tags: ["be-express", "expressjs", "Error Handling", "Express Error Middleware"],
    xpReward: 100,
    starterCode: {
      javascript: `function handleExpressError(err) {\n  const status = err.statusCode || err.status || 500;\n  const message = err.message || 'Internal Server Error';\n  return { status, error: message };\n}`,
      python: `def handle_express_error(err):\n    status = err.get('statusCode') or err.get('status') or 500\n    message = err.get('message') or 'Internal Server Error'\n    return { "status": status, "error": message }`
    },
    testCases: [
      { input: `{"statusCode":404,"message":"User not found"}`, expectedOutput: `{"status":404,"error":"User not found"}`, isHidden: false },
      { input: `{"message":"DB Timeout"}`, expectedOutput: `{"status":500,"error":"DB Timeout"}`, isHidden: false }
    ],
    hints: ["Express recognizes error-handling middleware when it defines 4 arguments: (err, req, res, next)."]
  },
  {
    id: "express-010",
    tier: 2,
    section: "Express.js",
    topic: "REST API",
    title: "Pagination API",
    difficulty: "Medium",
    pattern: "Pagination",
    description: "Implement pagination for a dataset: given page number (1-indexed) and limit, return `{ data: [...], total, totalPages, page }`.",
    slug: "pagination-api",
    category: "backend",
    tags: ["be-express", "expressjs", "REST API", "Pagination"],
    xpReward: 100,
    starterCode: {
      javascript: `function paginate(items, page, limit) {\n  const start = (page - 1) * limit;\n  const data = items.slice(start, start + limit);\n  return {\n    data,\n    total: items.length,\n    totalPages: Math.ceil(items.length / limit),\n    page\n  };\n}`,
      python: `def paginate(items, page, limit):\n    import math\n    start = (page - 1) * limit\n    data = items[start:start + limit]\n    return {\n        "data": data,\n        "total": len(items),\n        "totalPages": math.ceil(len(items) / limit),\n        "page": page\n    }`
    },
    testCases: [
      { input: `[1, 2, 3, 4, 5, 6, 7], 2, 3`, expectedOutput: `{"data":[4,5,6],"total":7,"totalPages":3,"page":2}`, isHidden: false },
      { input: `[1, 2, 3], 1, 10`, expectedOutput: `{"data":[1,2,3],"total":3,"totalPages":1,"page":1}`, isHidden: true }
    ],
    hints: ["Skip = (page - 1) * limit, totalPages = Math.ceil(total / limit)."]
  },
  {
    id: "express-011",
    tier: 2,
    section: "Express.js",
    topic: "API Design",
    title: "API Response Structure",
    difficulty: "Easy",
    pattern: "JSON Response",
    description: "Create a standardized JSON response formatter following JSend: `{ success: boolean, data?: any, error?: string }`.",
    slug: "api-response-structure",
    category: "backend",
    tags: ["be-express", "expressjs", "API Design", "JSON Response"],
    xpReward: 50,
    starterCode: {
      javascript: `function formatResponse(success, dataOrError) {\n  if (success) {\n    return { success: true, data: dataOrError };\n  }\n  return { success: false, error: dataOrError };\n}`,
      python: `def format_response(success, data_or_error):\n    if success:\n        return { "success": True, "data": data_or_error }\n    return { "success": False, "error": data_or_error }`
    },
    testCases: [
      { input: `true, {"userId":10}`, expectedOutput: `{"success":true,"data":{"userId":10}}`, isHidden: false },
      { input: `false, "Invalid email"`, expectedOutput: `{"success":false,"error":"Invalid email"}`, isHidden: false }
    ],
    hints: ["Consistent API envelopes make client response parsing reliable and predictable."]
  },
  {
    id: "express-012",
    tier: 2,
    section: "Express.js",
    topic: "Architecture",
    title: "Controller-Service Pattern",
    difficulty: "Medium",
    pattern: "Separation of Concerns",
    description: "Separate API controllers from business logic. The service calculates total order price with tax (10%). The controller wraps the service result in an API response.",
    slug: "controller-service-pattern",
    category: "backend",
    tags: ["be-express", "expressjs", "Architecture", "Separation of Concerns"],
    xpReward: 100,
    starterCode: {
      javascript: `function orderController(items) {\n  // Service layer calculates\n  const subtotal = items.reduce((sum, item) => sum + item.price, 0);\n  const tax = subtotal * 0.10;\n  const total = subtotal + tax;\n  // Controller formats response\n  return { success: true, order: { subtotal, tax, total } };\n}`,
      python: `def order_controller(items):\n    subtotal = sum(i['price'] for i in items)\n    tax = subtotal * 0.10\n    total = subtotal + tax\n    return { "success": True, "order": { "subtotal": subtotal, "tax": tax, "total": total } }`
    },
    testCases: [
      { input: `[{"price":100},{"price":50}]`, expectedOutput: `{"success":true,"order":{"subtotal":150,"tax":15,"total":165}}`, isHidden: false },
      { input: `[]`, expectedOutput: `{"success":true,"order":{"subtotal":0,"tax":0,"total":0}}`, isHidden: true }
    ],
    hints: ["Controllers handle HTTP req/res, services handle domain business rules."]
  }
];
