'use strict'

const path = require('path')
const wsLib = require('../lib/workspace.js')
const fsLib = require('../lib/fs.js')
const readdir = fsLib.readdir
const readFile = fsLib.readFile

async function createDB (createDatabaseSqlFilePath, execMysqlFunc) {
  let createDatabaseSqlFileContent = await readFile(createDatabaseSqlFilePath)

  createDatabaseSqlFileContent = createDatabaseSqlFileContent.toString()

  const databaseName = /`(.*.)`/i.exec(createDatabaseSqlFileContent)[1]

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
  let database = options.database
  let WORK_SPACE = await wsLib.getAndGotoWorkSpace()
  const execMysqlFunc = filePath => exec(`mysql -h ${host} -P ${port} -u ${user} -p${password} < ${filePath}`, { silent: true })

  WORK_SPACE += '/sql'

  const files = await readdir(path.resolve(WORK_SPACE))

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