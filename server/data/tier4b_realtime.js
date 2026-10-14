/**
 * TIER 4B — REAL-TIME (10 Questions)
 */

module.exports = [
  {
    id: "realtime-001",
    tier: 4,
    section: "Real-time",
    topic: "WebSockets",
    title: "WebSocket Connection",
    difficulty: "Easy",
    pattern: "Real-time Communication",
    description: "Manage client connections: register a new socketId into the active pool and return `{ connected: true, totalClients, socketId }`.",
    slug: "websocket-connection",
    category: "backend",
    tags: ["be-realtime", "real-time", "WebSockets", "Real-time Communication"],
    xpReward: 50,
    starterCode: {
      javascript: `function connectSocket(pool, socketId) {\n  const updated = [...pool, socketId];\n  return { connected: true, totalClients: updated.length, socketId };\n}`,
      python: `def connect_socket(pool, socket_id):\n    updated = pool + [socket_id]\n    return { "connected": True, "totalClients": len(updated), "socketId": socket_id }`
    },
    testCases: [
      { input: `["s1","s2"], "s3"`, expectedOutput: `{"connected":true,"totalClients":3,"socketId":"s3"}`, isHidden: false }
    ],
    hints: ["WebSockets provide full-duplex communication over a single TCP connection."]
  },
  {
    id: "realtime-002",
    tier: 4,
    section: "Real-time",
    topic: "WebSockets",
    title: "Real-time Chat",
    difficulty: "Medium",
    pattern: "WebSocket",
    description: "Route a direct chat message from sender to recipient: check if recipient is online in userSockets map.",
    slug: "real-time-chat",
    category: "backend",
    tags: ["be-realtime", "real-time", "WebSockets"],
    xpReward: 100,
    starterCode: {
      javascript: `function sendDirectMessage(userSockets, sender, recipient, message) {\n  if (!userSockets[recipient]) return { delivered: false, status: 'offline' };\n  return { delivered: true, recipient, message, from: sender };\n}`,
      python: `def send_direct_message(user_sockets, sender, recipient, message):\n    if recipient not in user_sockets:\n        return { "delivered": False, "status": "offline" }\n    return { "delivered": True, "recipient": recipient, "message": message, "from": sender }`
    },
    testCases: [
      { input: `{"alice":"s1","bob":"s2"}, "alice", "bob", "Hello!"`, expectedOutput: `{"delivered":true,"recipient":"bob","message":"Hello!","from":"alice"}`, isHidden: false },
      { input: `{"alice":"s1"}, "alice", "charlie", "Hi"`, expectedOutput: `{"delivered":false,"status":"offline"}`, isHidden: false }
    ],
    hints: ["Direct messaging matches recipient IDs to active socket connections."]
  },
  {
    id: "realtime-003",
    tier: 4,
    section: "Real-time",
    topic: "WebSockets",
    title: "Chat Rooms",
    difficulty: "Medium",
    pattern: "Rooms",
    description: "Manage room memberships: handle 'JOIN' and 'LEAVE' commands for a given room and socket ID.",
    slug: "chat-rooms",
    category: "backend",
    tags: ["be-realtime", "real-time", "WebSockets", "Rooms"],
    xpReward: 100,
    starterCode: {
      javascript: `function handleRoom(roomMembers, action, socketId) {\n  if (action === 'JOIN') {\n    return roomMembers.includes(socketId) ? roomMembers : [...roomMembers, socketId];\n  }\n  if (action === 'LEAVE') {\n    return roomMembers.filter(s => s !== socketId);\n  }\n  return roomMembers;\n}`,
      python: `def handle_room(room_members, action, socket_id):\n    if action == 'JOIN':\n        return room_members if socket_id in room_members else room_members + [socket_id]\n    if action == 'LEAVE':\n        return [s for s in room_members if s != socket_id]\n    return room_members`
    },
    testCases: [
      { input: `["s1"], "JOIN", "s2"`, expectedOutput: `["s1","s2"]`, isHidden: false },
      { input: `["s1","s2"], "LEAVE", "s1"`, expectedOutput: `["s2"]`, isHidden: false }
    ],
    hints: ["Rooms segment message distribution to subscribers of specific channels."]
  },
  {
    id: "realtime-004",
    tier: 4,
    section: "Real-time",
    topic: "WebSockets",
    title: "Broadcast Messages",
    difficulty: "Medium",
    pattern: "Broadcasting",
    description: "Broadcast a message to all sockets in a room except the sender socket.",
    slug: "broadcast-messages",
    category: "backend",
    tags: ["be-realtime", "real-time", "WebSockets", "Broadcasting"],
    xpReward: 100,
    starterCode: {
      javascript: `function broadcast(roomSockets, senderSocket, message) {\n  const recipients = roomSockets.filter(s => s !== senderSocket);\n  return { recipients, message };\n}`,
      python: `def broadcast(room_sockets, sender_socket, message):\n    recipients = [s for s in room_sockets if s != sender_socket]\n    return { "recipients": recipients, "message": message }`
    },
    testCases: [
      { input: `["s1","s2","s3"], "s1", "Hello room"`, expectedOutput: `{"recipients":["s2","s3"],"message":"Hello room"}`, isHidden: false }
    ],
    hints: ["socket.broadcast.emit sends message to all other connected sockets."]
  },
  {
    id: "realtime-005",
    tier: 4,
    section: "Real-time",
    topic: "Real-time",
    title: "Online User Presence",
    difficulty: "Medium",
    pattern: "Connection Tracking",
    description: "Determine online/offline presence: users with `lastHeartbeat >= currentTime - timeout` are online, others offline.",
    slug: "online-user-presence",
    category: "backend",
    tags: ["be-realtime", "real-time", "Connection Tracking"],
    xpReward: 100,
    starterCode: {
      javascript: `function checkPresence(usersMap, currentTime, timeout) {\n  const online = [];\n  const offline = [];\n  for (const [userId, lastHeartbeat] of Object.entries(usersMap)) {\n    if (lastHeartbeat >= currentTime - timeout) online.push(userId);\n    else offline.push(userId);\n  }\n  return { online, offline };\n}`,
      python: `def check_presence(users_map, current_time, timeout):\n    online = []\n    offline = []\n    for u, hb in users_map.items():\n        if hb >= current_time - timeout:\n            online.append(u)\n        else:\n            offline.append(u)\n    return { "online": online, "offline": offline }`
    },
    testCases: [
      { input: `{"u1":1000,"u2":900}, 1000, 60`, expectedOutput: `{"online":["u1"],"offline":["u2"]}`, isHidden: false }
    ],
    hints: ["Periodic heartbeat pings maintain presence status and clean up dead sockets."]
  },
  {
    id: "realtime-006",
    tier: 4,
    section: "Real-time",
    topic: "Real-time",
    title: "Typing Indicator",
    difficulty: "Easy",
    pattern: "Events",
    description: "Manage typing indicator state: handle typing START and STOP events for a chat room.",
    slug: "typing-indicator",
    category: "backend",
    tags: ["be-realtime", "real-time", "Events"],
    xpReward: 50,
    starterCode: {
      javascript: `function updateTyping(currentTyping, userId, isTyping) {\n  const set = new Set(currentTyping);\n  if (isTyping) set.add(userId);\n  else set.delete(userId);\n  return Array.from(set);\n}`,
      python: `def update_typing(current_typing, user_id, is_typing):\n    s = set(current_typing)\n    if is_typing: s.add(user_id)\n    else: s.discard(user_id)\n    return list(s)`
    },
    testCases: [
      { input: `["u1"], "u2", true`, expectedOutput: `["u1","u2"]`, isHidden: false },
      { input: `["u1","u2"], "u1", false`, expectedOutput: `["u2"]`, isHidden: false }
    ],
    hints: ["Debouncing typing events avoids flooding server network traffic."]
  },
  {
    id: "realtime-007",
    tier: 4,
    section: "Real-time",
    topic: "Real-time",
    title: "Real-time Notifications",
    difficulty: "Medium",
    pattern: "Event-Based Notifications",
    description: "Filter subscribers interested in a specific event type (e.g. 'order_created') and return their notification channels.",
    slug: "real-time-notifications",
    category: "backend",
    tags: ["be-realtime", "real-time", "Event-Based Notifications"],
    xpReward: 100,
    starterCode: {
      javascript: `function getNotificationRecipients(subscribers, eventType) {\n  return subscribers.filter(s => s.topics.includes(eventType)).map(s => s.userId);\n}`,
      python: `def get_notification_recipients(subscribers, event_type):\n    return [s['userId'] for s in subscribers if event_type in s.get('topics', [])]`
    },
    testCases: [
      { input: `[{"userId":1,"topics":["order","comment"]},{"userId":2,"topics":["comment"]}], "order"`, expectedOutput: `[1]`, isHidden: false }
    ],
    hints: ["Publish-subscribe event routing ensures users receive only notifications they care about."]
  },
  {
    id: "realtime-008",
    tier: 4,
    section: "Real-time",
    topic: "Real-time",
    title: "Server-Sent Events",
    difficulty: "Medium",
    pattern: "SSE",
    description: "Format a Server-Sent Events (SSE) message chunk with optional id, event, and data lines.",
    slug: "server-sent-events",
    category: "backend",
    tags: ["be-realtime", "real-time", "SSE"],
    xpReward: 100,
    starterCode: {
      javascript: `function formatSSE(id, event, data) {\n  return \`id: \${id}\\nevent: \${event}\\ndata: \${data}\\n\\n\`;\n}`,
      python: `def format_sse(id, event, data):\n    return f"id: {id}\\nevent: {event}\\ndata: {data}\\n\\n"`
    },
    testCases: [
      { input: `"1", "price", "100"`, expectedOutput: `"id: 1\\nevent: price\\ndata: 100\\n\\n"`, isHidden: false }
    ],
    hints: ["SSE provides unidirectional server-to-client streaming over standard HTTP text/event-stream."]
  },
  {
    id: "realtime-009",
    tier: 4,
    section: "Real-time",
    topic: "Real-time",
    title: "Redis Pub/Sub",
    difficulty: "Hard",
    pattern: "Pub/Sub",
    description: "Simulate publishing a message to a channel: return list of server nodes subscribed to that channel.",
    slug: "redis-pub-sub",
    category: "backend",
    tags: ["be-realtime", "real-time", "Pub/Sub"],
    xpReward: 200,
    starterCode: {
      javascript: `function publishMessage(subscriptions, channel, message) {\n  const nodes = subscriptions[channel] || [];\n  return { deliveredTo: nodes, message };\n}`,
      python: `def publish_message(subscriptions, channel, message):\n    nodes = subscriptions.get(channel, [])\n    return { "deliveredTo": nodes, "message": message }`
    },
    testCases: [
      { input: `{"chat:1":["srvA","srvB"],"news":["srvC"]}, "chat:1", "New chat"`, expectedOutput: `{"deliveredTo":["srvA","srvB"],"message":"New chat"}`, isHidden: false }
    ],
    hints: ["Redis Pub/Sub distributes messages across multiple independent backend server instances."]
  },
  {
    id: "realtime-010",
    tier: 4,
    section: "Real-time",
    topic: "Real-time / Scaling",
    title: "Scalable WebSockets",
    difficulty: "Hard",
    pattern: "WebSocket + Pub/Sub",
    description: "Determine whether to emit locally or publish via broker: if recipient is on this server node, emit locally; else publish to message broker.",
    slug: "scalable-websockets",
    category: "backend",
    tags: ["be-realtime", "real-time", "WebSocket + Pub/Sub"],
    xpReward: 200,
    starterCode: {
      javascript: `function routeWebSocketMessage(localSockets, recipientId, message) {\n  if (localSockets.includes(recipientId)) {\n    return { action: 'LOCAL_EMIT', recipientId, message };\n  }\n  return { action: 'PUBLISH_BROKER', recipientId, message };\n}`,
      python: `def route_web_socket_message(local_sockets, recipient_id, message):\n    if recipient_id in local_sockets:\n        return { "action": "LOCAL_EMIT", "recipientId": recipient_id, "message": message }\n    return { "action": "PUBLISH_BROKER", "recipientId": recipient_id, "message": message }`
    },
    testCases: [
      { input: `["u1","u2"], "u1", "Hi"`, expectedOutput: `{"action":"LOCAL_EMIT","recipientId":"u1","message":"Hi"}`, isHidden: false },
      { input: `["u1","u2"], "u99", "Hi"`, expectedOutput: `{"action":"PUBLISH_BROKER","recipientId":"u99","message":"Hi"}`, isHidden: false }
    ],
    hints: ["Socket.io Redis adapter automatically publishes messages across multiple cluster nodes."]
  }
];
