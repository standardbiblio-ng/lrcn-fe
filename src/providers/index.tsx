// providers/index.tsx (simplified)
import { StrictMode } from 'react'
import {
  // QueryCache,
  // QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { queryClient } from '@/api'
import { DirectionProvider } from '@/context/direction-provider'
import { FontProvider } from '@/context/font-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { Toaster } from '@/components/ui/sonner'

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: (failureCount, error) => {
//         if (import.meta.env.DEV) console.log({ failureCount, error })

//         if (failureCount >= 0 && import.meta.env.DEV) return false
//         if (failureCount > 3 && import.meta.env.PROD) return false

//         return !(
//           error instanceof AxiosError &&
//           [401, 403].includes(error.response?.status ?? 0)
//         )
//       },
//       refetchOnWindowFocus: import.meta.env.PROD,
//       staleTime: 10 * 1000,
//     },
//     mutations: {
//       onError: (error) => {
//         handleServerError(error)

//         if (error instanceof AxiosError) {
//           if (error.response?.status === 304) {
//             toast.error('Content not modified!')
//           }
//         }
//       },
//     },
//   },
//   queryCache: new QueryCache({
//     onError: (error) => {
//       if (error instanceof AxiosError) {
//         if (error.response?.status === 401) {
//           toast.error('Session expired!')
//           useAuthStore.getState().auth.reset()
//         }
//       }
//     },
//   }),
// })

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              {children}
              <Toaster
                position='top-right'
                duration={5000}
                closeButton
                richColors
              />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
