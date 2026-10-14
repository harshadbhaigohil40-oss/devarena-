/**
 * TIER 4A — SCALING (15 Questions)
 */

module.exports = [
  {
    id: "scale-001",
    tier: 4,
    section: "Scaling",
    topic: "Caching",
    title: "Implement an In-Memory Cache",
    difficulty: "Medium",
    pattern: "Cache",
    description: "Create a simple key-value cache with TTL expiration. Return cached value if currentTime < expiresAt, else null.",
    slug: "implement-an-in-memory-cache",
    category: "backend",
    tags: ["be-scale", "scaling", "Caching", "Cache"],
    xpReward: 100,
    starterCode: {
      javascript: `function checkCache(cacheStore, key, currentTime) {\n  const entry = cacheStore[key];\n  if (!entry || currentTime >= entry.expiresAt) return null;\n  return entry.value;\n}`,
      python: `def check_cache(cache_store, key, current_time):\n    entry = cache_store.get(key)\n    if not entry or current_time >= entry.get('expiresAt', 0):\n        return None\n    return entry.get('value')`
    },
    testCases: [
      { input: `{"item1":{"value":"data","expiresAt":1000}}, "item1", 500`, expectedOutput: `"data"`, isHidden: false },
      { input: `{"item1":{"value":"data","expiresAt":1000}}, "item1", 1500`, expectedOutput: `null`, isHidden: false }
    ],
    hints: ["TTL (Time To Live) guarantees stale data is eventually discarded."]
  },
  {
    id: "scale-002",
    tier: 4,
    section: "Scaling",
    topic: "Redis",
    title: "Redis Cache",
    difficulty: "Medium",
    pattern: "Cache-Aside",
    description: "Implement the Cache-Aside pattern: if key exists in cache, return `{ source: 'cache', data }`; otherwise retrieve from db and return `{ source: 'database', data }`.",
    slug: "redis-cache",
    category: "backend",
    tags: ["be-scale", "scaling", "Redis", "Cache-Aside"],
    xpReward: 100,
    starterCode: {
      javascript: `function cacheAside(cache, db, key) {\n  if (cache[key]) return { source: 'cache', data: cache[key] };\n  if (db[key]) return { source: 'database', data: db[key] };\n  return { source: 'not_found', data: null };\n}`,
      python: `def cache_aside(cache, db, key):\n    if key in cache:\n        return { "source": "cache", "data": cache[key] }\n    if key in db:\n        return { "source": "database", "data": db[key] }\n    return { "source": "not_found", "data": None }`
    },
    testCases: [
      { input: `{"user:1":{"name":"Alice"}}, {"user:1":{"name":"Alice"}}, "user:1"`, expectedOutput: `{"source":"cache","data":{"name":"Alice"}}`, isHidden: false },
      { input: `{}, {"user:2":{"name":"Bob"}}, "user:2"`, expectedOutput: `{"source":"database","data":{"name":"Bob"}}`, isHidden: false }
    ],
    hints: ["Cache-aside checks cache first; on miss, loads from DB and updates cache."]
  },
  {
    id: "scale-003",
    tier: 4,
    section: "Scaling",
    topic: "Caching",
    title: "Cache Invalidation",
    difficulty: "Medium",
    pattern: "Cache Invalidation",
    description: "Invalidate cached data when underlying database record changes: delete key from cache and return `{ invalidated: true, key }`.",
    slug: "cache-invalidation",
    category: "backend",
    tags: ["be-scale", "scaling", "Caching", "Cache Invalidation"],
    xpReward: 100,
    starterCode: {
      javascript: `function invalidateKey(cache, key) {\n  const hadKey = key in cache;\n  delete cache[key];\n  return { invalidated: hadKey, key };\n}`,
      python: `def invalidate_key(cache, key):\n    had_key = key in cache\n    cache.pop(key, None)\n    return { "invalidated": had_key, "key": key }`
    },
    testCases: [
      { input: `{"user:1":{"name":"Old"}}, "user:1"`, expectedOutput: `{"invalidated":true,"key":"user:1"}`, isHidden: false },
      { input: `{}, "user:99"`, expectedOutput: `{"invalidated":false,"key":"user:99"}`, isHidden: true }
    ],
    hints: ["Write-through or cache eviction ensures users don't view stale data."]
  },
  {
    id: "scale-004",
    tier: 4,
    section: "Scaling",
    topic: "Scaling",
    title: "Rate Limiter",
    difficulty: "Medium",
    pattern: "Sliding Window",
    description: "Design a sliding window rate limiter: given timestamps of requests and current time, count requests in the window `[currentTime - window, currentTime]`.",
    slug: "rate-limiter-sliding-window",
    category: "backend",
    tags: ["be-scale", "scaling", "Sliding Window"],
    xpReward: 100,
    starterCode: {
      javascript: `function slidingRateLimit(timestamps, currentTime, window, maxReq) {\n  const valid = timestamps.filter(t => t > currentTime - window);\n  const allowed = valid.length < maxReq;\n  return { allowed, currentRequests: valid.length + (allowed ? 1 : 0) };\n}`,
      python: `def sliding_rate_limit(timestamps, current_time, window, max_req):\n    valid = [t for t in timestamps if t > current_time - window]\n    allowed = len(valid) < max_req\n    return { "allowed": allowed, "currentRequests": len(valid) + (1 if allowed else 0) }`
    },
    testCases: [
      { input: `[10, 20, 30], 40, 60, 5`, expectedOutput: `{"allowed":true,"currentRequests":4}`, isHidden: false },
      { input: `[10, 20, 30, 35, 38], 40, 60, 5`, expectedOutput: `{"allowed":false,"currentRequests":5}`, isHidden: false }
    ],
    hints: ["Sliding window prevents burst traffic at boundary edges compared to fixed window."]
  },
  {
    id: "scale-005",
    tier: 4,
    section: "Scaling",
    topic: "Background Jobs",
    title: "Job Queue",
    difficulty: "Medium",
    pattern: "Producer / Consumer",
    description: "Create a FIFO background job queue simulation: handle 'ENQUEUE' and 'DEQUEUE' operations.",
    slug: "job-queue",
    category: "backend",
    tags: ["be-scale", "scaling", "Background Jobs", "Producer / Consumer"],
    xpReward: 100,
    starterCode: {
      javascript: `function jobQueue(queue, action, job) {\n  if (action === 'ENQUEUE') {\n    return [...queue, job];\n  }\n  if (action === 'DEQUEUE') {\n    const next = queue[0] || null;\n    return { processed: next, remaining: queue.slice(1) };\n  }\n  return queue;\n}`,
      python: `def job_queue(queue, action, job):\n    if action == 'ENQUEUE':\n        return queue + [job]\n    if action == 'DEQUEUE':\n        next_item = queue[0] if queue else None\n        return { "processed": next_item, "remaining": queue[1:] }\n    return queue`
    },
    testCases: [
      { input: `["job1","job2"], "ENQUEUE", "job3"`, expectedOutput: `["job1","job2","job3"]`, isHidden: false },
      { input: `["job1","job2"], "DEQUEUE", null`, expectedOutput: `{"processed":"job1","remaining":["job2"]}`, isHidden: false }
    ],
    hints: ["Job queues (e.g. BullMQ, Celery, SQS) decouple heavy computation from HTTP request cycles."]
  },
  {
    id: "scale-006",
    tier: 4,
    section: "Scaling",
    topic: "Background Jobs",
    title: "Retry Failed Jobs",
    difficulty: "Medium",
    pattern: "Retry Strategy",
    description: "Calculate next retry delay using exponential backoff: `baseDelay * (2 ** currentAttempt)`. If currentAttempt >= maxAttempts, return shouldRetry: false.",
    slug: "retry-failed-jobs",
    category: "backend",
    tags: ["be-scale", "scaling", "Background Jobs", "Retry Strategy"],
    xpReward: 100,
    starterCode: {
      javascript: `function calculateBackoff(currentAttempt, maxAttempts, baseDelay) {\n  if (currentAttempt >= maxAttempts) return { shouldRetry: false, delay: 0 };\n  return {\n    shouldRetry: true,\n    delay: baseDelay * Math.pow(2, currentAttempt)\n  };\n}`,
      python: `def calculate_backoff(current_attempt, max_attempts, base_delay):\n    if current_attempt >= max_attempts:\n        return { "shouldRetry": False, "delay": 0 }\n    return {\n        "shouldRetry": True,\n        "delay": base_delay * (2 ** current_attempt)\n    }`
    },
    testCases: [
      { input: `1, 3, 1000`, expectedOutput: `{"shouldRetry":true,"delay":2000}`, isHidden: false },
      { input: `3, 3, 1000`, expectedOutput: `{"shouldRetry":false,"delay":0}`, isHidden: false }
    ],
    hints: ["Exponential backoff with jitter prevents thundering herd problem on recovered systems."]
  },
  {
    id: "scale-007",
    tier: 4,
    section: "Scaling",
    topic: "Database",
    title: "Database Connection Pool",
    difficulty: "Medium",
    pattern: "Connection Pooling",
    description: "Manage a connection pool: if activeConnections < maxPoolSize, acquire connection, else queue request.",
    slug: "database-connection-pool",
    category: "backend",
    tags: ["be-scale", "scaling", "Database", "Connection Pooling"],
    xpReward: 100,
    starterCode: {
      javascript: `function acquireConnection(active, maxPool) {\n  if (active < maxPool) {\n    return { acquired: true, active: active + 1 };\n  }\n  return { acquired: false, queued: true };\n}`,
      python: `def acquire_connection(active, max_pool):\n    if active < max_pool:\n        return { "acquired": True, "active": active + 1 }\n    return { "acquired": False, "queued": True }`
    },
    testCases: [
      { input: `4, 5`, expectedOutput: `{"acquired":true,"active":5}`, isHidden: false },
      { input: `5, 5`, expectedOutput: `{"acquired":false,"queued":true}`, isHidden: false }
    ],
    hints: ["Connection pools reuse open sockets to avoid the latency of opening new TCP handshakes."]
  },
  {
    id: "scale-008",
    tier: 4,
    section: "Scaling",
    topic: "Database",
    title: "Pagination at Scale",
    difficulty: "Medium",
    pattern: "Cursor Pagination",
    description: "Implement cursor-based pagination: return items where `id > cursor` up to limit, along with nextCursor.",
    slug: "pagination-at-scale",
    category: "backend",
    tags: ["be-scale", "scaling", "Database", "Cursor Pagination"],
    xpReward: 100,
    starterCode: {
      javascript: `function cursorPaginate(items, cursor, limit) {\n  const filtered = items.filter(i => i.id > (cursor || 0));\n  const pageItems = filtered.slice(0, limit);\n  const nextCursor = pageItems.length > 0 ? pageItems[pageItems.length - 1].id : null;\n  return { items: pageItems, nextCursor };\n}`,
      python: `def cursor_paginate(items, cursor, limit):\n    filtered = [i for i in items if i.get('id', 0) > (cursor or 0)]\n    page_items = filtered[:limit]\n    next_cursor = page_items[-1]['id'] if page_items else None\n    return { "items": page_items, "nextCursor": next_cursor }`
    },
    testCases: [
      { input: `[{"id":10},{"id":11},{"id":12},{"id":13}], 10, 2`, expectedOutput: `{"items":[{"id":11},{"id":12}],"nextCursor":12}`, isHidden: false },
      { input: `[{"id":10}], 15, 2`, expectedOutput: `{"items":[],"nextCursor":null}`, isHidden: true }
    ],
    hints: ["Cursor pagination prevents OFFSET degradation on millions of rows."]
  },
  {
    id: "scale-009",
    tier: 4,
    section: "Scaling",
    topic: "Database Optimization",
    title: "Database Index Optimization",
    difficulty: "Hard",
    pattern: "Indexing",
    description: "Construct composite index query: given filter fields `['status', 'userId']` and sort field `'createdAt'`, generate `CREATE INDEX idx_orders ON orders (status, userId, createdAt)`.",
    slug: "database-index-optimization",
    category: "backend",
    tags: ["be-scale", "scaling", "Database Optimization", "Indexing"],
    xpReward: 200,
    starterCode: {
      javascript: `function createCompositeIndexSQL(tableName, filters, sort) {\n  const cols = [...filters, sort].join(', ');\n  return \`CREATE INDEX idx_\${tableName} ON \${tableName} (\${cols});\`;\n}`,
      python: `def create_composite_index_sql(table_name, filters, sort):\n    cols = ", ".join(filters + [sort])\n    return f"CREATE INDEX idx_{table_name} ON {table_name} ({cols});"`
    },
    testCases: [
      { input: `"orders", ["status","userId"], "createdAt"`, expectedOutput: `"CREATE INDEX idx_orders ON orders (status, userId, createdAt);"`, isHidden: false }
    ],
    hints: ["Equality columns come first, followed by range and sort columns (Equality, Sort, Range rule)."]
  },
  {
    id: "scale-010",
    tier: 4,
    section: "Scaling",
    topic: "Scaling",
    title: "Load Balancer Concept",
    difficulty: "Medium",
    pattern: "Load Balancing",
    description: "Implement round-robin request distribution: given server list and request index, return selected server.",
    slug: "load-balancer-concept",
    category: "backend",
    tags: ["be-scale", "scaling", "Load Balancing"],
    xpReward: 100,
    starterCode: {
      javascript: `function roundRobin(servers, requestIndex) {\n  if (!servers.length) return null;\n  return servers[requestIndex % servers.length];\n}`,
      python: `def round_robin(servers, request_index):\n    if not servers:\n        return None\n    return servers[request_index % len(servers)]`
    },
    testCases: [
      { input: `["srvA","srvB","srvC"], 4`, expectedOutput: `"srvB"`, isHidden: false },
      { input: `["srvA","srvB"], 1`, expectedOutput: `"srvB"`, isHidden: false }
    ],
    hints: ["Modulo arithmetic (index % serverCount) provides uniform load distribution."]
  },
  {
    id: "scale-011",
    tier: 4,
    section: "Scaling",
    topic: "Scaling",
    title: "Horizontal Scaling",
    difficulty: "Medium",
    pattern: "Stateless Architecture",
    description: "Simulate stateless architecture: check if session token can be resolved from shared store across different server instances.",
    slug: "horizontal-scaling",
    category: "backend",
    tags: ["be-scale", "scaling", "Stateless Architecture"],
    xpReward: 100,
    starterCode: {
      javascript: `function getSharedSession(sharedStore, token) {\n  return sharedStore[token] || null;\n}`,
      python: `def get_shared_session(shared_store, token):\n    return shared_store.get(token)`
    },
    testCases: [
      { input: `{"tok100":{"userId":42}}, "tok100"`, expectedOutput: `{"userId":42}`, isHidden: false },
      { input: `{}, "tok100"`, expectedOutput: `null`, isHidden: true }
    ],
    hints: ["Stateless servers store session state externally (e.g. Redis) so any instance can handle any request."]
  },
  {
    id: "scale-012",
    tier: 4,
    section: "Scaling",
    topic: "Deployment",
    title: "Dockerize a Backend",
    difficulty: "Medium",
    pattern: "Containerization",
    description: "Generate a minimal Dockerfile for a Node.js service exposing a given port.",
    slug: "dockerize-a-backend",
    category: "backend",
    tags: ["be-scale", "scaling", "Deployment", "Containerization"],
    xpReward: 100,
    starterCode: {
      javascript: `function createDockerfile(port) {\n  return \`FROM node:18-alpine\\nWORKDIR /app\\nCOPY package*.json ./\\nRUN npm install\\nCOPY . .\\nEXPOSE \${port}\\nCMD ["npm", "start"]\`;\n}`,
      python: `def create_dockerfile(port):\n    return f"FROM node:18-alpine\\nWORKDIR /app\\nCOPY package*.json ./\\nRUN npm install\\nCOPY . .\\nEXPOSE {port}\\nCMD [\\"npm\\", \\"start\\"]"`
    },
    testCases: [
      { input: `5000`, expectedOutput: `"FROM node:18-alpine\\nWORKDIR /app\\nCOPY package*.json ./\\nRUN npm install\\nCOPY . .\\nEXPOSE 5000\\nCMD [\\"npm\\", \\"start\\"]"`, isHidden: false }
    ],
    hints: ["Docker containers package runtime, dependencies, and code for reproducible deployments."]
  },
  {
    id: "scale-013",
    tier: 4,
    section: "Scaling",
    topic: "Monitoring",
    title: "Health Check Endpoint",
    difficulty: "Easy",
    pattern: "Health Check",
    description: "Create a /health check response verifying db and cache: return status 'healthy' if both up, else 'unhealthy'.",
    slug: "health-check-endpoint",
    category: "backend",
    tags: ["be-scale", "scaling", "Monitoring", "Health Check"],
    xpReward: 50,
    starterCode: {
      javascript: `function healthCheck(dbOk, cacheOk) {\n  const status = dbOk && cacheOk ? 'healthy' : 'unhealthy';\n  return { status, services: { db: dbOk ? 'up' : 'down', cache: cacheOk ? 'up' : 'down' } };\n}`,
      python: `def health_check(db_ok, cache_ok):\n    status = "healthy" if db_ok and cache_ok else "unhealthy"\n    return { "status": status, "services": { "db": "up" if db_ok else "down", "cache": "up" if cache_ok else "down" } }`
    },
    testCases: [
      { input: `true, true`, expectedOutput: `{"status":"healthy","services":{"db":"up","cache":"up"}}`, isHidden: false },
      { input: `false, true`, expectedOutput: `{"status":"unhealthy","services":{"db":"down","cache":"up"}}`, isHidden: false }
    ],
    hints: ["Load balancers use health checks to route traffic away from failing nodes."]
  },
  {
    id: "scale-014",
    tier: 4,
    section: "Scaling",
    topic: "Node.js",
    title: "Graceful Shutdown",
    difficulty: "Medium",
    pattern: "Process Signals",
    description: "Simulate SIGTERM handling: complete in-flight requests count and return `{ signal: 'SIGTERM', drainedCount: count, status: 'closed' }`.",
    slug: "graceful-shutdown",
    category: "backend",
    tags: ["be-scale", "scaling", "Node.js", "Process Signals"],
    xpReward: 100,
    starterCode: {
      javascript: `function handleSignal(signal, inFlight) {\n  return {\n    signal,\n    drainedCount: inFlight,\n    status: 'closed'\n  };\n}`,
      python: `def handle_signal(signal, in_flight):\n    return {\n        "signal": signal,\n        "drainedCount": in_flight,\n        "status": "closed"\n    }`
    },
    testCases: [
      { input: `"SIGTERM", 4`, expectedOutput: `{"signal":"SIGTERM","drainedCount":4,"status":"closed"}`, isHidden: false }
    ],
    hints: ["Process.on('SIGTERM') allows closing servers cleanly without cutting off client requests."]
  },
  {
    id: "scale-015",
    tier: 4,
    section: "Scaling",
    topic: "Monitoring",
    title: "Logging System",
    difficulty: "Medium",
    pattern: "Structured Logging",
    description: "Create a structured log entry formatter: `{ level, message, requestId, timestamp }`.",
    slug: "logging-system",
    category: "backend",
    tags: ["be-scale", "scaling", "Monitoring", "Structured Logging"],
    xpReward: 100,
    starterCode: {
      javascript: `function formatLog(level, message, requestId, timestamp) {\n  return {\n    level,\n    message,\n    requestId,\n    timestamp\n  };\n}`,
      python: `def format_log(level, message, request_id, timestamp):\n    return {\n        "level": level,\n        "message": message,\n        "requestId": request_id,\n        "timestamp": timestamp\n    }`
    },
    testCases: [
      { input: `"INFO", "Payment processed", "req-123", 1000`, expectedOutput: `{"level":"INFO","message":"Payment processed","requestId":"req-123","timestamp":1000}`, isHidden: false }
    ],
    hints: ["Structured JSON logs enable log ingestion into tools like Datadog, ELK, or CloudWatch."]
  }
];
