import path from 'path'
import {
  writeFile,
  fileExists,
} from '../../utils/files.js'

/**
 * Regenerate the providers/index.tsx file based on which providers
 * are detected in the project. This avoids fragile regex replacements
 * by writing the entire file from scratch each time.
 *
 * Provider nesting order (outermost to innermost):
 * ErrorBoundary > ReduxProvider? > QueryClientProvider? > BrowserRouter > {children}
 */
export async function regenerateProviders(projectPath: string): Promise<void> {
  const hasRedux = await fileExists(path.join(projectPath, 'src/store/index.ts'))
  const hasReactQuery = await fileExists(path.join(projectPath, 'src/services/api/queryClient.ts'))

  const imports: string[] = [
    `import { ReactNode } from 'react'`,
    `import { BrowserRouter } from 'react-router-dom'`,
    `import { ErrorBoundary } from '@shared/components'`,
  ]

  if (hasRedux) {
    imports.push(`import { Provider as ReduxProvider } from 'react-redux'`)
    imports.push(`import { store } from '@store/index'`)
  }

  if (hasReactQuery) {
    imports.push(`import { QueryClientProvider } from '@tanstack/react-query'`)
    imports.push(`import { ReactQueryDevtools } from '@tanstack/react-query-devtools'`)
    imports.push(`import { queryClient } from '@services/api/queryClient'`)
  }

  let jsxBody: string

  if (hasRedux && hasReactQuery) {
    jsxBody = `      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ReduxProvider>`
  } else if (hasRedux) {
    jsxBody = `      <ReduxProvider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ReduxProvider>`
  } else if (hasReactQuery) {
    jsxBody = `      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>`
  } else {
    jsxBody = `      <BrowserRouter>
        {children}
      </BrowserRouter>`
  }

  const content = `${imports.join('\n')}

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
${jsxBody}
    </ErrorBoundary>
  )
}
`

  await writeFile(path.join(projectPath, 'src/app/providers/index.tsx'), content)
}
