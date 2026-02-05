interface CheckResult {
    warnings: string[];
    errors: string[];
}
export declare function checkDuplicates(projectPath: string, capabilities: string[]): Promise<CheckResult>;
export {};
//# sourceMappingURL=duplicates.d.ts.map