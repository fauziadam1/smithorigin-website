'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getAuth } from '@/lib/auth'
import { jwtDecode } from 'jwt-decode'

interface User {
  email: ReactNode
  id: number
  username: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType>({
  user: null
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { token } = getAuth()
    if (!token) return

    try {
      const decoded = jwtDecode<User>(token)
      setUser(decoded)
    } catch {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
