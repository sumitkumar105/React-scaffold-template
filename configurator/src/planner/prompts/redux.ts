import type { PlanStep } from '../../types.js'

export const REDUX_PLAN: { steps: PlanStep[] } = {
  steps: [
    {
      action: 'addDependency',
      target: 'package.json',
      description: 'Add Redux Toolkit and React-Redux dependencies',
      dependencies: {
        '@reduxjs/toolkit': '^2.1.0',
        'react-redux': '^9.1.0',
      },
      isDev: false,
    },
    {
      action: 'createFile',
      target: 'src/store/index.ts',
      description: 'Create Redux store with configureStore',
    },
    {
      action: 'createFile',
      target: 'src/store/hooks.ts',
      description: 'Create typed useAppDispatch and useAppSelector hooks',
    },
    {
      action: 'createFile',
      target: 'src/store/slices/uiSlice.ts',
      description: 'Create UI slice (theme, sidebar, loading)',
    },
    {
      action: 'createFile',
      target: 'src/store/slices/authSlice.ts',
      description: 'Create auth slice (user, token, login/logout)',
    },
    {
      action: 'modifyFile',
      target: 'src/app/providers/index.tsx',
      description: 'Add Redux Provider wrapping',
    },
  ],
}
