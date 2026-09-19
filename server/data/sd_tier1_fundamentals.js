/**
 * TIER 1 — FUNDAMENTALS (30 Topics)
 * Difficulty: Beginner – Easy
 * Patterns: Scalability, Availability, Performance, API Design, Capacity Planning, Reliability, Distributed Systems Fundamentals
 */

module.exports = [
  {
    id: "sd-tier1-001",
    tier: 1,
    section: "Fundamentals",
    topic: "What is System Design?",
    title: "What is System Design?",
    slug: "what-is-system-design",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "fundamentals", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Understand the principles and philosophy of modern System Design. Learn how systems are decomposed into modular components, how data flows between services, and how engineering constraints guide architectural trade-offs between performance, reliability, and cost.

### Learning Objectives
- Understand the scope and definition of system design in modern software engineering
- Learn how to decompose a complex application into manageable subsystems
- Recognize architectural trade-offs between speed, cost, and complexity
- Master the standard framework for approaching system architecture interviews and production designs
- Identify common points of failure in end-to-end architectures

### Key Concepts
- **System Architecture**: High-level blueprint defining components, interfaces, and interactions.
- **Decomposition**: Splitting monolithic applications into tiers (presentation, application, data).
- **Trade-off Analysis**: Evaluating trade-offs such as consistency vs availability, latency vs throughput, and hardware cost vs engineering complexity.

### Practical Challenge
Implement an architecture component validator that inspects a system diagram spec and verifies that every component has at least one ingress and one egress communication link.`,
    starterCode: {
      javascript: `function validateSystemComponents(components, links) {
  // Return true if every component has at least one connected link
  const connected = new Set();
  for (const [from, to] of links) {
    connected.add(from);
    connected.add(to);
  }
  return components.every(c => connected.has(c));
}`,
      python: `def validate_system_components(components, links):
    # Return true if every component has at least one connected link
    connected = set()
    for f, t in links:
        connected.add(f)
        connected.add(t)
    return all(c in connected for c in components)`
    },
    testCases: [
      { input: `["client", "lb", "api", "db"], [["client", "lb"], ["lb", "api"], ["api", "db"]]`, expectedOutput: `true`, isHidden: false },
      { input: `["client", "lb", "orphan"], [["client", "lb"]]`, expectedOutput: `false`, isHidden: false },
      { input: `["gateway", "auth"], [["gateway", "auth"]]`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Check if every component in the list appears as either a source or destination in the links list."]
  },
  {
    id: "sd-tier1-002",
    tier: 1,
    section: "Fundamentals",
    topic: "Functional Requirements",
    title: "Functional Requirements",
    slug: "functional-requirements",
    difficulty: "Easy",
    pattern: "API Design",
    category: "system-design",
    tags: ["sd-basics", "system-design", "requirements", "API Design"],
    xpReward: 50,
    description: `Master the art of identifying, scoping, and defining Functional Requirements (FRs) for distributed architectures. Learn how to translate user expectations into concrete capabilities and feature contracts before designing any component.

### Learning Objectives
- Learn how to extract core functional requirements from ambiguous problem statements
- Differentiate between primary MVP requirements and secondary feature scopes
- Translate user user-stories into system inputs, outputs, and behaviors
- Avoid common pitfall of designing technical components before defining features
- Define clear interface contracts for each functional capability

### Key Concepts
- **Feature Scoping**: Identifying the top 3-4 core actions a user must perform.
- **Input/Output Contracts**: Clarifying data required to perform each operation and the returned response.
- **Boundary Conditions**: Explicitly defining out-of-scope capabilities to keep designs focused.

### Practical Challenge
Given a list of requirement statements, categorize each requirement as either "functional" or "non-functional".`,
    starterCode: {
      javascript: `function categorizeRequirements(requirements) {
  // Return array of types: "functional" for feature capabilities, "non-functional" for quality attributes
  const nfKeywords = ["latency", "throughput", "availability", "scale", "qps", "sla", "ms", "percentile"];
  return requirements.map(r => {
    const isNf = nfKeywords.some(kw => r.toLowerCase().includes(kw));
    return isNf ? "non-functional" : "functional";
  });
}`,
      python: `def categorize_requirements(requirements):
    # Return array of types: "functional" for feature capabilities, "non-functional" for quality attributes
    nf_keywords = ["latency", "throughput", "availability", "scale", "qps", "sla", "ms", "percentile"]
    result = []
    for r in requirements:
        is_nf = any(kw in r.lower() for kw in nf_keywords)
        result.append("non-functional" if is_nf else "functional")
    return result`
    },
    testCases: [
      { input: `["User can shorten URL", "System latency under 10ms", "User can delete URL"]`, expectedOutput: `["functional","non-functional","functional"]`, isHidden: false },
      { input: `["99.99% availability", "Support 100k QPS"]`, expectedOutput: `["non-functional","non-functional"]`, isHidden: true }
    ],
    hints: ["Check whether the requirement describes a user action (functional) or an operational quality attribute (non-functional)."]
  },
  {
    id: "sd-tier1-003",
    tier: 1,
    section: "Fundamentals",
    topic: "Non-Functional Requirements",
    title: "Non-Functional Requirements",
    slug: "non-functional-requirements",
    difficulty: "Easy",
    pattern: "Reliability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "nfr", "Reliability"],
    xpReward: 50,
    description: `Explore Non-Functional Requirements (NFRs) including availability, latency, throughput, durability, security, and scalability. Learn how these operational constraints dictate architecture selection.

### Learning Objectives
- Define the primary dimensions of NFRs: Availability, Latency, Durability, Scalability, and Consistency
- Understand the impact of strict latency budgets on database and caching strategies
- Learn how durability guarantees influence storage replication mechanisms
- Balance conflicting NFRs (e.g., strong consistency vs ultra-low latency)
- Formulate quantifiable Service Level Objectives (SLOs)

### Practical Challenge
Calculate whether a system meets its target SLA based on total operational minutes and measured downtime minutes.`,
    starterCode: {
      javascript: `function meetsSLA(totalMinutes, downtimeMinutes, targetPercentage) {
  const uptimePercentage = ((totalMinutes - downtimeMinutes) / totalMinutes) * 100;
  return uptimePercentage >= targetPercentage;
}`,
      python: `def meets_sla(total_minutes, downtime_minutes, target_percentage):
    uptime_percentage = ((total_minutes - downtime_minutes) / total_minutes) * 100
    return uptime_percentage >= target_percentage`
    },
    testCases: [
      { input: `43200, 4.32, 99.99`, expectedOutput: `true`, isHidden: false },
      { input: `43200, 15, 99.99`, expectedOutput: `false`, isHidden: false },
      { input: `10000, 1, 99.9`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Calculate (total - downtime) / total * 100 and check if it is >= targetPercentage."]
  },
  {
    id: "sd-tier1-004",
    tier: 1,
    section: "Fundamentals",
    topic: "Scalability",
    title: "Scalability",
    slug: "scalability",
    difficulty: "Easy",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "scalability", "Scalability"],
    xpReward: 50,
    description: `Learn how systems handle growth in traffic, data, and concurrent users gracefully without degradation in performance. Master the fundamental laws of scalability.

### Learning Objectives
- Define horizontal scalability vs vertical scalability
- Understand bottlenecks: CPU, memory, disk I/O, and network bandwidth
- Identify stateful vs stateless components in the scaling path
- Understand Amdahl's Law and the Universal Scalability Law
- Design systems with linear scalability characteristics

### Practical Challenge
Given current traffic (QPS), server capacity per instance, and a traffic growth multiplier, compute the number of server instances needed.`,
    starterCode: {
      javascript: `function calculateInstancesNeeded(currentQPS, multiplier, capacityPerInstance) {
  const projectedQPS = currentQPS * multiplier;
  return Math.ceil(projectedQPS / capacityPerInstance);
}`,
      python: `import math

def calculate_instances_needed(current_qps, multiplier, capacity_per_instance):
    projected_qps = current_qps * multiplier
    return math.ceil(projected_qps / capacity_per_instance)`
    },
    testCases: [
      { input: `1000, 5, 200`, expectedOutput: `25`, isHidden: false },
      { input: `500, 2.5, 300`, expectedOutput: `5`, isHidden: false },
      { input: `2500, 4, 1000`, expectedOutput: `10`, isHidden: true }
    ],
    hints: ["Multiply current QPS by growth multiplier and divide by instance capacity, then round up."]
  },
  {
    id: "sd-tier1-005",
    tier: 1,
    section: "Fundamentals",
    topic: "Availability",
    title: "Availability",
    slug: "availability",
    difficulty: "Easy",
    pattern: "Availability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "availability", "Availability"],
    xpReward: 50,
    description: `Explore system availability and the "Nines of Availability" (99.9%, 99.99%, 99.999%). Learn how redundant components, automatic failover, and geographic dispersion prevent outages.

### Learning Objectives
- Understand the mathematical definition of availability: MTBF / (MTBF + MTTR)
- Translate availability percentage into allowable downtime per year/month/day
- Design active-active and active-passive redundancy models
- Mitigate single points of failure (SPOFs)
- Compare single-region vs multi-region availability architectures

### Practical Challenge
Convert an availability percentage (e.g. 99.99) into allowable annual downtime in minutes (365 days). Round to two decimal places.`,
    starterCode: {
      javascript: `function allowableAnnualDowntimeMinutes(availabilityPercent) {
  const totalMinutesPerYear = 365 * 24 * 60;
  const downtimeFraction = (100 - availabilityPercent) / 100;
  const minutes = totalMinutesPerYear * downtimeFraction;
  return Math.round(minutes * 100) / 100;
}`,
      python: `def allowable_annual_downtime_minutes(availability_percent):
    total_minutes = 365 * 24 * 60
    downtime_fraction = (100.0 - availability_percent) / 100.0
    return round(total_minutes * downtime_fraction, 2)`
    },
    testCases: [
      { input: `99.9`, expectedOutput: `525.6`, isHidden: false },
      { input: `99.99`, expectedOutput: `52.56`, isHidden: false },
      { input: `99.0`, expectedOutput: `5256`, isHidden: true }
    ],
    hints: ["There are 525,600 minutes in a 365-day year. Multiply by (100 - availability) / 100."]
  },
  {
    id: "sd-tier1-006",
    tier: 1,
    section: "Fundamentals",
    topic: "Reliability",
    title: "Reliability",
    slug: "reliability",
    difficulty: "Easy",
    pattern: "Reliability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "reliability", "Reliability"],
    xpReward: 50,
    description: `Understand the difference between availability and reliability. A system can be available (accepting requests) but unreliable (dropping transactions or corrupting data).

### Learning Objectives
- Contrast availability (uptime) with reliability (correctness under stated conditions)
- Understand Mean Time Between Failures (MTBF) and Mean Time To Recovery (MTTR)
- Implement self-healing systems and automated rollback pipelines
- Prevent silent data corruption and partial transaction failures
- Design idempotent and compensatable operations for recovery

### Practical Challenge
Calculate the MTBF in hours given total operating hours and the number of failure events.`,
    starterCode: {
      javascript: `function calculateMTBF(operatingHours, failures) {
  if (failures === 0) return operatingHours;
  return Math.round((operatingHours / failures) * 10) / 10;
}`,
      python: `def calculate_mtbf(operating_hours, failures):
    if failures == 0:
        return operating_hours
    return round(operating_hours / failures, 1)`
    },
    testCases: [
      { input: `1000, 4`, expectedOutput: `250`, isHidden: false },
      { input: `720, 3`, expectedOutput: `240`, isHidden: false },
      { input: `1000, 0`, expectedOutput: `1000`, isHidden: true }
    ],
    hints: ["MTBF is total operational time divided by the number of failure occurrences."]
  },
  {
    id: "sd-tier1-007",
    tier: 1,
    section: "Fundamentals",
    topic: "Performance",
    title: "Performance",
    slug: "performance",
    difficulty: "Easy",
    pattern: "Performance",
    category: "system-design",
    tags: ["sd-basics", "system-design", "performance", "Performance"],
    xpReward: 50,
    description: `Explore end-to-end performance engineering. Learn how processing speed, memory efficiency, network serialization, and concurrency architectures impact user perceived responsiveness.

### Learning Objectives
- Measure performance across client, transport, compute, and database layers
- Identify performance bottlenecks using flame graphs and profiling tools
- Optimize I/O bound vs CPU bound workloads
- Understand zero-copy networking, connection reuse, and binary protocols
- Formulate performance budgets for distributed call graphs

### Practical Challenge
Compute the total latency of a serial request chain given individual component latencies in milliseconds.`,
    starterCode: {
      javascript: `function calculateTotalLatency(latencies) {
  return latencies.reduce((acc, curr) => acc + curr, 0);
}`,
      python: `def calculate_total_latency(latencies):
    return sum(latencies)`
    },
    testCases: [
      { input: `[15, 30, 45, 10]`, expectedOutput: `100`, isHidden: false },
      { input: `[5, 5, 5]`, expectedOutput: `15`, isHidden: false },
      { input: `[100, 250]`, expectedOutput: `350`, isHidden: true }
    ],
    hints: ["Sum all latencies in the serial execution path."]
  },
  {
    id: "sd-tier1-008",
    tier: 1,
    section: "Fundamentals",
    topic: "Latency",
    title: "Latency",
    slug: "latency",
    difficulty: "Easy",
    pattern: "Performance",
    category: "system-design",
    tags: ["sd-basics", "system-design", "latency", "Performance"],
    xpReward: 50,
    description: `Deep-dive into latency metrics: p50, p90, p99, and tail latency. Learn how network hops, garbage collection pauses, lock contention, and disk I/O contribute to response delays.

### Learning Objectives
- Understand latency percentiles (p50 median vs p99 / p99.9 tail latency)
- Recognize why averages are misleading in distributed system performance
- Analyze the impact of tail latency amplification across microservice fans
- Use caching, read replicas, and CDNs to reduce geographic latency
- Implement speculative retries (hedged requests) for outlier requests

### Practical Challenge
Given an array of measured request latencies (ms), calculate the p99 latency value (nearest rank percentile).`,
    starterCode: {
      javascript: `function getP99Latency(latencies) {
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.ceil(0.99 * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}`,
      python: `import math

def get_p99_latency(latencies):
    sorted_l = sorted(latencies)
    idx = math.ceil(0.99 * len(sorted_l)) - 1
    return sorted_l[max(0, idx)]`
    },
    testCases: [
      { input: `[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`, expectedOutput: `100`, isHidden: false },
      { input: `[12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 500]`, expectedOutput: `500`, isHidden: false }
    ],
    hints: ["Sort latencies ascending and calculate the index at ceil(0.99 * length) - 1."]
  },
  {
    id: "sd-tier1-009",
    tier: 1,
    section: "Fundamentals",
    topic: "Throughput",
    title: "Throughput",
    slug: "throughput",
    difficulty: "Easy",
    pattern: "Performance",
    category: "system-design",
    tags: ["sd-basics", "system-design", "throughput", "Performance"],
    xpReward: 50,
    description: `Understand Throughput (QPS / RPS / TPS) and how systems maximize transactions processed per unit of time through batching, pipelining, asynchronous I/O, and concurrency.

### Learning Objectives
- Define throughput in terms of Queries Per Second (QPS) and Megabytes Per Second (MB/s)
- Understand Little's Law: Concurrency = Throughput × Latency
- Apply batching and buffering to dramatically boost data pipeline throughput
- Compare thread-per-request architectures with event-driven non-blocking I/O
- Measure the trade-off between throughput maximization and latency minimization

### Practical Challenge
Using Little's Law (L = λ × W), calculate average concurrent requests given throughput (requests/sec) and average response time in seconds.`,
    starterCode: {
      javascript: `function calculateConcurrency(throughputQPS, avgResponseTimeSec) {
  return Math.round(throughputQPS * avgResponseTimeSec);
}`,
      python: `def calculate_concurrency(throughput_qps, avg_response_time_sec):
    return round(throughput_qps * avg_response_time_sec)`
    },
    testCases: [
      { input: `1000, 0.05`, expectedOutput: `50`, isHidden: false },
      { input: `5000, 0.2`, expectedOutput: `1000`, isHidden: false },
      { input: `2000, 0.01`, expectedOutput: `20`, isHidden: true }
    ],
    hints: ["Multiply throughput by average response time in seconds."]
  },
  {
    id: "sd-tier1-010",
    tier: 1,
    section: "Fundamentals",
    topic: "Capacity Estimation",
    title: "Capacity Estimation",
    slug: "capacity-estimation",
    difficulty: "Easy",
    pattern: "Capacity Planning",
    category: "system-design",
    tags: ["sd-basics", "system-design", "capacity", "Capacity Planning"],
    xpReward: 50,
    description: `Learn how to estimate storage, memory, bandwidth, and compute requirements for large-scale systems over 1, 3, and 5-year operational horizons.

### Learning Objectives
- Calculate daily and annual storage growth from active users and average post size
- Estimate required RAM for caching using the 80/20 Pareto principle
- Compute ingress and egress network bandwidth requirements
- Size database shards based on write volume and IOPS limits
- Build safety margins (headroom factor 2x-3x) into capacity estimates

### Practical Challenge
Calculate storage required per year in Gigabytes (GB) given Daily Active Users (DAU), average actions per user per day, and average data size per action in Kilobytes (KB). (1 GB = 10^6 KB).`,
    starterCode: {
      javascript: `function calculateAnnualStorageGB(dau, actionsPerDay, sizeKB) {
  const dailyTotalKB = dau * actionsPerDay * sizeKB;
  const annualTotalKB = dailyTotalKB * 365;
  return Math.round(annualTotalKB / 1e6);
}`,
      python: `def calculate_annual_storage_gb(dau, actions_per_day, size_kb):
    daily_total_kb = dau * actions_per_day * size_kb
    annual_total_kb = daily_total_kb * 365
    return round(annual_total_kb / 1e6)`
    },
    testCases: [
      { input: `1000000, 2, 5`, expectedOutput: `3650`, isHidden: false },
      { input: `500000, 1, 10`, expectedOutput: `1825`, isHidden: false },
      { input: `2000000, 5, 2`, expectedOutput: `7300`, isHidden: true }
    ],
    hints: ["Multiply dau * actions * sizeKB * 365 and divide by 1,000,000."]
  },
  {
    id: "sd-tier1-011",
    tier: 1,
    section: "Fundamentals",
    topic: "Back-of-the-Envelope Calculations",
    title: "Back-of-the-Envelope Calculations",
    slug: "back-of-the-envelope-calculations",
    difficulty: "Easy",
    pattern: "Capacity Planning",
    category: "system-design",
    tags: ["sd-basics", "system-design", "math", "Capacity Planning"],
    xpReward: 50,
    description: `Master standard powers of two, latency numbers every programmer should know, and quick mental arithmetic tricks for system design interviews.

### Learning Objectives
- Memorize key latency numbers (L1 cache ~0.5ns, RAM ~100ns, SSD read ~100μs, cross-datacenter roundtrip ~150ms)
- Convert effortlessly between seconds in a day (86,400 ≈ 10^5) and QPS
- Convert storage units (2^10 KB, 2^20 MB, 2^30 GB, 2^40 TB, 2^50 PB)
- Approximate peak QPS as 2x to 3x average QPS
- Validate architectural viability rapidly before deep implementation

### Practical Challenge
Convert daily request volume into average Queries Per Second (QPS) assuming 86,400 seconds in a day. Round to integer.`,
    starterCode: {
      javascript: `function dailyRequestsToQPS(dailyRequests) {
  return Math.round(dailyRequests / 86400);
}`,
      python: `def daily_requests_to_qps(daily_requests):
    return round(daily_requests / 86400)`
    },
    testCases: [
      { input: `8640000`, expectedOutput: `100`, isHidden: false },
      { input: `86400000`, expectedOutput: `1000`, isHidden: false },
      { input: `43200000`, expectedOutput: `500`, isHidden: true }
    ],
    hints: ["Divide daily requests by 86,400 and round to nearest integer."]
  },
  {
    id: "sd-tier1-012",
    tier: 1,
    section: "Fundamentals",
    topic: "Horizontal Scaling",
    title: "Horizontal Scaling",
    slug: "horizontal-scaling",
    difficulty: "Easy",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "scaling", "Scalability"],
    xpReward: 50,
    description: `Learn how horizontal scaling (scaling out) adds more machines into the resource pool, enabling linear capacity growth and fault isolation compared to single-box upgrades.

### Learning Objectives
- Understand horizontal scaling benefits: elasticity, fault tolerance, commodity hardware
- Overcome horizontal scaling challenges: data distribution, network latency, distributed consensus
- Implement stateless application tiers for frictionless scale-out
- Pair horizontal scaling with dynamic auto-scaling policies
- Differentiate scaling out compute vs scaling out relational databases

### Practical Challenge
Given current cluster server count and additional load percentage, calculate total servers required after scaling out.`,
    starterCode: {
      javascript: `function scaleOutCluster(currentServers, loadIncreasePercent) {
  const needed = currentServers * (1 + loadIncreasePercent / 100);
  return Math.ceil(needed);
}`,
      python: `import math

def scale_out_cluster(current_servers, load_increase_percent):
    needed = current_servers * (1 + load_increase_percent / 100.0)
    return math.ceil(needed)`
    },
    testCases: [
      { input: `10, 50`, expectedOutput: `15`, isHidden: false },
      { input: `8, 25`, expectedOutput: `10`, isHidden: false },
      { input: `16, 75`, expectedOutput: `28`, isHidden: true }
    ],
    hints: ["Multiply current servers by (1 + loadIncreasePercent / 100) and take ceiling."]
  },
  {
    id: "sd-tier1-013",
    tier: 1,
    section: "Fundamentals",
    topic: "Vertical Scaling",
    title: "Vertical Scaling",
    slug: "vertical-scaling",
    difficulty: "Easy",
    pattern: "Scalability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "vertical-scaling", "Scalability"],
    xpReward: 50,
    description: `Understand vertical scaling (scaling up) by upgrading CPU, RAM, or disk speed on a single server. Learn its cost curves, operational simplicity, and hard physical limits.

### Learning Objectives
- Understand when vertical scaling is optimal (early stage, low operational overhead)
- Recognize the hardware ceiling: maximum memory bus bandwidth, socket limits, cost non-linearity
- Analyze downtime requirements during server upgrade maintenance
- Mitigate vertical scaling single point of failure with standby replicas
- Plan the transition inflection point from vertical scaling to horizontal partitioning

### Practical Challenge
Determine whether a given workload (RAM, CPU) fits on the largest available single instance or requires horizontal scaling.`,
    starterCode: {
      javascript: `function canScaleVertically(neededRAM, neededCPU, maxInstanceRAM, maxInstanceCPU) {
  return neededRAM <= maxInstanceRAM && neededCPU <= maxInstanceCPU;
}`,
      python: `def can_scale_vertically(needed_ram, needed_cpu, max_instance_ram, max_instance_cpu):
    return needed_ram <= max_instance_ram and needed_cpu <= max_instance_cpu`
    },
    testCases: [
      { input: `64, 16, 128, 32`, expectedOutput: `true`, isHidden: false },
      { input: `256, 64, 128, 32`, expectedOutput: `false`, isHidden: false },
      { input: `128, 32, 128, 32`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Check if needed RAM <= max RAM and needed CPU <= max CPU."]
  },
  {
    id: "sd-tier1-014",
    tier: 1,
    section: "Fundamentals",
    topic: "Load Balancing",
    title: "Load Balancing",
    slug: "load-balancing",
    difficulty: "Easy",
    pattern: "Load Balancing",
    category: "system-design",
    tags: ["sd-basics", "system-design", "load-balancing", "Load Balancing"],
    xpReward: 50,
    description: `Discover how Load Balancers (LBs) distribute incoming client traffic evenly across upstream server pools to maximize throughput, minimize latency, and ensure high availability.

### Learning Objectives
- Explore standard LB algorithms: Round Robin, Weighted Round Robin, Least Connections, IP Hash
- Differentiate Layer 4 (TCP/UDP transport level) and Layer 7 (HTTP application level) routing
- Understand active health checks and dead host removal
- Analyze SSL termination and connection offloading at the LB layer
- Address DNS load balancing and global server load balancing (GSLB)

### Practical Challenge
Implement Round Robin load balancing: given a list of active servers and request index n, return which server processes request n.`,
    starterCode: {
      javascript: `function roundRobin(servers, requestIndex) {
  if (!servers || servers.length === 0) return null;
  return servers[requestIndex % servers.length];
}`,
      python: `def round_robin(servers, request_index):
    if not servers:
        return None
    return servers[request_index % len(servers)]`
    },
    testCases: [
      { input: `["srv1", "srv2", "srv3"], 4`, expectedOutput: `"srv2"`, isHidden: false },
      { input: `["srvA", "srvB"], 10`, expectedOutput: `"srvA"`, isHidden: false },
      { input: `["srv1"], 99`, expectedOutput: `"srv1"`, isHidden: true }
    ],
    hints: ["Use modulo arithmetic: requestIndex % servers.length."]
  },
  {
    id: "sd-tier1-015",
    tier: 1,
    section: "Fundamentals",
    topic: "Stateless vs Stateful Services",
    title: "Stateless vs Stateful Services",
    slug: "stateless-vs-stateful-services",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "stateless", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Understand the architectural distinction between Stateless and Stateful services. Learn why separating compute from state is the cornerstone of cloud-native scalability.

### Learning Objectives
- Differentiate stateless servers (any node can serve any client) from stateful servers (sticky affinity)
- Store session state in shared distributed caches (Redis) instead of local memory
- Understand sticky sessions and why they impede horizontal auto-scaling
- Explore stateful systems: databases, caches, WebSocket connection hubs
- Build resilient deployment strategies for stateful node updates

### Practical Challenge
Determine if a service configuration is stateless: true if session storage is externalized, false if sessions are stored in local in-memory dictionaries.`,
    starterCode: {
      javascript: `function isServiceStateless(config) {
  return config.sessionStore !== "memory" && config.sessionStore !== "local";
}`,
      python: `def is_service_stateless(config):
    return config.get("sessionStore") not in ("memory", "local")`
    },
    testCases: [
      { input: `{"sessionStore": "redis", "database": "postgres"}`, expectedOutput: `true`, isHidden: false },
      { input: `{"sessionStore": "memory", "database": "postgres"}`, expectedOutput: `false`, isHidden: false },
      { input: `{"sessionStore": "dynamodb"}`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Check whether config.sessionStore is an external store (redis, dynamodb) rather than local memory."]
  },
  {
    id: "sd-tier1-016",
    tier: 1,
    section: "Fundamentals",
    topic: "API Design",
    title: "API Design",
    slug: "api-design",
    difficulty: "Easy",
    pattern: "API Design",
    category: "system-design",
    tags: ["sd-basics", "system-design", "api", "API Design"],
    xpReward: 50,
    description: `Master modern API design principles. Learn how clean endpoint semantics, versioning, pagination, idempotency, and error handling establish developer-friendly contracts.

### Learning Objectives
- Design clean, intuitive, resource-oriented endpoint structures
- Implement pagination patterns: limit/offset vs cursor-based keyset pagination
- Version APIs gracefully without breaking legacy client integrations
- Design consistent error responses with machine-readable error codes and human-readable messages
- Secure APIs with rate limits, CORS policies, and request validation

### Practical Challenge
Format a pagination metadata object given total items, current page (1-indexed), and page size.`,
    starterCode: {
      javascript: `function createPaginationMeta(totalItems, page, pageSize) {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages
  };
}`,
      python: `import math

def create_pagination_meta(total_items, page, page_size):
    total_pages = math.ceil(total_items / page_size)
    return {
        "page": page,
        "pageSize": page_size,
        "totalItems": total_items,
        "totalPages": total_pages,
        "hasNext": page < total_pages
    }`
    },
    testCases: [
      { input: `100, 2, 20`, expectedOutput: `{"page":2,"pageSize":20,"totalItems":100,"totalPages":5,"hasNext":true}`, isHidden: false },
      { input: `45, 5, 10`, expectedOutput: `{"page":5,"pageSize":10,"totalItems":45,"totalPages":5,"hasNext":false}`, isHidden: false }
    ],
    hints: ["Compute totalPages as ceil(totalItems / pageSize) and hasNext as page < totalPages."]
  },
  {
    id: "sd-tier1-017",
    tier: 1,
    section: "Fundamentals",
    topic: "REST APIs",
    title: "REST APIs",
    slug: "rest-apis",
    difficulty: "Easy",
    pattern: "API Design",
    category: "system-design",
    tags: ["sd-basics", "system-design", "rest", "API Design"],
    xpReward: 50,
    description: `Understand the six architectural constraints of REST (Representational State Transfer). Learn HTTP method semantics, status code standards, and stateless client-server interaction.

### Learning Objectives
- Understand standard HTTP verbs: GET (safe/idempotent), POST, PUT (idempotent), PATCH, DELETE
- Master standard HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 500 Server Error
- Understand HATEOAS and RESTful hypermedia concepts
- Implement filtering, sorting, and field selection in REST queries
- Compare REST with GraphQL and gRPC for client-to-server communication

### Practical Challenge
Map an operation and resource state to the most appropriate HTTP status code string (e.g. "200", "201", "404").`,
    starterCode: {
      javascript: `function getRESTStatusCode(operation, found, created) {
  if (operation === "POST" && created) return "201";
  if (!found) return "404";
  return "200";
}`,
      python: `def get_rest_status_code(operation, found, created):
    if operation == "POST" and created:
        return "201"
    if not found:
        return "404"
    return "200"`
    },
    testCases: [
      { input: `"POST", true, true`, expectedOutput: `"201"`, isHidden: false },
      { input: `"GET", false, false`, expectedOutput: `"404"`, isHidden: false },
      { input: `"GET", true, false`, expectedOutput: `"200"`, isHidden: true }
    ],
    hints: ["Return 201 for successful resource creation, 404 if not found, 200 otherwise."]
  },
  {
    id: "sd-tier1-018",
    tier: 1,
    section: "Fundamentals",
    topic: "RPC",
    title: "RPC",
    slug: "rpc",
    difficulty: "Easy",
    pattern: "API Design",
    category: "system-design",
    tags: ["sd-basics", "system-design", "rpc", "API Design"],
    xpReward: 50,
    description: `Learn Remote Procedure Call (RPC) architectures and modern frameworks like gRPC. Discover how binary serialization and HTTP/2 multiplexing optimize internal service communication.

### Learning Objectives
- Contrast RPC (action-oriented: invoke function on remote node) with REST (resource-oriented)
- Understand Protocol Buffers (Protobuf) schema definitions and binary encoding efficiency
- Benefit from HTTP/2 features in gRPC: multiplexing, header compression, bidirectional streaming
- Implement code generation for strongly-typed cross-language client stubs
- Choose between REST for public APIs and gRPC for internal service-to-service backbones

### Practical Challenge
Calculate bandwidth savings percentage when switching from JSON payload size to compact Protobuf binary payload size.`,
    starterCode: {
      javascript: `function calculateBandwidthSavings(jsonBytes, protobufBytes) {
  const saved = jsonBytes - protobufBytes;
  return Math.round((saved / jsonBytes) * 100);
}`,
      python: `def calculate_bandwidth_savings(json_bytes, protobuf_bytes):
    saved = json_bytes - protobuf_bytes
    return round((saved / json_bytes) * 100)`
    },
    testCases: [
      { input: `1000, 200`, expectedOutput: `80`, isHidden: false },
      { input: `500, 250`, expectedOutput: `50`, isHidden: false },
      { input: `400, 100`, expectedOutput: `75`, isHidden: true }
    ],
    hints: ["Calculate (jsonBytes - protobufBytes) / jsonBytes * 100 and round to integer."]
  },
  {
    id: "sd-tier1-019",
    tier: 1,
    section: "Fundamentals",
    topic: "HTTP Basics",
    title: "HTTP Basics",
    slug: "http-basics",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "http", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Explore HTTP fundamentals across HTTP/1.1, HTTP/2, and HTTP/3 (QUIC). Understand connection lifecycles, keep-alive headers, pipelining, head-of-line blocking, and TLS handshakes.

### Learning Objectives
- Trace the lifecycle of an HTTP request from DNS lookup and TCP 3-way handshake to TLS exchange
- Understand HTTP/1.1 persistent connections and head-of-line blocking issues
- Learn HTTP/2 binary framing, streams, multiplexing, and server push
- Explore HTTP/3 over QUIC running over UDP to eliminate transport head-of-line blocking
- Leverage caching headers: Cache-Control, ETag, and If-None-Match for network reduction

### Practical Challenge
Determine if a response is cacheable based on Cache-Control header value ("no-store", "private", "public, max-age=3600").`,
    starterCode: {
      javascript: `function isResponseCacheable(cacheControlHeader) {
  if (!cacheControlHeader) return false;
  const val = cacheControlHeader.toLowerCase();
  if (val.includes("no-store") || val.includes("no-cache")) return false;
  return val.includes("max-age") || val.includes("public");
}`,
      python: `def is_response_cacheable(cache_control_header):
    if not cache_control_header:
        return False
    val = cache_control_header.lower()
    if "no-store" in val or "no-cache" in val:
        return False
    return "max-age" in val or "public" in val`
    },
    testCases: [
      { input: `"public, max-age=3600"`, expectedOutput: `true`, isHidden: false },
      { input: `"no-store, private"`, expectedOutput: `false`, isHidden: false },
      { input: `""`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Check if header contains max-age or public, and does not contain no-store or no-cache."]
  },
  {
    id: "sd-tier1-020",
    tier: 1,
    section: "Fundamentals",
    topic: "WebSockets",
    title: "WebSockets",
    slug: "websockets",
    difficulty: "Easy",
    pattern: "API Design",
    category: "system-design",
    tags: ["sd-basics", "system-design", "websockets", "realtime", "API Design"],
    xpReward: 50,
    description: `Discover bidirectional real-time communication with WebSockets. Contrast WebSockets with short polling, long polling, and Server-Sent Events (SSE) for low-latency live applications.

### Learning Objectives
- Understand the WebSocket upgrade handshake over HTTP/1.1
- Differentiate full-duplex WebSockets from half-duplex HTTP and unidirectional SSE
- Scale WebSocket connection servers to millions of concurrent open sockets
- Handle connection heartbeat pings, disconnections, and reconnection storms
- Broadcast messages across multi-node WebSocket clusters using Redis Pub/Sub

### Practical Challenge
Calculate total memory required (in MB) to hold open concurrent WebSocket connections given memory overhead per socket in KB.`,
    starterCode: {
      javascript: `function calculateWebSocketMemoryMB(concurrentConnections, memoryPerSocketKB) {
  const totalKB = concurrentConnections * memoryPerSocketKB;
  return Math.round(totalKB / 1024);
}`,
      python: `def calculate_web_socket_memory_mb(concurrent_connections, memory_per_socket_kb):
    total_kb = concurrent_connections * memory_per_socket_kb
    return round(total_kb / 1024)`
    },
    testCases: [
      { input: `100000, 10`, expectedOutput: `977`, isHidden: false },
      { input: `50000, 20`, expectedOutput: `977`, isHidden: false },
      { input: `10000, 5`, expectedOutput: `49`, isHidden: true }
    ],
    hints: ["Multiply connections by memoryPerSocketKB and divide by 1024."]
  },
  {
    id: "sd-tier1-021",
    tier: 1,
    section: "Fundamentals",
    topic: "Authentication",
    title: "Authentication",
    slug: "authentication",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "auth", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Master authentication patterns in distributed architectures. Compare stateful session cookies with stateless JSON Web Tokens (JWT) and modern OAuth 2.0 / OpenID Connect flows.

### Learning Objectives
- Differentiate Authentication (verifying identity) from Authorization (verifying permissions)
- Understand JWT anatomy: Header, Payload, and Cryptographic Signature
- Handle token revocation and blacklisting in stateless JWT architectures
- Design secure token refresh token rotation strategies
- Prevent CSRF, XSS, and credential-stuffing attacks at the edge gateway

### Practical Challenge
Validate whether a JWT token expiration timestamp (Unix epoch seconds) is still valid relative to current time.`,
    starterCode: {
      javascript: `function isTokenValid(tokenExpSeconds, currentSeconds) {
  return currentSeconds < tokenExpSeconds;
}`,
      python: `def is_token_valid(token_exp_seconds, current_seconds):
    return current_seconds < token_exp_seconds`
    },
    testCases: [
      { input: `1700001000, 1700000000`, expectedOutput: `true`, isHidden: false },
      { input: `1700000000, 1700000500`, expectedOutput: `false`, isHidden: false },
      { input: `1700000000, 1700000000`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["A token is valid only when current timestamp is strictly less than token expiration."]
  },
  {
    id: "sd-tier1-022",
    tier: 1,
    section: "Fundamentals",
    topic: "Authorization",
    title: "Authorization",
    slug: "authorization",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "authorization", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Explore access control models: Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC). Learn how authorization is enforced efficiently in distributed microservices.

### Learning Objectives
- Compare RBAC (coarse-grained roles) with ABAC (fine-grained contextual attributes)
- Enforce authorization policies at API Gateway vs individual downstream microservices
- Understand Access Control Lists (ACLs) and policy-as-code engines (Open Policy Agent - OPA)
- Cache authorization decisions safely without stale permission windows
- Implement multi-tenant data isolation and tenancy authorization rules

### Practical Challenge
Check if a user possesses the required permission string given their assigned roles and a role-to-permissions mapping dictionary.`,
    starterCode: {
      javascript: `function hasPermission(userRoles, rolePermissionsMap, requiredPermission) {
  for (const role of userRoles) {
    const permissions = rolePermissionsMap[role] || [];
    if (permissions.includes(requiredPermission)) return true;
  }
  return false;
}`,
      python: `def has_permission(user_roles, role_permissions_map, required_permission):
    for role in user_roles:
        perms = role_permissions_map.get(role, [])
        if required_permission in perms:
            return True
    return False`
    },
    testCases: [
      { input: `["editor"], {"admin": ["create", "delete", "edit"], "editor": ["edit", "create"]}, "delete"`, expectedOutput: `false`, isHidden: false },
      { input: `["admin"], {"admin": ["create", "delete", "edit"], "editor": ["edit"]}, "delete"`, expectedOutput: `true`, isHidden: false }
    ],
    hints: ["Iterate through userRoles and check if requiredPermission is present in rolePermissionsMap."]
  },
  {
    id: "sd-tier1-023",
    tier: 1,
    section: "Fundamentals",
    topic: "Rate Limiting",
    title: "Rate Limiting",
    slug: "rate-limiting",
    difficulty: "Easy",
    pattern: "Reliability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "rate-limiting", "Reliability"],
    xpReward: 50,
    description: `Understand rate limiting algorithms to protect services from abusive traffic, brute-force attacks, and noisy neighbors. Learn Token Bucket, Leaky Bucket, and Sliding Window logs.

### Learning Objectives
- Protect systems from denial-of-service and runaway client retry loops
- Compare algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Counter
- Implement distributed rate limiting across server clusters using Redis and Lua scripts
- Return standard HTTP 429 Too Many Requests with Retry-After headers
- Establish tiered rate limits based on user API tier and IP address

### Practical Challenge
Implement a fixed-window request counter: return true if current count + 1 <= limit, otherwise false.`,
    starterCode: {
      javascript: `function allowRequest(currentCount, limit) {
  return currentCount + 1 <= limit;
}`,
      python: `def allow_request(current_count, limit):
    return current_count + 1 <= limit`
    },
    testCases: [
      { input: `5, 10`, expectedOutput: `true`, isHidden: false },
      { input: `10, 10`, expectedOutput: `false`, isHidden: false },
      { input: `0, 1`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Return true if current count + 1 is less than or equal to limit."]
  },
  {
    id: "sd-tier1-024",
    tier: 1,
    section: "Fundamentals",
    topic: "Caching Basics",
    title: "Caching Basics",
    slug: "caching-basics",
    difficulty: "Easy",
    pattern: "Performance",
    category: "system-design",
    tags: ["sd-basics", "system-design", "caching", "Performance"],
    xpReward: 50,
    description: `Discover how caching stores hot data in rapid memory layers (RAM) to avoid expensive database queries and disk operations. Master eviction policies like LRU, LFU, and FIFO.

### Learning Objectives
- Understand the latency hierarchy: CPU registers < L1/L2/L3 Cache < RAM < NVMe SSD < Network Disk
- Master cache eviction policies: Least Recently Used (LRU), Least Frequently Used (LFU), First In First Out (FIFO)
- Understand cache hit ratio and its exponential effect on database offload
- Mitigate common caching pathologies: Cache Penetration, Cache Breakdown, Cache Avalanche
- Choose appropriate TTL (Time to Live) values for volatile vs static content

### Practical Challenge
Calculate cache hit ratio percentage given cache hits and total requests.`,
    starterCode: {
      javascript: `function calculateCacheHitRatio(hits, total) {
  if (total === 0) return 0;
  return Math.round((hits / total) * 100);
}`,
      python: `def calculate_cache_hit_ratio(hits, total):
    if total == 0:
        return 0
    return round((hits / total) * 100)`
    },
    testCases: [
      { input: `850, 1000`, expectedOutput: `85`, isHidden: false },
      { input: `400, 500`, expectedOutput: `80`, isHidden: false },
      { input: `0, 100`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Divide hits by total, multiply by 100, and round to integer."]
  },
  {
    id: "sd-tier1-025",
    tier: 1,
    section: "Fundamentals",
    topic: "CAP Theorem",
    title: "CAP Theorem",
    slug: "cap-theorem",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "cap-theorem", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Master Eric Brewer's CAP Theorem. Learn why a distributed data store can guarantee at most two of Consistency, Availability, and Partition Tolerance, and why Partition Tolerance is mandatory over physical networks.

### Learning Objectives
- Define the 3 pillars: Consistency (linearizability), Availability (every non-failing node returns non-error response), Partition Tolerance (network dropped messages)
- Understand why network partitions (P) are unavoidable in real-world physical networks
- Compare CP systems (e.g. HBase, Zookeeper) with AP systems (e.g. Cassandra, DynamoDB)
- Understand PACELC theorem extension (If Partition: Availability or Consistency; Else: Latency or Consistency)
- Make pragmatic CAP trade-offs based on business domain (e.g., banking vs social feed)

### Practical Challenge
Given system requirements, determine whether the architecture should prioritize "CP" (Consistency during partition) or "AP" (Availability during partition). Return "CP" if consistency is strictly mandatory, else "AP".`,
    starterCode: {
      javascript: `function chooseCAPTradeoff(requireStrictConsistency) {
  return requireStrictConsistency ? "CP" : "AP";
}`,
      python: `def choose_cap_tradeoff(require_strict_consistency):
    return "CP" if require_strict_consistency else "AP"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"CP"`, isHidden: false },
      { input: `false`, expectedOutput: `"AP"`, isHidden: false }
    ],
    hints: ["In the presence of a network partition, you must choose either Consistency (CP) or Availability (AP)."]
  },
  {
    id: "sd-tier1-026",
    tier: 1,
    section: "Fundamentals",
    topic: "Consistency Models",
    title: "Consistency Models",
    slug: "consistency-models",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "consistency", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Explore the spectrum of consistency models in distributed data stores: Strong Consistency, Sequential Consistency, Causal Consistency, Read-Your-Writes, and Eventual Consistency.

### Learning Objectives
- Contrast Strong Consistency (linearizability) with Eventual Consistency
- Understand Client-Centric consistency models: Monotonic Reads, Monotonic Writes, Read-Your-Writes
- Analyze how quorum configurations (R + W > N) achieve strong reads in replica clusters
- Understand the latency and throughput penalty of strict synchronization
- Choose the right consistency model matching the business context

### Practical Challenge
Check if a cluster satisfies strong consistency using Quorum: return true if Read Quorum (R) + Write Quorum (W) > Total Replicas (N).`,
    starterCode: {
      javascript: `function isQuorumStrong(r, w, n) {
  return (r + w) > n;
}`,
      python: `def is_quorum_strong(r, w, n):
    return (r + w) > n`
    },
    testCases: [
      { input: `2, 2, 3`, expectedOutput: `true`, isHidden: false },
      { input: `1, 1, 3`, expectedOutput: `false`, isHidden: false },
      { input: `3, 3, 5`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["In quorum replication, strong consistency is guaranteed when R + W > N."]
  },
  {
    id: "sd-tier1-027",
    tier: 1,
    section: "Fundamentals",
    topic: "ACID",
    title: "ACID",
    slug: "acid",
    difficulty: "Easy",
    pattern: "Reliability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "acid", "database", "Reliability"],
    xpReward: 50,
    description: `Master ACID guarantees for database transactions: Atomicity, Consistency, Isolation, and Durability. Learn how write-ahead logs (WAL) and MVCC make reliable transactions possible.

### Learning Objectives
- Atomicity: "All or nothing" execution via rollback logs
- Consistency: State transitions strictly preserve database schema constraints and invariants
- Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable
- Durability: Committed transactions persist across power outages via Write-Ahead Logging (WAL)
- Understand the performance cost of Serializable isolation vs Snapshot Isolation (MVCC)

### Practical Challenge
Determine if a database transaction should commit or rollback: true (commit) if all operations succeed, false (rollback) if any fail.`,
    starterCode: {
      javascript: `function evaluateTransaction(operationsStatus) {
  return operationsStatus.every(status => status === true);
}`,
      python: `def evaluate_transaction(operations_status):
    return all(status is True for status in operations_status)`
    },
    testCases: [
      { input: `[true, true, true]`, expectedOutput: `true`, isHidden: false },
      { input: `[true, false, true]`, expectedOutput: `false`, isHidden: false },
      { input: `[false]`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["By Atomicity, a transaction can only commit if all operations succeed without failure."]
  },
  {
    id: "sd-tier1-028",
    tier: 1,
    section: "Fundamentals",
    topic: "BASE",
    title: "BASE",
    slug: "base",
    difficulty: "Easy",
    pattern: "Distributed Systems Fundamentals",
    category: "system-design",
    tags: ["sd-basics", "system-design", "base", "Distributed Systems Fundamentals"],
    xpReward: 50,
    description: `Explore the BASE model: Basically Available, Soft state, Eventual consistency. Learn why modern NoSQL systems prioritize availability and scalability over rigid ACID locks.

### Learning Objectives
- Contrast ACID (pessimistic, immediate consistency) with BASE (optimistic, eventual consistency)
- Basically Available: System guarantees availability by degrading functionality rather than failing
- Soft State: System state may change over time even without client input due to background convergence
- Eventual Consistency: Given no further updates, all replicas eventually converge to the same value
- Implement asynchronous reconciliation and anti-entropy background jobs

### Practical Challenge
Check if replica values have converged to identical state (eventual consistency reached).`,
    starterCode: {
      javascript: `function hasConverged(replicas) {
  if (replicas.length === 0) return true;
  return replicas.every(val => val === replicas[0]);
}`,
      python: `def has_converged(replicas):
    if not replicas:
        return True
    return all(val == replicas[0] for val in replicas)`
    },
    testCases: [
      { input: `["val1", "val1", "val1"]`, expectedOutput: `true`, isHidden: false },
      { input: `["val1", "val2", "val1"]`, expectedOutput: `false`, isHidden: false },
      { input: `["ok"]`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Return true if every replica value is identical to the first replica value."]
  },
  {
    id: "sd-tier1-029",
    tier: 1,
    section: "Fundamentals",
    topic: "Idempotency",
    title: "Idempotency",
    slug: "idempotency",
    difficulty: "Easy",
    pattern: "API Design",
    category: "system-design",
    tags: ["sd-basics", "system-design", "idempotency", "API Design"],
    xpReward: 50,
    description: `Understand Idempotency: the property that performing an operation multiple times produces the exact same outcome as performing it once. Essential for safe network retries.

### Learning Objectives
- Understand why network timeouts cause duplicate requests (at-least-once delivery)
- Implement Idempotency Keys in payment processing and financial mutations
- Compare naturally idempotent HTTP verbs (GET, PUT, DELETE) with non-idempotent verbs (POST)
- Store processed request tokens in distributed key-value stores with TTL
- Avoid double-charging and duplicate order placement in e-commerce architectures

### Practical Challenge
Implement an idempotency cache check: if key already exists, return cached result; otherwise process, store in cache, and return result.`,
    starterCode: {
      javascript: `function processWithIdempotency(cache, key, value) {
  if (Object.prototype.hasOwnProperty.call(cache, key)) {
    return { status: "cached", result: cache[key] };
  }
  cache[key] = value;
  return { status: "processed", result: value };
}`,
      python: `def process_with_idempotency(cache, key, value):
    if key in cache:
        return {"status": "cached", "result": cache[key]}
    cache[key] = value
    return {"status": "processed", "result": value}`
    },
    testCases: [
      { input: `{}, "txn_123", "paid"`, expectedOutput: `{"status":"processed","result":"paid"}`, isHidden: false },
      { input: `{"txn_123": "paid"}, "txn_123", "paid"`, expectedOutput: `{"status":"cached","result":"paid"}`, isHidden: false }
    ],
    hints: ["Check if key exists in cache dictionary. If yes, return cached; else store and return processed."]
  },
  {
    id: "sd-tier1-030",
    tier: 1,
    section: "Fundamentals",
    topic: "Fault Tolerance",
    title: "Fault Tolerance",
    slug: "fault-tolerance",
    difficulty: "Easy",
    pattern: "Reliability",
    category: "system-design",
    tags: ["sd-basics", "system-design", "fault-tolerance", "Reliability"],
    xpReward: 50,
    description: `Explore Fault Tolerance: the ability of a system to continue operating without interruption despite the failure of one or more internal components or subsystems.

### Learning Objectives
- Understand graceful degradation and load shedding during systemic stress
- Implement redundancy: N+1, 2N, and geographic multi-cluster failover
- Isolate failure domains using Bulkhead patterns
- Prevent cascading failures across downstream microservice call graphs
- Conduct chaos engineering experiments to validate resilience hypotheses

### Practical Challenge
Calculate system availability given active and standby independent nodes each having availability A (0 to 1). Formula: 1 - (1 - A)^2. Round to 4 decimal places.`,
    starterCode: {
      javascript: `function calculateRedundantAvailability(nodeAvailability) {
  const failureProb = 1 - nodeAvailability;
  const jointFailureProb = failureProb * failureProb;
  const systemAvail = 1 - jointFailureProb;
  return Math.round(systemAvail * 10000) / 10000;
}`,
      python: `def calculate_redundant_availability(node_availability):
    failure_prob = 1.0 - node_availability
    joint_failure = failure_prob * failure_prob
    return round(1.0 - joint_failure, 4)`
    },
    testCases: [
      { input: `0.9`, expectedOutput: `0.99`, isHidden: false },
      { input: `0.99`, expectedOutput: `0.9999`, isHidden: false },
      { input: `0.95`, expectedOutput: `0.9975`, isHidden: true }
    ],
    hints: ["System fails only when BOTH nodes fail simultaneously: 1 - (1 - A)^2."]
  }
];
