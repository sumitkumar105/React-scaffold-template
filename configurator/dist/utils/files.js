import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
/**
 * Copy template directory to destination
 */
export async function copyTemplate(source, destination) {
    // Ensure source exists
    if (!await fs.pathExists(source)) {
        throw new Error(`Template source not found: ${source}`);
    }
    // Ensure destination doesn't exist
    if (await fs.pathExists(destination)) {
        throw new Error(`Destination already exists: ${destination}`);
    }
    // Copy directory
    await fs.copy(source, destination, {
        filter: (src) => {
            // Skip node_modules and .git
            const basename = path.basename(src);
            return basename !== 'node_modules' && basename !== '.git';
        },
    });
}
/**
 * Ensure a directory exists
 */
export async function ensureDirectory(dirPath) {
    await fs.ensureDir(dirPath);
}
/**
 * Read a file as string
 */
export async function readFile(filePath) {
    return fs.readFile(filePath, 'utf-8');
}
/**
 * Write content to a file
 */
export async function writeFile(filePath, content) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
}
/**
 * Check if a file exists
 */
export async function fileExists(filePath) {
    return fs.pathExists(filePath);
}
/**
 * Read and parse JSON file
 */
export async function readJsonFile(filePath) {
    const content = await readFile(filePath);
    return JSON.parse(content);
}
/**
 * Write JSON to file with pretty formatting
 */
export async function writeJsonFile(filePath, data) {
    const content = JSON.stringify(data, null, 2);
    await writeFile(filePath, content);
}
/**
 * Find files matching a glob pattern
 */
export async function findFiles(pattern, cwd) {
    return glob(pattern, { cwd, absolute: true });
}
/**
 * Append content to a file
 */
export async function appendToFile(filePath, content) {
    await fs.appendFile(filePath, content, 'utf-8');
}
/**
 * Insert content at a specific line in a file
 */
export async function insertAtLine(filePath, lineNumber, content) {
    const fileContent = await readFile(filePath);
    const lines = fileContent.split('\n');
    lines.splice(lineNumber, 0, content);
    await writeFile(filePath, lines.join('\n'));
}
/**
 * Replace content in a file
 */
export async function replaceInFile(filePath, search, replacement) {
    const content = await readFile(filePath);
    const newContent = content.replace(search, replacement);
    await writeFile(filePath, newContent);
}
/**
 * Check if file contains a string
 */
export async function fileContains(filePath, search) {
    const content = await readFile(filePath);
    return content.includes(search);
}
//# sourceMappingURL=files.js.map