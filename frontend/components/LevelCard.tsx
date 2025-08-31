'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lock, Play, Star, Clock, Target } from 'lucide-react'

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
  problems: any[]
}

interface LevelCardProps {
  level: Level
  index: number
  isUnlocked: boolean
}

export default function LevelCard({ level, index, isUnlocked }: LevelCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/level/${level._id}`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-orange-600 bg-orange-100'
      case 'expert': return 'text-red-600 bg-red-100'
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
      default: return '🎯'
    }
  }

  return (
    <motion.div
      className={`level-card ${isUnlocked ? 'level-unlocked' : 'level-locked'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      onClick={handleClick}
    >
      <div 
        className="relative p-6 h-full"
        style={{ 
          background: isUnlocked 
            ? `linear-gradient(135deg, ${level.color}20, ${level.color}10)`
            : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
        }}
      >
        {/* Lock overlay for locked levels */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Locked</p>
            </div>
          </div>
        )}

        {/* Level number and icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: isUnlocked ? level.color : '#9ca3af' }}
            >
              {level.levelNumber}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{level.title}</h3>
              <p className="text-sm text-gray-600">{getCategoryIcon(level.category)} {level.category}</p>
            </div>
          </div>
          {isUnlocked && (
            <Play className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {level.description}
        </p>

        {/* Difficulty badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(level.difficulty)}`}>
            {level.difficulty}
          </span>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Target className="w-4 h-4" />
            <span>{level.problems?.length || 0} problems</span>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="w-4 h-4" />
              <span>{level.pointsReward} pts</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Zap className="w-4 h-4" />
              <span>{level.xpReward} XP</span>
            </div>
          </div>
          {isUnlocked && (
            <motion.button
              className="btn-primary text-xs px-3 py-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}