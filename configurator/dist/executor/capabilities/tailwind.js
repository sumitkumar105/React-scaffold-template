import path from 'path';
import { addDependencies } from '../../utils/npm.js';
import { writeFile, readFile, fileExists, } from '../../utils/files.js';
/**
 * Execute Tailwind CSS installation
 */
export async function executeTailwind(projectPath, plan) {
    // Step 1: Add dependencies
    await addDependencies(projectPath, {
        tailwindcss: '^3.4.1',
        postcss: '^8.4.35',
        autoprefixer: '^10.4.17',
    }, true // devDependencies
    );
    // Step 2: Create tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    await writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);
    // Step 3: Create postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    await writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
    // Step 4: Update global CSS
    const globalCssPath = path.join(projectPath, 'src/index.css');
    if (await fileExists(globalCssPath)) {
        const existingCss = await readFile(globalCssPath);
        // Check if Tailwind directives already exist
        if (!existingCss.includes('@tailwind')) {
            // Remove the commented out tailwind directives if they exist
            let newCss = existingCss.replace(/\/\*\s*@tailwind\s+base;\s*\*\/\s*\n?/g, '');
            newCss = newCss.replace(/\/\*\s*@tailwind\s+components;\s*\*\/\s*\n?/g, '');
            newCss = newCss.replace(/\/\*\s*@tailwind\s+utilities;\s*\*\/\s*\n?/g, '');
            // Add Tailwind directives at the top
            const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
            await writeFile(globalCssPath, tailwindDirectives + newCss);
        }
    }
    else {
        // Create new CSS file with Tailwind directives
        const newCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
        await writeFile(globalCssPath, newCss);
    }
}
//# sourceMappingURL=tailwind.js.map