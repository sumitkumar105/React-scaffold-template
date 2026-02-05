# create-react-scaffold

[![npm version](https://img.shields.io/npm/v/create-react-scaffold.svg)](https://www.npmjs.com/package/create-react-scaffold)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

> A modern CLI tool to scaffold production-ready React projects with feature-based architecture, TypeScript, and Vite.

```
  create-react-scaffold

  Modern React project generator with feature-based architecture

  Usage: npx create-react-scaffold my-app
```

---

## Why create-react-scaffold?

- **Feature-based architecture** - Organize code by domain, not by type
- **TypeScript first** - Full type safety with pre-configured path aliases
- **Vite powered** - Lightning-fast dev server and builds
- **Optional capabilities** - Add only what you need (Tailwind, Redux, React Query, Forms)
- **Production ready** - ESLint, Prettier, Axios client, error boundaries out of the box
- **Zero config** - Works immediately after scaffolding

---

## Quick Start

```bash
# Using npx (recommended)
npx create-react-scaffold my-app

# Or install globally
npm install -g create-react-scaffold
create-react-scaffold my-app
```

Then:

```bash
cd my-app
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Installation

### Option 1: Use with npx (no installation)

```bash
npx create-react-scaffold my-app
```

### Option 2: Install globally

```bash
npm install -g create-react-scaffold
create-react-scaffold my-app
```

### Option 3: Install locally in a project

```bash
npm install create-react-scaffold
npx create-react-scaffold my-app
```

---

## Usage

### Interactive Mode (Recommended)

```bash
npx create-react-scaffold
```

The CLI guides you through 3 simple steps:

1. **Project name** - Enter your project name
2. **Capabilities** - Select optional features with arrow keys + space
3. **Confirm** - Review and confirm your choices

### Non-Interactive Mode

```bash
# Base template only
npx create-react-scaffold my-app -y

# With specific capabilities
npx create-react-scaffold my-app --tailwind --redux

# All capabilities
npx create-react-scaffold my-app --tailwind --redux --react-query --forms

# Custom output directory
npx create-react-scaffold my-app -o ~/projects

# Skip npm install
npx create-react-scaffold my-app --skip-install
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `create-react-scaffold [name]` | Create a new project (default) |
| `create-react-scaffold list` | List all available capabilities |
| `create-react-scaffold analyze <path>` | Analyze an existing project |

### Options

| Flag | Short | Description |
|------|-------|-------------|
| `--tailwind` | | Add Tailwind CSS with clsx + tailwind-merge |
| `--redux` | | Add Redux Toolkit with typed hooks |
| `--react-query` | | Add TanStack React Query with devtools |
| `--forms` | | Add React Hook Form + Zod validation |
| `--output <path>` | `-o` | Set output directory |
| `--skip-install` | | Skip running npm install |
| `--yes` | `-y` | Skip prompts, use defaults |
| `--version` | `-V` | Show version number |
| `--help` | `-h` | Show help |

---

## Capabilities

### Tailwind CSS

```bash
npx create-react-scaffold my-app --tailwind
```

**What you get:**
- `tailwindcss`, `postcss`, `autoprefixer` configured
- `clsx` + `tailwind-merge` for conditional classes
- Pre-configured `tailwind.config.ts`
- `cn()` utility function for merging classes
- All shared components converted to Tailwind classes

### Redux Toolkit

```bash
npx create-react-scaffold my-app --redux
```

**What you get:**
- `@reduxjs/toolkit` and `react-redux` configured
- Type-safe `useAppDispatch` and `useAppSelector` hooks
- Pre-built slices: `uiSlice` (theme, sidebar) and `authSlice` (user, token)
- Store automatically integrated with providers

### React Query

```bash
npx create-react-scaffold my-app --react-query
```

**What you get:**
- `@tanstack/react-query` with devtools
- Pre-configured `queryClient`
- Type-safe `useApiQuery` and `useApiMutation` hooks
- Integrated with your Axios client

### Forms

```bash
npx create-react-scaffold my-app --forms
```

**What you get:**
- `react-hook-form` with `@hookform/resolvers`
- `useZodForm` hook for type-safe forms
- Reusable `FormField` component
- Example `LoginForm` with full validation
- Tailwind-aware styling (if Tailwind is enabled)

---

## Generated Project Structure

```
my-app/
├── src/
│   ├── app/                    # Application shell
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Root component
│   │   ├── router.tsx          # React Router configuration
│   │   └── providers/          # Provider composition
│   │       └── index.tsx
│   │
│   ├── features/               # Feature modules (domain-based)
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   └── HomePage.tsx
│   │   │   └── index.ts
│   │   ├── about/
│   │   │   ├── components/
│   │   │   │   └── AboutPage.tsx
│   │   │   └── index.ts
│   │   └── auth/
│   │       ├── components/
│   │       │   └── LoginForm.tsx
│   │       ├── hooks/
│   │       │   └── useAuth.ts
│   │       ├── services/
│   │       │   └── authService.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── shared/                 # Shared/reusable code
│   │   ├── components/         # Button, Input, Modal, Loader, etc.
│   │   ├── hooks/              # useDebounce, useLocalStorage, useToggle
│   │   ├── utils/              # cn(), formatDate, etc.
│   │   └── types/
│   │
│   ├── services/               # API layer
│   │   └── api/
│   │       ├── client.ts       # Axios instance with interceptors
│   │       ├── endpoints.ts    # API endpoint constants
│   │       └── types.ts        # API response types
│   │
│   ├── config/                 # Configuration
│   │   ├── env.ts              # Zod-validated environment variables
│   │   └── constants.ts        # App constants
│   │
│   ├── store/                  # Redux store (if --redux)
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │
│   └── types/                  # Global TypeScript types
│
├── index.html
├── vite.config.ts              # Vite config with path aliases
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint 9 flat config
├── .prettierrc                 # Prettier configuration
├── .env.example                # Environment variables template
└── package.json
```

---

## Path Aliases

Pre-configured TypeScript path aliases for clean imports:

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@app/*` | `src/app/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@services/*` | `src/services/*` |
| `@config/*` | `src/config/*` |
| `@store/*` | `src/store/*` |
| `@assets/*` | `src/assets/*` |

**Example:**

```tsx
import { Button } from '@shared/components'
import { useAuth } from '@features/auth'
import { apiClient } from '@services/api/client'
import { env } from '@config/env'
```

---

## Generated Scripts

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Type-check and build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
npm run format     # Format code with Prettier
```

---

## Base Dependencies

Every generated project includes:

| Package | Purpose |
|---------|---------|
| `react` ^18.3 | UI library |
| `react-dom` ^18.3 | React DOM renderer |
| `react-router-dom` ^6.22 | Client-side routing |
| `axios` ^1.6 | HTTP client |
| `zod` ^3.22 | Schema validation |
| `vite` ^5.4 | Build tool |
| `typescript` ^5.4 | Type safety |
| `eslint` ^9.9 | Linting |
| `prettier` ^3.2 | Code formatting |

---

## Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9

---

## Publishing to npm (For Maintainers)

### First-Time Setup

1. **Create an npm account** at [npmjs.com](https://www.npmjs.com/signup)

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Verify the package name is available:**
   ```bash
   npm search create-react-scaffold
   ```

### Publishing Steps

1. **Navigate to the configurator directory:**
   ```bash
   cd configurator
   ```

2. **Update version (follow semantic versioning):**
   ```bash
   # Patch release (bug fixes): 1.0.0 -> 1.0.1
   npm version patch

   # Minor release (new features): 1.0.0 -> 1.1.0
   npm version minor

   # Major release (breaking changes): 1.0.0 -> 2.0.0
   npm version major
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Test locally before publishing:**
   ```bash
   # Link globally
   npm link

   # Test in another terminal
   create-react-scaffold test-app --tailwind

   # Cleanup
   npm unlink -g create-react-scaffold
   rm -rf test-app
   ```

5. **Publish to npm:**
   ```bash
   # First publish
   npm publish

   # If package name has scope (@username/package)
   npm publish --access public
   ```

6. **Verify the publish:**
   ```bash
   npx create-react-scaffold@latest --version
   ```

### Package Configuration

Your `package.json` is already configured correctly:

```json
{
  "name": "create-react-scaffold",
  "version": "1.0.0",
  "bin": {
    "create-react-scaffold": "./dist/index.js"
  },
  "files": [
    "dist",
    "template",
    "README.md"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Key fields explained:**

| Field | Purpose |
|-------|---------|
| `name` | Package name on npm (what users type after `npx`) |
| `bin` | Makes `create-react-scaffold` available as a command |
| `files` | What gets published (keeps package small) |
| `engines` | Specifies required Node.js version |

### After Publishing

Users can now use your package:

```bash
# Using npx (runs latest version)
npx create-react-scaffold my-app

# Installing globally
npm install -g create-react-scaffold
create-react-scaffold my-app

# Specific version
npx create-react-scaffold@1.0.0 my-app
```

---

## Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Update CHANGELOG (if you have one)
- [ ] Run `npm run build`
- [ ] Test locally with `npm link`
- [ ] Run `npm publish`
- [ ] Create a GitHub release/tag
- [ ] Test with `npx create-react-scaffold@latest`

---

## Troubleshooting

### "command not found: create-react-scaffold"

If using global install:
```bash
npm install -g create-react-scaffold
```

Or use npx:
```bash
npx create-react-scaffold my-app
```

### "EACCES permission denied"

On macOS/Linux, fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Package name already taken on npm

If `create-react-scaffold` is taken, use a scoped name:

1. Update `package.json`:
   ```json
   {
     "name": "@yourusername/create-react-scaffold"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

3. Users run:
   ```bash
   npx @yourusername/create-react-scaffold my-app
   ```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Inspired by:
- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [create-react-app](https://github.com/facebook/create-react-app)

---

Made with love for the React community.
#   R e a c t - s c a f f o l d - t e m p l a t e  
 