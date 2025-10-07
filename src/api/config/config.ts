import { AuthCache } from 'src/types'

// Create auth cache
export const authCache: AuthCache = {
  getToken: () => localStorage.getItem('accessToken'),
  setToken: (token) => localStorage.setItem('accessToken', token),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
  getExpiresAt: () => localStorage.getItem('expiresAt'),
  setExpiresAt: (expiresAt) => localStorage.setItem('expiresAt', expiresAt),
  getUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  clearAuth: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('user')
  },
}
