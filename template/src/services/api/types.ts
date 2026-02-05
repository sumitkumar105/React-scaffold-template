import { z } from 'zod'

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export const apiErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
  errors: z.record(z.array(z.string())).optional(),
})

export interface PaginatedApiResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
