import { spawn } from 'child_process'
import path from 'path'
import { readJsonFile, writeJsonFile } from './files.js'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  scripts?: Record<string, string>
  [key: string]: unknown
}

/**
 * Install dependencies using npm
 */
export async function installDependencies(projectPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const child = spawn(npm, ['install'], {
      cwd: projectPath,
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`npm install failed with code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

/**
 * Add dependencies to package.json
 */
export async function addDependencies(
  projectPath: string,
  dependencies: Record<string, string>,
  isDev: boolean = false
): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath)

  const key = isDev ? 'devDependencies' : 'dependencies'
  packageJson[key] = {
    ...packageJson[key],
    ...dependencies,
  }

  // Sort dependencies alphabetically
  if (packageJson[key]) {
    packageJson[key] = Object.keys(packageJson[key])
      .sort()
      .reduce((acc, k) => {
        acc[k] = packageJson[key]![k]
        return acc
      }, {} as Record<string, string>)
  }

  await writeJsonFile(packageJsonPath, packageJson)
}

/**
 * Add scripts to package.json
 */
export async function addScripts(
  projectPath: string,
  scripts: Record<string, string>
): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath)

  packageJson.scripts = {
    ...packageJson.scripts,
    ...scripts,
  }

  await writeJsonFile(packageJsonPath, packageJson)
}

/**
 * Check if a package is installed
 */
export async function hasPackage(projectPath: string, packageName: string): Promise<boolean> {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath)

  return !!(
    packageJson.dependencies?.[packageName] ||
    packageJson.devDependencies?.[packageName]
  )
}

/**
 * Get package version from package.json
 */
export async function getPackageVersion(
  projectPath: string,
  packageName: string
): Promise<string | null> {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath)

  return (
    packageJson.dependencies?.[packageName] ||
    packageJson.devDependencies?.[packageName] ||
    null
  )
}

/**
 * Remove a package from package.json
 */
export async function removePackage(
  projectPath: string,
  packageName: string
): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath)

  if (packageJson.dependencies?.[packageName]) {
    delete packageJson.dependencies[packageName]
  }

  if (packageJson.devDependencies?.[packageName]) {
    delete packageJson.devDependencies[packageName]
  }

  await writeJsonFile(packageJsonPath, packageJson)
}
