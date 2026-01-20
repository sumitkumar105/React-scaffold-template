/**
 * Copy template directory to destination
 */
export declare function copyTemplate(source: string, destination: string): Promise<void>;
/**
 * Ensure a directory exists
 */
export declare function ensureDirectory(dirPath: string): Promise<void>;
/**
 * Read a file as string
 */
export declare function readFile(filePath: string): Promise<string>;
/**
 * Write content to a file
 */
export declare function writeFile(filePath: string, content: string): Promise<void>;
/**
 * Check if a file exists
 */
export declare function fileExists(filePath: string): Promise<boolean>;
/**
 * Read and parse JSON file
 */
export declare function readJsonFile<T>(filePath: string): Promise<T>;
/**
 * Write JSON to file with pretty formatting
 */
export declare function writeJsonFile(filePath: string, data: unknown): Promise<void>;
/**
 * Find files matching a glob pattern
 */
export declare function findFiles(pattern: string, cwd: string): Promise<string[]>;
/**
 * Append content to a file
 */
export declare function appendToFile(filePath: string, content: string): Promise<void>;
/**
 * Insert content at a specific line in a file
 */
export declare function insertAtLine(filePath: string, lineNumber: number, content: string): Promise<void>;
/**
 * Replace content in a file
 */
export declare function replaceInFile(filePath: string, search: string | RegExp, replacement: string): Promise<void>;
/**
 * Check if file contains a string
 */
export declare function fileContains(filePath: string, search: string): Promise<boolean>;
//# sourceMappingURL=files.d.ts.map