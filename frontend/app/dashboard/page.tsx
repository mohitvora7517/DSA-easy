'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { useRouter } from 'next/navigation'
import { 
  Trophy, 
  Target, 
  Zap, 
  Users, 
  LogOut, 
  Settings,
  Play,
  Star,
  Flame,
  TrendingUp
} from 'lucide-react'
import LevelCard from '@/components/LevelCard'
import ProgressBar from '@/components/ProgressBar'
import AchievementBadge from '@/components/AchievementBadge'
import LeaderboardWidget from '@/components/LeaderboardWidget'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { levels, leaderboard } = useGame()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('levels')

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const unlockedLevels = levels.filter(level => level.isUnlocked)
  const lockedLevels = levels.filter(level => !level.isUnlocked)

  const nextLevelXP = (user?.level || 1) * 100
  const currentLevelXP = ((user?.level || 1) - 1) * 100
  const progressPercentage = ((user?.xp || 0) - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">DSA Game Platform</h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Level {user?.level}</span>
                <span>•</span>
                <span>{user?.xp} XP</span>
                <span>•</span>
                <span>{user?.currentStreak} day streak</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="bg-game-gradient rounded-2xl p-8 mb-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username}! 🎮
              </h2>
              <p className="text-white/90 mb-4">
                Ready to continue your coding adventure?
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>{user?.totalPoints} points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span>{user?.currentStreak} day streak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Level {user?.level}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{user?.level}</div>
                <div className="text-white/80">Current Level</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* XP Progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <ProgressBar
              progress={progressPercentage}
              current={user?.xp || 0}
              max={nextLevelXP}
              label="XP"
            />
            <p className="text-sm text-gray-600 mt-2">
              {nextLevelXP - (user?.xp || 0)} XP to next level
            </p>
          </div>

          {/* Streak */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {user?.currentStreak} days
            </div>
            <p className="text-sm text-gray-600">
              Best streak: {user?.longestStreak} days
            </p>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Points:</span>
                <span className="font-semibold">{user?.totalPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Problems Solved:</span>
                <span className="font-semibold">{user?.completedProblems?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Achievements:</span>
                <span className="font-semibold">{user?.achievements?.length || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'levels', label: 'Levels', icon: Target },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'leaderboard', label: 'Leaderboard', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'levels' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Unlocked Levels */}
            {unlockedLevels.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Levels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlockedLevels.map((level, index) => (
                    <LevelCard
                      key={level._id}
                      level={level}
                      index={index}
                      isUnlocked={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Locked Levels */}
            {lockedLevels.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Locked Levels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedLevels.slice(0, 3).map((level, index) => (
                    <LevelCard
                      key={level._id}
                      level={level}
                      index={index}
                      isUnlocked={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.achievements?.map((achievement, index) => (
                  <AchievementBadge
                    key={index}
                    achievement={achievement.achievementId}
                    unlockedAt={achievement.unlockedAt}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LeaderboardWidget leaderboard={leaderboard} />
          </motion.div>
        )}
      </div>
    </div>
  )
}