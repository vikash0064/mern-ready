import chalk from 'chalk'

export function printBanner() {
  console.log('')
  console.log(chalk.cyan('  ╔═══════════════════════════════════╗'))
  console.log(chalk.cyan('  ║') + chalk.bold.white('         mern.dev  v1.0.0           ') + chalk.cyan('║'))
  console.log(chalk.cyan('  ║') + chalk.gray('   One command. Full-stack MERN.    ') + chalk.cyan('║'))
  console.log(chalk.cyan('  ╚═══════════════════════════════════╝'))
  console.log('')
}
