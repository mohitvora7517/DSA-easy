'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Level {
  _id: string
  levelNumber: number
  title: string
  description: string
  category: string
  difficulty: string
  xpReward: number
  pointsReward: number
  icon: string
  color: string
  isUnlocked: boolean
  problems: Problem[]
}

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
}

interface Achievement {
  _id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  xpReward: number
  pointsReward: number
}

interface GameContextType {
  levels: Level[]
  currentLevel: Level | null
  achievements: Achievement[]
  leaderboard: any[]
  loading: boolean
  setCurrentLevel: (level: Level | null) => void
  refreshLevels: () => Promise<void>
  refreshAchievements: () => Promise<void>
  refreshLeaderboard: () => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [levels, setLevels] = useState<Level[]>([])
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGameData()
  }, [])

  const loadGameData = async () => {
    try {
      await Promise.all([
        refreshLevels(),
        refreshAchievements(),
        refreshLeaderboard()
      ])
    } catch (error) {
      console.error('Failed to load game data:', error)
      toast.error('Failed to load game data')
    } finally {
      setLoading(false)
    }
  }

  const refreshLevels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/levels`)
      setLevels(response.data)
    } catch (error) {
      console.error('Failed to load levels:', error)
    }
  }

  const refreshAchievements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/achievements`)
      setAchievements(response.data)
    } catch (error) {
      console.error('Failed to load achievements:', error)
    }
  }

  const refreshLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard/global?limit=10`)
      setLeaderboard(response.data)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    }
  }

  const value = {
    levels,
    currentLevel,
    achievements,
    leaderboard,
    loading,
    setCurrentLevel,
    refreshLevels,
    refreshAchievements,
    refreshLeaderboard
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}