import type { PlanStep } from '../../types.js'

export const FORMS_SYSTEM_PROMPT = `You are an expert at integrating form handling libraries in React projects.
Your task is to generate a configuration plan for adding React Hook Form with Zod validation.

You must respond with a valid JSON object containing an array of steps.
Each step should have:
- "action": The type of action (addDependency, createFile, modifyFile, updateConfig)
- "target": The file or package to modify
- "description": A brief description of what this step does
- "content": The content to add (for createFile or modifyFile actions)
- "dependencies": Object of dependencies to add (for addDependency action)

Focus on:
1. Adding react-hook-form, zod, and @hookform/resolvers dependencies
2. Creating a reusable form hook
3. Creating example form component
`

export const FORMS_USER_PROMPT = (context: {
  hasTypeScript: boolean
  srcDirectory: string
}) => `
Project context:
- TypeScript: ${context.hasTypeScript ? 'Yes' : 'No'}
- Source directory: ${context.srcDirectory}

Generate a plan to add React Hook Form with Zod validation to this project.
Include steps for dependencies and creating reusable form utilities.
Response must be valid JSON with a "steps" array.
`

export const FORMS_FALLBACK_PLAN: { steps: PlanStep[] } = {
  steps: [
    {
      action: 'addDependency',
      target: 'package.json',
      description: 'Add form handling dependencies',
      dependencies: {
        'react-hook-form': '^7.50.1',
        'zod': '^3.22.4',
        '@hookform/resolvers': '^3.3.4',
      },
      isDev: false,
    },
    {
      action: 'createFile',
      target: 'src/hooks/useZodForm.ts',
      description: 'Create Zod form hook',
      content: `import { useForm, UseFormProps, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodSchema } from 'zod'

export function useZodForm<TFieldValues extends FieldValues>(
  schema: ZodSchema<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>
) {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema),
  })
}
`,
    },
    {
      action: 'createFile',
      target: 'src/components/FormInput.tsx',
      description: 'Create reusable form input component',
      content: `import { InputHTMLAttributes, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          {label}
        </label>
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
          }}
          {...props}
        />
        {error && (
          <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {error.message}
          </span>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
`,
    },
    {
      action: 'createFile',
      target: 'src/types/forms.ts',
      description: 'Create form type definitions',
      content: `import { z } from 'zod'

// Example login form schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Example registration form schema
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
`,
    },
  ],
}
