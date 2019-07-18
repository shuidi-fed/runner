'use strict'

const orderLib = require('../lib/order.js')
const npmLib = require('../lib/npm.js')
const wsLib = require('../lib/workspace.js')
const getExistsOrders = (taskOrderList, scriptsOfPackage = {}) => taskOrderList.filter(order => scriptsOfPackage[order])
const completeOrders = orders => [...orders.map(order => `yarn ${order}`), 'npm publish']
const REQUIRED_ORDER_LIST = ['git', 'yarn']
const DEFAULT_TASK_ORDER_LIST = ['lint', 'ut', 'build']

const execOrder = order => {
  log.info(`[RUN COMMAND]: ${order}`)

  const result = fixedCWDExecSync(order)

  if (!result.code) return

  log.error(`[ERROR]：${result.stderr}`)

  process.exit(result.code)
}

const execOrders = orders => orders.forEach(execOrder)

async function main (taskOrderList = DEFAULT_TASK_ORDER_LIST) {
  orderLib.checkCommands(REQUIRED_ORDER_LIST)

  const WORK_SPACE = await wsLib.getAndGotoWorkSpace()
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
