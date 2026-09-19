/**
 * Tier 4 — Testing (25 Topics & Coding Challenges)
 * Node: fe-testing
 * Difficulty: Medium / Hard
 */

const feTier4Testing = [
  // ─── Testing Fundamentals & Test Doubles (1-10) ───
  {
    id: "fe-test-001",
    title: "Deep Equality Assertion Evaluator (toEqual)",
    slug: "fe-assertion-to-equal",
    tier: 4,
    section: "Testing",
    topic: "Testing Fundamentals",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Unit Testing",
    category: "frontend",
    tags: ["fe-testing", "assertions", "unit-testing"],
    xpReward: 100,
    description: `## Deep Equality Assertion Evaluator (toEqual)

### Description
Testing frameworks (Jest, Vitest) provide \`expect(actual).toEqual(expected)\` to verify deep recursive equality between objects or arrays.
Return \`{ pass: boolean, message: string }\`.

### Learning Objectives
- Compare nested data structures and generate clear diff assertion messages.

### Example
\`Input: { a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }\`
\`Output: { pass: true, message: "Values are deeply equal" }\``,
    starterCode: {
      javascript: `function assertDeepEqual(actual, expected) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  const pass = actualStr === expectedStr;
  return {
    pass,
    message: pass ? 'Values are deeply equal' : \`Expected \${expectedStr} but got \${actualStr}\`
  };
}`,
      python: `import json

def assert_deep_equal(actual, expected):
    a_str = json.dumps(actual, sort_keys=True)
    e_str = json.dumps(expected, sort_keys=True)
    passed = a_str == e_str
    return {
        'pass': passed,
        'message': 'Values are deeply equal' if passed else f'Expected {e_str} but got {a_str}'
    }`
    },
    testCases: [
      { input: '{"a":1,"b":[2,3]}, {"a":1,"b":[2,3]}', expectedOutput: '{"pass":true,"message":"Values are deeply equal"}', isHidden: false },
      { input: '{"a":1}, {"a":2}', expectedOutput: '{"pass":false,"message":"Expected {\\"a\\":2} but got {\\"a\\":1}"}', isHidden: false }
    ]
  },
  {
    id: "fe-test-002",
    title: "Test Spy Function Simulator (jest.fn)",
    slug: "fe-test-spy-function",
    tier: 4,
    section: "Testing",
    topic: "Spies",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Mocking",
    category: "frontend",
    tags: ["fe-testing", "mocking", "spies"],
    xpReward: 100,
    description: `## Test Spy Function Simulator (jest.fn)

### Description
A test spy tracks:
- Total number of calls (\`callCount\`)
- Arguments recorded for each call (\`calls: [[arg1, arg2], ...]\`)
- Last return value
Given a list of invoked argument sets, return spy inspection metadata.

### Learning Objectives
- Implement invocation inspection and assertion tracking for mocks.

### Example
\`Input: [["click", 1], ["click", 2]]\`
\`Output: { callCount: 2, calls: [["click", 1], ["click", 2]], wasCalled: true }\``,
    starterCode: {
      javascript: `function simulateSpy(invocations) {
  return {
    callCount: invocations.length,
    calls: invocations,
    wasCalled: invocations.length > 0
  };
}`,
      python: `def simulate_spy(invocations):
    return {
        'callCount': len(invocations),
        'calls': list(invocations),
        'wasCalled': len(invocations) > 0
    }`
    },
    testCases: [
      { input: '[["click", 1], ["click", 2]]', expectedOutput: '{"callCount":2,"calls":[["click",1],["click",2]],"wasCalled":true}', isHidden: false },
      { input: '[]', expectedOutput: '{"callCount":0,"calls":[],"wasCalled":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-003",
    title: "Test Coverage Percentage Calculator",
    slug: "fe-test-coverage-calculator",
    tier: 4,
    section: "Testing",
    topic: "Test Coverage",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Testing Strategy",
    category: "frontend",
    tags: ["fe-testing", "coverage", "metrics"],
    xpReward: 50,
    description: `## Test Coverage Percentage Calculator

### Description
Calculate code coverage metrics across statements, branches, and functions: \`Math.round((covered / total) * 100)\`.
Return \`{ pct: number, meetsThreshold: boolean }\` where standard threshold is 80%.

### Learning Objectives
- Compute CI code quality metrics.

### Example
\`Input: 85, 100, 80\`
\`Output: { pct: 85, meetsThreshold: true }\``,
    starterCode: {
      javascript: `function calculateCoverage(covered, total, threshold = 80) {
  if (total === 0) return { pct: 100, meetsThreshold: true };
  const pct = Math.round((covered / total) * 100);
  return { pct, meetsThreshold: pct >= threshold };
}`,
      python: `def calculate_coverage(covered, total, threshold=80):
    if total == 0:
        return {'pct': 100, 'meetsThreshold': True}
    pct = round((covered / total) * 100)
    return {'pct': pct, 'meetsThreshold': pct >= threshold}`
    },
    testCases: [
      { input: '85, 100, 80', expectedOutput: '{"pct":85,"meetsThreshold":true}', isHidden: false },
      { input: '70, 100, 80', expectedOutput: '{"pct":70,"meetsThreshold":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-004",
    title: "Flaky Test Run Classifier",
    slug: "fe-flaky-test-classifier",
    tier: 4,
    section: "Testing",
    topic: "Flaky Tests",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Testing Strategy",
    category: "frontend",
    tags: ["fe-testing", "flaky-tests", "ci"],
    xpReward: 50,
    description: `## Flaky Test Run Classifier

### Description
A test is classified as \`"flaky"\` if it exhibits both passed and failed outcomes across multiple identical runs.
If all pass: \`"passed"\`. If all fail: \`"failed"\`. If mixed: \`"flaky"\`.

### Learning Objectives
- Identify non-deterministic frontend tests in CI pipelines.

### Example
\`Input: ["pass", "fail", "pass"]\`
\`Output: "flaky"\`
\`Input: ["pass", "pass", "pass"]\`
\`Output: "passed"\``,
    starterCode: {
      javascript: `function classifyTestRuns(outcomes) {
  const hasPass = outcomes.includes('pass');
  const hasFail = outcomes.includes('fail');
  if (hasPass && hasFail) return 'flaky';
  if (hasPass) return 'passed';
  return 'failed';
}`,
      python: `def classify_test_runs(outcomes):
    has_pass = 'pass' in outcomes
    has_fail = 'fail' in outcomes
    if has_pass and has_fail:
        return 'flaky'
    if has_pass:
        return 'passed'
    return 'failed'`
    },
    testCases: [
      { input: '["pass", "fail", "pass"]', expectedOutput: '"flaky"', isHidden: false },
      { input: '["pass", "pass", "pass"]', expectedOutput: '"passed"', isHidden: false },
      { input: '["fail", "fail"]', expectedOutput: '"failed"', isHidden: true }
    ]
  },
  {
    id: "fe-test-005",
    title: "Accessibility Axe-Core Rule Evaluator",
    slug: "fe-axe-core-rule-evaluator",
    tier: 4,
    section: "Testing",
    topic: "Accessibility Testing",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Accessibility Testing",
    category: "frontend",
    tags: ["fe-testing", "accessibility", "axe"],
    xpReward: 100,
    description: `## Accessibility Axe-Core Rule Evaluator

### Description
Automated accessibility tests (axe-core) inspect DOM nodes for rule violations:
- Images must have non-empty \`alt\` attribute
- Form inputs must have an associated \`label\`
- Buttons must have text content or \`aria-label\`
Given an element descriptor, return violations array.

### Learning Objectives
- Integrate automated WCAG accessibility assertion gates.

### Example
\`Input: { tag: "img", alt: "" }\`
\`Output: ["image-alt-missing"]\`
\`Input: { tag: "button", text: "Submit" }\`
\`Output: []\``,
    starterCode: {
      javascript: `function auditA11y(element) {
  const violations = [];
  if (element.tag === 'img' && (!element.alt || element.alt.trim() === '')) {
    violations.push('image-alt-missing');
  }
  if (element.tag === 'input' && !element.hasLabel) {
    violations.push('input-missing-label');
  }
  if (element.tag === 'button' && !element.text && !element.ariaLabel) {
    violations.push('button-missing-name');
  }
  return violations;
}`,
      python: `def audit_a11y(element):
    violations = []
    tag = element.get('tag')
    if tag == 'img' and (not element.get('alt') or not element['alt'].strip()):
        violations.append('image-alt-missing')
    if tag == 'input' and not element.get('hasLabel'):
        violations.append('input-missing-label')
    if tag == 'button' and not element.get('text') and not element.get('ariaLabel'):
        violations.append('button-missing-name')
    return violations`
    },
    testCases: [
      { input: '{"tag":"img","alt":""}', expectedOutput: '["image-alt-missing"]', isHidden: false },
      { input: '{"tag":"button","text":"Submit"}', expectedOutput: '[]', isHidden: false },
      { input: '{"tag":"input","hasLabel":false}', expectedOutput: '["input-missing-label"]', isHidden: true }
    ]
  },

  // ─── 15 Practical Testing Challenges (6-20) ───
  {
    id: "fe-test-006",
    title: "Test a Counter Component",
    slug: "fe-test-counter-component",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "counter", "react-testing"],
    xpReward: 100,
    description: `## Test a Counter Component

### Description
Simulate testing a Counter component:
1. Render with initial count 0
2. Click increment button -> count becomes 1
3. Click decrement button -> count becomes 0
Return test result \`{ testPassed: boolean, assertionsCount: number }\`.

### Learning Objectives
- Test component state changes responding to user click interactions.

### Example
\`Input: 0, ["inc", "inc", "dec"], 1\`
\`Output: { testPassed: true, assertionsCount: 3 }\``,
    starterCode: {
      javascript: `function testCounterBehavior(initialVal, clicks, expectedFinal) {
  let count = initialVal;
  let assertions = 0;
  for (const click of clicks) {
    if (click === 'inc') count++;
    else if (click === 'dec') count--;
    assertions++;
  }
  return {
    testPassed: count === expectedFinal,
    assertionsCount: assertions
  };
}`,
      python: `def test_counter_behavior(initial_val, clicks, expected_final):
    count = initial_val
    assertions = 0
    for click in clicks:
        if click == 'inc':
            count += 1
        elif click == 'dec':
            count -= 1
        assertions += 1
    return {
        'testPassed': count == expected_final,
        'assertionsCount': assertions
    }`
    },
    testCases: [
      { input: '0, ["inc", "inc", "dec"], 1', expectedOutput: '{"testPassed":true,"assertionsCount":3}', isHidden: false },
      { input: '5, ["inc"], 10', expectedOutput: '{"testPassed":false,"assertionsCount":1}', isHidden: false }
    ]
  },
  {
    id: "fe-test-007",
    title: "Test a Todo Application (Add, Toggle, Delete)",
    slug: "fe-test-todo-application",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Integration Testing",
    category: "frontend",
    tags: ["fe-testing", "todo", "integration"],
    xpReward: 100,
    description: `## Test a Todo Application (Add, Toggle, Delete)

### Description
Test full integration lifecycle of a Todo app:
- Add todo "Write tests"
- Assert item appears in list with 1 item
- Toggle completed
- Assert item has completed status \`true\`
- Delete item
- Assert list is empty

### Learning Objectives
- Construct end-to-end integration test sequences verifying multiple state mutations.

### Example
\`Input: ["Write tests"]\`
\`Output: { allPassed: true, stepResults: ["item_added", "item_toggled", "item_deleted"] }\``,
    starterCode: {
      javascript: `function testTodoAppLifecycle(todoText) {
  let todos = [];
  const results = [];

  // Step 1: Add
  todos.push({ text: todoText, completed: false });
  if (todos.length === 1) results.push('item_added');

  // Step 2: Toggle
  todos[0].completed = true;
  if (todos[0].completed) results.push('item_toggled');

  // Step 3: Delete
  todos = [];
  if (todos.length === 0) results.push('item_deleted');

  return {
    allPassed: results.length === 3,
    stepResults: results
  };
}`,
      python: `def test_todo_app_lifecycle(todo_text):
    todos = []
    results = []
    todos.append({'text': todo_text, 'completed': False})
    if len(todos) == 1:
        results.append('item_added')
    todos[0]['completed'] = True
    if todos[0]['completed']:
        results.append('item_toggled')
    todos = []
    if len(todos) == 0:
        results.append('item_deleted')
    return {
        'allPassed': len(results) == 3,
        'stepResults': results
    }`
    },
    testCases: [
      { input: '"Write tests"', expectedOutput: '{"allPassed":true,"stepResults":["item_added","item_toggled","item_deleted"]}', isHidden: false }
    ]
  },
  {
    id: "fe-test-008",
    title: "Test a Login Form Submit Dispatch",
    slug: "fe-test-login-form",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "forms", "testing"],
    xpReward: 100,
    description: `## Test a Login Form Submit Dispatch

### Description
Test that submitting a login form calls the mock \`onSubmit\` callback with the entered credentials \`{ email, password }\` and prevents default browser reload.

### Learning Objectives
- Verify form submission handlers receive exact form field states.

### Example
\`Input: "user@devarena.com", "pass123"\`
\`Output: { calledWith: { email: "user@devarena.com", password: "pass123" }, defaultPrevented: true }\``,
    starterCode: {
      javascript: `function testLoginFormSubmission(email, password) {
  const submitPayload = { email, password };
  return {
    calledWith: submitPayload,
    defaultPrevented: true
  };
}`,
      python: `def test_login_form_submission(email, password):
    return {
        'calledWith': {'email': email, 'password': password},
        'defaultPrevented': True
    }`
    },
    testCases: [
      { input: '"user@devarena.com", "pass123"', expectedOutput: '{"calledWith":{"email":"user@devarena.com","password":"pass123"},"defaultPrevented":true}', isHidden: false }
    ]
  },
  {
    id: "fe-test-009",
    title: "Test Form Validation Error Display",
    slug: "fe-test-form-validation",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "forms", "validation"],
    xpReward: 100,
    description: `## Test Form Validation Error Display

### Description
Test that submitting invalid email renders the error alert \`"Please enter a valid email"\` and prevents the submit API call.

### Learning Objectives
- Assert visual error feedback renders on validation failure.

### Example
\`Input: "not-an-email"\`
\`Output: { errorRendered: true, errorMessage: "Please enter a valid email", apiDispatched: false }\``,
    starterCode: {
      javascript: `function testFormValidationError(emailInput) {
  const isValid = emailInput.includes('@');
  return {
    errorRendered: !isValid,
    errorMessage: !isValid ? 'Please enter a valid email' : null,
    apiDispatched: isValid
  };
}`,
      python: `def test_form_validation_error(email_input):
    is_valid = '@' in email_input
    return {
        'errorRendered': not is_valid,
        'errorMessage': 'Please enter a valid email' if not is_valid else None,
        'apiDispatched': is_valid
    }`
    },
    testCases: [
      { input: '"not-an-email"', expectedOutput: '{"errorRendered":true,"errorMessage":"Please enter a valid email","apiDispatched":false}', isHidden: false },
      { input: '"ok@test.com"', expectedOutput: '{"errorRendered":false,"errorMessage":null,"apiDispatched":true}', isHidden: false }
    ]
  },
  {
    id: "fe-test-010",
    title: "Test an API Request Mock (fetch)",
    slug: "fe-test-api-request-mock",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Mocking",
    category: "frontend",
    tags: ["fe-testing", "mocking", "api"],
    xpReward: 100,
    description: `## Test an API Request Mock (fetch)

### Description
Mock global fetch to verify a user service fetches \`"/api/users/1"\` with headers \`{ Authorization: "Bearer token" }\`.

### Learning Objectives
- Assert mock network requests receive expected parameters and headers.

### Example
\`Input: 1, "token123"\`
\`Output: { endpoint: "/api/users/1", authHeader: "Bearer token123", success: true }\``,
    starterCode: {
      javascript: `function testApiMockCall(userId, authToken) {
  const endpoint = \`/api/users/\${userId}\`;
  const authHeader = \`Bearer \${authToken}\`;
  return {
    endpoint,
    authHeader,
    success: true
  };
}`,
      python: `def test_api_mock_call(user_id, auth_token):
    return {
        'endpoint': f'/api/users/{user_id}',
        'authHeader': f'Bearer {auth_token}',
        'success': True
    }`
    },
    testCases: [
      { input: '1, "token123"', expectedOutput: '{"endpoint":"/api/users/1","authHeader":"Bearer token123","success":true}', isHidden: false }
    ]
  },
  {
    id: "fe-test-011",
    title: "Test Loading States Rendering",
    slug: "fe-test-loading-states",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "loading", "async"],
    xpReward: 100,
    description: `## Test Loading States Rendering

### Description
Test that while an async request is pending, a loading indicator (\`<Spinner />\`) is present in the DOM, and disappears once data resolves.
Given promise state \`"pending" | "resolved"\`, return DOM assertion results.

### Learning Objectives
- Assert component visual transitions during asynchronous fetch lifecycles.

### Example
\`Input: "pending"\`
\`Output: { hasSpinner: true, hasContent: false }\`
\`Input: "resolved"\`
\`Output: { hasSpinner: false, hasContent: true }\``,
    starterCode: {
      javascript: `function testLoadingDOM(promiseState) {
  const isPending = promiseState === 'pending';
  return {
    hasSpinner: isPending,
    hasContent: !isPending
  };
}`,
      python: `def test_loading_dom(promise_state):
    is_pending = promise_state == 'pending'
    return {
        'hasSpinner': is_pending,
        'hasContent': not is_pending
    }`
    },
    testCases: [
      { input: '"pending"', expectedOutput: '{"hasSpinner":true,"hasContent":false}', isHidden: false },
      { input: '"resolved"', expectedOutput: '{"hasSpinner":false,"hasContent":true}', isHidden: false }
    ]
  },
  {
    id: "fe-test-012",
    title: "Test Error States UI Rendering",
    slug: "fe-test-error-states",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "error-handling", "ui"],
    xpReward: 100,
    description: `## Test Error States UI Rendering

### Description
Test that when an API call fails with status 500, an error alert with a "Retry" button is rendered.
Given HTTP status code, return rendered component error view state.

### Learning Objectives
- Test application resilience and error boundary view triggers.

### Example
\`Input: 500\`
\`Output: { showErrorBanner: true, retryBtnPresent: true }\`
\`Input: 200\`
\`Output: { showErrorBanner: false, retryBtnPresent: false }\``,
    starterCode: {
      javascript: `function testErrorStateUI(statusCode) {
  const isError = statusCode >= 400;
  return {
    showErrorBanner: isError,
    retryBtnPresent: isError
  };
}`,
      python: `def test_error_state_ui(status_code):
    is_error = status_code >= 400
    return {
        'showErrorBanner': is_error,
        'retryBtnPresent': is_error
    }`
    },
    testCases: [
      { input: '500', expectedOutput: '{"showErrorBanner":true,"retryBtnPresent":true}', isHidden: false },
      { input: '200', expectedOutput: '{"showErrorBanner":false,"retryBtnPresent":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-013",
    title: "Test a Modal Component Accessibility & Keyboard Navigation",
    slug: "fe-test-modal-accessibility",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Accessibility Testing",
    category: "frontend",
    tags: ["fe-testing", "modal", "accessibility"],
    xpReward: 100,
    description: `## Test a Modal Component Accessibility & Keyboard Navigation

### Description
Verify that opening a modal traps keyboard focus inside dialog elements and that pressing \`Escape\` triggers the \`onClose\` handler.

### Learning Objectives
- Test accessible keyboard event listeners and focus trapping.

### Example
\`Input: "Escape"\`
\`Output: { closed: true, focusRestoredToTrigger: true }\``,
    starterCode: {
      javascript: `function testModalKeyDismissal(keyEvent) {
  return {
    closed: keyEvent === 'Escape',
    focusRestoredToTrigger: keyEvent === 'Escape'
  };
}`,
      python: `def test_modal_key_dismissal(key_event):
    is_esc = key_event == 'Escape'
    return {
        'closed': is_esc,
        'focusRestoredToTrigger': is_esc
    }`
    },
    testCases: [
      { input: '"Escape"', expectedOutput: '{"closed":true,"focusRestoredToTrigger":true}', isHidden: false },
      { input: '"Tab"', expectedOutput: '{"closed":false,"focusRestoredToTrigger":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-014",
    title: "Test a Dropdown Component Selection",
    slug: "fe-test-dropdown-selection",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "dropdown", "components"],
    xpReward: 100,
    description: `## Test a Dropdown Component Selection

### Description
Test that clicking an option in a custom dropdown updates the displayed value and invokes \`onChange\` with selected value.

### Learning Objectives
- Assert component callbacks fire with option values.

### Example
\`Input: "Dark Mode"\`
\`Output: { selectedValue: "Dark Mode", menuOpen: false }\``,
    starterCode: {
      javascript: `function testDropdownSelect(chosenOption) {
  return {
    selectedValue: chosenOption,
    menuOpen: false
  };
}`,
      python: `def test_dropdown_select(chosen_option):
    return {
        'selectedValue': chosen_option,
        'menuOpen': False
    }`
    },
    testCases: [
      { input: '"Dark Mode"', expectedOutput: '{"selectedValue":"Dark Mode","menuOpen":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-015",
    title: "Test a Custom React Hook (renderHook)",
    slug: "fe-test-custom-hook-render",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Testing Hooks",
    category: "frontend",
    tags: ["fe-testing", "hooks", "renderHook"],
    xpReward: 100,
    description: `## Test a Custom React Hook (renderHook)

### Description
Using \`@testing-library/react-hooks\` (\`renderHook\`), test that custom hook \`useCounter\` increments state when \`result.current.increment()\` is called inside \`act()\`.

### Learning Objectives
- Test headless React hook state transitions in isolation.

### Example
\`Input: 0, 3\` (Start at 0, increment 3 times)
\`Output: { finalCount: 3, testPassed: true }\``,
    starterCode: {
      javascript: `function testHookCounter(initial, increments) {
  let count = initial;
  for (let i = 0; i < increments; i++) count++;
  return {
    finalCount: count,
    testPassed: count === initial + increments
  };
}`,
      python: `def test_hook_counter(initial, increments):
    count = initial + increments
    return {
        'finalCount': count,
        'testPassed': True
    }`
    },
    testCases: [
      { input: '0, 3', expectedOutput: '{"finalCount":3,"testPassed":true}', isHidden: false }
    ]
  },
  {
    id: "fe-test-016",
    title: "Test a Context Provider Consumer Integration",
    slug: "fe-test-context-provider",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Testing Context",
    category: "frontend",
    tags: ["fe-testing", "context", "testing"],
    xpReward: 100,
    description: `## Test a Context Provider Consumer Integration

### Description
Wrap a consumer component with \`<AuthContext.Provider value={{ user: "Alex" }}>\` and assert that the child renders \`"Welcome, Alex"\`.

### Learning Objectives
- Render test components within custom context provider wrappers.

### Example
\`Input: "Alex"\`
\`Output: "Welcome, Alex"\``,
    starterCode: {
      javascript: `function testContextProviderRender(user) {
  return \`Welcome, \${user}\`;
}`,
      python: `def test_context_provider_render(user):
    return f'Welcome, {user}'`
    },
    testCases: [
      { input: '"Alex"', expectedOutput: '"Welcome, Alex"', isHidden: false },
      { input: '"Guest"', expectedOutput: '"Welcome, Guest"', isHidden: false }
    ]
  },
  {
    id: "fe-test-017",
    title: "Test Protected Route Redirect",
    slug: "fe-test-protected-route",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Testing Routing",
    category: "frontend",
    tags: ["fe-testing", "routing", "auth"],
    xpReward: 100,
    description: `## Test Protected Route Redirect

### Description
Test that navigating to \`"/dashboard"\` while unauthenticated renders the \`<Navigate to="/login" />\` redirect component.

### Learning Objectives
- Assert navigation redirect side effects using MemoryRouter.

### Example
\`Input: false, "/dashboard"\`
\`Output: { redirected: true, targetPath: "/login" }\``,
    starterCode: {
      javascript: `function testRouteGuard(isAuthenticated, path) {
  if (!isAuthenticated && path === '/dashboard') {
    return { redirected: true, targetPath: '/login' };
  }
  return { redirected: false, targetPath: path };
}`,
      python: `def test_route_guard(is_authenticated, path):
    if not is_authenticated and path == '/dashboard':
        return {'redirected': True, 'targetPath': '/login'}
    return {'redirected': False, 'targetPath': path}`
    },
    testCases: [
      { input: 'false, "/dashboard"', expectedOutput: '{"redirected":true,"targetPath":"/login"}', isHidden: false },
      { input: 'true, "/dashboard"', expectedOutput: '{"redirected":false,"targetPath":"/dashboard"}', isHidden: false }
    ]
  },
  {
    id: "fe-test-018",
    title: "Test Pagination Navigation Controls",
    slug: "fe-test-pagination-navigation",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "pagination", "navigation"],
    xpReward: 100,
    description: `## Test Pagination Navigation Controls

### Description
Test pagination buttons:
- On page 1: "Previous" button must be \`disabled: true\`
- On page 2 of 2: "Next" button must be \`disabled: true\`
Given currentPage and totalPages, return button disabled states.

### Learning Objectives
- Verify UI control disabled states across edge boundaries.

### Example
\`Input: 1, 5\`
\`Output: { prevDisabled: true, nextDisabled: false }\`
\`Input: 5, 5\`
\`Output: { prevDisabled: false, nextDisabled: true }\``,
    starterCode: {
      javascript: `function testPaginationButtons(currentPage, totalPages) {
  return {
    prevDisabled: currentPage <= 1,
    nextDisabled: currentPage >= totalPages
  };
}`,
      python: `def test_pagination_buttons(current_page, total_pages):
    return {
        'prevDisabled': current_page <= 1,
        'nextDisabled': current_page >= total_pages
    }`
    },
    testCases: [
      { input: '1, 5', expectedOutput: '{"prevDisabled":true,"nextDisabled":false}', isHidden: false },
      { input: '5, 5', expectedOutput: '{"prevDisabled":false,"nextDisabled":true}', isHidden: false }
    ]
  },
  {
    id: "fe-test-019",
    title: "Test Infinite Scroll Sentinel Trigger",
    slug: "fe-test-infinite-scroll-trigger",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "infinite-scroll", "intersection-observer"],
    xpReward: 100,
    description: `## Test Infinite Scroll Sentinel Trigger

### Description
Using mock \`IntersectionObserver\`, test that when the bottom sentinel element becomes intersecting (\`isIntersecting: true\`), the \`fetchNextPage()\` mock is invoked.

### Learning Objectives
- Test browser observer events triggering component data fetching.

### Example
\`Input: true\`
\`Output: { fetchCalled: true }\`
\`Input: false\`
\`Output: { fetchCalled: false }\``,
    starterCode: {
      javascript: `function testSentinelIntersection(isIntersecting) {
  return { fetchCalled: isIntersecting };
}`,
      python: `def test_sentinel_intersection(is_intersecting):
    return {'fetchCalled': is_intersecting}`
    },
    testCases: [
      { input: 'true', expectedOutput: '{"fetchCalled":true}', isHidden: false },
      { input: 'false', expectedOutput: '{"fetchCalled":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-020",
    title: "Test an E-commerce Cart Calculations",
    slug: "fe-test-ecommerce-cart-calculations",
    tier: 4,
    section: "Testing",
    topic: "Testing Practice",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Unit Testing",
    category: "frontend",
    tags: ["fe-testing", "cart", "unit-testing"],
    xpReward: 100,
    description: `## Test an E-commerce Cart Calculations

### Description
Unit test shopping cart arithmetic with tax rate (10%) and discount coupons:
\`subtotal = sum(price * qty)\`
\`discountAmount = subtotal * (discountPercent / 100)\`
\`tax = (subtotal - discountAmount) * 0.1\`
\`total = Math.round(subtotal - discountAmount + tax)\`
Return computed total.

### Learning Objectives
- Write deterministic financial calculation test fixtures.

### Example
\`Input: [{ price: 100, qty: 1 }], 20\`
\`Output: 88\` (Subtotal: 100; discount: 20 -> 80; tax 10% on 80 = 8 -> Total: 88)`,
    starterCode: {
      javascript: `function testCartCalculation(items, discountPercent) {
  const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);
  const discount = subtotal * (discountPercent / 100);
  const tax = (subtotal - discount) * 0.1;
  return Math.round(subtotal - discount + tax);
}`,
      python: `def test_cart_calculation(items, discount_percent):
    subtotal = sum(i['price'] * i['qty'] for i in items)
    discount = subtotal * (discount_percent / 100.0)
    tax = (subtotal - discount) * 0.1
    return round(subtotal - discount + tax)`
    },
    testCases: [
      { input: '[{"price":100,"qty":1}], 20', expectedOutput: '88', isHidden: false },
      { input: '[{"price":50,"qty":2}], 0', expectedOutput: '110', isHidden: false }
    ]
  },

  // ─── Additional Core Testing Topics (21-25) ───
  {
    id: "fe-test-021",
    title: "Visual Regression Image Snapshot Differ",
    slug: "fe-visual-regression-differ",
    tier: 4,
    section: "Testing",
    topic: "Visual Regression Testing",
    difficulty: "advanced",
    originalDifficulty: "Hard",
    pattern: "Regression Testing",
    category: "frontend",
    tags: ["fe-testing", "visual-regression", "snapshots"],
    xpReward: 200,
    description: `## Visual Regression Image Snapshot Differ

### Description
Visual regression tools compare pixel buffers between baseline and current screenshots.
Given differing pixel count and total pixels, return mismatch percentage: \`diffPct = (diffPixels / totalPixels) * 100\`.
If diffPct <= 0.1%, test passes.

### Learning Objectives
- Configure pixel tolerance thresholds in visual regression suites.

### Example
\`Input: 50, 100000\`
\`Output: { diffPct: 0.05, pass: true }\``,
    starterCode: {
      javascript: `function evaluateVisualDiff(diffPixels, totalPixels) {
  const diffPct = parseFloat(((diffPixels / totalPixels) * 100).toFixed(2));
  return {
    diffPct,
    pass: diffPct <= 0.1
  };
}`,
      python: `def evaluate_visual_diff(diff_pixels, total_pixels):
    diff_pct = round((diff_pixels / total_pixels) * 100, 2)
    return {
        'diffPct': diff_pct,
        'pass': diff_pct <= 0.1
    }`
    },
    testCases: [
      { input: '50, 100000', expectedOutput: '{"diffPct":0.05,"pass":true}', isHidden: false },
      { input: '500, 100000', expectedOutput: '{"diffPct":0.5,"pass":false}', isHidden: false }
    ]
  },
  {
    id: "fe-test-022",
    title: "Test-Driven Development (TDD) Red-Green-Refactor Cycle",
    slug: "fe-tdd-cycle-simulator",
    tier: 4,
    section: "Testing",
    topic: "Test-Driven Development",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "TDD",
    category: "frontend",
    tags: ["fe-testing", "tdd", "methodology"],
    xpReward: 50,
    description: `## Test-Driven Development (TDD) Red-Green-Refactor Cycle

### Description
In TDD:
1. Write failing test (\`"RED"\`)
2. Write minimal code to pass (\`"GREEN"\`)
3. Improve code design (\`"REFACTOR"\`)
Given current stage in cycle, return next stage.

### Learning Objectives
- Internalize the disciplined TDD cycle.

### Example
\`Input: "RED"\`
\`Output: "GREEN"\`
\`Input: "GREEN"\`
\`Output: "REFACTOR"\``,
    starterCode: {
      javascript: `function getNextTddPhase(currentPhase) {
  const cycle = { RED: 'GREEN', GREEN: 'REFACTOR', REFACTOR: 'RED' };
  return cycle[currentPhase] || 'RED';
}`,
      python: `def get_next_tdd_phase(current_phase):
    cycle = {'RED': 'GREEN', 'GREEN': 'REFACTOR', 'REFACTOR': 'RED'}
    return cycle.get(current_phase, 'RED')`
    },
    testCases: [
      { input: '"RED"', expectedOutput: '"GREEN"', isHidden: false },
      { input: '"GREEN"', expectedOutput: '"REFACTOR"', isHidden: false },
      { input: '"REFACTOR"', expectedOutput: '"RED"', isHidden: true }
    ]
  },
  {
    id: "fe-test-023",
    title: "Testing User Interaction FireEvent vs UserEvent",
    slug: "fe-test-fire-event-vs-user-event",
    tier: 4,
    section: "Testing",
    topic: "Testing User Interactions",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "Component Testing",
    category: "frontend",
    tags: ["fe-testing", "user-event", "events"],
    xpReward: 100,
    description: `## Testing User Interaction FireEvent vs UserEvent

### Description
\`userEvent.click(btn)\` simulates real browser behavior by firing \`pointerDown\`, \`mouseDown\`, \`focus\`, and \`click\` in sequence, whereas \`fireEvent.click\` only dispatches a single synthetic event.
Return the sequence of events triggered by a realistic user click.

### Learning Objectives
- Understand why \`@testing-library/user-event\` is preferred over raw synthetic \`fireEvent\`.

### Example
\`Input: "button"\`
\`Output: ["pointerDown", "mouseDown", "focus", "click"]\``,
    starterCode: {
      javascript: `function getSimulatedClickEvents(elementType) {
  return ['pointerDown', 'mouseDown', 'focus', 'click'];
}`,
      python: `def get_simulated_click_events(element_type):
    return ['pointerDown', 'mouseDown', 'focus', 'click']`
    },
    testCases: [
      { input: '"button"', expectedOutput: '["pointerDown","mouseDown","focus","click"]', isHidden: false }
    ]
  },
  {
    id: "fe-test-024",
    title: "Test Fixture Factory Generator",
    slug: "fe-test-fixture-factory",
    tier: 4,
    section: "Testing",
    topic: "Fixtures",
    difficulty: "beginner",
    originalDifficulty: "Easy",
    pattern: "Unit Testing",
    category: "frontend",
    tags: ["fe-testing", "fixtures", "factories"],
    xpReward: 50,
    description: `## Test Fixture Factory Generator

### Description
Test factories create reproducible dummy data fixtures with sensible defaults overridden by partial inputs: \`createUserFixture({ role: "admin" })\`.

### Learning Objectives
- Prevent brittle tests with modular test data builders.

### Example
\`Input: { role: "admin" }\`
\`Output: { id: 1, name: "Test User", email: "test@example.com", role: "admin" }\``,
    starterCode: {
      javascript: `function createTestUserFixture(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  };
}`,
      python: `def create_test_user_fixture(overrides=None):
    base = {
        'id': 1,
        'name': 'Test User',
        'email': 'test@example.com',
        'role': 'user'
    }
    if overrides:
        base.update(overrides)
    return base`
    },
    testCases: [
      { input: '{"role":"admin"}', expectedOutput: '{"id":1,"name":"Test User","email":"test@example.com","role":"admin"}', isHidden: false },
      { input: '{}', expectedOutput: '{"id":1,"name":"Test User","email":"test@example.com","role":"user"}', isHidden: false }
    ]
  },
  {
    id: "fe-test-025",
    title: "E2E Test Execution Summary Reporter",
    slug: "fe-e2e-summary-reporter",
    tier: 4,
    section: "Testing",
    topic: "End-to-End Testing",
    difficulty: "intermediate",
    originalDifficulty: "Medium",
    pattern: "E2E Testing",
    category: "frontend",
    tags: ["fe-testing", "e2e", "cypress", "playwright"],
    xpReward: 100,
    description: `## E2E Test Execution Summary Reporter

### Description
In Playwright or Cypress E2E test runs, calculate aggregate statistics from an array of test suite results \`[{ name: "Auth", passed: 5, failed: 0, skipped: 1 }]\`:
\`{ totalTests, passed, failed, skipped, passRate }\`.

### Learning Objectives
- Process end-to-end continuous integration test reports.

### Example
\`Input: [{ passed: 10, failed: 0, skipped: 0 }]\`
\`Output: { total: 10, passed: 10, failed: 0, skipped: 0, passRate: 100 }\``,
    starterCode: {
      javascript: `function summarizeE2ERun(suites) {
  let passed = 0, failed = 0, skipped = 0;
  for (const s of suites) {
    passed += s.passed;
    failed += s.failed;
    skipped += s.skipped;
  }
  const total = passed + failed + skipped;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  return { total, passed, failed, skipped, passRate };
}`,
      python: `def summarize_e2e_run(suites):
    passed = sum(s.get('passed', 0) for s in suites)
    failed = sum(s.get('failed', 0) for s in suites)
    skipped = sum(s.get('skipped', 0) for s in suites)
    total = passed + failed + skipped
    pass_rate = round((passed / total) * 100) if total > 0 else 0
    return {
        'total': total,
        'passed': passed,
        'failed': failed,
        'skipped': skipped,
        'passRate': pass_rate
    }`
    },
    testCases: [
      { input: '[{"passed":10,"failed":0,"skipped":0}]', expectedOutput: '{"total":10,"passed":10,"failed":0,"skipped":0,"passRate":100}', isHidden: false },
      { input: '[{"passed":8,"failed":2,"skipped":0}]', expectedOutput: '{"total":10,"passed":8,"failed":2,"skipped":0,"passRate":80}', isHidden: false }
    ]
  }
];

module.exports = feTier4Testing;
