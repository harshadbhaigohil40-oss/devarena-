/**
 * TIER 3 — AUTHENTICATION (15 Questions)
 */

module.exports = [
  {
    id: "auth-001",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "Password Hashing",
    difficulty: "Easy",
    pattern: "Password Hashing",
    description: "Hash a user password before storing it using a salted simulation: return formatted string `hash_<salt>_<password>`.",
    slug: "password-hashing",
    category: "backend",
    tags: ["be-auth", "authentication", "Password Hashing"],
    xpReward: 50,
    starterCode: {
      javascript: `function hashPassword(password, salt) {\n  return \`hash_\${salt}_\${password}\`;\n}`,
      python: `def hash_password(password, salt):\n    return f"hash_{salt}_{password}"`
    },
    testCases: [
      { input: `"secret123", "salt99"`, expectedOutput: `"hash_salt99_secret123"`, isHidden: false },
      { input: `"mypass", "xyz"`, expectedOutput: `"hash_xyz_mypass"`, isHidden: true }
    ],
    hints: ["Use strong adaptive hashing algorithms like bcrypt or argon2 in production."]
  },
  {
    id: "auth-002",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "Password Verification",
    difficulty: "Easy",
    pattern: "Password Comparison",
    description: "Verify a candidate plain-text password against a stored salted hash `hash_<salt>_<password>`.",
    slug: "password-verification",
    category: "backend",
    tags: ["be-auth", "authentication", "Password Comparison"],
    xpReward: 50,
    starterCode: {
      javascript: `function verifyPassword(candidate, salt, storedHash) {\n  const expected = \`hash_\${salt}_\${candidate}\`;\n  return candidate !== '' && expected === storedHash;\n}`,
      python: `def verify_password(candidate, salt, stored_hash):\n    expected = f"hash_{salt}_{candidate}"\n    return bool(candidate) and expected == stored_hash`
    },
    testCases: [
      { input: `"secret123", "salt99", "hash_salt99_secret123"`, expectedOutput: `true`, isHidden: false },
      { input: `"wrongpass", "salt99", "hash_salt99_secret123"`, expectedOutput: `false`, isHidden: false }
    ],
    hints: ["Use constant-time comparison (e.g. crypto.timingSafeEqual) to prevent timing attacks."]
  },
  {
    id: "auth-003",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "User Registration",
    difficulty: "Medium",
    pattern: "Registration Flow",
    description: "Register a new user: validate that email contains '@' and password length >= 6. Check if email already exists in users list.",
    slug: "user-registration",
    category: "backend",
    tags: ["be-auth", "authentication", "Registration Flow"],
    xpReward: 100,
    starterCode: {
      javascript: `function registerUser(users, newUser) {\n  if (!newUser.email || !newUser.email.includes('@')) {\n    return { success: false, error: 'Invalid email' };\n  }\n  if (!newUser.password || newUser.password.length < 6) {\n    return { success: false, error: 'Password too short' };\n  }\n  if (users.some(u => u.email === newUser.email)) {\n    return { success: false, error: 'User already exists' };\n  }\n  return { success: true, user: { email: newUser.email, id: users.length + 1 } };\n}`,
      python: `def register_user(users, new_user):\n    email = new_user.get('email', '')\n    password = new_user.get('password', '')\n    if not email or '@' not in email:\n        return { "success": False, "error": "Invalid email" }\n    if not password or len(password) < 6:\n        return { "success": False, "error": "Password too short" }\n    if any(u.get('email') == email for u in users):\n        return { "success": False, "error": "User already exists" }\n    return { "success": True, "user": { "email": email, "id": len(users) + 1 } }`
    },
    testCases: [
      { input: `[{"email":"test@dev.com"}], {"email":"new@dev.com","password":"password1"}` , expectedOutput: `{"success":true,"user":{"email":"new@dev.com","id":2}}`, isHidden: false },
      { input: `[{"email":"test@dev.com"}], {"email":"test@dev.com","password":"password1"}`, expectedOutput: `{"success":false,"error":"User already exists"}`, isHidden: false },
      { input: `[], {"email":"new@dev.com","password":"123"}`, expectedOutput: `{"success":false,"error":"Password too short"}`, isHidden: true }
    ],
    hints: ["Validate and sanitize input before attempting to save credentials."]
  },
  {
    id: "auth-004",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "User Login",
    difficulty: "Medium",
    pattern: "Login Flow",
    description: "Verify credentials from a users list. If email and password match, return `{ success: true, token: 'token_' + user.id }`, else `{ success: false, error: 'Invalid credentials' }`.",
    slug: "user-login",
    category: "backend",
    tags: ["be-auth", "authentication", "Login Flow"],
    xpReward: 100,
    starterCode: {
      javascript: `function login(users, email, password) {\n  const user = users.find(u => u.email === email && u.password === password);\n  if (!user) return { success: false, error: 'Invalid credentials' };\n  return { success: true, token: 'token_' + user.id };\n}`,
      python: `def login(users, email, password):\n    user = next((u for u in users if u.get('email') == email and u.get('password') == password), None)\n    if not user:\n        return { "success": False, "error": "Invalid credentials" }\n    return { "success": True, "token": f"token_{user['id']}" }`
    },
    testCases: [
      { input: `[{"id":1,"email":"alex@dev.com","password":"pass123"}], "alex@dev.com", "pass123"`, expectedOutput: `{"success":true,"token":"token_1"}`, isHidden: false },
      { input: `[{"id":1,"email":"alex@dev.com","password":"pass123"}], "alex@dev.com", "wrong"`, expectedOutput: `{"success":false,"error":"Invalid credentials"}`, isHidden: false }
    ],
    hints: ["Avoid revealing whether it was the email or the password that was incorrect."]
  },
  {
    id: "auth-005",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "JWT Authentication",
    difficulty: "Medium",
    pattern: "JWT",
    description: "Generate a JWT token string simulation: return `header.payload.signature` by base64-encoding header and payload.",
    slug: "jwt-authentication",
    category: "backend",
    tags: ["be-auth", "authentication", "JWT"],
    xpReward: 100,
    starterCode: {
      javascript: `function createToken(userId, role) {\n  return \`jwt_\${userId}_\${role}\`;\n}`,
      python: `def create_token(user_id, role):\n    return f"jwt_{user_id}_{role}"`
    },
    testCases: [
      { input: `101, "admin"`, expectedOutput: `"jwt_101_admin"`, isHidden: false },
      { input: `202, "user"`, expectedOutput: `"jwt_202_user"`, isHidden: true }
    ],
    hints: ["JWT tokens consist of three parts: Header, Payload, and Signature separated by dots."]
  },
  {
    id: "auth-006",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "JWT Verification Middleware",
    difficulty: "Medium",
    pattern: "Middleware",
    description: "Decode token `jwt_<userId>_<role>` and check if token is valid. Return `{ valid: boolean, user: { userId, role } }`.",
    slug: "jwt-verification-middleware",
    category: "backend",
    tags: ["be-auth", "authentication", "Middleware"],
    xpReward: 100,
    starterCode: {
      javascript: `function verifyToken(token) {\n  if (!token || !token.startsWith('jwt_')) return { valid: false, error: 'Invalid token' };\n  const parts = token.split('_');\n  return { valid: true, user: { userId: Number(parts[1]), role: parts[2] } };\n}`,
      python: `def verify_token(token):\n    if not token or not token.startswith('jwt_'):\n        return { "valid": False, "error": "Invalid token" }\n    parts = token.split('_')\n    return { "valid": True, "user": { "userId": int(parts[1]), "role": parts[2] } }`
    },
    testCases: [
      { input: `"jwt_101_admin"`, expectedOutput: `{"valid":true,"user":{"userId":101,"role":"admin"}}`, isHidden: false },
      { input: `"bad_token"`, expectedOutput: `{"valid":false,"error":"Invalid token"}`, isHidden: false }
    ],
    hints: ["Middleware verifies cryptographic signature using secret or public key."]
  },
  {
    id: "auth-007",
    tier: 3,
    section: "Authentication",
    topic: "Authorization",
    title: "Protected Route",
    difficulty: "Medium",
    pattern: "JWT Middleware",
    description: "Guards a protected route: if `user` exists on request, return `{ authorized: true, data: 'Secret data' }`, else `{ authorized: false, status: 401 }`.",
    slug: "protected-route",
    category: "backend",
    tags: ["be-auth", "authentication", "Authorization", "JWT Middleware"],
    xpReward: 100,
    starterCode: {
      javascript: `function accessProtected(user) {\n  if (!user) return { authorized: false, status: 401 };\n  return { authorized: true, data: 'Secret data' };\n}`,
      python: `def access_protected(user):\n    if not user:\n        return { "authorized": False, "status": 401 }\n    return { "authorized": True, "data": "Secret data" }`
    },
    testCases: [
      { input: `{"id":1,"name":"Alice"}`, expectedOutput: `{"authorized":true,"data":"Secret data"}`, isHidden: false },
      { input: `null`, expectedOutput: `{"authorized":false,"status":401}`, isHidden: false }
    ],
    hints: ["Protected routes require valid authentication credentials."]
  },
  {
    id: "auth-008",
    tier: 3,
    section: "Authentication",
    topic: "Authorization",
    title: "Role-Based Access Control",
    difficulty: "Medium",
    pattern: "RBAC",
    description: "Check if a user's role exists in an allowed roles list. Return `{ allowed: true }` or `{ allowed: false, status: 403 }`.",
    slug: "role-based-access-control",
    category: "backend",
    tags: ["be-auth", "authentication", "Authorization", "RBAC"],
    xpReward: 100,
    starterCode: {
      javascript: `function checkRBAC(userRole, allowedRoles) {\n  const allowed = allowedRoles.includes(userRole);\n  return allowed ? { allowed: true } : { allowed: false, status: 403 };\n}`,
      python: `def check_rbac(user_role, allowed_roles):\n    allowed = user_role in allowed_roles\n    return { "allowed": True } if allowed else { "allowed": False, "status": 403 }`
    },
    testCases: [
      { input: `"admin", ["admin", "manager"]`, expectedOutput: `{"allowed":true}`, isHidden: false },
      { input: `"user", ["admin", "manager"]`, expectedOutput: `{"allowed":false,"status":403}`, isHidden: false }
    ],
    hints: ["RBAC assigns permissions to roles rather than individual users directly."]
  },
  {
    id: "auth-009",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "Refresh Token System",
    difficulty: "Hard",
    pattern: "Access Token + Refresh Token",
    description: "Implement refresh token rotation: if provided refresh token is in the store, issue a new access token and rotate the refresh token.",
    slug: "refresh-token-system",
    category: "backend",
    tags: ["be-auth", "authentication", "Access Token + Refresh Token"],
    xpReward: 200,
    starterCode: {
      javascript: `function rotateToken(tokenStore, oldToken) {\n  if (!tokenStore[oldToken]) return { success: false, error: 'Invalid refresh token' };\n  const userId = tokenStore[oldToken].userId;\n  const newAccess = 'access_' + userId;\n  const newRefresh = 'refresh_' + userId + '_new';\n  return { success: true, accessToken: newAccess, refreshToken: newRefresh };\n}`,
      python: `def rotate_token(token_store, old_token):\n    if old_token not in token_store:\n        return { "success": False, "error": "Invalid refresh token" }\n    user_id = token_store[old_token]['userId']\n    return {\n        "success": True,\n        "accessToken": f"access_{user_id}",\n        "refreshToken": f"refresh_{user_id}_new"\n    }`
    },
    testCases: [
      { input: `{"r1":{"userId":42}}, "r1"`, expectedOutput: `{"success":true,"accessToken":"access_42","refreshToken":"refresh_42_new"}`, isHidden: false },
      { input: `{"r1":{"userId":42}}, "r_unknown"`, expectedOutput: `{"success":false,"error":"Invalid refresh token"}`, isHidden: false }
    ],
    hints: ["Short-lived access tokens combined with rotated refresh tokens limit breach impact."]
  },
  {
    id: "auth-010",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "Session Authentication",
    difficulty: "Medium",
    pattern: "Sessions",
    description: "Validate a session ID against an active sessions store. If session exists and currentTime < expiresAt, return `{ valid: true, userId }`, else invalid.",
    slug: "session-authentication",
    category: "backend",
    tags: ["be-auth", "authentication", "Sessions"],
    xpReward: 100,
    starterCode: {
      javascript: `function validateSession(sessions, sessionId, currentTime) {\n  const session = sessions[sessionId];\n  if (!session || currentTime >= session.expiresAt) {\n    return { valid: false, error: 'Session expired' };\n  }\n  return { valid: true, userId: session.userId };\n}`,
      python: `def validate_session(sessions, session_id, current_time):\n    session = sessions.get(session_id)\n    if not session or current_time >= session.get('expiresAt', 0):\n        return { "valid": False, "error": "Session expired" }\n    return { "valid": True, "userId": session.get('userId') }`
    },
    testCases: [
      { input: `{"s1":{"userId":10,"expiresAt":1000}}, "s1", 500`, expectedOutput: `{"valid":true,"userId":10}`, isHidden: false },
      { input: `{"s1":{"userId":10,"expiresAt":1000}}, "s1", 1200`, expectedOutput: `{"valid":false,"error":"Session expired"}`, isHidden: false }
    ],
    hints: ["Server stores session data (in Redis/DB) while the client only holds the session ID."]
  },
  {
    id: "auth-011",
    tier: 3,
    section: "Authentication",
    topic: "Security",
    title: "Secure Cookies",
    difficulty: "Medium",
    pattern: "HTTP-only Cookies",
    description: "Format a secure Set-Cookie header string with `HttpOnly; Secure; SameSite=Strict; Max-Age=<seconds>`.",
    slug: "secure-cookies",
    category: "backend",
    tags: ["be-auth", "authentication", "Security", "HTTP-only Cookies"],
    xpReward: 100,
    starterCode: {
      javascript: `function createCookie(name, value, maxAge) {\n  return \`\${name}=\${value}; HttpOnly; Secure; SameSite=Strict; Max-Age=\${maxAge}\`;\n}`,
      python: `def create_cookie(name, value, max_age):\n    return f"{name}={value}; HttpOnly; Secure; SameSite=Strict; Max-Age={max_age}"`
    },
    testCases: [
      { input: `"sessionId", "xyz123", 3600`, expectedOutput: `"sessionId=xyz123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600"`, isHidden: false }
    ],
    hints: ["HttpOnly flag prevents client-side JavaScript access, defending against XSS attacks."]
  },
  {
    id: "auth-012",
    tier: 3,
    section: "Authentication",
    topic: "Authentication",
    title: "OAuth Login Flow",
    difficulty: "Medium",
    pattern: "OAuth",
    description: "Simulate OAuth authorization code exchange: if received state matches expected state, return `{ accessToken: 'oauth_' + code, tokenType: 'Bearer' }`.",
    slug: "oauth-login-flow",
    category: "backend",
    tags: ["be-auth", "authentication", "OAuth"],
    xpReward: 100,
    starterCode: {
      javascript: `function verifyOAuth(code, state, expectedState) {\n  if (state !== expectedState) {\n    return { success: false, error: 'State mismatch / CSRF' };\n  }\n  return { success: true, accessToken: 'oauth_' + code, tokenType: 'Bearer' };\n}`,
      python: `def verify_oauth(code, state, expected_state):\n    if state != expected_state:\n        return { "success": False, "error": "State mismatch / CSRF" }\n    return { "success": True, "accessToken": f"oauth_{code}", "tokenType": "Bearer" }`
    },
    testCases: [
      { input: `"code123", "state_abc", "state_abc"`, expectedOutput: `{"success":true,"accessToken":"oauth_code123","tokenType":"Bearer"}`, isHidden: false },
      { input: `"code123", "bad_state", "state_abc"`, expectedOutput: `{"success":false,"error":"State mismatch / CSRF"}`, isHidden: false }
    ],
    hints: ["The state parameter prevents Cross-Site Request Forgery (CSRF) in OAuth flows."]
  },
  {
    id: "auth-013",
    tier: 3,
    section: "Authentication",
    topic: "API Security",
    title: "Rate Limiting",
    difficulty: "Medium",
    pattern: "Rate Limiting",
    description: "Limit the number of requests an IP can make: given current request count and limit, return `{ allowed: boolean, remaining: number }`.",
    slug: "rate-limiting",
    category: "backend",
    tags: ["be-auth", "authentication", "API Security", "Rate Limiting"],
    xpReward: 100,
    starterCode: {
      javascript: `function rateLimit(currentCount, limit) {\n  const allowed = currentCount < limit;\n  return {\n    allowed,\n    remaining: Math.max(0, limit - currentCount - (allowed ? 1 : 0))\n  };\n}`,
      python: `def rate_limit(current_count, limit):\n    allowed = current_count < limit\n    return {\n        "allowed": allowed,\n        "remaining": max(0, limit - current_count - (1 if allowed else 0))\n    }`
    },
    testCases: [
      { input: `3, 5`, expectedOutput: `{"allowed":true,"remaining":1}`, isHidden: false },
      { input: `5, 5`, expectedOutput: `{"allowed":false,"remaining":0}`, isHidden: false }
    ],
    hints: ["Rate limiting prevents brute force attacks and resource exhaustion."]
  },
  {
    id: "auth-014",
    tier: 3,
    section: "Authentication",
    topic: "API Security",
    title: "CORS Configuration",
    difficulty: "Easy",
    pattern: "CORS",
    description: "Given a request Origin header and allowed origins array, return the allowed origin header string or null if disallowed.",
    slug: "cors-configuration",
    category: "backend",
    tags: ["be-auth", "authentication", "API Security", "CORS"],
    xpReward: 50,
    starterCode: {
      javascript: `function checkCORS(origin, allowedOrigins) {\n  if (allowedOrigins.includes(origin)) return origin;\n  return null;\n}`,
      python: `def check_cors(origin, allowed_origins):\n    return origin if origin in allowed_origins else None`
    },
    testCases: [
      { input: `"https://devarena.com", ["https://devarena.com", "https://app.devarena.com"]`, expectedOutput: `"https://devarena.com"`, isHidden: false },
      { input: `"https://evil.com", ["https://devarena.com"]`, expectedOutput: `null`, isHidden: false }
    ],
    hints: ["Cross-Origin Resource Sharing (CORS) tells browsers which external origins are allowed to access resources."]
  },
  {
    id: "auth-015",
    tier: 3,
    section: "Authentication",
    topic: "Security",
    title: "Authentication Security Audit",
    difficulty: "Hard",
    pattern: "Secure Authentication",
    description: "Scan an authentication config object and report list of issues: weak algorithm, missing HttpOnly, or missing HTTPS.",
    slug: "authentication-security-audit",
    category: "backend",
    tags: ["be-auth", "authentication", "Security", "Secure Authentication"],
    xpReward: 200,
    starterCode: {
      javascript: `function auditConfig(cfg) {\n  const issues = [];\n  if (cfg.algorithm === 'md5' || cfg.algorithm === 'sha1') issues.push('Weak hash algorithm');\n  if (!cfg.httpOnly) issues.push('Cookie missing HttpOnly');\n  if (!cfg.https) issues.push('Insecure transport');\n  return issues;\n}`,
      python: `def audit_config(cfg):\n    issues = []\n    if cfg.get('algorithm') in ['md5', 'sha1']:\n        issues.append('Weak hash algorithm')\n    if not cfg.get('httpOnly'):\n        issues.append('Cookie missing HttpOnly')\n    if not cfg.get('https'):\n        issues.append('Insecure transport')\n    return issues`
    },
    testCases: [
      { input: `{"algorithm":"md5","httpOnly":false,"https":false}`, expectedOutput: `["Weak hash algorithm","Cookie missing HttpOnly","Insecure transport"]`, isHidden: false },
      { input: `{"algorithm":"bcrypt","httpOnly":true,"https":true}`, expectedOutput: `[]`, isHidden: true }
    ],
    hints: ["Never store plaintext or MD5/SHA1 hashes; enforce HTTPS and HttpOnly cookies."]
  }
];
