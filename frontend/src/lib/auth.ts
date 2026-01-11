'use client'

export interface User {
  id: string
  email: string
  name?: string
  isAdmin: boolean
}

const decodeToken = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) {
      console.error('Invalid token format: missing payload')
      return null
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as User
  } catch (err) {
    console.error('Failed to decode token:', err instanceof Error ? err.message : 'Unknown error')
    return null
  }
}

export const saveAuth = (token: string, user?: User) => {
  localStorage.setItem('accessToken', token)
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const getAuth = (): { token: string | null; user: User | null } => {
  if (typeof window === 'undefined') return { token: null, user: null }
  
  const token = localStorage.getItem('accessToken')
  if (!token) return { token: null, user: null }
  
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return { token, user: JSON.parse(userStr) as User }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err instanceof Error ? err.message : 'Unknown error')
    }
  }
  
  const userFromToken = decodeToken(token)
  if (userFromToken) {
    return { token, user: userFromToken }
  }
  
  return { token, user: null }
}

export const clearAuth = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('accessToken')
}