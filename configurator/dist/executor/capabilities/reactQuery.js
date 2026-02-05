import path from 'path';
import fs from 'fs-extra';
import { addDependencies } from '../../utils/npm.js';
import { writeFile, readFile, fileExists, } from '../../utils/files.js';
import { regenerateProviders } from './providerComposer.js';
export async function executeReactQuery(projectPath, _plan) {
    // Step 1: Add dependencies
    await addDependencies(projectPath, {
        '@tanstack/react-query': '^5.24.1',
        '@tanstack/react-query-devtools': '^5.24.1',
    }, false);
    // Step 2: Create queryClient config
    const servicesDir = path.join(projectPath, 'src/services/api');
    await fs.ensureDir(servicesDir);
    const queryClientContent = `import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
`;
    await writeFile(path.join(servicesDir, 'queryClient.ts'), queryClientContent);
    // Step 3: Create useApiQuery hook
    const hooksDir = path.join(projectPath, 'src/shared/hooks');
    await fs.ensureDir(hooksDir);
    const useApiQueryContent = `import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { apiClient } from '@services/index'
import type { AxiosError } from 'axios'

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url)
      return data
    },
    ...options,
  })
}
`;
    await writeFile(path.join(hooksDir, 'useApiQuery.ts'), useApiQueryContent);
    // Step 4: Create useApiMutation hook
    const useApiMutationContent = `import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@services/index'
import type { AxiosError } from 'axios'

interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void
  onError?: (error: AxiosError) => void
  invalidateKeys?: string[][]
}

export function useApiMutation<TData, TVariables>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options?: MutationOptions<TData>
) {
  const queryClient = useQueryClient()

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await apiClient[method]<TData>(url, variables)
      return data
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
    onError: options?.onError,
  })
}
`;
    await writeFile(path.join(hooksDir, 'useApiMutation.ts'), useApiMutationContent);
    // Step 5: Update hooks barrel export
    const hooksIndexPath = path.join(projectPath, 'src/shared/hooks/index.ts');
    if (await fileExists(hooksIndexPath)) {
        let hooksIndex = await readFile(hooksIndexPath);
        if (!hooksIndex.includes('useApiQuery')) {
            hooksIndex += `export { useApiQuery } from './useApiQuery'\n`;
        }
        if (!hooksIndex.includes('useApiMutation')) {
            hooksIndex += `export { useApiMutation } from './useApiMutation'\n`;
        }
        await writeFile(hooksIndexPath, hooksIndex);
    }
    // Step 6: Update providers
    await regenerateProviders(projectPath);
}
//# sourceMappingURL=reactQuery.js.map