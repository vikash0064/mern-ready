#!/usr/bin/env node

/**
 * mern.dev CLI — entry point
 * Usage: npm mern <project-name>
 *        npx mern.dev <project-name>
 */

import { scaffold } from '../lib/scaffold.js'
import { printBanner } from '../lib/banner.js'

const args = process.argv.slice(2)
const projectName = args[0]

if (!projectName || projectName === '--help' || projectName === '-h') {
  printBanner()
  console.log('\nUsage:  npm mern <project-name>\n')
  process.exit(0)
}

printBanner()
scaffold(projectName)
