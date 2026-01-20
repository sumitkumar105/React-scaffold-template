import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
/**
 * Clone a git repository to a destination
 */
export async function cloneRepository(repoUrl, destination) {
    // Ensure destination doesn't exist
    if (await fs.pathExists(destination)) {
        throw new Error(`Destination already exists: ${destination}`);
    }
    const git = simpleGit();
    try {
        await git.clone(repoUrl, destination, ['--depth', '1']);
        // Remove .git folder to detach from source repo
        const gitDir = path.join(destination, '.git');
        await fs.remove(gitDir);
    }
    catch (error) {
        // Clean up partial clone on failure
        if (await fs.pathExists(destination)) {
            await fs.remove(destination);
        }
        throw error;
    }
}
/**
 * Initialize a new git repository
 */
export async function initRepository(directory) {
    const git = simpleGit(directory);
    await git.init();
}
/**
 * Check if a directory is a git repository
 */
export async function isGitRepository(directory) {
    const gitDir = path.join(directory, '.git');
    return fs.pathExists(gitDir);
}
/**
 * Get the current branch name
 */
export async function getCurrentBranch(directory) {
    const git = simpleGit(directory);
    const branch = await git.branch();
    return branch.current;
}
/**
 * Create a backup branch before making changes
 */
export async function createBackupBranch(directory, branchName) {
    const git = simpleGit(directory);
    await git.checkoutLocalBranch(branchName);
}
/**
 * Stage all changes
 */
export async function stageAllChanges(directory) {
    const git = simpleGit(directory);
    await git.add('.');
}
/**
 * Commit changes with a message
 */
export async function commitChanges(directory, message) {
    const git = simpleGit(directory);
    await git.commit(message);
}
//# sourceMappingURL=git.js.map