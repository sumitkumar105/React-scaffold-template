import path from 'path'
import fs from 'fs-extra'

export * from './types.js'
export { CAPABILITIES } from './types.js'

export { analyzeProject } from './analyzer/index.js'
export { createPlan } from './planner/index.js'
export { executeCapability } from './executor/index.js'
export { validateProject } from './validator/index.js'

export { copyTemplate, readFile, writeFile, fileExists } from './utils/files.js'
export { cloneRepository } from './utils/git.js'
export { installDependencies, addDependencies } from './utils/npm.js'

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

async function updateProjectName(outputPath: string, projectName: string): Promise<void> {
  const packageJsonPath = path.join(outputPath, 'package.json')
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath)
    packageJson.name = projectName
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  }

  const indexHtmlPath = path.join(outputPath, 'index.html')
  if (await fs.pathExists(indexHtmlPath)) {
    let html = await fs.readFile(indexHtmlPath, 'utf-8')
    html = html.replace(/<title>.*?<\/title>/, `<title>${projectName}</title>`)
    await fs.writeFile(indexHtmlPath, html, 'utf-8')
  }
}

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

    // Step 2: Update project name in package.json and index.html
    await updateProjectName(outputPath, projectName)

    // Step 3: Analyze project structure
    analysis = await analyzeProject(outputPath)

    // Step 4: Validate before applying capabilities
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

      // Step 5: Apply each capability in order
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

    // Step 6: Install dependencies
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

export async function injectCapabilities(
  options: InjectCapabilitiesOptions
): Promise<InjectCapabilitiesResult> {
  const { projectPath, capabilities, skipInstall = false } = options

  const errors: string[] = []
  const appliedCapabilities: string[] = []

  try {
    if (!await fs.pathExists(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`)
    }

    const analysis = await analyzeProject(projectPath)
    const validation = await validateProject(projectPath, capabilities)

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
  } catch {
    // Return empty preview on error
  }

  return {
    filesToCreate: [...new Set(filesToCreate)],
    filesToModify: [...new Set(filesToModify)],
    dependenciesToAdd,
    devDependenciesToAdd,
  }
}

export async function detectInstalledCapabilities(
  projectPath: string
): Promise<string[]> {
  const installed: string[] = []

  try {
    const analysis = await analyzeProject(projectPath)

    if (analysis.styling.includes('tailwind')) {
      installed.push('tailwind')
    }

    const packageJsonPath = path.join(projectPath, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath)
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      if (allDeps['@reduxjs/toolkit']) installed.push('redux')
      if (allDeps['react-hook-form']) installed.push('forms')
      if (allDeps['@tanstack/react-query']) installed.push('reactQuery')
    }
  } catch {
    // Return empty array on error
  }

  return installed
}
