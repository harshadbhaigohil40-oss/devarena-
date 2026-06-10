const skillTrees = [
  {
    name: 'Algorithm Mastery',
    description: 'Master fundamental algorithms from basics to advanced',
    icon: '🧮',
    color: '#6c5ce7',
    nodes: [
      { nodeId: 'algo-basics', title: 'Algorithm Basics', description: 'Arrays, strings, and basic loops', xpRequired: 0, position: { x: 250, y: 50 }, connections: ['algo-search', 'algo-sort'], tier: 1 },
      { nodeId: 'algo-search', title: 'Searching', description: 'Binary search, linear search', xpRequired: 100, position: { x: 150, y: 150 }, connections: ['algo-recursion'], tier: 2 },
      { nodeId: 'algo-sort', title: 'Sorting', description: 'Quick sort, merge sort, bubble sort', xpRequired: 100, position: { x: 350, y: 150 }, connections: ['algo-recursion'], tier: 2 },
      { nodeId: 'algo-recursion', title: 'Recursion', description: 'Recursive thinking and backtracking', xpRequired: 200, position: { x: 250, y: 250 }, connections: ['algo-dp', 'algo-graphs'], tier: 3 },
      { nodeId: 'algo-dp', title: 'Dynamic Programming', description: 'Memoization and tabulation', xpRequired: 400, position: { x: 150, y: 350 }, connections: ['algo-master'], tier: 4 },
      { nodeId: 'algo-graphs', title: 'Graph Algorithms', description: 'BFS, DFS, shortest path', xpRequired: 400, position: { x: 350, y: 350 }, connections: ['algo-master'], tier: 4 },
      { nodeId: 'algo-master', title: 'Algorithm Expert', description: 'Advanced problem-solving', xpRequired: 800, position: { x: 250, y: 450 }, connections: [], tier: 5 },
    ],
  },
  {
    name: 'Frontend Engineering',
    description: 'Build modern user interfaces and web applications',
    icon: '🎨',
    color: '#00cec9',
    nodes: [
      { nodeId: 'fe-html', title: 'HTML & CSS', description: 'Semantic HTML and modern CSS', xpRequired: 0, position: { x: 250, y: 50 }, connections: ['fe-js', 'fe-responsive'], tier: 1 },
      { nodeId: 'fe-js', title: 'JavaScript', description: 'ES6+, DOM manipulation', xpRequired: 100, position: { x: 150, y: 150 }, connections: ['fe-react'], tier: 2 },
      { nodeId: 'fe-responsive', title: 'Responsive Design', description: 'Flexbox, Grid, media queries', xpRequired: 100, position: { x: 350, y: 150 }, connections: ['fe-react'], tier: 2 },
      { nodeId: 'fe-react', title: 'React', description: 'Components, hooks, state management', xpRequired: 200, position: { x: 250, y: 250 }, connections: ['fe-advanced', 'fe-testing'], tier: 3 },
      { nodeId: 'fe-advanced', title: 'Advanced React', description: 'Performance, patterns, SSR', xpRequired: 400, position: { x: 150, y: 350 }, connections: ['fe-master'], tier: 4 },
      { nodeId: 'fe-testing', title: 'Testing', description: 'Jest, React Testing Library', xpRequired: 400, position: { x: 350, y: 350 }, connections: ['fe-master'], tier: 4 },
      { nodeId: 'fe-master', title: 'Frontend Expert', description: 'Full-stack frontend mastery', xpRequired: 800, position: { x: 250, y: 450 }, connections: [], tier: 5 },
    ],
  },
  {
    name: 'Backend Engineering',
    description: 'Build scalable server-side applications and APIs',
    icon: '⚙️',
    color: '#00b894',
    nodes: [
      { nodeId: 'be-node', title: 'Node.js Basics', description: 'Event loop, modules, npm', xpRequired: 0, position: { x: 250, y: 50 }, connections: ['be-express', 'be-db'], tier: 1 },
      { nodeId: 'be-express', title: 'Express.js', description: 'REST APIs, middleware, routing', xpRequired: 100, position: { x: 150, y: 150 }, connections: ['be-auth'], tier: 2 },
      { nodeId: 'be-db', title: 'Databases', description: 'MongoDB, SQL, ORMs', xpRequired: 100, position: { x: 350, y: 150 }, connections: ['be-auth'], tier: 2 },
      { nodeId: 'be-auth', title: 'Authentication', description: 'JWT, OAuth, sessions', xpRequired: 200, position: { x: 250, y: 250 }, connections: ['be-scale', 'be-realtime'], tier: 3 },
      { nodeId: 'be-scale', title: 'Scaling', description: 'Caching, load balancing, queues', xpRequired: 400, position: { x: 150, y: 350 }, connections: ['be-master'], tier: 4 },
      { nodeId: 'be-realtime', title: 'Real-time', description: 'WebSockets, SSE, pub/sub', xpRequired: 400, position: { x: 350, y: 350 }, connections: ['be-master'], tier: 4 },
      { nodeId: 'be-master', title: 'Backend Expert', description: 'Production-grade systems', xpRequired: 800, position: { x: 250, y: 450 }, connections: [], tier: 5 },
    ],
  },
  {
    name: 'System Design',
    description: 'Design large-scale distributed systems',
    icon: '🏗️',
    color: '#fdcb6e',
    nodes: [
      { nodeId: 'sd-basics', title: 'Fundamentals', description: 'CAP theorem, load balancing', xpRequired: 0, position: { x: 250, y: 50 }, connections: ['sd-storage', 'sd-compute'], tier: 1 },
      { nodeId: 'sd-storage', title: 'Storage Systems', description: 'Databases, caching, CDNs', xpRequired: 200, position: { x: 150, y: 150 }, connections: ['sd-distributed'], tier: 2 },
      { nodeId: 'sd-compute', title: 'Compute', description: 'Microservices, serverless', xpRequired: 200, position: { x: 350, y: 150 }, connections: ['sd-distributed'], tier: 2 },
      { nodeId: 'sd-distributed', title: 'Distributed Systems', description: 'Consensus, replication', xpRequired: 400, position: { x: 250, y: 250 }, connections: ['sd-interview', 'sd-cloud'], tier: 3 },
      { nodeId: 'sd-interview', title: 'Interview Prep', description: 'Common system design problems', xpRequired: 600, position: { x: 150, y: 350 }, connections: ['sd-master'], tier: 4 },
      { nodeId: 'sd-cloud', title: 'Cloud Architecture', description: 'AWS, GCP, Azure patterns', xpRequired: 600, position: { x: 350, y: 350 }, connections: ['sd-master'], tier: 4 },
      { nodeId: 'sd-master', title: 'Architect', description: 'System design mastery', xpRequired: 1000, position: { x: 250, y: 450 }, connections: [], tier: 5 },
    ],
  },
];

module.exports = skillTrees;
