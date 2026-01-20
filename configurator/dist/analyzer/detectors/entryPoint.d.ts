export interface EntryPointResult {
    file: string;
    hasTypeScript: boolean;
    srcDirectory: string;
}
/**
 * Detect the entry point file of the project
 */
export declare function detectEntryPoint(projectPath: string): Promise<EntryPointResult>;
/**
 * Detect the App component file
 */
export declare function detectAppFile(projectPath: string): Promise<string | null>;
/**
 * Detect global CSS file
 */
export declare function detectGlobalCssFile(projectPath: string): Promise<string | null>;
//# sourceMappingURL=entryPoint.d.ts.map