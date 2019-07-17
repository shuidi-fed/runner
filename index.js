#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const program = require('commander')
const packageJson = require('./package.json')
const release = require('./commands/release.js')
const log = (str, color) => console.log(chalk[color](`\n${str}\n`))
const logInfo = str => log(str, 'cyan')
const logError = str => log(str, 'red')

global.log = { info: logInfo, error: logError }

function init () {
  console.log(chalk.green(figlet.textSync('Runner', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })))
}

program
  .version(packageJson.version, '-v, --version')
  .usage('<command> [options]')

program
  .command('release [taskOrderList]')
  .description(`
    release npm project. (prerequisites: git, yarn)
    eg: run release lint,ut,build.
    the default task order list is: lint,ut,build.
  `)
  .action(async (taskOrderList = '') => {
    init()
    release(taskOrderList ? taskOrderList.split(',') : undefined)
  })

program.parse(process.argv)
