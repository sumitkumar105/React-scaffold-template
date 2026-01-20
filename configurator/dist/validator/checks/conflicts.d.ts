interface CheckResult {
    warnings: string[];
    errors: string[];
}
/**
 * Check for conflicts between capabilities and project setup
 */
export declare function checkConflicts(projectPath: string, capabilities: string[]): Promise<CheckResult>;
export {};
//# sourceMappingURL=conflicts.d.ts.map