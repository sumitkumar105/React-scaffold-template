import path from 'path'
import { fileExists, readFile } from '../../utils/files.js'

interface CheckResult {
  warnings: string[]
  errors: string[]
}

// Map capabilities to their indicator packages/files
const CAPABILITY_INDICATORS: Record<string, { packages: string[]; files: string[] }> = {
  tailwind: {
    packages: ['tailwindcss'],
    files: ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs'],
  },
  toast: {
    packages: ['sonner', 'react-toastify', 'react-hot-toast', 'notistack'],
    files: [],
  },
  forms: {
    packages: ['react-hook-form', 'formik'],
    files: [],
  },
  reactQuery: {
    packages: ['@tanstack/react-query', 'react-query', 'swr'],
    files: [],
  },
}

/**
 * Check for duplicate/existing installations of capabilities
 */
export async function checkDuplicates(
  projectPath: string,
  capabilities: string[]
): Promise<CheckResult> {
  const warnings: string[] = []
  const errors: string[] = []

  const packageJsonPath = path.join(projectPath, 'package.json')
  let packageJson: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } = {}

  if (await fileExists(packageJsonPath)) {
    try {
      const content = await readFile(packageJsonPath)
      packageJson = JSON.parse(content)
    } catch {
      errors.push('Failed to parse package.json')
      return { warnings, errors }
    }
  }

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  for (const capability of capabilities) {
    const indicators = CAPABILITY_INDICATORS[capability]
    if (!indicators) continue

    // Check packages
    for (const pkg of indicators.packages) {
      if (allDeps[pkg]) {
        if (capability === 'toast' && pkg !== 'sonner') {
          warnings.push(
            `Found existing toast library '${pkg}'. Adding Sonner may cause conflicts.`
          )
        } else if (capability === 'forms' && pkg !== 'react-hook-form') {
          warnings.push(
            `Found existing form library '${pkg}'. Adding React Hook Form may cause conflicts.`
          )
        } else if (capability === 'reactQuery' && pkg !== '@tanstack/react-query') {
          warnings.push(
            `Found existing data fetching library '${pkg}'. Adding React Query may cause conflicts.`
          )
        } else {
          warnings.push(
            `'${pkg}' is already installed. Skipping duplicate installation.`
          )
        }
      }
    }

    // Check config files
    for (const file of indicators.files) {
      const filePath = path.join(projectPath, file)
      if (await fileExists(filePath)) {
        warnings.push(
          `'${file}' already exists. Existing configuration may be overwritten.`
        )
      }
    }
  }

  return { warnings, errors }
}
