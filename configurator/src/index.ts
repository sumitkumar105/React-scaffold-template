#!/usr/bin/env node

/**
 * React Configurator CLI
 *
 * This is the CLI entry point. For library usage, import from the package directly:
 *   import { generateProject, CAPABILITIES } from 'react-configurator'
 */

import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import path from 'path'
import { fileURLToPath } from 'url'

// Import from library
import {
  generateProject,
  injectCapabilities,
  analyzeProject,
  CAPABILITIES,
} from './lib.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()

program
  .name('configurator')
  .description('CLI tool to configure React projects with various capabilities')
  .version('1.0.0')

program
  .command('create <project-name>')
  .description('Create a new project from template and configure it')
  .option('-t, --template <path>', 'Path to template (local path or git URL)')
  .option('-s, --skip-install', 'Skip npm install')
  .option('-c, --capabilities <caps>', 'Comma-separated list of capabilities to add')
  .action(async (projectName: string, options: {
    template?: string
    skipInstall?: boolean
    capabilities?: string
  }) => {
    console.log(chalk.blue('\n🚀 Creating new project: ') + chalk.bold(projectName))

    const outputPath = path.resolve(process.cwd(), projectName)
    const templatePath = options.template || path.resolve(__dirname, '../../template')

    try {
      // If capabilities provided via CLI, use them directly
      let selectedCapabilities: string[] = []

      if (options.capabilities) {
        selectedCapabilities = options.capabilities.split(',').map(c => c.trim())
      } else {
        // Interactive selection
        const { caps } = await inquirer.prompt<{ caps: string[] }>([
          {
            type: 'checkbox',
            name: 'caps',
            message: 'Select capabilities to add:',
            choices: CAPABILITIES.map(cap => ({
              name: `${cap.name} - ${cap.description}`,
              value: cap.value,
            })),
          },
        ])
        selectedCapabilities = caps
      }

      console.log(chalk.gray(`\nTemplate: ${templatePath}`))
      console.log(chalk.gray(`Output: ${outputPath}`))

      if (selectedCapabilities.length > 0) {
        console.log(chalk.gray(`Capabilities: ${selectedCapabilities.join(', ')}`))
      }

      // Use library function
      const result = await generateProject({
        projectName,
        capabilities: selectedCapabilities,
        outputPath,
        templatePath,
        skipInstall: options.skipInstall,
      })

      if (result.success) {
        console.log(chalk.green('\n✨ Project setup complete!'))
        console.log(chalk.gray(`\nProject analysis:`))
        console.log(chalk.gray(`  Entry point: ${result.analysis.entryPoint}`))
        console.log(chalk.gray(`  Build tool: ${result.analysis.buildTool}`))
        console.log(chalk.gray(`  TypeScript: ${result.analysis.hasTypeScript ? 'Yes' : 'No'}`))

        if (result.appliedCapabilities.length > 0) {
          console.log(chalk.green(`\nApplied capabilities:`))
          result.appliedCapabilities.forEach(cap => {
            console.log(chalk.green(`  ✓ ${cap}`))
          })
        }

        if (result.validation.warnings.length > 0) {
          console.log(chalk.yellow('\n⚠ Warnings:'))
          result.validation.warnings.forEach(w => console.log(chalk.yellow(`  - ${w}`)))
        }

        console.log(chalk.gray(`\nNext steps:`))
        console.log(chalk.white(`  cd ${projectName}`))
        console.log(chalk.white(`  npm run dev`))
      } else {
        console.log(chalk.red('\n✗ Project creation failed'))
        result.errors.forEach(e => console.log(chalk.red(`  - ${e}`)))
        process.exit(1)
      }
    } catch (error) {
      console.error(chalk.red('\n✗ Error: '), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program
  .command('inject <project-path>')
  .description('Add capabilities to an existing project')
  .option('-c, --capabilities <caps>', 'Comma-separated list of capabilities to add')
  .option('-s, --skip-install', 'Skip npm install')
  .action(async (projectPath: string, options: {
    capabilities?: string
    skipInstall?: boolean
  }) => {
    const resolvedPath = path.resolve(process.cwd(), projectPath)

    console.log(chalk.blue('\n🔧 Configuring existing project: ') + resolvedPath)

    try {
      // Analyze first to show current state
      console.log(chalk.gray('\nAnalyzing project structure...'))
      const analysis = await analyzeProject(resolvedPath)
      console.log(chalk.green('✓ Analysis complete'))
      console.log(chalk.gray(`  Entry point: ${analysis.entryPoint}`))
      console.log(chalk.gray(`  Build tool: ${analysis.buildTool}`))
      console.log(chalk.gray(`  Styling: ${analysis.styling.join(', ') || 'None detected'}`))

      // Select capabilities
      let selectedCapabilities: string[] = []

      if (options.capabilities) {
        selectedCapabilities = options.capabilities.split(',').map(c => c.trim())
      } else {
        const { caps } = await inquirer.prompt<{ caps: string[] }>([
          {
            type: 'checkbox',
            name: 'caps',
            message: 'Select capabilities to add:',
            choices: CAPABILITIES.map(cap => ({
              name: `${cap.name} - ${cap.description}`,
              value: cap.value,
            })),
          },
        ])
        selectedCapabilities = caps
      }

      if (selectedCapabilities.length === 0) {
        console.log(chalk.yellow('\nNo capabilities selected.'))
        return
      }

      // Use library function
      const result = await injectCapabilities({
        projectPath: resolvedPath,
        capabilities: selectedCapabilities,
        skipInstall: options.skipInstall,
      })

      if (result.success) {
        console.log(chalk.green('\n✨ Configuration complete!'))

        if (result.appliedCapabilities.length > 0) {
          console.log(chalk.green(`\nApplied capabilities:`))
          result.appliedCapabilities.forEach(cap => {
            console.log(chalk.green(`  ✓ ${cap}`))
          })
        }

        if (result.validation.warnings.length > 0) {
          console.log(chalk.yellow('\n⚠ Warnings:'))
          result.validation.warnings.forEach(w => console.log(chalk.yellow(`  - ${w}`)))
        }
      } else {
        console.log(chalk.red('\n✗ Configuration failed'))
        result.errors.forEach(e => console.log(chalk.red(`  - ${e}`)))
        process.exit(1)
      }
    } catch (error) {
      console.error(chalk.red('\n✗ Error: '), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program
  .command('list')
  .description('List available capabilities')
  .action(() => {
    console.log(chalk.blue('\n📦 Available Capabilities:\n'))
    CAPABILITIES.forEach(cap => {
      console.log(chalk.white(`  ${chalk.bold(cap.name)} (${cap.value})`))
      console.log(chalk.gray(`    ${cap.description}\n`))
    })
  })

program
  .command('analyze <project-path>')
  .description('Analyze a project structure')
  .action(async (projectPath: string) => {
    const resolvedPath = path.resolve(process.cwd(), projectPath)

    console.log(chalk.blue('\n🔍 Analyzing project: ') + resolvedPath)

    try {
      const analysis = await analyzeProject(resolvedPath)

      console.log(chalk.green('\n✓ Analysis complete\n'))
      console.log(chalk.white('Project Structure:'))
      console.log(chalk.gray(`  Entry point: ${analysis.entryPoint}`))
      console.log(chalk.gray(`  Build tool: ${analysis.buildTool}`))
      console.log(chalk.gray(`  TypeScript: ${analysis.hasTypeScript ? 'Yes' : 'No'}`))
      console.log(chalk.gray(`  Source directory: ${analysis.srcDirectory}`))
      console.log(chalk.gray(`  Styling: ${analysis.styling.join(', ') || 'None detected'}`))
      console.log(chalk.gray(`  Config files: ${analysis.configFiles.join(', ') || 'None'}`))
    } catch (error) {
      console.error(chalk.red('\n✗ Error: '), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program.parse()
