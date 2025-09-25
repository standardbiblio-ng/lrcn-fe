import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { paths } from '../paths'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { auth } = useAuthStore()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />
  }

  //   const getFallbackPath = () => {
  //     if (auth.user?.defaultPassword) {
  //       return paths.dashboard.newPassword
  //     }

  //     if (auth.user?.role === UserRole.FARMER) {
  //       return paths.dashboard.home.getStarted
  //     }
  //     return paths.dashboard.home.overview
  //   }

  //   if (!hasRouteAccess(user?.role as UserRole, location.pathname)) {
  //     return <Navigate to={getFallbackPath()} replace />
  //   }

  return <>{children}</>
}
