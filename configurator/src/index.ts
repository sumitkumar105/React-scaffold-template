#!/usr/bin/env node

import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'

import {
  generateProject,
  analyzeProject,
  CAPABILITIES,
} from './lib.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Template path resolution:
// - In development: ../template (relative to src/)
// - After build: ../template (relative to dist/)
// - After npm publish: template is copied to configurator/template
function getTemplatePath(): string {
  // First, check if template exists in the package directory (npm published)
  const packageTemplatePath = path.resolve(__dirname, '../template')
  if (fs.existsSync(packageTemplatePath)) {
    return packageTemplatePath
  }

  // Fallback to parent directory (development mode)
  const devTemplatePath = path.resolve(__dirname, '../../template')
  if (fs.existsSync(devTemplatePath)) {
    return devTemplatePath
  }

  throw new Error('Template not found. Please run "npm run build" first.')
}

const CAPABILITY_ORDER = ['tailwind', 'redux', 'reactQuery', 'forms']

function showBanner() {
  console.log()
  console.log(chalk.cyan('  ┌─────────────────────────────────────────────────────────┐'))
  console.log(chalk.cyan('  │                                                         │'))
  console.log(chalk.cyan('  │  ') + chalk.bold.white('create-react-scaffold') + chalk.cyan('                                │'))
  console.log(chalk.cyan('  │  ') + chalk.gray('Modern React + TypeScript + Vite') + chalk.cyan('                      │'))
  console.log(chalk.cyan('  │  ') + chalk.gray('with feature-based architecture') + chalk.cyan('                       │'))
  console.log(chalk.cyan('  │                                                         │'))
  console.log(chalk.cyan('  └─────────────────────────────────────────────────────────┘'))
  console.log()
}

const program = new Command()

