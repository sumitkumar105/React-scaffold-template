import path from 'path'
import fs from 'fs-extra'
import type { Plan } from '../../planner/index.js'
import { addDependencies } from '../../utils/npm.js'
import {
  writeFile,
  readFile,
  fileExists,
} from '../../utils/files.js'

/**
 * Execute Sonner toast installation
 */
export async function executeToast(
  projectPath: string,
  plan: Plan
): Promise<void> {
  // Step 1: Add Sonner dependency
  await addDependencies(
    projectPath,
    {
      sonner: '^1.4.0',
    },
    false
  )

  // Step 2: Update App.tsx to include Toaster
  const appPath = path.join(projectPath, 'src/App.tsx')
  if (await fileExists(appPath)) {
    let appContent = await readFile(appPath)

    // Add Sonner import if not present
    if (!appContent.includes("from 'sonner'")) {
      // Find the first import statement
      const importMatch = appContent.match(/^import .*/m)
      if (importMatch) {
        appContent = appContent.replace(
          importMatch[0],
          `import { Toaster } from 'sonner'\n${importMatch[0]}`
        )
      } else {
        appContent = `import { Toaster } from 'sonner'\n${appContent}`
      }
    }

    // Add Toaster component if not present
    if (!appContent.includes('<Toaster')) {
      // Find the opening div with className="app" and add Toaster after it
      appContent = appContent.replace(
        /<div className="app">/,
        `<div className="app">\n      <Toaster richColors position="top-right" />`
      )
    }

    await writeFile(appPath, appContent)
  }

  // Step 3: Create useToast hook
  const hooksDir = path.join(projectPath, 'src/hooks')
  await fs.ensureDir(hooksDir)

  const useToastContent = `import { toast } from 'sonner'

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
    loading: (message: string) => toast.loading(message),
    dismiss: (toastId?: string | number) => toast.dismiss(toastId),
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string
        error: string
      }
    ) => toast.promise(promise, options),
  }
}
`

  await writeFile(path.join(hooksDir, 'useToast.ts'), useToastContent)
}
