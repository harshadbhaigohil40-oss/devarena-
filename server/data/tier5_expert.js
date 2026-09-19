/**
 * TIER 5 — BACKEND EXPERT (18 Questions)
 */

module.exports = [
  {
    id: "expert-001",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a URL Shortener",
    difficulty: "Medium",
    pattern: "Distributed System",
    description: "Design a Base62 encoder: convert a positive integer ID into a short alphanumeric code using `0-9a-zA-Z`.",
    slug: "design-a-url-shortener",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Distributed System"],
    xpReward: 200,
    starterCode: {
      javascript: `function base62Encode(id) {\n  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';\n  if (id === 0) return '0';\n  let str = '';\n  while (id > 0) {\n    str = chars[id % 62] + str;\n    id = Math.floor(id / 62);\n  }\n  return str;\n}`,
      python: `def base62_encode(id_num):\n    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'\n    if id_num == 0: return '0'\n    res = ''\n    while id_num > 0:\n        res = chars[id_num % 62] + res\n        id_num //= 62\n    return res`
    },
    testCases: [
      { input: `125`, expectedOutput: `"cb"`, isHidden: false },
      { input: `0`, expectedOutput: `"0"`, isHidden: false },
      { input: `1000`, expectedOutput: `"g8"`, isHidden: true }
    ],
    hints: ["Base62 encoding provides compact, URL-safe identifiers."]
  },
  {
    id: "expert-002",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Rate Limiter",
    difficulty: "Hard",
    pattern: "Distributed Rate Limiting",
    description: "Design a distributed Token Bucket rate limiter: calculate refill based on elapsed time and determine if request passes.",
    slug: "design-a-rate-limiter",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Distributed Rate Limiting"],
    xpReward: 300,
    starterCode: {
      javascript: `function tokenBucket(capacity, refillRate, tokens, lastRefill, now) {\n  const elapsed = now - lastRefill;\n  const refilled = Math.min(capacity, tokens + elapsed * refillRate);\n  if (refilled >= 1) {\n    return { allowed: true, remaining: refilled - 1 };\n  }\n  return { allowed: false, remaining: refilled };\n}`,
      python: `def token_bucket(capacity, refill_rate, tokens, last_refill, now):\n    elapsed = now - last_refill\n    refilled = min(capacity, tokens + elapsed * refill_rate)\n    if refilled >= 1:\n        return { "allowed": True, "remaining": refilled - 1 }\n    return { "allowed": False, "remaining": refilled }`
    },
    testCases: [
      { input: `10, 1, 0, 0, 5`, expectedOutput: `{"allowed":true,"remaining":4}`, isHidden: false },
      { input: `10, 1, 0, 0, 0`, expectedOutput: `{"allowed":false,"remaining":0}`, isHidden: false }
    ],
    hints: ["Token bucket allows burst traffic up to capacity while enforcing steady-state rate limits."]
  },
  {
    id: "expert-003",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Notification System",
    difficulty: "Hard",
    pattern: "Event-Driven Architecture",
    description: "Design a notification service: route event notifications only to channels requested by user (sms, email, push) with deduplication.",
    slug: "design-a-notification-system",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Event-Driven Architecture"],
    xpReward: 300,
    starterCode: {
      javascript: `function dispatchNotifications(channels, seenIds, id) {\n  if (seenIds.includes(id)) return { duplicate: true, dispatched: [] };\n  return { duplicate: false, dispatched: channels };\n}`,
      python: `def dispatch_notifications(channels, seen_ids, id_num):\n    if id_num in seen_ids:\n        return { "duplicate": True, "dispatched": [] }\n    return { "duplicate": False, "dispatched": channels }`
    },
    testCases: [
      { input: `["email","push"], [], "notif-1"`, expectedOutput: `{"duplicate":false,"dispatched":["email","push"]}`, isHidden: false },
      { input: `["email"], ["notif-1"], "notif-1"`, expectedOutput: `{"duplicate":true,"dispatched":[]}`, isHidden: false }
    ],
    hints: ["Idempotency keys and deduplication prevent spamming users when workers retry."]
  },
  {
    id: "expert-004",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Chat Application",
    difficulty: "Hard",
    pattern: "WebSockets + Pub/Sub",
    description: "Guarantee message order in distributed chat: sort incoming message packets by sequence number.",
    slug: "design-a-chat-application",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "WebSockets + Pub/Sub"],
    xpReward: 300,
    starterCode: {
      javascript: `function sortMessages(messages) {\n  return [...messages].sort((a, b) => a.seq - b.seq);\n}`,
      python: `def sort_messages(messages):\n    return sorted(messages, key=lambda m: m['seq'])`
    },
    testCases: [
      { input: `[{"seq":3,"text":"c"},{"seq":1,"text":"a"},{"seq":2,"text":"b"}]`, expectedOutput: `[{"seq":1,"text":"a"},{"seq":2,"text":"b"},{"seq":3,"text":"c"}]`, isHidden: false }
    ],
    hints: ["Monotonic sequence numbers or Lamport timestamps guarantee message causal order."]
  },
  {
    id: "expert-005",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a News Feed",
    difficulty: "Hard",
    pattern: "Fan-out",
    description: "Determine feed delivery strategy: if author follower count > celebrityThreshold, use 'pull' (fan-out on read); else 'push' (fan-out on write).",
    slug: "design-a-news-feed",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Fan-out"],
    xpReward: 300,
    starterCode: {
      javascript: `function getFeedStrategy(followers, threshold) {\n  return followers > threshold ? 'pull' : 'push';\n}`,
      python: `def get_feed_strategy(followers, threshold):\n    return 'pull' if followers > threshold else 'push'`
    },
    testCases: [
      { input: `500, 25000`, expectedOutput: `"push"`, isHidden: false },
      { input: `50000, 25000`, expectedOutput: `"pull"`, isHidden: false }
    ],
    hints: ["Hybrid push/pull balances write amplification for high-follower accounts with fast read latency."]
  },
  {
    id: "expert-006",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design an API Gateway",
    difficulty: "Hard",
    pattern: "Gateway",
    description: "Design an API gateway pipeline: enforce auth and rate limit before routing to service destination.",
    slug: "design-an-api-gateway",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Gateway"],
    xpReward: 300,
    starterCode: {
      javascript: `function gatewayPipeline(authOk, rateOk, targetService) {\n  if (!authOk) return { status: 401, error: 'Unauthorized' };\n  if (!rateOk) return { status: 429, error: 'Too Many Requests' };\n  return { status: 200, forwardTo: targetService };\n}`,
      python: `def gateway_pipeline(auth_ok, rate_ok, target_service):\n    if not auth_ok:\n        return { "status": 401, "error": "Unauthorized" }\n    if not rate_ok:\n        return { "status": 429, "error": "Too Many Requests" }\n    return { "status": 200, "forwardTo": target_service }`
    },
    testCases: [
      { input: `true, true, "user-service"`, expectedOutput: `{"status":200,"forwardTo":"user-service"}`, isHidden: false },
      { input: `false, true, "user-service"`, expectedOutput: `{"status":401,"error":"Unauthorized"}`, isHidden: false },
      { input: `true, false, "user-service"`, expectedOutput: `{"status":429,"error":"Too Many Requests"}`, isHidden: false }
    ],
    hints: ["API Gateways consolidate cross-cutting concerns (auth, SSL, throttling, routing)."]
  },
  {
    id: "expert-007",
    tier: 5,
    section: "Backend Expert",
    topic: "Distributed Systems",
    title: "Design a Job Queue System",
    difficulty: "Hard",
    pattern: "Producer / Consumer",
    description: "Implement dead letter queue (DLQ) logic: if failureCount >= maxFailures, route to DLQ; otherwise schedule retry.",
    slug: "design-a-job-queue-system",
    category: "backend",
    tags: ["be-master", "backend-expert", "Distributed Systems", "Producer / Consumer"],
    xpReward: 300,
    starterCode: {
      javascript: `function handleJobFailure(jobId, failures, maxFailures) {\n  if (failures >= maxFailures) {\n    return { action: 'DLQ', jobId };\n  }\n  return { action: 'RETRY', jobId, attempt: failures + 1 };\n}`,
      python: `def handle_job_failure(job_id, failures, max_failures):\n    if failures >= max_failures:\n        return { "action": "DLQ", "jobId": job_id }\n    return { "action": "RETRY", "jobId": job_id, "attempt": failures + 1 }`
    },
    testCases: [
      { input: `"job-1", 3, 3`, expectedOutput: `{"action":"DLQ","jobId":"job-1"}`, isHidden: false },
      { input: `"job-1", 1, 3`, expectedOutput: `{"action":"RETRY","jobId":"job-1","attempt":2}`, isHidden: false }
    ],
    hints: ["DLQs isolate permanently failing poison-pill messages so they don't block the queue."]
  },
  {
    id: "expert-008",
    tier: 5,
    section: "Backend Expert",
    topic: "Distributed Systems",
    title: "Design a Distributed Cache",
    difficulty: "Hard",
    pattern: "Consistent Hashing",
    description: "Find the node on a consistent hash ring for a key: return the first node whose token >= keyHash, or wrap around to the first node.",
    slug: "design-a-distributed-cache",
    category: "backend",
    tags: ["be-master", "backend-expert", "Distributed Systems", "Consistent Hashing"],
    xpReward: 300,
    starterCode: {
      javascript: `function findNode(nodes, keyHash) {\n  const sorted = [...nodes].sort((a, b) => a.token - b.token);\n  for (const n of sorted) {\n    if (n.token >= keyHash) return n.name;\n  }\n  return sorted[0].name;\n}`,
      python: `def find_node(nodes, key_hash):\n    sorted_nodes = sorted(nodes, key=lambda n: n['token'])\n    for n in sorted_nodes:\n        if n['token'] >= key_hash:\n            return n['name']\n    return sorted_nodes[0]['name']`
    },
    testCases: [
      { input: `[{"name":"A","token":100},{"name":"B","token":200},{"name":"C","token":300}], 150`, expectedOutput: `"B"`, isHidden: false },
      { input: `[{"name":"A","token":100},{"name":"B","token":200},{"name":"C","token":300}], 350`, expectedOutput: `"A"`, isHidden: false }
    ],
    hints: ["Consistent hashing minimizes re-mapped keys when nodes are added or removed."]
  },
  {
    id: "expert-009",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Payment Processing System",
    difficulty: "Hard",
    pattern: "Idempotency + Transactions",
    description: "Enforce payment idempotency: if idempotencyKey has already been processed, return cached transaction record without charging again.",
    slug: "design-a-payment-processing-system",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Idempotency + Transactions"],
    xpReward: 300,
    starterCode: {
      javascript: `function processPayment(txStore, key, amount) {\n  if (txStore[key]) {\n    return { duplicate: true, record: txStore[key] };\n  }\n  const record = { id: 'tx_' + key, amount, status: 'paid' };\n  return { duplicate: false, record };\n}`,
      python: `def process_payment(tx_store, key, amount):\n    if key in tx_store:\n        return { "duplicate": True, "record": tx_store[key] }\n    record = { "id": f"tx_{key}", "amount": amount, "status": "paid" }\n    return { "duplicate": False, "record": record }`
    },
    testCases: [
      { input: `{"k1":{"id":"tx_k1","amount":50,"status":"paid"}}, "k1", 50`, expectedOutput: `{"duplicate":true,"record":{"id":"tx_k1","amount":50,"status":"paid"}}`, isHidden: false },
      { input: `{}, "k2", 100`, expectedOutput: `{"duplicate":false,"record":{"id":"tx_k2","amount":100,"status":"paid"}}`, isHidden: false }
    ],
    hints: ["Idempotency keys prevent double charges if network retries occur."]
  },
  {
    id: "expert-010",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design an E-Commerce Backend",
    difficulty: "Hard",
    pattern: "Microservices",
    description: "Implement a basic Saga orchestrator: reserve inventory, process payment, and handle compensating rollback if payment fails.",
    slug: "design-an-e-commerce-backend",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Microservices"],
    xpReward: 300,
    starterCode: {
      javascript: `function executeOrderSaga(inventoryOk, paymentOk) {\n  if (!inventoryOk) return { status: 'FAILED', reason: 'Inventory unavailable' };\n  if (!paymentOk) return { status: 'ROLLED_BACK', reason: 'Payment failed, inventory released' };\n  return { status: 'COMPLETED', orderId: 'ord_123' };\n}`,
      python: `def execute_order_saga(inventory_ok, payment_ok):\n    if not inventory_ok:\n        return { "status": "FAILED", "reason": "Inventory unavailable" }\n    if not payment_ok:\n        return { "status": "ROLLED_BACK", "reason": "Payment failed, inventory released" }\n    return { "status": "COMPLETED", "orderId": "ord_123" }`
    },
    testCases: [
      { input: `true, true`, expectedOutput: `{"status":"COMPLETED","orderId":"ord_123"}`, isHidden: false },
      { input: `true, false`, expectedOutput: `{"status":"ROLLED_BACK","reason":"Payment failed, inventory released"}`, isHidden: false }
    ],
    hints: ["Sagas manage distributed transactions using local transactions and compensating rollbacks."]
  },
  {
    id: "expert-011",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Ride Booking Backend",
    difficulty: "Hard",
    pattern: "Real-time + Geospatial",
    description: "Match rider with nearest available driver using 2D distance calculation: return driver with smallest distance.",
    slug: "design-a-ride-booking-backend",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Real-time + Geospatial"],
    xpReward: 300,
    starterCode: {
      javascript: `function findNearest(rider, drivers) {\n  if (!drivers.length) return null;\n  let nearest = null;\n  let minDistance = Infinity;\n  for (const d of drivers) {\n    const dist = Math.hypot(d.x - rider.x, d.y - rider.y);\n    if (dist < minDistance) {\n      minDistance = dist;\n      nearest = d.id;\n    }\n  }\n  return nearest;\n}`,
      python: `def find_nearest(rider, drivers):\n    import math\n    if not drivers: return None\n    nearest = None\n    min_dist = float('inf')\n    for d in drivers:\n        dist = math.hypot(d['x'] - rider['x'], d['y'] - rider['y'])\n        if dist < min_dist:\n            min_dist = dist\n            nearest = d['id']\n    return nearest`
    },
    testCases: [
      { input: `{"x":0,"y":0}, [{"id":"d1","x":1,"y":1},{"id":"d2","x":5,"y":5}]`, expectedOutput: `"d1"`, isHidden: false }
    ],
    hints: ["Geospatial indexes (e.g. Geohash, H3, PostGIS) query nearby drivers in O(1)."]
  },
  {
    id: "expert-012",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Video Streaming Backend",
    difficulty: "Hard",
    pattern: "Distributed Storage + CDN",
    description: "Generate video chunk segment names for HLS streaming: given videoId and chunkCount, return an array of chunk segment file names.",
    slug: "design-a-video-streaming-backend",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Distributed Storage + CDN"],
    xpReward: 300,
    starterCode: {
      javascript: `function generateHLSChunks(videoId, count) {\n  const chunks = [];\n  for (let i = 0; i < count; i++) {\n    chunks.push(\`\${videoId}_chunk_\${i}.ts\`);\n  }\n  return chunks;\n}`,
      python: `def generate_hls_chunks(video_id, count):\n    return [f"{video_id}_chunk_{i}.ts" for i in range(count)]`
    },
    testCases: [
      { input: `"vid1", 3`, expectedOutput: `["vid1_chunk_0.ts","vid1_chunk_1.ts","vid1_chunk_2.ts"]`, isHidden: false }
    ],
    hints: ["HLS segments video into small .ts files with an .m3u8 playlist manifest."]
  },
  {
    id: "expert-013",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a URL Analytics System",
    difficulty: "Hard",
    pattern: "Event Processing",
    description: "Aggregate click events by domain: return a dictionary mapping each domain to its total click count.",
    slug: "design-a-url-analytics-system",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Event Processing"],
    xpReward: 300,
    starterCode: {
      javascript: `function aggregateClicks(clicks) {\n  const stats = {};\n  clicks.forEach(c => {\n    stats[c.domain] = (stats[c.domain] || 0) + 1;\n  });\n  return stats;\n}`,
      python: `def aggregate_clicks(clicks):\n    stats = {}\n    for c in clicks:\n        d = c['domain']\n        stats[d] = stats.get(d, 0) + 1\n    return stats`
    },
    testCases: [
      { input: `[{"domain":"a.com"},{"domain":"a.com"},{"domain":"b.com"}]`, expectedOutput: `{"a.com":2,"b.com":1}`, isHidden: false }
    ],
    hints: ["Stream processing engines (Kafka, Flink) aggregate time-windowed click metrics at scale."]
  },
  {
    id: "expert-014",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Search Service",
    difficulty: "Hard",
    pattern: "Search Indexing",
    description: "Build an inverted index mapping words to document IDs: return a dictionary mapping lowercase words to lists of document IDs.",
    slug: "design-a-search-service",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "Search Indexing"],
    xpReward: 300,
    starterCode: {
      javascript: `function buildInvertedIndex(docs) {\n  const index = {};\n  docs.forEach(doc => {\n    const words = doc.text.toLowerCase().split(/\\s+/);\n    words.forEach(w => {\n      if (!index[w]) index[w] = [];\n      if (!index[w].includes(doc.id)) index[w].push(doc.id);\n    });\n  });\n  return index;\n}`,
      python: `def build_inverted_index(docs):\n    index = {}\n    for doc in docs:\n        words = doc['text'].lower().split()\n        for w in words:\n            if w not in index: index[w] = []\n            if doc['id'] not in index[w]: index[w].append(doc['id'])\n    return index`
    },
    testCases: [
      { input: `[{"id":1,"text":"node server"},{"id":2,"text":"express server"}]`, expectedOutput: `{"node":[1],"server":[1,2],"express":[2]}`, isHidden: false }
    ],
    hints: ["Inverted indexes enable O(1) keyword lookups in search engines like Elasticsearch."]
  },
  {
    id: "expert-015",
    tier: 5,
    section: "Backend Expert",
    topic: "Observability",
    title: "Design a Logging and Monitoring System",
    difficulty: "Hard",
    pattern: "Distributed Logging",
    description: "Calculate latency percentiles: given a sorted array of latency numbers, return p50 and p99 values.",
    slug: "design-a-logging-and-monitoring-system",
    category: "backend",
    tags: ["be-master", "backend-expert", "Observability", "Distributed Logging"],
    xpReward: 300,
    starterCode: {
      javascript: `function calculatePercentiles(latencies) {\n  const sorted = [...latencies].sort((a, b) => a - b);\n  const p50Idx = Math.floor(sorted.length * 0.5);\n  const p99Idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));\n  return { p50: sorted[p50Idx], p99: sorted[p99Idx] };\n}`,
      python: `def calculate_percentiles(latencies):\n    sorted_l = sorted(latencies)\n    p50_idx = int(len(sorted_l) * 0.5)\n    p99_idx = min(len(sorted_l) - 1, int(len(sorted_l) * 0.99))\n    return { "p50": sorted_l[p50_idx], "p99": sorted_l[p99_idx] }`
    },
    testCases: [
      { input: `[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`, expectedOutput: `{"p50":60,"p99":100}`, isHidden: false }
    ],
    hints: ["Percentiles reveal tail latency that mean/average hides."]
  },
  {
    id: "expert-016",
    tier: 5,
    section: "Backend Expert",
    topic: "Microservices",
    title: "Design a Microservices Architecture",
    difficulty: "Hard",
    pattern: "Service Decomposition",
    description: "Implement a circuit breaker: if failureCount >= threshold, transition to 'OPEN' and reject requests; otherwise remain 'CLOSED'.",
    slug: "design-a-microservices-architecture",
    category: "backend",
    tags: ["be-master", "backend-expert", "Microservices", "Service Decomposition"],
    xpReward: 300,
    starterCode: {
      javascript: `function circuitBreaker(failures, threshold) {\n  if (failures >= threshold) {\n    return { state: 'OPEN', callAllowed: false };\n  }\n  return { state: 'CLOSED', callAllowed: true };\n}`,
      python: `def circuit_breaker(failures, threshold):\n    if failures >= threshold:\n        return { "state": "OPEN", "callAllowed": False }\n    return { "state": "CLOSED", "callAllowed": True }`
    },
    testCases: [
      { input: `5, 5`, expectedOutput: `{"state":"OPEN","callAllowed":false}`, isHidden: false },
      { input: `2, 5`, expectedOutput: `{"state":"CLOSED","callAllowed":true}`, isHidden: false }
    ],
    hints: ["Circuit breakers prevent cascading failures across interdependent microservices."]
  },
  {
    id: "expert-017",
    tier: 5,
    section: "Backend Expert",
    topic: "Distributed Systems",
    title: "Design an Event-Driven Backend",
    difficulty: "Hard",
    pattern: "Event Bus",
    description: "Route events through an event bus with prefix matching (e.g. topic 'order.created' matches subscriber 'order.*').",
    slug: "design-an-event-driven-backend",
    category: "backend",
    tags: ["be-master", "backend-expert", "Distributed Systems", "Event Bus"],
    xpReward: 300,
    starterCode: {
      javascript: `function matchSubscribers(subscriptions, eventTopic) {\n  const prefix = eventTopic.split('.')[0] + '.*';\n  return subscriptions[prefix] || [];\n}`,
      python: `def match_subscribers(subscriptions, event_topic):\n    prefix = event_topic.split('.')[0] + '.*'\n    return subscriptions.get(prefix, [])`
    },
    testCases: [
      { input: `{"order.*":["srvA","srvB"],"user.*":["srvC"]}, "order.created"`, expectedOutput: `["srvA","srvB"]`, isHidden: false }
    ],
    hints: ["Topic-based pub/sub enables decoupled asynchronous microservice communication."]
  },
  {
    id: "expert-018",
    tier: 5,
    section: "Backend Expert",
    topic: "System Design",
    title: "Design a Highly Available Backend",
    difficulty: "Hard",
    pattern: "High Availability",
    description: "Active-passive failover: if primary node is healthy, route to primary; otherwise route to highest priority standby replica.",
    slug: "design-a-highly-available-backend",
    category: "backend",
    tags: ["be-master", "backend-expert", "System Design", "High Availability"],
    xpReward: 300,
    starterCode: {
      javascript: `function routeFailover(primaryAlive, standbys) {\n  if (primaryAlive) return { activeNode: 'primary' };\n  const highest = [...standbys].sort((a, b) => b.priority - a.priority)[0];\n  return { activeNode: highest ? highest.name : null, failover: true };\n}`,
      python: `def route_failover(primary_alive, standbys):\n    if primary_alive: return { "activeNode": "primary" }\n    highest = sorted(standbys, key=lambda s: s['priority'], reverse=True)[0] if standbys else None\n    return { "activeNode": highest['name'] if highest else None, "failover": True }`
    },
    testCases: [
      { input: `true, [{"name":"standby1","priority":10}]`, expectedOutput: `{"activeNode":"primary"}`, isHidden: false },
      { input: `false, [{"name":"standby1","priority":10},{"name":"standby2","priority":20}]`, expectedOutput: `{"activeNode":"standby2","failover":true}`, isHidden: false }
    ],
    hints: ["Automated failover paired with health checks minimizes system mean time to recovery (MTTR)."]
  }
];
