/**
 * Shared types for the configurator library
 */

// Capability definition
export interface Capability {
  name: string
  value: string
  description: string
}

// Available capabilities
export const CAPABILITIES: Capability[] = [
  { name: 'Tailwind CSS', value: 'tailwind', description: 'Utility-first CSS framework' },
  { name: 'Toast Notifications (Sonner)', value: 'toast', description: 'Beautiful toast notifications' },
  { name: 'Forms (React Hook Form + Zod)', value: 'forms', description: 'Form validation and handling' },
  { name: 'React Query', value: 'reactQuery', description: 'Data fetching and caching' },
]

// Project analysis result
export interface ProjectAnalysis {
  entryPoint: string
  buildTool: 'vite' | 'webpack' | 'cra' | 'next' | 'unknown'
  styling: string[]
  hasTypeScript: boolean
  srcDirectory: string
  configFiles: string[]
}

// Plan step for capability execution
export interface PlanStep {
  action: 'addDependency' | 'createFile' | 'modifyFile' | 'updateConfig'
  target: string
  description: string
  content?: string
  dependencies?: Record<string, string>
  isDev?: boolean
  searchPattern?: string
  position?: 'prepend' | 'append'
}

// Execution plan
export interface Plan {
  capability: string
  steps: PlanStep[]
}

// Validation result
export interface ValidationResult {
  valid: boolean
  warnings: string[]
  errors: string[]
}

// Options for generating a project
export interface GenerateProjectOptions {
  projectName: string
  capabilities: string[]
  outputPath: string
  templatePath: string
  skipInstall?: boolean
}

// Result from project generation
export interface GenerateProjectResult {
  success: boolean
  outputPath: string
  analysis: ProjectAnalysis
  validation: ValidationResult
  appliedCapabilities: string[]
  errors: string[]
}

// Options for injecting capabilities
export interface InjectCapabilitiesOptions {
  projectPath: string
  capabilities: string[]
  skipInstall?: boolean
}

// Result from capability injection
export interface InjectCapabilitiesResult {
  success: boolean
  analysis: ProjectAnalysis
  validation: ValidationResult
  appliedCapabilities: string[]
  errors: string[]
}
