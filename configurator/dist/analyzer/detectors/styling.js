import path from 'path';
import { fileExists, readFile, fileContains } from '../../utils/files.js';
/**
 * Detect styling frameworks and tools in the project
 */
export async function detectStyling(projectPath) {
    const frameworks = [];
    let hasTailwind = false;
    let hasPostCss = false;
    let hasSass = false;
    let hasCssModules = false;
    // Check package.json for styling dependencies
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fileExists(packageJsonPath)) {
        try {
            const content = await readFile(packageJsonPath);
            const packageJson = JSON.parse(content);
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies,
            };
            // Tailwind CSS
            if (allDeps['tailwindcss']) {
                frameworks.push('tailwind');
                hasTailwind = true;
            }
            // PostCSS
            if (allDeps['postcss'] || allDeps['postcss-cli']) {
                hasPostCss = true;
            }
            // Sass
            if (allDeps['sass'] || allDeps['node-sass']) {
                frameworks.push('sass');
                hasSass = true;
            }
            // Styled Components
            if (allDeps['styled-components']) {
                frameworks.push('styled-components');
            }
            // Emotion
            if (allDeps['@emotion/react'] || allDeps['@emotion/styled']) {
                frameworks.push('emotion');
            }
            // CSS Modules (check for naming pattern in files)
            // This is just a basic check - would need file scanning for accuracy
        }
        catch {
            // Ignore JSON parse errors
        }
    }
    // Check for Tailwind config files
    const tailwindConfigs = [
        'tailwind.config.js',
        'tailwind.config.ts',
        'tailwind.config.cjs',
        'tailwind.config.mjs',
    ];
    for (const config of tailwindConfigs) {
        const fullPath = path.join(projectPath, config);
        if (await fileExists(fullPath)) {
            if (!hasTailwind) {
                frameworks.push('tailwind');
                hasTailwind = true;
            }
            break;
        }
    }
    // Check for PostCSS config
    const postcssConfigs = [
        'postcss.config.js',
        'postcss.config.cjs',
        'postcss.config.mjs',
        '.postcssrc',
    ];
    for (const config of postcssConfigs) {
        const fullPath = path.join(projectPath, config);
        if (await fileExists(fullPath)) {
            hasPostCss = true;
            break;
        }
    }
    // Check global CSS for Tailwind directives
    const globalCssPaths = [
        'src/index.css',
        'src/global.css',
        'src/globals.css',
        'app/globals.css',
    ];
    for (const cssPath of globalCssPaths) {
        const fullPath = path.join(projectPath, cssPath);
        if (await fileExists(fullPath)) {
            if (await fileContains(fullPath, '@tailwind')) {
                if (!hasTailwind) {
                    frameworks.push('tailwind');
                    hasTailwind = true;
                }
            }
            break;
        }
    }
    // Check for CSS Modules usage
    const srcPath = path.join(projectPath, 'src');
    if (await fileExists(srcPath)) {
        const { glob } = await import('glob');
        const moduleFiles = await glob('**/*.module.css', { cwd: srcPath });
        if (moduleFiles.length > 0) {
            hasCssModules = true;
            if (!frameworks.includes('css-modules')) {
                frameworks.push('css-modules');
            }
        }
    }
    return {
        frameworks,
        hasTailwind,
        hasPostCss,
        hasSass,
        hasCssModules,
    };
}
//# sourceMappingURL=styling.js.map