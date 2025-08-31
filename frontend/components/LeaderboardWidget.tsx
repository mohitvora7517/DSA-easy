'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Crown, Star, Zap, Flame } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  username: string
  level: number
  xp: number
  totalPoints: number
  currentStreak: number
  longestStreak: number
  avatar: string
}

interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[]
}

export default function LeaderboardWidget({ leaderboard }: LeaderboardWidgetProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
          {rank}
        </span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Global Leaderboard</h3>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.username}
            className={`flex items-center space-x-4 p-4 rounded-lg ${
              entry.rank <= 3 ? 'bg-gradient-to-r from-white to-gray-50 shadow-md' : 'bg-gray-50'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                entry.rank <= 3 ? getRankColor(entry.rank) : 'bg-primary-500'
              }`}>
                {entry.username.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 truncate">
                  {entry.username}
                </h4>
                {entry.rank <= 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    Top {entry.rank}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>Level {entry.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{entry.totalPoints} pts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>{entry.currentStreak} days</span>
                </div>
              </div>
            </div>

            {/* XP */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="font-medium">{entry.xp}</span>
              </div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          </motion.div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No leaderboard data available</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Rankings are updated in real-time based on total points and XP
        </p>
      </div>
    </div>
  )
}