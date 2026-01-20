import path from 'path'
import fs from 'fs-extra'
import type { Plan } from '../../planner/index.js'
import { addDependencies } from '../../utils/npm.js'
import {
  writeFile,
  readFile,
  fileExists,
} from '../../utils/files.js'

/**
 * Execute React Query installation
 */
export async function executeReactQuery(
  projectPath: string,
  plan: Plan
): Promise<void> {
  // Step 1: Add dependencies
  await addDependencies(
    projectPath,
    {
      '@tanstack/react-query': '^5.24.1',
      '@tanstack/react-query-devtools': '^5.24.1',
    },
    false
  )

  // Step 2: Create providers directory and QueryProvider
  const providersDir = path.join(projectPath, 'src/providers')
  await fs.ensureDir(providersDir)

  const queryProviderContent = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
            refetchOnWindowFocus: false,
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
`

  await writeFile(
    path.join(providersDir, 'QueryProvider.tsx'),
    queryProviderContent
  )

  // Step 3: Create API hooks
  const hooksDir = path.join(projectPath, 'src/hooks')
  await fs.ensureDir(hooksDir)

  const useApiContent = `import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'

// Generic fetch function
async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }

  return response.json()
}

// GET request hook
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: () => fetchData<T>(url),
    ...options,
  })
}

// POST/PUT/DELETE mutation hook
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: Error) => void
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
    onError: options?.onError,
  })
}

// POST request helper
export async function postData<T, D>(url: string, data: D): Promise<T> {
  return fetchData<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PUT request helper
export async function putData<T, D>(url: string, data: D): Promise<T> {
  return fetchData<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// DELETE request helper
export async function deleteData<T>(url: string): Promise<T> {
  return fetchData<T>(url, {
    method: 'DELETE',
  })
}
`

  await writeFile(path.join(hooksDir, 'useApi.ts'), useApiContent)

  // Step 4: Update main.tsx to wrap with QueryProvider
  const mainPath = path.join(projectPath, 'src/main.tsx')
  if (await fileExists(mainPath)) {
    let mainContent = await readFile(mainPath)

    // Add QueryProvider import if not present
    if (!mainContent.includes('QueryProvider')) {
      // Add import after other imports
      const lastImportIndex = mainContent.lastIndexOf('import')
      const nextLineIndex = mainContent.indexOf('\n', lastImportIndex)
      const importStatement = `\nimport { QueryProvider } from './providers/QueryProvider'`

      mainContent =
        mainContent.slice(0, nextLineIndex) +
        importStatement +
        mainContent.slice(nextLineIndex)

      // Wrap App with QueryProvider
      // Find the BrowserRouter and wrap content
      if (mainContent.includes('<BrowserRouter>')) {
        mainContent = mainContent.replace(
          '<BrowserRouter>',
          '<QueryProvider>\n    <BrowserRouter>'
        )
        mainContent = mainContent.replace(
          '</BrowserRouter>',
          '</BrowserRouter>\n    </QueryProvider>'
        )
      } else if (mainContent.includes('<App />') || mainContent.includes('<App/>')) {
        // If no BrowserRouter, wrap App directly
        mainContent = mainContent.replace(
          /<App\s*\/>/,
          '<QueryProvider>\n      <App />\n    </QueryProvider>'
        )
      }

      await writeFile(mainPath, mainContent)
    }
  }
}
