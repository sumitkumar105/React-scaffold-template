/**
 * React Configurator - Library Entry Point
 *
 * This file exports all functions for using configurator as a library.
 *
 * Usage:
 *   import { generateProject, injectCapabilities, CAPABILITIES } from 'react-configurator'
 */
export * from './types.js';
export { CAPABILITIES } from './types.js';
export { analyzeProject } from './analyzer/index.js';
export { createPlan } from './planner/index.js';
export { executeCapability } from './executor/index.js';
export { validateProject } from './validator/index.js';
export { copyTemplate, readFile, writeFile, fileExists } from './utils/files.js';
export { cloneRepository } from './utils/git.js';
export { installDependencies, addDependencies } from './utils/npm.js';
import type { GenerateProjectOptions, GenerateProjectResult, InjectCapabilitiesOptions, InjectCapabilitiesResult } from './types.js';
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
export declare function generateProject(options: GenerateProjectOptions): Promise<GenerateProjectResult>;
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
export declare function injectCapabilities(options: InjectCapabilitiesOptions): Promise<InjectCapabilitiesResult>;
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
export declare function previewCapabilities(projectPath: string, capabilities: string[]): Promise<{
    filesToCreate: string[];
    filesToModify: string[];
    dependenciesToAdd: Record<string, string>;
    devDependenciesToAdd: Record<string, string>;
}>;
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
export declare function detectInstalledCapabilities(projectPath: string): Promise<string[]>;
//# sourceMappingURL=lib.d.ts.map