import path from 'path';
import fs from 'fs-extra';
import { addDependencies } from '../../utils/npm.js';
import { writeFile } from '../../utils/files.js';
/**
 * Execute React Hook Form + Zod installation
 */
export async function executeForms(projectPath, plan) {
    // Step 1: Add dependencies
    await addDependencies(projectPath, {
        'react-hook-form': '^7.50.1',
        'zod': '^3.22.4',
        '@hookform/resolvers': '^3.3.4',
    }, false);
    // Step 2: Create useZodForm hook
    const hooksDir = path.join(projectPath, 'src/hooks');
    await fs.ensureDir(hooksDir);
    const useZodFormContent = `import { useForm, UseFormProps, FieldValues } from 'react-hook-form'
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
`;
    await writeFile(path.join(hooksDir, 'useZodForm.ts'), useZodFormContent);
    // Step 3: Create FormInput component
    const componentsDir = path.join(projectPath, 'src/components');
    await fs.ensureDir(componentsDir);
    const formInputContent = `import { InputHTMLAttributes, forwardRef } from 'react'
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
          <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            {error.message}
          </span>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
`;
    await writeFile(path.join(componentsDir, 'FormInput.tsx'), formInputContent);
    // Step 4: Create form type definitions
    const typesDir = path.join(projectPath, 'src/types');
    await fs.ensureDir(typesDir);
    const formsTypesContent = `import { z } from 'zod'

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

// Example contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>
`;
    await writeFile(path.join(typesDir, 'forms.ts'), formsTypesContent);
}
//# sourceMappingURL=forms.js.map