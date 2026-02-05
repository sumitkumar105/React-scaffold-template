import path from 'path'
import { fileExists, readFile } from '../../utils/files.js'

interface CheckResult {
  warnings: string[]
  errors: string[]
}

const CAPABILITY_INDICATORS: Record<string, { packages: string[]; files: string[] }> = {
  tailwind: {
    packages: ['tailwindcss'],
    files: ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs'],
  },
  redux: {
    packages: ['@reduxjs/toolkit', 'redux', 'mobx', 'zustand'],
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

    for (const pkg of indicators.packages) {
      if (allDeps[pkg]) {
        if (capability === 'redux' && pkg !== '@reduxjs/toolkit') {
          warnings.push(
            `Found existing state management library '${pkg}'. Adding Redux Toolkit may cause conflicts.`
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
