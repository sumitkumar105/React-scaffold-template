import path from 'path'
import type { Plan, PlanStep } from '../types.js'
import {
  readFile,
  writeFile,
  fileExists,
  replaceInFile,
} from '../utils/files.js'
import { addDependencies } from '../utils/npm.js'
import { executeTailwind } from './capabilities/tailwind.js'
import { executeForms } from './capabilities/forms.js'
import { executeReactQuery } from './capabilities/reactQuery.js'
import { executeRedux } from './capabilities/redux.js'

export async function executeCapability(
  capability: string,
  projectPath: string,
  plan: Plan
): Promise<void> {
  switch (capability) {
    case 'tailwind':
      await executeTailwind(projectPath, plan)
      break
    case 'redux':
      await executeRedux(projectPath, plan)
      break
    case 'forms':
      await executeForms(projectPath, plan)
      break
    case 'reactQuery':
      await executeReactQuery(projectPath, plan)
      break
    default:
      await executeGenericPlan(projectPath, plan)
  }
}

export async function executeGenericPlan(
  projectPath: string,
  plan: Plan
): Promise<void> {
  for (const step of plan.steps) {
    await executeStep(projectPath, step)
  }
}

export async function executeStep(
  projectPath: string,
  step: PlanStep
): Promise<void> {
  const targetPath = path.join(projectPath, step.target)

  switch (step.action) {
    case 'addDependency':
      if (step.dependencies) {
        await addDependencies(projectPath, step.dependencies, step.isDev)
      }
      break

    case 'createFile':
      if (step.content) {
        const dir = path.dirname(targetPath)
        const fs = await import('fs-extra')
        await fs.ensureDir(dir)
        await writeFile(targetPath, step.content)
      }
      break

    case 'modifyFile':
      if (await fileExists(targetPath)) {
        if (step.searchPattern && step.content) {
          await replaceInFile(targetPath, step.searchPattern, step.content)
        } else if (step.position && step.content) {
          const existingContent = await readFile(targetPath)
          const newContent =
            step.position === 'prepend'
              ? step.content + existingContent
              : existingContent + step.content
          await writeFile(targetPath, newContent)
        }
      } else {
        if (step.content) {
          await writeFile(targetPath, step.content)
        }
      }
      break

    case 'updateConfig':
      if (await fileExists(targetPath) && step.content) {
        const existingContent = await readFile(targetPath)
        try {
          const existingConfig = JSON.parse(existingContent)
          const newConfig = JSON.parse(step.content)
          const mergedConfig = { ...existingConfig, ...newConfig }
          await writeFile(targetPath, JSON.stringify(mergedConfig, null, 2))
        } catch {
          await writeFile(targetPath, step.content)
        }
      }
      break
  }
}
