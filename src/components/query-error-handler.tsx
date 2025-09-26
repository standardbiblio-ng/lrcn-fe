// components/query-error-handler.tsx
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

export function QueryErrorHandler() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event: any) => {
      if (event.type === 'error') {
        const error = event.error
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error('Session expired!')
            useAuthStore.getState().auth.reset()

            const redirect = window.location.pathname + window.location.search
            navigate(`/auth/login?redirect=${encodeURIComponent(redirect)}`, {
              replace: true,
            })
          }
          if (error.response?.status === 500) {
            toast.error('Internal Server Error!')
            navigate('/500', { replace: true })
          }
          if (error.response?.status === 403) {
            navigate('/403', { replace: true })
          }
        }
      }
    })

    return unsubscribe
  }, [queryClient, navigate])

  return null // This component doesn't render anything
}
