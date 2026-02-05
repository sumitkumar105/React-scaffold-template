import type { PlanStep } from '../../types.js'

export const REACT_QUERY_PLAN: { steps: PlanStep[] } = {
  steps: [
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
      target: 'src/services/api/queryClient.ts',
      description: 'Create QueryClient configuration',
    },
    {
      action: 'createFile',
      target: 'src/shared/hooks/useApiQuery.ts',
      description: 'Create typed query hook using Axios apiClient',
    },
    {
      action: 'createFile',
      target: 'src/shared/hooks/useApiMutation.ts',
      description: 'Create typed mutation hook using Axios apiClient',
    },
    {
      action: 'modifyFile',
      target: 'src/app/providers/index.tsx',
      description: 'Add QueryClientProvider wrapping',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/hooks/index.ts',
      description: 'Re-export new hooks',
    },
  ],
}
