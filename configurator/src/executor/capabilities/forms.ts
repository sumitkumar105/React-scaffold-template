import path from 'path'
import fs from 'fs-extra'
import type { Plan } from '../../types.js'
import { addDependencies } from '../../utils/npm.js'
import {
  writeFile,
  readFile,
  fileExists,
} from '../../utils/files.js'

export async function executeForms(
  projectPath: string,
  _plan: Plan
): Promise<void> {
  // Step 1: Add dependencies (zod is already in base template)
  await addDependencies(
    projectPath,
    {
      'react-hook-form': '^7.50.1',
      '@hookform/resolvers': '^3.3.4',
    },
    false
  )

  // Step 2: Create useZodForm hook
  const hooksDir = path.join(projectPath, 'src/shared/hooks')
  await fs.ensureDir(hooksDir)

  const useZodFormContent = `import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'

export function useZodForm<TFieldValues extends FieldValues>(
  schema: ZodSchema<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>
) {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema),
  })
}
`
  await writeFile(path.join(hooksDir, 'useZodForm.ts'), useZodFormContent)

  // Step 3: Create FormField component
  const componentsDir = path.join(projectPath, 'src/shared/components')
  await fs.ensureDir(componentsDir)

  // Check if Tailwind is present to decide on styling
  const hasTailwind = await fileExists(path.join(projectPath, 'tailwind.config.ts')) ||
    await fileExists(path.join(projectPath, 'tailwind.config.js'))

  let formFieldContent: string

  if (hasTailwind) {
    formFieldContent = `import { ReactNode } from 'react'
import { cn } from '@shared/utils/cn'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('mb-4', className)}>
      <label className="block mb-1.5 text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  )
}
`
  } else {
    formFieldContent = `import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}
`
  }

  await writeFile(path.join(componentsDir, 'FormField.tsx'), formFieldContent)

  // Step 4: Upgrade LoginForm to use RHF + Zod
  const loginFormPath = path.join(projectPath, 'src/features/auth/components/LoginForm.tsx')

  if (hasTailwind) {
    const loginFormContent = `import { useZodForm } from '@shared/hooks/useZodForm'
import { Button } from '@shared/components'
import { loginSchema, type LoginFormData } from '../types'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(loginSchema)

  const onSubmit = (data: LoginFormData) => {
    // TODO: Integrate with auth service
    console.log('Login:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

      <div className="mb-4">
        <label className="block mb-1.5 text-sm font-medium">Email</label>
        <input
          type="email"
          {...register('email')}
          placeholder="you@example.com"
          className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1.5 text-sm font-medium">Password</label>
        <input
          type="password"
          {...register('password')}
          placeholder="Enter your password"
          className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
`
    await writeFile(loginFormPath, loginFormContent)
  } else {
    const loginFormContent = `import { useZodForm } from '@shared/hooks/useZodForm'
import { Button } from '@shared/components'
import { Input } from '@shared/components'
import { loginSchema, type LoginFormData } from '../types'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(loginSchema)

  const onSubmit = (data: LoginFormData) => {
    // TODO: Integrate with auth service
    console.log('Login:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '24rem', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Sign In</h2>

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="you@example.com"
      />

      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        placeholder="Enter your password"
      />

      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
`
    await writeFile(loginFormPath, loginFormContent)
  }

  // Step 5: Add Zod schemas to auth types
  const authTypesPath = path.join(projectPath, 'src/features/auth/types/index.ts')
  const authTypesContent = `import { z } from 'zod'

export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>
`
  await writeFile(authTypesPath, authTypesContent)

  // Step 6: Update barrel exports
  const componentsIndexPath = path.join(projectPath, 'src/shared/components/index.ts')
  if (await fileExists(componentsIndexPath)) {
    let indexContent = await readFile(componentsIndexPath)
    if (!indexContent.includes('FormField')) {
      indexContent += `export { FormField } from './FormField'\n`
    }
    await writeFile(componentsIndexPath, indexContent)
  }

  const hooksIndexPath = path.join(projectPath, 'src/shared/hooks/index.ts')
  if (await fileExists(hooksIndexPath)) {
    let indexContent = await readFile(hooksIndexPath)
    if (!indexContent.includes('useZodForm')) {
      indexContent += `export { useZodForm } from './useZodForm'\n`
    }
    await writeFile(hooksIndexPath, indexContent)
  }
}
