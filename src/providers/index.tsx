// providers.tsx
import { StrictMode, useEffect } from 'react'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from '@/lib/handle-server-error'
import { DirectionProvider } from '@/context/direction-provider'
import { FontProvider } from '@/context/font-provider'
import { ThemeProvider } from '@/context/theme-provider'

// Create query client without navigation logic (will be added in wrapper)
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (import.meta.env.DEV) console.log({ failureCount, error })

          if (failureCount >= 0 && import.meta.env.DEV) return false
          if (failureCount > 3 && import.meta.env.PROD) return false

          return !(
            error instanceof AxiosError &&
            [401, 403].includes(error.response?.status ?? 0)
          )
        },
        refetchOnWindowFocus: import.meta.env.PROD,
        staleTime: 10 * 1000,
      },
      mutations: {
        onError: (error) => {
          handleServerError(error)

          if (error instanceof AxiosError) {
            if (error.response?.status === 304) {
              toast.error('Content not modified!')
            }
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error('Session expired!')
            useAuthStore.getState().auth.reset()
            // Navigation will be handled by the QueryProvider wrapper
          }
        }
      },
    }),
  })
}

const queryClient = createQueryClient()

interface ProvidersProps {
  children: React.ReactNode
}

// Create a wrapper component that adds navigation capability
function QueryProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  // Subscribe to query errors and handle navigation
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
  }, [navigate])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <StrictMode>
      <QueryProvider>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>{children}</DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>
  )
}
