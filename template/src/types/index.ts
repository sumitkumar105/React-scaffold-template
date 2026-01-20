import type { ReactNode, MouseEventHandler } from 'react'

export interface ButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
}

export interface User {
  id: string
  name: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
