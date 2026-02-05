import type { PlanStep } from '../../types.js'

export const TAILWIND_PLAN: { steps: PlanStep[] } = {
  steps: [
    {
      action: 'addDependency',
      target: 'package.json',
      description: 'Add Tailwind CSS dev dependencies',
      dependencies: {
        tailwindcss: '^3.4.1',
        postcss: '^8.4.35',
        autoprefixer: '^10.4.17',
      },
      isDev: true,
    },
    {
      action: 'addDependency',
      target: 'package.json',
      description: 'Add clsx and tailwind-merge',
      dependencies: {
        clsx: '^2.1.0',
        'tailwind-merge': '^2.2.0',
      },
      isDev: false,
    },
    {
      action: 'createFile',
      target: 'tailwind.config.ts',
      description: 'Create Tailwind configuration',
    },
    {
      action: 'createFile',
      target: 'postcss.config.js',
      description: 'Create PostCSS configuration',
    },
    {
      action: 'modifyFile',
      target: 'src/index.css',
      description: 'Replace CSS with Tailwind directives',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/utils/cn.ts',
      description: 'Upgrade cn utility to use clsx + tailwind-merge',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/components/Button.tsx',
      description: 'Replace inline styles with Tailwind classes',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/components/Input.tsx',
      description: 'Replace inline styles with Tailwind classes',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/components/Modal.tsx',
      description: 'Replace inline styles with Tailwind classes',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/components/Loader.tsx',
      description: 'Replace inline styles with Tailwind classes',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/components/MainLayout.tsx',
      description: 'Replace inline styles with Tailwind classes',
    },
    {
      action: 'modifyFile',
      target: 'src/shared/components/NotFoundPage.tsx',
      description: 'Replace inline styles with Tailwind classes',
    },
  ],
}
