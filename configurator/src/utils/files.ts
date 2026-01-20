import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'

/**
 * Copy template directory to destination
 */
export async function copyTemplate(source: string, destination: string): Promise<void> {
  // Ensure source exists
  if (!await fs.pathExists(source)) {
    throw new Error(`Template source not found: ${source}`)
  }

  // Ensure destination doesn't exist
  if (await fs.pathExists(destination)) {
    throw new Error(`Destination already exists: ${destination}`)
  }

  // Copy directory
  await fs.copy(source, destination, {
    filter: (src) => {
      // Skip node_modules and .git
      const basename = path.basename(src)
      return basename !== 'node_modules' && basename !== '.git'
    },
  })
}

/**
 * Ensure a directory exists
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath)
}

/**
 * Read a file as string
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8')
}

/**
 * Write content to a file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, content, 'utf-8')
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath)
}

/**
 * Read and parse JSON file
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath)
  return JSON.parse(content) as T
}

/**
 * Write JSON to file with pretty formatting
 */
export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  await writeFile(filePath, content)
}

/**
 * Find files matching a glob pattern
 */
export async function findFiles(pattern: string, cwd: string): Promise<string[]> {
  return glob(pattern, { cwd, absolute: true })
}

/**
 * Append content to a file
 */
export async function appendToFile(filePath: string, content: string): Promise<void> {
  await fs.appendFile(filePath, content, 'utf-8')
}

/**
 * Insert content at a specific line in a file
 */
export async function insertAtLine(
  filePath: string,
  lineNumber: number,
  content: string
): Promise<void> {
  const fileContent = await readFile(filePath)
  const lines = fileContent.split('\n')
  lines.splice(lineNumber, 0, content)
  await writeFile(filePath, lines.join('\n'))
}

/**
 * Replace content in a file
 */
export async function replaceInFile(
  filePath: string,
  search: string | RegExp,
  replacement: string
): Promise<void> {
  const content = await readFile(filePath)
  const newContent = content.replace(search, replacement)
  await writeFile(filePath, newContent)
}

/**
 * Check if file contains a string
 */
export async function fileContains(filePath: string, search: string): Promise<boolean> {
  const content = await readFile(filePath)
  return content.includes(search)
}
