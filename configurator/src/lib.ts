/**
 * React Configurator - Library Entry Point
 *
 * This file exports all functions for using configurator as a library.
 *
 * Usage:
 *   import { generateProject, injectCapabilities, CAPABILITIES } from 'react-configurator'
 */

import path from 'path'
import fs from 'fs-extra'

// Re-export types
export * from './types.js'

// Re-export constants
export { CAPABILITIES } from './types.js'

// Re-export core functions
export { analyzeProject } from './analyzer/index.js'
export { createPlan } from './planner/index.js'
export { executeCapability } from './executor/index.js'
export { validateProject } from './validator/index.js'

// Re-export utilities
export { copyTemplate, readFile, writeFile, fileExists } from './utils/files.js'
export { cloneRepository } from './utils/git.js'
export { installDependencies, addDependencies } from './utils/npm.js'

// Import for internal use
import { copyTemplate } from './utils/files.js'
import { cloneRepository } from './utils/git.js'
import { installDependencies } from './utils/npm.js'
import { analyzeProject } from './analyzer/index.js'
import { createPlan } from './planner/index.js'
import { executeCapability } from './executor/index.js'
import { validateProject } from './validator/index.js'

import type {
  GenerateProjectOptions,
  GenerateProjectResult,
  InjectCapabilitiesOptions,
  InjectCapabilitiesResult,
  ProjectAnalysis,
} from './types.js'

/**
 * Generate a new project from template with selected capabilities
 *
 * @example
 * ```typescript
 * import { generateProject } from 'react-configurator'
 *
 * const result = await generateProject({
 *   projectName: 'my-app',
 *   capabilities: ['tailwind', 'toast'],
 *   outputPath: '/path/to/output/my-app',
 *   templatePath: '/path/to/template',
 * })
 *
 * if (result.success) {
 *   console.log('Project created at:', result.outputPath)
 * }
 * ```
 */
