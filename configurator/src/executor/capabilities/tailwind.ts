import path from 'path'
import type { Plan } from '../../types.js'
import { addDependencies } from '../../utils/npm.js'
import {
  writeFile,
  readFile,
  fileExists,
} from '../../utils/files.js'

export async function executeTailwind(
  projectPath: string,
  _plan: Plan
): Promise<void> {
  // Step 1: Add dependencies
  await addDependencies(
    projectPath,
    {
      tailwindcss: '^3.4.1',
      postcss: '^8.4.35',
      autoprefixer: '^10.4.17',
    },
    true
  )

  await addDependencies(
    projectPath,
    {
      clsx: '^2.1.0',
      'tailwind-merge': '^2.2.0',
    },
    false
  )

  // Step 2: Create tailwind.config.ts
  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
`
  await writeFile(path.join(projectPath, 'tailwind.config.ts'), tailwindConfig)

  // Step 3: Create postcss.config.js
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  await writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig)

  // Step 4: Replace src/index.css with Tailwind directives
  const indexCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`
  await writeFile(path.join(projectPath, 'src/index.css'), indexCssContent)

  // Step 5: Replace cn utility with clsx + tailwind-merge version
  const cnContent = `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
  await writeFile(path.join(projectPath, 'src/shared/utils/cn.ts'), cnContent)

  // Step 6: Replace components with Tailwind versions
  await writeTailwindButton(projectPath)
  await writeTailwindInput(projectPath)
  await writeTailwindModal(projectPath)
  await writeTailwindLoader(projectPath)
  await writeTailwindMainLayout(projectPath)
  await writeTailwindNotFoundPage(projectPath)
}

async function writeTailwindButton(projectPath: string) {
  const content = `import { ButtonHTMLAttributes } from 'react'
import { cn } from '@shared/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  outline: 'bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md font-medium cursor-pointer transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}
`
  await writeFile(path.join(projectPath, 'src/shared/components/Button.tsx'), content)
}

async function writeTailwindInput(projectPath: string) {
  const content = `import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@shared/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block mb-1.5 text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-md border text-base outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1 block">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
`
  await writeFile(path.join(projectPath, 'src/shared/components/Input.tsx'), content)
}

async function writeTailwindModal(projectPath: string) {
  const content = `import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto shadow-xl">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-2xl cursor-pointer p-1 leading-none hover:opacity-70"
            >
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}
`
  await writeFile(path.join(projectPath, 'src/shared/components/Modal.tsx'), content)
}

async function writeTailwindLoader(projectPath: string) {
  const content = `import { cn } from '@shared/utils/cn'

type LoaderSize = 'sm' | 'md' | 'lg'

interface LoaderProps {
  size?: LoaderSize
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-[3px]',
  lg: 'w-10 h-10 border-4',
}

export function Loader({ size = 'md' }: LoaderProps) {
  return (
    <div
      className={cn(
        'inline-block rounded-full border-gray-200 border-t-blue-500 animate-spin',
        sizeClasses[size]
      )}
    />
  )
}
`
  await writeFile(path.join(projectPath, 'src/shared/components/Loader.tsx'), content)
}

async function writeTailwindMainLayout(projectPath: string) {
  const content = `import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '@config/constants'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <Link to={ROUTES.HOME} className="text-xl font-bold no-underline">
          MyApp
        </Link>
        <div className="flex gap-6">
          <Link to={ROUTES.HOME} className="hover:text-blue-500 transition-colors">Home</Link>
          <Link to={ROUTES.ABOUT} className="hover:text-blue-500 transition-colors">About</Link>
        </div>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
`
  await writeFile(path.join(projectPath, 'src/shared/components/MainLayout.tsx'), content)
}

async function writeTailwindNotFoundPage(projectPath: string) {
  const content = `import { Link } from 'react-router-dom'
import { ROUTES } from '@config/constants'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-500 mb-6">Page not found</p>
      <Link
        to={ROUTES.HOME}
        className="px-4 py-2 bg-blue-500 text-white rounded-md no-underline hover:bg-blue-600 transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
`
  await writeFile(path.join(projectPath, 'src/shared/components/NotFoundPage.tsx'), content)
}
