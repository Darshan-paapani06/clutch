import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import httpClient from '../api/httpClient'
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/config.constants'
import type { AuthenticatedUser, AuthenticationContextValue } from '../types/user.types'

export const AuthenticationContext = createContext<AuthenticationContextValue | null>(null)

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    if (token) {
      httpClient.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (token: string): Promise<AuthenticatedUser> => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    const res = await httpClient.get('/users/me')
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthenticationContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
