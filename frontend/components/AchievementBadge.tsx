'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Target, Flame, Crown } from 'lucide-react'

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

interface AchievementBadgeProps {
  achievement: Achievement
  unlockedAt: string
}

export default function AchievementBadge({ achievement, unlockedAt }: AchievementBadgeProps) {
  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'achievement-common border-gray-300'
      case 'uncommon':
        return 'achievement-uncommon border-green-300'
      case 'rare':
        return 'achievement-rare border-blue-300'
      case 'epic':
        return 'achievement-epic border-purple-300'
      case 'legendary':
        return 'achievement-legendary border-yellow-300'
      default:
        return 'achievement-common border-gray-300'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />
      case 'uncommon': return <Target className="w-4 h-4" />
      case 'rare': return <Trophy className="w-4 h-4" />
      case 'epic': return <Crown className="w-4 h-4" />
      case 'legendary': return <Zap className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      className={`achievement-badge border-2 p-4 rounded-lg ${getRarityStyles(achievement.rarity)}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
            {getRarityIcon(achievement.rarity)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
            <span className="text-xs opacity-75 capitalize">({achievement.rarity})</span>
          </div>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {achievement.description}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-yellow-600">
                <Star className="w-3 h-3" />
                <span>{achievement.pointsReward}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Zap className="w-3 h-3" />
                <span>{achievement.xpReward}</span>
              </div>
            </div>
            <span className="text-gray-500">
              {formatDate(unlockedAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}