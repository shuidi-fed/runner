#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const program = require('commander')
const packageJson = require('./package.json')
const release = require('./commands/release.js')

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
  .command('release [taskOrders]')
  .description(`
    release npm project.
    eg: run release lint,ut,build.
    the default task order list is: lint,ut,build.
  `)
  .action(async (taskOrders = '') => {
    init()
    release(taskOrders ? taskOrders.split(',') : [])
  })

program.parse(process.argv)
