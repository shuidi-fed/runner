'use strict'

const shell = require('shelljs')
const orderLib = require('../lib/order.js')
const npmLib = require('../lib/npm.js')
const ask = require('../lib/ask.js')
const getExistsOrders = (taskOrderList, scriptsOfPackage = {}) => taskOrderList.filter(order => scriptsOfPackage[order])
const completeOrders = orders => [...orders.map(order => `yarn ${order}`), 'npm publish']
const PWD = process.env.PWD
const REQUIRED_ORDER_LIST = ['git', 'yarn']
const DEFAULT_TASK_ORDER_LIST = ['lint', 'ut', 'build']

async function getWorkSpace (currentPath) {
  const name = 'WORK_SPACE'
  const type = 'input'
  const message = 'Please enter the project path you want to publish \n' +
    '(The default is the current path: ' + currentPath + '):'
  const { WORK_SPACE } = await ask([{ name, type, message }])

  return WORK_SPACE
}

const execOrder = order => {
  log.info(`[RUN COMMAND]: ${order}`)

  const result = shell.exec(order)

  if (!result.code) return

  log.error(`[ERROR]：${result.stderr}`)

  process.exit(result.code)
}

const execOrders = orders => orders.forEach(execOrder)

async function main (taskOrderList = DEFAULT_TASK_ORDER_LIST) {
  orderLib.checkCommands(REQUIRED_ORDER_LIST)

  let WORK_SPACE = await getWorkSpace(PWD)

  if (!WORK_SPACE) WORK_SPACE = `${PWD}`

  shell.exec(`cd ${WORK_SPACE}`)

  const packageJsonContent = require(`${WORK_SPACE}/package.json`)
  const name = packageJsonContent.name
  const version = packageJsonContent.version
  const existsOrders = getExistsOrders(taskOrderList, packageJsonContent.scripts)
  const latestVersion = await npmLib.getLastestVersionNumberByCurrentPackage(name)
  const completedOrderList = completeOrders(existsOrders)

  log.info(`
    [PROJECT PATH]：${WORK_SPACE}
    [PROJECT NAME]：${name}
    [THE VERSION TO BE RELEASED]：${version}
    [REMOTE REPOSITORY CURRENT VERSION]：${latestVersion}
    [COMPLETED ORDERS]: ${completedOrderList.join(' && ')}
  `)

  execOrders(completedOrderList)

  if (latestVersion > version) npmLib.setCurrentVersion(name, latestVersion)

  log.info('Successfully Released!')
}

module.exports = main
