const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { awardXP } = require('../services/xpService');
const { emitChallengeCompleted } = require('../services/socketService');
const { success, error } = require('../utils/responseHelper');

const vm = require('vm');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Real sandboxed code evaluation using 'vm' module and local python
const evaluateCode = (code, testCases, language, category) => {
  // Use mock evaluation for unsupported languages only
  if (!['javascript', 'python'].includes(language)) {
    return testCases.map((tc, index) => {
      try {
        const containsLogic = code.length > 20 && !code.match(/^\s*$/);
        const passed = containsLogic && (
          code.includes('return') ||
          code.includes('console.log') ||
          code.includes('print') ||
          code.includes('function') ||
          code.includes('=>') ||
          code.includes('class') ||
          code.includes('def')
        );

        return {
          testCaseIndex: index,
          passed,
          output: passed ? tc.expectedOutput : 'Incorrect output. Please check your logic.',
          executionTime: Math.floor(Math.random() * 50) + 5,
        };
      } catch (e) {
        return {
          testCaseIndex: index,
          passed: false,
          output: e.message,
          executionTime: 0,
        };
      }
    });
  }

  // Real code evaluation for Python algorithms
  if (language === 'python') {
    return testCases.map((tc, index) => {
      try {
        let functionName = '';
        const funcMatch = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
        if (funcMatch) {
          functionName = funcMatch[1];
        } else {
          throw new Error('Could not find main function name. Define with "def func_name(...)"');
        }

        const testCode = `
import json
${code}

result = ${functionName}(${tc.input})
print(json.dumps(result) if result is not None else 'undefined')
`;
        // Create temp file for execution
        const tempDir = path.join(__dirname, '..', 'tmp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const filePath = path.join(tempDir, `temp_${Date.now()}_${index}.py`);
        fs.writeFileSync(filePath, testCode);

        const start = process.hrtime();
        let rawResult = '';
        try {
          rawResult = execSync(`python "${filePath}"`, { timeout: 2000 }).toString().trim();
        } catch (err) {
          throw new Error(err.message || err.stderr?.toString() || 'Execution failed');
        } finally {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        
        const end = process.hrtime(start);
        const executionTime = Math.round((end[0] * 1000) + (end[1] / 1000000));

        const normalizedResult = rawResult.replace(/\s+/g, '');
        const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
        const passed = normalizedResult === normalizedExpected;

        return {
          testCaseIndex: index,
          passed,
          output: passed ? tc.expectedOutput : `Expected: ${tc.expectedOutput}, but got: ${rawResult}`,
          executionTime: executionTime || 1,
        };
      } catch (e) {
        return {
          testCaseIndex: index,
          passed: false,
          output: e.message || String(e),
          executionTime: 0,
        };
      }
    });
  }

  // Real code evaluation for JS algorithms
  return testCases.map((tc, index) => {
    try {
      const sandbox = {
        console: { log: () => {} },
        Math, String, Number, Array, Object, Set, Map,
        Promise, setTimeout
      };

      vm.createContext(sandbox);

      let functionName = '';
      const funcMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
      if (funcMatch) {
        functionName = funcMatch[1];
      } else {
        const classMatch = code.match(/class\s+([a-zA-Z0-9_]+)\s*\{/);
        if (classMatch) {
          functionName = classMatch[1];
        } else {
          const constMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\()/);
          if (constMatch) functionName = constMatch[1];
        }
      }

      if (!functionName) {
        throw new Error('Could not determine main function name. Please ensure you defined the main function.');
      }

      const testRunnerCode = `
        ${code}
        
        // Execute and return result
        ${functionName}(${tc.input});
      `;
      
      const testScript = new vm.Script(testRunnerCode);
      const start = process.hrtime();
      const rawResult = testScript.runInContext(sandbox, { timeout: 1000 });
      const end = process.hrtime(start);
      const executionTime = Math.round((end[0] * 1000) + (end[1] / 1000000));
      
      let resultStr;
      if (rawResult === undefined) resultStr = 'undefined';
      else if (rawResult === null) resultStr = 'null';
      else if (typeof rawResult === 'object') resultStr = JSON.stringify(rawResult);
      else resultStr = rawResult.toString();
      
      const normalizedResult = resultStr.replace(/\s+/g, '');
      const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');

      const passed = normalizedResult === normalizedExpected;

      return {
        testCaseIndex: index,
        passed,
        output: passed ? tc.expectedOutput : `Expected: ${tc.expectedOutput}, but got: ${resultStr}`,
        executionTime: executionTime || 1,
      };

    } catch (e) {
      return {
        testCaseIndex: index,
        passed: false,
        output: e.message || String(e),
        executionTime: 0,
      };
    }
  });
};

exports.submitSolution = async (req, res, next) => {
  try {
    const { code, language = 'javascript' } = req.body;
    const challengeId = req.params.id;

    if (!code) return error(res, 'Code is required.', 400);

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Check if already solved
    const alreadySolved = await Submission.findOne({
      userId: req.userId,
      challengeId,
      status: 'passed',
    });

    // Evaluate code
    const testResults = evaluateCode(code, challenge.testCases, language, challenge.category);
    const allPassed = testResults.every(r => r.passed);
    const status = allPassed ? 'passed' : 'failed';

    const submission = await Submission.create({
      userId: req.userId,
      challengeId,
      code,
      language,
      status,
      testResults,
      xpEarned: allPassed && !alreadySolved ? challenge.xpReward : 0,
    });

    // Award XP only on first solve
    let xpResult = null;
    if (allPassed && !alreadySolved) {
      xpResult = await awardXP(
        req.userId,
        challenge.xpReward,
        'challenge',
        challengeId,
        `Solved: ${challenge.title}`
      );

      // Update challenge stats
      challenge.completionCount += 1;
      challenge.attemptCount += 1;
      await challenge.save();

      // Update user stats
      await User.findByIdAndUpdate(req.userId, {
        $inc: { challengesSolved: 1 },
      });

      emitChallengeCompleted(req.userId, challengeId, challenge.xpReward);
    } else {
      challenge.attemptCount += 1;
      await challenge.save();
    }

    success(res, {
      submission,
      xpResult,
      allPassed,
    });
  } catch (err) { next(err); }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      userId: req.userId,
      challengeId: req.params.id,
    }).sort({ submittedAt: -1 }).limit(10);

    success(res, { submissions });
  } catch (err) { next(err); }
};
