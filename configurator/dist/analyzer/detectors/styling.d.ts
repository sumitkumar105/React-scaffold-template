export interface StylingResult {
    frameworks: string[];
    hasTailwind: boolean;
    hasPostCss: boolean;
    hasSass: boolean;
    hasCssModules: boolean;
}
/**
 * Detect styling frameworks and tools in the project
 */
export declare function detectStyling(projectPath: string): Promise<StylingResult>;
//# sourceMappingURL=styling.d.ts.map