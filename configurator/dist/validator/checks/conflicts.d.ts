interface CheckResult {
    warnings: string[];
    errors: string[];
}
export declare function checkConflicts(projectPath: string, capabilities: string[]): Promise<CheckResult>;
export {};
//# sourceMappingURL=conflicts.d.ts.map