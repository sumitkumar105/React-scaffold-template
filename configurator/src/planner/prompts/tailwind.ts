import type { PlanStep } from '../../types.js'

export const TAILWIND_SYSTEM_PROMPT = `You are an expert at configuring Tailwind CSS in React projects.
Your task is to generate a configuration plan for adding Tailwind CSS to a project.

You must respond with a valid JSON object containing an array of steps.
Each step should have:
- "action": The type of action (addDependency, createFile, modifyFile, updateConfig)
- "target": The file or package to modify
- "description": A brief description of what this step does
- "content": The content to add (for createFile or modifyFile actions)
- "dependencies": Object of dependencies to add (for addDependency action)

Focus on:
1. Adding necessary dependencies (tailwindcss, postcss, autoprefixer)
2. Creating tailwind.config.js
3. Creating postcss.config.js
4. Updating the global CSS file with Tailwind directives
`

export const TAILWIND_USER_PROMPT = (context: {
  buildTool: string
  globalCssFile: string
  hasTypeScript: boolean
}) => `
Project context:
- Build tool: ${context.buildTool}
- Global CSS file: ${context.globalCssFile}
- TypeScript: ${context.hasTypeScript ? 'Yes' : 'No'}

Generate a plan to add Tailwind CSS v3 to this project.
Include steps for dependencies, config files, and CSS directives.
Response must be valid JSON with a "steps" array.
`

export const TAILWIND_FALLBACK_PLAN: { steps: PlanStep[] } = {
  steps: [
    {
      action: 'addDependency',
      target: 'package.json',
      description: 'Add Tailwind CSS dependencies',
      dependencies: {
        tailwindcss: '^3.4.1',
        postcss: '^8.4.35',
        autoprefixer: '^10.4.17',
      },
      isDev: true,
    },
    {
      action: 'createFile',
      target: 'tailwind.config.js',
      description: 'Create Tailwind configuration',
      content: `/** @type {import('tailwindcss').Config} */
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
`,
    },
    {
      action: 'createFile',
      target: 'postcss.config.js',
      description: 'Create PostCSS configuration',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
    },
    {
      action: 'modifyFile',
      target: 'src/index.css',
      description: 'Add Tailwind directives to global CSS',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

`,
      position: 'prepend',
    },
  ],
}
