'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap } from 'lucide-react'

interface TestResult {
  passed: boolean
  input: any
  expectedOutput: any
  actualOutput: any
  executionTime: number
  error?: string
  isHidden: boolean
}

interface TestResultsProps {
  results: {
    allPassed: boolean
    totalTests: number
    passedTests: number
    failedTests: number
    executionTime: number
    testResults: TestResult[]
    error?: string
  }
}

export default function TestResults({ results }: TestResultsProps) {
  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  const getStatusColor = (passed: boolean) => {
    return passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
  }

  const getStatusText = (passed: boolean) => {
    return passed ? 'PASSED' : 'FAILED'
  }

  const getStatusTextColor = (passed: boolean) => {
    return passed ? 'text-green-700' : 'text-red-700'
  }

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {results.executionTime}ms
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {results.passedTests}/{results.totalTests} passed
            </span>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${
        results.allPassed 
          ? 'border-green-200 bg-green-50' 
          : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-center space-x-3">
          {results.allPassed ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <div>
            <h4 className={`font-semibold ${
              results.allPassed ? 'text-green-700' : 'text-red-700'
            }`}>
              {results.allPassed ? 'All Tests Passed! 🎉' : 'Some Tests Failed'}
            </h4>
            <p className={`text-sm ${
              results.allPassed ? 'text-green-600' : 'text-red-600'
            }`}>
              {results.allPassed 
                ? 'Great job! Your solution is correct.'
                : `Failed ${results.failedTests} out of ${results.totalTests} tests.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {results.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-700 mb-1">Runtime Error</h4>
              <p className="text-sm text-red-600">{results.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Individual Test Results */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Test Cases:</h4>
        {results.testResults.map((test, index) => (
          <motion.div
            key={index}
            className={`border rounded-lg p-4 ${getStatusColor(test.passed)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.passed)}
                <span className={`font-medium ${getStatusTextColor(test.passed)}`}>
                  Test Case {index + 1} - {getStatusText(test.passed)}
                </span>
                {test.isHidden && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{test.executionTime}ms</span>
              </div>
            </div>

            {!test.isHidden && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Input:</h5>
                  <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                    <code>{JSON.stringify(test.input)}</code>
                  </pre>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Expected:</h5>
                  <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                    <code>{JSON.stringify(test.expectedOutput)}</code>
                  </pre>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Actual:</h5>
                  <pre className={`p-2 rounded border text-xs overflow-x-auto ${
                    test.passed ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <code>{JSON.stringify(test.actualOutput)}</code>
                  </pre>
                </div>
              </div>
            )}

            {test.error && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                <h5 className="font-medium text-red-700 mb-1">Error:</h5>
                <p className="text-sm text-red-600">{test.error}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">{results.passedTests} passed</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">{results.failedTests} failed</span>
            </div>
          </div>
          <div className="text-gray-500">
            Total execution time: {results.executionTime}ms
          </div>
        </div>
      </div>
    </motion.div>
  )
}