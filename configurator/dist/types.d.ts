/**
 * Shared types for the configurator library
 */
export interface Capability {
    name: string;
    value: string;
    description: string;
}
export declare const CAPABILITIES: Capability[];
export interface ProjectAnalysis {
    entryPoint: string;
    buildTool: 'vite' | 'webpack' | 'cra' | 'next' | 'unknown';
    styling: string[];
    hasTypeScript: boolean;
    srcDirectory: string;
    configFiles: string[];
}
export interface PlanStep {
    action: 'addDependency' | 'createFile' | 'modifyFile' | 'updateConfig';
    target: string;
    description: string;
    content?: string;
    dependencies?: Record<string, string>;
    isDev?: boolean;
    searchPattern?: string;
    position?: 'prepend' | 'append';
}
export interface Plan {
    capability: string;
    steps: PlanStep[];
}
export interface ValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
}
export interface GenerateProjectOptions {
    projectName: string;
    capabilities: string[];
    outputPath: string;
    templatePath: string;
    skipInstall?: boolean;
}
export interface GenerateProjectResult {
    success: boolean;
    outputPath: string;
    analysis: ProjectAnalysis;
    validation: ValidationResult;
    appliedCapabilities: string[];
    errors: string[];
}
export interface InjectCapabilitiesOptions {
    projectPath: string;
    capabilities: string[];
    skipInstall?: boolean;
}
export interface InjectCapabilitiesResult {
    success: boolean;
    analysis: ProjectAnalysis;
    validation: ValidationResult;
    appliedCapabilities: string[];
    errors: string[];
}
//# sourceMappingURL=types.d.ts.map