import { generateStructuredOutput } from './openai.js';
import { TAILWIND_SYSTEM_PROMPT, TAILWIND_USER_PROMPT, TAILWIND_FALLBACK_PLAN, } from './prompts/tailwind.js';
import { TOAST_SYSTEM_PROMPT, TOAST_USER_PROMPT, TOAST_FALLBACK_PLAN, } from './prompts/toast.js';
import { FORMS_SYSTEM_PROMPT, FORMS_USER_PROMPT, FORMS_FALLBACK_PLAN, } from './prompts/forms.js';
/**
 * Create an execution plan for a capability
 */
export async function createPlan(capability, analysis) {
    const useAI = !!process.env.OPENAI_API_KEY;
    let steps;
    switch (capability) {
        case 'tailwind':
            steps = useAI
                ? await createTailwindPlanWithAI(analysis)
                : TAILWIND_FALLBACK_PLAN.steps;
            break;
        case 'toast':
            steps = useAI
                ? await createToastPlanWithAI(analysis)
                : TOAST_FALLBACK_PLAN.steps;
            break;
        case 'forms':
            steps = useAI
                ? await createFormsPlanWithAI(analysis)
                : FORMS_FALLBACK_PLAN.steps;
            break;
        case 'reactQuery':
            steps = createReactQueryPlan(analysis);
            break;
        default:
            throw new Error(`Unknown capability: ${capability}`);
    }
    return {
        capability,
        steps,
    };
}
async function createTailwindPlanWithAI(analysis) {
    try {
        const globalCssFile = analysis.styling.includes('tailwind')
            ? 'src/index.css'
            : 'src/index.css';
        const result = await generateStructuredOutput(TAILWIND_SYSTEM_PROMPT, TAILWIND_USER_PROMPT({
            buildTool: analysis.buildTool,
            globalCssFile,
            hasTypeScript: analysis.hasTypeScript,
        }));
        return result.steps || TAILWIND_FALLBACK_PLAN.steps;
    }
    catch (error) {
        console.warn('AI planning failed, using fallback plan:', error);
        return TAILWIND_FALLBACK_PLAN.steps;
    }
}
async function createToastPlanWithAI(analysis) {
    try {
        const result = await generateStructuredOutput(TOAST_SYSTEM_PROMPT, TOAST_USER_PROMPT({
            appFile: `${analysis.srcDirectory}/App.tsx`,
            hasTypeScript: analysis.hasTypeScript,
        }));
        return result.steps || TOAST_FALLBACK_PLAN.steps;
    }
    catch (error) {
        console.warn('AI planning failed, using fallback plan:', error);
        return TOAST_FALLBACK_PLAN.steps;
    }
}
async function createFormsPlanWithAI(analysis) {
    try {
        const result = await generateStructuredOutput(FORMS_SYSTEM_PROMPT, FORMS_USER_PROMPT({
            hasTypeScript: analysis.hasTypeScript,
            srcDirectory: analysis.srcDirectory,
        }));
        return result.steps || FORMS_FALLBACK_PLAN.steps;
    }
    catch (error) {
        console.warn('AI planning failed, using fallback plan:', error);
        return FORMS_FALLBACK_PLAN.steps;
    }
}
function createReactQueryPlan(analysis) {
    return [
        {
            action: 'addDependency',
            target: 'package.json',
            description: 'Add React Query dependencies',
            dependencies: {
                '@tanstack/react-query': '^5.24.1',
                '@tanstack/react-query-devtools': '^5.24.1',
            },
            isDev: false,
        },
        {
            action: 'createFile',
            target: `${analysis.srcDirectory}/providers/QueryProvider.tsx`,
            description: 'Create Query Client Provider',
            content: `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
`,
        },
        {
            action: 'createFile',
            target: `${analysis.srcDirectory}/hooks/useApi.ts`,
            description: 'Create API query hooks',
            content: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Example: Generic fetch function
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }
  return response.json()
}

// Example: useQuery hook wrapper
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: key,
    queryFn: () => fetchData<T>(url),
    ...options,
  })
}

// Example: useMutation hook wrapper
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void
    invalidateKeys?: string[][]
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      options?.onSuccess?.(data)
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
`,
        },
        {
            action: 'modifyFile',
            target: `${analysis.srcDirectory}/main.tsx`,
            description: 'Wrap app with QueryProvider',
            searchPattern: "import App from './App'",
            content: `import App from './App'
import { QueryProvider } from './providers/QueryProvider'`,
        },
    ];
}
//# sourceMappingURL=index.js.map