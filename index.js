#!/usr/bin/env node

const shell = require('shelljs')
const chalk = require('chalk')
const figlet = require('figlet')
const program = require('commander')
const packageJson = require('./package.json')
const release = require('./commands/release.js')
const install = require('./commands/install/index.js')
const log = (str, color) => console.log(chalk[color](`\n${str}\n`))
const logInfo = str => log(str, 'cyan')
const logError = str => log(str, 'red')

global.log = { info: logInfo, error: logError }
global.exec = shell.exec

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
    Release npm project. (prerequisites: git, yarn)
    eg: run release lint,ut,build.
    the default task order list is: lint,ut,build.
  `)
  .action(async (taskOrderList = '') => {
    init()
    release(taskOrderList ? taskOrderList.split(',') : undefined)
  })

program
  .command('install <type>')
  .description(`
    Install the function for the project with the type parameter. (prerequisites: git, yarn)
    eg: run install changelog.
    The value range of the type parameter is: changelog.
  `)
  .action(async (type = '') => {
    init()
    install(type)
  })

program.parse(process.argv)
