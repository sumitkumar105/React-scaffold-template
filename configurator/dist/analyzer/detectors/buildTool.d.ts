export interface BuildToolResult {
    tool: 'vite' | 'webpack' | 'cra' | 'next' | 'unknown';
    configFiles: string[];
}
/**
 * Detect the build tool used by the project
 */
export declare function detectBuildTool(projectPath: string): Promise<BuildToolResult>;
/**
 * Get the PostCSS config path if it exists
 */
export declare function detectPostCssConfig(projectPath: string): Promise<string | null>;
//# sourceMappingURL=buildTool.d.ts.map