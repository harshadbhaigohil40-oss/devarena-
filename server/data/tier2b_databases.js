/**
 * TIER 2B — DATABASES (15 Questions)
 */

module.exports = [
  {
    id: "db-002",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "Insert User Records",
    difficulty: "Easy",
    pattern: "INSERT",
    description: "Given an array of user objects `[{ name, email }]`, generate a parameterized SQL INSERT statement and flat values array.",
    slug: "insert-user-records",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "INSERT"],
    xpReward: 50,
    starterCode: {
      javascript: `function buildInsertSQL(users) {\n  const placeholders = users.map((_, i) => \`($\${i * 2 + 1}, $\${i * 2 + 2})\`).join(', ');\n  const query = \`INSERT INTO users (name, email) VALUES \${placeholders};\`;\n  const values = users.flatMap(u => [u.name, u.email]);\n  return { query, values };\n}`,
      python: `def build_insert_sql(users):\n    placeholders = ", ".join(f"(\${i*2+1}, \${i*2+2})" for i in range(len(users)))\n    query = f"INSERT INTO users (name, email) VALUES {placeholders};"\n    values = []\n    for u in users:\n        values.extend([u['name'], u['email']])\n    return { "query": query, "values": values }`
    },
    testCases: [
      { input: `[{"name":"Alice","email":"alice@dev.com"},{"name":"Bob","email":"bob@dev.com"}]`, expectedOutput: `{"query":"INSERT INTO users (name, email) VALUES ($1, $2), ($3, $4);","values":["Alice","alice@dev.com","Bob","bob@dev.com"]}`, isHidden: false }
    ],
    hints: ["Always use parameterized queries to prevent SQL injection vulnerabilities."]
  },
  {
    id: "db-003",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "Query Users",
    difficulty: "Easy",
    pattern: "SELECT",
    description: "Simulate `SELECT * FROM users WHERE active = true AND age >= minAge` on a users list.",
    slug: "query-users",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "SELECT"],
    xpReward: 50,
    starterCode: {
      javascript: `function queryUsers(users, minAge) {\n  return users.filter(u => u.active === true && u.age >= minAge);\n}`,
      python: `def query_users(users, min_age):\n    return [u for u in users if u.get('active') is True and u.get('age', 0) >= min_age]`
    },
    testCases: [
      { input: `[{"name":"A","active":true,"age":25},{"name":"B","active":false,"age":30},{"name":"C","active":true,"age":18}], 21`, expectedOutput: `[{"name":"A","active":true,"age":25}]`, isHidden: false }
    ],
    hints: ["WHERE clause filters rows based on conditional predicates."]
  },
  {
    id: "db-004",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "Update User",
    difficulty: "Easy",
    pattern: "UPDATE",
    description: "Simulate `UPDATE users SET email = newEmail WHERE id = targetId`. Return updated user or null.",
    slug: "update-user",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "UPDATE"],
    xpReward: 50,
    starterCode: {
      javascript: `function updateUser(users, targetId, newEmail) {\n  const user = users.find(u => u.id === targetId);\n  if (!user) return null;\n  return { ...user, email: newEmail };\n}`,
      python: `def update_user(users, target_id, new_email):\n    for u in users:\n        if u.get('id') == target_id:\n            updated = dict(u)\n            updated['email'] = new_email\n            return updated\n    return None`
    },
    testCases: [
      { input: `[{"id":1,"name":"Alice","email":"old@dev.com"}], 1, "new@dev.com"`, expectedOutput: `{"id":1,"name":"Alice","email":"new@dev.com"}`, isHidden: false },
      { input: `[{"id":1,"name":"Alice"}], 99, "new@dev.com"`, expectedOutput: `null`, isHidden: true }
    ],
    hints: ["UPDATE updates existing columns matching the WHERE condition."]
  },
  {
    id: "db-005",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "Delete User",
    difficulty: "Easy",
    pattern: "DELETE",
    description: "Simulate `DELETE FROM users WHERE id = targetId`. Return `{ deletedCount, remainingUsers }`.",
    slug: "delete-user",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "DELETE"],
    xpReward: 50,
    starterCode: {
      javascript: `function deleteUser(users, targetId) {\n  const remainingUsers = users.filter(u => u.id !== targetId);\n  return {\n    deletedCount: users.length - remainingUsers.length,\n    remainingUsers\n  };\n}`,
      python: `def delete_user(users, target_id):\n    remaining = [u for u in users if u.get('id') != target_id]\n    return {\n        "deletedCount": len(users) - len(remaining),\n        "remainingUsers": remaining\n    }`
    },
    testCases: [
      { input: `[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}], 1`, expectedOutput: `{"deletedCount":1,"remainingUsers":[{"id":2,"name":"Bob"}]}`, isHidden: false }
    ],
    hints: ["DELETE removes rows; always use a WHERE clause to avoid deleting all records."]
  },
  {
    id: "db-006",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "SQL JOIN",
    difficulty: "Medium",
    pattern: "INNER JOIN",
    description: "Perform an INNER JOIN between users `[{ id, name }]` and orders `[{ id, userId, total }]`. Return merged records `{ orderId, userName, total }`.",
    slug: "sql-join",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "INNER JOIN"],
    xpReward: 100,
    starterCode: {
      javascript: `function innerJoin(users, orders) {\n  const userMap = new Map(users.map(u => [u.id, u.name]));\n  return orders\n    .filter(o => userMap.has(o.userId))\n    .map(o => ({\n      orderId: o.id,\n      userName: userMap.get(o.userId),\n      total: o.total\n    }));\n}`,
      python: `def inner_join(users, orders):\n    user_map = {u['id']: u['name'] for u in users}\n    return [\n        {\n            "orderId": o['id'],\n            "userName": user_map[o['userId']],\n            "total": o['total']\n        }\n        for o in orders if o.get('userId') in user_map\n    ]`
    },
    testCases: [
      { input: `[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}], [{"id":101,"userId":1,"total":50},{"id":102,"userId":1,"total":80}]`, expectedOutput: `[{"orderId":101,"userName":"Alice","total":50},{"orderId":102,"userName":"Alice","total":80}]`, isHidden: false }
    ],
    hints: ["INNER JOIN returns rows when there is a match in both tables on the join condition."]
  },
  {
    id: "db-007",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "GROUP BY",
    difficulty: "Medium",
    pattern: "Aggregation",
    description: "Simulate `SELECT userId, COUNT(*) as orderCount FROM orders GROUP BY userId`. Return map of user IDs to order counts.",
    slug: "group-by",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "Aggregation"],
    xpReward: 100,
    starterCode: {
      javascript: `function countOrdersByUser(orders) {\n  const counts = {};\n  orders.forEach(o => {\n    counts[o.userId] = (counts[o.userId] || 0) + 1;\n  });\n  return counts;\n}`,
      python: `def count_orders_by_user(orders):\n    counts = {}\n    for o in orders:\n        u_id = str(o['userId'])\n        counts[u_id] = counts.get(u_id, 0) + 1\n    return {int(k): v for k, v in counts.items()}`
    },
    testCases: [
      { input: `[{"userId":1},{"userId":2},{"userId":1},{"userId":1}]`, expectedOutput: `{"1":3,"2":1}`, isHidden: false },
      { input: `[{"userId":5}]`, expectedOutput: `{"5":1}`, isHidden: true }
    ],
    hints: ["GROUP BY groups rows sharing a property so aggregate functions (COUNT, SUM) can apply."]
  },
  {
    id: "db-008",
    tier: 2,
    section: "Databases",
    topic: "SQL",
    title: "Find Duplicate Emails",
    difficulty: "Easy",
    pattern: "GROUP BY / HAVING",
    description: "Given an array of emails, return a list of duplicate emails that appear more than once (similar to HAVING COUNT(*) > 1).",
    slug: "find-duplicate-emails",
    category: "backend",
    tags: ["be-db", "databases", "SQL", "GROUP BY / HAVING"],
    xpReward: 50,
    starterCode: {
      javascript: `function findDuplicates(emails) {\n  const freq = {};\n  emails.forEach(e => freq[e] = (freq[e] || 0) + 1);\n  return Object.keys(freq).filter(e => freq[e] > 1);\n}`,
      python: `def find_duplicates(emails):\n    from collections import Counter\n    c = Counter(emails)\n    return [k for k, v in c.items() if v > 1]`
    },
    testCases: [
      { input: `["a@b.com", "c@d.com", "a@b.com", "e@f.com", "c@d.com"]`, expectedOutput: `["a@b.com","c@d.com"]`, isHidden: false },
      { input: `["unique@x.com"]`, expectedOutput: `[]`, isHidden: true }
    ],
    hints: ["HAVING filters groups created by GROUP BY based on aggregated conditions."]
  },
  {
    id: "db-009",
    tier: 2,
    section: "Databases",
    topic: "Database Optimization",
    title: "Database Index",
    difficulty: "Medium",
    pattern: "Indexing",
    description: "Build an in-memory hash index on a specified column of an array of objects, enabling O(1) row lookups by key.",
    slug: "database-index",
    category: "backend",
    tags: ["be-db", "databases", "Database Optimization", "Indexing"],
    xpReward: 100,
    starterCode: {
      javascript: `function indexLookup(records, indexField, queryValue) {\n  const index = new Map(records.map(r => [r[indexField], r]));\n  return index.get(queryValue) || null;\n}`,
      python: `def index_lookup(records, index_field, query_value):\n    idx = {r[index_field]: r for r in records if index_field in r}\n    return idx.get(query_value)`
    },
    testCases: [
      { input: `[{"id":101,"name":"Alice"},{"id":102,"name":"Bob"}], "id", 102`, expectedOutput: `{"id":102,"name":"Bob"}`, isHidden: false },
      { input: `[{"id":101,"name":"Alice"}], "id", 999`, expectedOutput: `null`, isHidden: true }
    ],
    hints: ["Indexes speed up SELECT queries at the cost of slower INSERT/UPDATE and extra storage."]
  },
  {
    id: "db-010",
    tier: 2,
    section: "Databases",
    topic: "Database",
    title: "Transaction",
    difficulty: "Medium",
    pattern: "ACID Transaction",
    description: "Simulate an ACID transfer transaction: debit sender and credit recipient. If sender balance < amount, roll back both balances and return error.",
    slug: "database-transaction",
    category: "backend",
    tags: ["be-db", "databases", "Database", "ACID Transaction"],
    xpReward: 100,
    starterCode: {
      javascript: `function transferFunds(sender, recipient, amount) {\n  if (sender.balance < amount) {\n    return { success: false, error: 'Insufficient funds' };\n  }\n  return {\n    success: true,\n    senderBalance: sender.balance - amount,\n    recipientBalance: recipient.balance + amount\n  };\n}`,
      python: `def transfer_funds(sender, recipient, amount):\n    if sender['balance'] < amount:\n        return { "success": False, "error": "Insufficient funds" }\n    return {\n        "success": True,\n        "senderBalance": sender['balance'] - amount,\n        "recipientBalance": recipient['balance'] + amount\n    }`
    },
    testCases: [
      { input: `{"name":"A","balance":100}, {"name":"B","balance":50}, 40`, expectedOutput: `{"success":true,"senderBalance":60,"recipientBalance":90}`, isHidden: false },
      { input: `{"name":"A","balance":30}, {"name":"B","balance":50}, 40`, expectedOutput: `{"success":false,"error":"Insufficient funds"}`, isHidden: false }
    ],
    hints: ["Transactions provide Atomicity, Consistency, Isolation, and Durability (ACID)."]
  },
  {
    id: "db-011",
    tier: 2,
    section: "Databases",
    topic: "MongoDB",
    title: "MongoDB CRUD",
    difficulty: "Easy",
    pattern: "CRUD",
    description: "Simulate MongoDB collection operations: implement `find({ role })` on an array of documents.",
    slug: "mongodb-crud",
    category: "backend",
    tags: ["be-db", "databases", "MongoDB", "CRUD"],
    xpReward: 50,
    starterCode: {
      javascript: `function mongoFindRole(docs, targetRole) {\n  return docs.filter(d => d.role === targetRole);\n}`,
      python: `def mongo_find_role(docs, target_role):\n    return [d for d in docs if d.get('role') == target_role]`
    },
    testCases: [
      { input: `[{"id":1,"role":"admin"},{"id":2,"role":"user"},{"id":3,"role":"admin"}], "admin"`, expectedOutput: `[{"id":1,"role":"admin"},{"id":3,"role":"admin"}]`, isHidden: false }
    ],
    hints: ["MongoDB stores data as BSON documents grouped in collections."]
  },
  {
    id: "db-012",
    tier: 2,
    section: "Databases",
    topic: "MongoDB",
    title: "MongoDB Aggregation",
    difficulty: "Medium",
    pattern: "Aggregation Pipeline",
    description: "Simulate an aggregation pipeline: filter active items and calculate total revenue grouped by category.",
    slug: "mongodb-aggregation",
    category: "backend",
    tags: ["be-db", "databases", "MongoDB", "Aggregation Pipeline"],
    xpReward: 100,
    starterCode: {
      javascript: `function aggregateRevenue(items) {\n  const totals = {};\n  items.filter(i => i.active).forEach(i => {\n    totals[i.category] = (totals[i.category] || 0) + i.price;\n  });\n  return totals;\n}`,
      python: `def aggregate_revenue(items):\n    totals = {}\n    for i in items:\n        if i.get('active'):\n            cat = i['category']\n            totals[cat] = totals.get(cat, 0) + i['price']\n    return totals`
    },
    testCases: [
      { input: `[{"category":"tech","price":100,"active":true},{"category":"tech","price":50,"active":true},{"category":"home","price":20,"active":false}]`, expectedOutput: `{"tech":150}`, isHidden: false }
    ],
    hints: ["MongoDB aggregation pipeline stages include $match, $group, $sort, and $project."]
  },
  {
    id: "db-013",
    tier: 2,
    section: "Databases",
    topic: "Database Design",
    title: "Database Schema Design",
    difficulty: "Medium",
    pattern: "Relationships",
    description: "Validate foreign key integrity across tables: verify all orders reference valid existing user IDs.",
    slug: "database-schema-design",
    category: "backend",
    tags: ["be-db", "databases", "Database Design", "Relationships"],
    xpReward: 100,
    starterCode: {
      javascript: `function validateForeignKeys(users, orders) {\n  const userIds = new Set(users.map(u => u.id));\n  const invalidOrders = orders.filter(o => !userIds.has(o.userId)).map(o => o.id);\n  return { valid: invalidOrders.length === 0, invalidOrders };\n}`,
      python: `def validate_foreign_keys(users, orders):\n    user_ids = {u['id'] for u in users}\n    invalid = [o['id'] for o in orders if o.get('userId') not in user_ids]\n    return { "valid": len(invalid) == 0, "invalidOrders": invalid }`
    },
    testCases: [
      { input: `[{"id":1},{"id":2}], [{"id":10,"userId":1},{"id":20,"userId":99}]`, expectedOutput: `{"valid":false,"invalidOrders":[20]}`, isHidden: false },
      { input: `[{"id":1}], [{"id":10,"userId":1}]`, expectedOutput: `{"valid":true,"invalidOrders":[]}`, isHidden: true }
    ],
    hints: ["Foreign key constraints prevent orphaned records and maintain referential integrity."]
  },
  {
    id: "db-014",
    tier: 2,
    section: "Databases",
    topic: "Database Design",
    title: "One-to-Many Relationship",
    difficulty: "Medium",
    pattern: "Relationships",
    description: "Given a users array and an orders array with foreign key `userId`, embed each user's orders inside their user record.",
    slug: "one-to-many-relationship",
    category: "backend",
    tags: ["be-db", "databases", "Database Design", "Relationships"],
    xpReward: 100,
    starterCode: {
      javascript: `function embedUserOrders(users, orders) {\n  return users.map(u => ({\n    ...u,\n    orders: orders.filter(o => o.userId === u.id)\n  }));\n}`,
      python: `def embed_user_orders(users, orders):\n    return [\n        {**u, "orders": [o for o in orders if o.get('userId') == u['id']]}\n        for u in users\n    ]`
    },
    testCases: [
      { input: `[{"id":1,"name":"Alice"}], [{"id":101,"userId":1,"item":"Laptop"},{"id":102,"userId":1,"item":"Mouse"}]`, expectedOutput: `[{"id":1,"name":"Alice","orders":[{"id":101,"userId":1,"item":"Laptop"},{"id":102,"userId":1,"item":"Mouse"}]}]`, isHidden: false }
    ],
    hints: ["In MongoDB, 1:N can be embedded; in relational DBs, use separate tables with foreign keys."]
  },
  {
    id: "db-015",
    tier: 2,
    section: "Databases",
    topic: "Database Design",
    title: "Many-to-Many Relationship",
    difficulty: "Medium",
    pattern: "Junction Table",
    description: "Resolve a many-to-many relationship: join users, roles, and a junction table `userRoles` to produce `{ userName, roles: [...] }`.",
    slug: "many-to-many-relationship",
    category: "backend",
    tags: ["be-db", "databases", "Database Design", "Junction Table"],
    xpReward: 100,
    starterCode: {
      javascript: `function resolveJunction(users, roles, userRoles) {\n  const roleMap = new Map(roles.map(r => [r.id, r.name]));\n  return users.map(u => {\n    const userRoleIds = userRoles.filter(ur => ur.userId === u.id).map(ur => ur.roleId);\n    const assignedRoles = userRoleIds.map(rid => roleMap.get(rid)).filter(Boolean);\n    return { userName: u.name, roles: assignedRoles };\n  });\n}`,
      python: `def resolve_junction(users, roles, user_roles):\n    role_map = {r['id']: r['name'] for r in roles}\n    result = []\n    for u in users:\n        assigned = [role_map[ur['roleId']] for ur in user_roles if ur.get('userId') == u['id'] and ur.get('roleId') in role_map]\n        result.append({ "userName": u['name'], "roles": assigned })\n    return result`
    },
    testCases: [
      { input: `[{"id":1,"name":"Alice"}], [{"id":10,"name":"Admin"},{"id":20,"name":"Editor"}], [{"userId":1,"roleId":10},{"userId":1,"roleId":20}]`, expectedOutput: `[{"userName":"Alice","roles":["Admin","Editor"]}]`, isHidden: false }
    ],
    hints: ["Junction / associative tables hold composite primary keys (userId, roleId) to model N:M."]
  }
];
