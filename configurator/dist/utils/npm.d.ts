/**
 * Install dependencies using npm
 */
export declare function installDependencies(projectPath: string): Promise<void>;
/**
 * Add dependencies to package.json
 */
export declare function addDependencies(projectPath: string, dependencies: Record<string, string>, isDev?: boolean): Promise<void>;
/**
 * Add scripts to package.json
 */
export declare function addScripts(projectPath: string, scripts: Record<string, string>): Promise<void>;
/**
 * Check if a package is installed
 */
export declare function hasPackage(projectPath: string, packageName: string): Promise<boolean>;
/**
 * Get package version from package.json
 */
export declare function getPackageVersion(projectPath: string, packageName: string): Promise<string | null>;
/**
 * Remove a package from package.json
 */
export declare function removePackage(projectPath: string, packageName: string): Promise<void>;
//# sourceMappingURL=npm.d.ts.map