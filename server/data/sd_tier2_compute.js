/**
 * TIER 2 — COMPUTE (29 Topics)
 * Difficulty: Easy – Medium
 * Patterns: Load Balancing, Microservices, Containers, Autoscaling, Service Discovery, Fault Tolerance, Distributed Compute
 */

module.exports = [
  {
    id: "sd-tier2c-001",
    tier: 2,
    section: "Compute",
    topic: "Web Servers",
    title: "Web Servers",
    slug: "web-servers",
    difficulty: "Easy",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "web-server", "nginx", "Distributed Compute"],
    xpReward: 50,
    description: `Understand Web Servers (Nginx, Apache, Caddy). Learn how event-driven non-blocking worker processes serve static assets, terminate TLS connections, and proxy dynamic requests.

### Learning Objectives
- Differentiate process-based concurrency (Apache prefork) from event-driven asynchronous I/O (Nginx epoll/kqueue)
- Understand the C10K problem and how event loops maintain tens of thousands of concurrent connections
- Serve static assets (HTML, CSS, JS, images) with zero-copy system calls (sendfile)
- Terminate SSL/TLS certificates and negotiate HTTP/2 and HTTP/3 handshakes
- Configure compression algorithms (Gzip, Brotli) to reduce payload transfer sizes

### Practical Challenge
Calculate bandwidth compression savings: return Math.round(((rawSize - compressedSize) / rawSize) * 100).`,
    starterCode: {
      javascript: `function calculateCompressionSavings(rawSize, compressedSize) {
  return Math.round(((rawSize - compressedSize) / rawSize) * 100);
}`,
      python: `def calculate_compression_savings(raw_size, compressed_size):
    return round(((raw_size - compressed_size) / raw_size) * 100)`
    },
    testCases: [
      { input: `100000, 25000`, expectedOutput: `75`, isHidden: false },
      { input: `50000, 15000`, expectedOutput: `70`, isHidden: false },
      { input: `1000, 500`, expectedOutput: `50`, isHidden: true }
    ],
    hints: ["Calculate (rawSize - compressedSize) / rawSize * 100."]
  },
  {
    id: "sd-tier2c-002",
    tier: 2,
    section: "Compute",
    topic: "Application Servers",
    title: "Application Servers",
    slug: "application-servers",
    difficulty: "Easy",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "app-server", "Distributed Compute"],
    xpReward: 50,
    description: `Explore Application Servers (Node.js, Tomcat, Gunicorn, Puma). Learn how dynamic business logic, database transaction execution, and framework runtimes differ from web server tiers.

### Learning Objectives
- Understand the separation of concerns between web servers (static content & proxying) and application servers (dynamic computation)
- Compare single-threaded event-loop runtimes (Node.js) with multi-threaded pre-fork runtimes (Java, Python Gunicorn)
- Manage application server memory, heap allocations, and garbage collection pauses
- Implement graceful shutdown handlers to allow in-flight requests to complete before process termination
- Configure application clustering to utilize all available CPU cores on multi-core hardware

### Practical Challenge
Calculate workers to spawn for a CPU-bound application server: return numCores. For I/O-bound, return numCores * 2.`,
    starterCode: {
      javascript: `function calculateAppWorkers(numCores, isCPUBound) {
  return isCPUBound ? numCores : numCores * 2;
}`,
      python: `def calculate_app_workers(num_cores, is_cpu_bound):
    return num_cores if is_cpu_bound else num_cores * 2`
    },
    testCases: [
      { input: `8, true`, expectedOutput: `8`, isHidden: false },
      { input: `8, false`, expectedOutput: `16`, isHidden: false },
      { input: `4, true`, expectedOutput: `4`, isHidden: true }
    ],
    hints: ["CPU-bound apps match core count; I/O-bound apps benefit from 2x core count."]
  },
  {
    id: "sd-tier2c-003",
    tier: 2,
    section: "Compute",
    topic: "Load Balancers",
    title: "Load Balancers",
    slug: "load-balancers",
    difficulty: "Easy",
    pattern: "Load Balancing",
    category: "system-design",
    tags: ["sd-compute", "system-design", "load-balancer", "Load Balancing"],
    xpReward: 50,
    description: `Deepen your understanding of Load Balancers. Compare Layer 4 (transport/TCP) and Layer 7 (application/HTTP) load balancing, health monitoring, and sticky sessions.

### Learning Objectives
- Contrast L4 load balancing (routes by IP/port with zero payload inspection) with L7 load balancing (routes by HTTP headers, cookies, URL paths)
- Understand Weighted Round Robin and Least Connections routing algorithms
- Mitigate connection starvation by routing requests to servers with the lowest active connection count
- Terminate TLS certificates at the load balancer to reduce CPU load on application servers
- Configure health probes (interval, timeout, unhealthy threshold) to automatically eject faulty instances

### Practical Challenge
Implement Least Connections routing: given an array of server objects with active connections, return the server with the minimum connections.`,
    starterCode: {
      javascript: `function selectLeastConnections(servers) {
  if (!servers || servers.length === 0) return null;
  return servers.reduce((prev, curr) => curr.connections < prev.connections ? curr : prev).name;
}`,
      python: `def select_least_connections(servers):
    if not servers:
        return None
    return min(servers, key=lambda s: s["connections"])["name"]`
    },
    testCases: [
      { input: `[{"name": "srv1", "connections": 15}, {"name": "srv2", "connections": 5}, {"name": "srv3", "connections": 12}]`, expectedOutput: `"srv2"`, isHidden: false },
      { input: `[{"name": "a", "connections": 10}, {"name": "b", "connections": 100}]`, expectedOutput: `"a"`, isHidden: false }
    ],
    hints: ["Find the server with the smallest connection count."]
  },
  {
    id: "sd-tier2c-004",
    tier: 2,
    section: "Compute",
    topic: "Reverse Proxies",
    title: "Reverse Proxies",
    slug: "reverse-proxies",
    difficulty: "Easy",
    pattern: "Load Balancing",
    category: "system-design",
    tags: ["sd-compute", "system-design", "reverse-proxy", "Load Balancing"],
    xpReward: 50,
    description: `Understand Reverse Proxies (Envoy, Traefik, HAProxy). Contrast forward proxies with reverse proxies, and learn how reverse proxies unify security, caching, SSL, and routing.

### Learning Objectives
- Differentiate forward proxies (protects/masks clients) from reverse proxies (protects/masks servers)
- Hide internal network topology and internal server IP addresses from the public internet
- Buffer slow client connections to prevent slow-loris attacks and thread starvation on backend services
- Implement centralized rate limiting, header transformation, and IP blacklisting
- Route traffic dynamically based on URI path prefixes (e.g. /api/users vs /api/orders)

### Practical Challenge
Given request URL path and route mapping rules, return the destination internal service name.`,
    starterCode: {
      javascript: `function routeReverseProxy(path, routes) {
  for (const prefix in routes) {
    if (path.startsWith(prefix)) return routes[prefix];
  }
  return "default-service";
}`,
      python: `def route_reverse_proxy(path, routes):
    for prefix, service in routes.items():
        if path.startswith(prefix):
            return service
    return "default-service"`
    },
    testCases: [
      { input: `"/api/users/profile", {"/api/users": "user-service", "/api/orders": "order-service"}`, expectedOutput: `"user-service"`, isHidden: false },
      { input: `"/api/orders/checkout", {"/api/users": "user-service", "/api/orders": "order-service"}`, expectedOutput: `"order-service"`, isHidden: false },
      { input: `"/static/logo.png", {"/api/users": "user-service"}`, expectedOutput: `"default-service"`, isHidden: true }
    ],
    hints: ["Iterate through routes and return the service if path starts with the route prefix."]
  },
  {
    id: "sd-tier2c-005",
    tier: 2,
    section: "Compute",
    topic: "API Gateways",
    title: "API Gateways",
    slug: "api-gateways",
    difficulty: "Medium",
    pattern: "Microservices",
    category: "system-design",
    tags: ["sd-compute", "system-design", "api-gateway", "Microservices"],
    xpReward: 100,
    description: `Explore API Gateways (Kong, AWS API Gateway, Zuul). Learn how the gateway acts as the single entry point for all client applications, providing authentication, routing, and telemetry.

### Learning Objectives
- Consolidate cross-cutting concerns: authentication, authorization, rate limiting, request validation, logging
- Implement the Backend-For-Frontend (BFF) pattern tailored for mobile, web, and IoT clients
- Perform protocol translation (e.g. client HTTP/JSON to internal gRPC/Protobuf)
- Aggregate multiple downstream microservice responses into a single combined client payload
- Maintain high availability and low latency at the front door of the distributed system

### Practical Challenge
Simulate API Gateway request pipeline: return "401" if auth fails, "429" if rate limited, else "200".`,
    starterCode: {
      javascript: `function processAPIGateway(isAuthenticated, isRateLimited) {
  if (!isAuthenticated) return "401";
  if (isRateLimited) return "429";
  return "200";
}`,
      python: `def process_api_gateway(is_authenticated, is_rate_limited):
    if not is_authenticated:
        return "401"
    if is_rate_limited:
        return "429"
    return "200"`
    },
    testCases: [
      { input: `false, false`, expectedOutput: `"401"`, isHidden: false },
      { input: `true, true`, expectedOutput: `"429"`, isHidden: false },
      { input: `true, false`, expectedOutput: `"200"`, isHidden: false }
    ],
    hints: ["Check authentication first (401), then rate limiting (429), then success (200)."]
  },
  {
    id: "sd-tier2c-006",
    tier: 2,
    section: "Compute",
    topic: "Monolith Architecture",
    title: "Monolith Architecture",
    slug: "monolith-architecture",
    difficulty: "Easy",
    pattern: "Microservices",
    category: "system-design",
    tags: ["sd-compute", "system-design", "monolith", "Microservices"],
    xpReward: 50,
    description: `Understand the Monolithic Architecture. Analyze its benefits (simple development, easy debugging, single database, in-memory calls) and its inflection points when scaling.

### Learning Objectives
- Understand the virtues of starting with a well-structured modular monolith
- Leverage in-memory function calls and local ACID database transactions
- Identify scaling pain points: long build/test pipelines, tight team coupling, single tech stack
- Plan the evolutionary journey from monolith to microservices using the Strangler Fig pattern
- Avoid premature decomposition into microservices before product-market fit

### Practical Challenge
Determine architecture recommendation: return "Monolith" if engineering team size is <= 10, otherwise "Microservices".`,
    starterCode: {
      javascript: `function recommendArchitecture(teamSize) {
  return teamSize <= 10 ? "Monolith" : "Microservices";
}`,
      python: `def recommend_architecture(team_size):
    return "Monolith" if team_size <= 10 else "Microservices"`
    },
    testCases: [
      { input: `5`, expectedOutput: `"Monolith"`, isHidden: false },
      { input: `50`, expectedOutput: `"Microservices"`, isHidden: false },
      { input: `10`, expectedOutput: `"Monolith"`, isHidden: true }
    ],
    hints: ["Small teams thrive on monolith simplicity; large teams require microservice decoupling."]
  },
  {
    id: "sd-tier2c-007",
    tier: 2,
    section: "Compute",
    topic: "Microservices",
    title: "Microservices",
    slug: "microservices",
    difficulty: "Medium",
    pattern: "Microservices",
    category: "system-design",
    tags: ["sd-compute", "system-design", "microservices", "Microservices"],
    xpReward: 100,
    description: `Master Microservices Architecture. Understand bounded contexts, database-per-service isolation, decentralized governance, independent deployments, and distributed challenges.

### Learning Objectives
- Decompose systems along Domain-Driven Design (DDD) Bounded Contexts
- Enforce the Database-per-Service rule to prevent tight data coupling
- Manage the operational overhead: distributed tracing, observability, network failure modes
- Design resilient inter-service communication (synchronous gRPC vs asynchronous messaging)
- Handle distributed transaction challenges using the Saga pattern

### Practical Challenge
Check if a service boundary adheres to database-per-service: return true if each service has a unique database name.`,
    starterCode: {
      javascript: `function isDatabasePerService(serviceDbMap) {
  const dbs = Object.values(serviceDbMap);
  return new Set(dbs).size === dbs.length;
}`,
      python: `def is_database_per_service(service_db_map):
    dbs = list(service_db_map.values())
    return len(set(dbs)) == len(dbs)`
    },
    testCases: [
      { input: `{"users": "db_users", "orders": "db_orders", "payments": "db_payments"}`, expectedOutput: `true`, isHidden: false },
      { input: `{"users": "db_shared", "orders": "db_shared"}`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if all values in the dictionary are strictly unique (no shared databases)."]
  },
  {
    id: "sd-tier2c-008",
    tier: 2,
    section: "Compute",
    topic: "Service-Oriented Architecture",
    title: "Service-Oriented Architecture",
    slug: "service-oriented-architecture",
    difficulty: "Easy",
    pattern: "Microservices",
    category: "system-design",
    tags: ["sd-compute", "system-design", "soa", "Microservices"],
    xpReward: 50,
    description: `Understand Service-Oriented Architecture (SOA) and Enterprise Service Buses (ESB). Compare classical coarse-grained SOA with modern fine-grained lightweight microservices.

### Learning Objectives
- Understand the historical evolution from monolithic ERPs to SOA and Enterprise Service Buses
- Contrast smart pipes / dumb endpoints (SOA/ESB) with dumb pipes / smart endpoints (Microservices)
- Learn service contracts, WSDL/SOAP vs REST/gRPC
- Identify common pitfalls of centralized ESB architectures: single point of failure and bottleneck
- Extract legacy SOA services into modern event-driven microservices

### Practical Challenge
Classify architecture type: return "SOA" if an ESB bus is present, else "Microservices".`,
    starterCode: {
      javascript: `function classifyServiceArchitecture(hasESB) {
  return hasESB ? "SOA" : "Microservices";
}`,
      python: `def classify_service_architecture(has_esb):
    return "SOA" if has_esb else "Microservices"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"SOA"`, isHidden: false },
      { input: `false`, expectedOutput: `"Microservices"`, isHidden: false }
    ],
    hints: ["Centralized Enterprise Service Bus is the hallmark of classical SOA."]
  },
  {
    id: "sd-tier2c-009",
    tier: 2,
    section: "Compute",
    topic: "Containerization",
    title: "Containerization",
    slug: "containerization",
    difficulty: "Easy",
    pattern: "Containers",
    category: "system-design",
    tags: ["sd-compute", "system-design", "containers", "Containers"],
    xpReward: 50,
    description: `Explore Containerization and OS-level virtualization. Contrast lightweight containers sharing the host kernel with heavyweight virtual machines running separate guest operating systems.

### Learning Objectives
- Compare Containers (shared host kernel, fast startup, small footprint) with Virtual Machines (hypervisor, full guest OS)
- Understand Linux kernel primitives powering containers: Namespaces (isolation) and cgroups (resource limits)
- Achieve consistent environments across local dev, staging, and multi-cloud production ("it works on my machine" solved)
- Package code, dependencies, configuration, and system libraries into immutable container images
- Optimize container image layers and build multi-stage Dockerfiles for minimal image size

### Practical Challenge
Calculate memory efficiency ratio: return Math.round(vmMemoryMB / containerMemoryMB).`,
    starterCode: {
      javascript: `function calculateContainerMemoryEfficiency(vmMemoryMB, containerMemoryMB) {
  return Math.round(vmMemoryMB / containerMemoryMB);
}`,
      python: `def calculate_container_memory_efficiency(vm_memory_mb, container_memory_mb):
    return round(vm_memory_mb / container_memory_mb)`
    },
    testCases: [
      { input: `2048, 256`, expectedOutput: `8`, isHidden: false },
      { input: `4096, 512`, expectedOutput: `8`, isHidden: false },
      { input: `1024, 1024`, expectedOutput: `1`, isHidden: true }
    ],
    hints: ["Divide VM memory footprint by lightweight container memory footprint."]
  },
  {
    id: "sd-tier2c-010",
    tier: 2,
    section: "Compute",
    topic: "Docker Concepts",
    title: "Docker Concepts",
    slug: "docker-concepts",
    difficulty: "Easy",
    pattern: "Containers",
    category: "system-design",
    tags: ["sd-compute", "system-design", "docker", "Containers"],
    xpReward: 50,
    description: `Master core Docker concepts: Dockerfiles, image layers, UnionFS, container lifecycle, port binding, environment variables, volume mounts, and Docker networks.

### Learning Objectives
- Understand copy-on-write (CoW) filesystem layering and image caching
- Build secure, slim production containers using multi-stage Docker builds and distroless base images
- Persist data beyond container lifecycle using Docker Volumes
- Configure bridge, host, and overlay networks for inter-container communication
- Manage secrets and runtime configurations via environment variables without baking secrets into images

### Practical Challenge
Calculate total image size given base layer size and an array of layer additions in MB.`,
    starterCode: {
      javascript: `function calculateDockerImageSize(baseMB, layersMB) {
  return layersMB.reduce((acc, curr) => acc + curr, baseMB);
}`,
      python: `def calculate_docker_image_size(base_mb, layers_mb):
    return sum(layers_mb) + base_mb`
    },
    testCases: [
      { input: `50, [10, 25, 15]`, expectedOutput: `100`, isHidden: false },
      { input: `20, [5, 5]`, expectedOutput: `30`, isHidden: false }
    ],
    hints: ["Sum all layer sizes and add base layer size."]
  },
  {
    id: "sd-tier2c-011",
    tier: 2,
    section: "Compute",
    topic: "Container Orchestration",
    title: "Container Orchestration",
    slug: "container-orchestration",
    difficulty: "Medium",
    pattern: "Containers",
    category: "system-design",
    tags: ["sd-compute", "system-design", "orchestration", "Containers"],
    xpReward: 100,
    description: `Understand Container Orchestration. Learn how platforms coordinate thousands of containers across fleets of physical servers, managing scheduling, self-healing, updates, and scaling.

### Learning Objectives
- Automate deployment, scaling, networking, and availability across clusters of compute nodes
- Implement bin-packing algorithms to schedule containers onto servers maximizing resource utilization
- Execute automatic self-healing: restart crashed containers, reschedule on node hardware failure
- Conduct zero-downtime rolling updates and automated rollbacks on health check failures
- Manage service discovery, load balancing, and secret rotation across dynamic container IPs

### Practical Challenge
Determine how many container replicas can fit on a host given host RAM (GB) and container RAM requirement (GB).`,
    starterCode: {
      javascript: `function calculateMaxReplicasOnHost(hostRAM, containerRAM) {
  return Math.floor(hostRAM / containerRAM);
}`,
      python: `def calculate_max_replicas_on_host(host_ram, container_ram):
    return host_ram // container_ram`
    },
    testCases: [
      { input: `64, 4`, expectedOutput: `16`, isHidden: false },
      { input: `32, 6`, expectedOutput: `5`, isHidden: false }
    ],
    hints: ["Divide host RAM by container RAM and round down."]
  },
  {
    id: "sd-tier2c-012",
    tier: 2,
    section: "Compute",
    topic: "Kubernetes Concepts",
    title: "Kubernetes Concepts",
    slug: "kubernetes-concepts",
    difficulty: "Medium",
    pattern: "Containers",
    category: "system-design",
    tags: ["sd-compute", "system-design", "k8s", "kubernetes", "Containers"],
    xpReward: 100,
    description: `Master Kubernetes (K8s) architecture: Control Plane (API Server, etcd, Scheduler, Controller Manager) and Worker Nodes (Kubelet, Kube-proxy, Container Runtime). Explore Pods, Deployments, Services, and Ingress.

### Learning Objectives
- Understand the fundamental unit of deployment: the Pod (one or more co-located containers)
- Manage declarative desired state reconciliation via Deployments and ReplicaSets
- Expose pods reliably using Services (ClusterIP, NodePort, LoadBalancer) with stable DNS names
- Route external HTTP/HTTPS traffic to internal services using Ingress Controllers
- Store cluster state and configuration strictly in distributed consensus store (etcd)

### Practical Challenge
Determine Service type needed: return "LoadBalancer" if external internet access is required, else "ClusterIP" for internal cluster access.`,
    starterCode: {
      javascript: `function getK8sServiceType(isPublicInternet) {
  return isPublicInternet ? "LoadBalancer" : "ClusterIP";
}`,
      python: `def get_k8s_service_type(is_public_internet):
    return "LoadBalancer" if is_public_internet else "ClusterIP"`
    },
    testCases: [
      { input: `true`, expectedOutput: `"LoadBalancer"`, isHidden: false },
      { input: `false`, expectedOutput: `"ClusterIP"`, isHidden: false }
    ],
    hints: ["External internet services require LoadBalancer; internal microservice communication uses ClusterIP."]
  },
  {
    id: "sd-tier2c-013",
    tier: 2,
    section: "Compute",
    topic: "Autoscaling",
    title: "Autoscaling",
    slug: "autoscaling",
    difficulty: "Medium",
    pattern: "Autoscaling",
    category: "system-design",
    tags: ["sd-compute", "system-design", "autoscaling", "Autoscaling"],
    xpReward: 100,
    description: `Explore Autoscaling architectures. Compare Horizontal Pod Autoscaler (HPA) adding replicas, Vertical Pod Autoscaler (VPA) resizing CPU/RAM, and Cluster Autoscaler scaling underlying VM nodes.

### Learning Objectives
- Configure reactive autoscaling triggers: CPU utilization, memory thresholds, request rate, custom queue length
- Prevent flapping (rapid scale-out and scale-in oscillations) using stabilization windows and cooldown periods
- Implement predictive autoscaling using historical traffic forecasting models
- Scale cluster hardware nodes automatically using Cluster Autoscaler / Karpenter
- Scale to zero (Knative) for serverless workloads during periods of zero traffic

### Practical Challenge
Calculate desired replica count using standard HPA formula: ceil(currentReplicas * (currentMetricValue / targetMetricValue)).`,
    starterCode: {
      javascript: `function calculateHPAReplicas(currentReplicas, currentVal, targetVal) {
  return Math.ceil(currentReplicas * (currentVal / targetVal));
}`,
      python: `import math

def calculate_hpa_replicas(current_replicas, current_val, target_val):
    return math.ceil(current_replicas * (current_val / target_val))`
    },
    testCases: [
      { input: `5, 80, 50`, expectedOutput: `8`, isHidden: false },
      { input: `10, 50, 50`, expectedOutput: `10`, isHidden: false },
      { input: `4, 25, 50`, expectedOutput: `2`, isHidden: true }
    ],
    hints: ["HPA formula: ceil(currentReplicas * (currentMetric / targetMetric))."]
  },
  {
    id: "sd-tier2c-014",
    tier: 2,
    section: "Compute",
    topic: "Horizontal Scaling",
    title: "Horizontal Compute Scaling",
    slug: "horizontal-compute-scaling",
    difficulty: "Easy",
    pattern: "Autoscaling",
    category: "system-design",
    tags: ["sd-compute", "system-design", "horizontal-scaling", "Autoscaling"],
    xpReward: 50,
    description: `Scale compute layers horizontally behind load balancers. Learn how stateless application tier design enables adding dozens or hundreds of identical worker nodes in seconds.

### Learning Objectives
- Keep the compute tier completely stateless to enable zero-friction horizontal scaling
- Handle cold starts and container boot times during rapid scale-out events
- Distribute compute nodes across multiple Availability Zones (AZs) for high availability
- Terminate long-lived TCP/WebSocket connections gracefully when draining scaled-in nodes
- Integrate health checks to ensure new nodes only receive traffic once warmed up

### Practical Challenge
Calculate total compute capacity (QPS) of a cluster given node count and QPS capacity per node.`,
    starterCode: {
      javascript: `function calculateClusterQPS(nodes, qpsPerNode) {
  return nodes * qpsPerNode;
}`,
      python: `def calculate_cluster_qps(nodes, qps_per_node):
    return nodes * qps_per_node`
    },
    testCases: [
      { input: `10, 250`, expectedOutput: `2500`, isHidden: false },
      { input: `4, 500`, expectedOutput: `2000`, isHidden: false }
    ],
    hints: ["Multiply node count by per-node QPS capacity."]
  },
  {
    id: "sd-tier2c-015",
    tier: 2,
    section: "Compute",
    topic: "Serverless Architecture",
    title: "Serverless Architecture",
    slug: "serverless-architecture",
    difficulty: "Medium",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "serverless", "lambda", "Distributed Compute"],
    xpReward: 100,
    description: `Understand Serverless Function-as-a-Service (FaaS) platforms like AWS Lambda and Google Cloud Functions. Analyze event-driven execution, instant scaling, cold starts, and cost trade-offs.

### Learning Objectives
- Benefit from automatic scaling, zero server maintenance, and pay-per-millisecond execution billing
- Understand Cold Starts (container initialization overhead) and mitigation via provisioned concurrency
- Recognize execution duration limits (e.g. 15 minutes on AWS Lambda)
- Manage database connection pooling challenges from thousands of short-lived ephemeral functions
- Compare serverless cost vs continuous dedicated container cost at high steady-state scale

### Practical Challenge
Determine cost-effectiveness: return "Serverless" if active minutes per day <= 120, otherwise "Dedicated".`,
    starterCode: {
      javascript: `function chooseComputeModel(activeMinutesPerDay) {
  return activeMinutesPerDay <= 120 ? "Serverless" : "Dedicated";
}`,
      python: `def choose_compute_model(active_minutes_per_day):
    return "Serverless" if active_minutes_per_day <= 120 else "Dedicated"`
    },
    testCases: [
      { input: `60`, expectedOutput: `"Serverless"`, isHidden: false },
      { input: `720`, expectedOutput: `"Dedicated"`, isHidden: false }
    ],
    hints: ["Serverless is cost-effective for intermittent, bursty workloads; dedicated is cheaper for steady workloads."]
  },
  {
    id: "sd-tier2c-016",
    tier: 2,
    section: "Compute",
    topic: "Background Workers",
    title: "Background Workers",
    slug: "background-workers",
    difficulty: "Easy",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "workers", "Distributed Compute"],
    xpReward: 50,
    description: `Decouple synchronous HTTP request-response cycles from long-running background tasks. Learn how background workers process asynchronous jobs like email dispatch, video encoding, and reports.

### Learning Objectives
- Return immediate 202 Accepted HTTP responses to clients while processing work in the background
- Prevent web server request timeouts and thread exhaustion caused by slow external APIs
- Scale background worker pools independently from front-end web server pools
- Implement job status polling or WebSocket push notifications for completion updates
- Handle worker crash failures using message acknowledgment mechanisms

### Practical Challenge
Calculate processing time in seconds for a backlog of jobs given total jobs and jobs processed per second per worker.`,
    starterCode: {
      javascript: `function calculateBacklogClearTimeSec(totalJobs, workers, jobsPerSecPerWorker) {
  const clusterThroughput = workers * jobsPerSecPerWorker;
  return Math.ceil(totalJobs / clusterThroughput);
}`,
      python: `import math

def calculate_backlog_clear_time_sec(total_jobs, workers, jobs_per_sec_per_worker):
    cluster_throughput = workers * jobs_per_sec_per_worker
    return math.ceil(total_jobs / cluster_throughput)`
    },
    testCases: [
      { input: `1000, 4, 25`, expectedOutput: `10`, isHidden: false },
      { input: `500, 2, 50`, expectedOutput: `5`, isHidden: false }
    ],
    hints: ["Divide totalJobs by (workers * jobsPerSecPerWorker) and round up."]
  },
  {
    id: "sd-tier2c-017",
    tier: 2,
    section: "Compute",
    topic: "Job Queues",
    title: "Job Queues",
    slug: "job-queues",
    difficulty: "Easy",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "queues", "rabbitmq", "celery", "Distributed Compute"],
    xpReward: 50,
    description: `Master asynchronous Job Queues (RabbitMQ, Celery, BullMQ, AWS SQS). Understand producers, consumers, message visibility timeouts, consumer acknowledgments, and backpressure.

### Learning Objectives
- Decouple producers and consumers to absorb traffic spikes without system collapse (load leveling)
- Understand message acknowledgment (ACK) and negative acknowledgment (NACK) mechanisms
- Configure Visibility Timeout to prevent duplicate concurrent processing while allowing recovery
- Handle failed jobs using Dead Letter Queues (DLQs) with maximum retry limits
- Prioritize critical jobs using multi-tier priority queues (high, medium, low priority)

### Practical Challenge
Simulate queue FIFO pop: remove and return the first element of the queue array, or null if empty.`,
    starterCode: {
      javascript: `function popJobFromQueue(queue) {
  if (!queue || queue.length === 0) return null;
  return queue.shift();
}`,
      python: `def pop_job_from_queue(queue):
    if not queue:
        return None
    return queue.pop(0)`
    },
    testCases: [
      { input: `["job1", "job2", "job3"]`, expectedOutput: `"job1"`, isHidden: false },
      { input: `[]`, expectedOutput: `null`, isHidden: false }
    ],
    hints: ["FIFO queue pops the oldest element (first element) from the front of the queue."]
  },
  {
    id: "sd-tier2c-018",
    tier: 2,
    section: "Compute",
    topic: "Task Scheduling",
    title: "Task Scheduling",
    slug: "task-scheduling",
    difficulty: "Medium",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "scheduling", "cron", "Distributed Compute"],
    xpReward: 100,
    description: `Explore Task Scheduling across distributed clusters. Learn why running cron jobs on single servers is a single point of failure, and how distributed schedulers manage lock leases.

### Learning Objectives
- Understand cron expressions (minute, hour, day of month, month, day of week)
- Prevent duplicate execution across multiple server instances using distributed locks (Redlock, Consul)
- Build distributed job schedulers using time-wheel algorithms and persistent delay queues
- Guarantee at-least-once execution for mission-critical recurring tasks (billing, invoice generation)
- Handle clock skew and timezone variations using UTC timestamps

### Practical Challenge
Determine if a distributed cron job should execute: return true if lock acquired successfully, false if already locked.`,
    starterCode: {
      javascript: `function tryAcquireCronLock(lockStore, jobKey, serverId) {
  if (lockStore[jobKey]) return false;
  lockStore[jobKey] = serverId;
  return true;
}`,
      python: `def try_acquire_cron_lock(lock_store, job_key, server_id):
    if job_key in lock_store:
        return False
    lock_store[job_key] = server_id
    return True`
    },
    testCases: [
      { input: `{}, "midnight_cleanup", "srv_1"`, expectedOutput: `true`, isHidden: false },
      { input: `{"midnight_cleanup": "srv_2"}, "midnight_cleanup", "srv_1"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Only one server can acquire the lock for a given job key at a time."]
  },
  {
    id: "sd-tier2c-019",
    tier: 2,
    section: "Compute",
    topic: "Thread Pools",
    title: "Thread Pools",
    slug: "thread-pools",
    difficulty: "Easy",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "thread-pool", "concurrency", "Distributed Compute"],
    xpReward: 50,
    description: `Understand Thread Pools and concurrency models. Learn how pre-allocating a fixed pool of worker threads prevents the catastrophic overhead of unbounded thread creation.

### Learning Objectives
- Analyze the cost of thread creation: stack allocation (typically 1MB per thread) and context switching
- Configure corePoolSize, maxPoolSize, keepAliveTime, and workQueue capacity
- Handle thread pool saturation using rejection execution policies: Abort, CallerRuns, DiscardOldest
- Prevent thread starvation deadlocks where tasks in pool wait on other tasks submitted to the same pool
- Size thread pools optimally: N_threads = N_cpu * (1 + Wait_time / Compute_time)

### Practical Challenge
Size optimal thread pool count using formula: Math.round(cpuCores * (1 + waitTimeMs / computeTimeMs)).`,
    starterCode: {
      javascript: `function calculateOptimalThreadPool(cpuCores, waitTimeMs, computeTimeMs) {
  return Math.round(cpuCores * (1 + waitTimeMs / computeTimeMs));
}`,
      python: `def calculate_optimal_thread_pool(cpu_cores, wait_time_ms, compute_time_ms):
    return round(cpu_cores * (1 + wait_time_ms / compute_time_ms))`
    },
    testCases: [
      { input: `4, 100, 20`, expectedOutput: `24`, isHidden: false },
      { input: `8, 50, 50`, expectedOutput: `16`, isHidden: false },
      { input: `2, 0, 10`, expectedOutput: `2`, isHidden: true }
    ],
    hints: ["Formula: cpuCores * (1 + waitTime / computeTime)."]
  },
  {
    id: "sd-tier2c-020",
    tier: 2,
    section: "Compute",
    topic: "Service Discovery",
    title: "Service Discovery",
    slug: "service-discovery",
    difficulty: "Medium",
    pattern: "Service Discovery",
    category: "system-design",
    tags: ["sd-compute", "system-design", "service-discovery", "consul", "Service Discovery"],
    xpReward: 100,
    description: `Master Service Discovery in dynamic microservices. Compare Client-Side Discovery (Eureka) with Server-Side Discovery (AWS ALB, K8s CoreDNS) and central registries (Consul, etcd).

### Learning Objectives
- Solve the dynamic IP problem in autoscaling cloud environments where container IPs change continuously
- Client-Side Discovery: Client queries service registry and executes load balancing directly
- Server-Side Discovery: Client connects to load balancer/proxy which queries registry and routes request
- Implement heartbeat registration and automatic deregistration of unhealthy instances
- Cache service instance endpoints locally with DNS TTL to survive temporary registry outages

### Practical Challenge
Register service instance: add instance IP to service registry array and return updated instance count.`,
    starterCode: {
      javascript: `function registerServiceInstance(registry, serviceName, instanceIP) {
  if (!registry[serviceName]) registry[serviceName] = [];
  if (!registry[serviceName].includes(instanceIP)) {
    registry[serviceName].push(instanceIP);
  }
  return registry[serviceName].length;
}`,
      python: `def register_service_instance(registry, service_name, instance_ip):
    if service_name not in registry:
        registry[service_name] = []
    if instance_ip not in registry[service_name]:
        registry[service_name].append(instance_ip)
    return len(registry[service_name])`
    },
    testCases: [
      { input: `{}, "auth-svc", "10.0.1.5"`, expectedOutput: `1`, isHidden: false },
      { input: `{"auth-svc": ["10.0.1.5"]}, "auth-svc", "10.0.1.6"`, expectedOutput: `2`, isHidden: false }
    ],
    hints: ["Add instanceIP to registry[serviceName] list if not present, and return length."]
  },
  {
    id: "sd-tier2c-021",
    tier: 2,
    section: "Compute",
    topic: "Health Checks",
    title: "Health Checks",
    slug: "health-checks",
    difficulty: "Easy",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-compute", "system-design", "health-checks", "liveness", "readiness", "Fault Tolerance"],
    xpReward: 50,
    description: `Understand Health Checks: Liveness Probes, Readiness Probes, and Startup Probes. Learn how orchestrators prevent routing traffic to booting or broken service instances.

### Learning Objectives
- Liveness Probes: Checks if application is alive; restarts container if deadlocked
- Readiness Probes: Checks if application is ready to accept incoming traffic; removes from load balancer if false
- Startup Probes: Protects slow-starting legacy apps from premature liveness kills
- Avoid cascading failures: Ensure health checks do NOT query external databases or dependencies synchronously
- Configure probe parameters: initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold

### Practical Challenge
Determine pod state: return "restart" if liveness is false; else return "route_traffic" if readiness is true; else "standby".`,
    starterCode: {
      javascript: `function evaluatePodHealth(isLive, isReady) {
  if (!isLive) return "restart";
  if (isReady) return "route_traffic";
  return "standby";
}`,
      python: `def evaluate_pod_health(is_live, is_ready):
    if not is_live:
        return "restart"
    if is_ready:
        return "route_traffic"
    return "standby"`
    },
    testCases: [
      { input: `false, false`, expectedOutput: `"restart"`, isHidden: false },
      { input: `true, true`, expectedOutput: `"route_traffic"`, isHidden: false },
      { input: `true, false`, expectedOutput: `"standby"`, isHidden: false }
    ],
    hints: ["If not live, restart; if ready, route traffic; otherwise standby."]
  },
  {
    id: "sd-tier2c-022",
    tier: 2,
    section: "Compute",
    topic: "Circuit Breakers",
    title: "Circuit Breakers",
    slug: "circuit-breakers",
    difficulty: "Medium",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-compute", "system-design", "circuit-breaker", "resilience", "Fault Tolerance"],
    xpReward: 100,
    description: `Master the Circuit Breaker pattern (Resilience4j, Netflix Hystrix). Prevent cascading failures in distributed call chains by failing fast when downstream services become unresponsive.

### Learning Objectives
- Understand Circuit Breaker states: Closed (normal flow), Open (fail fast), Half-Open (trial requests)
- Transition from Closed to Open when error rate exceeds threshold over a sliding evaluation window
- Return instant fallback responses without waiting for network timeouts when circuit is Open
- Transition to Half-Open after sleep window to probe if downstream service has recovered
- Stop cascading exhaustion of upstream thread pools and connection sockets

### Practical Challenge
Evaluate circuit breaker transition: given state "CLOSED", failureCount, and failureThreshold: return "OPEN" if failureCount >= failureThreshold, else "CLOSED".`,
    starterCode: {
      javascript: `function evaluateCircuitState(currentState, failureCount, failureThreshold) {
  if (currentState === "CLOSED" && failureCount >= failureThreshold) {
    return "OPEN";
  }
  return currentState;
}`,
      python: `def evaluate_circuit_state(current_state, failure_count, failure_threshold):
    if current_state == "CLOSED" and failure_count >= failure_threshold:
        return "OPEN"
    return current_state`
    },
    testCases: [
      { input: `"CLOSED", 5, 5`, expectedOutput: `"OPEN"`, isHidden: false },
      { input: `"CLOSED", 3, 5`, expectedOutput: `"CLOSED"`, isHidden: false },
      { input: `"OPEN", 1, 5`, expectedOutput: `"OPEN"`, isHidden: true }
    ],
    hints: ["If CLOSED and failures reach threshold, trip circuit to OPEN."]
  },
  {
    id: "sd-tier2c-023",
    tier: 2,
    section: "Compute",
    topic: "Retry Strategies",
    title: "Retry Strategies",
    slug: "retry-strategies",
    difficulty: "Medium",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-compute", "system-design", "retries", "exponential-backoff", "jitter", "Fault Tolerance"],
    xpReward: 100,
    description: `Design intelligent Retry Strategies. Master Exponential Backoff with Jitter to prevent the Thundering Herd and retry storm problems from overwhelming recovering systems.

### Learning Objectives
- Never retry immediately in loops (causes DDoS on recovering systems)
- Implement Exponential Backoff: delay = baseDelay * (2 ^ attempt)
- Add Full Jitter (randomization) to desynchronize concurrent client retries
- Only retry transient, idempotent operations (HTTP 503, 504, 429; NEVER 400 or 401)
- Bound maximum retry attempts and enforce global request deadline budgets

### Practical Challenge
Calculate exponential backoff delay in ms for attempt n (0-indexed) with base delay: baseMs * (2 ^ attempt).`,
    starterCode: {
      javascript: `function calculateExponentialBackoff(baseMs, attempt) {
  return baseMs * Math.pow(2, attempt);
}`,
      python: `def calculate_exponential_backoff(base_ms, attempt):
    return base_ms * (2 ** attempt)`
    },
    testCases: [
      { input: `100, 0`, expectedOutput: `100`, isHidden: false },
      { input: `100, 3`, expectedOutput: `800`, isHidden: false },
      { input: `50, 4`, expectedOutput: `800`, isHidden: true }
    ],
    hints: ["Calculate baseMs * (2 ** attempt)."]
  },
  {
    id: "sd-tier2c-024",
    tier: 2,
    section: "Compute",
    topic: "Timeout Handling",
    title: "Timeout Handling",
    slug: "timeout-handling",
    difficulty: "Easy",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-compute", "system-design", "timeouts", "Fault Tolerance"],
    xpReward: 50,
    description: `Learn how proper timeout handling prevents thread starvation and resource exhaustion across microservice call chains. Understand connection timeouts vs socket/read timeouts.

### Learning Objectives
- Differentiate Connection Timeout (TCP handshake limit) from Read/Socket Timeout (server response limit)
- Implement Context Deadlines (gRPC deadlines) that propagate remaining timeout down the call graph
- Abort downstream processing early if parent caller has already timed out or disconnected
- Set defensive timeouts: never leave client network calls with default infinite timeouts
- Balance timeout threshold: short enough to fail fast, long enough to accommodate p99 latency

### Practical Challenge
Calculate remaining deadline time in ms: return max(0, totalDeadlineMs - elapsedMs).`,
    starterCode: {
      javascript: `function calculateRemainingDeadline(totalDeadlineMs, elapsedMs) {
  return Math.max(0, totalDeadlineMs - elapsedMs);
}`,
      python: `def calculate_remaining_deadline(total_deadline_ms, elapsed_ms):
    return max(0, total_deadline_ms - elapsed_ms)`
    },
    testCases: [
      { input: `1000, 400`, expectedOutput: `600`, isHidden: false },
      { input: `1000, 1200`, expectedOutput: `0`, isHidden: false }
    ],
    hints: ["Subtract elapsedMs from totalDeadlineMs and clamp to minimum 0."]
  },
  {
    id: "sd-tier2c-025",
    tier: 2,
    section: "Compute",
    topic: "Graceful Degradation",
    title: "Graceful Degradation",
    slug: "graceful-degradation",
    difficulty: "Medium",
    pattern: "Fault Tolerance",
    category: "system-design",
    tags: ["sd-compute", "system-design", "graceful-degradation", "load-shedding", "Fault Tolerance"],
    xpReward: 100,
    description: `Explore Graceful Degradation and Load Shedding. Learn how systems drop non-critical features (recommendations, comments) to preserve core business capabilities (checkout, payment) under peak stress.

### Learning Objectives
- Prioritize core critical path workflows over auxiliary features during traffic spikes
- Implement Priority Load Shedding: drop background analytics and recommendation queries first
- Return cached, degraded, or default static responses when secondary services fail
- Use feature flags to dynamically disable heavy UI modules during flash sales
- Protect database health by dropping non-essential write tasks to queues

### Practical Challenge
Determine if a request should be served during load shedding: return true if system load < 90 or request priority is "critical", else false.`,
    starterCode: {
      javascript: `function shouldProcessRequest(systemLoadPercent, priority) {
  if (systemLoadPercent < 90) return true;
  return priority === "critical";
}`,
      python: `def should_process_request(system_load_percent, priority):
    if system_load_percent < 90:
        return True
    return priority == "critical"`
    },
    testCases: [
      { input: `95, "critical"`, expectedOutput: `true`, isHidden: false },
      { input: `95, "low"`, expectedOutput: `false`, isHidden: false },
      { input: `50, "low"`, expectedOutput: `true`, isHidden: true }
    ],
    hints: ["Under high load (>=90), only process critical priority requests."]
  },
  {
    id: "sd-tier2c-026",
    tier: 2,
    section: "Compute",
    topic: "Blue-Green Deployment",
    title: "Blue-Green Deployment",
    slug: "blue-green-deployment",
    difficulty: "Medium",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "blue-green", "deployment", "Distributed Compute"],
    xpReward: 100,
    description: `Master Blue-Green Deployments. Maintain two identical production environments (Blue active, Green idle) to achieve instantaneous zero-downtime releases and immediate rollback capability.

### Learning Objectives
- Deploy new release version to idle environment (Green) without impacting live users
- Run smoke tests and integration verifications against Green environment in isolation
- Switch 100% of live traffic instantly via router or load balancer pointer shift
- Rollback immediately by switching the router back to Blue if errors spike
- Manage database schema migrations that must be backward-compatible with both Blue and Green

### Practical Challenge
Switch active environment router pointer: return targetEnv ("green" if current is "blue", else "blue").`,
    starterCode: {
      javascript: `function switchDeploymentRouter(currentActive) {
  return currentActive.toLowerCase() === "blue" ? "green" : "blue";
}`,
      python: `def switch_deployment_router(current_active):
    return "green" if current_active.lower() == "blue" else "blue"`
    },
    testCases: [
      { input: `"blue"`, expectedOutput: `"green"`, isHidden: false },
      { input: `"green"`, expectedOutput: `"blue"`, isHidden: false }
    ],
    hints: ["Toggle between blue and green environments."]
  },
  {
    id: "sd-tier2c-027",
    tier: 2,
    section: "Compute",
    topic: "Canary Deployment",
    title: "Canary Deployment",
    slug: "canary-deployment",
    difficulty: "Medium",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "canary", "deployment", "Distributed Compute"],
    xpReward: 100,
    description: `Understand Canary Deployments. Roll out new software versions incrementally to a small subset of users (e.g. 1%, 5%, 25%, 100%) while monitoring telemetry for regressions.

### Learning Objectives
- Route a small fraction of real production traffic to canary instances
- Monitor error rates, latency percentiles, and business metrics between canary and baseline cohorts
- Automate canary analysis: halt and rollback deployment automatically if canary error rate exceeds baseline
- Leverage Service Meshes (Istio, Envoy) to route traffic by user headers or percentage weights
- Minimize the blast radius of unexpected production bugs to a tiny percentage of users

### Practical Challenge
Determine if a request falls into canary cohort based on user hash modulo 100 and canary percentage.`,
    starterCode: {
      javascript: `function isCanaryUser(userId, canaryPercent) {
  const hash = Math.abs(userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0));
  return (hash % 100) < canaryPercent;
}`,
      python: `def is_canary_user(user_id, canary_percent):
    h = sum(ord(c) for c in user_id)
    return (h % 100) < canary_percent`
    },
    testCases: [
      { input: `"user_999", 10`, expectedOutput: `false`, isHidden: false },
      { input: `"user_1", 100`, expectedOutput: `true`, isHidden: false }
    ],
    hints: ["Hash user ID and check if (hash % 100) is strictly less than canaryPercent."]
  },
  {
    id: "sd-tier2c-028",
    tier: 2,
    section: "Compute",
    topic: "Rolling Deployment",
    title: "Rolling Deployment",
    slug: "rolling-deployment",
    difficulty: "Easy",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "rolling-update", "k8s", "Distributed Compute"],
    xpReward: 50,
    description: `Explore Rolling Deployments. Learn how orchestrators replace old version pods with new version pods incrementally, maintaining continuous capacity without requiring 2x hardware resources.

### Learning Objectives
- Replace instances incrementally without provisioning duplicate full-cluster environments
- Configure maxSurge (extra pods created above desired count) and maxUnavailable (pods offline during update)
- Maintain minimum service capacity throughout the deployment lifecycle
- Handle rolling back across in-progress batch updates if readiness probes fail
- Support temporary mixed-version cluster operation where v1 and v2 coexist

### Practical Challenge
Calculate max allowed active pods during a rolling update given desiredReplicas and maxSurge percentage. Round up.`,
    starterCode: {
      javascript: `function calculateMaxSurgePods(desiredReplicas, maxSurgePercent) {
  const extra = Math.ceil(desiredReplicas * (maxSurgePercent / 100));
  return desiredReplicas + extra;
}`,
      python: `import math

def calculate_max_surge_pods(desired_replicas, max_surge_percent):
    extra = math.ceil(desired_replicas * (max_surge_percent / 100.0))
    return desired_replicas + extra`
    },
    testCases: [
      { input: `10, 25`, expectedOutput: `13`, isHidden: false },
      { input: `4, 50`, expectedOutput: `6`, isHidden: false }
    ],
    hints: ["Add ceil(desired * surgePercent / 100) to desiredReplicas."]
  },
  {
    id: "sd-tier2c-029",
    tier: 2,
    section: "Compute",
    topic: "Multi-Region Compute",
    title: "Multi-Region Compute",
    slug: "multi-region-compute",
    difficulty: "Medium",
    pattern: "Distributed Compute",
    category: "system-design",
    tags: ["sd-compute", "system-design", "multi-region", "geo", "Distributed Compute"],
    xpReward: 100,
    description: `Deploy compute clusters across multiple geographic regions (US, Europe, Asia). Learn global latency reduction, geo-DNS routing, regulatory compliance, and regional failure isolation.

### Learning Objectives
- Deploy stateless compute tiers in multiple worldwide cloud regions close to end users
- Use GeoDNS and Anycast IP routing to route users to the nearest healthy region
- Eliminate regional single points of failure (fail over entire region during major cloud outages)
- Adhere to data sovereignty regulations (GDPR data residency mandates)
- Synchronize state across regions using globally distributed databases or asynchronous replication

### Practical Challenge
Route user to closest region by calculating Euclidean distance to available region coordinates.`,
    starterCode: {
      javascript: `function findClosestRegion(userCoord, regions) {
  let closest = null;
  let minDist = Infinity;
  for (const r of regions) {
    const dist = Math.hypot(r.x - userCoord.x, r.y - userCoord.y);
    if (dist < minDist) {
      minDist = dist;
      closest = r.name;
    }
  }
  return closest;
}`,
      python: `import math

def find_closest_region(user_coord, regions):
    closest = None
    min_dist = float('inf')
    for r in regions:
        dist = math.hypot(r["x"] - user_coord["x"], r["y"] - user_coord["y"])
        if dist < min_dist:
            min_dist = dist
            closest = r["name"]
    return closest`
    },
    testCases: [
      { input: `{"x": 10, "y": 10}, [{"name": "us-east", "x": 12, "y": 12}, {"name": "eu-west", "x": 100, "y": 100}]`, expectedOutput: `"us-east"`, isHidden: false },
      { input: `{"x": 90, "y": 90}, [{"name": "us-east", "x": 10, "y": 10}, {"name": "eu-west", "x": 85, "y": 85}]`, expectedOutput: `"eu-west"`, isHidden: false }
    ],
    hints: ["Compute distance from userCoord to each region and return the region with minimum distance."]
  }
];
