import type { PlanStep } from '../../types.js';
export declare const FORMS_SYSTEM_PROMPT = "You are an expert at integrating form handling libraries in React projects.\nYour task is to generate a configuration plan for adding React Hook Form with Zod validation.\n\nYou must respond with a valid JSON object containing an array of steps.\nEach step should have:\n- \"action\": The type of action (addDependency, createFile, modifyFile, updateConfig)\n- \"target\": The file or package to modify\n- \"description\": A brief description of what this step does\n- \"content\": The content to add (for createFile or modifyFile actions)\n- \"dependencies\": Object of dependencies to add (for addDependency action)\n\nFocus on:\n1. Adding react-hook-form, zod, and @hookform/resolvers dependencies\n2. Creating a reusable form hook\n3. Creating example form component\n";
export declare const FORMS_USER_PROMPT: (context: {
    hasTypeScript: boolean;
    srcDirectory: string;
}) => string;
export declare const FORMS_FALLBACK_PLAN: {
    steps: PlanStep[];
};
//# sourceMappingURL=forms.d.ts.map