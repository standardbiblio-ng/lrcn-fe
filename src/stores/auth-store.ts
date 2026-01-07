import { create } from 'zustand'
import { authCache, queryClient } from '@/api/config/query-client'
import { useAcademicHistoryStore } from './academic-history-store'
import { useStepperStore } from './application-stepper-store'
import { useAttestationStore } from './attestation-store'
// Import all application stores to reset them on logout
import { useBioDataStore } from './bio-data-store'
import { useEmploymentHistoryStore } from './employment-history-store'
import { usePaymentStore } from './payment-store'
import { useRecommendationStore } from './recommendation-store'
import { useUploadDocumentStore } from './upload-store'

// import { authCache } from './auth-cache' // Import your authCache

interface AuthUser {
  id: string
  email: string
  role: string
  phoneNumber?: string
  isEmailVerified?: boolean
  registeredMember?: {
    lastName: string
    otherNames: string
  }
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    refreshToken: string | null
    expiresAt: number | null
    isAuthenticated: boolean
    // Methods
    setUser: (user: AuthUser | null) => void
    setAccessToken: (accessToken: string) => void
    setAuthData: (data: {
      access_token: string
      user: AuthUser
      refresh_token?: string
      expires_in?: number
    }) => void
    setTokens: (
      accessToken: string,
      refreshToken: string,
      expiresAt: number
    ) => void
    logout: () => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  // Initialize from cache
  const initialToken = authCache.getToken() || ''
  const initialRefreshToken = authCache.getRefreshToken()
  const initialExpiresAt = authCache.getExpiresAt()
  const initialUser = authCache.getUser()
  const initialIsAuthenticated = !!(initialToken && initialToken.length > 0)

  return {
    auth: {
      user: initialUser,
      accessToken: initialToken,
      refreshToken: initialRefreshToken,
      expiresAt: initialExpiresAt,
      isAuthenticated: initialIsAuthenticated,

      setUser: (user) =>
        set((state) => {
          authCache.setUser(user)
          return { ...state, auth: { ...state.auth, user } }
        }),

      setAccessToken: (accessToken) =>
        set((state) => {
          authCache.setToken(accessToken)
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              isAuthenticated: !!accessToken,
            },
          }
        }),

      // New method to handle login response
      setAuthData: (data) =>
        set((state) => {
          const { access_token, user, refresh_token, expires_in } = data

          // Calculate expiration if expires_in is provided
          let expiresAt = null
          if (expires_in) {
            expiresAt = Date.now() + expires_in * 1000
          }

          // Update cache
          authCache.setAuthData(data)

          return {
            ...state,
            auth: {
              ...state.auth,
              user,
              accessToken: access_token,
              refreshToken: refresh_token || state.auth.refreshToken,
              expiresAt: expiresAt || state.auth.expiresAt,
              isAuthenticated: true,
            },
          }
        }),

      // For token refresh scenarios
      setTokens: (accessToken, refreshToken, expiresAt) =>
        set((state) => {
          authCache.setToken(accessToken)
          authCache.setRefreshToken(refreshToken)
          authCache.setExpiresAt(expiresAt)

          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              refreshToken,
              expiresAt,
              isAuthenticated: true,
            },
          }
        }),

      logout: () =>
        set((state) => {
          authCache.clearAuth()

          // Clear React Query cache to prevent previous user's data from showing
          queryClient.clear()

          // Clear all persisted application data stores to prevent data leakage between users
          localStorage.removeItem('bio-data-storage')
          localStorage.removeItem('academic-history-storage')
          localStorage.removeItem('employment-history-storage')
          localStorage.removeItem('recommendation-storage')
          localStorage.removeItem('uploaded-document-storage')
          localStorage.removeItem('attestation-storage')
          localStorage.removeItem('payment-storage')
          localStorage.removeItem('stepper-storage')

          // Reset all application stores in memory
          useBioDataStore.getState().reset()
          useAcademicHistoryStore.getState().reset()
          useEmploymentHistoryStore.getState().reset()
          useRecommendationStore.getState().reset()
          useUploadDocumentStore.getState().reset()
          useAttestationStore.getState().reset()
          usePaymentStore.getState().reset()
          useStepperStore.getState().reset()

          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: null,
              expiresAt: null,
              isAuthenticated: false,
            },
          }
        }),

      resetAccessToken: () =>
        set((state) => {
          authCache.setToken('')
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: '',
              isAuthenticated: false,
            },
          }
        }),

      reset: () =>
        set((state) => {
          authCache.clearAuth()

          // Clear React Query cache to prevent previous user's data from showing
          queryClient.clear()

          // Clear all persisted application data stores to prevent data leakage between users
          localStorage.removeItem('bio-data-storage')
          localStorage.removeItem('academic-history-storage')
          localStorage.removeItem('employment-history-storage')
          localStorage.removeItem('recommendation-storage')
          localStorage.removeItem('uploaded-document-storage')
          localStorage.removeItem('attestation-storage')
          localStorage.removeItem('payment-storage')
          localStorage.removeItem('stepper-storage')

          // Reset all application stores in memory
          useBioDataStore.getState().reset()
          useAcademicHistoryStore.getState().reset()
          useEmploymentHistoryStore.getState().reset()
          useRecommendationStore.getState().reset()
          useUploadDocumentStore.getState().reset()
          useAttestationStore.getState().reset()
          usePaymentStore.getState().reset()
          useStepperStore.getState().reset()

          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: null,
              expiresAt: null,
              isAuthenticated: false,
            },
          }
        }),
    },
  }
})
