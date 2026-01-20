export const APP_NAME = 'React Template'
export const APP_VERSION = '1.0.0'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
} as const
