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
export declare function generateProject(options: GenerateProjectOptions): Promise<GenerateProjectResult>;
export declare function injectCapabilities(options: InjectCapabilitiesOptions): Promise<InjectCapabilitiesResult>;
export declare function previewCapabilities(projectPath: string, capabilities: string[]): Promise<{
    filesToCreate: string[];
    filesToModify: string[];
    dependenciesToAdd: Record<string, string>;
    devDependenciesToAdd: Record<string, string>;
}>;
export declare function detectInstalledCapabilities(projectPath: string): Promise<string[]>;
//# sourceMappingURL=lib.d.ts.map