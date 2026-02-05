import { useState, useCallback } from 'react'
import type { User, LoginCredentials } from '../types'
import { authService } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('auth_token', response.token)
      setUser(response.user)
      return response
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }, [])

  return { user, isLoading, login, logout, isAuthenticated: !!user }
}
