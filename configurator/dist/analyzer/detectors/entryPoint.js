import path from 'path';
import { fileExists, findFiles } from '../../utils/files.js';
/**
 * Detect the entry point file of the project
 */
export async function detectEntryPoint(projectPath) {
    // Common entry point patterns
    const patterns = [
        'src/main.tsx',
        'src/main.ts',
        'src/main.jsx',
        'src/main.js',
        'src/index.tsx',
        'src/index.ts',
        'src/index.jsx',
        'src/index.js',
        'app/page.tsx', // Next.js App Router
        'pages/index.tsx', // Next.js Pages Router
        'pages/_app.tsx',
    ];
    for (const pattern of patterns) {
        const fullPath = path.join(projectPath, pattern);
        if (await fileExists(fullPath)) {
            const hasTypeScript = pattern.endsWith('.tsx') || pattern.endsWith('.ts');
            const srcDirectory = path.dirname(pattern);
            return {
                file: pattern,
                hasTypeScript,
                srcDirectory,
            };
        }
    }
    // Fallback: search for any entry-like file
    const tsxFiles = await findFiles('**/main.tsx', projectPath);
    if (tsxFiles.length > 0) {
        const relativePath = path.relative(projectPath, tsxFiles[0]);
        return {
            file: relativePath,
            hasTypeScript: true,
            srcDirectory: path.dirname(relativePath),
        };
    }
    const jsxFiles = await findFiles('**/main.jsx', projectPath);
    if (jsxFiles.length > 0) {
        const relativePath = path.relative(projectPath, jsxFiles[0]);
        return {
            file: relativePath,
            hasTypeScript: false,
            srcDirectory: path.dirname(relativePath),
        };
    }
    // Default fallback
    return {
        file: 'src/main.tsx',
        hasTypeScript: true,
        srcDirectory: 'src',
    };
}
/**
 * Detect the App component file
 */
export async function detectAppFile(projectPath) {
    const patterns = [
        'src/App.tsx',
        'src/App.ts',
        'src/App.jsx',
        'src/App.js',
        'app/layout.tsx', // Next.js App Router
    ];
    for (const pattern of patterns) {
        const fullPath = path.join(projectPath, pattern);
        if (await fileExists(fullPath)) {
            return pattern;
        }
    }
    return null;
}
/**
 * Detect global CSS file
 */
export async function detectGlobalCssFile(projectPath) {
    const patterns = [
        'src/index.css',
        'src/global.css',
        'src/globals.css',
        'src/styles/globals.css',
        'app/globals.css', // Next.js App Router
        'styles/globals.css',
    ];
    for (const pattern of patterns) {
        const fullPath = path.join(projectPath, pattern);
        if (await fileExists(fullPath)) {
            return pattern;
        }
    }
    return null;
}
//# sourceMappingURL=entryPoint.js.map