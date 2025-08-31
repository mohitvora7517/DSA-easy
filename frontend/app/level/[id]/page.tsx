'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Play, RotateCcw, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'
import ProblemDescription from '@/components/ProblemDescription'
import TestResults from '@/components/TestResults'
import axios from 'axios'
import toast from 'react-hot-toast'

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
  starterCode: {
    javascript: string
    python: string
    java: string
    cpp: string
  }
  testCases: Array<{
    input: any
    expectedOutput: any
    description: string
    isHidden: boolean
  }>
  constraints: string[]
  hints: string[]
}

interface Level {
  _id: string
  levelNumber: number
  title: string
  description: string
  category: string
  difficulty: string
  xpReward: number
  pointsReward: number
  problems: Problem[]
}

export default function LevelPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [level, setLevel] = useState<Level | null>(null)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadLevel(params.id as string)
    }
  }, [params.id])

  const loadLevel = async (levelId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/levels/${levelId}`)
      const levelData = response.data
      setLevel(levelData)
      
      if (levelData.problems && levelData.problems.length > 0) {
        setCurrentProblem(levelData.problems[0])
        setCode(levelData.problems[0].starterCode[language] || '')
      }
    } catch (error) {
      console.error('Failed to load level:', error)
      toast.error('Failed to load level')
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (currentProblem) {
      setCode(currentProblem.starterCode[newLanguage] || '')
    }
  }

  const handleRunCode = async () => {
    if (!currentProblem || !code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setIsRunning(true)
    setTestResults(null)

    try {
      const response = await axios.post('http://localhost:5000/api/code/run', {
        code,
        language,
        problemId: currentProblem._id
      })

      setTestResults(response.data)
      
      if (response.data.allPassed) {
        toast.success('All tests passed! 🎉')
        // Submit solution for points
        await submitSolution(true)
      } else {
        toast.error('Some tests failed. Keep trying! 💪')
      }
    } catch (error: any) {
      console.error('Code execution error:', error)
      toast.error(error.response?.data?.message || 'Code execution failed')
    } finally {
      setIsRunning(false)
    }
  }

  const submitSolution = async (isCorrect: boolean) => {
    if (!currentProblem) return

    try {
      const response = await axios.post('http://localhost:5000/api/progress/submit', {
        problemId: currentProblem._id,
        solution: code,
        language,
        isCorrect,
        executionTime: testResults?.executionTime || 0
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (response.data.levelUp) {
        toast.success(`Level Up! You're now level ${response.data.newLevel}! 🚀`)
      }

      if (response.data.newAchievements?.length > 0) {
        response.data.newAchievements.forEach((achievement: any) => {
          toast.success(`Achievement Unlocked: ${achievement.name}! 🏆`)
        })
      }
    } catch (error) {
      console.error('Failed to submit solution:', error)
    }
  }

  const resetCode = () => {
    if (currentProblem) {
      setCode(currentProblem.starterCode[language] || '')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading level...</p>
        </div>
      </div>
    )
  }

  if (!level || !currentProblem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Level not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Level {level.levelNumber}: {level.title}
                </h1>
                <p className="text-sm text-gray-600">{level.category} • {level.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.xp || 0} XP</span>
                <span className="mx-2">•</span>
                <span className="font-medium">{user?.totalPoints || 0} points</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <ProblemDescription problem={currentProblem} />
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            {/* Editor Controls */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>

              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height="400px"
              />

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={resetCode}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || !code.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Results */}
            {testResults && (
              <TestResults results={testResults} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}