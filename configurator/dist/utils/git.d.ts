/**
 * Clone a git repository to a destination
 */
export declare function cloneRepository(repoUrl: string, destination: string): Promise<void>;
/**
 * Initialize a new git repository
 */
export declare function initRepository(directory: string): Promise<void>;
/**
 * Check if a directory is a git repository
 */
export declare function isGitRepository(directory: string): Promise<boolean>;
/**
 * Get the current branch name
 */
export declare function getCurrentBranch(directory: string): Promise<string>;
/**
 * Create a backup branch before making changes
 */
export declare function createBackupBranch(directory: string, branchName: string): Promise<void>;
/**
 * Stage all changes
 */
export declare function stageAllChanges(directory: string): Promise<void>;
/**
 * Commit changes with a message
 */
export declare function commitChanges(directory: string, message: string): Promise<void>;
//# sourceMappingURL=git.d.ts.map