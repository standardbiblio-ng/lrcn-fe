// Create auth cache
export const authCache = {
  getToken: () => localStorage.getItem('accessToken'),
  setToken: (token: any) => localStorage.setItem('accessToken', token),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token: any) => localStorage.setItem('refreshToken', token),
  getExpiresAt: () => localStorage.getItem('expiresAt'),
  setExpiresAt: (expiresAt: any) =>
    localStorage.setItem('expiresAt', expiresAt),
  getUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  setUser: (user: any) => localStorage.setItem('user', JSON.stringify(user)),
  clearAuth: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('user')
  },
}
