'use client'

import { motion } from 'framer-motion'
import { Clock, Target, Lightbulb, AlertCircle } from 'lucide-react'

interface Problem {
  _id: string
  title: string
  description: string
  difficulty: string
  category: string
  points: number
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints: string[]
  hints: string[]
}

interface ProblemDescriptionProps {
  problem: Problem
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      case 'expert': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arrays': return '📊'
      case 'strings': return '📝'
      case 'linked-lists': return '🔗'
      case 'trees': return '🌳'
      case 'graphs': return '🕸️'
      case 'dynamic-programming': return '⚡'
      case 'sorting': return '🔄'
      case 'searching': return '🔍'
      case 'math': return '🔢'
      case 'greedy': return '💎'
      default: return '🎯'
    }
  }

  return (
    <div className="space-y-6">
      {/* Problem Header */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {problem.title}
            </h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-gray-600">
                <span>{getCategoryIcon(problem.category)}</span>
                <span className="capitalize">{problem.category}</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-600">
                <Target className="w-4 h-4" />
                <span>{problem.points} points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>
      </motion.div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
          <div className="space-y-4">
            {problem.examples.map((example, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Input:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{example.input}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Output:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{example.output}</code>
                    </pre>
                  </div>
                </div>
                {example.explanation && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Explanation:</h4>
                    <p className="text-sm text-gray-600">{example.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Constraints
          </h3>
          <ul className="space-y-2">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-orange-500 mt-1">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Hints */}
      {problem.hints && problem.hints.length > 0 && (
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Hints
          </h3>
          <div className="space-y-3">
            {problem.hints.map((hint, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600 font-bold text-sm">{index + 1}.</span>
                  <p className="text-sm text-gray-700">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}