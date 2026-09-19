/**
 * TIER 2 — STORAGE SYSTEMS (30 Topics)
 * Difficulty: Easy – Medium
 * Patterns: Database Design, Replication, Sharding, Partitioning, Caching, Consistency, Storage, Data Modeling
 */

module.exports = [
  {
    id: "sd-tier2s-001",
    tier: 2,
    section: "Storage Systems",
    topic: "Relational Databases",
    title: "Relational Databases",
    slug: "relational-databases",
    difficulty: "Medium",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-storage", "system-design", "rdbms", "database", "Database Design"],
    xpReward: 100,
    description: `Learn the fundamentals of Relational Database Management Systems (RDBMS). Understand table schemas, foreign key relationships, normalization, and ACID properties that guarantee structural data integrity.

### Learning Objectives
- Understand relational data modeling: tables, rows, columns, and foreign keys
- Master database normalization (1NF, 2NF, 3NF, BCNF) to eliminate redundancy
- Evaluate when to denormalize for read-heavy query optimization
- Learn how storage engines (InnoDB, PostgreSQL Heap) store data on disk pages
- Recognize when RDBMS is the right choice versus non-relational alternatives

### Practical Challenge
Determine if a table requires denormalization: return true if read query count exceeds write count by more than 10x and join depth is >= 3.`,
    starterCode: {
      javascript: `function shouldDenormalize(readCount, writeCount, joinDepth) {
  return (readCount / writeCount > 10) && joinDepth >= 3;
}`,
      python: `def should_denormalize(read_count, write_count, join_depth):
    return (read_count / write_count > 10) and join_depth >= 3`
    },
    testCases: [
      { input: `1000, 50, 4`, expectedOutput: `true`, isHidden: false },
      { input: `200, 50, 4`, expectedOutput: `false`, isHidden: false },
      { input: `1000, 50, 2`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Check if read/write ratio is greater than 10 and join depth is >= 3."]
  },
  {
    id: "sd-tier2s-002",
    tier: 2,
    section: "Storage Systems",
    topic: "SQL",
    title: "SQL",
    slug: "sql",
    difficulty: "Easy",
    pattern: "Data Modeling",
    category: "system-design",
    tags: ["sd-storage", "system-design", "sql", "Data Modeling"],
    xpReward: 50,
    description: `Understand Structured Query Language (SQL) execution plans, declarative querying, joins (Inner, Left, Cross, Hash, Merge), and aggregations. Learn how the SQL query engine plans and executes data retrieval.

### Learning Objectives
- Analyze query execution plans using EXPLAIN / EXPLAIN ANALYZE
- Compare join algorithms: Nested Loop Join, Hash Join, and Sort-Merge Join
- Optimize aggregate queries (GROUP BY, HAVING, Window Functions)
- Prevent SQL injection using parameterized statements
- Write efficient pagination queries without high offset penalties

### Practical Challenge
Calculate total rows scanned in a nested loop join given outer table rows and inner table rows (with no index).`,
    starterCode: {
      javascript: `function calculateNestedLoopScans(outerRows, innerRows) {
  return outerRows * innerRows;
}`,
      python: `def calculate_nested_loop_scans(outer_rows, inner_rows):
    return outer_rows * inner_rows`
    },
    testCases: [
      { input: `100, 500`, expectedOutput: `50000`, isHidden: false },
      { input: `50, 20`, expectedOutput: `1000`, isHidden: false },
      { input: `1000, 1000`, expectedOutput: `1000000`, isHidden: true }
    ],
    hints: ["A nested loop without index scans inner table once for every row in the outer table."]
  },
  {
    id: "sd-tier2s-003",
    tier: 2,
    section: "Storage Systems",
    topic: "NoSQL",
    title: "NoSQL",
    slug: "nosql",
    difficulty: "Medium",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-storage", "system-design", "nosql", "Database Design"],
    xpReward: 100,
    description: `Explore NoSQL database families: Key-Value, Document, Wide-Column, and Graph. Learn how relaxing strict schemas and ACID locks enables massive horizontal scale and dynamic data models.

### Learning Objectives
- Classify NoSQL stores into Key-Value, Document, Wide-Column, and Graph categories
- Understand schema-on-read vs schema-on-write flexibility
- Analyze horizontal data partitioning capabilities in distributed NoSQL engines
- Select between NoSQL and RDBMS based on data access patterns and scaling requirements
- Understand eventual consistency trade-offs in NoSQL databases

### Practical Challenge
Select the appropriate NoSQL category ("key-value", "document", "wide-column", "graph") based on access pattern keyword ("cache", "nested-json", "time-series", "social-network").`,
    starterCode: {
      javascript: `function selectNoSQLCategory(pattern) {
  const map = {
    "cache": "key-value",
    "nested-json": "document",
    "time-series": "wide-column",
    "social-network": "graph"
  };
  return map[pattern] || "document";
}`,
      python: `def select_no_sql_category(pattern):
    mapping = {
        "cache": "key-value",
        "nested-json": "document",
        "time-series": "wide-column",
        "social-network": "graph"
    }
    return mapping.get(pattern, "document")`
    },
    testCases: [
      { input: `"cache"`, expectedOutput: `"key-value"`, isHidden: false },
      { input: `"social-network"`, expectedOutput: `"graph"`, isHidden: false },
      { input: `"nested-json"`, expectedOutput: `"document"`, isHidden: true }
    ],
    hints: ["Map access pattern to the most tailored NoSQL data model family."]
  },
  {
    id: "sd-tier2s-004",
    tier: 2,
    section: "Storage Systems",
    topic: "Key-Value Stores",
    title: "Key-Value Stores",
    slug: "key-value-stores",
    difficulty: "Easy",
    pattern: "Storage",
    category: "system-design",
    tags: ["sd-storage", "system-design", "key-value", "Storage"],
    xpReward: 50,
    description: `Examine Key-Value stores such as Redis and AWS DynamoDB. Understand sub-millisecond lookups via hash maps, persistence models (RDB, AOF), and in-memory vs disk architectures.

### Learning Objectives
- Master primary operations: GET(key), PUT(key, value), DELETE(key) in O(1) time
- Understand in-memory data structures (Strings, Hashes, Lists, Sets, Sorted Sets)
- Explore persistence mechanisms: snapshotting (RDB) and write logging (AOF)
- Implement distributed sessions, feature flags, and token caches
- Design partitioning keys for uniform key-space distribution

### Practical Challenge
Simulate an in-memory key-value store with TTL: return true if key exists and has not expired, otherwise false.`,
    starterCode: {
      javascript: `function isKeyValidInStore(store, key, currentTime) {
  if (!store[key]) return false;
  const { value, expiresAt } = store[key];
  return currentTime < expiresAt;
}`,
      python: `def is_key_valid_in_store(store, key, current_time):
    if key not in store:
        return False
    entry = store[key]
    return current_time < entry.get("expiresAt", 0)`
    },
    testCases: [
      { input: `{"session_1": {"value": "alice", "expiresAt": 1000}}, "session_1", 900`, expectedOutput: `true`, isHidden: false },
      { input: `{"session_1": {"value": "alice", "expiresAt": 1000}}, "session_1", 1100`, expectedOutput: `false`, isHidden: false },
      { input: `{}, "missing", 500`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Check if key exists in store and current time is strictly less than expiresAt."]
  },
  {
    id: "sd-tier2s-005",
    tier: 2,
    section: "Storage Systems",
    topic: "Document Databases",
    title: "Document Databases",
    slug: "document-databases",
    difficulty: "Medium",
    pattern: "Data Modeling",
    category: "system-design",
    tags: ["sd-storage", "system-design", "mongodb", "document", "Data Modeling"],
    xpReward: 100,
    description: `Understand Document Databases like MongoDB and Couchbase. Explore JSON/BSON storage, embedded documents vs references, secondary indexing, and polymorphic schema models.

### Learning Objectives
- Design schemas using embedding (denormalization) vs referencing (normalization)
- Understand when to embed: 1-to-few relationships and bounded data sets
- Avoid document size growth limits (e.g. 16MB limit in MongoDB)
- Build secondary indexes on nested JSON fields and arrays
- Execute aggregation pipelines (match, project, group, unwind)

### Practical Challenge
Determine document modeling strategy: return "embed" if child items are bounded (count <= 100) and queried together, otherwise "reference".`,
    starterCode: {
      javascript: `function chooseDocumentModel(childCount, queriedTogether) {
  return (childCount <= 100 && queriedTogether) ? "embed" : "reference";
}`,
      python: `def choose_document_model(child_count, queried_together):
    return "embed" if (child_count <= 100 and queried_together) else "reference"`
    },
    testCases: [
      { input: `10, true`, expectedOutput: `"embed"`, isHidden: false },
      { input: `5000, true`, expectedOutput: `"reference"`, isHidden: false },
      { input: `20, false`, expectedOutput: `"reference"`, isHidden: true }
    ],
    hints: ["Embed for bounded 1-to-few data queried together; reference for large or independently queried data."]
  },
  {
    id: "sd-tier2s-006",
    tier: 2,
    section: "Storage Systems",
    topic: "Wide-Column Databases",
    title: "Wide-Column Databases",
    slug: "wide-column-databases",
    difficulty: "Medium",
    pattern: "Storage",
    category: "system-design",
    tags: ["sd-storage", "system-design", "cassandra", "wide-column", "Storage"],
    xpReward: 100,
    description: `Master Wide-Column stores like Apache Cassandra and ScyllaDB. Learn Log-Structured Merge-tree (LSM-tree) storage, partition keys, clustering columns, and append-only write paths.

### Learning Objectives
- Understand primary key composition: Partition Key (data location) and Clustering Key (on-disk sort order)
- Master LSM-tree architecture: MemTable, CommitLog, SSTables, and compaction
- Model data strictly based on query access patterns ("one table per query")
- Avoid full cluster table scans and anti-patterns like secondary indexes
- Optimize for high-throughput write workloads (IoT, metrics, time-series)

### Practical Challenge
Determine which node stores a row: compute hash(partitionKey) modulo totalNodes.`,
    starterCode: {
      javascript: `function getWideColumnNode(partitionKey, totalNodes) {
  let hash = 0;
  for (let i = 0; i < partitionKey.length; i++) {
    hash = (hash * 31 + partitionKey.charCodeAt(i)) >>> 0;
  }
  return hash % totalNodes;
}`,
      python: `def get_wide_column_node(partition_key, total_nodes):
    h = 0
    for ch in partition_key:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % total_nodes`
    },
    testCases: [
      { input: `"user_1234", 8`, expectedOutput: `6`, isHidden: false },
      { input: `"sensor_abc", 4`, expectedOutput: `2`, isHidden: false }
    ],
    hints: ["Compute string hash and modulo by totalNodes."]
  },
  {
    id: "sd-tier2s-007",
    tier: 2,
    section: "Storage Systems",
    topic: "Graph Databases",
    title: "Graph Databases",
    slug: "graph-databases",
    difficulty: "Medium",
    pattern: "Data Modeling",
    category: "system-design",
    tags: ["sd-storage", "system-design", "graph", "neo4j", "Data Modeling"],
    xpReward: 100,
    description: `Explore Graph Databases like Neo4j and Amazon Neptune. Understand nodes, edges, properties, index-free adjacency, and rapid multi-hop path traversals.

### Learning Objectives
- Model highly connected domains: social networks, recommendation engines, fraud graphs
- Understand Index-Free Adjacency (nodes hold direct pointers to adjacent nodes)
- Avoid expensive recursive multi-table SQL joins
- Query graphs using declarative languages like Cypher and Gremlin
- Address distributed graph partitioning challenges (cut edges problem)

### Practical Challenge
Compute the total degrees (connections) of a given node in an edge list representation.`,
    starterCode: {
      javascript: `function getNodeDegree(node, edges) {
  let count = 0;
  for (const [u, v] of edges) {
    if (u === node || v === node) count++;
  }
  return count;
}`,
      python: `def get_node_degree(node, edges):
    return sum(1 for u, v in edges if u == node or v == node)`
    },
    testCases: [
      { input: `"alice", [["alice", "bob"], ["alice", "carol"], ["bob", "dave"]]`, expectedOutput: `2`, isHidden: false },
      { input: `"dave", [["alice", "bob"], ["bob", "dave"]]`, expectedOutput: `1`, isHidden: false },
      { input: `"lonely", [["a", "b"]]`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Count how many edges contain the target node as either source or destination."]
  },
  {
    id: "sd-tier2s-008",
    tier: 2,
    section: "Storage Systems",
    topic: "Database Indexing",
    title: "Database Indexing",
    slug: "database-indexing",
    difficulty: "Medium",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-storage", "system-design", "indexing", "b-tree", "Database Design"],
    xpReward: 100,
    description: `Understand database indexing internals: B-Trees, B+ Trees, and Hash Indexes. Learn how indexes transform full table scans O(N) into lightning-fast logarithmic searches O(log N).

### Learning Objectives
- Understand B+ Tree anatomy: root, internal navigation nodes, and leaf linked lists
- Compare Clustered Index (data rows stored in leaf nodes) with Non-Clustered / Secondary Index
- Analyze index maintenance overhead on write performance (INSERT, UPDATE, DELETE)
- Use Covering Indexes to eliminate table lookups (index-only scans)
- Recognize cardinality and selectivity when choosing columns to index

### Practical Challenge
Calculate theoretical disk block lookups for a B+ Tree search of height H with leaf seek: return H.`,
    starterCode: {
      javascript: `function calculateBTreeLookups(height) {
  return height;
}`,
      python: `def calculate_b_tree_lookups(height):
    return height`
    },
    testCases: [
      { input: `3`, expectedOutput: `3`, isHidden: false },
      { input: `4`, expectedOutput: `4`, isHidden: false },
      { input: `1`, expectedOutput: `1`, isHidden: true }
    ],
    hints: ["In a B+ Tree, searching a leaf row requires reading 1 block per tree level from root to leaf."]
  },
  {
    id: "sd-tier2s-009",
    tier: 2,
    section: "Storage Systems",
    topic: "Composite Indexes",
    title: "Composite Indexes",
    slug: "composite-indexes",
    difficulty: "Medium",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-storage", "system-design", "composite-index", "Database Design"],
    xpReward: 100,
    description: `Master composite (multi-column) indexing. Learn the critical "Leftmost Prefix Rule" and how column ordering dictates which queries can leverage the index.

### Learning Objectives
- Master the Leftmost Prefix Rule: an index on (A, B, C) supports queries on (A), (A, B), and (A, B, C)
- Recognize why queries filtering only on (B) or (C) cannot use the index
- Place high-cardinality equality columns before range filter columns
- Avoid redundant indexes when a composite index already covers leftmost prefixes
- Evaluate execution plans for multi-column sort and filter workloads

### Practical Challenge
Given composite index columns ['a', 'b', 'c'] and query filter columns, return true if the query can utilize the index via leftmost prefix rule.`,
    starterCode: {
      javascript: `function canUseCompositeIndex(indexColumns, queryColumns) {
  if (queryColumns.length === 0 || indexColumns.length === 0) return false;
  // Must match prefix starting at index 0
  return queryColumns[0] === indexColumns[0];
}`,
      python: `def can_use_composite_index(index_columns, query_columns):
    if not query_columns or not index_columns:
        return False
    return query_columns[0] == index_columns[0]`
    },
    testCases: [
      { input: `["user_id", "status", "created_at"], ["user_id", "status"]`, expectedOutput: `true`, isHidden: false },
      { input: `["user_id", "status", "created_at"], ["status"]`, expectedOutput: `false`, isHidden: false },
      { input: `["tenant_id", "account_id"], ["tenant_id"]`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["An index on (A, B, C) can only be used if the query filters on the first column A."]
  },
  {
    id: "sd-tier2s-010",
    tier: 2,
    section: "Storage Systems",
    topic: "Query Optimization",
    title: "Query Optimization",
    slug: "query-optimization",
    difficulty: "Medium",
    pattern: "Performance",
    category: "system-design",
    tags: ["sd-storage", "system-design", "query-optimization", "Performance"],
    xpReward: 100,
    description: `Learn how to diagnose slow database queries and optimize performance using indexing strategies, join optimizations, query restructuring, and N+1 query elimination.

### Learning Objectives
- Diagnose slow queries using slow query logs and EXPLAIN plans
- Eliminate the dreaded N+1 query problem using batch fetching and JOINs
- Replace inefficient SELECT * with explicit column projection
- Avoid expensive operations: leading wildcards (LIKE '%foo'), functions on indexed columns
- Optimize large-table pagination using keyset (cursor) pagination instead of high OFFSET

### Practical Challenge
Detect N+1 query vulnerability: given total parent records and total SQL queries executed, return true if queries >= parentRecords + 1.`,
    starterCode: {
      javascript: `function isNPlusOneQuery(parentRecords, totalQueries) {
  return totalQueries >= parentRecords + 1;
}`,
      python: `def is_n_plus_one_query(parent_records, total_queries):
    return total_queries >= parent_records + 1`
    },
    testCases: [
      { input: `100, 101`, expectedOutput: `true`, isHidden: false },
      { input: `100, 2`, expectedOutput: `false`, isHidden: false },
      { input: `50, 51`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["N+1 occurs when 1 query fetches parents, followed by N separate queries for children."]
  },
  {
    id: "sd-tier2s-011",
    tier: 2,
    section: "Storage Systems",
    topic: "Database Transactions",
    title: "Database Transactions",
    slug: "database-transactions",
    difficulty: "Medium",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-storage", "system-design", "transactions", "Consistency"],
    xpReward: 100,
    description: `Deep-dive into transaction isolation levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Understand anomalies like Dirty Reads, Non-Repeatable Reads, and Phantom Reads.

### Learning Objectives
- Define the 4 standard ANSI SQL isolation levels
- Understand transaction anomalies: Dirty Reads, Non-Repeatable Reads, Phantom Reads
- Learn how Multi-Version Concurrency Control (MVCC) achieves non-blocking reads
- Contrast pessimistic locking (SELECT FOR UPDATE) with optimistic locking (version column)
- Mitigate deadlocks through ordered resource acquisition and lock timeout policies

### Practical Challenge
Check if an isolation level prevents phantom reads: return true for "Serializable", false for others.`,
    starterCode: {
      javascript: `function preventsPhantomReads(isolationLevel) {
  return isolationLevel.toLowerCase() === "serializable";
}`,
      python: `def prevents_phantom_reads(isolation_level):
    return isolation_level.lower() == "serializable"`
    },
    testCases: [
      { input: `"Serializable"`, expectedOutput: `true`, isHidden: false },
      { input: `"Read Committed"`, expectedOutput: `false`, isHidden: false },
      { input: `"Repeatable Read"`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Under standard ANSI SQL, only Serializable isolation strictly prevents phantom reads."]
  },
  {
    id: "sd-tier2s-012",
    tier: 2,
    section: "Storage Systems",
    topic: "Database Replication",
    title: "Database Replication",
    slug: "database-replication",
    difficulty: "Medium",
    pattern: "Replication",
    category: "system-design",
    tags: ["sd-storage", "system-design", "replication", "Replication"],
    xpReward: 100,
    description: `Understand database replication topologies: Synchronous vs Asynchronous replication, replication lag, binlog shipping, and conflict detection in multi-leader setups.

### Learning Objectives
- Compare Synchronous replication (strong consistency, write latency) with Asynchronous replication (low latency, replication lag)
- Analyze semi-synchronous replication as an operational compromise
- Understand the Write-Ahead Log (WAL) and binary log streaming mechanisms
- Handle replication lag and "read-your-own-writes" consistency requirements
- Understand Multi-Leader and Leaderless (Dynamo-style) replication models

### Practical Challenge
Calculate replication lag in seconds: return max(0, primaryTimestamp - replicaTimestamp).`,
    starterCode: {
      javascript: `function calculateReplicationLag(primaryTimestamp, replicaTimestamp) {
  return Math.max(0, primaryTimestamp - replicaTimestamp);
}`,
      python: `def calculate_replication_lag(primary_timestamp, replica_timestamp):
    return max(0, primary_timestamp - replica_timestamp)`
    },
    testCases: [
      { input: `1700000010, 1700000005`, expectedOutput: `5`, isHidden: false },
      { input: `1700000010, 1700000010`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Replication lag is the difference between primary write time and replica applied time."]
  },
  {
    id: "sd-tier2s-013",
    tier: 2,
    section: "Storage Systems",
    topic: "Primary-Replica Architecture",
    title: "Primary-Replica Architecture",
    slug: "primary-replica-architecture",
    difficulty: "Medium",
    pattern: "Replication",
    category: "system-design",
    tags: ["sd-storage", "system-design", "primary-replica", "Replication"],
    xpReward: 100,
    description: `Explore the Primary-Replica (Master-Slave) database architecture. Understand how all write traffic directs to a single primary while read traffic distributes across multiple read replicas.

### Learning Objectives
- Direct write mutations strictly to primary to maintain linear execution history
- Offload intensive read queries, analytical reports, and search queries to read replicas
- Handle primary failover: health detection, replica promotion, and split-brain prevention
- Mitigate replica lag when users read immediately after writing (sticky routing)
- Plan capacity for read vs write traffic ratios (e.g. 99% reads vs 1% writes)

### Practical Challenge
Route a database query to the appropriate connection string ("primary" for writes, "replica" for reads).`,
    starterCode: {
      javascript: `function routeDBQuery(queryType) {
  const writeOps = ["INSERT", "UPDATE", "DELETE", "ALTER", "DROP"];
  return writeOps.includes(queryType.toUpperCase()) ? "primary" : "replica";
}`,
      python: `def route_db_query(query_type):
    write_ops = {"INSERT", "UPDATE", "DELETE", "ALTER", "DROP"}
    return "primary" if query_type.upper() in write_ops else "replica"`
    },
    testCases: [
      { input: `"SELECT"`, expectedOutput: `"replica"`, isHidden: false },
      { input: `"INSERT"`, expectedOutput: `"primary"`, isHidden: false },
      { input: `"UPDATE"`, expectedOutput: `"primary"`, isHidden: true }
    ],
    hints: ["Route mutating operations (INSERT, UPDATE, DELETE) to primary; SELECT to replica."]
  },
  {
    id: "sd-tier2s-014",
    tier: 2,
    section: "Storage Systems",
    topic: "Read Replicas",
    title: "Read Replicas",
    slug: "read-replicas",
    difficulty: "Medium",
    pattern: "Replication",
    category: "system-design",
    tags: ["sd-storage", "system-design", "read-replicas", "Replication"],
    xpReward: 100,
    description: `Scale read-heavy workloads with Read Replicas. Learn how to size replica pools, balance read traffic, handle replication delay, and maintain acceptable data freshness.

### Learning Objectives
- Scale read throughput horizontally by adding read replicas behind a read load balancer
- Implement Read-Your-Own-Writes consistency by routing recently modified user queries to primary for a brief window
- Monitor replication lag and automatically drain traffic from lagging replicas
- Place read replicas in remote geographic regions to reduce read latency
- Understand the limits of read replicas (they do NOT scale write capacity)

### Practical Challenge
Given total read QPS and capacity per read replica, calculate the number of read replicas required. Round up.`,
    starterCode: {
      javascript: `function calculateReadReplicasNeeded(readQPS, capacityPerReplica) {
  return Math.ceil(readQPS / capacityPerReplica);
}`,
      python: `import math

def calculate_read_replicas_needed(read_qps, capacity_per_replica):
    return math.ceil(read_qps / capacity_per_replica)`
    },
    testCases: [
      { input: `10000, 2500`, expectedOutput: `4`, isHidden: false },
      { input: `12000, 2500`, expectedOutput: `5`, isHidden: false },
      { input: `2000, 5000`, expectedOutput: `1`, isHidden: true }
    ],
    hints: ["Divide total read QPS by single replica capacity and take ceiling."]
  },
  {
    id: "sd-tier2s-015",
    tier: 2,
    section: "Storage Systems",
    topic: "Database Sharding",
    title: "Database Sharding",
    slug: "database-sharding",
    difficulty: "Medium",
    pattern: "Sharding",
    category: "system-design",
    tags: ["sd-storage", "system-design", "sharding", "Sharding"],
    xpReward: 100,
    description: `Learn how large datasets can be partitioned across multiple database nodes to distribute storage and traffic. Explore shard-key selection, rebalancing, hot partitions, and the trade-offs between scalability and consistency.

### Learning Objectives
- Understand why sharding is required when data exceeds single-instance storage and IOPS limits
- Select shard keys carefully to achieve uniform distribution and avoid hot spots
- Understand the complexity of cross-shard queries and distributed joins
- Handle shard rebalancing and data migration with zero downtime
- Compare application-level sharding with database-native sharding (Vitess, Citus)

### Practical Challenge
Implement hash-based shard routing: given integer entityId and totalShards count, return assigned shard index (0-indexed).`,
    starterCode: {
      javascript: `function getShardIndex(entityId, totalShards) {
  return Math.abs(entityId) % totalShards;
}`,
      python: `def get_shard_index(entity_id, total_shards):
    return abs(entity_id) % total_shards`
    },
    testCases: [
      { input: `105, 4`, expectedOutput: `1`, isHidden: false },
      { input: `88, 8`, expectedOutput: `0`, isHidden: false },
      { input: `23, 5`, expectedOutput: `3`, isHidden: true }
    ],
    hints: ["Use modulo arithmetic: entityId % totalShards."]
  },
  {
    id: "sd-tier2s-016",
    tier: 2,
    section: "Storage Systems",
    topic: "Database Partitioning",
    title: "Database Partitioning",
    slug: "database-partitioning",
    difficulty: "Medium",
    pattern: "Partitioning",
    category: "system-design",
    tags: ["sd-storage", "system-design", "partitioning", "Partitioning"],
    xpReward: 100,
    description: `Differentiate Vertical Partitioning (schema splitting) from Horizontal Partitioning (range, list, hash partitioning). Learn how table partitioning speeds up query pruning and archiving.

### Learning Objectives
- Compare horizontal partitioning (splitting rows) with vertical partitioning (splitting columns)
- Explore range-based partitioning (e.g. by date/month) for rapid partition dropping during data retention archiving
- Master partition pruning: the SQL optimizer skips partitions outside query WHERE clauses
- Understand list-based partitioning (e.g. by country/region) for regulatory data residency
- Avoid cross-partition aggregation bottlenecks

### Practical Challenge
Determine partition table name for a timestamp using year-month format (e.g. "orders_2026_09").`,
    starterCode: {
      javascript: `function getPartitionTableName(tableName, year, month) {
  const m = month < 10 ? "0" + month : "" + month;
  return \`\${tableName}_\${year}_\${m}\`;
}`,
      python: `def get_partition_table_name(table_name, year, month):
    m = f"{month:02d}"
    return f"{table_name}_{year}_{m}"`
    },
    testCases: [
      { input: `"orders", 2026, 9`, expectedOutput: `"orders_2026_09"`, isHidden: false },
      { input: `"events", 2026, 12`, expectedOutput: `"events_2026_12"`, isHidden: false }
    ],
    hints: ["Pad single-digit month with zero and concatenate table name, year, and month with underscores."]
  },
  {
    id: "sd-tier2s-017",
    tier: 2,
    section: "Storage Systems",
    topic: "Consistent Hashing",
    title: "Consistent Hashing",
    slug: "consistent-hashing",
    difficulty: "Medium",
    pattern: "Sharding",
    category: "system-design",
    tags: ["sd-storage", "system-design", "consistent-hashing", "Sharding"],
    xpReward: 100,
    description: `Master Consistent Hashing: the algorithmic backbone of distributed caches, databases (Cassandra, Dynamo), and load balancers. Learn how it minimizes data remapping when nodes join or leave.

### Learning Objectives
- Understand why traditional hash modulo (hash(key) % N) causes catastrophic remapping when N changes
- Map both servers and keys onto a circular hash ring [0, 2^32 - 1]
- Locate the target server by moving clockwise on the ring from the key's hash position
- Add Virtual Nodes (vnodes) to balance load distribution and eliminate hot spots
- Bound key migration to K/N on average when adding or removing a node

### Practical Challenge
Given sorted node ring positions and a key hash, find the assigned node position (the first node position >= keyHash, or wrap around to the first node).`,
    starterCode: {
      javascript: `function findConsistentHashNode(ringNodes, keyHash) {
  for (const node of ringNodes) {
    if (node >= keyHash) return node;
  }
  return ringNodes[0];
}`,
      python: `def find_consistent_hash_node(ring_nodes, key_hash):
    for node in ring_nodes:
        if node >= key_hash:
            return node
    return ring_nodes[0]`
    },
    testCases: [
      { input: `[100, 300, 500], 250`, expectedOutput: `300`, isHidden: false },
      { input: `[100, 300, 500], 550`, expectedOutput: `100`, isHidden: false },
      { input: `[100, 300, 500], 100`, expectedOutput: `100`, isHidden: true }
    ],
    hints: ["Traverse sorted ringNodes. Return the first node >= keyHash; if none, wrap around to ringNodes[0]."]
  },
  {
    id: "sd-tier2s-018",
    tier: 2,
    section: "Storage Systems",
    topic: "Hot Partitions",
    title: "Hot Partitions",
    slug: "hot-partitions",
    difficulty: "Medium",
    pattern: "Partitioning",
    category: "system-design",
    tags: ["sd-storage", "system-design", "hot-partitions", "Partitioning"],
    xpReward: 100,
    description: `Understand the "Celebrity Problem" and hot partitions. Discover how disproportionate traffic directed to a single key or shard degrades cluster stability and how salting mitigates it.

### Learning Objectives
- Identify causes of hot partitions: celebrity accounts, viral items, date-based sequential keys
- Detect hot partitions via CPU utilization, queue depth, and IOPS metrics per shard
- Mitigate hot keys using Key Salting (appending random suffix 1..K during writes)
- Implement multi-tier caching (in-memory L1 cache) on application servers for hot keys
- Design adaptive re-sharding and dedicated shard isolation for high-volume entities

### Practical Challenge
Generate a salted key: append a random salt between 0 and numSalts - 1 to the base key string in format "key_salt".`,
    starterCode: {
      javascript: `function generateSaltedKey(baseKey, saltIndex) {
  return \`\${baseKey}_\${saltIndex}\`;
}`,
      python: `def generate_salted_key(base_key, salt_index):
    return f"{base_key}_{salt_index}"`
    },
    testCases: [
      { input: `"celebrity_123", 4`, expectedOutput: `"celebrity_123_4"`, isHidden: false },
      { input: `"trending_item", 0`, expectedOutput: `"trending_item_0"`, isHidden: false }
    ],
    hints: ["Concatenate base key and salt index with an underscore."]
  },
  {
    id: "sd-tier2s-019",
    tier: 2,
    section: "Storage Systems",
    topic: "Database Failover",
    title: "Database Failover",
    slug: "database-failover",
    difficulty: "Medium",
    pattern: "Consistency",
    category: "system-design",
    tags: ["sd-storage", "system-design", "failover", "ha", "Consistency"],
    xpReward: 100,
    description: `Explore automatic database failover mechanisms. Learn how heartbeats, consensus quorums, and virtual IPs prevent split-brain scenarios when a primary node fails.

### Learning Objectives
- Differentiate Manual Failover from Automated Failover systems (e.g. Orchestrator, Patroni)
- Prevent the catastrophic Split-Brain phenomenon where two nodes both believe they are primary
- Understand fencing tokens and STONITH (Shoot The Other Node In The Head) mechanisms
- Update client connection endpoints using DNS TTL, Virtual IPs, or connection pool proxy re-routing
- Quantify Recovery Time Objective (RTO) and Recovery Point Objective (RPO) during failover

### Practical Challenge
Evaluate failover quorum: given total nodes in cluster, return minimum votes required to elect a new primary: floor(totalNodes / 2) + 1.`,
    starterCode: {
      javascript: `function calculateFailoverQuorum(totalNodes) {
  return Math.floor(totalNodes / 2) + 1;
}`,
      python: `def calculate_failover_quorum(total_nodes):
    return (total_nodes // 2) + 1`
    },
    testCases: [
      { input: `3`, expectedOutput: `2`, isHidden: false },
      { input: `5`, expectedOutput: `3`, isHidden: false },
      { input: `7`, expectedOutput: `4`, isHidden: true }
    ],
    hints: ["Majority quorum is floor(totalNodes / 2) + 1."]
  },
  {
    id: "sd-tier2s-020",
    tier: 2,
    section: "Storage Systems",
    topic: "Connection Pooling",
    title: "Connection Pooling",
    slug: "connection-pooling",
    difficulty: "Easy",
    pattern: "Database Design",
    category: "system-design",
    tags: ["sd-storage", "system-design", "connection-pooling", "Database Design"],
    xpReward: 50,
    description: `Understand Database Connection Pooling (PgBouncer, HikariCP). Learn why opening new TCP/TLS database connections on every request degrades database performance and exhausts memory.

### Learning Objectives
- Analyze the cost of establishing database connections: TCP 3-way handshake, TLS exchange, auth handshake, backend process fork
- Maintain warm pools of persistent database connections for immediate reuse
- Configure pool parameters: minPoolSize, maxPoolSize, connectionTimeout, maxLifetime
- Prevent connection pool starvation under traffic spikes using backpressure
- Deploy middle-tier proxies (PgBouncer) between thousands of serverless workers and relational databases

### Practical Challenge
Calculate total memory consumed by database connections (in MB) given connection count and memory footprint per connection in MB.`,
    starterCode: {
      javascript: `function calculateConnectionMemoryMB(connections, mbPerConnection) {
  return connections * mbPerConnection;
}`,
      python: `def calculate_connection_memory_mb(connections, mb_per_connection):
    return connections * mb_per_connection`
    },
    testCases: [
      { input: `500, 10`, expectedOutput: `5000`, isHidden: false },
      { input: `100, 5`, expectedOutput: `500`, isHidden: false }
    ],
    hints: ["Multiply connection count by MB per connection."]
  },
  {
    id: "sd-tier2s-021",
    tier: 2,
    section: "Storage Systems",
    topic: "Caching",
    title: "Caching",
    slug: "caching",
    difficulty: "Easy",
    pattern: "Caching",
    category: "system-design",
    tags: ["sd-storage", "system-design", "caching", "Caching"],
    xpReward: 50,
    description: `Explore multi-level caching architectures. Learn how combining browser cache, CDN edge cache, reverse proxy cache, application in-memory cache, and distributed cache shields the database.

### Learning Objectives
- Design multi-tier caching topologies from client edge to database layer
- Leverage the 80/20 Pareto principle to serve 80% of read traffic from memory
- Understand cache eviction policies: LRU, LFU, and time-based TTL expiration
- Protect against cache stampedes using mutual exclusion locks (single-flight pattern)
- Monitor cache efficiency via hit ratio, memory fragmentation, and eviction metrics

### Practical Challenge
Calculate database load reduction percentage given cache hit ratio percentage. (If hit ratio is 90%, load reduction is 90%).`,
    starterCode: {
      javascript: `function calculateDatabaseLoadReduction(cacheHitRatioPercent) {
  return cacheHitRatioPercent;
}`,
      python: `def calculate_database_load_reduction(cache_hit_ratio_percent):
    return cache_hit_ratio_percent`
    },
    testCases: [
      { input: `85`, expectedOutput: `85`, isHidden: false },
      { input: `99`, expectedOutput: `99`, isHidden: false }
    ],
    hints: ["Directly proportional: a 90% cache hit ratio offloads 90% of read queries from the database."]
  },
  {
    id: "sd-tier2s-022",
    tier: 2,
    section: "Storage Systems",
    topic: "Cache-Aside",
    title: "Cache-Aside",
    slug: "cache-aside",
    difficulty: "Medium",
    pattern: "Caching",
    category: "system-design",
    tags: ["sd-storage", "system-design", "cache-aside", "Caching"],
    xpReward: 100,
    description: `Master the Cache-Aside (Lazy Loading) pattern. Learn how the application code directly orchestrates reading from cache, falling back to database on misses, and writing to cache.

### Learning Objectives
- Implement the read flow: Application checks cache -> On hit: return -> On miss: query DB, write to cache, return
- Implement the write flow: Write to DB, then invalidate (delete) the corresponding cache entry
- Understand why deleting the cache entry on write is safer than updating it (avoids race conditions)
- Analyze trade-off: Only requested data is cached (saves RAM), but initial request suffers miss penalty
- Combine Cache-Aside with appropriate TTL to prevent perpetual stale data

### Practical Challenge
Simulate Cache-Aside read: if key is in cache, return { source: "cache", data: val }; else return { source: "db", data: dbVal }.`,
    starterCode: {
      javascript: `function cacheAsideRead(cache, db, key) {
  if (Object.prototype.hasOwnProperty.call(cache, key)) {
    return { source: "cache", data: cache[key] };
  }
  const val = db[key] || null;
  if (val !== null) cache[key] = val;
  return { source: "db", data: val };
}`,
      python: `def cache_aside_read(cache, db, key):
    if key in cache:
        return {"source": "cache", "data": cache[key]}
    val = db.get(key, None)
    if val is not None:
        cache[key] = val
    return {"source": "db", "data": val}`
    },
    testCases: [
      { input: `{"u1": "Alice"}, {"u1": "Alice", "u2": "Bob"}, "u1"`, expectedOutput: `{"source":"cache","data":"Alice"}`, isHidden: false },
      { input: `{}, {"u1": "Alice", "u2": "Bob"}, "u2"`, expectedOutput: `{"source":"db","data":"Bob"}`, isHidden: false }
    ],
    hints: ["Check cache first. If found, return source cache; otherwise fetch from db, populate cache, and return source db."]
  },
  {
    id: "sd-tier2s-023",
    tier: 2,
    section: "Storage Systems",
    topic: "Write-Through Cache",
    title: "Write-Through Cache",
    slug: "write-through-cache",
    difficulty: "Medium",
    pattern: "Caching",
    category: "system-design",
    tags: ["sd-storage", "system-design", "write-through", "Caching"],
    xpReward: 100,
    description: `Understand the Write-Through caching pattern. The application treats the cache as the primary store, and the cache synchronously writes data to the backing database before acknowledging.

### Learning Objectives
- Implement synchronous writes: Application writes to Cache -> Cache writes to DB -> Return success
- Guarantee data consistency between cache and database on writes
- Avoid cache misses on newly written data (data is pre-warmed)
- Analyze the latency penalty: write latency includes both cache write and DB write
- Compare Write-Through with Cache-Aside for read-heavy vs write-heavy workloads

### Practical Challenge
Simulate Write-Through write: synchronously update cache and database, returning true if both succeeded.`,
    starterCode: {
      javascript: `function writeThrough(cache, db, key, value) {
  cache[key] = value;
  db[key] = value;
  return cache[key] === value && db[key] === value;
}`,
      python: `def write_through(cache, db, key, value):
    cache[key] = value
    db[key] = value
    return cache[key] == value and db[key] == value`
    },
    testCases: [
      { input: `{}, {}, "k1", "v1"`, expectedOutput: `true`, isHidden: false },
      { input: `{"k1": "old"}, {"k1": "old"}, "k1", "new"`, expectedOutput: `true`, isHidden: false }
    ],
    hints: ["Update both cache and database synchronously and verify both have the new value."]
  },
  {
    id: "sd-tier2s-024",
    tier: 2,
    section: "Storage Systems",
    topic: "Write-Behind Cache",
    title: "Write-Behind Cache",
    slug: "write-behind-cache",
    difficulty: "Medium",
    pattern: "Caching",
    category: "system-design",
    tags: ["sd-storage", "system-design", "write-behind", "Caching"],
    xpReward: 100,
    description: `Explore Write-Behind (Write-Back) caching. The application writes immediately to memory and returns, while an asynchronous background worker batches updates to the database.

### Learning Objectives
- Achieve ultra-low write latency by acknowledging writes as soon as they are in fast RAM
- Absorb massive write bursts and reduce database IOPS through write coalescing and batching
- Analyze the risk of data loss if the cache node crashes before flushing dirty pages to disk
- Implement write-ahead logs (WAL) to mitigate memory volatility risk
- Apply Write-Behind in write-heavy scenarios like video view counts and gaming leaderboards

### Practical Challenge
Simulate dirty entry tracking in Write-Behind cache: add key to dirtyKeys set and return total pending flush count.`,
    starterCode: {
      javascript: `function recordDirtyKey(dirtySet, key) {
  dirtySet.add(key);
  return dirtySet.size;
}`,
      python: `def record_dirty_key(dirty_set, key):
    dirty_set.add(key)
    return len(dirty_set)`
    },
    testCases: [
      { input: `new Set(["a"]), "b"`, expectedOutput: `2`, isHidden: false },
      { input: `new Set(["a", "b"]), "b"`, expectedOutput: `2`, isHidden: false }
    ],
    hints: ["Add key to the set and return the updated set size."]
  },
  {
    id: "sd-tier2s-025",
    tier: 2,
    section: "Storage Systems",
    topic: "Cache Invalidation",
    title: "Cache Invalidation",
    slug: "cache-invalidation",
    difficulty: "Medium",
    pattern: "Caching",
    category: "system-design",
    tags: ["sd-storage", "system-design", "cache-invalidation", "Caching"],
    xpReward: 100,
    description: `Tackle one of the two hardest problems in computer science: Cache Invalidation. Explore purge, refresh, ban, and versioned key strategies to prevent stale data serving.

### Learning Objectives
- Contrast active invalidation (delete on DB write) with passive expiration (TTL)
- Prevent race conditions: delete cache entry instead of updating it during writes
- Use Versioned Keys (e.g. \`user:123:v2\`) for atomic cache busting without distributed locking
- Implement Change Data Capture (CDC) with Debezium/Kafka to trigger event-driven cache invalidation
- Invalidate related dependent cache entities and collection lists cleanly

### Practical Challenge
Generate a versioned cache key string given entity name, entity ID, and current version integer.`,
    starterCode: {
      javascript: `function getVersionedCacheKey(entity, id, version) {
  return \`\${entity}:\${id}:v\${version}\`;
}`,
      python: `def get_versioned_cache_key(entity, id, version):
    return f"{entity}:{id}:v{version}"`
    },
    testCases: [
      { input: `"user", "101", 3`, expectedOutput: `"user:101:v3"`, isHidden: false },
      { input: `"product", "999", 1`, expectedOutput: `"product:999:v1"`, isHidden: false }
    ],
    hints: ["Format as entity:id:vVersion."]
  },
  {
    id: "sd-tier2s-026",
    tier: 2,
    section: "Storage Systems",
    topic: "Distributed Cache",
    title: "Distributed Cache",
    slug: "distributed-cache",
    difficulty: "Medium",
    pattern: "Caching",
    category: "system-design",
    tags: ["sd-storage", "system-design", "redis", "distributed-cache", "Caching"],
    xpReward: 100,
    description: `Design dedicated Distributed Cache clusters (Redis Cluster, Memcached). Learn hash slot partitioning, gossip consensus, master-replica replication, and client routing.

### Learning Objectives
- Scale cache memory horizontally beyond single-server RAM limits (e.g. to terabytes of RAM)
- Understand Redis Cluster 16,384 hash slot allocation and cluster-aware client redirection (MOVED / ASK)
- Implement high availability via Sentinel or native master-replica auto-failover
- Compare Redis (rich data structures, single-threaded event loop, persistence) with Memcached (multi-threaded, pure key-value)
- Address network latency between compute tiers and dedicated cache tiers

### Practical Challenge
Calculate Redis hash slot for a key: CRC16(key) modulo 16384. (For simulation, compute simple character sum * 31 % 16384).`,
    starterCode: {
      javascript: `function getHashSlot(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xFFFF;
  }
  return hash % 16384;
}`,
      python: `def get_hash_slot(key):
    h = 0
    for ch in key:
        h = (h * 31 + ord(ch)) & 0xFFFF
    return h % 16384`
    },
    testCases: [
      { input: `"user:1001"`, expectedOutput: `3429`, isHidden: false },
      { input: `"orders:2026"`, expectedOutput: `11964`, isHidden: false }
    ],
    hints: ["Compute hash % 16384 for Redis hash slot routing."]
  },
  {
    id: "sd-tier2s-027",
    tier: 2,
    section: "Storage Systems",
    topic: "Object Storage",
    title: "Object Storage",
    slug: "object-storage",
    difficulty: "Medium",
    pattern: "Storage",
    category: "system-design",
    tags: ["sd-storage", "system-design", "s3", "object-storage", "Storage"],
    xpReward: 100,
    description: `Understand Cloud Object Storage systems like Amazon S3 and Google Cloud Storage. Learn flat namespace architectures, metadata separation, 99.999999999% (11 9s) durability, and multipart uploads.

### Learning Objectives
- Compare Object Storage (flat key namespace, REST API, immutable objects) with Block Storage (SAN/EBS) and File Storage (NFS/EFS)
- Understand how Erasure Coding achieves 11 9s of durability across multiple facilities with minimal storage overhead
- Implement Multipart Uploads for robust transfer of large files (gigabytes/terabytes)
- Secure object access using Pre-Signed URLs and IAM bucket policies
- Set up lifecycle rules (moving older objects from Standard to Glacier archive tiers)

### Practical Challenge
Calculate total parts required for a multipart upload given total file size (MB) and part size (MB). Round up.`,
    starterCode: {
      javascript: `function calculateMultipartParts(totalSizeMB, partSizeMB) {
  return Math.ceil(totalSizeMB / partSizeMB);
}`,
      python: `import math

def calculate_multipart_parts(total_size_mb, part_size_mb):
    return math.ceil(total_size_mb / part_size_mb)`
    },
    testCases: [
      { input: `2500, 500`, expectedOutput: `5`, isHidden: false },
      { input: `2600, 500`, expectedOutput: `6`, isHidden: false },
      { input: `100, 500`, expectedOutput: `1`, isHidden: true }
    ],
    hints: ["Divide totalSizeMB by partSizeMB and take ceiling."]
  },
  {
    id: "sd-tier2s-028",
    tier: 2,
    section: "Storage Systems",
    topic: "Blob Storage",
    title: "Blob Storage",
    slug: "blob-storage",
    difficulty: "Easy",
    pattern: "Storage",
    category: "system-design",
    tags: ["sd-storage", "system-design", "blob", "Storage"],
    xpReward: 50,
    description: `Learn Binary Large Object (BLOB) storage design. Understand why large media files (images, audio, video) should never be stored directly inside relational database tables.

### Learning Objectives
- Understand why storing BLOBs in RDBMS bloats database page buffers, degrades cache hit ratio, and exhausts backup bandwidth
- Store metadata (file URL, MIME type, size, upload timestamp) in RDBMS, and raw bytes in dedicated blob stores
- Stream large files directly to/from object storage without buffering in application server RAM
- Serve public assets through a Content Delivery Network (CDN) directly from blob origins
- Implement virus scanning and automated image resizing pipelines upon blob creation

### Practical Challenge
Validate if a file type is an allowed image blob MIME type ("image/jpeg", "image/png", "image/webp").`,
    starterCode: {
      javascript: `function isAllowedImageMime(mimeType) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  return allowed.includes(mimeType.toLowerCase());
}`,
      python: `def is_allowed_image_mime(mime_type):
    allowed = {"image/jpeg", "image/png", "image/webp"}
    return mime_type.lower() in allowed`
    },
    testCases: [
      { input: `"image/png"`, expectedOutput: `true`, isHidden: false },
      { input: `"application/pdf"`, expectedOutput: `false`, isHidden: false },
      { input: `"image/webp"`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Check if mimeType is in the allowed image MIME types list."]
  },
  {
    id: "sd-tier2s-029",
    tier: 2,
    section: "Storage Systems",
    topic: "Data Warehouses",
    title: "Data Warehouses",
    slug: "data-warehouses",
    difficulty: "Medium",
    pattern: "Data Modeling",
    category: "system-design",
    tags: ["sd-storage", "system-design", "data-warehouse", "olap", "Data Modeling"],
    xpReward: 100,
    description: `Explore Online Analytical Processing (OLAP) Data Warehouses (Snowflake, BigQuery, Redshift). Understand columnar storage, massive parallel processing (MPP), and star schema models.

### Learning Objectives
- Contrast OLTP (row-oriented, low latency, normalized) with OLAP (column-oriented, analytical aggregations, denormalized)
- Understand columnar compression efficiency: contiguous storage of same-type column values
- Design Star Schemas and Snowflake Schemas with Fact and Dimension tables
- Extract, Transform, Load (ETL) and ELT data ingestion pipelines
- Execute large-scale ad-hoc business intelligence aggregations over petabyte tables

### Practical Challenge
Categorize workload as "OLTP" or "OLAP" given query characteristics: return "OLAP" if query scans millions of rows and computes aggregate sums/averages; else "OLTP".`,
    starterCode: {
      javascript: `function classifyWorkload(scannedRows, isAggregate) {
  return (scannedRows >= 100000 && isAggregate) ? "OLAP" : "OLTP";
}`,
      python: `def classify_workload(scanned_rows, is_aggregate):
    return "OLAP" if (scanned_rows >= 100000 and is_aggregate) else "OLTP"`
    },
    testCases: [
      { input: `5000000, true`, expectedOutput: `"OLAP"`, isHidden: false },
      { input: `1, false`, expectedOutput: `"OLTP"`, isHidden: false },
      { input: `100, true`, expectedOutput: `"OLTP"`, isHidden: true }
    ],
    hints: ["Analytical aggregation over massive row sets is characteristic of OLAP."]
  },
  {
    id: "sd-tier2s-030",
    tier: 2,
    section: "Storage Systems",
    topic: "Data Lakes",
    title: "Data Lakes",
    slug: "data-lakes",
    difficulty: "Medium",
    pattern: "Storage",
    category: "system-design",
    tags: ["sd-storage", "system-design", "data-lake", "parquet", "Storage"],
    xpReward: 100,
    description: `Understand Data Lake architectures (Delta Lake, Apache Iceberg, Apache Hudi). Learn how storing raw structured, semi-structured, and unstructured data in open formats (Parquet, ORC) powers modern analytics.

### Learning Objectives
- Store raw data in native format at low cost using object storage backbones
- Understand columnar file formats: Apache Parquet (dictionary encoding, run-length encoding, statistics metadata)
- Implement schema evolution and ACID table formats over object stores (Iceberg, Delta)
- Prevent the Data Swamp phenomenon through metadata catalogs and data governance
- Query data lakes directly using distributed SQL query engines like Trino and Presto

### Practical Challenge
Calculate storage reduction percentage achieved by Parquet columnar compression over raw JSON size.`,
    starterCode: {
      javascript: `function calculateParquetCompressionSavings(rawBytes, parquetBytes) {
  const saved = rawBytes - parquetBytes;
  return Math.round((saved / rawBytes) * 100);
}`,
      python: `def calculate_parquet_compression_savings(raw_bytes, parquet_bytes):
    saved = raw_bytes - parquet_bytes
    return round((saved / raw_bytes) * 100)`
    },
    testCases: [
      { input: `10000, 1500`, expectedOutput: `85`, isHidden: false },
      { input: `5000, 1000`, expectedOutput: `80`, isHidden: false }
    ],
    hints: ["Compute (rawBytes - parquetBytes) / rawBytes * 100 and round to integer."]
  }
];
