import path from 'path';
import { fileExists } from '../../utils/files.js';
/**
 * Detect the build tool used by the project
 */
export async function detectBuildTool(projectPath) {
    const configFiles = [];
    // Check for Vite
    const viteConfigs = [
        'vite.config.ts',
        'vite.config.js',
        'vite.config.mts',
        'vite.config.mjs',
    ];
    for (const config of viteConfigs) {
        const fullPath = path.join(projectPath, config);
        if (await fileExists(fullPath)) {
            configFiles.push(config);
            return { tool: 'vite', configFiles };
        }
    }
    // Check for Next.js
    const nextConfigs = ['next.config.js', 'next.config.ts', 'next.config.mjs'];
    for (const config of nextConfigs) {
        const fullPath = path.join(projectPath, config);
        if (await fileExists(fullPath)) {
            configFiles.push(config);
            return { tool: 'next', configFiles };
        }
    }
    // Check for Webpack
    const webpackConfigs = [
        'webpack.config.js',
        'webpack.config.ts',
        'config/webpack.config.js',
    ];
    for (const config of webpackConfigs) {
        const fullPath = path.join(projectPath, config);
        if (await fileExists(fullPath)) {
            configFiles.push(config);
            return { tool: 'webpack', configFiles };
        }
    }
    // Check for Create React App (react-scripts in package.json)
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fileExists(packageJsonPath)) {
        try {
            const fs = await import('fs-extra');
            const packageJson = await fs.readJson(packageJsonPath);
            if (packageJson.dependencies?.['react-scripts'] ||
                packageJson.devDependencies?.['react-scripts']) {
                return { tool: 'cra', configFiles: ['package.json'] };
            }
        }
        catch {
            // Ignore JSON parse errors
        }
    }
    return { tool: 'unknown', configFiles };
}
/**
 * Get the PostCSS config path if it exists
 */
export async function detectPostCssConfig(projectPath) {
    const configs = [
        'postcss.config.js',
        'postcss.config.cjs',
        'postcss.config.mjs',
        '.postcssrc',
        '.postcssrc.json',
    ];
    for (const config of configs) {
        const fullPath = path.join(projectPath, config);
        if (await fileExists(fullPath)) {
            return config;
        }
    }
    return null;
}
//# sourceMappingURL=buildTool.js.map