import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// import { paths } from 'src/routes/paths'
import { useAuthStore } from '@/stores/auth-store'
import { paths } from '../paths'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { auth } = useAuthStore()
  const location = useLocation()

  if (auth.isAuthenticated) {
    // Redirect to dashboard if user is already logged in
    return (
      <Navigate to={paths.dashboard.root} state={{ from: location }} replace />
    )
  }

  return <>{children}</>
}