export async function generateProject(
  options: GenerateProjectOptions
): Promise<GenerateProjectResult> {
  const {
    projectName,
    capabilities,
    outputPath,
    templatePath,
    skipInstall = false,
  } = options

  const errors: string[] = []
  const appliedCapabilities: string[] = []
  let analysis: ProjectAnalysis | null = null
  let validation = { valid: true, warnings: [] as string[], errors: [] as string[] }

  try {
    // Step 1: Copy or clone template
    if (templatePath.startsWith('http') || templatePath.startsWith('git@')) {
      await cloneRepository(templatePath, outputPath)
    } else {
      await copyTemplate(templatePath, outputPath)
    }

    // Step 2: Analyze project structure
    analysis = await analyzeProject(outputPath)

    // Step 3: Validate before applying capabilities
    if (capabilities.length > 0) {
      validation = await validateProject(outputPath, capabilities)

      if (!validation.valid) {
        return {
          success: false,
          outputPath,
          analysis,
          validation,
          appliedCapabilities: [],
          errors: validation.errors,
        }
      }

      // Step 4: Apply each capability
      for (const capability of capabilities) {
        try {
          const plan = await createPlan(capability, analysis)
          await executeCapability(capability, outputPath, plan)
          appliedCapabilities.push(capability)
        } catch (error) {
          errors.push(
            `Failed to apply ${capability}: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }
    }

    // Step 5: Install dependencies
    if (!skipInstall) {
      try {
        await installDependencies(outputPath)
      } catch (error) {
        errors.push(
          `Failed to install dependencies: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    return {
      success: errors.length === 0,
      outputPath,
      analysis,
      validation,
      appliedCapabilities,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      outputPath,
      analysis: analysis || {
        entryPoint: '',
        buildTool: 'unknown',
        styling: [],
        hasTypeScript: false,
        srcDirectory: 'src',
        configFiles: [],
      },
      validation,
      appliedCapabilities,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
}

/**
 * Inject capabilities into an existing project
 *
 * @example
 * ```typescript
 * import { injectCapabilities } from 'react-configurator'
 *
 * const result = await injectCapabilities({
 *   projectPath: '/path/to/existing/project',
 *   capabilities: ['tailwind', 'forms'],
 * })
 *
 * if (result.success) {
 *   console.log('Applied:', result.appliedCapabilities)
 * }
 * ```
 */
export async function injectCapabilities(
  options: InjectCapabilitiesOptions
): Promise<InjectCapabilitiesResult> {
  const { projectPath, capabilities, skipInstall = false } = options

  const errors: string[] = []
  const appliedCapabilities: string[] = []

  try {
    // Step 1: Verify project exists
    if (!await fs.pathExists(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`)
    }

    // Step 2: Analyze project structure
    const analysis = await analyzeProject(projectPath)

    // Step 3: Validate
    const validation = await validateProject(projectPath, capabilities)

    // Step 4: Apply each capability
    for (const capability of capabilities) {
      try {
        const plan = await createPlan(capability, analysis)
        await executeCapability(capability, projectPath, plan)
        appliedCapabilities.push(capability)
      } catch (error) {
        errors.push(
          `Failed to apply ${capability}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    // Step 5: Install dependencies
    if (!skipInstall && appliedCapabilities.length > 0) {
      try {
        await installDependencies(projectPath)
      } catch (error) {
        errors.push(
          `Failed to install dependencies: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    return {
      success: errors.length === 0,
      analysis,
      validation,
      appliedCapabilities,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      analysis: {
        entryPoint: '',
        buildTool: 'unknown',
        styling: [],
        hasTypeScript: false,
        srcDirectory: 'src',
        configFiles: [],
      },
      validation: { valid: false, warnings: [], errors: [] },
      appliedCapabilities,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
}

/**
 * Get preview of what files will be created/modified for given capabilities
 * Useful for showing users what will happen before they confirm
 *
 * @example
 * ```typescript
 * import { previewCapabilities } from 'react-configurator'
 *
 * const preview = await previewCapabilities('/path/to/project', ['tailwind'])
 * console.log('Files to create:', preview.filesToCreate)
 * console.log('Files to modify:', preview.filesToModify)
 * ```
 */
export async function previewCapabilities(
  projectPath: string,
  capabilities: string[]
): Promise<{
  filesToCreate: string[]
  filesToModify: string[]
  dependenciesToAdd: Record<string, string>
  devDependenciesToAdd: Record<string, string>
}> {
  const filesToCreate: string[] = []
  const filesToModify: string[] = []
  const dependenciesToAdd: Record<string, string> = {}
  const devDependenciesToAdd: Record<string, string> = {}

  try {
    const analysis = await analyzeProject(projectPath)

    for (const capability of capabilities) {
      const plan = await createPlan(capability, analysis)

      for (const step of plan.steps) {
        switch (step.action) {
          case 'createFile':
            filesToCreate.push(step.target)
            break
          case 'modifyFile':
            filesToModify.push(step.target)
            break
          case 'addDependency':
            if (step.dependencies) {
              if (step.isDev) {
                Object.assign(devDependenciesToAdd, step.dependencies)
              } else {
                Object.assign(dependenciesToAdd, step.dependencies)
              }
            }
            break
        }
      }
    }
  } catch (error) {
    // Return empty preview on error
  }

  return {
    filesToCreate: [...new Set(filesToCreate)],
    filesToModify: [...new Set(filesToModify)],
    dependenciesToAdd,
    devDependenciesToAdd,
  }
}

/**
 * Check if a project already has certain capabilities installed
 *
 * @example
 * ```typescript
 * import { detectInstalledCapabilities } from 'react-configurator'
 *
 * const installed = await detectInstalledCapabilities('/path/to/project')
 * console.log('Installed:', installed) // ['tailwind', 'reactQuery']
 * ```
 */
export async function detectInstalledCapabilities(
  projectPath: string
): Promise<string[]> {
  const installed: string[] = []

  try {
    const analysis = await analyzeProject(projectPath)

    // Check for Tailwind
    if (analysis.styling.includes('tailwind')) {
      installed.push('tailwind')
    }

    // Check package.json for other capabilities
    const packageJsonPath = path.join(projectPath, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath)
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      if (allDeps['sonner']) installed.push('toast')
      if (allDeps['react-hook-form']) installed.push('forms')
      if (allDeps['@tanstack/react-query']) installed.push('reactQuery')
    }
  } catch (error) {
    // Return empty array on error
  }

  return installed
}
