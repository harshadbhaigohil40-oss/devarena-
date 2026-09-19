/**
 * TIER 1 — NODE.JS BASICS (15 Questions)
 */

module.exports = [
  {
    id: "nodejs-001",
    tier: 1,
    section: "Node.js Basics",
    topic: "Node.js Fundamentals",
    title: "Hello Node.js",
    difficulty: "Easy",
    pattern: "Node.js Fundamentals",
    description: "Write a Node.js program that prints \"Hello, World!\" to the console and returns the greeting string.",
    slug: "hello-nodejs",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Node.js Fundamentals"],
    xpReward: 50,
    starterCode: {
      javascript: `function helloNode() {\n  console.log("Hello, World!");\n  return "Hello, World!";\n}`,
      python: `def hello_node():\n    print("Hello, World!")\n    return "Hello, World!"`
    },
    testCases: [
      { input: `""`, expectedOutput: `"Hello, World!"`, isHidden: false },
      { input: `"test"`, expectedOutput: `"Hello, World!"`, isHidden: true }
    ],
    hints: ["Use console.log to output and return the string 'Hello, World!'."]
  },
  {
    id: "nodejs-002",
    tier: 1,
    section: "Node.js Basics",
    topic: "Node.js Basics",
    title: "Command Line Arguments",
    difficulty: "Easy",
    pattern: "process.argv",
    description: "Read a name from command line arguments (process.argv) and return a greeting in the format: 'Hello, <name>!'.",
    slug: "command-line-arguments",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "process.argv"],
    xpReward: 50,
    starterCode: {
      javascript: `function greetUser(name) {\n  // In CLI: argv argument\n  return \`Hello, \${name}!\`;\n}`,
      python: `def greet_user(name):\n    # In Python: sys.argv[1]\n    return f"Hello, {name}!"`
    },
    testCases: [
      { input: `"Alice"`, expectedOutput: `"Hello, Alice!"`, isHidden: false },
      { input: `"Bob"`, expectedOutput: `"Hello, Bob!"`, isHidden: false },
      { input: `"DevArena"`, expectedOutput: `"Hello, DevArena!"`, isHidden: true }
    ],
    hints: ["In Node.js, process.argv[0] is node, process.argv[1] is script path, and process.argv[2] is the first user argument."]
  },
  {
    id: "nodejs-003",
    tier: 1,
    section: "Node.js Basics",
    topic: "File System",
    title: "Read a File",
    difficulty: "Easy",
    pattern: "fs.readFile",
    description: "Simulate reading a file using fs.readFile utf-8. Given a string content representing a file buffer, trim any surrounding whitespace and return the text.",
    slug: "read-a-file",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "File System", "fs.readFile"],
    xpReward: 50,
    starterCode: {
      javascript: `function readFileContent(fileContent) {\n  // Your code here\n  return fileContent.trim();\n}`,
      python: `def read_file_content(file_content):\n    # Your code here\n    return file_content.strip()`
    },
    testCases: [
      { input: `"  Node.js File System  \\n"`, expectedOutput: `"Node.js File System"`, isHidden: false },
      { input: `"line1\\nline2"`, expectedOutput: `"line1\\nline2"`, isHidden: true }
    ],
    hints: ["fs.readFile(path, 'utf8', callback) returns the file content as a string."]
  },
  {
    id: "nodejs-004",
    tier: 1,
    section: "Node.js Basics",
    topic: "File System",
    title: "Write to a File",
    difficulty: "Easy",
    pattern: "fs.writeFile",
    description: "Simulate writing a string to a file destination. Return an object: { filename, bytesWritten, status: 'ok' }.",
    slug: "write-to-a-file",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "File System", "fs.writeFile"],
    xpReward: 50,
    starterCode: {
      javascript: `function writeToFile(filename, content) {\n  // Your code here\n  return {\n    filename,\n    bytesWritten: Buffer.byteLength(content, 'utf8'),\n    status: 'ok'\n  };\n}`,
      python: `def write_to_file(filename, content):\n    # Your code here\n    return {\n        "filename": filename,\n        "bytesWritten": len(content.encode('utf-8')),\n        "status": "ok"\n    }`
    },
    testCases: [
      { input: `"output.txt", "server started"`, expectedOutput: `{"filename":"output.txt","bytesWritten":14,"status":"ok"}`, isHidden: false },
      { input: `"data.json", "{}"`, expectedOutput: `{"filename":"data.json","bytesWritten":2,"status":"ok"}`, isHidden: true }
    ],
    hints: ["fs.writeFile asynchronously writes data to a file, replacing it if it already exists."]
  },
  {
    id: "nodejs-005",
    tier: 1,
    section: "Node.js Basics",
    topic: "File System",
    title: "Count Words in a File",
    difficulty: "Easy",
    pattern: "File Processing",
    description: "Read a text string and return the total number of words separated by whitespace (spaces, tabs, newlines).",
    slug: "count-words-in-a-file",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "File System", "File Processing"],
    xpReward: 50,
    starterCode: {
      javascript: `function countWords(text) {\n  // Your code here\n  const words = text.trim().split(/\\s+/).filter(Boolean);\n  return words.length;\n}`,
      python: `def count_words(text):\n    # Your code here\n    words = [w for w in text.strip().split() if w]\n    return len(words)`
    },
    testCases: [
      { input: `"The quick brown fox"`, expectedOutput: `4`, isHidden: false },
      { input: `"Hello \\n world\\t!"`, expectedOutput: `3`, isHidden: false },
      { input: `""`, expectedOutput: `0`, isHidden: true }
    ],
    hints: ["Split the string on whitespace regex /\\s+/ and filter out empty strings."]
  },
  {
    id: "nodejs-006",
    tier: 1,
    section: "Node.js Basics",
    topic: "Events",
    title: "Event Emitter",
    difficulty: "Easy",
    pattern: "EventEmitter",
    description: "Simulate a Node.js EventEmitter. Given a list of event objects `[{ event, data }]` and a target event name, return an array containing all payloads dispatched for that event.",
    slug: "node-event-emitter",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Events", "EventEmitter"],
    xpReward: 50,
    starterCode: {
      javascript: `function handleEventEmitter(events, targetEvent) {\n  // Your code here\n  return events.filter(e => e.event === targetEvent).map(e => e.data);\n}`,
      python: `def handle_event_emitter(events, target_event):\n    # Your code here\n    return [e["data"] for e in events if e.get("event") == target_event]`
    },
    testCases: [
      { input: `[{"event":"login","data":"user1"},{"event":"click","data":"btn"},{"event":"login","data":"user2"}], "login"`, expectedOutput: `["user1","user2"]`, isHidden: false },
      { input: `[{"event":"error","data":"err1"}], "success"`, expectedOutput: `[]`, isHidden: true }
    ],
    hints: ["In Node.js, const EventEmitter = require('events'); emitter.on(event, listener) attaches handlers."]
  },
  {
    id: "nodejs-007",
    tier: 1,
    section: "Node.js Basics",
    topic: "HTTP",
    title: "Create a Basic HTTP Server",
    difficulty: "Easy",
    pattern: "Node.js HTTP Module",
    description: "Create an HTTP request dispatcher that returns a response object with statusCode 200 and body 'Hello Server'.",
    slug: "create-a-basic-http-server",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "HTTP", "Node.js HTTP Module"],
    xpReward: 50,
    starterCode: {
      javascript: `function basicHttpServer(method, url) {\n  // Your code here\n  return { statusCode: 200, body: "Hello Server" };\n}`,
      python: `def basic_http_server(method, url):\n    # Your code here\n    return { "statusCode": 200, "body": "Hello Server" }`
    },
    testCases: [
      { input: `"GET", "/"`, expectedOutput: `{"statusCode":200,"body":"Hello Server"}`, isHidden: false },
      { input: `"POST", "/data"`, expectedOutput: `{"statusCode":200,"body":"Hello Server"}`, isHidden: true }
    ],
    hints: ["http.createServer((req, res) => { res.writeHead(200); res.end('Hello Server'); })"]
  },
  {
    id: "nodejs-008",
    tier: 1,
    section: "Node.js Basics",
    topic: "HTTP",
    title: "HTTP Route Handler",
    difficulty: "Easy",
    pattern: "Request Routing",
    description: "Create different responses for routes: '/' -> 'Home Page', '/about' -> 'About Us', '/contact' -> 'Contact Us', and any other route -> '404 Not Found'.",
    slug: "http-route-handler",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "HTTP", "Request Routing"],
    xpReward: 50,
    starterCode: {
      javascript: `function routeHandler(url) {\n  // Your code here\n  const routes = {\n    "/": "Home Page",\n    "/about": "About Us",\n    "/contact": "Contact Us"\n  };\n  return routes[url] || "404 Not Found";\n}`,
      python: `def route_handler(url):\n    # Your code here\n    routes = {\n        "/": "Home Page",\n        "/about": "About Us",\n        "/contact": "Contact Us"\n    }\n    return routes.get(url, "404 Not Found")`
    },
    testCases: [
      { input: `"/"`, expectedOutput: `"Home Page"`, isHidden: false },
      { input: `"/about"`, expectedOutput: `"About Us"`, isHidden: false },
      { input: `"/contact"`, expectedOutput: `"Contact Us"`, isHidden: false },
      { input: `"/unknown"`, expectedOutput: `"404 Not Found"`, isHidden: true }
    ],
    hints: ["Inspect req.url to route request to specific handlers."]
  },
  {
    id: "nodejs-009",
    tier: 1,
    section: "Node.js Basics",
    topic: "Asynchronous Programming",
    title: "Promise Basics",
    difficulty: "Easy",
    pattern: "Promise",
    description: "Simulate a Promise: given a boolean `shouldResolve` and a data value, return 'Resolved: <value>' if true, or 'Rejected: Error' if false.",
    slug: "promise-basics",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Asynchronous Programming", "Promise"],
    xpReward: 50,
    starterCode: {
      javascript: `function handlePromise(shouldResolve, value) {\n  // Your code here\n  if (shouldResolve) return \`Resolved: \${value}\`;\n  return "Rejected: Error";\n}`,
      python: `def handle_promise(should_resolve, value):\n    # Your code here\n    if should_resolve:\n        return f"Resolved: {value}"\n    return "Rejected: Error"`
    },
    testCases: [
      { input: `true, "Data Loaded"`, expectedOutput: `"Resolved: Data Loaded"`, isHidden: false },
      { input: `false, "Data Loaded"`, expectedOutput: `"Rejected: Error"`, isHidden: false }
    ],
    hints: ["Promises represent future completion with resolve() and reject()."]
  },
  {
    id: "nodejs-010",
    tier: 1,
    section: "Node.js Basics",
    topic: "Asynchronous Programming",
    title: "Async/Await",
    difficulty: "Easy",
    pattern: "async/await",
    description: "Write an async function simulator that takes an array of numbers and returns their total sum.",
    slug: "async-await-sum",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Asynchronous Programming", "async/await"],
    xpReward: 50,
    starterCode: {
      javascript: `function asyncSum(numbers) {\n  // Your code here\n  return numbers.reduce((acc, curr) => acc + curr, 0);\n}`,
      python: `def async_sum(numbers):\n    # Your code here\n    return sum(numbers)`
    },
    testCases: [
      { input: `[1, 2, 3, 4, 5]`, expectedOutput: `15`, isHidden: false },
      { input: `[10, -5, 20]`, expectedOutput: `25`, isHidden: true }
    ],
    hints: ["async/await allows asynchronous code to be written in a clean synchronous style."]
  },
  {
    id: "nodejs-011",
    tier: 1,
    section: "Node.js Basics",
    topic: "Error Handling",
    title: "Handle Async Errors",
    difficulty: "Medium",
    pattern: "try/catch + async/await",
    description: "Handle an error from an asynchronous function using try/catch. If JSON string is invalid, catch error and return `{ success: false, error: 'Invalid JSON' }`. Otherwise return `{ success: true, data }`.",
    slug: "handle-async-errors",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Error Handling", "try/catch"],
    xpReward: 100,
    starterCode: {
      javascript: `function parseAsyncJson(jsonString) {\n  try {\n    const data = JSON.parse(jsonString);\n    return { success: true, data };\n  } catch (err) {\n    return { success: false, error: "Invalid JSON" };\n  }\n}`,
      python: `def parse_async_json(json_string):\n    import json\n    try:\n        data = json.loads(json_string)\n        return { "success": True, "data": data }\n    except Exception:\n        return { "success": False, "error": "Invalid JSON" }`
    },
    testCases: [
      { input: `"{\\"user\\":\\"alex\\"}"`, expectedOutput: `{"success":true,"data":{"user":"alex"}}`, isHidden: false },
      { input: `"broken json"`, expectedOutput: `{"success":false,"error":"Invalid JSON"}`, isHidden: false }
    ],
    hints: ["Always wrap await calls in try/catch blocks to prevent unhandled promise rejections."]
  },
  {
    id: "nodejs-012",
    tier: 1,
    section: "Node.js Basics",
    topic: "Streams",
    title: "Stream Processing",
    difficulty: "Medium",
    pattern: "Node.js Streams",
    description: "Read a large payload represented as an array of chunk strings. Return the total byte count and concatenated string.",
    slug: "stream-processing",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Streams", "Node.js Streams"],
    xpReward: 100,
    starterCode: {
      javascript: `function processStream(chunks) {\n  // Your code here\n  const fullText = chunks.join("");\n  return {\n    totalBytes: fullText.length,\n    content: fullText\n  };\n}`,
      python: `def process_stream(chunks):\n    # Your code here\n    full_text = "".join(chunks)\n    return {\n        "totalBytes": len(full_text),\n        "content": full_text\n    }`
    },
    testCases: [
      { input: `["chunk1_", "chunk2_", "chunk3"]`, expectedOutput: `{"totalBytes":21,"content":"chunk1_chunk2_chunk3"}`, isHidden: false },
      { input: `["a", "b", "c"]`, expectedOutput: `{"totalBytes":3,"content":"abc"}`, isHidden: true }
    ],
    hints: ["Streams break data into chunks, emitting 'data', 'end', and 'error' events."]
  },
  {
    id: "nodejs-013",
    tier: 1,
    section: "Node.js Basics",
    topic: "Modules",
    title: "Create a Custom Module",
    difficulty: "Easy",
    pattern: "CommonJS / ES Modules",
    description: "Simulate a reusable math module that exports 'add', 'subtract', 'multiply', and 'divide'. Given operation name and two operands, invoke method and return result.",
    slug: "create-a-custom-module",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "Modules", "CommonJS / ES Modules"],
    xpReward: 50,
    starterCode: {
      javascript: `function mathModule(operation, a, b) {\n  const ops = {\n    add: (x, y) => x + y,\n    subtract: (x, y) => x - y,\n    multiply: (x, y) => x * y,\n    divide: (x, y) => x / y\n  };\n  return ops[operation] ? ops[operation](a, b) : null;\n}`,
      python: `def math_module(operation, a, b):\n    ops = {\n        "add": lambda x, y: x + y,\n        "subtract": lambda x, y: x - y,\n        "multiply": lambda x, y: x * y,\n        "divide": lambda x, y: x / y\n    }\n    return ops[operation](a, b) if operation in ops else None`
    },
    testCases: [
      { input: `"add", 5, 3`, expectedOutput: `8`, isHidden: false },
      { input: `"multiply", 4, 7`, expectedOutput: `28`, isHidden: false },
      { input: `"divide", 10, 2`, expectedOutput: `5`, isHidden: true }
    ],
    hints: ["Use module.exports = { ... } in CommonJS or export const in ES Modules."]
  },
  {
    id: "nodejs-014",
    tier: 1,
    section: "Node.js Basics",
    topic: "npm",
    title: "npm Package Usage",
    difficulty: "Easy",
    pattern: "Package Management",
    description: "Given a package.json dependencies object and a required package name, verify if package is installed.",
    slug: "npm-package-usage",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "npm", "Package Management"],
    xpReward: 50,
    starterCode: {
      javascript: `function checkPackageInstalled(dependencies, packageName) {\n  // Your code here\n  return Boolean(dependencies && dependencies[packageName]);\n}`,
      python: `def check_package_installed(dependencies, package_name):\n    # Your code here\n    return bool(dependencies and package_name in dependencies)`
    },
    testCases: [
      { input: `{"express":"^4.18.2","lodash":"^4.17.21"}, "express"`, expectedOutput: `true`, isHidden: false },
      { input: `{"express":"^4.18.2"}, "axios"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Check if key exists in dependencies object of package.json."]
  },
  {
    id: "nodejs-015",
    tier: 1,
    section: "Node.js Basics",
    topic: "Node.js",
    title: "Build a Mini CLI",
    difficulty: "Medium",
    pattern: "CLI Application",
    description: "Create a CLI parser that accepts arguments like `['--port', '3000', '--env', 'production', '--verbose']` and returns a parsed key-value options dictionary.",
    slug: "build-a-mini-cli",
    category: "backend",
    tags: ["be-node", "nodejs-basics", "CLI Application"],
    xpReward: 100,
    starterCode: {
      javascript: `function parseCli(args) {\n  const result = {};\n  for (let i = 0; i < args.length; i++) {\n    if (args[i].startsWith('--')) {\n      const key = args[i].slice(2);\n      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {\n        result[key] = args[i + 1];\n        i++;\n      } else {\n        result[key] = true;\n      }\n    }\n  }\n  return result;\n}`,
      python: `def parse_cli(args):\n    result = {}\n    i = 0\n    while i < len(args):\n        if args[i].startswith('--'):\n            key = args[i][2:]\n            if i + 1 < len(args) and not args[i + 1].startswith('--'):\n                result[key] = args[i + 1]\n                i += 1\n            else:\n                result[key] = True\n        i += 1\n    return result`
    },
    testCases: [
      { input: `["--port", "3000", "--env", "production", "--verbose"]`, expectedOutput: `{"port":"3000","env":"production","verbose":true}`, isHidden: false },
      { input: `["--debug"]`, expectedOutput: `{"debug":true}`, isHidden: true }
    ],
    hints: ["Iterate through args: flags with values take the next token, boolean flags default to true."]
  }
];
