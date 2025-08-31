'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { loading: gameLoading } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !gameLoading && user) {
      // User is authenticated, show dashboard
      // No need to redirect, just show dashboard component
    }
  }, [user, authLoading, gameLoading, router])

  if (authLoading || gameLoading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Dashboard />
  }

  return <LandingPage />
}