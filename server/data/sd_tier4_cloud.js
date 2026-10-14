/**
 * TIER 4 — CLOUD ARCHITECTURE (40 Topics)
 * Difficulty: Medium – Hard
 * Patterns: Cloud Architecture, High Availability, Multi-Region, Security, Networking, Observability, Disaster Recovery, Infrastructure
 */

module.exports = [
  {
    id: "sd-tier4c-001",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Cloud Fundamentals",
    title: "Cloud Fundamentals",
    slug: "cloud-fundamentals",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "cloud", "Cloud Architecture"],
    xpReward: 100,
    description: `Understand the foundational pillars of cloud computing: IaaS, PaaS, SaaS, shared responsibility models, and utility billing economics.

### Learning Objectives
- Differentiate Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS)
- Master the Cloud Shared Responsibility Model: what the cloud provider secures vs what the customer secures
- Transition from capital expenditure (CapEx) hardware purchasing to operational expenditure (OpEx) elastic consumption
- Leverage multi-tenant cloud elasticity to provision resources dynamically on demand
- Architect for failure: assume any cloud instance can terminate without notice

### Practical Challenge
Determine the service model: return "IaaS" for raw VMs, "PaaS" for managed application platforms, "SaaS" for end-user software applications.`,
    starterCode: {
      javascript: `function getCloudServiceTier(offering) {
  const map = { "ec2": "IaaS", "vm": "IaaS", "elastic-beanstalk": "PaaS", "heroku": "PaaS", "gmail": "SaaS", "salesforce": "SaaS" };
  return map[offering.toLowerCase()] || "IaaS";
}`,
      python: `def get_cloud_service_tier(offering):
    mapping = {"ec2": "IaaS", "vm": "IaaS", "elastic-beanstalk": "PaaS", "heroku": "PaaS", "gmail": "SaaS", "salesforce": "SaaS"}
    return mapping.get(offering.lower(), "IaaS")`
    },
    testCases: [
      { input: `"ec2"`, expectedOutput: `"IaaS"`, isHidden: false },
      { input: `"heroku"`, expectedOutput: `"PaaS"`, isHidden: false },
      { input: `"gmail"`, expectedOutput: `"SaaS"`, isHidden: true }
    ],
    hints: ["Map the cloud service offering to IaaS, PaaS, or SaaS."]
  },
  {
    id: "sd-tier4c-002",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Regions",
    title: "Regions",
    slug: "cloud-regions",
    difficulty: "Medium",
    pattern: "Multi-Region",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "regions", "Multi-Region"],
    xpReward: 100,
    description: `Explore Cloud Regions: separate geographic areas worldwide containing isolated datacenters. Learn how region selection affects user latency, legal compliance, and service availability.

### Learning Objectives
- Understand the physical independence of cloud regions (e.g. us-east-1, eu-central-1, ap-southeast-1)
- Minimize user round-trip latency by deploying workloads in the region closest to primary user demographics
- Adhere to data sovereignty regulations requiring data to be stored and processed within specific national borders
- Balance inter-region networking costs against disaster recovery redundancy requirements
- Choose primary and secondary regions based on cloud provider service availability matrix

### Practical Challenge
Calculate inter-region latency penalty: return Math.round(distanceKm * 0.01) ms.`,
    starterCode: {
      javascript: `function estimateInterRegionLatency(distanceKm) {
  return Math.round(distanceKm * 0.01);
}`,
      python: `def estimate_inter_region_latency(distance_km):
    return round(distance_km * 0.01)`
    },
    testCases: [
      { input: `6000`, expectedOutput: `60`, isHidden: false },
      { input: `10000`, expectedOutput: `100`, isHidden: false }
    ],
    hints: ["Estimate latency based on distance between regions."]
  },
  {
    id: "sd-tier4c-003",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Availability Zones",
    title: "Availability Zones",
    slug: "availability-zones",
    difficulty: "Medium",
    pattern: "High Availability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "az", "High Availability"],
    xpReward: 100,
    description: `Understand Availability Zones (AZs): isolated datacenter locations within a single cloud region connected by high-speed, ultra-low-latency private fiber networks (< 1-2ms).

### Learning Objectives
- Understand that an Availability Zone comprises one or more discrete physical data centers with redundant power and networking
- Distribute application replicas across at least 3 AZs for high availability
- Leverage sub-millisecond inter-AZ latency for synchronous database replication
- Protect against local infrastructure disasters (flood, power outage, fire) taking down a single AZ
- Minimize inter-AZ data transfer costs by keeping high-volume chatty service calls within the same AZ when feasible

### Practical Challenge
Calculate minimum instances needed across 3 AZs to ensure at least N active instances if any single AZ goes down: ceil(N / 2) * 3.`,
    starterCode: {
      javascript: `function calculateMultiAZInstances(requiredCapacity) {
  const perAZ = Math.ceil(requiredCapacity / 2);
  return perAZ * 3;
}`,
      python: `import math

def calculate_multi_az_instances(required_capacity):
    per_az = math.ceil(required_capacity / 2.0)
    return per_az * 3`
    },
    testCases: [
      { input: `4`, expectedOutput: `6`, isHidden: false },
      { input: `10`, expectedOutput: `15`, isHidden: false }
    ],
    hints: ["To survive 1 AZ failure out of 3 while maintaining full capacity, remaining 2 AZs must provide 100% capacity."]
  },
  {
    id: "sd-tier4c-004",
    tier: 4,
    section: "Cloud Architecture",
    topic: "VPC / Virtual Networks",
    title: "VPC / Virtual Networks",
    slug: "vpc-virtual-networks",
    difficulty: "Medium",
    pattern: "Networking",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "vpc", "Networking"],
    xpReward: 100,
    description: `Design Virtual Private Clouds (VPC). Isolate your cloud infrastructure within private software-defined networks with customized IP address spaces, route tables, and network gateways.

### Learning Objectives
- Allocate CIDR blocks (e.g. \`10.0.0.0/16\` providing 65,536 private IP addresses)
- Segment network traffic into isolated security boundaries
- Connect multiple VPCs securely using VPC Peering or Transit Gateways
- Route external internet traffic using Internet Gateways (IGW)
- Connect on-premise data centers to cloud VPCs via Direct Connect or IPsec VPN tunnels

### Practical Challenge
Calculate total available IPv4 addresses for a CIDR prefix: 2^(32 - prefix) - 5 (cloud providers reserve 5 IPs per subnet).`,
    starterCode: {
      javascript: `function calculateUsableCloudIPs(cidrPrefix) {
  const total = Math.pow(2, 32 - cidrPrefix);
  return Math.max(0, total - 5);
}`,
      python: `def calculate_usable_cloud_ips(cidr_prefix):
    total = 2 ** (32 - cidr_prefix)
    return max(0, total - 5)`
    },
    testCases: [
      { input: `24`, expectedOutput: `251`, isHidden: false },
      { input: `28`, expectedOutput: `11`, isHidden: false },
      { input: `16`, expectedOutput: `65531`, isHidden: true }
    ],
    hints: ["Total IPs is 2^(32 - prefix); cloud providers reserve 5 addresses."]
  },
  {
    id: "sd-tier4c-005",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Subnets",
    title: "Subnets",
    slug: "subnets",
    difficulty: "Medium",
    pattern: "Networking",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "subnets", "Networking"],
    xpReward: 100,
    description: `Architect Subnets within a VPC. Learn how to divide your VPC IP address range across availability zones and functional tiers (presentation, application, data).

### Learning Objectives
- Partition a VPC CIDR block into smaller subnet CIDR ranges across each Availability Zone
- Differentiate public subnets (route table points to Internet Gateway) from private subnets
- Isolate databases in dedicated database subnets with no inbound or outbound internet routing
- Prevent subnet IP exhaustion by planning address allocation for autoscaling pods and lambdas
- Apply Network Access Control Lists (NACLs) as stateless subnet-level firewalls

### Practical Challenge
Determine subnet type: return "PUBLIC" if route table contains default route \`0.0.0.0/0\` pointing to "igw", else "PRIVATE".`,
    starterCode: {
      javascript: `function getSubnetType(defaultRouteTarget) {
  return defaultRouteTarget.toLowerCase().startsWith("igw") ? "PUBLIC" : "PRIVATE";
}`,
      python: `def get_subnet_type(default_route_target):
    return "PUBLIC" if default_route_target.lower().startswith("igw") else "PRIVATE"`
    },
    testCases: [
      { input: `"igw-012345"`, expectedOutput: `"PUBLIC"`, isHidden: false },
      { input: `"nat-987654"`, expectedOutput: `"PRIVATE"`, isHidden: false },
      { input: `"local"`, expectedOutput: `"PRIVATE"`, isHidden: true }
    ],
    hints: ["Subnets whose route table points to an Internet Gateway (igw) are public."]
  },
  {
    id: "sd-tier4c-006",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Public vs Private Networks",
    title: "Public vs Private Networks",
    slug: "public-vs-private-networks",
    difficulty: "Medium",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "security", "nat-gateway", "Security"],
    xpReward: 100,
    description: `Implement secure Multi-Tier Network Architectures. Place public load balancers in public subnets, and isolate application servers and databases in private subnets with NAT gateways.

### Learning Objectives
- Never assign public IPv4 addresses directly to backend application servers or databases
- Allow private instances to reach the internet for security patches via NAT Gateways without accepting inbound connections
- Use Bastion Hosts (Jump Boxes) or AWS Systems Manager Session Manager for secure SSH access
- Block direct internet routing to data storage tiers
- Enforce defense-in-depth with layered Security Groups and NACLs

### Practical Challenge
Check if direct internet access is blocked: return true if instance is in private subnet and has no public IP.`,
    starterCode: {
      javascript: `function isInstanceSecure(isPrivateSubnet, hasPublicIP) {
  return isPrivateSubnet && !hasPublicIP;
}`,
      python: `def is_instance_secure(is_private_subnet, has_public_ip):
    return is_private_subnet and not has_public_ip`
    },
    testCases: [
      { input: `true, false`, expectedOutput: `true`, isHidden: false },
      { input: `false, true`, expectedOutput: `false`, isHidden: false },
      { input: `true, true`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Secure backend instances reside in private subnets with zero public IP addresses."]
  },
  {
    id: "sd-tier4c-007",
    tier: 4,
    section: "Cloud Architecture",
    topic: "DNS",
    title: "DNS",
    slug: "cloud-dns",
    difficulty: "Easy",
    pattern: "Networking",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "dns", "route53", "Networking"],
    xpReward: 50,
    description: `Master Domain Name System (DNS) in cloud architecture (Amazon Route 53, Cloudflare). Learn record types (A, AAAA, CNAME, ALIAS), TTL strategies, and global routing policies.

### Learning Objectives
- Trace DNS resolution: Root DNS -> TLD Nameserver -> Authoritative Nameserver -> Local Resolver Cache
- Explore DNS record types: A (IPv4), AAAA (IPv6), CNAME (canonical name alias), ALIAS/ANAME (zone apex alias)
- Configure intelligent routing policies: Latency-based, Geolocation, Weighted round-robin, and Failover routing
- Use DNS Health Checks to automatically redirect traffic away from degraded cloud regions
- Understand DNS propagation delays and manage TTL (Time to Live) values before production cutovers

### Practical Challenge
Select DNS record type: return "A" for IPv4 address, "AAAA" for IPv6 address, "CNAME" for domain alias.`,
    starterCode: {
      javascript: `function selectDNSRecordType(valueType) {
  const map = { "ipv4": "A", "ipv6": "AAAA", "domain": "CNAME" };
  return map[valueType.toLowerCase()] || "A";
}`,
      python: `def select_dns_record_type(value_type):
    mapping = {"ipv4": "A", "ipv6": "AAAA", "domain": "CNAME"}
    return mapping.get(value_type.lower(), "A")`
    },
    testCases: [
      { input: `"ipv4"`, expectedOutput: `"A"`, isHidden: false },
      { input: `"ipv6"`, expectedOutput: `"AAAA"`, isHidden: false },
      { input: `"domain"`, expectedOutput: `"CNAME"`, isHidden: false }
    ],
    hints: ["Map target value type to the corresponding standard DNS record."]
  },
  {
    id: "sd-tier4c-008",
    tier: 4,
    section: "Cloud Architecture",
    topic: "CDN",
    title: "CDN",
    slug: "cloud-cdn",
    difficulty: "Medium",
    pattern: "Networking",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "cdn", "cloudfront", "Networking"],
    xpReward: 100,
    description: `Architect Content Delivery Networks (CloudFront, Cloudflare, Fastly). Learn how Points of Presence (PoPs) cache static and dynamic assets at the edge, reducing origin server load by 90%+.

### Learning Objectives
- Cache static assets (images, videos, JS, CSS) at hundreds of Edge PoPs worldwide
- Terminate TLS handshakes physically close to end users to reduce initial connection establishment latency
- Use Anycast BGP routing to automatically steer user requests to the nearest edge location
- Configure Cache-Control headers, stale-while-revalidate, and edge origin request shielding
- Execute instantaneous edge cache purges using cache tags / surrogate keys

### Practical Challenge
Calculate origin server offload percentage given total edge requests and cache hit count.`,
    starterCode: {
      javascript: `function calculateCDNOffload(totalRequests, cacheHits) {
  if (totalRequests === 0) return 0;
  return Math.round((cacheHits / totalRequests) * 100);
}`,
      python: `def calculate_cdn_offload(total_requests, cache_hits):
    if total_requests == 0:
        return 0
    return round((cache_hits / total_requests) * 100)`
    },
    testCases: [
      { input: `1000000, 920000`, expectedOutput: `92`, isHidden: false },
      { input: `500000, 450000`, expectedOutput: `90`, isHidden: false }
    ],
    hints: ["Divide cacheHits by totalRequests and multiply by 100."]
  },
  {
    id: "sd-tier4c-009",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Load Balancers",
    title: "Cloud Load Balancers",
    slug: "cloud-load-balancers",
    difficulty: "Medium",
    pattern: "Load Balancing",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "alb", "nlb", "Load Balancing"],
    xpReward: 100,
    description: `Master Cloud Managed Load Balancers: Application Load Balancers (ALB - Layer 7) and Network Load Balancers (NLB - Layer 4). Understand throughput, SSL termination, and target groups.

### Learning Objectives
- Choose between ALB (HTTP/HTTPS, path/header routing, WebSockets) and NLB (ultra-high throughput, static IPs, extreme low latency)
- Configure target groups and health checks across EC2 instances, ECS containers, and Lambda functions
- Implement cross-zone load balancing to distribute traffic uniformly across all instances regardless of AZ
- Secure endpoints by attaching AWS WAF (Web Application Firewall) directly to the ALB
- Handle sudden traffic spikes using ALB pre-warming when expected traffic surges rapidly

### Practical Challenge
Select load balancer type: return "NLB" for ultra-high throughput / static IP needs; return "ALB" for HTTP path-based routing.`,
    starterCode: {
      javascript: `function selectCloudLB(requireStaticIP, requirePathRouting) {
  return (requireStaticIP && !requirePathRouting) ? "NLB" : "ALB";
}`,
      python: `def select_cloud_lb(require_static_ip, require_path_routing):
    return "NLB" if (require_static_ip and not require_path_routing) else "ALB"`
    },
    testCases: [
      { input: `true, false`, expectedOutput: `"NLB"`, isHidden: false },
      { input: `false, true`, expectedOutput: `"ALB"`, isHidden: false },
      { input: `true, true`, expectedOutput: `"ALB"`, isHidden: true }
    ],
    hints: ["Layer 4 NLB provides static IPs; Layer 7 ALB provides HTTP path routing."]
  },
  {
    id: "sd-tier4c-010",
    tier: 4,
    section: "Cloud Architecture",
    topic: "API Gateways",
    title: "Cloud API Gateways",
    slug: "cloud-api-gateways",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "api-gateway", "Cloud Architecture"],
    xpReward: 100,
    description: `Deploy Managed API Gateways (AWS API Gateway, Apigee, Kong). Manage API keys, rate throttling, authorization hooks, request transformation, and mock responses at the cloud edge.

### Learning Objectives
- Protect downstream compute from traffic surges using edge token-bucket throttling
- Enforce API key plans and usage quotas (e.g. 10,000 requests per month per client)
- Authorize requests via Lambda Authorizers / JWT validation before invoking backend microservices
- Validate request JSON schemas directly at the gateway to reject malformed payloads without compute cost
- Create Canary Deployments and manage stage variables (dev, staging, prod) seamlessly

### Practical Challenge
Check if request is within quota: return true if currentUsage < monthlyQuota, else false.`,
    starterCode: {
      javascript: `function isWithinUsageQuota(currentUsage, monthlyQuota) {
  return currentUsage < monthlyQuota;
}`,
      python: `def is_within_usage_quota(current_usage, monthly_quota):
    return current_usage < monthly_quota`
    },
    testCases: [
      { input: `950, 1000`, expectedOutput: `true`, isHidden: false },
      { input: `1000, 1000`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if currentUsage is strictly less than monthlyQuota."]
  },
  {
    id: "sd-tier4c-011",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Compute Services",
    title: "Compute Services",
    slug: "cloud-compute-services",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "ec2", "compute", "Cloud Architecture"],
    xpReward: 100,
    description: `Navigate Cloud Compute options: Virtual Machines (EC2), Containers (ECS/EKS), and Serverless (Lambda). Learn how cost models, startup times, and control levels guide architecture decisions.

### Learning Objectives
- Compare Compute models: Full control (VMs) vs Container abstraction (Kubernetes) vs Event-driven (Serverless)
- Evaluate instance families: General Purpose (M), Compute Optimized (C), Memory Optimized (R), Storage Optimized (I)
- Leverage Spot Instances (up to 90% discount) for fault-tolerant batch workloads
- Purchase Reserved Instances / Savings Plans to reduce steady-state baseline compute costs
- Configure Instance Metadata Service v2 (IMDSv2) to prevent SSRF credential theft

### Practical Challenge
Calculate monthly savings using Spot instances given onDemandRate and spotRate per hour: Math.round((onDemandRate - spotRate) * 730).`,
    starterCode: {
      javascript: `function calculateSpotSavings(onDemandRate, spotRate) {
  return Math.round((onDemandRate - spotRate) * 730);
}`,
      python: `def calculate_spot_savings(on_demand_rate, spot_rate):
    return round((on_demand_rate - spot_rate) * 730)`
    },
    testCases: [
      { input: `0.50, 0.15`, expectedOutput: `256`, isHidden: false },
      { input: `1.00, 0.30`, expectedOutput: `511`, isHidden: false }
    ],
    hints: ["Multiply the hourly rate difference by 730 hours in an average month."]
  },
  {
    id: "sd-tier4c-012",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Managed Databases",
    title: "Managed Databases",
    slug: "managed-databases",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "rds", "aurora", "Cloud Architecture"],
    xpReward: 100,
    description: `Leverage Managed Cloud Databases (Amazon RDS, Aurora, Cloud Spanner). Understand automated backups, Multi-AZ synchronous replication, read replica auto-scaling, and storage autoscaling.

### Learning Objectives
- Offload operational burdens: OS patching, continuous backups, point-in-time recovery, failover automation
- Understand AWS Aurora architecture: decoupled compute and distributed storage layer replicated 6 ways across 3 AZs
- Achieve sub-second read-replica lag using shared distributed storage clusters
- Scale database storage automatically without downtime or manual volume resizing
- Implement zero-downtime database minor engine version updates

### Practical Challenge
Calculate storage copies: in AWS Aurora, storage is replicated 6 ways across 3 AZs. Return originalGB * 6.`,
    starterCode: {
      javascript: `function calculateAuroraReplicatedStorage(originalGB) {
  return originalGB * 6;
}`,
      python: `def calculate_aurora_replicated_storage(original_gb):
    return original_gb * 6`
    },
    testCases: [
      { input: `100`, expectedOutput: `600`, isHidden: false },
      { input: `50`, expectedOutput: `300`, isHidden: false }
    ],
    hints: ["Aurora maintains 6 copies of data across 3 availability zones."]
  },
  {
    id: "sd-tier4c-013",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Object Storage",
    title: "Cloud Object Storage",
    slug: "cloud-object-storage",
    difficulty: "Easy",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "s3", "storage", "Cloud Architecture"],
    xpReward: 50,
    description: `Deepen your cloud storage strategy with Amazon S3 tiers (Standard, Intelligent-Tiering, Glacier). Learn lifecycle policies to dramatically reduce long-term cold data storage costs.

### Learning Objectives
- Compare storage classes: S3 Standard (frequent access), S3 Infrequent Access (IA), S3 Glacier, Glacier Deep Archive
- Automate lifecycle policies: Transition objects to IA after 30 days, Glacier after 90 days, expire after 365 days
- Use S3 Intelligent-Tiering to automatically move objects between access tiers without operational overhead
- Enable S3 Object Lock and MFA Delete to protect backups from ransomware deletion
- Replicate buckets asynchronously across geographic regions for disaster recovery

### Practical Challenge
Calculate monthly cost given GB and ratePerGB: round to 2 decimal places.`,
    starterCode: {
      javascript: `function calculateS3MonthlyCost(totalGB, ratePerGB) {
  return Math.round(totalGB * ratePerGB * 100) / 100;
}`,
      python: `def calculate_s3_monthly_cost(total_gb, rate_per_gb):
    return round(total_gb * rate_per_gb, 2)`
    },
    testCases: [
      { input: `1000, 0.023`, expectedOutput: `23`, isHidden: false },
      { input: `5000, 0.004`, expectedOutput: `20`, isHidden: false }
    ],
    hints: ["Multiply totalGB by ratePerGB and round to 2 decimals."]
  },
  {
    id: "sd-tier4c-014",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Managed Caches",
    title: "Managed Caches",
    slug: "managed-caches",
    difficulty: "Easy",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "elasticache", "redis", "Cloud Architecture"],
    xpReward: 50,
    description: `Deploy Cloud Managed In-Memory Caches (Amazon ElastiCache, Memorystore). Learn auto-failover, multi-AZ replication, cluster mode enabled (sharding), and cross-region replication.

### Learning Objectives
- Offload cache cluster maintenance, backup snapshotting, and engine patching
- Enable Multi-AZ with Auto-Failover: primary failure triggers replica promotion in < 30 seconds
- Scale horizontally with Cluster Mode: partition keys across up to 500 shards using consistent hash slots
- Protect cache clusters within private VPC subnets with Redis AUTH tokens and transit encryption
- Monitor cache metrics: CPU utilization, cache hit ratio, memory fragmentation, and swap usage

### Practical Challenge
Determine if auto-failover is enabled: return true if multiAZ is true and replicaCount >= 1.`,
    starterCode: {
      javascript: `function isCacheAutoFailoverEnabled(multiAZ, replicaCount) {
  return multiAZ && replicaCount >= 1;
}`,
      python: `def is_cache_auto_failover_enabled(multi_az, replica_count):
    return multi_az and replica_count >= 1`
    },
    testCases: [
      { input: `true, 2`, expectedOutput: `true`, isHidden: false },
      { input: `true, 0`, expectedOutput: `false`, isHidden: false },
      { input: `false, 2`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Auto-failover requires Multi-AZ configuration and at least 1 read replica."]
  },
  {
    id: "sd-tier4c-015",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Message Queues",
    title: "Cloud Message Queues",
    slug: "cloud-message-queues",
    difficulty: "Easy",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "sqs", "queues", "Cloud Architecture"],
    xpReward: 50,
    description: `Leverage Managed Queue Services (Amazon SQS, Google Cloud Pub/Sub). Compare Standard queues (unlimited throughput, at-least-once, best-effort ordering) with FIFO queues (strict ordering, exactly-once).

### Learning Objectives
- Standard Queues: Nearly unlimited throughput with best-effort message ordering and at-least-once delivery
- FIFO Queues: Strict First-In-First-Out ordering with message deduplication IDs (capped at 3,000 msgs/sec with batching)
- Configure Visibility Timeout to give workers adequate time to process messages before re-delivery
- Set up Dead-Letter Queues (DLQ) to isolate poisonous malformed messages automatically
- Trigger auto-scaling of worker instances based on SQS Queue Length (\`ApproximateNumberOfMessagesVisible\`)

### Practical Challenge
Select queue type: return "FIFO" if strict order and zero duplicates are required, else "STANDARD".`,
    starterCode: {
      javascript: `function selectQueueType(requireStrictOrder, requireExactlyOnce) {
  return (requireStrictOrder || requireExactlyOnce) ? "FIFO" : "STANDARD";
}`,
      python: `def select_queue_type(require_strict_order, require_exactly_once):
    return "FIFO" if (require_strict_order or require_exactly_once) else "STANDARD"`
    },
    testCases: [
      { input: `true, true`, expectedOutput: `"FIFO"`, isHidden: false },
      { input: `false, false`, expectedOutput: `"STANDARD"`, isHidden: false }
    ],
    hints: ["FIFO queues guarantee strict message ordering and deduplication."]
  },
  {
    id: "sd-tier4c-016",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Event Streaming",
    title: "Cloud Event Streaming",
    slug: "cloud-event-streaming",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "kinesis", "kafka", "msk", "Cloud Architecture"],
    xpReward: 100,
    description: `Deploy Cloud Managed Event Streaming services (Amazon Kinesis, AWS MSK, Confluent Cloud). Stream high-volume real-time events, logs, and telemetry into data lakes and real-time dashboards.

### Learning Objectives
- Ingest real-time streaming data at scale using Amazon Kinesis Data Streams or Managed Streaming for Kafka (MSK)
- Partition streams using Shards: each Kinesis shard provides 1MB/s write and 2MB/s read throughput
- Process streams in real time using Lambda event-source mappings or Flink stream processing
- Fan out streams to multiple independent applications without consumer interference
- Load stream data into S3, Redshift, and OpenSearch automatically using Kinesis Data Firehose

### Practical Challenge
Calculate Kinesis shards needed given total write data in MB/s (1 shard = 1 MB/s write capacity). Round up.`,
    starterCode: {
      javascript: `function calculateKinesisShardsNeeded(writeThroughputMBps) {
  return Math.ceil(writeThroughputMBps / 1.0);
}`,
      python: `import math

def calculate_kinesis_shards_needed(write_throughput_mbps):
    return math.ceil(write_throughput_mbps / 1.0)`
    },
    testCases: [
      { input: `15.5`, expectedOutput: `16`, isHidden: false },
      { input: `5`, expectedOutput: `5`, isHidden: false }
    ],
    hints: ["Each Kinesis shard supports 1MB/sec write throughput. Divide and take ceiling."]
  },
  {
    id: "sd-tier4c-017",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Container Platforms",
    title: "Container Platforms",
    slug: "cloud-container-platforms",
    difficulty: "Medium",
    pattern: "Infrastructure",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "ecs", "fargate", "Infrastructure"],
    xpReward: 100,
    description: `Explore Managed Container Platforms (AWS ECS, Google Cloud Run). Compare running containers on self-managed EC2 instances with serverless container execution via AWS Fargate.

### Learning Objectives
- Deploy microservice containers without managing underlying VM operating systems using AWS Fargate
- Define Task Definitions specifying container images, CPU/RAM allocations, and IAM roles
- Integrate container tasks with Application Load Balancers and CloudWatch logging
- Secure container execution using read-only root filesystems and non-root user execution
- Scale container tasks automatically in response to CPU, memory, and custom queue metrics

### Practical Challenge
Calculate monthly Fargate cost given taskCount, hoursPerDay (30 days/mo), and costPerHour.`,
    starterCode: {
      javascript: `function calculateFargateCost(taskCount, hoursPerDay, costPerHour) {
  const totalHours = taskCount * hoursPerDay * 30;
  return Math.round(totalHours * costPerHour * 100) / 100;
}`,
      python: `def calculate_fargate_cost(task_count, hours_per_day, cost_per_hour):
    total_hours = task_count * hours_per_day * 30
    return round(total_hours * cost_per_hour, 2)`
    },
    testCases: [
      { input: `4, 24, 0.05`, expectedOutput: `144`, isHidden: false },
      { input: `2, 12, 0.10`, expectedOutput: `72`, isHidden: false }
    ],
    hints: ["Multiply taskCount * hoursPerDay * 30 * costPerHour."]
  },
  {
    id: "sd-tier4c-018",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Kubernetes",
    title: "Managed Kubernetes",
    slug: "managed-kubernetes",
    difficulty: "Hard",
    pattern: "Infrastructure",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "eks", "gke", "k8s", "Infrastructure"],
    xpReward: 200,
    description: `Architect enterprise Managed Kubernetes (Amazon EKS, Google GKE, Azure AKS). Learn control plane management, node group provisioning, VPC CNI networking, and cluster autoscaling.

### Learning Objectives
- Offload Kubernetes control plane (etcd, API server) reliability and automatic updates to cloud provider
- Integrate Pod networking natively with VPC IP addresses using AWS VPC CNI
- Provision mixed node groups: on-demand instances for core services, spot instances for batch jobs
- Scale worker nodes dynamically using Karpenter or Cluster Autoscaler
- Enforce cluster security using RBAC, AWS IAM Roles for Service Accounts (IRSA), and network policies

### Practical Challenge
Check if a pod can assume an AWS IAM role: return true if service account has IRSA annotation.`,
    starterCode: {
      javascript: `function canPodAssumeIRSA(annotations) {
  return Object.prototype.hasOwnProperty.call(annotations, "eks.amazonaws.com/role-arn");
}`,
      python: `def can_pod_assume_irsa(annotations):
    return "eks.amazonaws.com/role-arn" in annotations`
    },
    testCases: [
      { input: `{"eks.amazonaws.com/role-arn": "arn:aws:iam::123:role/s3-reader"}`, expectedOutput: `true`, isHidden: false },
      { input: `{"app": "frontend"}`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["IRSA allows pods to assume IAM roles via service account annotations."]
  },
  {
    id: "sd-tier4c-019",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Serverless",
    title: "Cloud Serverless Architecture",
    slug: "cloud-serverless-architecture",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "serverless", "lambda", "eventbridge", "Cloud Architecture"],
    xpReward: 100,
    description: `Design end-to-end Event-Driven Serverless architectures using AWS Lambda, EventBridge, DynamoDB, and Step Functions for zero-server operational management.

### Learning Objectives
- Build decoupled event meshes using Amazon EventBridge routing events between cloud services
- Orchestrate multi-step complex business workflows with state management using AWS Step Functions
- Eliminate database connection exhaustion using Amazon RDS Proxy
- Reduce cold start latency using Provisioned Concurrency and optimized binary compilation (Rust/Go)
- Architect asynchronous event-driven fanout pipelines with Dead Letter Queues (DLQ)

### Practical Challenge
Calculate execution cost in dollars given invocations, duration in ms, and costPerMillionInvocations ($0.20) + durationCost.`,
    starterCode: {
      javascript: `function calculateServerlessInvocationsCost(invocations) {
  const cost = (invocations / 1e6) * 0.20;
  return Math.round(cost * 100) / 100;
}`,
      python: `def calculate_serverless_invocations_cost(invocations):
    cost = (invocations / 1e6) * 0.20
    return round(cost, 2)`
    },
    testCases: [
      { input: `50000000`, expectedOutput: `10`, isHidden: false },
      { input: `10000000`, expectedOutput: `2`, isHidden: false }
    ],
    hints: ["Divide invocations by 1,000,000 and multiply by $0.20."]
  },
  {
    id: "sd-tier4c-020",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Autoscaling",
    title: "Cloud Autoscaling",
    slug: "cloud-autoscaling",
    difficulty: "Medium",
    pattern: "High Availability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "autoscaling", "ec2", "High Availability"],
    xpReward: 100,
    description: `Configure Cloud Auto Scaling Groups (ASG). Master target tracking policies, step scaling, warm pools, cooldown periods, and instance refresh rollouts.

### Learning Objectives
- Target Tracking Scaling: Automatically adjust capacity to maintain a metric (e.g. keep average CPU at 60%)
- Step Scaling: Scale aggressively by adding 5 instances if CPU > 80%, 10 instances if CPU > 90%
- Scheduled Scaling: Pre-scale capacity ahead of predictable business traffic surges (e.g. Black Friday 8 AM)
- Use Warm Pools: Pre-initialize instances in stopped state to reduce scale-out boot time from 5 minutes to 30 seconds
- Roll out updated AMIs automatically across an ASG using Instance Refresh with zero downtime

### Practical Challenge
Calculate instances to add in step scaling: return 5 if cpu >= 90; 2 if cpu >= 75; else 0.`,
    starterCode: {
      javascript: `function getStepScalingInstances(cpuPercent) {
  if (cpuPercent >= 90) return 5;
  if (cpuPercent >= 75) return 2;
  return 0;
}`,
      python: `def get_step_scaling_instances(cpu_percent):
    if cpu_percent >= 90:
        return 5
    if cpu_percent >= 75:
        return 2
    return 0`
    },
    testCases: [
      { input: `92`, expectedOutput: `5`, isHidden: false },
      { input: `80`, expectedOutput: `2`, isHidden: false },
      { input: `60`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Step scaling adds capacity in increments based on metric severity."]
  },
  {
    id: "sd-tier4c-021",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Infrastructure as Code",
    title: "Infrastructure as Code",
    slug: "infrastructure-as-code",
    difficulty: "Medium",
    pattern: "Infrastructure",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "iac", "terraform", "Infrastructure"],
    xpReward: 100,
    description: `Master Infrastructure as Code (IaC) with Terraform, OpenTofu, and AWS CloudFormation. Define, version, test, and automate cloud infrastructure using declarative code.

### Learning Objectives
- Define infrastructure declaratively: specify the desired end state, and let the engine compute execution diffs
- Manage remote state files securely (S3 + DynamoDB state locking to prevent concurrent mutations)
- Modularize cloud architectures into reusable, versioned modules (VPC, EKS, RDS modules)
- Prevent configuration drift and execute automated \`terraform plan\` reviews in CI/CD pull requests
- Destroy and recreate identical environments (staging, ephemeral testing) on demand

### Practical Challenge
Determine execution action: return "NO_OP" if desired state equals current state, else "APPLY_CHANGES".`,
    starterCode: {
      javascript: `function evaluateIaCDiff(desiredState, currentState) {
  return JSON.stringify(desiredState) === JSON.stringify(currentState) ? "NO_OP" : "APPLY_CHANGES";
}`,
      python: `def evaluate_iac_diff(desired_state, current_state):
    return "NO_OP" if desired_state == current_state else "APPLY_CHANGES"`
    },
    testCases: [
      { input: `{"nodes": 5}, {"nodes": 5}`, expectedOutput: `"NO_OP"`, isHidden: false },
      { input: `{"nodes": 5}, {"nodes": 3}`, expectedOutput: `"APPLY_CHANGES"`, isHidden: false }
    ],
    hints: ["If desired matches current, no changes are needed (NO_OP)."]
  },
  {
    id: "sd-tier4c-022",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Secrets Management",
    title: "Secrets Management",
    slug: "secrets-management",
    difficulty: "Medium",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "secrets", "vault", "Security"],
    xpReward: 100,
    description: `Secure credentials with Cloud Secrets Management (AWS Secrets Manager, HashiCorp Vault). Never hardcode API keys, database credentials, or private certificates in code.

### Learning Objectives
- Centralize credentials, API tokens, and encryption keys in hardware security module (HSM) backed vaults
- Implement automated secret rotation (e.g. rotate database passwords every 30 days without downtime)
- Grant applications fine-grained IAM access to secrets via runtime dynamic injection
- Audit all secret access events in CloudTrail to detect unauthorized access attempts
- Cache decrypted secrets in application memory with TTL to reduce secret manager API costs

### Practical Challenge
Check if a secret needs rotation: return true if daysSinceRotation >= maxAllowedDays.`,
    starterCode: {
      javascript: `function needsSecretRotation(daysSinceRotation, maxAllowedDays) {
  return daysSinceRotation >= maxAllowedDays;
}`,
      python: `def needs_secret_rotation(days_since_rotation, max_allowed_days):
    return days_since_rotation >= max_allowed_days`
    },
    testCases: [
      { input: `35, 30`, expectedOutput: `true`, isHidden: false },
      { input: `15, 30`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Rotate secret if elapsed days reaches or exceeds maximum allowed threshold."]
  },
  {
    id: "sd-tier4c-023",
    tier: 4,
    section: "Cloud Architecture",
    topic: "IAM",
    title: "IAM",
    slug: "cloud-iam",
    difficulty: "Medium",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "iam", "least-privilege", "Security"],
    xpReward: 100,
    description: `Master Identity and Access Management (IAM). Enforce the Principle of Least Privilege, role-based access, temporary STS credentials, and service control policies (SCPs).

### Learning Objectives
- Enforce the Principle of Least Privilege: grant only the minimum permissions required for a specific task
- Differentiate IAM Users, Groups, Roles, and Policies
- Use IAM Roles with AWS Security Token Service (STS) for temporary, auto-expiring credentials
- Never issue long-lived static API access keys to human developers or compute workloads
- Establish guardrails across multi-account AWS Organizations using Service Control Policies (SCPs)

### Practical Challenge
Evaluate IAM policy: return "ALLOW" if explicit allow and no explicit deny; return "DENY" if explicit deny exists.`,
    starterCode: {
      javascript: `function evaluateIAMPolicy(hasExplicitAllow, hasExplicitDeny) {
  if (hasExplicitDeny) return "DENY";
  if (hasExplicitAllow) return "ALLOW";
  return "DENY"; // Default deny
}`,
      python: `def evaluate_iam_policy(has_explicit_allow, has_explicit_deny):
    if has_explicit_deny:
        return "DENY"
    if has_explicit_allow:
        return "ALLOW"
    return "DENY"`
    },
    testCases: [
      { input: `true, false`, expectedOutput: `"ALLOW"`, isHidden: false },
      { input: `true, true`, expectedOutput: `"DENY"`, isHidden: false },
      { input: `false, false`, expectedOutput: `"DENY"`, isHidden: true }
    ],
    hints: ["In IAM, an explicit deny always overrides any allow, and default is deny."]
  },
  {
    id: "sd-tier4c-024",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Encryption",
    title: "Encryption",
    slug: "cloud-encryption",
    difficulty: "Medium",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "encryption", "kms", "Security"],
    xpReward: 100,
    description: `Master Encryption at Rest and Encryption in Transit. Learn envelope encryption, Key Management Services (AWS KMS), hardware security modules (HSMs), and symmetric vs asymmetric ciphers.

### Learning Objectives
- Enforce Encryption in Transit across all communication links using TLS 1.3
- Enforce Encryption at Rest for all databases, EBS volumes, S3 buckets, and backup snapshots
- Understand Envelope Encryption: encrypt data with a fast symmetric Data Encryption Key (DEK), encrypt DEK with KMS Key Encryption Key (KEK)
- Differentiate Customer Managed Keys (CMK) from AWS Managed Keys
- Manage cryptographic key rotation without re-encrypting historical data payloads

### Practical Challenge
Check if bucket enforces encryption: return true if s3Config has serverSideEncryptionRule.`,
    starterCode: {
      javascript: `function isS3EncryptionEnforced(s3Config) {
  return Boolean(s3Config && s3Config.serverSideEncryption);
}`,
      python: `def is_s3_encryption_enforced(s3_config):
    return bool(s3_config and s3_config.get("serverSideEncryption"))`
    },
    testCases: [
      { input: `{"serverSideEncryption": "aws:kms"}`, expectedOutput: `true`, isHidden: false },
      { input: `{}`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if serverSideEncryption property is present and truthy."]
  },
  {
    id: "sd-tier4c-025",
    tier: 4,
    section: "Cloud Architecture",
    topic: "TLS",
    title: "TLS",
    slug: "cloud-tls",
    difficulty: "Easy",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "tls", "ssl", "Security"],
    xpReward: 50,
    description: `Understand Transport Layer Security (TLS 1.2 / TLS 1.3). Learn cryptographic handshakes, certificate authorities (ACM, Let's Encrypt), cipher suites, and forward secrecy.

### Learning Objectives
- Understand TLS handshake: asymmetric key exchange (ECDHE) negotiates symmetric session keys (AES-GCM)
- Benefit from TLS 1.3 1-RTT connection handshake (and 0-RTT resumption)
- Automate certificate issuance and annual renewal using AWS Certificate Manager (ACM)
- Enforce Perfect Forward Secrecy (PFS): compromise of private key does not expose past recorded sessions
- Terminate TLS at the load balancer or edge CDN to offload cryptography from application servers

### Practical Challenge
Verify if TLS version is secure: return true for "TLS 1.2" and "TLS 1.3", false for older deprecated versions.`,
    starterCode: {
      javascript: `function isTLSVersionSecure(version) {
  const secure = ["tls 1.2", "tls 1.3"];
  return secure.includes(version.toLowerCase().trim());
}`,
      python: `def is_tls_version_secure(version):
    secure = {"tls 1.2", "tls 1.3"}
    return version.lower().strip() in secure`
    },
    testCases: [
      { input: `"TLS 1.3"`, expectedOutput: `true`, isHidden: false },
      { input: `"TLS 1.0"`, expectedOutput: `false`, isHidden: false },
      { input: `"SSL 3.0"`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Only TLS 1.2 and TLS 1.3 are approved modern secure transport protocols."]
  },
  {
    id: "sd-tier4c-026",
    tier: 4,
    section: "Cloud Architecture",
    topic: "WAF",
    title: "WAF",
    slug: "cloud-waf",
    difficulty: "Medium",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "waf", "Security"],
    xpReward: 100,
    description: `Deploy Web Application Firewalls (AWS WAF, Cloudflare WAF). Filter malicious HTTP/HTTPS traffic at Layer 7 to block SQL injection, Cross-Site Scripting (XSS), and bot scrapers.

### Learning Objectives
- Inspect HTTP request bodies, headers, URIs, and query strings in real time
- Protect against OWASP Top 10 vulnerabilities (SQLi, XSS, Command Injection)
- Block malicious bot scrapers and credential stuffing attacks using managed WAF rule sets
- Configure geographic IP blocking to filter traffic from high-risk embargoed countries
- Attach WAF directly to CloudFront CDNs or Application Load Balancers for perimeter defense

### Practical Challenge
Detect potential SQL injection pattern in query string parameter: return true if string contains "OR 1=1" or "DROP TABLE".`,
    starterCode: {
      javascript: `function detectSQLInjection(queryString) {
  const upper = queryString.toUpperCase();
  return upper.includes("OR 1=1") || upper.includes("DROP TABLE");
}`,
      python: `def detect_sql_injection(query_string):
    upper = query_string.upper()
    return "OR 1=1" in upper or "DROP TABLE" in upper`
    },
    testCases: [
      { input: `"' OR 1=1 --"`, expectedOutput: `true`, isHidden: false },
      { input: `"search=laptop&page=1"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if query contains known SQL injection signatures."]
  },
  {
    id: "sd-tier4c-027",
    tier: 4,
    section: "Cloud Architecture",
    topic: "DDoS Protection",
    title: "DDoS Protection",
    slug: "ddos-protection",
    difficulty: "Medium",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "ddos", "shield", "cloudflare", "Security"],
    xpReward: 100,
    description: `Protect cloud systems from Distributed Denial of Service (DDoS) attacks. Contrast Layer 3/4 network volumetric floods with Layer 7 application resource exhaustion attacks.

### Learning Objectives
- Differentiate Layer 3/4 SYN floods and UDP reflection attacks from Layer 7 HTTP floods
- Absorb massive multi-terabit volumetric attacks using global Anycast edge networks (Cloudflare, AWS Shield)
- Enforce SYN cookies and rate limiting at border routers before traffic enters VPC networks
- Use CDNs to absorb HTTP traffic surges and prevent origin server resource exhaustion
- Implement automatic blackholing / scrubbing centers during catastrophic attack events

### Practical Challenge
Classify DDoS attack layer: return "L7" for HTTP GET flood, "L4" for SYN flood, "L3" for UDP amplification.`,
    starterCode: {
      javascript: `function classifyDDoSAttack(attackType) {
  const map = { "http-flood": "L7", "syn-flood": "L4", "udp-amplification": "L3" };
  return map[attackType.toLowerCase()] || "L7";
}`,
      python: `def classify_ddos_attack(attack_type):
    mapping = {"http-flood": "L7", "syn-flood": "L4", "udp-amplification": "L3"}
    return mapping.get(attack_type.lower(), "L7")`
    },
    testCases: [
      { input: `"http-flood"`, expectedOutput: `"L7"`, isHidden: false },
      { input: `"syn-flood"`, expectedOutput: `"L4"`, isHidden: false },
      { input: `"udp-amplification"`, expectedOutput: `"L3"`, isHidden: true }
    ],
    hints: ["Map attack type to OSI layer."]
  },
  {
    id: "sd-tier4c-028",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Monitoring",
    title: "Cloud Monitoring",
    slug: "cloud-monitoring",
    difficulty: "Easy",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "cloudwatch", "monitoring", "Observability"],
    xpReward: 50,
    description: `Implement Cloud Monitoring (Amazon CloudWatch, Google Cloud Monitoring). Track infrastructure health, alarms, synthetic canaries, and automated operational actions.

### Learning Objectives
- Collect standard hypervisor metrics: CPU utilization, NetworkIn/Out, DiskRead/Write bytes
- Install CloudWatch Agent on guest OS to track memory usage and disk space metrics
- Create Metric Alarms that automatically trigger EC2 reboot, autoscaling, or SNS notifications
- Run Synthetic Canaries (headless browser scripts) to verify critical customer workflows continuously
- Aggregate cross-account dashboards for unified operational visibility

### Practical Challenge
Check if alarm condition breached: return true if metricValue >= threshold.`,
    starterCode: {
      javascript: `function evaluateCloudAlarm(metricValue, threshold) {
  return metricValue >= threshold;
}`,
      python: `def evaluate_cloud_alarm(metric_value, threshold):
    return metric_value >= threshold`
    },
    testCases: [
      { input: `85, 80`, expectedOutput: `true`, isHidden: false },
      { input: `75, 80`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Return true if metricValue >= threshold."]
  },
  {
    id: "sd-tier4c-029",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Logging",
    title: "Cloud Logging",
    slug: "cloud-logging",
    difficulty: "Easy",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "cloudwatch-logs", "logging", "Observability"],
    xpReward: 50,
    description: `Manage Cloud Log Groups (CloudWatch Logs, Google Cloud Logging). Stream application logs, query with CloudWatch Logs Insights, and configure retention expiration policies.

### Learning Objectives
- Stream container and application logs directly to centralized Log Groups
- Query terabytes of log data with SQL-like syntax using CloudWatch Logs Insights
- Create Metric Filters: turn recurring error log patterns into numeric CloudWatch metrics
- Export older logs to Amazon S3 to reduce hot logging storage costs by 80%
- Establish retention policies (e.g. 14 days for dev logs, 90 days for prod logs)

### Practical Challenge
Calculate monthly savings from S3 log export given hotLogCostPerGB ($0.50) and s3CostPerGB ($0.023) for totalGB.`,
    starterCode: {
      javascript: `function calculateLogExportSavings(totalGB) {
  const hotCost = totalGB * 0.50;
  const s3Cost = totalGB * 0.023;
  return Math.round((hotCost - s3Cost) * 100) / 100;
}`,
      python: `def calculate_log_export_savings(total_gb):
    hot_cost = total_gb * 0.50
    s3_cost = total_gb * 0.023
    return round(hot_cost - s3_cost, 2)`
    },
    testCases: [
      { input: `100`, expectedOutput: `47.7`, isHidden: false },
      { input: `500`, expectedOutput: `238.5`, isHidden: false }
    ],
    hints: ["Calculate (0.50 - 0.023) * totalGB."]
  },
  {
    id: "sd-tier4c-030",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Distributed Tracing",
    title: "Cloud Distributed Tracing",
    slug: "cloud-distributed-tracing",
    difficulty: "Medium",
    pattern: "Observability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "xray", "tracing", "Observability"],
    xpReward: 100,
    description: `Implement Cloud Distributed Tracing (AWS X-Ray, Google Cloud Trace). Visualize service maps, identify downstream call bottlenecks, and analyze error impact across microservices.

### Learning Objectives
- Trace requests across API Gateways, Lambda functions, ECS containers, and DynamoDB tables
- Generate dynamic Service Maps depicting architecture topology and health states
- Pinpoint high-latency downstream dependencies in the distributed call graph
- Apply sampling rules: record 100% of errors and 5% of healthy requests to balance cost and visibility
- Trace database queries and subsegments to identify slow SQL queries

### Practical Challenge
Determine if request trace should be sampled based on error status and sample rate.`,
    starterCode: {
      javascript: `function shouldSampleTrace(isError, sampleRatePercent, randomVal) {
  if (isError) return true; // Always sample errors
  return randomVal < sampleRatePercent;
}`,
      python: `def should_sample_trace(is_error, sample_rate_percent, random_val):
    if is_error:
        return True
    return random_val < sample_rate_percent`
    },
    testCases: [
      { input: `true, 5, 50`, expectedOutput: `true`, isHidden: false },
      { input: `false, 5, 2`, expectedOutput: `true`, isHidden: false },
      { input: `false, 5, 10`, expectedOutput: `false`, isHidden: true }
    ],
    hints: ["Always sample errors; otherwise sample if randomVal < sampleRatePercent."]
  },
  {
    id: "sd-tier4c-031",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Disaster Recovery",
    title: "Cloud Disaster Recovery",
    slug: "cloud-disaster-recovery",
    difficulty: "Hard",
    pattern: "Disaster Recovery",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "dr", "rto", "rpo", "Disaster Recovery"],
    xpReward: 200,
    description: `Implement Cloud Disaster Recovery architectures: Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active. Balance cost against business recovery objectives.

### Learning Objectives
- Map business Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) to cloud tiers
- Pilot Light: Continuous asynchronous database replication to secondary region; compute spun up during disaster
- Warm Standby: Minimum scaled-down compute cluster running 24/7 in secondary region, scaled up on failover
- Automated Failover via Route 53 health check DNS routing
- Test DR plans regularly using simulated regional failure runbooks

### Practical Challenge
Calculate RTO difference in hours between Backup & Restore (24h) and Pilot Light (1h): return 23.`,
    starterCode: {
      javascript: `function calculateRTOSavingsHours(backupRestoreRTO, pilotLightRTO) {
  return backupRestoreRTO - pilotLightRTO;
}`,
      python: `def calculate_rto_savings_hours(backup_restore_rto, pilot_light_rto):
    return backup_restore_rto - pilot_light_rto`
    },
    testCases: [
      { input: `24, 1`, expectedOutput: `23`, isHidden: false },
      { input: `12, 2`, expectedOutput: `10`, isHidden: false }
    ],
    hints: ["Subtract pilotLightRTO from backupRestoreRTO."]
  },
  {
    id: "sd-tier4c-032",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Backup Strategies",
    title: "Backup Strategies",
    slug: "backup-strategies",
    difficulty: "Easy",
    pattern: "Disaster Recovery",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "backups", "snapshots", "Disaster Recovery"],
    xpReward: 50,
    description: `Master Cloud Backup Strategies (AWS Backup). Learn point-in-time recovery, continuous transaction log archiving, cross-region snapshot copying, and automated restore testing.

### Learning Objectives
- Point-In-Time Recovery (PITR): Restore databases to any specific second within the retention window
- Automate EBS and RDS snapshot schedules using AWS Backup centralized policies
- Replicate backup snapshots across separate cloud accounts and regions for ransomware isolation
- Test backup integrity: run automated daily restore drills to verify backups are functional
- Archive older backups to cold object storage (S3 Glacier Deep Archive) for regulatory compliance

### Practical Challenge
Verify if restore timestamp is within point-in-time recovery window: return true if targetTime >= earliestRestorableTime and targetTime <= latestRestorableTime.`,
    starterCode: {
      javascript: `function isWithinPITRWindow(targetTime, earliestRestorableTime, latestRestorableTime) {
  return targetTime >= earliestRestorableTime && targetTime <= latestRestorableTime;
}`,
      python: `def is_within_pitr_window(target_time, earliest_restorable_time, latest_restorable_time):
    return earliest_restorable_time <= target_time <= latest_restorable_time`
    },
    testCases: [
      { input: `150, 100, 200`, expectedOutput: `true`, isHidden: false },
      { input: `50, 100, 200`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if targetTime lies within the earliest and latest restorable boundaries."]
  },
  {
    id: "sd-tier4c-033",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Multi-AZ Architecture",
    title: "Multi-AZ Architecture",
    slug: "multi-az-architecture",
    difficulty: "Medium",
    pattern: "High Availability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "multi-az", "ha", "High Availability"],
    xpReward: 100,
    description: `Build High-Availability Multi-AZ architectures. Distribute load balancers, container tasks, and databases across 3 availability zones within a region to achieve 99.99% uptime.

### Learning Objectives
- Distribute all compute tiers across at least 3 distinct Availability Zones
- Deploy Multi-AZ relational databases with synchronous standby replica in secondary AZ
- Automate failover without IP changes via DNS endpoint pointer shifting
- Eliminate single points of failure at every layer of the infrastructure stack
- Leverage low-latency inter-AZ fiber (< 1-2ms) for synchronous replication

### Practical Challenge
Calculate total AZs required to tolerate 1 AZ failure while maintaining 100% capacity with 50% capacity per AZ: return 3.`,
    starterCode: {
      javascript: `function calculateAZRedundancy(capacityPerAZPercent) {
  return Math.ceil(100 / capacityPerAZPercent) + 1;
}`,
      python: `import math

def calculate_az_redundancy(capacity_per_az_percent):
    return math.ceil(100.0 / capacity_per_az_percent) + 1`
    },
    testCases: [
      { input: `50`, expectedOutput: `3`, isHidden: false },
      { input: `100`, expectedOutput: `2`, isHidden: false }
    ],
    hints: ["To tolerate 1 failure, provision N+1 AZs."]
  },
  {
    id: "sd-tier4c-034",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Multi-Region Architecture",
    title: "Cloud Multi-Region Architecture",
    slug: "cloud-multi-region-architecture",
    difficulty: "Hard",
    pattern: "Multi-Region",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "multi-region", "geo", "Multi-Region"],
    xpReward: 200,
    description: `Design planetary Multi-Region Cloud architectures. Learn global server load balancing, cross-region database replication, latency-based routing, and regional disaster recovery.

### Learning Objectives
- Eliminate single-region failure risk (survive complete cloud region outages)
- Reduce global latency by serving requests from the nearest geographic cloud region
- Route traffic dynamically using Route 53 Latency-Based Routing and Geolocation Routing
- Synchronize global data using Amazon Aurora Global Database or DynamoDB Global Tables
- Manage compliance with international data residency mandates (GDPR, HIPAA)

### Practical Challenge
Route user to lowest latency region given measured latency map: return region name with minimum latency.`,
    starterCode: {
      javascript: `function getLowestLatencyRegion(latencyMap) {
  let bestRegion = null;
  let minLatency = Infinity;
  for (const region in latencyMap) {
    if (latencyMap[region] < minLatency) {
      minLatency = latencyMap[region];
      bestRegion = region;
    }
  }
  return bestRegion;
}`,
      python: `def get_lowest_latency_region(latency_map):
    return min(latency_map, key=latency_map.get)`
    },
    testCases: [
      { input: `{"us-east-1": 45, "eu-central-1": 110, "ap-southeast-1": 220}`, expectedOutput: `"us-east-1"`, isHidden: false },
      { input: `{"us-east-1": 150, "eu-central-1": 35}`, expectedOutput: `"eu-central-1"`, isHidden: false }
    ],
    hints: ["Find the key associated with the lowest numerical latency value."]
  },
  {
    id: "sd-tier4c-035",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Active-Active Architecture",
    title: "Active-Active Architecture",
    slug: "active-active-architecture",
    difficulty: "Hard",
    pattern: "High Availability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "active-active", "High Availability"],
    xpReward: 200,
    description: `Master Multi-Region Active-Active architectures. Every region actively serves live read and write traffic concurrently, achieving zero-RTO disaster recovery and local write speed.

### Learning Objectives
- Serve read and write traffic simultaneously across multiple worldwide regions
- Synchronize writes using multi-region distributed databases (DynamoDB Global Tables, CockroachDB, Spanner)
- Handle concurrent write conflicts using Conflict-Free Replicated Data Types (CRDTs) or Last-Write-Wins (LWW)
- Eliminate failover downtime: if Region A fails, global DNS immediately steers traffic to Region B with zero cutover lag
- Avoid cross-region transaction deadlocks by partitioning data by user geography

### Practical Challenge
Check if conflict resolution is needed: return true if two concurrent writes occurred on different regions within conflictWindowMs.`,
    starterCode: {
      javascript: `function isWriteConflict(timestampA, timestampB, conflictWindowMs) {
  return Math.abs(timestampA - timestampB) <= conflictWindowMs;
}`,
      python: `def is_write_conflict(timestamp_a, timestamp_b, conflict_window_ms):
    return abs(timestamp_a - timestamp_b) <= conflict_window_ms`
    },
    testCases: [
      { input: `1000, 1050, 100`, expectedOutput: `true`, isHidden: false },
      { input: `1000, 1500, 100`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Concurrent writes occurring within the conflict window require automated conflict resolution."]
  },
  {
    id: "sd-tier4c-036",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Active-Passive Architecture",
    title: "Active-Passive Architecture",
    slug: "active-passive-architecture",
    difficulty: "Medium",
    pattern: "High Availability",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "active-passive", "High Availability"],
    xpReward: 100,
    description: `Explore Active-Passive (Primary-Standby) multi-region architecture. Traffic directs 100% to primary active region while standby passive region replicates data and waits for failover.

### Learning Objectives
- Direct all production read/write traffic to primary active region under normal operations
- Replicate data continuously to standby passive region via asynchronous replication
- Avoid distributed write conflicts inherent in active-active topologies
- Automate failover using Route 53 DNS failover records when primary health checks fail
- Evaluate the trade-off: simpler architecture and lower cost than active-active, but higher RTO/RPO

### Practical Challenge
Determine routed region: return "primary" if primary is healthy, else "standby".`,
    starterCode: {
      javascript: `function routeActivePassive(isPrimaryHealthy) {
  return isPrimaryHealthy ? "primary" : "standby";
}`,
      python: `def route_active_passive(is_primary_healthy):
    return "primary" if is_primary_healthy else "standby"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"primary"`, isHidden: false },
      { input: `false`, expectedOutput: `"standby"`, isHidden: false }
    ],
    hints: ["Route to primary when healthy; fail over to standby when primary fails."]
  },
  {
    id: "sd-tier4c-037",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Blue-Green Deployment",
    title: "Cloud Blue-Green Deployment",
    slug: "cloud-blue-green-deployment",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "blue-green", "Cloud Architecture"],
    xpReward: 100,
    description: `Implement Cloud Blue-Green Deployments using AWS CodeDeploy, ECS, and Route 53. Transition traffic seamlessly between environments with zero downtime and instant rollback.

### Learning Objectives
- Provision duplicate production target group (Green) alongside live environment (Blue)
- Validate new Green deployment using test listeners and synthetic smoke checks
- Shift 100% of live traffic by updating the Application Load Balancer listener rule
- Terminate old Blue environment only after a configurable bake time
- Rollback instantly by redirecting the ALB listener back to Blue if alarms trigger

### Practical Challenge
Calculate total cost during blue-green deployment: return normalHourlyCost * 2 * deploymentHours.`,
    starterCode: {
      javascript: `function calculateBlueGreenCost(normalHourlyCost, deploymentHours) {
  return normalHourlyCost * 2 * deploymentHours;
}`,
      python: `def calculate_blue_green_cost(normal_hourly_cost, deployment_hours):
    return normal_hourly_cost * 2 * deployment_hours`
    },
    testCases: [
      { input: `10, 2`, expectedOutput: `40`, isHidden: false },
      { input: `5, 4`, expectedOutput: `40`, isHidden: false }
    ],
    hints: ["Both environments run concurrently during deployment (2x cost for deployment duration)."]
  },
  {
    id: "sd-tier4c-038",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Canary Deployment",
    title: "Cloud Canary Deployment",
    slug: "cloud-canary-deployment",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "canary", "Cloud Architecture"],
    xpReward: 100,
    description: `Deploy Cloud Canary Releases with weighted routing on Application Load Balancers, Route 53, or AWS App Mesh. Detect errors on small traffic slices before full rollout.

### Learning Objectives
- Route small percentages of production traffic (e.g. 10%) to canary target groups
- Monitor CloudWatch 5XX error alarms and latency metrics on the canary target group
- Shift remaining 90% of traffic automatically after canary bake interval passes with zero alarms
- Automatically trigger rollback if canary error rate exceeds threshold
- Leverage feature flags to decouple code deployment from feature release

### Practical Challenge
Evaluate canary health: return "ROLLBACK" if canaryErrorRate > baselineErrorRate * 1.5, else "PROCEED".`,
    starterCode: {
      javascript: `function evaluateCanaryHealth(canaryErrorRate, baselineErrorRate) {
  return canaryErrorRate > baselineErrorRate * 1.5 ? "ROLLBACK" : "PROCEED";
}`,
      python: `def evaluate_canary_health(canary_error_rate, baseline_error_rate):
    return "ROLLBACK" if canary_error_rate > baseline_error_rate * 1.5 else "PROCEED"`
    },
    testCases: [
      { input: `3.0, 1.0`, expectedOutput: `"ROLLBACK"`, isHidden: false },
      { input: `1.1, 1.0`, expectedOutput: `"PROCEED"`, isHidden: false }
    ],
    hints: ["If canary error rate exceeds 1.5x baseline error rate, trigger automated rollback."]
  },
  {
    id: "sd-tier4c-039",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Cost Optimization",
    title: "Cost Optimization",
    slug: "cloud-cost-optimization",
    difficulty: "Medium",
    pattern: "Cloud Architecture",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "finops", "cost", "Cloud Architecture"],
    xpReward: 100,
    description: `Master Cloud Cost Optimization (FinOps). Learn rightsizing instances, Savings Plans, Spot instances, idle resource deletion, and object lifecycle storage tiering.

### Learning Objectives
- Rightsize over-provisioned compute: identify instances with average CPU < 20% and downgrade instance types
- Purchase 1-year or 3-year Savings Plans and Reserved Instances for steady-state baseline compute (up to 72% discount)
- Automate shutdown of development and staging environments outside business hours
- Identify and eliminate unattached EBS volumes, idle load balancers, and obsolete snapshots
- Implement object lifecycle rules to transition unaccessed data to S3 Glacier

### Practical Challenge
Calculate annual savings by turning off dev environment 12 hours/day and weekends (total active hours ~50 hours/week out of 168 hours): return Math.round(((168 - 50) / 168) * 100).`,
    starterCode: {
      javascript: `function calculateDevShutdownSavingsPercent(activeHoursPerWeek) {
  const idleHours = 168 - activeHoursPerWeek;
  return Math.round((idleHours / 168) * 100);
}`,
      python: `def calculate_dev_shutdown_savings_percent(active_hours_per_week):
    idle_hours = 168 - active_hours_per_week
    return round((idle_hours / 168.0) * 100)`
    },
    testCases: [
      { input: `50`, expectedOutput: `70`, isHidden: false },
      { input: `40`, expectedOutput: `76`, isHidden: false }
    ],
    hints: ["Calculate (168 - activeHours) / 168 * 100."]
  },
  {
    id: "sd-tier4c-040",
    tier: 4,
    section: "Cloud Architecture",
    topic: "Cloud Security",
    title: "Cloud Security",
    slug: "cloud-security",
    difficulty: "Hard",
    pattern: "Security",
    category: "system-design",
    tags: ["sd-cloud", "system-design", "security", "zero-trust", "guardduty", "Security"],
    xpReward: 200,
    description: `Architect Cloud Security and Zero Trust. Master AWS GuardDuty, Security Hub, threat detection, vulnerability scanning, network segmentation, and compliance governance.

### Learning Objectives
- Implement Zero Trust Architecture: "Never trust, always verify" every user, service, and network packet
- Continuous threat detection using ML-based analysis of VPC flow logs and DNS logs (AWS GuardDuty)
- Scan container images for CVE vulnerabilities in CI/CD pipelines and registries (Amazon ECR scanning)
- Enforce strict perimeter egress filtering to prevent data exfiltration from compromised instances
- Establish automated compliance auditing and remediation against CIS benchmarks (AWS Security Hub)

### Practical Challenge
Verify if security group rule is safe: return false if rule allows inbound from "0.0.0.0/0" on port 22 (SSH), else true.`,
    starterCode: {
      javascript: `function isSecurityGroupRuleSafe(sourceCIDR, port) {
  if (sourceCIDR === "0.0.0.0/0" && (port === 22 || port === 3389)) {
    return false; // Dangerous: open SSH or RDP to the world
  }
  return true;
}`,
      python: `def is_security_group_rule_safe(source_cidr, port):
    if source_cidr == "0.0.0.0/0" and port in (22, 3389):
        return False
    return True`
    },
    testCases: [
      { input: `"0.0.0.0/0", 22`, expectedOutput: `false`, isHidden: false },
      { input: `"10.0.0.0/16", 22`, expectedOutput: `true`, isHidden: false },
      { input: `"0.0.0.0/0", 443`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Opening administrative ports (22, 3389) to 0.0.0.0/0 is a critical security vulnerability."]
  }
];
