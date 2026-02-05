export const FORMS_PLAN = {
    steps: [
        {
            action: 'addDependency',
            target: 'package.json',
            description: 'Add React Hook Form and resolver dependencies',
            dependencies: {
                'react-hook-form': '^7.50.1',
                '@hookform/resolvers': '^3.3.4',
            },
            isDev: false,
        },
        {
            action: 'createFile',
            target: 'src/shared/hooks/useZodForm.ts',
            description: 'Create Zod form hook',
        },
        {
            action: 'createFile',
            target: 'src/shared/components/FormField.tsx',
            description: 'Create reusable form field component',
        },
        {
            action: 'modifyFile',
            target: 'src/features/auth/components/LoginForm.tsx',
            description: 'Upgrade login form to use RHF + Zod',
        },
        {
            action: 'modifyFile',
            target: 'src/features/auth/types/index.ts',
            description: 'Add Zod schemas to auth types',
        },
        {
            action: 'modifyFile',
            target: 'src/shared/components/index.ts',
            description: 'Re-export FormField',
        },
        {
            action: 'modifyFile',
            target: 'src/shared/hooks/index.ts',
            description: 'Re-export useZodForm',
        },
    ],
};
//# sourceMappingURL=forms.js.map