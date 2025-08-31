'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  current: number
  max: number
  label: string
  color?: string
  showNumbers?: boolean
}

export default function ProgressBar({ 
  progress, 
  current, 
  max, 
  label, 
  color = 'bg-primary-500',
  showNumbers = true 
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {showNumbers && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{current} {label}</span>
          <span>{max} {label}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showNumbers && (
        <div className="text-right text-xs text-gray-500 mt-1">
          {Math.round(progress)}% complete
        </div>
      )}
    </div>
  )
}