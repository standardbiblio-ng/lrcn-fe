import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { authCache } from './query-client'


const baseUrl = import.meta.env.VITE_API_BASE_URL
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper function to check if token is expired
const isTokenExpired = (expiresAt: number | null): boolean => {
  if (!expiresAt) return true
  return Date.now() > expiresAt
}

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Skip refresh token logic if it's already a refresh token request or login
    if (
      originalRequest?.url?.includes('refresh') ||
      originalRequest?.url?.includes('login')
    ) {
      return Promise.reject(error)
    }

    // Prevent infinite retry loops
    if (originalRequest?._retry) {
      return Promise.reject(error)
    }

    // For 401 errors, try to refresh the token
    if (error.response?.status === 401) {
      console.log('401 error encountered, attempting to refresh token...')

      const authStore = useAuthStore.getState().auth
      const { accessToken, refreshToken, expiresAt } = authStore

      // ✅ Step 1 — Check if access token is expired
      const isExpired = isTokenExpired(expiresAt)

      if (!isExpired) {
        console.log('Access token not expired, skipping refresh.')
        return Promise.reject(error) // Token might be invalid for another reason
      }

      if (!refreshToken) {
        console.log('No refresh token available, logging out...')
        authCache.clearAuth()
        authStore.logout()
        return Promise.reject(error)
      }

      try {
        console.log('Attempting to refresh token...')

        // Mark request as retried to prevent loops
        originalRequest._retry = true

        // Call refresh token endpoint (update URL to match your backend)
        const response = await axios.post(
          `${baseUrl}/auth/refresh`, // Adjust this URL to your refresh endpoint
          {
            refresh_token: refreshToken, // Match your backend expected field name
          }
        )

        const responseData = response.data

        // Handle different response formats
        if (responseData.access_token && responseData.refresh_token) {
          // New token format with refresh token
          const { access_token, refresh_token, expires_in, user } = responseData

          // Calculate expiration if expires_in is provided
          let newExpiresAt = null
          if (expires_in) {
            newExpiresAt = Date.now() + expires_in * 1000
          }

          // Update auth store
          if (user) {
            authStore.setAuthData({
              access_token,
              user,
              refresh_token,
              expires_in,
            })
          } else {
            authStore.setTokens(
              access_token,
              refresh_token,
              newExpiresAt || Date.now() + 60 * 60 * 1000
            ) // Default 1 hour
          }

          // ✅ Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return axiosInstance(originalRequest)
        } else if (responseData.accessToken) {
          // Old format (if your backend still uses this)
          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt: newExpiresAt,
            userDto,
          } = responseData

          authStore.setTokens(newAccessToken, newRefreshToken, newExpiresAt)
          if (userDto) {
            authStore.setUser(userDto)
          }

          // ✅ Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } else {
          throw new Error('Invalid refresh token response format')
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        authCache.clearAuth()
        authStore.logout()

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }

        return Promise.reject(error)
      }
    }

    // For all other errors, pass through as-is
    return Promise.reject(error)
  }
)
// Request interceptor for API calls
// axios interceptor - updated for future refresh token support
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token check for login and refresh token requests
    if (
      config.url?.includes('login') ||
      config.url?.includes('refresh-token') ||
      config.url?.includes('register')
    ) {
      return config
    }

    const token = authCache.getToken()
    const expiresAt = authCache.getExpiresAt()

    // If token is expired, try to refresh it (when refresh token is implemented)
    if (token && expiresAt && Date.now() > expiresAt) {
      try {
        const refreshToken = authCache.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // This will be implemented when your backend supports refresh tokens
        const response = await axios.post(`${baseUrl}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        const {
          access_token,
          refresh_token: newRefreshToken,
          expires_in,
        } = response.data

        // Calculate new expiration
        const newExpiresAt = Date.now() + expires_in * 1000

        // Update store and cache
        useAuthStore
          .getState()
          .auth.setTokens(access_token, newRefreshToken, newExpiresAt)

        // Use the new token
        config.headers.Authorization = `Bearer ${access_token}`
      } catch (error) {
        // Clear auth state if refresh fails
        useAuthStore.getState().auth.logout()
        throw error
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)
