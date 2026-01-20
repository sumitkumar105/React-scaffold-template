export interface ValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
}
/**
 * Validate a project before applying capabilities
 */
export declare function validateProject(projectPath: string, capabilities: string[]): Promise<ValidationResult>;
//# sourceMappingURL=index.d.ts.map