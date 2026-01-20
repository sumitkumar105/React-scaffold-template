import { detectEntryPoint } from './detectors/entryPoint.js'
import { detectBuildTool } from './detectors/buildTool.js'
import { detectStyling } from './detectors/styling.js'
import type { ProjectAnalysis } from '../types.js'

// Re-export for backwards compatibility
export type { ProjectAnalysis } from '../types.js'

/**
 * Analyze a project's structure and configuration
 */
export async function analyzeProject(projectPath: string): Promise<ProjectAnalysis> {
  const [entryPoint, buildTool, styling] = await Promise.all([
    detectEntryPoint(projectPath),
    detectBuildTool(projectPath),
    detectStyling(projectPath),
  ])

  return {
    entryPoint: entryPoint.file,
    buildTool: buildTool.tool,
    styling: styling.frameworks,
    hasTypeScript: entryPoint.hasTypeScript,
    srcDirectory: entryPoint.srcDirectory,
    configFiles: buildTool.configFiles,
  }
}
