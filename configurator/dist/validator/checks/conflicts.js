import path from 'path';
import { fileExists, readFile } from '../../utils/files.js';
// Define potential conflicts between capabilities
const CAPABILITY_CONFLICTS = {
    tailwind: {
        soft: [], // Tailwind works with most setups
        hard: [],
    },
    toast: {
        soft: [], // Multiple toast libraries can coexist but may be confusing
        hard: [],
    },
    forms: {
        soft: [], // Form libraries can coexist but typically you use one
        hard: [],
    },
    reactQuery: {
        soft: [], // Can coexist with other data fetching solutions
        hard: [],
    },
};
// Capability requirements
const CAPABILITY_REQUIREMENTS = {
    tailwind: { react: '>=16.0.0' },
    toast: { react: '>=18.0.0' },
    forms: { react: '>=16.8.0' },
    reactQuery: { react: '>=18.0.0' },
};
/**
 * Check for conflicts between capabilities and project setup
 */
export async function checkConflicts(projectPath, capabilities) {
    const warnings = [];
    const errors = [];
    // Check for conflicts between selected capabilities
    for (let i = 0; i < capabilities.length; i++) {
        for (let j = i + 1; j < capabilities.length; j++) {
            const cap1 = capabilities[i];
            const cap2 = capabilities[j];
            const conflicts1 = CAPABILITY_CONFLICTS[cap1];
            const conflicts2 = CAPABILITY_CONFLICTS[cap2];
            if (conflicts1?.hard.includes(cap2) || conflicts2?.hard.includes(cap1)) {
                errors.push(`'${cap1}' and '${cap2}' have a hard conflict and cannot be used together.`);
            }
            if (conflicts1?.soft.includes(cap2) || conflicts2?.soft.includes(cap1)) {
                warnings.push(`'${cap1}' and '${cap2}' may have compatibility issues when used together.`);
            }
        }
    }
    // Check React version compatibility
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fileExists(packageJsonPath)) {
        try {
            const content = await readFile(packageJsonPath);
            const packageJson = JSON.parse(content);
            const reactVersion = packageJson.dependencies?.react;
            if (reactVersion) {
                for (const capability of capabilities) {
                    const requirements = CAPABILITY_REQUIREMENTS[capability];
                    if (requirements) {
                        // Simple version check (would need semver for proper comparison)
                        const versionMatch = reactVersion.match(/\d+/);
                        if (versionMatch) {
                            const majorVersion = parseInt(versionMatch[0], 10);
                            if (capability === 'toast' && majorVersion < 18) {
                                warnings.push(`Sonner works best with React 18+. You have React ${reactVersion}.`);
                            }
                            if (capability === 'reactQuery' && majorVersion < 18) {
                                warnings.push(`React Query v5 works best with React 18+. You have React ${reactVersion}.`);
                            }
                        }
                    }
                }
            }
        }
        catch {
            // Ignore parse errors
        }
    }
    // Check for TypeScript configuration
    const tsConfigPath = path.join(projectPath, 'tsconfig.json');
    const hasTsConfig = await fileExists(tsConfigPath);
    if (!hasTsConfig) {
        warnings.push('No tsconfig.json found. Type definitions may not work correctly.');
    }
    // Check for build tool compatibility
    const viteConfigExists = await fileExists(path.join(projectPath, 'vite.config.ts')) ||
        await fileExists(path.join(projectPath, 'vite.config.js'));
    if (!viteConfigExists) {
        const nextConfigExists = await fileExists(path.join(projectPath, 'next.config.js')) ||
            await fileExists(path.join(projectPath, 'next.config.ts'));
        if (!nextConfigExists) {
            warnings.push('No Vite or Next.js config found. Some features may require manual configuration.');
        }
    }
    return { warnings, errors };
}
//# sourceMappingURL=conflicts.js.map