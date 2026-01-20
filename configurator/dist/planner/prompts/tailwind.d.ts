import type { PlanStep } from '../../types.js';
export declare const TAILWIND_SYSTEM_PROMPT = "You are an expert at configuring Tailwind CSS in React projects.\nYour task is to generate a configuration plan for adding Tailwind CSS to a project.\n\nYou must respond with a valid JSON object containing an array of steps.\nEach step should have:\n- \"action\": The type of action (addDependency, createFile, modifyFile, updateConfig)\n- \"target\": The file or package to modify\n- \"description\": A brief description of what this step does\n- \"content\": The content to add (for createFile or modifyFile actions)\n- \"dependencies\": Object of dependencies to add (for addDependency action)\n\nFocus on:\n1. Adding necessary dependencies (tailwindcss, postcss, autoprefixer)\n2. Creating tailwind.config.js\n3. Creating postcss.config.js\n4. Updating the global CSS file with Tailwind directives\n";
export declare const TAILWIND_USER_PROMPT: (context: {
    buildTool: string;
    globalCssFile: string;
    hasTypeScript: boolean;
}) => string;
export declare const TAILWIND_FALLBACK_PLAN: {
    steps: PlanStep[];
};
//# sourceMappingURL=tailwind.d.ts.map