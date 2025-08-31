const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const Problem = require('../models/Problem');
const router = express.Router();

// Create a temporary directory for code execution
const TEMP_DIR = path.join(__dirname, '../temp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Run code
router.post('/run', async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Execute code with test cases
    const result = await executeCode(code, language, problem.testCases);

    res.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ message: 'Code execution failed', error: error.message });
  }
});

async function executeCode(code, language, testCases) {
  const startTime = Date.now();
  const results = [];
  let allPassed = true;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testStartTime = Date.now();

    try {
      let result;
      
      switch (language) {
        case 'javascript':
          result = await executeJavaScript(code, testCase.input);
          break;
        case 'python':
          result = await executePython(code, testCase.input);
          break;
        case 'java':
          result = await executeJava(code, testCase.input);
          break;
        case 'cpp':
          result = await executeCpp(code, testCase.input);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      const testEndTime = Date.now();
      const executionTime = testEndTime - testStartTime;

      const passed = JSON.stringify(result.output) === JSON.stringify(testCase.expectedOutput);

      if (!passed) {
        allPassed = false;
      }

      results.push({
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output,
        executionTime,
        error: result.error,
        isHidden: testCase.isHidden
      });

    } catch (error) {
      const testEndTime = Date.now();
      const executionTime = testEndTime - testStartTime;

      allPassed = false;
      results.push({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        executionTime,
        error: error.message,
        isHidden: testCase.isHidden
      });
    }
  }

  const totalTime = Date.now() - startTime;

  return {
    allPassed,
    totalTests: testCases.length,
    passedTests: results.filter(r => r.passed).length,
    failedTests: results.filter(r => !r.passed).length,
    executionTime: totalTime,
    testResults: results
  };
}

async function executeJavaScript(code, input) {
  return new Promise((resolve, reject) => {
    const inputStr = JSON.stringify(input);
    const wrappedCode = `
      const input = ${inputStr};
      
      ${code}
      
      // Try to find the main function or use the last expression
      let result;
      try {
        if (typeof solution === 'function') {
          result = solution(input);
        } else if (typeof solve === 'function') {
          result = solve(input);
        } else {
          // Try to evaluate the last expression
          const lines = \`${code}\`.split('\\n');
          const lastLine = lines[lines.length - 1].trim();
          if (lastLine && !lastLine.includes('function') && !lastLine.includes('const') && !lastLine.includes('let') && !lastLine.includes('var')) {
            result = eval(lastLine);
          } else {
            throw new Error('No solution function found. Please define a function called "solution" or "solve"');
          }
        }
        console.log(JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
      }
    `;

    const child = spawn('node', ['-e', wrappedCode], {
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Execution failed'));
      } else {
        try {
          const result = JSON.parse(output.trim());
          resolve({ output: result, error: null });
        } catch (parseError) {
          resolve({ output: output.trim(), error: null });
        }
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function executePython(code, input) {
  return new Promise((resolve, reject) => {
    const inputStr = JSON.stringify(input);
    const wrappedCode = `
import json
import sys

input_data = ${inputStr}

${code}

# Try to find the main function
try:
    if 'solution' in globals():
        result = solution(input_data)
    elif 'solve' in globals():
        result = solve(input_data)
    else:
        # Try to execute the last line if it's not a function definition
        lines = \`${code}\`.split('\\n')
        last_line = lines[-1].strip()
        if last_line and not last_line.startswith('def ') and not last_line.startswith('class '):
            result = eval(last_line)
        else:
            raise Exception('No solution function found. Please define a function called "solution" or "solve"')
    
    print(json.dumps(result))
except Exception as e:
    print(f'Error: {str(e)}', file=sys.stderr)
    sys.exit(1)
`;

    const child = spawn('python3', ['-c', wrappedCode], {
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Execution failed'));
      } else {
        try {
          const result = JSON.parse(output.trim());
          resolve({ output: result, error: null });
        } catch (parseError) {
          resolve({ output: output.trim(), error: null });
        }
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function executeJava(code, input) {
  // Java execution is more complex and requires compilation
  // For now, return a placeholder
  return new Promise((resolve, reject) => {
    reject(new Error('Java execution not implemented yet'));
  });
}

async function executeCpp(code, input) {
  // C++ execution is more complex and requires compilation
  // For now, return a placeholder
  return new Promise((resolve, reject) => {
    reject(new Error('C++ execution not implemented yet'));
  });
}

module.exports = router;