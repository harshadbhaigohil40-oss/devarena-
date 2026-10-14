/**
 * TIER 4 — INTERVIEW PREP (35 Real System Design Interview Questions)
 * Difficulty: Medium – Hard
 * Patterns: Distributed Storage, Caching, Hashing, Scalability, Messaging, Event-Driven Architecture, High Availability
 */

module.exports = [
  {
    id: "sd-tier4i-001",
    tier: 4,
    section: "Interview Prep",
    topic: "Design URL Shortener",
    title: "Design URL Shortener",
    slug: "design-url-shortener",
    difficulty: "Medium",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "url-shortener", "hashing", "Distributed Storage"],
    xpReward: 150,
    description: `## Problem Statement
Design a distributed URL shortener service (like TinyURL or Bitly) that converts long URLs into short, unique aliases and redirects clients with minimal latency.

### Functional Requirements
- Given a long URL, the service generates a shorter, unique alias (e.g. \`https://sho.rt/aZ8k9\`).
- When a client accesses a short link, the system redirects them to the original destination URL.
- Support optional custom alias creation if the alias is available.
- Support link expiration with a default lifespan or user-defined TTL.

### Non-Functional Requirements
- **High Availability**: 99.99% uptime; redirection is on the critical user path.
- **Ultra-Low Latency**: Redirection response time under 15ms.
- **Read-Heavy Workload**: Read to write ratio of approximately 100:1.
- **Unpredictability**: Short codes should not be easily guessable to prevent enumeration scraping.

### Capacity Estimation
- Write traffic: 100 million new URLs per month (~40 writes/second).
- Read traffic: 10 billion redirections per month (~4,000 reads/second peak ~10,000 QPS).
- Storage: 100M URLs * 500 bytes = 50GB/month (3TB over 5 years).
- Cache memory: Caching 20% of daily read traffic requires ~25GB RAM.

### API Requirements
- \`POST /api/v1/shorten\`: \`{ "longUrl": string, "customAlias"?: string, "expireAt"?: string }\` -> \`{ "shortUrl": string }\`
- \`GET /{shortCode}\`: HTTP 302 Found redirect to destination URL.

### Data Model Considerations
- Relational vs NoSQL Key-Value store (e.g. DynamoDB, Cassandra).
- Columns: \`short_code\` (PK), \`original_url\`, \`user_id\`, \`created_at\`, \`expires_at\`.

### High-Level Architecture Expectations
- Client -> Global DNS / CDN -> Load Balancer -> Stateless API Servers -> Distributed Cache (Redis) -> NoSQL Key-Value Store.
- Unique ID Generator (Key Generation Service - KGS, Snowflake, or Base62 encoding).

### Component Breakdown
- **API Service**: Validates input, talks to KGS, persists record, invalidates cache.
- **Redirection Service**: Checks Redis cache first; on miss, queries database and warms cache.
- **Key Generation Service (KGS)**: Pre-generates random 7-character Base62 keys to prevent runtime collisions.

### Scaling Strategy
- Partition database by hash of \`short_code\`.
- Deploy read-replicas and distributed Redis clusters geographically close to users.

### Bottlenecks & Failure Scenarios
- Cache eviction stampede when popular links expire.
- Database hot spots during sudden viral traffic surges.

### Trade-offs
- HTTP 301 (Permanent Redirect - browser caches link, saves server load but loses analytics) vs HTTP 302 (Temporary Redirect - tracks every click, higher server load).

### Follow-Up Questions
- How would you track click analytics (geographic origin, referrers, device types) without slowing down redirects?
- How do you handle malicious URL spam and malware distribution?`,
    starterCode: {
      javascript: `function base62Encode(id) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (id === 0) return chars[0];
  let result = "";
  while (id > 0) {
    result = chars[id % 62] + result;
    id = Math.floor(id / 62);
  }
  return result;
}`,
      python: `def base62_encode(id_num):
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if id_num == 0:
        return chars[0]
    result = []
    while id_num > 0:
        result.append(chars[id_num % 62])
        id_num //= 62
    return "".join(reversed(result))`
    },
    testCases: [
      { input: `1000`, expectedOutput: `"g8"`, isHidden: false },
      { input: `125`, expectedOutput: `"21"`, isHidden: false },
      { input: `0`, expectedOutput: `"0"`, isHidden: true }
    ],
    hints: ["Base62 uses [0-9a-zA-Z] (62 characters). Continuously divide by 62 and collect remainders."]
  },
  {
    id: "sd-tier4i-002",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Pastebin",
    title: "Design Pastebin",
    slug: "design-pastebin",
    difficulty: "Medium",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "pastebin", "object-storage", "Distributed Storage"],
    xpReward: 150,
    description: `## Problem Statement
Design a text-sharing service like Pastebin or GitHub Gist where users can upload plain text snippets and share them via unique URLs.

### Functional Requirements
- Users can paste text up to 10MB and receive a unique shareable URL.
- Anyone with the link can view the paste content.
- Pastes can optionally specify an expiration duration or remain permanent.
- Support optional syntax highlighting selection and password protection.

### Non-Functional Requirements
- **Durability**: Pastes must not be lost once acknowledged.
- **Availability**: High read availability (99.99%).
- **Low Latency**: Pastes load in under 25ms.
- **Read-to-Write Ratio**: Roughly 20:1 read-to-write.

### Capacity Estimation
- 10 million pastes created per month.
- Average paste size: 10KB. Monthly storage: 100GB/month (6TB over 5 years).
- Read QPS: ~80 reads/sec average, peak ~500 reads/sec.

### API Requirements
- \`POST /api/v1/pastes\`: \`{ "content": string, "expiresInMinutes"?: number, "syntax"?: string }\` -> \`{ "url": string }\`
- \`GET /api/v1/pastes/{id}\`: Returns text content or formatted payload.

### Data Model Considerations
- Store metadata (ID, author, size, expires_at) in relational or NoSQL database.
- Store actual text content in Cloud Object Storage (S3) or Blob store to keep database lightweight.

### High-Level Architecture Expectations
- API Gateway -> Paste Service -> Object Storage (S3 for text bytes) + Metadata Database + Redis Cache.
- Cleanup Service: Background worker that deletes expired pastes from storage.

### Scaling & Bottlenecks
- Large text payloads exhausting web server memory during concurrent writes.
- Mitigation: Direct-to-S3 pre-signed upload URLs for pastes over 1MB.

### Trade-offs
- Storing content directly in DB (faster for tiny pastes) vs Object Store (scales better for large files).`,
    starterCode: {
      javascript: `function calculatePasteStorageGB(dailyPastes, avgSizeKB, days) {
  const totalKB = dailyPastes * avgSizeKB * days;
  return Math.round(totalKB / 1e6);
}`,
      python: `def calculate_paste_storage_gb(daily_pastes, avg_size_kb, days):
    total_kb = daily_pastes * avg_size_kb * days
    return round(total_kb / 1e6)`
    },
    testCases: [
      { input: `300000, 10, 365`, expectedOutput: `1095`, isHidden: false },
      { input: `100000, 5, 30`, expectedOutput: `15`, isHidden: false }
    ],
    hints: ["Multiply dailyPastes * avgSizeKB * days and divide by 1,000,000 to get GB."]
  },
  {
    id: "sd-tier4i-003",
    tier: 4,
    section: "Interview Prep",
    topic: "Design a Rate Limiter",
    title: "Design a Rate Limiter",
    slug: "design-a-rate-limiter",
    difficulty: "Medium",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "rate-limiter", "token-bucket", "Distributed Systems"],
    xpReward: 150,
    description: `## Problem Statement
Design a distributed API rate limiter to protect backend services from denial-of-service, abuse, and resource exhaustion.

### Functional Requirements
- Limit client requests based on IP address, User ID, or API Key.
- Support configurable rules (e.g. 100 requests per minute per user).
- Return HTTP 429 Too Many Requests when limit is exceeded with \`Retry-After\` header.
- Inform clients of remaining allowance via response headers.

### Non-Functional Requirements
- **Low Latency**: Rate check must execute in < 2ms to avoid adding latency to every API call.
- **Accuracy**: Minimal over-admittance or false-positive throttling.
- **Distributed Consistency**: Works consistently across multi-server gateway fleets.
- **Fault Tolerance**: If rate limiter fails, decide whether to fail-open (allow traffic) or fail-closed.

### Capacity Estimation
- 100 million daily active users making 100 API calls/day = 10 billion requests/day (~115,000 QPS).
- Memory per user record: ~50 bytes. 100M users = ~5GB RAM (fits easily in Redis cluster).

### Key Architecture Components
- Rate Limiter Middleware / Sidecar at API Gateway.
- Central in-memory cache (Redis) running atomic Lua scripts.
- Rule configuration service loaded in memory on each gateway worker.

### Algorithmic Comparison
- Token Bucket vs Leaky Bucket vs Sliding Window Counter vs Fixed Window.

### Advanced Considerations
- Multi-region rate synchronization without cross-datacenter latency penalties.
- Tiered rate limits based on user subscription levels (Free vs Pro vs Enterprise).`,
    starterCode: {
      javascript: `function tokenBucketLimiter(tokens, capacity, refillRatePerSec, timeElapsedSec, requested) {
  const refilledTokens = Math.min(capacity, tokens + timeElapsedSec * refillRatePerSec);
  if (refilledTokens >= requested) {
    return { allowed: true, remaining: refilledTokens - requested };
  }
  return { allowed: false, remaining: refilledTokens };
}`,
      python: `def token_bucket_limiter(tokens, capacity, refill_rate_per_sec, time_elapsed_sec, requested):
    refilled = min(capacity, tokens + time_elapsed_sec * refill_rate_per_sec)
    if refilled >= requested:
        return {"allowed": True, "remaining": refilled - requested}
    return {"allowed": False, "remaining": refilled}`
    },
    testCases: [
      { input: `5, 10, 2, 2, 3`, expectedOutput: `{"allowed":true,"remaining":6}`, isHidden: false },
      { input: `1, 10, 1, 0, 5`, expectedOutput: `{"allowed":false,"remaining":1}`, isHidden: false }
    ],
    hints: ["Refill tokens up to capacity based on elapsed time, then deduct requested tokens if available."]
  },
  {
    id: "sd-tier4i-004",
    tier: 4,
    section: "Interview Prep",
    topic: "Design a Notification System",
    title: "Design a Notification System",
    slug: "design-a-notification-system",
    difficulty: "Medium",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-interview", "system-design", "notifications", "Messaging"],
    xpReward: 150,
    description: `## Problem Statement
Design a scalable notification platform capable of delivering billions of push notifications, SMS messages, and emails daily across diverse client platforms (iOS, Android, Web, Email).

### Functional Requirements
- Support multiple channels: Mobile Push (APNs, FCM), SMS (Twilio), and Email (SendGrid/SES).
- Users can customize notification preferences and opt-out per category.
- Support real-time transactional alerts (OTP) and scheduled marketing campaigns.
- Prevent duplicate notification delivery and enforce user rate limits (e.g. max 3 promos/day).

### Non-Functional Requirements
- **High Throughput**: Capable of processing 100,000 notifications per second during breaking news.
- **Reliability**: Zero message loss for critical security codes and transaction receipts.
- **Low Latency**: Urgent transactional notifications delivered within 5 seconds.

### High-Level Architecture Expectations
- Notification Service -> User Preference Validator -> Priority Message Queues -> Channel Workers (Push/SMS/Email) -> Third-Party Providers.

### Component Breakdown
- **Notification Server**: Validates payload, checks user opt-in status.
- **Message Queues**: RabbitMQ/Kafka topics segregated by priority and channel.
- **Channel Workers**: Consume from queues, call third-party APIs with exponential backoff.
- **Analytics & Tracking**: Tracks delivery, open, and click rates via webhooks.

### Scaling & Failure Modes
- Third-party provider outages (e.g. APNs or Twilio downtime).
- Mitigation: Circuit breakers, multi-provider failover, and dead-letter queues.`,
    starterCode: {
      javascript: `function filterOptedOutUsers(users, channel) {
  return users.filter(u => !u.optOutChannels || !u.optOutChannels.includes(channel)).map(u => u.id);
}`,
      python: `def filter_opted_out_users(users, channel):
    return [u["id"] for u in users if channel not in u.get("optOutChannels", [])]`
    },
    testCases: [
      { input: `[{"id": "u1", "optOutChannels": ["sms"]}, {"id": "u2", "optOutChannels": []}], "sms"`, expectedOutput: `["u2"]`, isHidden: false },
      { input: `[{"id": "u1"}, {"id": "u2"}], "email"`, expectedOutput: `["u1","u2"]`, isHidden: false }
    ],
    hints: ["Filter users who have not opted out of the target communication channel."]
  },
  {
    id: "sd-tier4i-005",
    tier: 4,
    section: "Interview Prep",
    topic: "Design a Chat System",
    title: "Design a Chat System",
    slug: "design-a-chat-system",
    difficulty: "Medium",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-interview", "system-design", "chat", "websockets", "Messaging"],
    xpReward: 150,
    description: `## Problem Statement
Design a real-time 1-on-1 and small group chat application (similar to Messenger or Discord DMs) supporting instant delivery, read receipts, and online presence indicators.

### Functional Requirements
- Real-time 1-on-1 messaging with low latency (<100ms).
- Group chat support for up to 500 members.
- Online / offline presence status indicators.
- Message history synchronization across multiple user devices.
- Delivery status receipts: Sent, Delivered, Read.

### Non-Functional Requirements
- **High Concurrency**: Support 10 million concurrent active WebSocket connections.
- **Message Ordering**: Strict chronological message ordering within individual conversations.
- **Durability**: Zero message loss; messages persisted reliably before acknowledgment.

### Architecture Expectations
- WebSocket Connection Gateways maintaining persistent duplex connections.
- Redis Pub/Sub or Kafka routing messages between connection gateway nodes.
- Message Store: NoSQL Wide-Column store (Cassandra/HBase) or Key-Value store with clustering keys.
- Presence Service: Heartbeat-based presence registry with distributed in-memory cache.

### Scaling & Bottlenecks
- Connection server crashes dropping hundreds of thousands of active socket connections.
- Group chat message fanout explosion (writing message to 500 member inboxes).`,
    starterCode: {
      javascript: `function routeChatMessage(chatGateways, recipientId, message) {
  const gateway = chatGateways[recipientId];
  if (gateway) {
    return { status: "delivered_online", gateway, messageId: message.id };
  }
  return { status: "stored_offline", gateway: null, messageId: message.id };
}`,
      python: `def route_chat_message(chat_gateways, recipient_id, message):
    gateway = chat_gateways.get(recipient_id)
    if gateway:
        return {"status": "delivered_online", "gateway": gateway, "messageId": message.get("id")}
    return {"status": "stored_offline", "gateway": None, "messageId": message.get("id")}`
    },
    testCases: [
      { input: `{"u2": "gateway_3"}, "u2", {"id": "m1", "text": "hello"}`, expectedOutput: `{"status":"delivered_online","gateway":"gateway_3","messageId":"m1"}`, isHidden: false },
      { input: `{}, "u3", {"id": "m2", "text": "hey"}`, expectedOutput: `{"status":"stored_offline","gateway":null,"messageId":"m2"}`, isHidden: false }
    ],
    hints: ["Check if recipient has an active gateway session. If online, route immediately; else store offline."]
  },
  {
    id: "sd-tier4i-006",
    tier: 4,
    section: "Interview Prep",
    topic: "Design WhatsApp",
    title: "Design WhatsApp",
    slug: "design-whatsapp",
    difficulty: "Hard",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-interview", "system-design", "whatsapp", "e2ee", "Messaging"],
    xpReward: 200,
    description: `## Problem Statement
Design a globally distributed instant messaging platform at WhatsApp scale (2 billion users, 100 billion messages per day) featuring End-to-End Encryption (E2EE), media sharing, and transient storage.

### Functional Requirements
- One-on-one and group messaging with End-to-End Encryption (Signal Protocol).
- Media sharing (images, voice notes, videos) with secure encrypted chunk uploads.
- Delivery receipts: single tick (sent), double tick (delivered), blue tick (read).
- Last seen / online status with privacy controls.
- Ephemeral server storage: messages deleted from server immediately upon recipient delivery.

### Non-Functional Requirements
- **Massive Scale**: 2 billion users, 100B messages/day (~1.2M writes/sec, peak ~3M/sec).
- **Extreme Latency Sensitivity**: Under 50ms delivery latency globally.
- **Privacy First**: Zero plaintext messages stored on application servers.

### Architectural Breakdown
- Erlang / Elixir / Netty based Connection Managers handling lightweight persistent sockets.
- Key Distribution Center for Signal Protocol public identity keys and pre-keys.
- Transient Spool Store: Ephemeral distributed queue for undelivered offline messages.
- Media Storage: Encrypted blob storage on S3 + global CDN edge cache.

### Key Trade-offs
- Ephemeral server storage reduces server storage costs drastically but requires client-side backup solutions (iCloud, Google Drive).`,
    starterCode: {
      javascript: `function calculateWhatsAppBandwidthGbps(messagesPerDay, avgBytesPerMsg) {
  const totalBytes = messagesPerDay * avgBytesPerMsg;
  const bytesPerSec = totalBytes / 86400;
  const bitsPerSec = bytesPerSec * 8;
  return Math.round((bitsPerSec / 1e9) * 10) / 10;
}`,
      python: `def calculate_whats_app_bandwidth_gbps(messages_per_day, avg_bytes_per_msg):
    total_bytes = messages_per_day * avg_bytes_per_msg
    bytes_per_sec = total_bytes / 86400.0
    bits_per_sec = bytes_per_sec * 8
    return round(bits_per_sec / 1e9, 1)`
    },
    testCases: [
      { input: `100000000000, 100`, expectedOutput: `925.9`, isHidden: false },
      { input: `10000000000, 100`, expectedOutput: `92.6`, isHidden: false }
    ],
    hints: ["Convert total daily bytes to bits per second and divide by 10^9 to get Gbps."]
  },
  {
    id: "sd-tier4i-007",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Telegram",
    title: "Design Telegram",
    slug: "design-telegram",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "telegram", "channels", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design a cloud-based messaging platform like Telegram supporting massive public broadcast channels (up to 200,000 members), permanent cloud history sync, and Secret Chats.

### Functional Requirements
- Multi-device instant message synchronization with permanent cloud history.
- Large broadcast channels and supergroups with up to 200,000 members.
- Fast file sharing up to 2GB per file with streaming media playback.
- Secret chats featuring client-side end-to-end encryption.

### Non-Functional Requirements
- **High Concurrency**: Millions of concurrent subscribers receiving broadcast messages within 1-2 seconds.
- **Global Data Center Distribution**: Multiple data centers worldwide with fast user routing.
- **Infinite Scalability**: Unlimited message history accessible across all devices seamlessly.

### Architectural Breakdown
- Multi-datacenter routing with custom MTProto binary protocol over TCP.
- Message Storage: Distributed append-only log with secondary indexes per chat.
- Broadcast Fanout Service: Tiered message distribution trees to broadcast channel messages to 200k subscribers efficiently without overwhelming individual brokers.

### Key Trade-offs
- Cloud sync (centralized storage for multi-device ease) vs Pure E2EE (local-only storage like WhatsApp).`,
    starterCode: {
      javascript: `function calculateBroadcastFanoutTime(subscribers, batchSize, delayPerBatchMs) {
  const batches = Math.ceil(subscribers / batchSize);
  return batches * delayPerBatchMs;
}`,
      python: `import math

def calculate_broadcast_fanout_time(subscribers, batch_size, delay_per_batch_ms):
    batches = math.ceil(subscribers / batch_size)
    return batches * delay_per_batch_ms`
    },
    testCases: [
      { input: `200000, 5000, 10`, expectedOutput: `400`, isHidden: false },
      { input: `50000, 10000, 20`, expectedOutput: `100`, isHidden: false }
    ],
    hints: ["Divide subscribers by batchSize and multiply by delayPerBatchMs."]
  },
  {
    id: "sd-tier4i-008",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Slack",
    title: "Design Slack",
    slug: "design-slack",
    difficulty: "Hard",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-interview", "system-design", "slack", "channels", "Messaging"],
    xpReward: 200,
    description: `## Problem Statement
Design an enterprise team communication platform like Slack featuring workspaces, organized channels, threads, real-time message delivery, and full-text search.

### Functional Requirements
- Workspaces containing public channels, private channels, direct messages, and threads.
- Real-time messaging, typing indicators, and emoji reactions.
- Full-text search across all historical messages and shared documents within a workspace.
- Multi-tenant isolation: strict security boundary separating different company workspaces.

### Non-Functional Requirements
- **Availability**: 99.99% during business hours.
- **Low Latency**: Message delivery under 100ms.
- **Search Freshness**: Newly posted messages searchable within seconds.

### High-Level Architecture
- Multi-Tenant Sharding: Shard database clusters by \`workspace_id\` to keep enterprise data localized.
- Real-Time Hub: Edge gateway connection servers paired with message broker clusters (Kafka).
- Search Pipeline: Asynchronous CDC (Debezium) streaming messages from MySQL into Elasticsearch clusters.

### Challenges & Bottlenecks
- Mega-channels (e.g. #general with 50,000 members in an enterprise): Fanout write vs fanout read models.`,
    starterCode: {
      javascript: `function getWorkspaceShard(workspaceId, totalShards) {
  let hash = 0;
  for (let i = 0; i < workspaceId.length; i++) {
    hash = (hash * 31 + workspaceId.charCodeAt(i)) >>> 0;
  }
  return hash % totalShards;
}`,
      python: `def get_workspace_shard(workspace_id, total_shards):
    h = 0
    for ch in workspace_id:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % total_shards`
    },
    testCases: [
      { input: `"slack_team_corp", 16`, expectedOutput: `15`, isHidden: false },
      { input: `"startup_xyz", 8`, expectedOutput: `4`, isHidden: false }
    ],
    hints: ["Hash workspaceId to assign it to an isolated database shard."]
  },
  {
    id: "sd-tier4i-009",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Twitter/X",
    title: "Design Twitter/X",
    slug: "design-twitter-x",
    difficulty: "Hard",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-interview", "system-design", "twitter", "fanout", "Scalability"],
    xpReward: 200,
    description: `## Problem Statement
Design a high-scale microblogging platform like Twitter/X supporting tweet publication, timeline generation (Home Timeline and User Timeline), and follow graphs.

### Functional Requirements
- Post tweets (text, images, video) up to 280 characters.
- Follow and unfollow other users.
- Home Timeline: View real-time aggregated feed of tweets from followed accounts.
- User Timeline: View tweets posted by a specific user profile.
- Search tweets by keywords and trending hashtags.

### Non-Functional Requirements
- **Massive Read/Write Asymmetry**: 500M tweets/day (~6,000 writes/sec) vs 300B timeline reads/day (~3.5M reads/sec).
- **Fast Timeline Generation**: Home timeline loads in under 100ms.
- **High Availability**: Eventual consistency is acceptable; uptime is paramount.

### Core Architecture: Fanout-on-Write vs Fanout-on-Read
- **Fanout-on-Write (Push model)**: When User A posts a tweet, inject tweet ID into the Redis timeline cache of every follower. Fast reads O(1), but catastrophic for celebrities with 50M followers.
- **Fanout-on-Read (Pull model)**: On timeline load, query tweets from all followed accounts and merge-sort. Slow reads O(N), fast writes.
- **Hybrid Approach**: Push model for standard users; Pull model for celebrities (>25k followers). Merge at read time.`,
    starterCode: {
      javascript: `function chooseFanoutStrategy(followerCount) {
  return followerCount >= 25000 ? "PULL_CELEBRITY" : "PUSH_STANDARD";
}`,
      python: `def choose_fanout_strategy(follower_count):
    return "PULL_CELEBRITY" if follower_count >= 25000 else "PUSH_STANDARD"`
    },
    testCases: [
      { input: `5000000`, expectedOutput: `"PULL_CELEBRITY"`, isHidden: false },
      { input: `250`, expectedOutput: `"PUSH_STANDARD"`, isHidden: false },
      { input: `25000`, expectedOutput: `"PULL_CELEBRITY"`, isHidden: true }
    ],
    hints: ["Use pull model for users with >= 25,000 followers to prevent celebrity fanout storms."]
  },
  {
    id: "sd-tier4i-010",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Instagram",
    title: "Design Instagram",
    slug: "design-instagram",
    difficulty: "Medium",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "instagram", "photos", "Distributed Storage"],
    xpReward: 150,
    description: `## Problem Statement
Design a photo-sharing platform like Instagram supporting photo/video uploads, news feed generation, user follow graph, and image thumbnail caching.

### Functional Requirements
- Upload photos and videos with captions and tags.
- Follow and unfollow users.
- View personalized image feed of followed users.
- Like and comment on posts in real time.

### Non-Functional Requirements
- **High Availability**: 99.99%.
- **Low Latency**: Feed rendering under 200ms.
- **High Durability**: Photos must never be lost.
- **Read-Heavy**: Read to write ratio of 100:1.

### Capacity Estimation
- 500 million daily active users; 100M photos uploaded per day.
- Average photo size: 2MB. Daily storage: 200TB/day (73PB/year).

### Component Breakdown
- **Upload Service**: Saves original photo to Object Storage (S3), emits event to Kafka.
- **Image Processing Pipeline**: Asynchronous workers generate multiple resolutions/thumbnails (small, medium, large).
- **Metadata Database**: Stores post metadata, user details, like counts in sharded database.
- **CDN**: Caches popular photo URLs at edge locations worldwide.`,
    starterCode: {
      javascript: `function calculateAnnualPhotoStoragePB(dailyPhotos, avgPhotoMB) {
  const dailyMB = dailyPhotos * avgPhotoMB;
  const annualMB = dailyMB * 365;
  const annualPB = annualMB / (1024 * 1024 * 1024);
  return Math.round(annualPB * 10) / 10;
}`,
      python: `def calculate_annual_photo_storage_pb(daily_photos, avg_photo_mb):
    daily_mb = daily_photos * avg_photo_mb
    annual_mb = daily_mb * 365
    annual_pb = annual_mb / (1024.0 * 1024.0 * 1024.0)
    return round(annual_pb, 1)`
    },
    testCases: [
      { input: `100000000, 2`, expectedOutput: `68.0`, isHidden: false },
      { input: `50000000, 1`, expectedOutput: `17.0`, isHidden: false }
    ],
    hints: ["Convert daily photo count * avgPhotoMB * 365 to PB (divide by 1024^3)."]
  },
  {
    id: "sd-tier4i-011",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Facebook News Feed",
    title: "Design Facebook News Feed",
    slug: "design-facebook-news-feed",
    difficulty: "Hard",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-interview", "system-design", "news-feed", "ranking", "Scalability"],
    xpReward: 200,
    description: `## Problem Statement
Design Facebook's News Feed system: an algorithmically ranked, continuously updating stream of posts, photos, and status updates from friends and followed pages.

### Functional Requirements
- Publish posts containing text, media, and links.
- View personalized news feed containing top-ranked stories from friends.
- Support infinite scroll pagination.
- Real-time updates when new high-priority stories are published.

### Non-Functional Requirements
- **Low Latency**: Feed rendering in under 200ms.
- **High Concurrency**: 2 billion daily active users refreshing feeds multiple times a day.
- **Scalable Ranking**: Complex ML feature scoring applied without blocking user threads.

### High-Level Architecture
- Feed Generation Pipeline (Offline ML ranking) + Feed Retrieval Service (Online real-time assembly).
- Hybrid Push/Pull distribution: Friends' posts pre-computed into Redis feed caches; ranking models re-sort candidate posts on read.
- Social Graph Store (TAO - Facebook's distributed graph store for edges and nodes).`,
    starterCode: {
      javascript: `function mergeRankedFeeds(feedA, feedB, limit) {
  const merged = [...feedA, ...feedB].sort((a, b) => b.score - a.score);
  return merged.slice(0, limit);
}`,
      python: `def merge_ranked_feeds(feed_a, feed_b, limit):
    merged = sorted(feed_a + feed_b, key=lambda x: x.get("score", 0), reverse=True)
    return merged[:limit]`
    },
    testCases: [
      { input: `[{"id": 1, "score": 90}], [{"id": 2, "score": 95}, {"id": 3, "score": 80}], 2`, expectedOutput: `[{"id":2,"score":95},{"id":1,"score":90}]`, isHidden: false }
    ],
    hints: ["Combine feeds, sort descending by score, and slice to limit."]
  },
  {
    id: "sd-tier4i-012",
    tier: 4,
    section: "Interview Prep",
    topic: "Design LinkedIn",
    title: "Design LinkedIn",
    slug: "design-linkedin",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "linkedin", "graph", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design a professional networking platform like LinkedIn featuring member connections, connection degree distance (1st, 2nd, 3rd degree), and professional feed updates.

### Functional Requirements
- Connect with other professional members.
- Calculate and display connection degree (1st: direct connection, 2nd: friend of friend, 3rd: extended).
- Search people by company, school, and skills.
- Professional feed with post interactions.

### Non-Functional Requirements
- **Fast Degree Traversal**: 1st/2nd degree lookups in under 50ms.
- **Graph Scalability**: Graph holding 900M members and billions of bidirectional relationship edges.

### Graph Architecture
- In-memory distributed graph service (e.g. LinkedIn's Espresso/Galene/Graph databases).
- Bi-directional BFS search for finding shortest path and mutual connections between two users.
- Cache user connection lists in Redis for immediate 1st-degree filtering.`,
    starterCode: {
      javascript: `function findMutualConnections(connectionsA, connectionsB) {
  const setB = new Set(connectionsB);
  return connectionsA.filter(c => setB.has(c));
}`,
      python: `def find_mutual_connections(connections_a, connections_b):
    set_b = set(connections_b)
    return [c for c in connections_a if c in set_b]`
    },
    testCases: [
      { input: `["alice", "bob", "carol"], ["bob", "carol", "dave"]`, expectedOutput: `["bob","carol"]`, isHidden: false },
      { input: `["a"], ["b"]`, expectedOutput: `[]`, isHidden: false }
    ],
    hints: ["Intersect the two connection arrays using a Set lookup."]
  },
  {
    id: "sd-tier4i-013",
    tier: 4,
    section: "Interview Prep",
    topic: "Design YouTube",
    title: "Design YouTube",
    slug: "design-youtube",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "youtube", "video-streaming", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design a global video streaming platform like YouTube or Vimeo supporting video uploads, multi-format transcoding, adaptive bitrate streaming, and video search.

### Functional Requirements
- Upload videos of arbitrary formats and resolutions up to 4K.
- Transcode videos into multiple resolutions (1080p, 720p, 480p, 360p) and chunk formats (HLS, DASH).
- Adaptive bitrate streaming: Video player automatically adjusts quality based on user network speed.
- View count, likes, and comment streams.

### Non-Functional Requirements
- **Low Playback Buffering**: Sub-second initial video start time.
- **High Video Durability**: Uploaded media must never be corrupted.
- **Massive Storage**: 500 hours of video uploaded every minute.

### Video Transcoding Pipeline
- User uploads raw video to Blob storage via pre-signed URL.
- File upload event triggers video splitting into 2-5 second chunks.
- Asynchronous DAG worker cluster (e.g. FFmpeg workers) transcodes chunks into multiple bitrates in parallel.
- Chunks stored in object storage and served via globally distributed CDN edge nodes.`,
    starterCode: {
      javascript: `function calculateTranscodingTasks(resolutions, codecs) {
  return resolutions.length * codecs.length;
}`,
      python: `def calculate_transcoding_tasks(resolutions, codecs):
    return len(resolutions) * len(codecs)`
    },
    testCases: [
      { input: `["1080p", "720p", "480p"], ["h264", "h265"]`, expectedOutput: `6`, isHidden: false },
      { input: `["4k", "1080p"], ["av1"]`, expectedOutput: `2`, isHidden: false }
    ],
    hints: ["Multiply count of resolutions by count of codec formats."]
  },
  {
    id: "sd-tier4i-014",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Netflix",
    title: "Design Netflix",
    slug: "design-netflix",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "netflix", "cdn", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design an on-demand video subscription platform like Netflix featuring high-bandwidth global video streaming, personalized recommendation engines, and custom Open Connect CDN architecture.

### Functional Requirements
- Browse movie/series catalog and stream video content in 4K/HDR.
- Resume playback seamlessly across mobile, TV, and web devices.
- User profile management under a single household subscription.
- Offline downloads for mobile clients.

### Non-Functional Requirements
- **Ultra-High Availability**: 99.999% streaming availability.
- **Global Bandwidth**: Deliver up to 15% of total worldwide internet downstream traffic.
- **Zero Buffering**: Instant video start and smooth adaptive bitrate adjustment.

### Architecture Highlights
- Control Plane on AWS (catalog, auth, billing, recommendation engine).
- Data Plane on Netflix Open Connect: Custom hardware appliances (OCAs) deployed directly inside Internet Service Provider (ISP) networks worldwide.
- Proactive caching: Predictively pre-populate popular movies onto ISP edge appliances overnight.`,
    starterCode: {
      javascript: `function calculateVideoChunkCount(durationMinutes, chunkDurationSec) {
  const totalSeconds = durationMinutes * 60;
  return Math.ceil(totalSeconds / chunkDurationSec);
}`,
      python: `import math

def calculate_video_chunk_count(duration_minutes, chunk_duration_sec):
    total_seconds = duration_minutes * 60
    return math.ceil(total_seconds / chunk_duration_sec)`
    },
    testCases: [
      { input: `120, 5`, expectedOutput: `1440`, isHidden: false },
      { input: `45, 10`, expectedOutput: `270`, isHidden: false }
    ],
    hints: ["Convert duration to seconds and divide by chunk duration."]
  },
  {
    id: "sd-tier4i-015",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Spotify",
    title: "Design Spotify",
    slug: "design-spotify",
    difficulty: "Medium",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "spotify", "audio", "Distributed Storage"],
    xpReward: 150,
    description: `## Problem Statement
Design a digital music streaming service like Spotify supporting millions of tracks, playlist management, audio caching, and real-time collaborative listening sessions.

### Functional Requirements
- Search and stream high-quality audio tracks.
- Create, edit, and share collaborative playlists.
- Offline audio playback on mobile devices with encrypted DRM storage.
- Real-time playlist synchronization across multiple listeners.

### Non-Functional Requirements
- **Instant Playback**: Audio playback starts in < 150ms.
- **Audio Quality**: Seamless bitrate adaptation (96kbps to 320kbps Ogg Vorbis/AAC).
- **High Concurrency**: 500 million active listeners streaming concurrently.

### Architecture Highlights
- Audio CDN: Cache popular songs at edge locations and client device local caches.
- Playlist Storage: Document store with version vectors for conflict-free collaborative editing.
- Recommendation Service: Collaborative filtering and audio feature vectors computed asynchronously.`,
    starterCode: {
      javascript: `function calculateTrackStorageMB(durationSec, bitrateKbps) {
  const totalBits = durationSec * (bitrateKbps * 1000);
  const totalBytes = totalBits / 8;
  return Math.round((totalBytes / (1024 * 1024)) * 10) / 10;
}`,
      python: `def calculate_track_storage_mb(duration_sec, bitrate_kbps):
    total_bits = duration_sec * (bitrate_kbps * 1000)
    total_bytes = total_bits / 8.0
    return round(total_bytes / (1024.0 * 1024.0), 1)`
    },
    testCases: [
      { input: `210, 320`, expectedOutput: `8.0`, isHidden: false },
      { input: `180, 128`, expectedOutput: `2.7`, isHidden: false }
    ],
    hints: ["Multiply duration by bitrate to get total bits, convert to bytes, then to MB."]
  },
  {
    id: "sd-tier4i-016",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Uber",
    title: "Design Uber",
    slug: "design-uber",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "uber", "geospatial", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design a real-time ride-hailing platform like Uber or Lyft connecting riders with nearby drivers, matching locations, updating real-time GPS locations, and computing dynamic pricing.

### Functional Requirements
- Riders request rides and match with nearby available drivers.
- Drivers stream real-time GPS location updates every 3-5 seconds.
- Calculate trip routes, ETA, and dynamic surge pricing.
- Real-time driver vehicle tracking on rider map view.

### Non-Functional Requirements
- **Low Latency**: Location updates propagated in < 1 second.
- **High Availability**: Service must remain available during city-wide surge events.
- **Strict Geospatial Accuracy**: Ride matching must accurately locate drivers within a small radius.

### Geospatial Indexing
- Geohashing or Uber H3 (Hexagonal hierarchical spatial index) to partition earth coordinates.
- Driver Location Service: In-memory store (Redis Geospatial / memory grid) storing driver locations indexed by H3 hex cell.
- Ride Matching Engine: Queries adjacent H3 cells (k-ring search) to identify available drivers within 2km radius.`,
    starterCode: {
      javascript: `function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}`,
      python: `import math

def calculate_haversine_distance_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)`
    },
    testCases: [
      { input: `40.7128, -74.0060, 40.7306, -73.9352`, expectedOutput: `6.3`, isHidden: false },
      { input: `0, 0, 0, 1`, expectedOutput: `111.2`, isHidden: false }
    ],
    hints: ["Use Haversine formula to compute great-circle distance between two GPS coordinates."]
  },
  {
    id: "sd-tier4i-017",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Google Maps",
    title: "Design Google Maps",
    slug: "design-google-maps",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "google-maps", "geospatial", "routing", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design a planetary-scale mapping and turn-by-turn navigation system like Google Maps supporting map rendering, geocoding, shortest-path navigation, and live traffic updates.

### Functional Requirements
- Render interactive map tiles across 20+ zoom levels.
- Forward and reverse geocoding (address to coordinates and vice-versa).
- Calculate optimal navigation routes for driving, walking, and transit.
- Adjust routes dynamically based on real-time traffic conditions.

### Non-Functional Requirements
- **High Availability**: 99.999% uptime globally.
- **Fast Tile Rendering**: Map tiles loaded in < 20ms via global CDN edge caches.
- **Navigation Latency**: Route computation in < 500ms.

### Architecture Breakdown
- Map Tile Service: Pre-rendered vector and raster map tiles stored hierarchically in Quadtrees or Slippy Map tile coordinates \`(zoom, x, y)\`.
- Routing Engine: Road networks represented as weighted directed graphs; optimized with Contraction Hierarchies and A* search algorithms.
- Live Traffic Engine: Ingests real-time velocity reports from mobile devices, dynamically updating road graph edge weights.`,
    starterCode: {
      javascript: `function calculateTotalTilesAtZoom(zoomLevel) {
  return Math.pow(4, zoomLevel);
}`,
      python: `def calculate_total_tiles_at_zoom(zoom_level):
    return 4 ** zoom_level`
    },
    testCases: [
      { input: `0`, expectedOutput: `1`, isHidden: false },
      { input: `2`, expectedOutput: `16`, isHidden: false },
      { input: `3`, expectedOutput: `64`, isHidden: true }
    ],
    hints: ["In a quadtree slippy map, each zoom level multiplies total tiles by 4 (4^zoom)."]
  },
  {
    id: "sd-tier4i-018",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Food Delivery System",
    title: "Design Food Delivery System",
    slug: "design-food-delivery-system",
    difficulty: "Medium",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "doordash", "food-delivery", "Distributed Systems"],
    xpReward: 150,
    description: `## Problem Statement
Design an on-demand three-sided marketplace platform like DoorDash or Uber Eats coordinating restaurants, customers, and delivery couriers.

### Functional Requirements
- Customers browse nearby restaurants, menus, and place food orders.
- Restaurants receive orders, accept/reject, and update cooking status.
- Couriers receive delivery dispatches, accept routes, and update delivery status.
- Real-time order tracking and ETA calculation.

### Non-Functional Requirements
- **High Availability**: Zero missed orders during dinner rush peak traffic.
- **Consistency**: Prevent phantom orders; inventory and payments must stay strictly synchronized.
- **Low Latency**: Location updates streamed to customer in real-time (< 2s).

### State Machine Architecture
- Order State Machine: Created -> Paid -> Accepted -> In-Kitchen -> Ready -> PickedUp -> Delivered.
- Delivery Dispatch Engine: Optimizes courier-restaurant matching using bipartite graph matching (Hungarian algorithm).`,
    starterCode: {
      javascript: `function isValidOrderTransition(currentState, nextState) {
  const transitions = {
    "CREATED": ["PAID", "CANCELLED"],
    "PAID": ["ACCEPTED", "REFUNDED"],
    "ACCEPTED": ["COOKING", "CANCELLED"],
    "COOKING": ["READY"],
    "READY": ["PICKED_UP"],
    "PICKED_UP": ["DELIVERED"]
  };
  return (transitions[currentState] || []).includes(nextState);
}`,
      python: `def is_valid_order_transition(current_state, next_state):
    transitions = {
        "CREATED": ["PAID", "CANCELLED"],
        "PAID": ["ACCEPTED", "REFUNDED"],
        "ACCEPTED": ["COOKING", "CANCELLED"],
        "COOKING": ["READY"],
        "READY": ["PICKED_UP"],
        "PICKED_UP": ["DELIVERED"]
    }
    return next_state in transitions.get(current_state, [])`
    },
    testCases: [
      { input: `"CREATED", "PAID"`, expectedOutput: `true`, isHidden: false },
      { input: `"CREATED", "DELIVERED"`, expectedOutput: `"false"`, isHidden: false }
    ],
    hints: ["Verify if nextState is an allowed transition from currentState in the order state machine."]
  },
  {
    id: "sd-tier4i-019",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Ride Sharing System",
    title: "Design Ride Sharing System",
    slug: "design-ride-sharing-system",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "rideshare", "geospatial", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design an advanced ride-sharing matching engine supporting pooled rides (UberPool / Lyft Line), dynamic route detour optimization, and real-time trip splitting.

### Functional Requirements
- Match multiple riders traveling along overlapping trajectories into a single pooled ride.
- Enforce detour constraints (e.g. detour must not increase any passenger's trip time by > 20%).
- Dynamically calculate split fares based on shared route mileage.
- Re-route driver seamlessly when a new matched rider joins mid-trip.

### Non-Functional Requirements
- **Matching Latency**: Pool match computed within a 30-second batch window.
- **Route Optimization**: Efficient calculation of pickup and dropoff permutations.

### Algorithm & Architecture
- Spatio-temporal batching: Buffer ride requests in 10-30s windows within geographic clusters.
- Route Permutation Solver: Evaluate feasible sequences of pickups (P1, P2) and dropoffs (D1, D2) minimizing total delay.`,
    starterCode: {
      javascript: `function isDetourAcceptable(directMinutes, detourMinutes, maxDetourPercent) {
  const allowed = directMinutes * (1 + maxDetourPercent / 100);
  return detourMinutes <= allowed;
}`,
      python: `def is_detour_acceptable(direct_minutes, detour_minutes, max_detour_percent):
    allowed = direct_minutes * (1 + max_detour_percent / 100.0)
    return detour_minutes <= allowed`
    },
    testCases: [
      { input: `20, 23, 20`, expectedOutput: `true`, isHidden: false },
      { input: `20, 26, 20`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if detourMinutes <= directMinutes * (1 + maxDetourPercent / 100)."]
  },
  {
    id: "sd-tier4i-020",
    tier: 4,
    section: "Interview Prep",
    topic: "Design E-commerce Platform",
    title: "Design E-commerce Platform",
    slug: "design-ecommerce-platform",
    difficulty: "Medium",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-interview", "system-design", "ecommerce", "cart", "Database Design"],
    xpReward: 150,
    description: `## Problem Statement
Design a high-scale e-commerce platform supporting product catalogs, search, shopping carts, checkout, and inventory decrementing.

### Functional Requirements
- Browse and search product catalogs with category hierarchy and filters.
- Shopping cart management with item persistence across sessions.
- Checkout workflow: order creation, payment capture, and inventory reservation.
- Order history tracking and status notifications.

### Non-Functional Requirements
- **Consistency**: Strict consistency for inventory; never sell items out of stock (no overselling).
- **High Availability**: Browsing and search available 99.99%.
- **Flash Sale Resilience**: Handle 100x traffic spikes during promotional events.

### Architecture Highlights
- Product Catalog: Cached in Redis, persisted in Document/RDBMS database.
- Cart Service: Stored in Redis Hashes with TTL for anonymous users; synced to DB on login.
- Inventory Service: Row-level atomic decrement \`UPDATE inventory SET stock = stock - 1 WHERE id = ? AND stock > 0\` or Redis Lua script.`,
    starterCode: {
      javascript: `function decrementInventory(currentStock, quantity) {
  if (currentStock >= quantity) {
    return { success: true, remaining: currentStock - quantity };
  }
  return { success: false, remaining: currentStock };
}`,
      python: `def decrement_inventory(current_stock, quantity):
    if current_stock >= quantity:
        return {"success": True, "remaining": current_stock - quantity}
    return {"success": False, "remaining": current_stock}`
    },
    testCases: [
      { input: `10, 2`, expectedOutput: `{"success":true,"remaining":8}`, isHidden: false },
      { input: `1, 2`, expectedOutput: `{"success":false,"remaining":1}`, isHidden: false }
    ],
    hints: ["Only allow decrement if currentStock >= requested quantity."]
  },
  {
    id: "sd-tier4i-021",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Amazon",
    title: "Design Amazon",
    slug: "design-amazon",
    difficulty: "Hard",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-interview", "system-design", "amazon", "prime", "Scalability"],
    xpReward: 200,
    description: `## Problem Statement
Design Amazon's global e-commerce retail architecture supporting Prime Day flash sales, personalized recommendation carousels, distributed warehouse fulfillment, and order pipelines.

### Functional Requirements
- Global product catalog with millions of active items.
- Cart and 1-Click Buy checkout with payment processing.
- Warehouse fulfillment routing: select the optimal fulfillment center holding stock closest to the customer.
- Personalized recommendation engine ("Customers who bought this also bought...").

### Non-Functional Requirements
- **Massive Concurrency**: Hundreds of thousands of concurrent checkout operations during flash sales.
- **Fault Isolation**: Checkout must remain online even if recommendation or review services crash.
- **Data Durability**: Zero lost orders under any failure condition.

### Distributed Systems Architecture
- Cell-Based Architecture: Partition independent production units (cells) to strictly bound the blast radius of outages.
- Asynchronous Order Pipeline: Ingest orders into distributed message streaming queues (SQS/Kafka) for asynchronous warehouse dispatch.
- Saga Pattern for Order Orchestration: Payment, Inventory, Fulfillment, and Shipping coordinated with compensation steps.`,
    starterCode: {
      javascript: `function selectFulfillmentCenter(customerLocation, warehouses) {
  let best = null;
  let minDistance = Infinity;
  for (const w of warehouses) {
    if (w.hasStock) {
      const dist = Math.hypot(w.x - customerLocation.x, w.y - customerLocation.y);
      if (dist < minDistance) {
        minDistance = dist;
        best = w.id;
      }
    }
  }
  return best;
}`,
      python: `import math

def select_fulfillment_center(customer_location, warehouses):
    best = None
    min_dist = float('inf')
    for w in warehouses:
        if w.get("hasStock"):
            dist = math.hypot(w["x"] - customer_location["x"], w["y"] - customer_location["y"])
            if dist < min_dist:
                min_dist = dist
                best = w["id"]
    return best`
    },
    testCases: [
      { input: `{"x": 10, "y": 10}, [{"id": "w1", "x": 12, "y": 12, "hasStock": true}, {"id": "w2", "x": 100, "y": 100, "hasStock": true}]`, expectedOutput: `"w1"`, isHidden: false },
      { input: `{"x": 10, "y": 10}, [{"id": "w1", "x": 11, "y": 11, "hasStock": false}, {"id": "w2", "x": 20, "y": 20, "hasStock": true}]`, expectedOutput: `"w2"`, isHidden: false }
    ],
    hints: ["Filter warehouses that have stock and find the one with minimal Euclidean distance."]
  },
  {
    id: "sd-tier4i-022",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Payment System",
    title: "Design Payment System",
    slug: "design-payment-system",
    difficulty: "Hard",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-interview", "system-design", "payments", "stripe", "double-entry", "Consistency"],
    xpReward: 200,
    description: `## Problem Statement
Design a mission-critical Payment System (like Stripe or Adyen) executing financial transactions with third-party payment gateways, idempotency guarantees, and double-entry ledger bookkeeping.

### Functional Requirements
- Process payments via credit cards, bank accounts, and digital wallets.
- Guarantee exactly-once payment processing (never double charge a customer).
- Maintain immutable double-entry ledger tracking all debits and credits.
- Support refunds, chargebacks, and partial captures.
- Daily financial reconciliation against bank clearing files.

### Non-Functional Requirements
- **High Consistency & Correctness**: Zero tolerance for data loss or incorrect financial balances.
- **PCI-DSS Compliance**: Cardholder data isolated in a tokenized vault.
- **Auditability**: Complete immutable audit trail of every transaction mutation.

### Core Payment Architecture
- **Idempotency Layer**: Validate Idempotency Key before processing payment requests.
- **Payment Orchestrator**: Manages state transitions and coordinates third-party payment gateways with retry mechanisms.
- **Double-Entry Ledger**: Every transaction consists of balanced credit and debit entries (\`SUM(debits) - SUM(credits) = 0\`).
- **Reconciliation Engine**: Asynchronous reconciliation comparing internal ledger records against external bank transaction logs.`,
    starterCode: {
      javascript: `function verifyDoubleEntryBalance(entries) {
  let balance = 0;
  for (const e of entries) {
    if (e.type === "DEBIT") balance += e.amount;
    else if (e.type === "CREDIT") balance -= e.amount;
  }
  return balance === 0;
}`,
      python: `def verify_double_entry_balance(entries):
    balance = 0
    for e in entries:
        if e.get("type") == "DEBIT":
            balance += e.get("amount", 0)
        elif e.get("type") == "CREDIT":
            balance -= e.get("amount", 0)
    return balance == 0`
    },
    testCases: [
      { input: `[{"type": "DEBIT", "amount": 100}, {"type": "CREDIT", "amount": 100}]`, expectedOutput: `true`, isHidden: false },
      { input: `[{"type": "DEBIT", "amount": 100}, {"type": "CREDIT", "amount": 50}]`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["In double-entry bookkeeping, total debits must equal total credits (net balance = 0)."]
  },
  {
    id: "sd-tier4i-023",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Ticket Booking System",
    title: "Design Ticket Booking System",
    slug: "design-ticket-booking-system",
    difficulty: "Hard",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-interview", "system-design", "ticketing", "concurrency", "lock", "Consistency"],
    xpReward: 200,
    description: `## Problem Statement
Design an online event ticket booking system like Ticketmaster supporting high-concurrency ticket drops (e.g. Taylor Swift concerts), seat selection, temporary seat holds, and anti-scalping.

### Functional Requirements
- Browse venues, events, seat layouts, and real-time seat availability.
- Select seats and place a temporary hold (e.g. 10-minute reservation) during checkout.
- Complete payment to confirm ticket booking.
- Release held seats automatically back to inventory if checkout expires.

### Non-Functional Requirements
- **Strict Consistency**: No double-booking of seats under any circumstance.
- **Spike Resilience**: Handle 100,000 users attempting to reserve the same 10,000 seats at the exact same second.
- **Fairness**: Virtual waiting room / queue during peak demand drops.

### Architecture Highlights
- Virtual Waiting Room: Gate traffic during ticket drops using Cloudflare Waiting Room or Redis queue tokens.
- Distributed Lock / Reservation: Temporary seat hold via Redis with 10-minute TTL or distributed database lock with timestamp.
- Relational Database with optimistic concurrency control (\`UPDATE seats SET status = 'SOLD' WHERE id = ? AND version = ?\`).`,
    starterCode: {
      javascript: `function reserveSeatWithHold(seatMap, seatId, userId, holdDurationSec) {
  if (seatMap[seatId] && seatMap[seatId].status === "BOOKED") {
    return { success: false, reason: "already_booked" };
  }
  if (seatMap[seatId] && seatMap[seatId].status === "HELD") {
    return { success: false, reason: "already_held" };
  }
  seatMap[seatId] = { status: "HELD", heldBy: userId, duration: holdDurationSec };
  return { success: true, reason: "held" };
}`,
      python: `def reserve_seat_with_hold(seat_map, seat_id, user_id, hold_duration_sec):
    if seat_id in seat_map and seat_map[seat_id].get("status") == "BOOKED":
        return {"success": False, "reason": "already_booked"}
    if seat_id in seat_map and seat_map[seat_id].get("status") == "HELD":
        return {"success": False, "reason": "already_held"}
    seat_map[seat_id] = {"status": "HELD", "heldBy": user_id, "duration": hold_duration_sec}
    return {"success": True, "reason": "held"}`
    },
    testCases: [
      { input: `{}, "seat_A1", "user_10", 600`, expectedOutput: `{"success":true,"reason":"held"}`, isHidden: false },
      { input: `{"seat_A1": {"status": "HELD"}}, "seat_A1", "user_20", 600`, expectedOutput: `{"success":false,"reason":"already_held"}`, isHidden: false }
    ],
    hints: ["Check if seat is BOOKED or HELD. If available, mark as HELD with expiration."]
  },
  {
    id: "sd-tier4i-024",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Hotel Booking System",
    title: "Design Hotel Booking System",
    slug: "design-hotel-booking-system",
    difficulty: "Medium",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-interview", "system-design", "hotel-booking", "reservations", "Database Design"],
    xpReward: 150,
    description: `## Problem Statement
Design a hotel reservation platform like Booking.com or Airbnb supporting room inventory search across date ranges, room type reservations, and overbooking prevention.

### Functional Requirements
- Search hotels by city, check-in date, check-out date, and guest count.
- View hotel details, room types, photos, and live room rates.
- Reserve rooms across a date range.
- Cancellation and refund management based on hotel policy.

### Non-Functional Requirements
- **Consistency**: Room inventory must strictly reflect real availability without overbooking.
- **High Read Scale**: Search queries outnumber reservation bookings by 1000:1.
- **Search Performance**: Room search results returned in < 300ms.

### Inventory Data Modeling
- Model inventory per room type per day: \`hotel_inventory(hotel_id, room_type_id, date, available_count, price)\`.
- Booking a date range requires atomic reservation across all dates in the range:
  \`UPDATE hotel_inventory SET available_count = available_count - 1 WHERE hotel_id = ? AND date BETWEEN ? AND ? AND available_count > 0\`.`,
    starterCode: {
      javascript: `function checkDateRangeAvailability(inventoryDays, requiredDays) {
  return requiredDays.every(d => (inventoryDays[d] || 0) > 0);
}`,
      python: `def check_date_range_availability(inventory_days, required_days):
    return all(inventory_days.get(d, 0) > 0 for d in required_days)`
    },
    testCases: [
      { input: `{"2026-10-01": 2, "2026-10-02": 1}, ["2026-10-01", "2026-10-02"]`, expectedOutput: `true`, isHidden: false },
      { input: `{"2026-10-01": 2, "2026-10-02": 0}, ["2026-10-01", "2026-10-02"]`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Verify that available_count > 0 for every single day in requiredDays."]
  },
  {
    id: "sd-tier4i-025",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Flight Booking System",
    title: "Design Flight Booking System",
    slug: "design-flight-booking-system",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "flight-booking", "gds", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design an airline flight booking engine and aggregation platform (like Skyscanner or Kayak) interfacing with global distribution systems (Amadeus, Sabre) and airline reservation systems.

### Functional Requirements
- Search flights across airlines by departure city, arrival city, date, and passenger count.
- Multi-leg connecting flight itinerary generation.
- Seat selection, ticket purchase, and PNR (Passenger Name Record) generation.
- Real-time flight status and schedule update tracking.

### Non-Functional Requirements
- **Aggregation Latency**: Aggregate search results across 20+ airline APIs in parallel within 2-3 seconds.
- **Consistency**: Strict zero over-booking for confirmed ticket reservations.
- **Caching**: Intelligent caching of route availability to reduce costly GDS query fees.

### Architecture Highlights
- Scatter-Gather Search Aggregator: Fan out queries to external airline APIs asynchronously with strict timeout budgets.
- Route Graph Engine: Pre-compute connecting flight graphs using Dijkstra's shortest path algorithm.
- Saga Orchestrator: Coordinate payment capture and airline PNR ticket issuance with compensation logic.`,
    starterCode: {
      javascript: `function aggregateFlightPrices(airlineResponses) {
  return airlineResponses.filter(r => r.available).sort((a, b) => a.price - b.price);
}`,
      python: `def aggregate_flight_prices(airline_responses):
    available = [r for r in airline_responses if r.get("available")]
    return sorted(available, key=lambda x: x.get("price", 0))`
    },
    testCases: [
      { input: `[{"airline": "AirA", "price": 300, "available": true}, {"airline": "AirB", "price": 250, "available": true}, {"airline": "AirC", "price": 200, "available": false}]`, expectedOutput: `[{"airline":"AirB","price":250,"available":true},{"airline":"AirA","price":300,"available":true}]`, isHidden: false }
    ],
    hints: ["Filter out unavailable flights and sort available flights ascending by price."]
  },
  {
    id: "sd-tier4i-026",
    tier: 4,
    section: "Interview Prep",
    topic: "Design File Storage System",
    title: "Design File Storage System",
    slug: "design-file-storage-system",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "file-storage", "chunking", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design a distributed file storage and retrieval system like Amazon S3 or Google Cloud Storage supporting petabyte scale, multipart uploads, and high durability.

### Functional Requirements
- Upload, download, and delete files (objects) of arbitrary sizes (1 byte to 5TB).
- Bucket and key namespace hierarchy.
- Versioning: retain multiple versions of an object.
- Metadata querying (file size, MIME type, ETag, last modified).

### Non-Functional Requirements
- **High Durability**: 99.999999999% (11 9s) durability of objects.
- **High Availability**: 99.99% availability.
- **High Throughput**: Multi-gigabyte per second sequential throughput.

### Architecture Highlights
- Data Plane vs Control Plane separation.
- Chunking & Deduplication: Large files split into 4MB chunks; chunk hashes stored in metadata database.
- Erasure Coding (e.g. Reed-Solomon 8+4): Reconstruct original data from any 8 of 12 chunks, tolerating simultaneous loss of 4 disks/racks with only 50% storage overhead (compared to 200% overhead for 3x replication).`,
    starterCode: {
      javascript: `function calculateErasureCodingStorage(dataChunks, parityChunks, originalSizeGB) {
  const totalChunks = dataChunks + parityChunks;
  const expansionFactor = totalChunks / dataChunks;
  return Math.round(originalSizeGB * expansionFactor * 10) / 10;
}`,
      python: `def calculate_erasure_coding_storage(data_chunks, parity_chunks, original_size_gb):
    total_chunks = data_chunks + parity_chunks
    expansion_factor = total_chunks / float(data_chunks)
    return round(original_size_gb * expansion_factor, 1)`
    },
    testCases: [
      { input: `8, 4, 100`, expectedOutput: `150`, isHidden: false },
      { input: `4, 2, 60`, expectedOutput: `90`, isHidden: false }
    ],
    hints: ["Expansion factor is (dataChunks + parityChunks) / dataChunks. Multiply by originalSizeGB."]
  },
  {
    id: "sd-tier4i-027",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Dropbox",
    title: "Design Dropbox",
    slug: "design-dropbox",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "dropbox", "sync", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design a cloud file synchronization service like Dropbox or Box supporting local directory sync across devices, chunk-level deduplication, delta sync, and conflict resolution.

### Functional Requirements
- Sync local folder seamlessly across multiple devices (desktop, mobile, web).
- File versioning and historical revision rollback (30-day version history).
- File sharing and permission management (view vs edit).
- Delta sync: Only upload modified chunks of a file, not the entire file.

### Non-Functional Requirements
- **Bandwidth Efficiency**: Minimize mobile and internet upload bandwidth through chunk-level delta synchronization.
- **Data Durability**: Zero file corruption.
- **Fast Sync**: Changes on Device A reflected on Device B in < 5 seconds.

### Client-Server Architecture
- Client Chunker: Splits files into 4MB blocks, calculates SHA-256 hashes.
- Metadata Database: Stores file namespaces, versions, and block hash lists.
- Block Server: Uploads only blocks whose hash does not exist in Block Store (Deduplication).
- Notification Service: Long polling or WebSockets notifying connected devices of remote folder changes.`,
    starterCode: {
      javascript: `function calculateDeltaSyncBlocks(localBlockHashes, remoteBlockHashes) {
  const remoteSet = new Set(remoteBlockHashes);
  return localBlockHashes.filter(h => !remoteSet.has(h));
}`,
      python: `def calculate_delta_sync_blocks(local_block_hashes, remote_block_hashes):
    remote_set = set(remote_block_hashes)
    return [h for h in local_block_hashes if h not in remote_set]`
    },
    testCases: [
      { input: `["hash1", "hash2_modified", "hash3"], ["hash1", "hash2_old", "hash3"]`, expectedOutput: `["hash2_modified"]`, isHidden: false },
      { input: `["h1", "h2"], ["h1", "h2"]`, expectedOutput: `[]`, isHidden: false }
    ],
    hints: ["Find local block hashes that do not exist on the remote server to upload only changed blocks."]
  },
  {
    id: "sd-tier4i-028",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Google Drive",
    title: "Design Google Drive",
    slug: "design-google-drive",
    difficulty: "Hard",
    pattern: "Distributed Storage",
    category: "system-design",
    tags: ["sd-interview", "system-design", "google-drive", "Distributed Storage"],
    xpReward: 200,
    description: `## Problem Statement
Design a collaborative cloud storage and document platform like Google Drive supporting folder hierarchies, multi-user file sharing, concurrent edits, and full-text document search.

### Functional Requirements
- Upload, download, organize files in hierarchical folder trees.
- Share files/folders with specific users or public link with granular permissions (Viewer, Commenter, Editor).
- Real-time collaborative document editing (Google Docs).
- Search files by name, type, owner, and extracted text content (OCR on images/PDFs).

### Non-Functional Requirements
- **High Concurrency**: Millions of concurrent active users.
- **Consistency**: Strong consistency for folder hierarchy tree changes; Operational Transformation (OT) or CRDTs for real-time document editing.
- **Scalability**: Petabytes of files added daily.

### Component Breakdown
- Folder Hierarchy Service: Stored in relational or graph database to handle recursive tree permission inheritance.
- Collaborative Editing Engine: Operational Transformation (OT) server serializing concurrent text character insertions and deletions.
- Search Indexer: Background pipeline extracting text and updating Elasticsearch / Google Search index.`,
    starterCode: {
      javascript: `function checkUserFileAccess(filePermissions, userId, requiredRole) {
  const roleHierarchy = { "viewer": 1, "commenter": 2, "editor": 3, "owner": 4 };
  const userRole = filePermissions[userId] || "none";
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  return userLevel >= requiredLevel;
}`,
      python: `def check_user_file_access(file_permissions, user_id, required_role):
    hierarchy = {"viewer": 1, "commenter": 2, "editor": 3, "owner": 4}
    user_role = file_permissions.get(user_id, "none")
    return hierarchy.get(user_role, 0) >= hierarchy.get(required_role, 0)`
    },
    testCases: [
      { input: `{"u1": "editor", "u2": "viewer"}, "u1", "viewer"`, expectedOutput: `true`, isHidden: false },
      { input: `{"u1": "editor", "u2": "viewer"}, "u2", "editor"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if user's role level is greater than or equal to required role level."]
  },
  {
    id: "sd-tier4i-029",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Search Autocomplete",
    title: "Design Search Autocomplete",
    slug: "design-search-autocomplete",
    difficulty: "Hard",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-interview", "system-design", "autocomplete", "trie", "Scalability"],
    xpReward: 200,
    description: `## Problem Statement
Design a real-time typeahead search autocomplete system (like Google Search Autocomplete) returning the top 5-10 most popular queries matching a user's prefix within 20 milliseconds.

### Functional Requirements
- Given a search prefix (e.g. "sys"), return top 5 most frequently searched suggestions in real time.
- Update query frequencies in near real-time based on trending search traffic.
- Filter offensive and illegal search terms.

### Non-Functional Requirements
- **Ultra-Low Latency**: Return suggestions in < 20ms (keystrokes happen every ~100ms).
- **High Concurrency**: 50,000 queries per second.
- **Scalability**: Hold millions of unique query phrases.

### Core Data Structure: Trie (Prefix Tree)
- Store queries in a Trie where each node represents a character.
- **Optimization**: Pre-compute and store the top 5 suggestions directly at every Trie node to avoid runtime subtree traversals.
- Partition Trie by prefix range (e.g. a-m on server 1, n-z on server 2).
- Offline Data Pipeline: MapReduce / Spark job aggregates daily search logs, updates frequencies, and rebuilds Trie weekly.
- Client-Side Optimization: Debounce keystrokes (50ms) and cache recent prefixes in browser local storage.`,
    starterCode: {
      javascript: `function getPrefixSuggestions(trieData, prefix) {
  return (trieData[prefix.toLowerCase()] || []).slice(0, 5);
}`,
      python: `def get_prefix_suggestions(trie_data, prefix):
    return trie_data.get(prefix.lower(), [])[:5]`
    },
    testCases: [
      { input: `{"sys": ["system design", "systemctl", "sysadmin", "system of a down", "systems", "syslog"]}, "sys"`, expectedOutput: `["system design","systemctl","sysadmin","system of a down","systems"]`, isHidden: false },
      { input: `{"dev": ["developer", "devops"]}, "dev"`, expectedOutput: `["developer","devops"]`, isHidden: false }
    ],
    hints: ["Lookup prefix in precomputed dictionary and slice top 5 results."]
  },
  {
    id: "sd-tier4i-030",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Web Crawler",
    title: "Design Web Crawler",
    slug: "design-web-crawler",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "crawler", "bfs", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design a distributed Web Crawler (like Googlebot) capable of discovering and indexing 1 billion web pages per month while respecting politeness policies and avoiding duplicate crawling.

### Functional Requirements
- Given a seed list of URLs, recursively crawl pages, extract links, and index content.
- Respect \`robots.txt\` rules and disallow paths.
- Enforce Politeness: do not overwhelm target web servers with concurrent requests.
- Detect and avoid duplicate URLs and circular redirect loops.

### Non-Functional Requirements
- **Scalability**: Crawl 1 billion pages / month (~400 pages / second).
- **Robustness**: Handle malformed HTML, unresponsive web servers, infinite traps, and spider traps.
- **Extensibility**: Support multiple scrapers (images, text, video).

### Architecture Highlights
- Frontier (URL Queue): Priority queue (PageRank score) + Politeness queue (one queue per host domain with delay timers).
- HTML Fetcher & DNS Resolver: Asynchronous DNS caching and HTTP clients.
- Dedup Filter: Bloom Filter checking if URL has already been visited before adding to Frontier.
- Document Deduplication: SimHash / MinHash to detect duplicate web content under different URLs.`,
    starterCode: {
      javascript: `function isAllowedByRobots(disallowedPrefixes, path) {
  return !disallowedPrefixes.some(prefix => path.startsWith(prefix));
}`,
      python: `def is_allowed_by_robots(disallowed_prefixes, path):
    return not any(path.startswith(p) for p in disallowed_prefixes)`
    },
    testCases: [
      { input: `["/admin", "/private"], "/public/home"`, expectedOutput: `true`, isHidden: false },
      { input: `["/admin", "/private"], "/admin/dashboard"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Return false if path starts with any disallowed prefix from robots.txt."]
  },
  {
    id: "sd-tier4i-031",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Search Engine",
    title: "Design Search Engine",
    slug: "design-search-engine",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "search-engine", "inverted-index", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design a distributed Search Engine like Google or Bing supporting document indexing, boolean keyword queries, and PageRank relevance scoring.

### Functional Requirements
- Ingest and index billions of web documents.
- Process multi-term search queries (e.g. "distributed systems consistency").
- Return top 10 relevant documents sorted by relevance score within 100ms.
- Support phrase search and spell correction.

### Non-Functional Requirements
- **Ultra-Low Latency**: Search results returned in < 100ms.
- **Scalability**: Index tens of billions of web documents (hundreds of terabytes).
- **Freshness**: New high-priority documents indexed within minutes.

### Inverted Index Architecture
- Tokenization, Stemming, and Stop-Word Removal.
- Inverted Index: Maps each term to a Postings List: \`term -> [(docId, termFrequency, positions), ...]\`.
- Sharding the Inverted Index: Term-Partitioning vs Document-Partitioning (Document-partitioning is preferred to parallelize query searches across all shards).
- Scatter-Gather Query Coordinator: Broadcasts query to all document shards, collects top 10 results from each, and merges.`,
    starterCode: {
      javascript: `function intersectPostingsLists(listA, listB) {
  const setB = new Set(listB);
  return listA.filter(docId => setB.has(docId));
}`,
      python: `def intersect_postings_lists(list_a, list_b):
    set_b = set(list_b)
    return [doc_id for doc_id in list_a if doc_id in set_b]`
    },
    testCases: [
      { input: `[1, 5, 10, 25], [5, 12, 25, 30]`, expectedOutput: `[5,25]`, isHidden: false },
      { input: `[1, 2], [3, 4]`, expectedOutput: `[]`, isHidden: false }
    ],
    hints: ["Intersect the postings lists to find documents containing both search terms."]
  },
  {
    id: "sd-tier4i-032",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Distributed Cache",
    title: "Design Distributed Cache",
    slug: "design-distributed-cache",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-interview", "system-design", "cache", "lru", "Distributed Systems"],
    xpReward: 200,
    description: `## Problem Statement
Design a distributed in-memory key-value cache cluster (like Memcached or Redis Cluster) supporting sub-millisecond lookups, horizontal sharding, LRU eviction, and high availability.

### Functional Requirements
- Fast in-memory GET(key) and PUT(key, value, ttl) operations.
- Automatic Least Recently Used (LRU) memory eviction when capacity is reached.
- Configurable TTL expiration per key.
- Horizontal scaling to add/remove cache nodes dynamically.

### Non-Functional Requirements
- **Sub-Millisecond Latency**: Operations complete in < 1ms.
- **High Availability**: Replication to prevent catastrophic cold cache database stampedes on node failure.
- **Linear Scalability**: Total cache memory scales linearly with node count.

### Architecture Highlights
- Consistent Hashing with virtual nodes (vnodes) to distribute keys across cache servers.
- Doubly-Linked List + Hash Map for O(1) LRU eviction operations.
- Master-Replica replication with automatic sentinel failover.`,
    starterCode: {
      javascript: `function lruEviction(keysArray, newKey, capacity) {
  const index = keysArray.indexOf(newKey);
  if (index !== -1) {
    keysArray.splice(index, 1);
  } else if (keysArray.length >= capacity) {
    keysArray.shift(); // Evict least recently used (first element)
  }
  keysArray.push(newKey); // Add most recently used (last element)
  return keysArray;
}`,
      python: `def lru_eviction(keys_array, new_key, capacity):
    if new_key in keys_array:
        keys_array.remove(new_key)
    elif len(keys_array) >= capacity:
        keys_array.pop(0)
    keys_array.append(new_key)
    return keys_array`
    },
    testCases: [
      { input: `["k1", "k2"], "k3", 2`, expectedOutput: `["k2","k3"]`, isHidden: false },
      { input: `["k1", "k2"], "k1", 2`, expectedOutput: `["k2","k1"]`, isHidden: false }
    ],
    hints: ["Move accessed key to end of array; evict first element when length exceeds capacity."]
  },
  {
    id: "sd-tier4i-033",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Distributed Queue",
    title: "Design Distributed Queue",
    slug: "design-distributed-queue",
    difficulty: "Hard",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-interview", "system-design", "queue", "sqs", "Messaging"],
    xpReward: 200,
    description: `## Problem Statement
Design a distributed message queuing service like Amazon SQS supporting publish/subscribe, at-least-once delivery, FIFO ordering, and dead-letter queues.

### Functional Requirements
- \`SendMessage(queueUrl, messageBody, delaySec)\`
- \`ReceiveMessage(queueUrl, maxMessages, visibilityTimeoutSec)\`
- \`DeleteMessage(queueUrl, receiptHandle)\`
- Visibility Timeout: Hide received message from other consumers until timeout expires.

### Non-Functional Requirements
- **Durability**: Messages replicated across multiple storage nodes before write acknowledgment.
- **High Throughput**: Support millions of messages per second.
- **Low Latency**: Enqueue and dequeue operations in < 15ms.

### Architecture Highlights
- Frontend Gateway: Authenticates, rate limits, and routes requests to appropriate queue partition.
- Distributed Storage Backend: Write-ahead log or distributed LSM-tree database storing message states: Inactive, Visible, Flight.
- Metadata Service: Maintains queue configurations and partition ownership via ZooKeeper/etcd.`,
    starterCode: {
      javascript: `function isMessageVisible(message, currentTime) {
  return currentTime >= message.visibleAfter;
}`,
      python: `def is_message_visible(message, current_time):
    return current_time >= message.get("visibleAfter", 0)`
    },
    testCases: [
      { input: `{"id": "m1", "visibleAfter": 100}, 105`, expectedOutput: `true`, isHidden: false },
      { input: `{"id": "m1", "visibleAfter": 100}, 95`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["A message is visible to consumers only when currentTime >= visibleAfter."]
  },
  {
    id: "sd-tier4i-034",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Logging System",
    title: "Design Logging System",
    slug: "design-logging-system",
    difficulty: "Hard",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-interview", "system-design", "logging", "elk", "Observability"],
    xpReward: 200,
    description: `## Problem Statement
Design a centralized log ingestion and search platform like Datadog or ELK Stack handling terabytes of structured logs daily from thousands of microservices.

### Functional Requirements
- Ingest high-velocity log events from thousands of servers asynchronously.
- Parse and index log metadata (timestamp, service, level, traceId).
- Search logs with boolean filters and text keywords within seconds.
- Configure retention tiers (Hot, Warm, Cold) and automated archiving.

### Non-Functional Requirements
- **High Write Throughput**: Ingest 500,000 log lines per second without dropping records.
- **Fault Tolerance**: Application servers must never crash or block if the logging system experiences outages.
- **Cost Efficiency**: Economical disk storage through aggressive compression.

### Architecture Pipeline
- Host Daemon (Vector / Fluentbit) -> Ingestion Queue (Kafka) -> Log Parser/Filter (Logstash/Flink) -> Indexing Storage (Elasticsearch / ClickHouse) -> Object Storage (S3 Archive).`,
    starterCode: {
      javascript: `function calculateDailyLogStorageTB(logsPerSec, avgBytesPerLog) {
  const dailyBytes = logsPerSec * avgBytesPerLog * 86400;
  return Math.round(dailyBytes / 1e12 * 10) / 10;
}`,
      python: `def calculate_daily_log_storage_tb(logs_per_sec, avg_bytes_per_log):
    daily_bytes = logs_per_sec * avg_bytes_per_log * 86400.0
    return round(daily_bytes / 1e12, 1)`
    },
    testCases: [
      { input: `100000, 500`, expectedOutput: `4.3`, isHidden: false },
      { input: `500000, 500`, expectedOutput: `21.6`, isHidden: false }
    ],
    hints: ["Calculate logsPerSec * avgBytes * 86,400 and divide by 10^12 to get TB."]
  },
  {
    id: "sd-tier4i-035",
    tier: 4,
    section: "Interview Prep",
    topic: "Design Monitoring System",
    title: "Design Monitoring System",
    slug: "design-monitoring-system",
    difficulty: "Hard",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-interview", "system-design", "monitoring", "prometheus", "time-series", "Observability"],
    xpReward: 200,
    description: `## Problem Statement
Design a real-time metrics collection, time-series storage, and alerting platform like Prometheus or Datadog monitoring CPU, memory, and custom application metrics.

### Functional Requirements
- Ingest millions of time-series metric data points per second: \`(metric_name, tags, timestamp, value)\`.
- Execute query aggregations (rate, sum, avg, p99 percentiles) over arbitrary time windows.
- Define alert evaluation rules (e.g. alert if error rate > 5% for 3 consecutive minutes).
- Dynamic dashboard visualization.

### Non-Functional Requirements
- **High Ingestion Throughput**: Process 5M data points / second.
- **Fast Query Evaluation**: Dashboard metrics rendered in < 500ms.
- **High Availability**: Monitoring system must stay online even when production infrastructure is failing.

### Time-Series Database (TSDB) Internals
- In-memory ring buffer chunks compressed using Gorilla compression (delta-of-deltas timestamp encoding and XOR floating-point encoding).
- Downsampling: Consolidate 10-second resolution data into 1-minute and 1-hour rollups for older data retention.`,
    starterCode: {
      javascript: `function evaluateAlertRule(values, threshold, condition) {
  if (condition === "GREATER_THAN") {
    return values.every(v => v > threshold);
  }
  return values.every(v => v < threshold);
}`,
      python: `def evaluate_alert_rule(values, threshold, condition):
    if condition == "GREATER_THAN":
        return all(v > threshold for v in values)
    return all(v < threshold for v in values)`
    },
    testCases: [
      { input: `[6, 7, 8], 5, "GREATER_THAN"`, expectedOutput: `true`, isHidden: false },
      { input: `[4, 6, 7], 5, "GREATER_THAN"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Return true if all values in evaluation window breach the threshold."]
  }
];
