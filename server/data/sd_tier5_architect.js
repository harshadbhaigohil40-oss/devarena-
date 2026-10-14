/**
 * TIER 5 — ARCHITECT (40 Topics)
 * Difficulty: Hard – Advanced
 * Patterns: Global Architecture, High Availability, Reliability Engineering, Distributed Systems, Large-Scale Data, Financial Systems, Real-Time Systems, Security Architecture
 */

module.exports = [
  {
    id: "sd-tier5-001",
    tier: 5,
    section: "Architect",
    topic: "Designing for Billions of Users",
    title: "Designing for Billions of Users",
    slug: "designing-for-billions-of-users",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "architect", "scale", "Global Architecture"],
    xpReward: 300,
    description: `Master the architectural principles required to scale services to billions of active users. Understand failure as a mathematical certainty, decentralized control, and hyper-scale infrastructure.

### Learning Objectives
- Design for the "one-in-a-million" probability occurring thousands of times every minute
- Decouple all synchronous dependencies across critical user interaction flows
- Implement hierarchical federation and cellular architectures to bound blast radiuses
- Optimize packet sizes, memory footprint, and CPU instructions per request
- Balance global consistency requirements with extreme availability SLAs

### Practical Challenge
Calculate average QPS for 1 billion daily active users with 50 requests per user per day: return Math.round((dau * requestsPerUser) / 86400).`,
    starterCode: {
      javascript: `function calculateHyperScaleQPS(dau, requestsPerUser) {
  return Math.round((dau * requestsPerUser) / 86400);
}`,
      python: `def calculate_hyper_scale_qps(dau, requests_per_user):
    return round((dau * requests_per_user) / 86400)`
    },
    testCases: [
      { input: `1000000000, 50`, expectedOutput: `578704`, isHidden: false },
      { input: `2000000000, 100`, expectedOutput: `2314815`, isHidden: false }
    ],
    hints: ["Multiply DAU by requestsPerUser and divide by 86,400 seconds."]
  },
  {
    id: "sd-tier5-002",
    tier: 5,
    section: "Architect",
    topic: "Global Distributed Systems",
    title: "Global Distributed Systems",
    slug: "global-distributed-systems",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "global", "Distributed Systems"],
    xpReward: 300,
    description: `Architect planetary-scale distributed systems spanning multiple continents. Address WAN latency, speed of light physical bounds, fiber cuts, and geo-partitioning.

### Learning Objectives
- Design systems acknowledging the physical latency floor: speed of light in fiber optic glass (~200,000 km/s)
- Minimize cross-continental synchronous round-trips using edge termination and optimistic UI updates
- Handle undersea fiber cable cuts and routing blackholes via redundant BGP transit routes
- Segment user data to local regional stores matching geographic user origins
- Execute multi-region quorum reads without cross-globe WAN penalties

### Practical Challenge
Calculate round-trip time in milliseconds between two points separated by distance in km: Math.round((distanceKm * 2 / 200000) * 1000).`,
    starterCode: {
      javascript: `function calculateGlobalWANLatency(distanceKm) {
  return Math.round((distanceKm * 2 / 200000) * 1000);
}`,
      python: `def calculate_global_wan_latency(distance_km):
    return round((distance_km * 2 / 200000.0) * 1000)`
    },
    testCases: [
      { input: `12000`, expectedOutput: `120`, isHidden: false },
      { input: `8000`, expectedOutput: `80`, isHidden: false }
    ],
    hints: ["Calculate (distance * 2 / 200,000) * 1000 ms."]
  },
  {
    id: "sd-tier5-003",
    tier: 5,
    section: "Architect",
    topic: "Multi-Region Architecture",
    title: "Global Multi-Region Architecture",
    slug: "architect-multi-region-architecture",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "multi-region", "Global Architecture"],
    xpReward: 300,
    description: `Architect multi-region cloud systems for global failover, regulatory compliance, and localized edge compute.

### Learning Objectives
- Design independent regional deployment stacks (stamps) sharing minimal global state
- Use Global Traffic Management (GTM) to steer user requests based on health and real-time network latency
- Replicate data across regions using asynchronous replication with bounded lag monitoring
- Automate regional disaster recovery failover without human intervention
- Enforce data residency boundaries for sensitive user information

### Practical Challenge
Determine target region: return nearest healthy region name from an array of regional endpoints.`,
    starterCode: {
      javascript: `function routeToHealthyRegion(regions) {
  const healthy = regions.filter(r => r.healthy).sort((a, b) => a.latency - b.latency);
  return healthy.length > 0 ? healthy[0].name : "fallback-maintenance";
}`,
      python: `def route_to_healthy_region(regions):
    healthy = [r for r in regions if r.get("healthy")]
    if not healthy:
        return "fallback-maintenance"
    return min(healthy, key=lambda r: r.get("latency", float('inf')))["name"]`
    },
    testCases: [
      { input: `[{"name": "us-east", "healthy": false, "latency": 20}, {"name": "eu-west", "healthy": true, "latency": 80}]`, expectedOutput: `"eu-west"`, isHidden: false },
      { input: `[{"name": "ap-south", "healthy": true, "latency": 30}]`, expectedOutput: `"ap-south"`, isHidden: false }
    ],
    hints: ["Filter healthy regions and pick the one with lowest latency."]
  },
  {
    id: "sd-tier5-004",
    tier: 5,
    section: "Architect",
    topic: "Active-Active Architecture",
    title: "Global Active-Active Architecture",
    slug: "architect-active-active-architecture",
    difficulty: "Hard",
    pattern: "High Availability",
    category: "system-design",
    tags: ["sd-master", "system-design", "active-active", "High Availability"],
    xpReward: 300,
    description: `Design true Active-Active multi-region systems where all regions process concurrent writes with automatic conflict detection and resolution.

### Learning Objectives
- Prevent write conflicts using user pinning (home region routing)
- Resolve concurrent conflicting updates using CRDTs (Conflict-Free Replicated Data Types)
- Avoid distributed two-phase commit over WAN networks
- Ensure zero-downtime traffic evacuation during regional cloud incidents
- Audit global data convergence using background anti-entropy scanners

### Practical Challenge
Check if a write requires conflict resolution: return true if writes from region A and region B to same key occurred within conflictWindowMs.`,
    starterCode: {
      javascript: `function detectConcurrentWriteConflict(timeA, timeB, conflictWindowMs) {
  return Math.abs(timeA - timeB) <= conflictWindowMs;
}`,
      python: `def detect_concurrent_write_conflict(time_a, time_b, conflict_window_ms):
    return abs(time_a - time_b) <= conflict_window_ms`
    },
    testCases: [
      { input: `1000, 1020, 50`, expectedOutput: `true`, isHidden: false },
      { input: `1000, 1200, 50`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Writes within the conflict window must undergo deterministic conflict resolution."]
  },
  {
    id: "sd-tier5-005",
    tier: 5,
    section: "Architect",
    topic: "Global Traffic Management",
    title: "Global Traffic Management",
    slug: "global-traffic-management",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "gtm", "dns", "anycast", "Global Architecture"],
    xpReward: 300,
    description: `Master Global Traffic Management (GTM). Steer billions of client requests across worldwide cloud infrastructure using BGP Anycast, GeoDNS, and real-user latency monitoring.

### Learning Objectives
- Contrast BGP Anycast (same IP advertised globally, routed by Internet BGP) with GeoDNS (DNS server returns IP based on client resolver location)
- Implement Real User Monitoring (RUM) latency beacons to measure real client-to-datacenter speeds
- Shift traffic dynamically away from saturated or degraded datacenters using weighted DNS records
- Mitigate DNS caching limitations (ISP resolvers ignoring low TTLs)
- Use HTTP 307 / 308 application-layer redirects for instant regional re-routing

### Practical Challenge
Select routing method: return "BGP_ANYCAST" if zero DNS caching delay is required, else "GEODNS".`,
    starterCode: {
      javascript: `function selectGlobalRoutingMethod(requireInstantRouting) {
  return requireInstantRouting ? "BGP_ANYCAST" : "GEODNS";
}`,
      python: `def select_global_routing_method(require_instant_routing):
    return "BGP_ANYCAST" if require_instant_routing else "GEODNS"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"BGP_ANYCAST"`, isHidden: false },
      { input: `false`, expectedOutput: `"GEODNS"`, isHidden: false }
    ],
    hints: ["BGP Anycast eliminates client DNS caching delay by routing at the IP network layer."]
  },
  {
    id: "sd-tier5-006",
    tier: 5,
    section: "Architect",
    topic: "Global Load Balancing",
    title: "Global Load Balancing",
    slug: "global-load-balancing",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "gslb", "load-balancing", "Global Architecture"],
    xpReward: 300,
    description: `Design Global Server Load Balancers (GSLB) coordinating traffic distribution across cloud providers, on-premise datacenters, and edge networks.

### Learning Objectives
- Balance traffic across heterogenous cloud providers and hybrid datacenters
- Monitor regional capacity saturation and drain traffic before servers breach SLO thresholds
- Implement spilling: route traffic to secondary region when primary region exceeds 80% utilization
- Support sticky geographic routing for localized caching efficiency
- Prevent global cascading failure when one region fails and passes load to remaining regions

### Practical Challenge
Calculate spillover traffic percentage: return Math.max(0, currentUtilization - 80).`,
    starterCode: {
      javascript: `function calculateSpilloverTraffic(currentUtilization) {
  return Math.max(0, currentUtilization - 80);
}`,
      python: `def calculate_spillover_traffic(current_utilization):
    return max(0, current_utilization - 80)`
    },
    testCases: [
      { input: `95`, expectedOutput: `15`, isHidden: false },
      { input: `75`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Spill over traffic when utilization exceeds the 80% threshold."]
  },
  {
    id: "sd-tier5-007",
    tier: 5,
    section: "Architect",
    topic: "Edge Computing",
    title: "Edge Computing",
    slug: "edge-computing",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "edge", "cloudflare-workers", "Global Architecture"],
    xpReward: 300,
    description: `Explore Edge Computing (Cloudflare Workers, Fastly Compute@Edge, AWS Lambda@Edge). Execute code within 10ms of end users using V8 isolates at CDN points of presence.

### Learning Objectives
- Execute serverless functions at hundreds of global CDN edge locations worldwide
- Use lightweight V8 isolates instead of heavy Docker containers to achieve 0ms cold starts
- Perform authentication, authorization, and A/B testing at the edge before hitting origin servers
- Personalize content and rewrite HTML dynamically at the edge
- Maintain edge key-value and transactional stores (Cloudflare D1, KV, Durable Objects)

### Practical Challenge
Determine execution location: return "EDGE" if latency must be < 20ms and task is stateless; else "ORIGIN".`,
    starterCode: {
      javascript: `function determineExecutionTier(latencyBudgetMs, isStateless) {
  return (latencyBudgetMs < 20 && isStateless) ? "EDGE" : "ORIGIN";
}`,
      python: `def determine_execution_tier(latency_budget_ms, is_stateless):
    return "EDGE" if (latency_budget_ms < 20 and is_stateless) else "ORIGIN"`
    },
    testCases: [
      { input: `15, true`, expectedOutput: `"EDGE"`, isHidden: false },
      { input: `100, true`, expectedOutput: `"ORIGIN"`, isHidden: false },
      { input: `10, false`, expectedOutput: `"ORIGIN"`, isHidden: true }
    ],
    hints: ["Sub-20ms stateless logic is best executed at the CDN edge."]
  },
  {
    id: "sd-tier5-008",
    tier: 5,
    section: "Architect",
    topic: "CDN Architecture",
    title: "Advanced CDN Architecture",
    slug: "advanced-cdn-architecture",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "cdn", "caching", "Global Architecture"],
    xpReward: 300,
    description: `Architect custom global Content Delivery Networks. Learn edge tiering, origin shielding, cache invalidation protocols, and dynamic content acceleration.

### Learning Objectives
- Implement Origin Shielding: designated central POPs protect origin datacenters from simultaneous edge cache misses
- Route dynamic API requests over optimized private fiber backbones (TCP connection pooling, optimized window sizes)
- Invalidate millions of cache keys globally in sub-second timeframes using Surrogate Keys / Cache Tags
- Use Stale-While-Revalidate to return cached data instantly while refreshing origin content asynchronously in the background
- Protect against origin DDoS by absorbing malicious volumetric traffic at the CDN tier

### Practical Challenge
Calculate origin hits with origin shield: edgeMisses * (1 - shieldHitRate). Round down.`,
    starterCode: {
      javascript: `function calculateOriginHitsWithShield(edgeMisses, shieldHitRate) {
  return Math.floor(edgeMisses * (1 - shieldHitRate));
}`,
      python: `import math

def calculate_origin_hits_with_shield(edge_misses, shield_hit_rate):
    return math.floor(edge_misses * (1.0 - shield_hit_rate))`
    },
    testCases: [
      { input: `10000, 0.8`, expectedOutput: `2000`, isHidden: false },
      { input: `5000, 0.9`, expectedOutput: `500`, isHidden: false }
    ],
    hints: ["An origin shield absorbs a fraction of edge misses before reaching the origin."]
  },
  {
    id: "sd-tier5-009",
    tier: 5,
    section: "Architect",
    topic: "Geo-Distributed Databases",
    title: "Geo-Distributed Databases",
    slug: "geo-distributed-databases",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "spanner", "cockroachdb", "Distributed Systems"],
    xpReward: 300,
    description: `Master Globally Distributed Databases (Google Cloud Spanner, CockroachDB, YugabyteDB). Achieve global ACID transactions with external consistency and distributed consensus.

### Learning Objectives
- Understand Google Spanner TrueTime API: atomic clocks and GPS receivers bounding clock uncertainty (epsilon)
- Guarantee external consistency (linearizability) across worldwide distributed multi-region databases
- Combine Multi-Paxos or Raft with Two-Phase Commit (2PC) for global serializable transactions
- Partition tables by user locality to minimize cross-region latency
- Survive complete regional cloud outages with zero data loss (RPO = 0)

### Practical Challenge
Calculate TrueTime uncertainty interval wait time: return Math.round(2 * epsilonMs).`,
    starterCode: {
      javascript: `function calculateTrueTimeWait(epsilonMs) {
  return Math.round(2 * epsilonMs);
}`,
      python: `def calculate_true_time_wait(epsilon_ms):
    return round(2 * epsilon_ms)`
    },
    testCases: [
      { input: `7`, expectedOutput: `14`, isHidden: false },
      { input: `3.5`, expectedOutput: `7`, isHidden: false }
    ],
    hints: ["Spanner waits 2 * epsilon to ensure transaction timestamps reflect true real-time order."]
  },
  {
    id: "sd-tier5-010",
    tier: 5,
    section: "Architect",
    topic: "Global Data Replication",
    title: "Global Data Replication",
    slug: "global-data-replication",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "replication", "Global Architecture"],
    xpReward: 300,
    description: `Design Global Data Replication pipelines. Balance network bandwidth, asynchronous replication lag, and consistency guarantees across continents.

### Learning Objectives
- Stream database change data capture (CDC) across global WAN links
- Compress and batch replication binlogs to maximize WAN link utilization
- Monitor cross-region replication lag and alert before SLA violations occur
- Implement automatic conflict detection for multi-region active replication
- Manage bandwidth costs associated with inter-region cloud egress charges

### Practical Challenge
Calculate daily egress bandwidth cost in dollars given daily replicated data in GB and egressCostPerGB ($0.02).`,
    starterCode: {
      javascript: `function calculateReplicationEgressCost(dailyGB, egressCostPerGB) {
  return Math.round(dailyGB * egressCostPerGB * 100) / 100;
}`,
      python: `def calculate_replication_egress_cost(daily_gb, egress_cost_per_gb):
    return round(daily_gb * egress_cost_per_gb, 2)`
    },
    testCases: [
      { input: `1000, 0.02`, expectedOutput: `20`, isHidden: false },
      { input: `50000, 0.02`, expectedOutput: `1000`, isHidden: false }
    ],
    hints: ["Multiply dailyGB by egressCostPerGB."]
  },
  {
    id: "sd-tier5-011",
    tier: 5,
    section: "Architect",
    topic: "Conflict Resolution",
    title: "Conflict Resolution",
    slug: "conflict-resolution",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "crdt", "lww", "Distributed Systems"],
    xpReward: 300,
    description: `Master Distributed Conflict Resolution algorithms. Learn Last-Write-Wins (LWW), Vector Clocks, Conflict-Free Replicated Data Types (CRDTs), and application-level three-way merges.

### Learning Objectives
- Understand why concurrent writes to different replicas create conflicting states
- Analyze Last-Write-Wins (LWW) shortcomings: clock skew silently discards valid data
- Implement State-based (CvRDT) and Operation-based (CmRDT) Conflict-Free Replicated Data Types
- Build collaborative real-time editors using Observed-Remove Sets (OR-Set) and LWW-Element-Set
- Support custom business merge functions when automated conflict resolution cannot deduce intent

### Practical Challenge
Simulate Last-Write-Wins: given two write records { val, timestamp }, return the value with the higher timestamp.`,
    starterCode: {
      javascript: `function resolveConflictLWW(writeA, writeB) {
  return writeA.timestamp >= writeB.timestamp ? writeA.val : writeB.val;
}`,
      python: `def resolve_conflict_lww(write_a, write_b):
    return write_a["val"] if write_a.get("timestamp", 0) >= write_b.get("timestamp", 0) else write_b["val"]`
    },
    testCases: [
      { input: `{"val": "A", "timestamp": 100}, {"val": "B", "timestamp": 105}`, expectedOutput: `"B"`, isHidden: false },
      { input: `{"val": "A", "timestamp": 200}, {"val": "B", "timestamp": 150}`, expectedOutput: `"A"`, isHidden: false }
    ],
    hints: ["Last-Write-Wins selects the record with the higher timestamp."]
  },
  {
    id: "sd-tier5-012",
    tier: 5,
    section: "Architect",
    topic: "Distributed Consensus",
    title: "Distributed Consensus at Scale",
    slug: "distributed-consensus-at-scale",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "consensus", "Distributed Systems"],
    xpReward: 300,
    description: `Deep-dive into planetary-scale consensus protocols. Compare Multi-Paxos, Raft, Zab, and Byzantine Fault Tolerant (BFT) consensus algorithms.

### Learning Objectives
- Understand leader bottleneck in single-leader consensus protocols at extreme scale
- Partition consensus groups: run thousands of independent Raft consensus groups (Multi-Raft) across a cluster
- Implement read leases: serve linearizable reads from leader without running full quorum rounds
- Address Byzantine Faults (malicious/compromised nodes) vs crash-stop/crash-recovery faults
- Balance cluster membership changes and dynamic reconfiguration without stopping consensus

### Practical Challenge
Calculate maximum allowed Byzantine nodes tolerated in a cluster of size N: floor((N - 1) / 3).`,
    starterCode: {
      javascript: `function calculateMaxByzantineFaults(clusterSize) {
  return Math.floor((clusterSize - 1) / 3);
}`,
      python: `def calculate_max_byzantine_faults(cluster_size):
    return (cluster_size - 1) // 3`
    },
    testCases: [
      { input: `4`, expectedOutput: `1`, isHidden: false },
      { input: `7`, expectedOutput: `2`, isHidden: false },
      { input: `10`, expectedOutput: `3`, isHidden: true }
    ],
    hints: ["BFT consensus requires 3F + 1 nodes to tolerate F Byzantine failures: floor((N - 1) / 3)."]
  },
  {
    id: "sd-tier5-013",
    tier: 5,
    section: "Architect",
    topic: "Large-Scale Event Streaming",
    title: "Large-Scale Event Streaming",
    slug: "large-scale-event-streaming",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "streaming", "kafka", "Large-Scale Data"],
    xpReward: 300,
    description: `Scale event streaming platforms to billions of daily events. Master tiered storage in Kafka, cluster federation (MirrorMaker 2), partition sizing, and controller scaling.

### Learning Objectives
- Scale Kafka to millions of messages per second across hundreds of brokers
- Implement Kafka Tiered Storage: offload cold log segments to Amazon S3 to retain petabytes of events economically
- Replicate event streams across global clusters using Kafka MirrorMaker 2
- Size partitions appropriately to prevent broker metadata explosion and slow controller failovers
- Enforce strict client quotas to isolate noisy neighbor producers and consumers

### Practical Challenge
Calculate total partitions for topic given target write throughput MB/s and max throughput per partition (typically 10 MB/s). Round up.`,
    starterCode: {
      javascript: `function calculateKafkaPartitions(targetMBps, maxPerPartitionMBps) {
  return Math.ceil(targetMBps / maxPerPartitionMBps);
}`,
      python: `import math

def calculate_kafka_partitions(target_mbps, max_per_partition_mbps):
    return math.ceil(target_mbps / float(max_per_partition_mbps))`
    },
    testCases: [
      { input: `250, 10`, expectedOutput: `25`, isHidden: false },
      { input: `50, 10`, expectedOutput: `5`, isHidden: false }
    ],
    hints: ["Divide target throughput by per-partition throughput capacity and take ceiling."]
  },
  {
    id: "sd-tier5-014",
    tier: 5,
    section: "Architect",
    topic: "Real-Time Systems",
    title: "Real-Time Systems",
    slug: "architect-real-time-systems",
    difficulty: "Hard",
    pattern: "Real-Time Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "real-time", "websockets", "Real-Time Systems"],
    xpReward: 300,
    description: `Architect ultra-low-latency real-time infrastructure supporting tens of millions of concurrent open sockets, live sports updates, trading platforms, and multiplayer games.

### Learning Objectives
- Maintain tens of millions of concurrent persistent TCP/WebSocket connections across gateway fleets
- Broadcast state changes to millions of listeners in under 100ms using hierarchical pub/sub distribution trees
- Implement Delta Compression: broadcast only changed state fields rather than full state payloads
- Manage connection reconnection storms (thundering herd) during gateway server restarts
- Select between WebSockets, WebTransport (HTTP/3 UDP), and Server-Sent Events (SSE)

### Practical Challenge
Calculate broadcast fanout bandwidth in Gbps given message size KB, recipient count, and duration (1 second): return Math.round(((recipients * sizeKB * 8) / 1e6) * 10) / 10.`,
    starterCode: {
      javascript: `function calculateBroadcastBandwidthGbps(sizeKB, recipients) {
  const totalBits = sizeKB * 1000 * 8 * recipients;
  return Math.round((totalBits / 1e9) * 10) / 10;
}`,
      python: `def calculate_broadcast_bandwidth_gbps(size_kb, recipients):
    total_bits = size_kb * 1000 * 8 * recipients
    return round(total_bits / 1e9, 1)`
    },
    testCases: [
      { input: `1, 1000000`, expectedOutput: `8.0`, isHidden: false },
      { input: `2, 500000`, expectedOutput: `8.0`, isHidden: false }
    ],
    hints: ["Multiply sizeKB by 8000 bits * recipients and divide by 10^9."]
  },
  {
    id: "sd-tier5-015",
    tier: 5,
    section: "Architect",
    topic: "Massive Notification Systems",
    title: "Massive Notification Systems",
    slug: "massive-notification-systems",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "notifications", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect planetary push notification and messaging systems delivering hundreds of millions of breaking news alerts within minutes.

### Learning Objectives
- Disseminate breaking news push alerts to 100 million mobile devices in under 5 minutes
- Fan out notifications through tiered queue hierarchies without overwhelming external APNs/FCM gateways
- Implement localized language translation and timezone-aware quiet hours delivery scheduling
- Deduplicate alerts across multiple triggering backend services
- Handle connection throttling and backpressure from mobile push networks

### Practical Challenge
Calculate required delivery throughput per second to deliver N notifications within targetMinutes: return Math.ceil(totalNotifications / (targetMinutes * 60)).`,
    starterCode: {
      javascript: `function calculatePushThroughputPerSec(totalNotifications, targetMinutes) {
  return Math.ceil(totalNotifications / (targetMinutes * 60));
}`,
      python: `import math

def calculate_push_throughput_per_sec(total_notifications, target_minutes):
    return math.ceil(total_notifications / (target_minutes * 60.0))`
    },
    testCases: [
      { input: `30000000, 5`, expectedOutput: `100000`, isHidden: false },
      { input: `6000000, 10`, expectedOutput: `10000`, isHidden: false }
    ],
    hints: ["Divide total notifications by total target seconds."]
  },
  {
    id: "sd-tier5-016",
    tier: 5,
    section: "Architect",
    topic: "High-Scale Search",
    title: "High-Scale Search",
    slug: "high-scale-search",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "search", "elasticsearch", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect petabyte-scale distributed full-text search systems (Elasticsearch, Apache Lucene). Master inverted index sharding, distributed aggregations, and near-real-time indexing.

### Learning Objectives
- Shard inverted indexes across hundreds of nodes using document-based routing
- Execute scatter-gather distributed queries with coordinator nodes merging top-K results
- Manage Lucene segment merges, commit flushes, and refresh intervals to balance search latency and indexing speed
- Isolate master-eligible nodes from heavy data query nodes to preserve cluster stability
- Support multilingual tokenization, stemming, n-grams, and semantic vector embeddings

### Practical Challenge
Calculate Lucene search response time: return max(shardResponseTimes) + coordinatorMergeTime.`,
    starterCode: {
      javascript: `function calculateScatterGatherSearchTime(shardTimes, coordinatorMergeMs) {
  return Math.max(...shardTimes) + coordinatorMergeMs;
}`,
      python: `def calculate_scatter_gather_search_time(shard_times, coordinator_merge_ms):
    return max(shard_times) + coordinator_merge_ms`
    },
    testCases: [
      { input: `[15, 22, 18, 45, 20], 5`, expectedOutput: `50`, isHidden: false },
      { input: `[10, 12, 11], 2`, expectedOutput: `14`, isHidden: false }
    ],
    hints: ["Scatter-gather latency is bounded by the slowest shard response plus coordinator merge time."]
  },
  {
    id: "sd-tier5-017",
    tier: 5,
    section: "Architect",
    topic: "Recommendation Systems",
    title: "Recommendation Systems",
    slug: "recommendation-systems",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "recommendations", "ml", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect real-time Machine Learning Recommendation Systems (YouTube, TikTok, Amazon). Learn two-stage recommendation pipelines: Candidate Generation and Ranking.

### Learning Objectives
- Understand the Two-Stage Recommendation Architecture: Candidate Generation (retrieving top 1000 items in 10ms) and Ranking (scoring top 1000 with deep neural networks)
- Use Approximate Nearest Neighbor (ANN) search (HNSW, FAISS) over dense vector embeddings
- Extract user interaction features in real time using Feature Stores (Feast, Hopsworks)
- Solve the Cold Start problem for new users and new items
- Mitigate recommendation echo chambers using exploration-exploitation (Multi-Armed Bandits)

### Practical Challenge
Filter candidate pool size: return candidates.slice(0, targetCandidateSize).`,
    starterCode: {
      javascript: `function pruneCandidatePool(candidates, targetSize) {
  return candidates.slice(0, targetSize);
}`,
      python: `def prune_candidate_pool(candidates, target_size):
    return candidates[:target_size]`
    },
    testCases: [
      { input: `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5`, expectedOutput: `[1,2,3,4,5]`, isHidden: false }
    ],
    hints: ["Candidate generation filters a massive catalog down to a bounded candidate pool for ranking."]
  },
  {
    id: "sd-tier5-018",
    tier: 5,
    section: "Architect",
    topic: "Ad Serving Systems",
    title: "Ad Serving Systems",
    slug: "ad-serving-systems",
    difficulty: "Hard",
    pattern: "Real-Time Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "ads", "rtb", "auction", "Real-Time Systems"],
    xpReward: 300,
    description: `Design Real-Time Bidding (RTB) Ad Serving Infrastructure. Execute programmatic second-price auctions, budget pacing, and targeting under strict 50ms latency deadlines.

### Learning Objectives
- Execute Real-Time Bidding (RTB) auctions across hundreds of demand partners within 50ms hard timeouts
- Implement Second-Price Sealed-Bid Auctions (Vickrey Auction) where highest bidder pays second-highest price
- Enforce Budget Pacing algorithms to distribute advertiser spend evenly throughout the day
- Target users using demographic, behavioral, and geographic segment bitmaps
- Process impression and click tracking asynchronously with fraud click detection filters

### Practical Challenge
Calculate Second-Price Auction winner and price: return { winner: highestBidder, pricePaid: secondHighestBid }.`,
    starterCode: {
      javascript: `function executeSecondPriceAuction(bids) {
  const sorted = [...bids].sort((a, b) => b.amount - a.amount);
  if (sorted.length < 2) return null;
  return { winner: sorted[0].advertiser, price: sorted[1].amount };
}`,
      python: `def execute_second_price_auction(bids):
    sorted_bids = sorted(bids, key=lambda b: b.get("amount", 0), reverse=True)
    if len(sorted_bids) < 2:
        return None
    return {"winner": sorted_bids[0]["advertiser"], "price": sorted_bids[1]["amount"]}`
    },
    testCases: [
      { input: `[{"advertiser": "AdA", "amount": 5.00}, {"advertiser": "AdB", "amount": 3.50}, {"advertiser": "AdC", "amount": 2.00}]`, expectedOutput: `{"price":3.5,"winner":"AdA"}`, isHidden: false }
    ],
    hints: ["In second-price auctions, highest bidder wins but pays the second highest bid price."]
  },
  {
    id: "sd-tier5-019",
    tier: 5,
    section: "Architect",
    topic: "Fraud Detection Systems",
    title: "Fraud Detection Systems",
    slug: "fraud-detection-systems",
    difficulty: "Hard",
    pattern: "Financial Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "fraud", "risk", "Financial Systems"],
    xpReward: 300,
    description: `Build Real-Time Fraud & Risk Detection engines. Evaluate transactions against ML risk models, rules engines, velocity limits, and graph identity links within 100ms.

### Learning Objectives
- Evaluate transactions in real time (< 100ms) before authorizing payments
- Compute streaming velocity counters (e.g. number of transactions on card in past 10 minutes) using sliding windows
- Detect synthetic identity rings and fraud syndicates using Graph Databases
- Combine deterministic rule engines (e.g. block high-risk countries) with probabilistic ML risk scoring
- Implement Step-Up Authentication (3D Secure, OTP challenges) for borderline suspicious transactions

### Practical Challenge
Evaluate risk score: return "BLOCK" if riskScore >= 80; "CHALLENGE" if riskScore >= 50; else "ALLOW".`,
    starterCode: {
      javascript: `function evaluateFraudRisk(riskScore) {
  if (riskScore >= 80) return "BLOCK";
  if (riskScore >= 50) return "CHALLENGE";
  return "ALLOW";
}`,
      python: `def evaluate_fraud_risk(risk_score):
    if risk_score >= 80:
        return "BLOCK"
    if risk_score >= 50:
        return "CHALLENGE"
    return "ALLOW"`
    },
    testCases: [
      { input: `85`, expectedOutput: `"BLOCK"`, isHidden: false },
      { input: `65`, expectedOutput: `"CHALLENGE"`, isHidden: false },
      { input: `20`, expectedOutput: `"ALLOW"`, isHidden: true }
    ],
    hints: ["Categorize risk based on score thresholds."]
  },
  {
    id: "sd-tier5-020",
    tier: 5,
    section: "Architect",
    topic: "Payment Infrastructure",
    title: "Payment Infrastructure",
    slug: "payment-infrastructure",
    difficulty: "Hard",
    pattern: "Financial Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "payments", "pci", "Financial Systems"],
    xpReward: 300,
    description: `Architect enterprise payment gateways. Master PCI-DSS Level 1 tokenization vaults, acquirer integrations, ISO 8583 messaging, and settlement clearing pipelines.

### Learning Objectives
- Isolate Primary Account Numbers (PAN) in a tokenized Cardholder Data Environment (CDE) to minimize PCI audit scope
- Integrate with payment card networks (Visa, Mastercard) and banking acquirers using ISO 8583/20022 protocols
- Implement dynamic routing: route transactions to the acquiring bank offering the highest authorization rate and lowest fee
- Handle two-step payment workflows: Authorization (reserve funds) followed by Capture (settle funds)
- Secure sensitive keys using hardware security modules (HSMs) and point-to-point encryption (P2PE)

### Practical Challenge
Check if card data is tokenized: return true if card string starts with "tok_" (tokenized), false if raw PAN.`,
    starterCode: {
      javascript: `function isCardTokenized(cardIdentifier) {
  return cardIdentifier.startsWith("tok_");
}`,
      python: `def is_card_tokenized(card_identifier):
    return card_identifier.startswith("tok_")`
    },
    testCases: [
      { input: `"tok_visa_1234"`, expectedOutput: `true`, isHidden: false },
      { input: `"4111111111111111"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Raw PAN numbers must never pass into application services; only tokens starting with tok_ are allowed."]
  },
  {
    id: "sd-tier5-021",
    tier: 5,
    section: "Architect",
    topic: "Financial Transaction Systems",
    title: "Financial Transaction Systems",
    slug: "financial-transaction-systems",
    difficulty: "Hard",
    pattern: "Financial Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "ledger", "double-entry", "Financial Systems"],
    xpReward: 300,
    description: `Design high-integrity financial ledger architectures. Learn immutable transaction logging, zero-loss durability, reconciliation pipelines, and currency precision math.

### Learning Objectives
- Prevent floating-point arithmetic errors: use integer minor units (cents) or arbitrary-precision decimal types
- Enforce strict double-entry ledger bookkeeping where every monetary movement balances exactly to zero
- Implement immutable append-only transaction ledgers (never UPDATE or DELETE past ledger rows)
- Reconcile internal ledger transactions against external bank clearing and settlement statements
- Ensure transactional isolation to prevent balance race conditions during concurrent payouts

### Practical Challenge
Calculate balance in integer minor units (cents) from an array of debit (+) and credit (-) transactions in cents.`,
    starterCode: {
      javascript: `function calculateBalanceCents(transactionsCents) {
  return transactionsCents.reduce((acc, curr) => acc + curr, 0);
}`,
      python: `def calculate_balance_cents(transactions_cents):
    return sum(transactions_cents)`
    },
    testCases: [
      { input: `[1050, 2000, -500]`, expectedOutput: `2550`, isHidden: false },
      { input: `[100, -100]`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Calculate financial balances using exact integer minor units (cents)."]
  },
  {
    id: "sd-tier5-022",
    tier: 5,
    section: "Architect",
    topic: "Distributed Rate Limiting",
    title: "Global Distributed Rate Limiting",
    slug: "global-distributed-rate-limiting",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "rate-limiting", "Distributed Systems"],
    xpReward: 300,
    description: `Architect planetary distributed rate limiters across multi-region edge gateways without centralized bottlenecks or cross-region latency overhead.

### Learning Objectives
- Avoid cross-region round trips on every API call: distribute token quotas locally to regional gateways
- Synchronize token consumption asynchronously across regions in batch intervals (e.g. every 1 second)
- Handle regional partitions: gracefully allow local quota consumption while disconnected
- Implement tiered abuse prevention: IP rate limiting at edge CDN, user rate limiting at API gateway, entity rate limiting at microservices
- Return standard HTTP 429 status codes with accurate \`Retry-After\` headers

### Practical Challenge
Allocate regional token quota: return floor(globalQuota * regionTrafficShare).`,
    starterCode: {
      javascript: `function allocateRegionalRateQuota(globalQuota, regionShare) {
  return Math.floor(globalQuota * regionShare);
}`,
      python: `import math

def allocate_regional_rate_quota(global_quota, region_share):
    return math.floor(global_quota * region_share)`
    },
    testCases: [
      { input: `100000, 0.4`, expectedOutput: `40000`, isHidden: false },
      { input: `100000, 0.35`, expectedOutput: `35000`, isHidden: false }
    ],
    hints: ["Multiply global quota by regional traffic percentage and floor."]
  },
  {
    id: "sd-tier5-023",
    tier: 5,
    section: "Architect",
    topic: "Large-Scale Caching",
    title: "Large-Scale Caching",
    slug: "large-scale-caching",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "caching", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect terabyte and petabyte-scale distributed cache tiers (Facebook Mcrouter, Twemproxy). Learn multi-tier cache hierarchies, pool sharding, and cold-cache warmup.

### Learning Objectives
- Deploy dedicated caching proxy layers (e.g. Mcrouter) providing connection pooling and consistent routing
- Organize caches into distinct pools: ephemeral transient caches vs durable persistent caches
- Protect backend databases during cold cache startup using automated background pre-warming
- Shield hot keys using multi-layer caching (in-memory L1 cache in process + distributed L2 Redis cluster)
- Optimize memory fragmentation and slab allocator efficiency

### Practical Challenge
Calculate total memory required for cache holding N items of average size KB: return Math.round((nItems * avgSizeKB) / 1e6) GB.`,
    starterCode: {
      javascript: `function calculateTotalCacheGB(nItems, avgSizeKB) {
  return Math.round((nItems * avgSizeKB) / 1e6);
}`,
      python: `def calculate_total_cache_gb(n_items, avg_size_kb):
    return round((n_items * avg_size_kb) / 1e6)`
    },
    testCases: [
      { input: `100000000, 2`, expectedOutput: `200`, isHidden: false },
      { input: `50000000, 10`, expectedOutput: `500`, isHidden: false }
    ],
    hints: ["Multiply nItems * avgSizeKB and divide by 10^6 to get GB."]
  },
  {
    id: "sd-tier5-024",
    tier: 5,
    section: "Architect",
    topic: "Large-Scale Messaging",
    title: "Large-Scale Messaging",
    slug: "large-scale-messaging",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "messaging", "Large-Scale Data"],
    xpReward: 300,
    description: `Scale enterprise messaging backbones to hundreds of millions of messages per second. Learn partition scaling, rack awareness, producer batching, and consumer lag mitigation.

### Learning Objectives
- Optimize producer throughput using compression (Snappy, Zstandard) and batching (\`linger.ms\` and \`batch.size\`)
- Configure rack awareness to ensure partition replicas are spread across independent physical racks and availability zones
- Automatically detect and alert on consumer group lag before service degradations occur
- Scale consumer clusters horizontally while maintaining strict partition ordering
- Implement multi-tenant cluster isolation with bandwidth throttling quotas

### Practical Challenge
Calculate batch compression ratio: return Math.round((uncompressedBytes / compressedBytes) * 10) / 10.`,
    starterCode: {
      javascript: `function calculateCompressionRatio(uncompressedBytes, compressedBytes) {
  return Math.round((uncompressedBytes / compressedBytes) * 10) / 10;
}`,
      python: `def calculate_compression_ratio(uncompressed_bytes, compressed_bytes):
    return round(uncompressed_bytes / float(compressed_bytes), 1)`
    },
    testCases: [
      { input: `10000, 2500`, expectedOutput: `4`, isHidden: false },
      { input: `10000, 3333`, expectedOutput: `3`, isHidden: false }
    ],
    hints: ["Divide uncompressed bytes by compressed bytes and round to 1 decimal place."]
  },
  {
    id: "sd-tier5-025",
    tier: 5,
    section: "Architect",
    topic: "Data Pipelines",
    title: "Enterprise Data Pipelines",
    slug: "enterprise-data-pipelines",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "data-pipelines", "airflow", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect large-scale Data Ingestion and ETL/ELT Pipelines. Master Directed Acyclic Graphs (DAGs), Apache Airflow, data validation, and idempotency in batch workloads.

### Learning Objectives
- Model complex dependency graphs using Directed Acyclic Graphs (DAGs) in Apache Airflow / Prefect
- Differentiate ETL (transform before loading) from ELT (load raw data into data lake, transform via dbt)
- Guarantee pipeline idempotency: re-running any pipeline run produces identical output without duplicate records
- Enforce automated data quality checks (Great Expectations) before promoting data to production tables
- Implement backfilling mechanisms to recompute historical analytics when business logic evolves

### Practical Challenge
Verify if a dependency graph has no circular dependencies (is a valid DAG step sequence). For 2-node check: return fromNode !== toNode.`,
    starterCode: {
      javascript: `function isValidDAGDependency(fromNode, toNode) {
  return fromNode !== toNode;
}`,
      python: `def is_valid_dag_dependency(from_node, to_node):
    return from_node != to_node`
    },
    testCases: [
      { input: `"extract", "transform"`, expectedOutput: `true`, isHidden: false },
      { input: `"extract", "extract"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["A node cannot depend on itself in a Directed Acyclic Graph."]
  },
  {
    id: "sd-tier5-026",
    tier: 5,
    section: "Architect",
    topic: "Stream Processing",
    title: "Large-Scale Stream Processing",
    slug: "large-scale-stream-processing",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "flink", "streaming", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect real-time stateful stream processing with Apache Flink. Master rocksdb state storage, distributed checkpoints, event time skew, and complex event processing (CEP).

### Learning Objectives
- Manage stateful stream operators holding gigabytes of state using embedded RocksDB state backends
- Execute non-blocking distributed checkpoints using the Chandy-Lamport algorithm for fault recovery
- Process out-of-order and late-arriving event streams using allowed lateness and side outputs
- Correlate multi-stream events across sliding time windows (e.g. detect login followed by payment within 60s)
- Guarantee exactly-once end-to-end stream processing from Kafka sources to database sinks

### Practical Challenge
Determine if an event is within allowed lateness window: return true if (watermark - eventTime) <= maxAllowedLateness.`,
    starterCode: {
      javascript: `function isWithinAllowedLateness(watermark, eventTime, maxLateness) {
  return (watermark - eventTime) <= maxLateness;
}`,
      python: `def is_within_allowed_lateness(watermark, event_time, max_lateness):
    return (watermark - event_time) <= max_lateness`
    },
    testCases: [
      { input: `100, 95, 10`, expectedOutput: `true`, isHidden: false },
      { input: `100, 80, 10`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["If event delay is within maxLateness of watermark, process it; else route to side output."]
  },
  {
    id: "sd-tier5-027",
    tier: 5,
    section: "Architect",
    topic: "Batch Processing",
    title: "Large-Scale Batch Processing",
    slug: "large-scale-batch-processing",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "spark", "hadoop", "batch", "Large-Scale Data"],
    xpReward: 300,
    description: `Architect massive batch compute systems using Apache Spark and Hadoop MapReduce. Process petabytes of historical data across clusters of thousands of worker nodes.

### Learning Objectives
- Master Resilient Distributed Datasets (RDDs) and Catalyst Query Optimizer in Apache Spark
- Optimize distributed shuffle operations: minimize cross-network data partitions during join and group-by operations
- Handle data skew: identify and salt hot partition keys that cause individual straggler tasks to delay job completion
- Leverage Spot instance fleets with checkpointing for cost-effective batch analytics
- Compare in-memory batch execution (Spark) with disk-spilling MapReduce architectures

### Practical Challenge
Calculate shuffle data reduction percentage achieved by map-side combiner: Math.round(((rawBytes - combinedBytes) / rawBytes) * 100).`,
    starterCode: {
      javascript: `function calculateCombinerReduction(rawBytes, combinedBytes) {
  return Math.round(((rawBytes - combinedBytes) / rawBytes) * 100);
}`,
      python: `def calculate_combiner_reduction(raw_bytes, combined_bytes):
    return round(((raw_bytes - combined_bytes) / float(raw_bytes)) * 100)`
    },
    testCases: [
      { input: `1000000, 100000`, expectedOutput: `90`, isHidden: false },
      { input: `500000, 250000`, expectedOutput: `50`, isHidden: false }
    ],
    hints: ["Combiners perform local pre-aggregation before the network shuffle."]
  },
  {
    id: "sd-tier5-028",
    tier: 5,
    section: "Architect",
    topic: "Lambda Architecture",
    title: "Lambda Architecture",
    slug: "lambda-architecture",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "lambda-arch", "batch", "speed", "Large-Scale Data"],
    xpReward: 300,
    description: `Understand the classical Lambda Architecture. Learn how combining a Batch Layer (accurate historical data), a Speed Layer (low-latency real-time data), and a Serving Layer unifies analytics.

### Learning Objectives
- Batch Layer: Computes complete, immutable, accurate views over historical data using batch processing (Hadoop/Spark)
- Speed Layer: Processes real-time streams to compensate for batch processing latency window (Storm/Flink)
- Serving Layer: Indexes and merges batch views and real-time views to respond to user queries
- Analyze operational drawbacks: Maintaining two separate codebases for batch and speed layers
- Evaluate transition from dual-codebase Lambda architectures to unified stream Kappa architectures

### Practical Challenge
Merge batch and real-time counts for an entity: return batchCount + realTimeCount.`,
    starterCode: {
      javascript: `function mergeLambdaViews(batchCount, realTimeCount) {
  return batchCount + realTimeCount;
}`,
      python: `def merge_lambda_views(batch_count, real_time_count):
    return batch_count + real_time_count`
    },
    testCases: [
      { input: `1500, 45`, expectedOutput: `1545`, isHidden: false },
      { input: `10000, 0`, expectedOutput: `10000`, isHidden: false }
    ],
    hints: ["Serving layer combines precomputed batch view with recent speed layer delta."]
  },
  {
    id: "sd-tier5-029",
    tier: 5,
    section: "Architect",
    topic: "Kappa Architecture",
    title: "Kappa Architecture",
    slug: "kappa-architecture",
    difficulty: "Hard",
    pattern: "Large-Scale Data",
    category: "system-design",
    tags: ["sd-master", "system-design", "kappa-arch", "event-streaming", "Large-Scale Data"],
    xpReward: 300,
    description: `Master the Kappa Architecture (proposed by Jay Kreps). Replace dual-codebase Lambda architectures with a single unified stream processing engine (Kafka + Flink) for all data processing.

### Learning Objectives
- Eliminate dual codebase maintenance by processing all data as an immutable stream of events
- Reprocess historical data by rewinding the stream consumer offset to beginning of time
- Retain historical event logs indefinitely in tiered append-only storage (Kafka / S3)
- Run new algorithmic versions in parallel, verify output accuracy, and swap serving pointers
- Simplify operations, reduce bug incidence, and achieve continuous real-time analytics

### Practical Challenge
Check if reprocessing is needed: return true if algorithmVersion > currentServingVersion.`,
    starterCode: {
      javascript: `function needsHistoricalReprocessing(newVersion, currentVersion) {
  return newVersion > currentVersion;
}`,
      python: `def needs_historical_reprocessing(new_version, current_version):
    return new_version > current_version`
    },
    testCases: [
      { input: `2, 1`, expectedOutput: `true`, isHidden: false },
      { input: `1, 1`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["When a new algorithm version is deployed, Kappa reprocesses historical streams from offset 0."]
  },
  {
    id: "sd-tier5-030",
    tier: 5,
    section: "Architect",
    topic: "Data Consistency at Scale",
    title: "Data Consistency at Scale",
    slug: "data-consistency-at-scale",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "consistency", "Distributed Systems"],
    xpReward: 300,
    description: `Maintain data consistency across multi-datacenter global topologies. Master transactional outboxes, change data capture (CDC), and distributed saga compensation workflows.

### Learning Objectives
- Solve the dual-write problem (writing to database and publishing to message broker atomically)
- Implement the Transactional Outbox Pattern: save domain events to an \`outbox\` table in the same local DB transaction
- Stream outbox events to Kafka asynchronously using Debezium Change Data Capture (CDC)
- Implement consumer deduplication and idempotent processing to handle at-least-once deliveries
- Reconcile inconsistencies using asynchronous background audit bots

### Practical Challenge
Validate transactional outbox record creation: return true if record has both aggregateId and eventPayload.`,
    starterCode: {
      javascript: `function isValidOutboxRecord(record) {
  return Boolean(record && record.aggregateId && record.eventPayload);
}`,
      python: `def is_valid_outbox_record(record):
    return bool(record and record.get("aggregateId") and record.get("eventPayload"))`
    },
    testCases: [
      { input: `{"aggregateId": "order_123", "eventPayload": "{}"}`, expectedOutput: `true`, isHidden: false },
      { input: `{"aggregateId": "order_123"}`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["A valid outbox record requires both aggregateId and eventPayload."]
  },
  {
    id: "sd-tier5-031",
    tier: 5,
    section: "Architect",
    topic: "Disaster Recovery Architecture",
    title: "Enterprise Disaster Recovery Architecture",
    slug: "enterprise-disaster-recovery-architecture",
    difficulty: "Hard",
    pattern: "Reliability Engineering",
    category: "system-design",
    tags: ["sd-master", "system-design", "dr", "rto", "rpo", "Reliability Engineering"],
    xpReward: 300,
    description: `Architect mission-critical Disaster Recovery (DR) frameworks capable of surviving catastrophic cloud outages, ransomware corruption, and physical region destruction.

### Learning Objectives
- Design air-gapped immutable backup vaults protected by AWS Object Lock compliance mode
- Automate cross-region failover execution using infrastructure-as-code runbooks
- Minimize data loss (RPO < 1 second) via asynchronous storage-level replication engines
- Conduct unannounced game day disaster simulations to prove recovery readiness
- Ensure rapid global DNS cutover without ISP TTL caching delays

### Practical Challenge
Calculate disaster downtime cost in dollars given outageMinutes and businessCostPerMinute.`,
    starterCode: {
      javascript: `function calculateOutageCost(outageMinutes, costPerMinute) {
  return outageMinutes * costPerMinute;
}`,
      python: `def calculate_outage_cost(outage_minutes, cost_per_minute):
    return outage_minutes * cost_per_minute`
    },
    testCases: [
      { input: `30, 10000`, expectedOutput: `300000`, isHidden: false },
      { input: `5, 50000`, expectedOutput: `250000`, isHidden: false }
    ],
    hints: ["Multiply outage minutes by business cost per minute."]
  },
  {
    id: "sd-tier5-032",
    tier: 5,
    section: "Architect",
    topic: "Chaos Engineering",
    title: "Chaos Engineering",
    slug: "chaos-engineering",
    difficulty: "Hard",
    pattern: "Reliability Engineering",
    category: "system-design",
    tags: ["sd-master", "system-design", "chaos", "chaos-monkey", "Reliability Engineering"],
    xpReward: 300,
    description: `Master Chaos Engineering (Chaos Monkey, Gremlin, Chaos Mesh). Proactively inject controlled failures into production systems to uncover weaknesses before they trigger real outages.

### Learning Objectives
- Formulate steady-state hypothesis: define normal business metrics before injecting failure
- Inject real failure scenarios: terminate random container pods, sever network links, inject packet latency, exhaust CPU
- Strictly limit blast radius: start with staging environments and small canary cohorts before production experiments
- Verify automated self-healing, failover, and circuit breaker activations in real time
- Automate rollbacks: abort chaos experiment immediately if key user SLOs degrade

### Practical Challenge
Determine if chaos experiment should abort: return true if measured error rate exceeds abortThresholdPercent.`,
    starterCode: {
      javascript: `function shouldAbortChaosExperiment(currentErrorRate, abortThreshold) {
  return currentErrorRate >= abortThreshold;
}`,
      python: `def should_abort_chaos_experiment(current_error_rate, abort_threshold):
    return current_error_rate >= abort_threshold`
    },
    testCases: [
      { input: `5.5, 5.0`, expectedOutput: `true`, isHidden: false },
      { input: `1.2, 5.0`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["If error rate reaches or exceeds the safety threshold, abort the chaos experiment immediately."]
  },
  {
    id: "sd-tier5-033",
    tier: 5,
    section: "Architect",
    topic: "SLO / SLA / SLI",
    title: "SLO / SLA / SLI",
    slug: "slo-sla-sli",
    difficulty: "Hard",
    pattern: "Reliability Engineering",
    category: "system-design",
    tags: ["sd-master", "system-design", "sre", "slo", "sli", "sla", "Reliability Engineering"],
    xpReward: 300,
    description: `Master Site Reliability Engineering (SRE) reliability metrics: Service Level Indicators (SLI), Service Level Objectives (SLO), Service Level Agreements (SLA), and Error Budgets.

### Learning Objectives
- Service Level Indicator (SLI): Quantitative measure of service performance (e.g. % of requests faster than 200ms)
- Service Level Objective (SLO): Internal target reliability agreed upon by engineering and product (e.g. 99.9% success rate)
- Service Level Agreement (SLA): Contractual commitment with customers with financial penalties for breach
- Error Budget: 100% - SLO (e.g. 99.9% SLO allows 0.1% error budget); spend error budget on shipping fast features
- Halt feature deployments and focus 100% on reliability engineering when error budget is exhausted

### Practical Challenge
Calculate remaining error budget percentage: return Math.max(0, Math.round(((allowedDowntimeMin - consumedDowntimeMin) / allowedDowntimeMin) * 100)).`,
    starterCode: {
      javascript: `function calculateRemainingErrorBudget(allowedDowntimeMin, consumedDowntimeMin) {
  if (consumedDowntimeMin >= allowedDowntimeMin) return 0;
  return Math.round(((allowedDowntimeMin - consumedDowntimeMin) / allowedDowntimeMin) * 100);
}`,
      python: `def calculate_remaining_error_budget(allowed_downtime_min, consumed_downtime_min):
    if consumed_downtime_min >= allowed_downtime_min:
        return 0
    return round(((allowed_downtime_min - consumed_downtime_min) / float(allowed_downtime_min)) * 100)`
    },
    testCases: [
      { input: `43.2, 10.8`, expectedOutput: `75`, isHidden: false },
      { input: `43.2, 43.2`, expectedOutput: `0`, isHidden: false },
      { input: `43.2, 50.0`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Calculate (allowed - consumed) / allowed * 100."]
  },
  {
    id: "sd-tier5-034",
    tier: 5,
    section: "Architect",
    topic: "Reliability Engineering",
    title: "Site Reliability Engineering",
    slug: "site-reliability-engineering",
    difficulty: "Hard",
    pattern: "Reliability Engineering",
    category: "system-design",
    tags: ["sd-master", "system-design", "sre", "Reliability Engineering"],
    xpReward: 300,
    description: `Master Site Reliability Engineering (SRE) principles pioneered by Google. Treat operations as software engineering problems, eliminate toil, and manage incident response.

### Learning Objectives
- Cap operational toil (manual, repetitive, automatable work) at maximum 50% of an SRE's time
- Build automated runbooks and self-healing auto-remediation bots
- Conduct blameless postmortems after every major production incident to identify structural root causes
- Implement multi-window, multi-burn-rate alert policies to eliminate alert fatigue
- Practice progressive rollouts with automated canary analysis (ACA)

### Practical Challenge
Check if engineering toil is within Google SRE guidelines: return true if toilHours <= 0.5 * totalWorkHours.`,
    starterCode: {
      javascript: `function isToilWithinBudget(toilHours, totalWorkHours) {
  return toilHours <= 0.5 * totalWorkHours;
}`,
      python: `def is_toil_within_budget(toil_hours, total_work_hours):
    return toil_hours <= 0.5 * total_work_hours`
    },
    testCases: [
      { input: `15, 40`, expectedOutput: `true`, isHidden: false },
      { input: `25, 40`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Google SRE caps toil at 50% of total work time."]
  },
  {
    id: "sd-tier5-035",
    tier: 5,
    section: "Architect",
    topic: "Capacity Planning at Scale",
    title: "Capacity Planning at Scale",
    slug: "capacity-planning-at-scale",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "capacity", "Global Architecture"],
    xpReward: 300,
    description: `Model and forecast infrastructure capacity across global server fleets for multi-year growth horizons, seasonal promotional events, and supply chain constraints.

### Learning Objectives
- Model organic growth, seasonal peaks (e.g. holidays), and inorganic step-function business growth
- Plan hardware procurement lead times (datacenter racks, specialized GPU clusters require months of lead time)
- Size buffer headroom (N+1, N+2 regional redundancy) to absorb sudden catastrophic regional failover load
- Run load testing (stress testing to breakpoint) using distributed load generators
- Factor efficiency engineering into capacity forecasts (e.g. compiler optimizations reducing CPU by 10%)

### Practical Challenge
Calculate required fleet capacity with N+1 regional redundancy: given N active regions requiring C capacity each, return (N + 1) * C.`,
    starterCode: {
      javascript: `function calculateNPlusOneCapacity(activeRegions, capacityPerRegion) {
  return (activeRegions + 1) * capacityPerRegion;
}`,
      python: `def calculate_n_plus_one_capacity(active_regions, capacity_per_region):
    return (active_regions + 1) * capacity_per_region`
    },
    testCases: [
      { input: `3, 100`, expectedOutput: `400`, isHidden: false },
      { input: `4, 250`, expectedOutput: `1250`, isHidden: false }
    ],
    hints: ["N+1 regional redundancy provisions capacity for activeRegions + 1."]
  },
  {
    id: "sd-tier5-036",
    tier: 5,
    section: "Architect",
    topic: "Cost vs Performance Trade-offs",
    title: "Cost vs Performance Trade-offs",
    slug: "cost-vs-performance-trade-offs",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "finops", "tradeoffs", "Global Architecture"],
    xpReward: 300,
    description: `Evaluate non-linear Cost vs Performance curves. Learn when marginal performance improvements (e.g. reducing latency from 20ms to 5ms) cost 10x more infrastructure expenditure.

### Learning Objectives
- Plot cost vs latency curves to identify points of diminishing returns
- Analyze the exponential cost of achieving additional "Nines" of availability (99.9% vs 99.999%)
- Compare in-memory caching costs with NVMe SSD flash storage tiers
- Optimize network egress costs using CDN caching, payload compression, and inter-AZ traffic localization
- Establish cost attribution and showback/chargeback accounting per microservice team

### Practical Challenge
Calculate incremental cost per ms saved: return Math.round((costB - costA) / (latencyA - latencyB)).`,
    starterCode: {
      javascript: `function calculateCostPerMsSaved(latencyA, costA, latencyB, costB) {
  const latencyDiff = latencyA - latencyB;
  if (latencyDiff <= 0) return 0;
  return Math.round((costB - costA) / latencyDiff);
}`,
      python: `def calculate_cost_per_ms_saved(latency_a, cost_a, latency_b, cost_b):
    latency_diff = latency_a - latency_b
    if latency_diff <= 0:
        return 0
    return round((cost_b - cost_a) / float(latency_diff))`
    },
    testCases: [
      { input: `50, 1000, 20, 2500`, expectedOutput: `50`, isHidden: false },
      { input: `100, 500, 50, 1500`, expectedOutput: `20`, isHidden: false }
    ],
    hints: ["Divide cost difference by latency reduction in milliseconds."]
  },
  {
    id: "sd-tier5-037",
    tier: 5,
    section: "Architect",
    topic: "Security Architecture",
    title: "Enterprise Security Architecture",
    slug: "enterprise-security-architecture",
    difficulty: "Hard",
    pattern: "Security Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "security", "threat-modeling", "Security Architecture"],
    xpReward: 300,
    description: `Architect defense-in-depth security architectures. Master STRIDE threat modeling, microsegmentation, cryptographic key hierarchies, and software supply chain security.

### Learning Objectives
- Execute STRIDE threat modeling (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
- Implement Network Microsegmentation: microservices only communicate with authorized peers via mTLS
- Secure the Software Supply Chain: sign container images (Cosign), generate Software Bills of Materials (SBOM)
- Isolate security blast radiuses using dedicated AWS accounts per environment and business domain
- Establish continuous automated vulnerability management and dependency patching pipelines

### Practical Challenge
Map security threat to STRIDE category: return "Tampering" for data modification, "Information Disclosure" for data leak, "Spoofing" for impersonation.`,
    starterCode: {
      javascript: `function categorizeSTRIDEThreat(threatType) {
  const map = { "data-modification": "Tampering", "data-leak": "Information Disclosure", "impersonation": "Spoofing" };
  return map[threatType.toLowerCase()] || "Tampering";
}`,
      python: `def categorize_stride_threat(threat_type):
    mapping = {"data-modification": "Tampering", "data-leak": "Information Disclosure", "impersonation": "Spoofing"}
    return mapping.get(threat_type.lower(), "Tampering")`
    },
    testCases: [
      { input: `"impersonation"`, expectedOutput: `"Spoofing"`, isHidden: false },
      { input: `"data-leak"`, expectedOutput: `"Information Disclosure"`, isHidden: false },
      { input: `"data-modification"`, expectedOutput: `"Tampering"`, isHidden: false }
    ],
    hints: ["Map threat descriptions to standard STRIDE categories."]
  },
  {
    id: "sd-tier5-038",
    tier: 5,
    section: "Architect",
    topic: "Zero Trust Architecture",
    title: "Zero Trust Architecture",
    slug: "zero-trust-architecture",
    difficulty: "Hard",
    pattern: "Security Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "zero-trust", "mtls", "Security Architecture"],
    xpReward: 300,
    description: `Master Zero Trust Architecture (BeyondCorp). Eliminate perimeter-based network security assumptions: verify explicitly, enforce least privilege, and assume breach.

### Learning Objectives
- Abandon the "castle-and-moat" perimeter security model (internal network is untrusted)
- Verify explicitly: Authenticate and authorize every single request, user, device, and service call
- Mutual TLS (mTLS) with short-lived X.509 certificates between all microservices
- Context-Aware Access: evaluate user identity, device posture, location, and risk score dynamically
- Enforce microsegmentation to prevent lateral movement of attackers after initial compromise

### Practical Challenge
Evaluate Zero Trust request decision: return "ALLOW" if user authenticated, device healthy, and permission granted; else "DENY".`,
    starterCode: {
      javascript: `function evaluateZeroTrustAccess(isUserAuthenticated, isDeviceHealthy, hasPermission) {
  return (isUserAuthenticated && isDeviceHealthy && hasPermission) ? "ALLOW" : "DENY";
}`,
      python: `def evaluate_zero_trust_access(is_user_authenticated, is_device_healthy, has_permission):
    return "ALLOW" if (is_user_authenticated and is_device_healthy and has_permission) else "DENY"`
    },
    testCases: [
      { input: `true, true, true`, expectedOutput: `"ALLOW"`, isHidden: false },
      { input: `true, false, true`, expectedOutput: `"DENY"`, isHidden: false },
      { input: `false, true, true`, expectedOutput: `"DENY"`, isHidden: true }
    ],
    hints: ["Zero trust requires explicit verification of user, device health, and authorization."]
  },
  {
    id: "sd-tier5-039",
    tier: 5,
    section: "Architect",
    topic: "Multi-Tenant Architecture",
    title: "Multi-Tenant Architecture",
    slug: "multi-tenant-architecture",
    difficulty: "Hard",
    pattern: "Global Architecture",
    category: "system-design",
    tags: ["sd-master", "system-design", "multi-tenant", "saas", "Global Architecture"],
    xpReward: 300,
    description: `Architect enterprise Multi-Tenant SaaS applications. Compare Silo (isolated resources per tenant), Pool (shared resources with row-level security), and Bridge hybrid models.

### Learning Objectives
- Silo Model: Dedicated database and compute per tenant (maximum isolation, highest operational cost)
- Pool Model: Shared database tables with \`tenant_id\` discriminator columns (lowest cost, requires strict row-level security)
- Bridge Model: Shared application servers with dedicated tenant database shards
- Prevent Cross-Tenant Data Leaks using PostgreSQL Row-Level Security (RLS) and tenant-scoped IAM policies
- Mitigate Noisy Neighbors using tenant-specific rate limits and dedicated noisy tenant offloading

### Practical Challenge
Determine multi-tenancy model: return "SILO" if strict compliance isolation is required, else "POOL".`,
    starterCode: {
      javascript: `function selectMultiTenantModel(strictIsolationRequired) {
  return strictIsolationRequired ? "SILO" : "POOL";
}`,
      python: `def select_multi_tenant_model(strict_isolation_required):
    return "SILO" if strict_isolation_required else "POOL"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"SILO"`, isHidden: false },
      { input: `false`, expectedOutput: `"POOL"`, isHidden: false }
    ],
    hints: ["Silo provides complete tenant isolation; Pool shares infrastructure for efficiency."]
  },
  {
    id: "sd-tier5-040",
    tier: 5,
    section: "Architect",
    topic: "System Design Trade-offs",
    title: "System Design Trade-offs",
    slug: "system-design-trade-offs",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-master", "system-design", "trade-offs", "architect", "Distributed Systems"],
    xpReward: 300,
    description: `Master high-level architectural decision making and trade-off analysis. Understand that there are no perfect solutions in system design—only trade-offs.

### Learning Objectives
- Evaluate fundamental trade-offs: Consistency vs Availability, Latency vs Throughput, Simplicity vs Flexibility
- Document architectural decisions using Architecture Decision Records (ADRs)
- Balance short-term time-to-market delivery speed with long-term technical debt accumulation
- Recognize when simple solutions outperform complex distributed architectures
- Communicate architectural trade-offs, constraints, and operational implications to executive stakeholders

### Practical Challenge
Evaluate classic trade-off: return "AVAILABILITY" if system prefers serving slightly stale data during outages over returning errors, else "CONSISTENCY".`,
    starterCode: {
      javascript: `function evaluateTradeoffPriority(acceptStaleReads) {
  return acceptStaleReads ? "AVAILABILITY" : "CONSISTENCY";
}`,
      python: `def evaluate_tradeoff_priority(accept_stale_reads):
    return "AVAILABILITY" if accept_stale_reads else "CONSISTENCY"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"AVAILABILITY"`, isHidden: false },
      { input: `false`, expectedOutput: `"CONSISTENCY"`, isHidden: false }
    ],
    hints: ["Accepting stale reads prioritizes Availability over strict Consistency."]
  }
];
