import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_APP_NAME: z.string().default('MyApp'),
})

export const env = envSchema.parse(import.meta.env)
