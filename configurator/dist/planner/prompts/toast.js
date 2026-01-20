export const TOAST_SYSTEM_PROMPT = `You are an expert at integrating toast notification libraries in React projects.
Your task is to generate a configuration plan for adding Sonner (toast library) to a project.

You must respond with a valid JSON object containing an array of steps.
Each step should have:
- "action": The type of action (addDependency, createFile, modifyFile, updateConfig)
- "target": The file or package to modify
- "description": A brief description of what this step does
- "content": The content to add (for createFile or modifyFile actions)
- "dependencies": Object of dependencies to add (for addDependency action)

Focus on:
1. Adding the sonner dependency
2. Adding the Toaster component to the app
3. Creating a utility hook for toast notifications
`;
export const TOAST_USER_PROMPT = (context) => `
Project context:
- App file: ${context.appFile}
- TypeScript: ${context.hasTypeScript ? 'Yes' : 'No'}

Generate a plan to add Sonner toast notifications to this project.
Include steps for dependencies and integrating the Toaster component.
Response must be valid JSON with a "steps" array.
`;
export const TOAST_FALLBACK_PLAN = {
    steps: [
        {
            action: 'addDependency',
            target: 'package.json',
            description: 'Add Sonner dependency',
            dependencies: {
                sonner: '^1.4.0',
            },
            isDev: false,
        },
        {
            action: 'modifyFile',
            target: 'src/App.tsx',
            description: 'Add Toaster component import',
            searchPattern: "import { Routes",
            content: `import { Toaster } from 'sonner'
import { Routes`,
        },
        {
            action: 'modifyFile',
            target: 'src/App.tsx',
            description: 'Add Toaster component to JSX',
            searchPattern: '<div className="app">',
            content: `<div className="app">
      <Toaster richColors position="top-right" />`,
        },
        {
            action: 'createFile',
            target: 'src/hooks/useToast.ts',
            description: 'Create toast utility hook',
            content: `import { toast } from 'sonner'

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
    loading: (message: string) => toast.loading(message),
    dismiss: (toastId?: string | number) => toast.dismiss(toastId),
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string
        error: string
      }
    ) => toast.promise(promise, options),
  }
}
`,
        },
    ],
};
//# sourceMappingURL=toast.js.map