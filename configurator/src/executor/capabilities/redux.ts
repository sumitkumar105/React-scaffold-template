import path from 'path'
import fs from 'fs-extra'
import type { Plan } from '../../types.js'
import { addDependencies } from '../../utils/npm.js'
import {
  writeFile,
  readFile,
  fileExists,
} from '../../utils/files.js'
import { regenerateProviders } from './providerComposer.js'

export async function executeRedux(
  projectPath: string,
  _plan: Plan
): Promise<void> {
  // Step 1: Add dependencies
  await addDependencies(
    projectPath,
    {
      '@reduxjs/toolkit': '^2.1.0',
      'react-redux': '^9.1.0',
    },
    false
  )

  // Step 2: Create store directory and files
  const storeDir = path.join(projectPath, 'src/store')
  await fs.ensureDir(path.join(storeDir, 'slices'))

  // store/index.ts
  const storeIndex = `import { configureStore } from '@reduxjs/toolkit'
import { uiReducer } from './slices/uiSlice'
import { authReducer } from './slices/authSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
`
  await writeFile(path.join(storeDir, 'index.ts'), storeIndex)

  // store/hooks.ts
  const storeHooks = `import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
`
  await writeFile(path.join(storeDir, 'hooks.ts'), storeHooks)

  // store/slices/uiSlice.ts
  const uiSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  isLoading: boolean
}

const initialState: UiState = {
  theme: 'light',
  sidebarOpen: false,
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const { setTheme, toggleSidebar, setLoading } = uiSlice.actions
export const uiReducer = uiSlice.reducer
`
  await writeFile(path.join(storeDir, 'slices/uiSlice.ts'), uiSlice)

  // store/slices/authSlice.ts
  const authSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('auth_token', action.payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('auth_token')
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
  },
})

export const { login, logout, setUser } = authSlice.actions
export const authReducer = authSlice.reducer
`
  await writeFile(path.join(storeDir, 'slices/authSlice.ts'), authSlice)

  // Step 3: Update providers
  await regenerateProviders(projectPath)
}
