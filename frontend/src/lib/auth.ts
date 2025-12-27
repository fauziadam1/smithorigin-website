'use client'

export const saveAuth = (token: string) => {
  localStorage.setItem('accessToken', token)
}

export const getAuth = () => {
  if (typeof window === 'undefined') return { token: null }
  const token = localStorage.getItem('accessToken')
  return { token }
}

export const clearAuth = () => {
  localStorage.removeItem('accessToken')
}

export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('accessToken')
}
