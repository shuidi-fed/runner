'use strict'

const path = require('path')
const wsLib = require('../lib/workspace.js')
const fsLib = require('../lib/fs.js')

const TEMPORARY_CREDENTIALS_FILE = '/tmp/mysql-credentials.cnf'

const readdir = fsLib.readdir
const readFile = fsLib.readFile
const writeFile = fsLib.writeFile
const getDatabaseName = sql => sql.split(' ')[sql.split(' ').findIndex(item => item.toUpperCase() === 'DATABASE') + 1]

async function createTemporaryCredentialsFile (mysqlInfo) {
  const content = `[client]\n` +
    `host=${mysqlInfo.host}\n` +
    `port=${mysqlInfo.port}\n` +
    `user=${mysqlInfo.user}\n` +
    `password=${mysqlInfo.password}`

  return writeFile(TEMPORARY_CREDENTIALS_FILE, content)
}

async function createDB (createDatabaseSqlFilePath, execMysqlFunc) {
  const createDatabaseSqlFileContent = await readFile(createDatabaseSqlFilePath)
  const createDatabaseSql = createDatabaseSqlFileContent.toString()
  const databaseName = getDatabaseName(createDatabaseSql)
  const createDBResult = execMysqlFunc(createDatabaseSqlFilePath)

  if (createDBResult.code) {
    log.error(`[CREATE DATABASE ERROR]：, ${createDBResult.stderr}`)
    process.exit(createDBResult.code)
  }

  return databaseName
}

async function main (options) {
  const host = options.ip
  const port = options.port
  const user = options.user
  const password = options.pwd
  const WORK_SPACE = await wsLib.getAndGotoWorkSpace('/sql')
  const execMysqlFunc = filePath => execSync(`mysql --defaults-extra-file=${TEMPORARY_CREDENTIALS_FILE} < ${filePath}`, { shell: true })
  const files = await readdir(path.resolve(WORK_SPACE))
  const mysqlInfo = { host, port, user, password }

  await createTemporaryCredentialsFile(mysqlInfo)

  let database = options.database

  if (!database) {
    const createDatabaseSqlFilePath = files
      .filter(i => i.includes('createDb'))
      .map(i => path.resolve(WORK_SPACE, i))[0]

    database = await createDB(createDatabaseSqlFilePath, execMysqlFunc)
  }

  log.info(`[DATABASE NAME]: ${database}`)

  files
    .filter(fileName => fileName.includes('createTable'))
    .forEach(fileName => {
      const fullPath = path.resolve(WORK_SPACE, fileName)

      log.info(`find the create table file, path: ${fullPath}\nbegin to create table: ...`)

      const createTableResult = execMysqlFunc(fullPath)

      if (createTableResult.code) {
        log.error('create table filed:', createTableResult.stderr)
        process.exit(createTableResult.code)
      } else {
        log.info('create table successfully')
      }
    })
}

module.exports = main
