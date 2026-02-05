import { apiClient } from '@services/index'
import { ENDPOINTS } from '@services/index'
import type { LoginCredentials, AuthResponse } from '../types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials)
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
  },

  async getMe(): Promise<AuthResponse> {
    const { data } = await apiClient.get<AuthResponse>(ENDPOINTS.AUTH.ME)
    return data
  },
}
