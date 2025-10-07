// auth-cache.ts
import { QueryClient } from '@tanstack/react-query'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const EXPIRES_AT = 'expires_at'
const USER_DATA = 'user_data'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      // cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

export const authCache = {
  getToken: (): string | null => {
    const token = getCookie(ACCESS_TOKEN)
    return token ? JSON.parse(token) : null
  },

  getRefreshToken: (): string | null => {
    const refreshToken = getCookie(REFRESH_TOKEN)
    return refreshToken ? JSON.parse(refreshToken) : null
  },

  getExpiresAt: (): number | null => {
    const expiresAt = getCookie(EXPIRES_AT)
    return expiresAt ? JSON.parse(expiresAt) : null
  },

  getUser: (): any => {
    const user = getCookie(USER_DATA)
    return user ? JSON.parse(user) : null
  },

  setToken: (token: string) => {
    setCookie(ACCESS_TOKEN, JSON.stringify(token))
  },

  setRefreshToken: (refreshToken: string) => {
    setCookie(REFRESH_TOKEN, JSON.stringify(refreshToken))
  },

  setExpiresAt: (expiresAt: number) => {
    setCookie(EXPIRES_AT, JSON.stringify(expiresAt))
  },

  setUser: (user: any) => {
    setCookie(USER_DATA, JSON.stringify(user))
  },

  setAuthData: (data: {
    access_token: string
    user: any
    refresh_token?: string
    expires_in?: number
  }) => {
    const { access_token, user, refresh_token, expires_in } = data

    // Set access token
    setCookie(ACCESS_TOKEN, JSON.stringify(access_token))

    // Set user data
    setCookie(USER_DATA, JSON.stringify(user))

    // Set refresh token if provided
    if (refresh_token) {
      setCookie(REFRESH_TOKEN, JSON.stringify(refresh_token))
    }

    // Calculate and set expiration if provided
    if (expires_in) {
      const expiresAt = Date.now() + expires_in * 1000
      setCookie(EXPIRES_AT, JSON.stringify(expiresAt))
    }
  },

  clearAuth: () => {
    removeCookie(ACCESS_TOKEN)
    removeCookie(REFRESH_TOKEN)
    removeCookie(EXPIRES_AT)
    removeCookie(USER_DATA)
  },
}
