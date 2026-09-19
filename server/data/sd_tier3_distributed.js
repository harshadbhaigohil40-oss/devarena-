/**
 * TIER 3 — DISTRIBUTED SYSTEMS (41 Topics)
 * Difficulty: Medium – Hard
 * Patterns: Distributed Systems, Consensus, Replication, Messaging, Event-Driven Architecture, Fault Tolerance, Consistency, Partitioning, Observability
 */

module.exports = [
  {
    id: "sd-tier3-001",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Systems Fundamentals",
    title: "Distributed Systems Fundamentals",
    slug: "distributed-systems-fundamentals",
    difficulty: "Medium",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "distributed-systems", "Distributed Systems"],
    xpReward: 100,
    description: `Understand the fundamental characteristics and challenges of Distributed Systems. Master the Fallacies of Distributed Computing: network is not reliable, latency is not zero, bandwidth is not infinite.

### Learning Objectives
- Master the 8 Fallacies of Distributed Computing formulated by L. Peter Deutsch
- Understand partial failure: components fail independently while other nodes continue operating
- Overcome physical clock unreliability and lack of global synchronized shared memory
- Handle non-deterministic network delays, message drops, and packet reordering
- Design systems with crash-recovery and Byzantine fault models

### Practical Challenge
Identify if an assumption is a known fallacy of distributed computing: return true if assumption is in the standard fallacies list.`,
    starterCode: {
      javascript: `function isDistributedFallacy(assumption) {
  const fallacies = [
    "network is reliable",
    "latency is zero",
    "bandwidth is infinite",
    "network is secure",
    "topology doesn't change",
    "there is one administrator",
    "transport cost is zero",
    "network is homogeneous"
  ];
  return fallacies.includes(assumption.toLowerCase().trim());
}`,
      python: `def is_distributed_fallacy(assumption):
    fallacies = {
        "network is reliable",
        "latency is zero",
        "bandwidth is infinite",
        "network is secure",
        "topology doesn't change",
        "there is one administrator",
        "transport cost is zero",
        "network is homogeneous"
    }
    return assumption.lower().strip() in fallacies`
    },
    testCases: [
      { input: `"network is reliable"`, expectedOutput: `true`, isHidden: false },
      { input: `"memory is finite"`, expectedOutput: `false`, isHidden: false },
      { input: `"latency is zero"`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Check if assumption matches one of the 8 canonical fallacies of distributed computing."]
  },
  {
    id: "sd-tier3-002",
    tier: 3,
    section: "Distributed Systems",
    topic: "CAP Theorem Deep Dive",
    title: "CAP Theorem Deep Dive",
    slug: "cap-theorem-deep-dive",
    difficulty: "Medium",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "cap", "Consistency"],
    xpReward: 100,
    description: `Deep-dive into Brewer's CAP Theorem and the PACELC extension. Understand the formal definitions of Linearizability (C), Liveness (A), and Network Partitions (P) in distributed data stores.

### Learning Objectives
- Formalize CAP definitions: C is Linearizability, A is every non-failing node returns successful response
- Understand PACELC theorem: If Partition (P), trade Availability (A) vs Consistency (C); Else (E), trade Latency (L) vs Consistency (C)
- Analyze why MongoDB, Spanner, and ZooKeeper are CP / PC/EC systems
- Analyze why Cassandra and DynamoDB are AP / PA/EL systems
- Design systems that dynamically toggle consistency levels per query

### Practical Challenge
Classify system under PACELC: return "PA/EL" if prioritized for availability and low latency, else "PC/EC" if prioritized for consistency.`,
    starterCode: {
      javascript: `function classifyPACELC(prioritizeAvailabilityAndLatency) {
  return prioritizeAvailabilityAndLatency ? "PA/EL" : "PC/EC";
}`,
      python: `def classify_pacelc(prioritize_availability_and_latency):
    return "PA/EL" if prioritize_availability_and_latency else "PC/EC"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"PA/EL"`, isHidden: false },
      { input: `false`, expectedOutput: `"PC/EC"`, isHidden: false }
    ],
    hints: ["PA/EL trades for Availability during partition and Latency in normal operation."]
  },
  {
    id: "sd-tier3-003",
    tier: 3,
    section: "Distributed Systems",
    topic: "Consistency Models",
    title: "Consistency Models",
    slug: "consistency-models-deep-dive",
    difficulty: "Hard",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "consistency", "Consistency"],
    xpReward: 200,
    description: `Explore the rigorous hierarchy of distributed consistency models: Strict Consistency, Linearizability, Sequential Consistency, Causal Consistency, and Eventual Consistency.

### Learning Objectives
- Understand the mathematical ordering guarantees of Linearizability (real-time wall clock ordering)
- Learn Sequential Consistency (operations occur in some sequential order consistent with all processes)
- Explore Causal Consistency: operations causally related must be seen in order; concurrent ops can be seen differently
- Implement Monotonic Read and Read-Your-Writes consistency for client session guarantees
- Apply Conflict-Free Replicated Data Types (CRDTs) to converge without locks

### Practical Challenge
Order consistency models from strongest to weakest: return index of model in ordered array.`,
    starterCode: {
      javascript: `function getConsistencyStrengthRank(model) {
  const ranking = ["Linearizability", "Sequential", "Causal", "Eventual"];
  return ranking.indexOf(model);
}`,
      python: `def get_consistency_strength_rank(model):
    ranking = ["Linearizability", "Sequential", "Causal", "Eventual"]
    return ranking.index(model) if model in ranking else -1`
    },
    testCases: [
      { input: `"Linearizability"`, expectedOutput: `0`, isHidden: false },
      { input: `"Eventual"`, expectedOutput: `3`, isHidden: false },
      { input: `"Causal"`, expectedOutput: `2`, isHidden: true }
    ],
    hints: ["0 is strongest (Linearizability), 3 is weakest (Eventual)."]
  },
  {
    id: "sd-tier3-004",
    tier: 3,
    section: "Distributed Systems",
    topic: "Strong Consistency",
    title: "Strong Consistency",
    slug: "strong-consistency",
    difficulty: "Hard",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "linearizability", "Consistency"],
    xpReward: 200,
    description: `Master Strong Consistency (Linearizability). Learn how distributed algorithms guarantee that once a write completes, all subsequent reads across all nodes immediately observe that write or a newer one.

### Learning Objectives
- Understand linearizability: the illusion of a single atomic register despite multi-node replication
- Implement synchronous consensus (Raft, Paxos, Spanner TrueTime) for linearizable reads and writes
- Analyze the latency penalty: reads and writes must coordinate across quorums
- Avoid stale reads on partition by preventing split-brain leader isolation
- Apply strong consistency to financial ledger balances and inventory decrementing

### Practical Challenge
Verify read value matches latest completed write: return true if readValue === latestCompletedWrite.`,
    starterCode: {
      javascript: `function verifyLinearizableRead(readValue, latestCompletedWrite) {
  return readValue === latestCompletedWrite;
}`,
      python: `def verify_linearizable_read(read_value, latest_completed_write):
    return read_value == latest_completed_write`
    },
    testCases: [
      { input: `"v2", "v2"`, expectedOutput: `true`, isHidden: false },
      { input: `"v1", "v2"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Under strong consistency, reads must reflect the latest completed write."]
  },
  {
    id: "sd-tier3-005",
    tier: 3,
    section: "Distributed Systems",
    topic: "Eventual Consistency",
    title: "Eventual Consistency",
    slug: "eventual-consistency",
    difficulty: "Medium",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "eventual-consistency", "Consistency"],
    xpReward: 100,
    description: `Understand Eventual Consistency. Learn how asynchronous replication allows nodes to accept fast writes locally and converge across replicas in the background via anti-entropy protocols.

### Learning Objectives
- Trade immediate consistency for ultra-high availability and low write latency
- Handle convergence using Merkle Trees, Read Repair, and hinted handoff
- Recognize temporary inconsistency windows where different nodes return different data
- Implement Last-Write-Wins (LWW) conflict resolution using timestamps
- Build resilient social feeds, review systems, and view counters using eventual consistency

### Practical Challenge
Simulate Read Repair: if replica value is older than primary, return updated replica value matching primary.`,
    starterCode: {
      javascript: `function performReadRepair(primaryVal, replicaVal) {
  return replicaVal !== primaryVal ? primaryVal : replicaVal;
}`,
      python: `def perform_read_repair(primary_val, replica_val):
    return primary_val if replica_val != primary_val else replica_val`
    },
    testCases: [
      { input: `"new_state", "stale_state"`, expectedOutput: `"new_state"`, isHidden: false },
      { input: `"synced", "synced"`, expectedOutput: `"synced"`, isHidden: false }
    ],
    hints: ["Read repair overwrites the stale replica with the authoritative primary value."]
  },
  {
    id: "sd-tier3-006",
    tier: 3,
    section: "Distributed Systems",
    topic: "Causal Consistency",
    title: "Causal Consistency",
    slug: "causal-consistency",
    difficulty: "Hard",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "vector-clocks", "Consistency"],
    xpReward: 200,
    description: `Explore Causal Consistency and Lamport Timestamps / Vector Clocks. Ensure that causally related events (e.g. a question and its answer) are observed in identical order across all nodes.

### Learning Objectives
- Understand causal relationships: event A causes event B (happened-before relation A -> B)
- Use Lamport Timestamps to establish a partial causal ordering without physical synchronized clocks
- Implement Vector Clocks to detect concurrent conflicting updates vs causally ordered updates
- Ensure chat replies are never displayed before the original message being answered
- Preserve causality while maintaining high availability during network partitions

### Practical Challenge
Determine if clock A causally precedes clock B using 2-node vector clocks: return true if A[0] <= B[0] and A[1] <= B[1] and at least one is strictly less.`,
    starterCode: {
      javascript: `function causallyPrecedes(clockA, clockB) {
  const leq = clockA[0] <= clockB[0] && clockA[1] <= clockB[1];
  const strictlyLess = clockA[0] < clockB[0] || clockA[1] < clockB[1];
  return leq && strictlyLess;
}`,
      python: `def causally_precedes(clock_a, clock_b):
    leq = clock_a[0] <= clock_b[0] and clock_a[1] <= clock_b[1]
    strictly_less = clock_a[0] < clock_b[0] or clock_a[1] < clock_b[1]
    return leq and strictly_less`
    },
    testCases: [
      { input: `[1, 2], [2, 2]`, expectedOutput: `true`, isHidden: false },
      { input: `[2, 1], [1, 2]`, expectedOutput: `false`, isHidden: false },
      { input: `[1, 1], [1, 1]`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["A precedes B if all elements of A <= B and at least one element is strictly less."]
  },
  {
    id: "sd-tier3-007",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Transactions",
    title: "Distributed Transactions",
    slug: "distributed-transactions",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "transactions", "saga", "Distributed Systems"],
    xpReward: 200,
    description: `Learn how to maintain data consistency across multiple independent microservices and databases. Compare Two-Phase Commit (2PC) with the asynchronous Saga Pattern.

### Learning Objectives
- Understand why traditional ACID database transactions cannot span independently deployed microservices
- Master the Saga Pattern: sequence of local transactions with compensating transactions on failure
- Compare Choreography-based Sagas (event driven) with Orchestration-based Sagas (central orchestrator)
- Implement compensating transactions (e.g. refund payment if seat reservation fails)
- Design idempotency keys into every step of the distributed transaction

### Practical Challenge
Simulate Saga execution: iterate through step results. If any step fails, return "compensate", otherwise "success".`,
    starterCode: {
      javascript: `function executeSaga(steps) {
  for (const step of steps) {
    if (step !== true) return "compensate";
  }
  return "success";
}`,
      python: `def execute_saga(steps):
    for step in steps:
        if not step:
            return "compensate"
    return "success"`
    },
    testCases: [
      { input: `[true, true, true]`, expectedOutput: `"success"`, isHidden: false },
      { input: `[true, false, true]`, expectedOutput: `"compensate"`, isHidden: false }
    ],
    hints: ["If any step in the saga returns false, trigger compensating transactions."]
  },
  {
    id: "sd-tier3-008",
    tier: 3,
    section: "Distributed Systems",
    topic: "Two-Phase Commit",
    title: "Two-Phase Commit",
    slug: "two-phase-commit",
    difficulty: "Hard",
    pattern: "Consensus",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "2pc", "Consensus"],
    xpReward: 200,
    description: `Understand Two-Phase Commit (2PC) protocol: Phase 1 (Prepare / Vote) and Phase 2 (Commit / Abort). Learn why blocking coordinator failures make 2PC problematic in cloud environments.

### Learning Objectives
- Phase 1 (Prepare): Coordinator asks all cohorts if they can commit; cohorts acquire locks and reply YES/NO
- Phase 2 (Commit): If all reply YES, coordinator writes commit log and sends COMMIT; else ABORT
- Understand the blocking nature of 2PC: cohorts hold locks indefinitely if the coordinator crashes mid-protocol
- Analyze the throughput penalty of holding multi-database distributed locks
- Contrast 2PC with non-blocking Three-Phase Commit (3PC) and asynchronous Sagas

### Practical Challenge
Evaluate 2PC vote: return "COMMIT" if all cohort votes are "YES", otherwise "ABORT".`,
    starterCode: {
      javascript: `function evaluate2PC(votes) {
  return votes.every(v => v === "YES") ? "COMMIT" : "ABORT";
}`,
      python: `def evaluate_2pc(votes):
    return "COMMIT" if all(v == "YES" for v in votes) else "ABORT"`
    },
    testCases: [
      { input: `["YES", "YES", "YES"]`, expectedOutput: `"COMMIT"`, isHidden: false },
      { input: `["YES", "NO", "YES"]`, expectedOutput: `"ABORT"`, isHidden: false }
    ],
    hints: ["A 2PC coordinator only issues COMMIT if every single cohort votes YES."]
  },
  {
    id: "sd-tier3-009",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Locks",
    title: "Distributed Locks",
    slug: "distributed-locks",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "locks", "redlock", "Distributed Systems"],
    xpReward: 200,
    description: `Explore Distributed Locks using Redis (Redlock algorithm), Apache ZooKeeper (ephemeral sequential nodes), and etcd. Learn how to prevent race conditions across server clusters.

### Learning Objectives
- Prevent duplicate resource mutation across independent distributed worker nodes
- Implement atomic lock acquisition in Redis using \`SET key val NX PX leaseTime\`
- Use Fencing Tokens (monotonically increasing IDs) to reject delayed requests from nodes experiencing GC pauses
- Understand the Redlock consensus algorithm across multiple independent Redis masters
- Address lock lease expirations while tasks are still actively executing (lock renewal heartbeats)

### Practical Challenge
Simulate distributed lock acquire: return true if lock is acquired with random token, false if already held.`,
    starterCode: {
      javascript: `function acquireDistributedLock(lockMap, resource, token) {
  if (lockMap[resource]) return false;
  lockMap[resource] = token;
  return true;
}`,
      python: `def acquire_distributed_lock(lock_map, resource, token):
    if resource in lock_map:
        return False
    lock_map[resource] = token
    return True`
    },
    testCases: [
      { input: `{}, "invoice_100", "uuid_1"`, expectedOutput: `true`, isHidden: false },
      { input: `{"invoice_100": "uuid_old"}, "invoice_100", "uuid_2"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["If resource is already locked, return false; otherwise set token and return true."]
  },
  {
    id: "sd-tier3-010",
    tier: 3,
    section: "Distributed Systems",
    topic: "Leader Election",
    title: "Leader Election",
    slug: "leader-election",
    difficulty: "Hard",
    pattern: "Consensus",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "leader-election", "Consensus"],
    xpReward: 200,
    description: `Master Leader Election algorithms: Bully Algorithm, Raft Leader Election, and ZooKeeper Ephemeral Nodes. Coordinate distributed clusters by appointing a single authoritative leader node.

### Learning Objectives
- Understand why distributed systems elect leaders (coordinate writes, assign tasks, manage partitions)
- Explore the Bully Algorithm: node with the highest ID assumes leadership when the current leader dies
- Learn Raft Leader Election: randomized election timers, RequestVote RPCs, and majority term quorum
- Prevent Split-Brain: guarantee that only one leader can exist in any given term
- Handle graceful leadership resignation during rolling node upgrades

### Practical Challenge
Simulate Bully Algorithm: given an array of surviving active node IDs, return the highest node ID as leader.`,
    starterCode: {
      javascript: `function electLeaderBully(activeNodeIds) {
  if (!activeNodeIds || activeNodeIds.length === 0) return null;
  return Math.max(...activeNodeIds);
}`,
      python: `def elect_leader_bully(active_node_ids):
    if not active_node_ids:
        return None
    return max(active_node_ids)`
    },
    testCases: [
      { input: `[1, 5, 3, 9, 2]`, expectedOutput: `9`, isHidden: false },
      { input: `[10, 20, 30]`, expectedOutput: `30`, isHidden: false }
    ],
    hints: ["The Bully algorithm appoints the surviving node with the highest ID."]
  },
  {
    id: "sd-tier3-011",
    tier: 3,
    section: "Distributed Systems",
    topic: "Consensus",
    title: "Consensus",
    slug: "consensus",
    difficulty: "Hard",
    pattern: "Consensus",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "consensus", "paxos", "raft", "Consensus"],
    xpReward: 200,
    description: `Explore Distributed Consensus: the fundamental challenge of getting a group of independent, unreliable nodes to agree on a single data value or state transition.

### Learning Objectives
- Understand the FLP Impossibility Result: consensus is impossible in an asynchronous network with even one crash failure
- Achieve practical consensus using partially synchronous models and randomized timeouts
- Compare Paxos (mathematically elegant, difficult to implement) with Raft (understandable, state machine based)
- Understand State Machine Replication (SMR): identical inputs applied in identical order yield identical states
- Maintain cluster progress as long as a strict majority of nodes (N/2 + 1) remain operational

### Practical Challenge
Calculate minimum nodes required to tolerate F node crash failures in a majority consensus cluster: 2F + 1.`,
    starterCode: {
      javascript: `function calculateConsensusClusterSize(maxFailuresTolerated) {
  return 2 * maxFailuresTolerated + 1;
}`,
      python: `def calculate_consensus_cluster_size(max_failures_tolerated):
    return 2 * max_failures_tolerated + 1`
    },
    testCases: [
      { input: `1`, expectedOutput: `3`, isHidden: false },
      { input: `2`, expectedOutput: `5`, isHidden: false },
      { input: `3`, expectedOutput: `7`, isHidden: true }
    ],
    hints: ["A consensus cluster requires 2F + 1 nodes to survive F crash failures."]
  },
  {
    id: "sd-tier3-012",
    tier: 3,
    section: "Distributed Systems",
    topic: "Raft",
    title: "Raft",
    slug: "raft",
    difficulty: "Hard",
    pattern: "Consensus",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "raft", "etcd", "Consensus"],
    xpReward: 200,
    description: `Deep-dive into the Raft Consensus Protocol (powers etcd, Consul, Kafka KRaft). Master Leader Election, Log Replication, Term Numbers, and Safety Invariants.

### Learning Objectives
- Understand node states: Follower, Candidate, and Leader
- Use randomized election timeouts (150ms - 300ms) to prevent split-vote deadlocks
- Replicate log entries via AppendEntries RPCs: leader only commits once replicated on a majority of nodes
- Enforce the Leader Completeness property: a leader has all committed entries from all previous terms
- Manage log compaction via periodic snapshots to truncate disk logs

### Practical Challenge
Check if an election candidate wins majority vote: return true if votesReceived >= floor(totalClusterNodes / 2) + 1.`,
    starterCode: {
      javascript: `function hasRaftMajority(votesReceived, totalClusterNodes) {
  const majority = Math.floor(totalClusterNodes / 2) + 1;
  return votesReceived >= majority;
}`,
      python: `def has_raft_majority(votes_received, total_cluster_nodes):
    majority = (total_cluster_nodes // 2) + 1
    return votes_received >= majority`
    },
    testCases: [
      { input: `3, 5`, expectedOutput: `true`, isHidden: false },
      { input: `2, 5`, expectedOutput: `false`, isHidden: false },
      { input: `2, 3`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["A candidate wins when votesReceived >= floor(totalClusterNodes / 2) + 1."]
  },
  {
    id: "sd-tier3-013",
    tier: 3,
    section: "Distributed Systems",
    topic: "Quorum",
    title: "Quorum",
    slug: "quorum",
    difficulty: "Medium",
    pattern: "Consensus",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "quorum", "cassandra", "Consensus"],
    xpReward: 100,
    description: `Understand Quorum consensus in leaderless replication systems (Dynamo, Cassandra). Master the relationship between cluster size N, read quorum R, and write quorum W.

### Learning Objectives
- Master the strict quorum inequality: R + W > N guarantees at least one node in the read set has the latest write
- Tune performance: Configure W=1, R=N for ultra-fast writes; W=N, R=1 for ultra-fast reads
- Configure balanced quorum (e.g. N=3, W=2, R=2) for high availability with strong consistency
- Handle Sloppy Quorum and Hinted Handoff during network partitions
- Detect stale records using read repair and timestamp conflict resolution

### Practical Challenge
Check if a configuration satisfies strict quorum consistency: return true if (r + w) > n.`,
    starterCode: {
      javascript: `function isStrictQuorum(r, w, n) {
  return (r + w) > n;
}`,
      python: `def is_strict_quorum(r, w, n):
    return (r + w) > n`
    },
    testCases: [
      { input: `2, 2, 3`, expectedOutput: `true`, isHidden: false },
      { input: `1, 2, 3`, expectedOutput: `false`, isHidden: false },
      { input: `3, 3, 5`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Strict quorum guarantees overlap between read and write sets when R + W > N."]
  },
  {
    id: "sd-tier3-014",
    tier: 3,
    section: "Distributed Systems",
    topic: "Replication Strategies",
    title: "Replication Strategies",
    slug: "replication-strategies",
    difficulty: "Medium",
    pattern: "Replication",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "replication", "Replication"],
    xpReward: 100,
    description: `Compare Single-Leader, Multi-Leader, and Leaderless replication topologies. Understand data synchronization trade-offs across local and geo-distributed clusters.

### Learning Objectives
- Single-Leader: Simple, no write conflicts, but primary node is a write bottleneck
- Multi-Leader: Multiple data centers accept local writes; requires conflict resolution (CRDTs, LWW)
- Leaderless (Dynamo-style): Any node accepts reads and writes; relies on quorum and anti-entropy
- Handle split-brain scenarios and cross-datacenter WAN replication lag
- Select the optimal topology matching read/write ratios and geographic distribution

### Practical Challenge
Select replication model: return "Single-Leader" if writes must be strictly ordered without conflict; return "Multi-Leader" if multi-datacenter local write latency is required.`,
    starterCode: {
      javascript: `function selectReplicationTopology(requireZeroConflicts, multiDCWriteLatency) {
  return requireZeroConflicts ? "Single-Leader" : "Multi-Leader";
}`,
      python: `def select_replication_topology(require_zero_conflicts, multi_dc_write_latency):
    return "Single-Leader" if require_zero_conflicts else "Multi-Leader"`
    },
    testCases: [
      { input: `true, true`, expectedOutput: `"Single-Leader"`, isHidden: false },
      { input: `false, true`, expectedOutput: `"Multi-Leader"`, isHidden: false }
    ],
    hints: ["Single-Leader guarantees zero write conflicts; Multi-Leader minimizes local write latency."]
  },
  {
    id: "sd-tier3-015",
    tier: 3,
    section: "Distributed Systems",
    topic: "Partitioning",
    title: "Partitioning",
    slug: "distributed-partitioning",
    difficulty: "Medium",
    pattern: "Partitioning",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "partitioning", "Partitioning"],
    xpReward: 100,
    description: `Deep-dive into distributed data partitioning. Learn how large databases divide datasets across shards, rebalance partitions dynamically, and avoid cross-partition query overhead.

### Learning Objectives
- Compare Range Partitioning (ordered keys, fast range queries, prone to hot spots on timestamps) with Hash Partitioning (uniform distribution, no range queries)
- Combine Partition Key with Clustering Columns (Compound Primary Keys)
- Understand automated rebalancing: Fixed Partitions vs Dynamic Partitioning (splitting partitions above threshold)
- Address cross-shard scatter-gather query latency
- Route client queries directly to the correct partition using routing tiers (e.g. MongoDB Mongos, Vitess VTGate)

### Practical Challenge
Calculate partition count needed given total dataset size in GB and maximum recommended partition size in GB. Round up.`,
    starterCode: {
      javascript: `function calculatePartitionsNeeded(datasetGB, maxPartitionGB) {
  return Math.ceil(datasetGB / maxPartitionGB);
}`,
      python: `import math

def calculate_partitions_needed(dataset_gb, max_partition_gb):
    return math.ceil(dataset_gb / max_partition_gb)`
    },
    testCases: [
      { input: `1000, 50`, expectedOutput: `20`, isHidden: false },
      { input: `125, 50`, expectedOutput: `3`, isHidden: false }
    ],
    hints: ["Divide datasetGB by maxPartitionGB and take ceiling."]
  },
  {
    id: "sd-tier3-016",
    tier: 3,
    section: "Distributed Systems",
    topic: "Consistent Hashing",
    title: "Consistent Hashing Deep Dive",
    slug: "consistent-hashing-deep-dive",
    difficulty: "Hard",
    pattern: "Partitioning",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "consistent-hashing", "vnodes", "Partitioning"],
    xpReward: 200,
    description: `Advanced Consistent Hashing with Virtual Nodes (vnodes). Learn how vnodes eliminate non-uniform key distribution on the hash ring and enable heterogenous hardware weighting.

### Learning Objectives
- Map each physical server to multiple virtual positions (e.g. 256 vnodes per physical machine)
- Eliminate statistical variance and achieve near-perfect uniform distribution across physical nodes
- Assign more vnodes to more powerful servers to scale capacity proportionally
- Rebalance smoothly: when a physical node is added, it claims small slices of keys from every existing node
- Implement consistent hashing in DynamoDB, Apache Cassandra, and Akamai CDN edge servers

### Practical Challenge
Calculate total vnodes on ring given physical server count and vnodesPerServer.`,
    starterCode: {
      javascript: `function calculateTotalVNodes(physicalServers, vnodesPerServer) {
  return physicalServers * vnodesPerServer;
}`,
      python: `def calculate_total_v_nodes(physical_servers, vnodes_per_server):
    return physical_servers * vnodes_per_server`
    },
    testCases: [
      { input: `10, 256`, expectedOutput: `2560`, isHidden: false },
      { input: `5, 128`, expectedOutput: `640`, isHidden: false }
    ],
    hints: ["Multiply physical servers by vnodes per server."]
  },
  {
    id: "sd-tier3-017",
    tier: 3,
    section: "Distributed Systems",
    topic: "Gossip Protocol",
    title: "Gossip Protocol",
    slug: "gossip-protocol",
    difficulty: "Medium",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "gossip", "peer-to-peer", "Distributed Systems"],
    xpReward: 100,
    description: `Understand the Gossip Protocol (Epidemic Protocol). Learn how decentralized peer-to-peer nodes periodically exchange state information to achieve exponential information spread.

### Learning Objectives
- Disseminate cluster state (node liveness, schema updates, membership) without a central master node
- Understand information propagation speed: O(log N) rounds to infect all N nodes in the cluster
- Bound network overhead: Each node periodically pings a small random subset of peers (fanout factor k)
- Implement anti-entropy reconciliation and failure detection in Cassandra and HashiCorp Serf/Consul
- Achieve high fault tolerance: gossip works reliably even when high packet loss occurs

### Practical Challenge
Calculate theoretical gossip rounds to disseminate state to N nodes given fanout k: ceil(log(N) / log(k)).`,
    starterCode: {
      javascript: `function calculateGossipRounds(totalNodes, fanout) {
  if (totalNodes <= 1) return 0;
  return Math.ceil(Math.log(totalNodes) / Math.log(fanout));
}`,
      python: `import math

def calculate_gossip_rounds(total_nodes, fanout):
    if total_nodes <= 1:
        return 0
    return math.ceil(math.log(total_nodes) / math.log(fanout))`
    },
    testCases: [
      { input: `1000, 2`, expectedOutput: `10`, isHidden: false },
      { input: `1000, 10`, expectedOutput: `3`, isHidden: false }
    ],
    hints: ["Formula: ceil(log(N) / log(fanout))."]
  },
  {
    id: "sd-tier3-018",
    tier: 3,
    section: "Distributed Systems",
    topic: "Message Queues",
    title: "Message Queues",
    slug: "message-queues-deep-dive",
    difficulty: "Medium",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "messaging", "queues", "Messaging"],
    xpReward: 100,
    description: `Master Message Queues in distributed architectures. Understand point-to-point queues, competing consumers, message durability, deduplication, and backpressure management.

### Learning Objectives
- Decouple processing speeds between producers and consumers (temporal decoupling)
- Implement the Competing Consumers pattern to scale worker throughput horizontally
- Guarantee message persistence via disk-backed queues before acknowledging producer publishes
- Handle consumer failure: messages automatically return to queue after visibility timeout expires
- Prevent queue runaway growth by enforcing consumer auto-scaling and producer rate limits

### Practical Challenge
Calculate queue processing lag: return max(0, totalEnqueued - totalProcessed).`,
    starterCode: {
      javascript: `function calculateQueueLag(totalEnqueued, totalProcessed) {
  return Math.max(0, totalEnqueued - totalProcessed);
}`,
      python: `def calculate_queue_lag(total_enqueued, total_processed):
    return max(0, total_enqueued - total_processed)`
    },
    testCases: [
      { input: `1500, 1200`, expectedOutput: `300`, isHidden: false },
      { input: `1000, 1000`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Queue lag is the number of enqueued messages waiting to be processed."]
  },
  {
    id: "sd-tier3-019",
    tier: 3,
    section: "Distributed Systems",
    topic: "Event-Driven Architecture",
    title: "Event-Driven Architecture",
    slug: "event-driven-architecture",
    difficulty: "Medium",
    pattern: "Event-Driven Architecture",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "eda", "events", "Event-Driven Architecture"],
    xpReward: 100,
    description: `Explore Event-Driven Architecture (EDA). Learn how services react asynchronously to published events (e.g. OrderPlaced, PaymentReceived) without tight synchronous coupling.

### Learning Objectives
- Contrast Request-Driven architecture (synchronous HTTP/RPC) with Event-Driven architecture
- Publish immutable domain events recording business facts that occurred in the past
- Enable frictionless addition of new downstream consumers without modifying publisher services
- Decouple failure domains: publisher succeeds even if downstream consumer is temporarily offline
- Manage event schema versioning using Schema Registries (Avro, Protobuf, JSON Schema)

### Practical Challenge
Filter events by eventType: return array of events matching targetType.`,
    starterCode: {
      javascript: `function filterEventsByType(events, targetType) {
  return events.filter(e => e.type === targetType);
}`,
      python: `def filter_events_by_type(events, target_type):
    return [e for e in events if e.get("type") == target_type]`
    },
    testCases: [
      { input: `[{"id": 1, "type": "ORDER_CREATED"}, {"id": 2, "type": "USER_SIGNUP"}, {"id": 3, "type": "ORDER_CREATED"}], "ORDER_CREATED"`, expectedOutput: `[{"id":1,"type":"ORDER_CREATED"},{"id":3,"type":"ORDER_CREATED"}]`, isHidden: false },
      { input: `[{"id": 1, "type": "A"}], "B"`, expectedOutput: `[]`, isHidden: false }
    ],
    hints: ["Filter events where event.type equals targetType."]
  },
  {
    id: "sd-tier3-020",
    tier: 3,
    section: "Distributed Systems",
    topic: "Pub/Sub",
    title: "Pub/Sub",
    slug: "pub-sub",
    difficulty: "Medium",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "pub-sub", "Messaging"],
    xpReward: 100,
    description: `Master the Publish-Subscribe (Pub/Sub) pattern. Learn how topics broadcast messages to multiple independent subscriber queues (fanout), decoupling producers from consumers.

### Learning Objectives
- Compare Point-to-Point Queue (1 producer -> 1 consumer) with Pub/Sub (1 producer -> N subscribers)
- Implement Topic Fanout: an order event delivers to Inventory, Notification, and Billing queues simultaneously
- Filter messages at subscriber level using message attributes and topic routing keys
- Prevent subscriber lag from blocking message producers
- Leverage cloud Pub/Sub services: AWS SNS + SQS, Google Cloud Pub/Sub, Kafka Topics

### Practical Challenge
Calculate total message deliveries in a fanout topic given published messages count and active subscriber count.`,
    starterCode: {
      javascript: `function calculateFanoutDeliveries(publishedMessages, activeSubscribers) {
  return publishedMessages * activeSubscribers;
}`,
      python: `def calculate_fanout_deliveries(published_messages, active_subscribers):
    return published_messages * active_subscribers`
    },
    testCases: [
      { input: `100, 5`, expectedOutput: `500`, isHidden: false },
      { input: `1000, 3`, expectedOutput: `3000`, isHidden: false }
    ],
    hints: ["Each published message is duplicated and delivered to every active subscriber."]
  },
  {
    id: "sd-tier3-021",
    tier: 3,
    section: "Distributed Systems",
    topic: "Kafka Architecture",
    title: "Kafka Architecture",
    slug: "kafka-architecture",
    difficulty: "Hard",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "kafka", "event-streaming", "Messaging"],
    xpReward: 200,
    description: `Master Apache Kafka architecture: Topics, Partitions, Brokers, Consumer Groups, Offsets, and Zookeeper/KRaft metadata consensus. Understand why Kafka scales to millions of writes per second.

### Learning Objectives
- Understand the append-only distributed commit log model
- Leverage OS page cache and zero-copy data transfer (\`sendfile\`) for disk I/O efficiency
- Parallelize consumption via Consumer Groups (each partition is assigned to strictly one consumer per group)
- Track message progress via consumer committed offsets (\`__consumer_offsets\`)
- Configure replication factors and minimum in-sync replicas (\`min.insync.replicas\`) for zero data loss

### Practical Challenge
Determine max parallel consumers in a consumer group: return Math.min(totalConsumers, totalPartitions). (Excess consumers sit idle).`,
    starterCode: {
      javascript: `function calculateActiveKafkaConsumers(totalConsumers, totalPartitions) {
  return Math.min(totalConsumers, totalPartitions);
}`,
      python: `def calculate_active_kafka_consumers(total_consumers, total_partitions):
    return min(total_consumers, total_partitions)`
    },
    testCases: [
      { input: `8, 4`, expectedOutput: `4`, isHidden: false },
      { input: `3, 6`, expectedOutput: `3`, isHidden: false },
      { input: `5, 5`, expectedOutput: `5`, isHidden: true }
    ],
    hints: ["A partition can only be read by one consumer in a group; extra consumers remain idle."]
  },
  {
    id: "sd-tier3-022",
    tier: 3,
    section: "Distributed Systems",
    topic: "Exactly-Once Delivery",
    title: "Exactly-Once Delivery",
    slug: "exactly-once-delivery",
    difficulty: "Hard",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "exactly-once", "Messaging"],
    xpReward: 200,
    description: `Understand Exactly-Once Semantics (EOS). Learn how combining idempotent producers with two-phase commit transaction coordinators achieves exactly-once stream processing.

### Learning Objectives
- Understand why true network-level exactly-once is impossible under the Two Generals' Problem
- Achieve application-level exactly-once: At-least-once delivery + Idempotent processing
- Leverage Kafka Transactions: atomic writes across multiple partitions and consumer offsets
- Use producer sequence numbers and Producer IDs (PID) to eliminate broker duplicate writes
- Design end-to-end exactly-once pipelines from source to sink storage

### Practical Challenge
Check if duplicate message should be rejected by an idempotent producer given current sequence number and incoming sequence number.`,
    starterCode: {
      javascript: `function isDuplicateMessage(lastSequenceNum, incomingSequenceNum) {
  return incomingSequenceNum <= lastSequenceNum;
}`,
      python: `def is_duplicate_message(last_sequence_num, incoming_sequence_num):
    return incoming_sequence_num <= last_sequence_num`
    },
    testCases: [
      { input: `5, 5`, expectedOutput: `true`, isHidden: false },
      { input: `5, 6`, expectedOutput: `false`, isHidden: false },
      { input: `10, 4`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["If incoming sequence number <= last seen sequence number, it is a duplicate."]
  },
  {
    id: "sd-tier3-023",
    tier: 3,
    section: "Distributed Systems",
    topic: "At-Least-Once Delivery",
    title: "At-Least-Once Delivery",
    slug: "at-least-once-delivery",
    difficulty: "Medium",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "at-least-once", "Messaging"],
    xpReward: 100,
    description: `Explore At-Least-Once delivery. Understand why retrying unacknowledged messages guarantees zero data loss while requiring consumers to handle potential duplicate messages.

### Learning Objectives
- Producer retries message transmission until positive acknowledgment (ACK) is received
- Consumer commits read offset only AFTER successfully persisting or processing data
- Address the trade-off: Guarantees zero message loss, but messages may be delivered multiple times
- Pair at-least-once delivery with deduplication databases or unique constraint filters
- Handle consumer crashes mid-processing before offset commit

### Practical Challenge
Deduplicate incoming message array by message ID, preserving original order.`,
    starterCode: {
      javascript: `function deduplicateMessages(messages) {
  const seen = new Set();
  const result = [];
  for (const m of messages) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      result.push(m);
    }
  }
  return result;
}`,
      python: `def deduplicate_messages(messages):
    seen = set()
    result = []
    for m in messages:
        mid = m.get("id")
        if mid not in seen:
            seen.add(mid)
            result.append(m)
    return result`
    },
    testCases: [
      { input: `[{"id": "m1"}, {"id": "m2"}, {"id": "m1"}]`, expectedOutput: `[{"id":"m1"},{"id":"m2"}]`, isHidden: false },
      { input: `[{"id": "a"}, {"id": "b"}]`, expectedOutput: `[{"id":"a"},{"id":"b"}]`, isHidden: false }
    ],
    hints: ["Use a Set to track seen message IDs and keep only the first occurrence."]
  },
  {
    id: "sd-tier3-024",
    tier: 3,
    section: "Distributed Systems",
    topic: "At-Most-Once Delivery",
    title: "At-Most-Once Delivery",
    slug: "at-most-once-delivery",
    difficulty: "Easy",
    pattern: "Messaging",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "at-most-once", "Messaging"],
    xpReward: 50,
    description: `Understand At-Most-Once delivery ("fire and forget"). Messages are delivered zero or one time, with zero retries. Ideal for high-volume metrics, logging, and live telemetry where speed trumps reliability.

### Learning Objectives
- Consumer commits offset BEFORE processing the message; if consumer crashes, message is lost
- Producer sends message without waiting for broker confirmation (fire-and-forget, \`acks=0\`)
- Achieve maximum possible throughput and lowest latency
- Acceptable loss profile: IoT telemetry, GPS sensor pings, video streaming packets
- Never use at-most-once for financial, billing, or order processing workflows

### Practical Challenge
Calculate accepted packet loss percentage: return Math.round(((sent - received) / sent) * 100).`,
    starterCode: {
      javascript: `function calculatePacketLossPercent(sent, received) {
  if (sent === 0) return 0;
  return Math.round(((sent - received) / sent) * 100);
}`,
      python: `def calculate_packet_loss_percent(sent, received):
    if sent == 0:
        return 0
    return round(((sent - received) / sent) * 100)`
    },
    testCases: [
      { input: `1000, 950`, expectedOutput: `5`, isHidden: false },
      { input: `1000, 1000`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Calculate (sent - received) / sent * 100."]
  },
  {
    id: "sd-tier3-025",
    tier: 3,
    section: "Distributed Systems",
    topic: "Event Ordering",
    title: "Event Ordering",
    slug: "event-ordering",
    difficulty: "Medium",
    pattern: "Event-Driven Architecture",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "event-ordering", "partition-key", "Event-Driven Architecture"],
    xpReward: 100,
    description: `Guarantee strict Event Ordering in distributed streaming systems. Learn why global ordering does not scale, and how per-partition key ordering preserves entity causality.

### Learning Objectives
- Understand that global total ordering across a distributed cluster creates an extreme bottleneck
- Achieve per-entity causal ordering by using the Entity ID (e.g. \`userId\` or \`orderId\`) as the Partition Key
- Ensure all events for a given entity land strictly on the same partition in sequential order
- Handle partition rebalancing and out-of-order delivery due to consumer thread pools
- Use sequence numbers and state machines to buffer and re-order out-of-sequence events

### Practical Challenge
Route event to partition by partitionKey: return hash(partitionKey) % numPartitions.`,
    starterCode: {
      javascript: `function routeEventToPartition(partitionKey, numPartitions) {
  let hash = 0;
  for (let i = 0; i < partitionKey.length; i++) {
    hash = (hash * 31 + partitionKey.charCodeAt(i)) >>> 0;
  }
  return hash % numPartitions;
}`,
      python: `def route_event_to_partition(partition_key, num_partitions):
    h = 0
    for ch in partition_key:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % num_partitions`
    },
    testCases: [
      { input: `"order_123", 4`, expectedOutput: `1`, isHidden: false },
      { input: `"user_999", 8`, expectedOutput: `7`, isHidden: false }
    ],
    hints: ["Compute string hash and modulo by numPartitions."]
  },
  {
    id: "sd-tier3-026",
    tier: 3,
    section: "Distributed Systems",
    topic: "Idempotency",
    title: "Distributed Idempotency",
    slug: "distributed-idempotency",
    difficulty: "Medium",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "idempotency", "Distributed Systems"],
    xpReward: 100,
    description: `Implement Distributed Idempotency to neutralize duplicate messages from at-least-once queues, network retries, and consumer crashes.

### Learning Objectives
- Pair message identifiers with unique database constraints to prevent duplicate insertions
- Implement the Idempotent Consumer pattern using Redis or transactional outbox
- Store processed event IDs in an events_processed table within the same local ACID transaction as state mutations
- Return cached previous results when identical idempotency tokens are resubmitted
- Set reasonable TTLs on idempotency tokens to manage memory growth

### Practical Challenge
Check if event has already been processed: return "IGNORE" if eventId in processedSet, else add to set and return "PROCESS".`,
    starterCode: {
      javascript: `function processEventIdempotently(processedSet, eventId) {
  if (processedSet.has(eventId)) return "IGNORE";
  processedSet.add(eventId);
  return "PROCESS";
}`,
      python: `def process_event_idempotently(processed_set, event_id):
    if event_id in processed_set:
        return "IGNORE"
    processed_set.add(event_id)
    return "PROCESS"`
    },
    testCases: [
      { input: `new Set(["e1"]), "e1"`, expectedOutput: `"IGNORE"`, isHidden: false },
      { input: `new Set(["e1"]), "e2"`, expectedOutput: `"PROCESS"`, isHidden: false }
    ],
    hints: ["Check if processedSet has eventId; if so return IGNORE, else add and return PROCESS."]
  },
  {
    id: "sd-tier3-027",
    tier: 3,
    section: "Distributed Systems",
    topic: "Dead Letter Queues",
    title: "Dead Letter Queues",
    slug: "dead-letter-queues",
    difficulty: "Medium",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "dlq", "poison-pill", "Fault Tolerance"],
    xpReward: 100,
    description: `Manage Dead Letter Queues (DLQ) for poison pill messages. Learn how to isolate unparseable, malformed, or fatal messages to prevent consumer thread crash loops.

### Learning Objectives
- Identify Poison Pill messages: payloads that cause fatal consumer exceptions every time they are processed
- Configure maximum retry attempts before automatically diverting poison messages to a DLQ
- Prevent head-of-line blocking: healthy messages continue processing while failed messages are isolated
- Implement DLQ monitoring, alerting, and automated dead-letter redrive replay pipelines
- Log root-cause exception stack traces alongside the quarantined message payload

### Practical Challenge
Determine if message should be routed to DLQ: return true if retryCount >= maxRetries, else false.`,
    starterCode: {
      javascript: `function shouldRouteToDLQ(retryCount, maxRetries) {
  return retryCount >= maxRetries;
}`,
      python: `def should_route_to_dlq(retry_count, max_retries):
    return retry_count >= max_retries`
    },
    testCases: [
      { input: `3, 3`, expectedOutput: `true`, isHidden: false },
      { input: `1, 3`, expectedOutput: `false`, isHidden: false },
      { input: `5, 3`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["When retry count reaches or exceeds max retries, route to DLQ."]
  },
  {
    id: "sd-tier3-028",
    tier: 3,
    section: "Distributed Systems",
    topic: "Stream Processing",
    title: "Stream Processing",
    slug: "stream-processing",
    difficulty: "Hard",
    pattern: "Event-Driven Architecture",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "stream-processing", "flink", "Event-Driven Architecture"],
    xpReward: 200,
    description: `Explore Real-Time Stream Processing engines (Apache Flink, Apache Spark Streaming, Kafka Streams). Learn windowing (tumbling, sliding, session), event time vs processing time, and watermarks.

### Learning Objectives
- Contrast batch processing (bounded historical data) with stream processing (unbounded continuous streams)
- Differentiate Event Time (when event occurred at source) from Processing Time (when machine evaluates event)
- Handle late-arriving and out-of-order data using Watermarks
- Understand Windowing types: Tumbling (fixed, non-overlapping), Sliding (overlapping), and Session (inactivity gap)
- Maintain stateful aggregations (e.g. running 1-hour fraud detection count) with checkpointing

### Practical Challenge
Assign timestamp to a Tumbling Window start boundary: return floor(timestamp / windowSizeSec) * windowSizeSec.`,
    starterCode: {
      javascript: `function getTumblingWindowStart(timestampSec, windowSizeSec) {
  return Math.floor(timestampSec / windowSizeSec) * windowSizeSec;
}`,
      python: `def get_tumbling_window_start(timestamp_sec, window_size_sec):
    return (timestamp_sec // window_size_sec) * window_size_sec`
    },
    testCases: [
      { input: `125, 60`, expectedOutput: `120`, isHidden: false },
      { input: `180, 60`, expectedOutput: `180`, isHidden: false },
      { input: `45, 60`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Tumbling window start is floor(timestamp / windowSize) * windowSize."]
  },
  {
    id: "sd-tier3-029",
    tier: 3,
    section: "Distributed Systems",
    topic: "Event Sourcing",
    title: "Event Sourcing",
    slug: "event-sourcing",
    difficulty: "Hard",
    pattern: "Event-Driven Architecture",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "event-sourcing", "audit-log", "Event-Driven Architecture"],
    xpReward: 200,
    description: `Master Event Sourcing. Instead of mutating database rows in-place, store every change as an immutable sequence of business events in an append-only event store.

### Learning Objectives
- Replace mutable database updates with an append-only ledger of immutable domain events
- Rebuild current state by replaying all historical events from genesis (or from the latest snapshot)
- Gain complete, tamper-proof audit trails for financial compliance and forensic debugging
- Travel back in time: reconstruct the exact system state at any point in history
- Optimize state reconstruction using periodic state Snapshots

### Practical Challenge
Reconstruct bank account balance from an initial balance of 0 and a series of deposit/withdrawal amounts.`,
    starterCode: {
      javascript: `function reconstructBalance(transactions) {
  return transactions.reduce((acc, curr) => acc + curr, 0);
}`,
      python: `def reconstruct_balance(transactions):
    return sum(transactions)`
    },
    testCases: [
      { input: `[100, 50, -30, 200]`, expectedOutput: `320`, isHidden: false },
      { input: `[500, -500]`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Sum all transaction events in sequence to rebuild the current balance state."]
  },
  {
    id: "sd-tier3-030",
    tier: 3,
    section: "Distributed Systems",
    topic: "CQRS",
    title: "CQRS",
    slug: "cqrs",
    difficulty: "Hard",
    pattern: "Event-Driven Architecture",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "cqrs", "Event-Driven Architecture"],
    xpReward: 200,
    description: `Learn Command Query Responsibility Segregation (CQRS). Separate the write model (Commands that mutate state) from the read model (Queries optimized for lightning-fast retrieval).

### Learning Objectives
- Separate Command path (handles validation, business rules, writes to write store) from Query path (denormalized read views)
- Scale read and write databases independently according to actual traffic ratios (e.g. 100:1 read/write)
- Synchronize write store and read store asynchronously using events or Change Data Capture (CDC)
- Optimize read stores for specific consumer UIs (e.g. Elasticsearch for search, Redis for dashboards)
- Accept eventual consistency between write completion and read model projection updates

### Practical Challenge
Route incoming request to model: return "COMMAND" if method is POST/PUT/DELETE, else "QUERY" for GET.`,
    starterCode: {
      javascript: `function routeCQRS(httpMethod) {
  const writeMethods = ["POST", "PUT", "DELETE", "PATCH"];
  return writeMethods.includes(httpMethod.toUpperCase()) ? "COMMAND" : "QUERY";
}`,
      python: `def route_cqrs(http_method):
    write_methods = {"POST", "PUT", "DELETE", "PATCH"}
    return "COMMAND" if http_method.upper() in write_methods else "QUERY"`
    },
    testCases: [
      { input: `"POST"`, expectedOutput: `"COMMAND"`, isHidden: false },
      { input: `"GET"`, expectedOutput: `"QUERY"`, isHidden: false },
      { input: `"DELETE"`, expectedOutput: `"COMMAND"`, isHidden: true }
    ],
    hints: ["Mutations route to the Command model; read queries route to the Query model."]
  },
  {
    id: "sd-tier3-031",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Scheduling",
    title: "Distributed Scheduling",
    slug: "distributed-scheduling",
    difficulty: "Medium",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "scheduling", "Distributed Systems"],
    xpReward: 100,
    description: `Build Distributed Task Schedulers. Learn how to partition millions of scheduled timers across worker nodes without centralized bottlenecks or single points of failure.

### Learning Objectives
- Partition scheduled jobs across worker shards using time-bucket ranges and hash keys
- Store future tasks in sorted sets (Redis ZSET with execution timestamp as score)
- Poll executable tasks: \`ZRANGEBYSCORE tasks 0 currentTime LIMIT 0 batchSize\`
- Prevent race conditions during concurrent worker polling using atomic Lua scripts or distributed locks
- Guarantee at-least-once task firing despite worker node crashes

### Practical Challenge
Find tasks ready for execution: return task IDs with scheduledTime <= currentTime.`,
    starterCode: {
      javascript: `function getExecutableTasks(tasks, currentTime) {
  return tasks.filter(t => t.scheduledTime <= currentTime).map(t => t.id);
}`,
      python: `def get_executable_tasks(tasks, current_time):
    return [t["id"] for t in tasks if t.get("scheduledTime", 0) <= current_time]`
    },
    testCases: [
      { input: `[{"id": "t1", "scheduledTime": 100}, {"id": "t2", "scheduledTime": 250}], 150`, expectedOutput: `["t1"]`, isHidden: false },
      { input: `[{"id": "t1", "scheduledTime": 300}], 200`, expectedOutput: `[]`, isHidden: false }
    ],
    hints: ["Filter tasks where scheduledTime <= currentTime and return their IDs."]
  },
  {
    id: "sd-tier3-032",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Rate Limiting",
    title: "Distributed Rate Limiting",
    slug: "distributed-rate-limiting",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "rate-limiting", "Distributed Systems"],
    xpReward: 200,
    description: `Implement Distributed Rate Limiting across multi-region server clusters using Redis, Lua scripting, and sliding window logs to prevent fraud, scrapers, and abuse.

### Learning Objectives
- Execute atomic rate limit checks in Redis using Lua scripts to prevent check-then-act race conditions
- Implement Sliding Window Counter: interpolate request counts between current and previous time windows
- Synchronize rate limits across global multi-region clusters using batch token distribution
- Protect local service availability if the central rate limit cache cluster experiences network partitions
- Return standard rate limit headers: \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`

### Practical Challenge
Calculate Sliding Window request estimate: previousWindowCount * (1 - timeElapsedFraction) + currentWindowCount. Round down.`,
    starterCode: {
      javascript: `function calculateSlidingWindowRequests(prevCount, currCount, timeFraction) {
  return Math.floor(prevCount * (1 - timeFraction) + currCount);
}`,
      python: `import math

def calculate_sliding_window_requests(prev_count, curr_count, time_fraction):
    return math.floor(prev_count * (1.0 - time_fraction) + curr_count)`
    },
    testCases: [
      { input: `100, 30, 0.25`, expectedOutput: `105`, isHidden: false },
      { input: `100, 50, 0.5`, expectedOutput: `100`, isHidden: false }
    ],
    hints: ["Multiply prevCount by (1 - timeFraction) and add currCount, then floor."]
  },
  {
    id: "sd-tier3-033",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Caching",
    title: "Distributed Caching",
    slug: "distributed-caching",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "caching", "Distributed Systems"],
    xpReward: 200,
    description: `Design high-performance Distributed Caching infrastructure. Master cache coherency, cross-cluster replication, hot key shielding, and cache penetration defenses.

### Learning Objectives
- Prevent Cache Stampede (dog-piling) using probabilistic early expiration (XFetch) or distributed mutexes
- Prevent Cache Penetration (queries for non-existent keys hitting DB) using Bloom Filters and null caching
- Prevent Cache Avalanche (massive concurrent TTL expiries) by adding random jitter to TTL values
- Use client-side near-caching (L1 local memory + L2 distributed Redis) with invalidation bus
- Maintain multi-region cache consistency across WAN links

### Practical Challenge
Add random jitter to base TTL: given baseTTL and jitterRange, return baseTTL + jitterOffset.`,
    starterCode: {
      javascript: `function getJitteredTTL(baseTTL, jitterOffset) {
  return baseTTL + jitterOffset;
}`,
      python: `def get_jittered_ttl(base_ttl, jitter_offset):
    return base_ttl + jitter_offset`
    },
    testCases: [
      { input: `3600, 120`, expectedOutput: `3720`, isHidden: false },
      { input: `300, 15`, expectedOutput: `315`, isHidden: false }
    ],
    hints: ["Add jitter offset to base TTL to prevent cache avalanche."]
  },
  {
    id: "sd-tier3-034",
    tier: 3,
    section: "Distributed Systems",
    topic: "Service Mesh",
    title: "Service Mesh",
    slug: "service-mesh",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "service-mesh", "istio", "envoy", "Distributed Systems"],
    xpReward: 200,
    description: `Explore Service Meshes (Istio, Linkerd, Envoy). Understand the sidecar proxy architecture handling service-to-service encryption (mTLS), load balancing, retries, and telemetry transparently.

### Learning Objectives
- Separate business logic code from network operational infrastructure via Sidecar proxies
- Enforce mutual TLS (mTLS) with automatic certificate rotation between all microservices
- Implement advanced traffic management: canary weight splitting, request mirroring, fault injection
- Generate uniform distributed telemetry, access logs, and metrics across polyglot microservices
- Analyze service mesh performance overhead: latency cost of extra sidecar proxy network hops

### Practical Challenge
Calculate extra round-trip latency added by two sidecar proxy hops (ingress and egress) given msPerHop.`,
    starterCode: {
      javascript: `function calculateMeshOverhead(msPerHop) {
  return msPerHop * 2;
}`,
      python: `def calculate_mesh_overhead(ms_per_hop):
    return ms_per_hop * 2`
    },
    testCases: [
      { input: `1.5`, expectedOutput: `3`, isHidden: false },
      { input: `0.8`, expectedOutput: `1.6`, isHidden: false }
    ],
    hints: ["A request passes through egress proxy of caller and ingress proxy of callee (2 hops)."]
  },
  {
    id: "sd-tier3-035",
    tier: 3,
    section: "Distributed Systems",
    topic: "Observability",
    title: "Observability",
    slug: "observability",
    difficulty: "Medium",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "observability", "metrics", "Observability"],
    xpReward: 100,
    description: `Master the Three Pillars of Observability: Metrics, Logs, and Traces. Learn how to infer the internal states of complex distributed systems based strictly on external outputs.

### Learning Objectives
- Contrast Monitoring (asking: is system working?) with Observability (asking: why is system failing?)
- Master the 3 Pillars: Metrics (numeric aggregations), Logs (timestamped event strings), Traces (request journey across services)
- Understand Cardinality: why high-cardinality tags (e.g. userId) overwhelm traditional metric stores
- Implement the USE method (Utilization, Saturation, Errors) for infrastructure resources
- Implement the RED method (Rate, Errors, Duration) for microservice request architectures

### Practical Challenge
Classify observability signal: return "metric" for numeric counters/gauges, "trace" for spans/traces, "log" for event strings.`,
    starterCode: {
      javascript: `function classifyTelemetrySignal(dataType) {
  const map = { "counter": "metric", "gauge": "metric", "span": "trace", "message": "log" };
  return map[dataType.toLowerCase()] || "unknown";
}`,
      python: `def classify_telemetry_signal(data_type):
    mapping = {"counter": "metric", "gauge": "metric", "span": "trace", "message": "log"}
    return mapping.get(data_type.lower(), "unknown")`
    },
    testCases: [
      { input: `"counter"`, expectedOutput: `"metric"`, isHidden: false },
      { input: `"span"`, expectedOutput: `"trace"`, isHidden: false },
      { input: `"message"`, expectedOutput: `"log"`, isHidden: true }
    ],
    hints: ["Map data types to the 3 pillars of observability."]
  },
  {
    id: "sd-tier3-036",
    tier: 3,
    section: "Distributed Systems",
    topic: "Distributed Tracing",
    title: "Distributed Tracing",
    slug: "distributed-tracing",
    difficulty: "Hard",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "tracing", "opentelemetry", "Observability"],
    xpReward: 200,
    description: `Understand Distributed Tracing (OpenTelemetry, Jaeger, Zipkin). Learn trace context propagation across HTTP/gRPC boundaries using W3C TraceContext headers.

### Learning Objectives
- Track a single user request as it traverses dozens of microservices, queues, and databases
- Understand Trace anatomy: Trace ID (global identifier), Span ID (individual unit of work), Parent Span ID
- Propagate trace headers via W3C TraceContext (\`traceparent: 00-traceId-spanId-01\`)
- Pinpoint latency bottlenecks by inspecting waterfall flame graphs of span durations
- Implement tail-based sampling to retain 100% of error and slow traces while discarding healthy traces

### Practical Challenge
Verify trace propagation: check if child span parentId matches parent span spanId.`,
    starterCode: {
      javascript: `function isSpanChildOfParent(childSpan, parentSpan) {
  return childSpan.parentId === parentSpan.spanId && childSpan.traceId === parentSpan.traceId;
}`,
      python: `def is_span_child_of_parent(child_span, parent_span):
    return child_span.get("parentId") == parent_span.get("spanId") and child_span.get("traceId") == parent_span.get("traceId")`
    },
    testCases: [
      { input: `{"traceId": "t1", "spanId": "s2", "parentId": "s1"}, {"traceId": "t1", "spanId": "s1"}`, expectedOutput: `true`, isHidden: false },
      { input: `{"traceId": "t1", "spanId": "s2", "parentId": "s999"}, {"traceId": "t1", "spanId": "s1"}`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Child must share the same traceId and its parentId must match the parent's spanId."]
  },
  {
    id: "sd-tier3-037",
    tier: 3,
    section: "Distributed Systems",
    topic: "Metrics",
    title: "Metrics",
    slug: "metrics",
    difficulty: "Medium",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "metrics", "prometheus", "Observability"],
    xpReward: 100,
    description: `Master Time-Series Metrics architectures (Prometheus, Grafana, Datadog). Understand Counter, Gauge, Histogram, and Summary metric types and pull vs push collection models.

### Learning Objectives
- Counters: Monotonically increasing values (e.g. total requests, total errors)
- Gauges: Values that fluctuate up and down (e.g. active connections, memory usage)
- Histograms: Sample observations into configurable buckets to calculate p50, p90, p99 percentiles
- Compare Pull model (Prometheus scrapes \`/metrics\` endpoints) with Push model (StatsD / Datadog Agent)
- Formulate PromQL queries for error rate percentages: \`rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])\`

### Practical Challenge
Calculate error rate percentage from total requests and error requests.`,
    starterCode: {
      javascript: `function calculateErrorRate(totalRequests, errorRequests) {
  if (totalRequests === 0) return 0;
  return Math.round((errorRequests / totalRequests) * 10000) / 100;
}`,
      python: `def calculate_error_rate(total_requests, error_requests):
    if total_requests == 0:
        return 0
    return round((error_requests / total_requests) * 100, 2)`
    },
    testCases: [
      { input: `10000, 150`, expectedOutput: `1.5`, isHidden: false },
      { input: `5000, 50`, expectedOutput: `1`, isHidden: false },
      { input: `1000, 0`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Divide errors by total, multiply by 100, and round to 2 decimal places."]
  },
  {
    id: "sd-tier3-038",
    tier: 3,
    section: "Distributed Systems",
    topic: "Logging",
    title: "Logging",
    slug: "logging",
    difficulty: "Medium",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "logging", "elk", "loki", "Observability"],
    xpReward: 100,
    description: `Build Centralized Logging pipelines (ELK Stack, Grafana Loki, Fluentbit). Learn structured JSON logging, log shippers, buffering, indexing, and cost control through retention tiers.

### Learning Objectives
- Emit structured JSON logs containing standard context: timestamp, logLevel, serviceName, traceId, userId
- Stream logs to local agents (Fluentbit/Vector) asynchronously without blocking application threads
- Buffer logs in Kafka or Redis to absorb logging spikes during major production incidents
- Index log streams efficiently (e.g. Loki indexes metadata labels only, keeping raw text unindexed for low cost)
- Establish lifecycle retention policies: hot NVMe storage for 7 days, cold object storage for 90 days

### Practical Challenge
Format a structured log object from message string, level, and traceId.`,
    starterCode: {
      javascript: `function formatStructuredLog(level, message, traceId) {
  return {
    level: level.toUpperCase(),
    message,
    traceId
  };
}`,
      python: `def format_structured_log(level, message, trace_id):
    return {
        "level": level.upper(),
        "message": message,
        "traceId": trace_id
    }`
    },
    testCases: [
      { input: `"info", "User signed in", "tr_123"`, expectedOutput: `{"level":"INFO","message":"User signed in","traceId":"tr_123"}`, isHidden: false }
    ],
    hints: ["Construct object with upper-cased level, message, and traceId."]
  },
  {
    id: "sd-tier3-039",
    tier: 3,
    section: "Distributed Systems",
    topic: "Failure Detection",
    title: "Failure Detection",
    slug: "failure-detection",
    difficulty: "Hard",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "failure-detection", "heartbeats", "Fault Tolerance"],
    xpReward: 200,
    description: `Explore Failure Detectors in distributed systems. Understand heartbeat protocols, timeout thresholds, and adaptive algorithms like the Phi Accrual Failure Detector.

### Learning Objectives
- Detect crashed, unresponsive, or partitioned nodes without relying on unreliable immediate ping failures
- Contrast simple timeout detectors (prone to false positives during GC pauses) with adaptive detectors
- Master the Phi Accrual Failure Detector: outputs a suspicion probability (phi) based on historical heartbeat intervals
- Adjust detection thresholds dynamically: high threshold for costly failovers, low threshold for rapid failover
- Handle transient network blips gracefully without triggering premature primary elections

### Practical Challenge
Evaluate simple heartbeat timeout: return true (failed) if currentTime - lastHeartbeatTime > timeoutThreshold.`,
    starterCode: {
      javascript: `function isNodeFailed(currentTime, lastHeartbeatTime, timeoutThreshold) {
  return (currentTime - lastHeartbeatTime) > timeoutThreshold;
}`,
      python: `def is_node_failed(current_time, last_heartbeat_time, timeout_threshold):
    return (current_time - last_heartbeat_time) > timeout_threshold`
    },
    testCases: [
      { input: `1000, 800, 150`, expectedOutput: `true`, isHidden: false },
      { input: `1000, 900, 150`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Return true if elapsed time exceeds timeoutThreshold."]
  },
  {
    id: "sd-tier3-040",
    tier: 3,
    section: "Distributed Systems",
    topic: "Disaster Recovery",
    title: "Disaster Recovery",
    slug: "disaster-recovery",
    difficulty: "Hard",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "disaster-recovery", "rto", "rpo", "Fault Tolerance"],
    xpReward: 200,
    description: `Design enterprise Disaster Recovery (DR) strategies. Understand Recovery Time Objective (RTO), Recovery Point Objective (RPO), Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active.

### Learning Objectives
- Define Recovery Time Objective (RTO: how quickly must the system recover?)
- Define Recovery Point Objective (RPO: how much data loss is acceptable in units of time?)
- Backup & Restore (RTO: hours, RPO: 24h, lowest cost)
- Pilot Light (core database replicated continuously, compute spun up during disaster)
- Warm Standby (scaled-down running replica cluster ready to take traffic)
- Multi-Region Active-Active (RTO: ~0, RPO: ~0, highest operational cost)

### Practical Challenge
Classify DR strategy from target RTO in minutes: return "Active-Active" for RTO < 5, "Warm Standby" for RTO < 60, else "Backup-Restore".`,
    starterCode: {
      javascript: `function classifyDRStrategy(targetRTOMinutes) {
  if (targetRTOMinutes < 5) return "Active-Active";
  if (targetRTOMinutes < 60) return "Warm Standby";
  return "Backup-Restore";
}`,
      python: `def classify_dr_strategy(target_rto_minutes):
    if target_rto_minutes < 5:
        return "Active-Active"
    if target_rto_minutes < 60:
        return "Warm Standby"
    return "Backup-Restore"`
    },
    testCases: [
      { input: `2`, expectedOutput: `"Active-Active"`, isHidden: false },
      { input: `30`, expectedOutput: `"Warm Standby"`, isHidden: false },
      { input: `120`, expectedOutput: `"Backup-Restore"`, isHidden: true }
    ],
    hints: ["RTO under 5 min requires Active-Active; under 60 min Warm Standby; otherwise Backup-Restore."]
  },
  {
    id: "sd-tier3-041",
    tier: 3,
    section: "Distributed Systems",
    topic: "Multi-Region Systems",
    title: "Multi-Region Systems",
    slug: "multi-region-systems",
    difficulty: "Hard",
    pattern: "Distributed Systems",
    category: "system-design",
    tags: ["sd-distributed", "system-design", "multi-region", "Distributed Systems"],
    xpReward: 200,
    description: `Architect Multi-Region Distributed Systems. Address cross-continent latency speed-of-light limits, geo-replication conflicts, Anycast routing, and split-brain resilience across global clouds.

### Learning Objectives
- Overcome the speed-of-light physical latency floor: transatlantic round-trip is ~70ms, transpacific ~150ms
- Implement Global Server Load Balancing (GSLB) and BGP Anycast routing to steer users to nearest regional POP
- Manage cross-region data replication models: active-active with conflict resolution vs active-passive with read replicas
- Address data residency compliance laws (EU GDPR, CCPA) requiring data to remain in specific jurisdictions
- Conduct live regional failover drills to prove catastrophic regional outage survival

### Practical Challenge
Calculate minimum network round-trip time in milliseconds given distance in km and light-in-fiber speed (~200,000 km/s): return Math.round((distanceKm * 2 / 200000) * 1000).`,
    starterCode: {
      javascript: `function calculateRoundTripSpeedOfLight(distanceKm) {
  const roundTripKm = distanceKm * 2;
  const timeSeconds = roundTripKm / 200000;
  return Math.round(timeSeconds * 1000);
}`,
      python: `def calculate_round_trip_speed_of_light(distance_km):
    round_trip_km = distance_km * 2
    time_seconds = round_trip_km / 200000.0
    return round(time_seconds * 1000)`
    },
    testCases: [
      { input: `6000`, expectedOutput: `60`, isHidden: false },
      { input: `10000`, expectedOutput: `100`, isHidden: false }
    ],
    hints: ["RTT in fiber: (distance * 2 / 200,000) * 1000 ms."]
  }
];
