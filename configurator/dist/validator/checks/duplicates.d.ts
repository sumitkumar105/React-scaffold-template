interface CheckResult {
    warnings: string[];
    errors: string[];
}
/**
 * Check for duplicate/existing installations of capabilities
 */
export declare function checkDuplicates(projectPath: string, capabilities: string[]): Promise<CheckResult>;
export {};
//# sourceMappingURL=duplicates.d.ts.map