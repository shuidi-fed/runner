#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const program = require('commander')
const packageJson = require('./package.json')
const shelljs = require('shelljs')
const shell = require('./lib/shell.js')
const release = require('./commands/release.js')
const install = require('./commands/install/index.js')
const createMysql = require('./commands/createMysql.js')
const log = (str, color) => console.log(chalk[color](`\n${str}\n`))
const logInfo = str => log(str, 'cyan')
const logError = str => log(str, 'red')

global.log = { info: logInfo, error: logError }
// TODO: When solving the problem that execa creates a mysql database error, remove shelljs
global.exec = shelljs.exec
global.execSync = shell.execSync

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

program
  .command('create-mysql')
  .description(`
    Create mysql database and tables for the development environment. (prerequisites: mysql)
    eg: run create-mysql -i 127.0.0.1 -p 3306 -u root -w root -d account.

    [Note] This command has the following expectations:
      1. your folder name where the sql script is stored must be "sql", eg: your_project/sql/.
      2. your create database file names to be prefixed with "createDb", eg: createDb.sql.
      3. your create table file names to be prefixed with "createTable", eg: createTableAccount.sql.
  `)
  .option('-i, --ip <string>', 'ip address of mysql', '127.0.0.1')
  .option('-p, --port <string>', 'port of mysql', '3306')
  .option('-u, --user <string>', 'user name of mysql', 'root')
  .option('-w, --pwd <string>', 'password of mysql', 'root')
  .option('-d, --database <string>', 'database name of mysql', '')
  .action(async options => {
    init()
    createMysql(options)
  })

program.parse(process.argv)
