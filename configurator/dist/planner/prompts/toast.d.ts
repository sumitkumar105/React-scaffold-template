import type { PlanStep } from '../../types.js';
export declare const TOAST_SYSTEM_PROMPT = "You are an expert at integrating toast notification libraries in React projects.\nYour task is to generate a configuration plan for adding Sonner (toast library) to a project.\n\nYou must respond with a valid JSON object containing an array of steps.\nEach step should have:\n- \"action\": The type of action (addDependency, createFile, modifyFile, updateConfig)\n- \"target\": The file or package to modify\n- \"description\": A brief description of what this step does\n- \"content\": The content to add (for createFile or modifyFile actions)\n- \"dependencies\": Object of dependencies to add (for addDependency action)\n\nFocus on:\n1. Adding the sonner dependency\n2. Adding the Toaster component to the app\n3. Creating a utility hook for toast notifications\n";
export declare const TOAST_USER_PROMPT: (context: {
    appFile: string;
    hasTypeScript: boolean;
}) => string;
export declare const TOAST_FALLBACK_PLAN: {
    steps: PlanStep[];
};
//# sourceMappingURL=toast.d.ts.map