program
  .name('create-react-scaffold')
  .description('Scaffold modern React projects with feature-based architecture')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project to create')
  .option('-o, --output <path>', 'Directory where the project will be created (default: current directory)')
  .option('--tailwind', 'Add Tailwind CSS')
  .option('--redux', 'Add Redux Toolkit')
  .option('--react-query', 'Add React Query')
  .option('--forms', 'Add Forms (React Hook Form + Zod)')
  .option('--skip-install', 'Skip npm install')
  .option('-y, --yes', 'Skip prompts, use defaults (no capabilities)')
  .action(async (projectName: string | undefined, options: {
    output?: string
    tailwind?: boolean
    redux?: boolean
    reactQuery?: boolean
    forms?: boolean
    skipInstall?: boolean
    yes?: boolean
  }) => {
    showBanner()

    const hasFlags = options.tailwind || options.redux || options.reactQuery || options.forms

    // ── Step 1: Ask project name ──
    if (!projectName) {
      if (options.yes) {
        console.error(chalk.red('  Error: project name is required when using --yes'))
        process.exit(1)
      }

      console.log(chalk.white.bold('  Step 1 of 3: ') + chalk.gray('Project details\n'))

      const { name } = await inquirer.prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'What is your project name?',
          default: 'my-react-app',
          validate: (input: string) => {
            if (!input.trim()) return 'Project name is required'
            if (!/^[a-z0-9-_]+$/.test(input)) return 'Use lowercase letters, numbers, hyphens, underscores only'
            return true
          },
        },
      ])
      projectName = name
    }

    // ── Step 2: Ask output directory ──
    let outputDir: string

    if (options.output) {
      outputDir = path.resolve(options.output)
    } else if (options.yes) {
      outputDir = process.cwd()
    } else {
      const { directory } = await inquirer.prompt<{ directory: string }>([
        {
          type: 'input',
          name: 'directory',
          message: 'Where should we create the project?',
          default: `./${projectName}`,
        },
      ])

      // If user typed just a folder name, treat as relative to cwd
      outputDir = path.resolve(directory)

      // If user typed a path that doesn't end with the project name, append it
      if (path.basename(outputDir) !== projectName) {
        outputDir = path.join(outputDir, projectName)
      }
    }

    const outputPath = outputDir.endsWith(projectName) ? outputDir : path.join(outputDir, projectName)
    const templatePath = getTemplatePath()

    // Check if directory already exists
    if (await fs.pathExists(outputPath)) {
      const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(`Directory "${outputPath}" already exists. Remove it and continue?`),
          default: false,
        },
      ])
      if (!overwrite) {
        console.log(chalk.gray('\n  Cancelled.\n'))
        process.exit(0)
      }
      await fs.remove(outputPath)
    }

    // ── Step 3: Select capabilities ──
    let selectedCapabilities: string[] = []

    if (hasFlags) {
      if (options.tailwind) selectedCapabilities.push('tailwind')
      if (options.redux) selectedCapabilities.push('redux')
      if (options.reactQuery) selectedCapabilities.push('reactQuery')
      if (options.forms) selectedCapabilities.push('forms')
    } else if (!options.yes) {
      console.log()
      console.log(chalk.white.bold('  Step 2 of 3: ') + chalk.gray('Select capabilities (use arrow keys + space to select)\n'))

      const { caps } = await inquirer.prompt<{ caps: string[] }>([
        {
          type: 'checkbox',
          name: 'caps',
          message: 'Which capabilities would you like to add?',
          choices: CAPABILITIES.map(cap => ({
            name: `${cap.name} ${chalk.gray('- ' + cap.description)}`,
            value: cap.value,
            short: cap.name,
          })),
        },
      ])
      selectedCapabilities = caps
    }

    // Sort capabilities in execution order
    selectedCapabilities = CAPABILITY_ORDER.filter(c => selectedCapabilities.includes(c))

    // ── Step 4: Confirm ──
    console.log()
    console.log(chalk.white.bold('  Step 3 of 3: ') + chalk.gray('Confirm\n'))

    console.log(chalk.white('  Project:      ') + chalk.cyan.bold(projectName))
    console.log(chalk.white('  Location:     ') + chalk.gray(outputPath))
    if (selectedCapabilities.length > 0) {
      const capNames = selectedCapabilities
        .map(c => CAPABILITIES.find(cap => cap.value === c)?.name || c)
        .join(', ')
      console.log(chalk.white('  Capabilities: ') + chalk.green(capNames))
    } else {
      console.log(chalk.white('  Capabilities: ') + chalk.gray('None (base template only)'))
    }
    console.log(chalk.white('  Install deps: ') + chalk.gray(options.skipInstall ? 'No' : 'Yes'))
    console.log()

    if (!options.yes) {
      const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Create project with these settings?',
          default: true,
        },
      ])
      if (!proceed) {
        console.log(chalk.gray('\n  Cancelled.\n'))
        process.exit(0)
      }
    }

    // ── Execute ──
    console.log()
    try {
      const spinner = ora('Scaffolding project...').start()

      const result = await generateProject({
        projectName,
        capabilities: selectedCapabilities,
        outputPath,
        templatePath,
        skipInstall: options.skipInstall,
      })

      if (!result.success) {
        spinner.fail('Project creation failed')
        result.errors.forEach(e => console.log(chalk.red(`  - ${e}`)))
        process.exit(1)
      }

      spinner.succeed('Project created successfully!')

      if (result.appliedCapabilities.length > 0) {
        console.log()
        console.log(chalk.green.bold('  Applied capabilities:'))
        result.appliedCapabilities.forEach(cap => {
          const capInfo = CAPABILITIES.find(c => c.value === cap)
          console.log(chalk.green(`    + ${capInfo?.name || cap}`))
        })
      }

      if (result.validation.warnings.length > 0) {
        console.log()
        result.validation.warnings.forEach(w => console.log(chalk.yellow(`  Warning: ${w}`)))
      }

      // Next steps
      const relPath = path.relative(process.cwd(), outputPath) || '.'
      console.log()
      console.log(chalk.white.bold('  Next steps:\n'))
      console.log(chalk.cyan(`    cd ${relPath}`))
      if (options.skipInstall) {
        console.log(chalk.cyan('    npm install'))
      }
      console.log(chalk.cyan('    npm run dev'))
      console.log()
      console.log(chalk.gray('  Your dev server will start at ') + chalk.white('http://localhost:5173'))
      console.log()
    } catch (error) {
      console.error(chalk.red('\n  Error: '), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program
  .command('list')
  .description('List available capabilities')
  .action(() => {
    showBanner()
    console.log(chalk.white.bold('  Available Capabilities:\n'))
    CAPABILITIES.forEach(cap => {
      console.log(chalk.white(`    ${chalk.bold(cap.name)} (${chalk.gray(cap.value)})`))
      console.log(chalk.gray(`      ${cap.description}\n`))
    })
  })

program
  .command('analyze <project-path>')
  .description('Analyze an existing project structure')
  .action(async (projectPath: string) => {
    const resolvedPath = path.resolve(process.cwd(), projectPath)

    const spinner = ora('Analyzing project...').start()

    try {
      const analysis = await analyzeProject(resolvedPath)
      spinner.succeed('Analysis complete')

      console.log()
      console.log(chalk.white.bold('  Project Structure:'))
      console.log(chalk.gray(`    Entry point: ${analysis.entryPoint}`))
      console.log(chalk.gray(`    Build tool:  ${analysis.buildTool}`))
      console.log(chalk.gray(`    TypeScript:  ${analysis.hasTypeScript ? 'Yes' : 'No'}`))
      console.log(chalk.gray(`    Source dir:  ${analysis.srcDirectory}`))
      console.log(chalk.gray(`    Styling:     ${analysis.styling.join(', ') || 'None detected'}`))
      console.log()
    } catch (error) {
      spinner.fail('Analysis failed')
      console.error(chalk.red('Error: '), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program.parse()
