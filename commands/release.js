const chalk = require('chalk')
const shell = require('shelljs')
const orderLib = require('../lib/order.js')
const npmLib = require('../lib/npm.js')
const ask = require('../lib/ask.js')
const exec = shell.exec
const PWD = process.env.PWD

function getContentOfPackage (packageJsonPath) {
  console.log(chalk.cyan(`\nread the content of package.json, [package.json's path]：${packageJsonPath}\n`))

  return require(packageJsonPath)
}

async function main (orderList = ['lint', 'ut', 'build']) {
  orderLib.checkCommands(['git', 'yarn'])

  let { WORK_SPACE } = await ask([
    {
      name: 'WORK_SPACE',
      type: 'input',
      message: `Please enter the project path you want to publish (default is the current path: ${PWD}): `
    }
  ])

  if (!WORK_SPACE) WORK_SPACE = `${PWD}`

  console.log(chalk.cyan(`\n[your project path]：${WORK_SPACE}\n`))

  exec(`cd ${WORK_SPACE}`)

  const packageJsonContent = getContentOfPackage(`${WORK_SPACE}/package.json`)

  const name = packageJsonContent.name
  const version = packageJsonContent.version
  const scripts = packageJsonContent.scripts

  console.log(chalk.cyan(`\n[project name]：${name}\n`))

  let existsOrders = []

  orderList.forEach(order => {
    if (scripts[order]) existsOrders.push(order)
  })

  console.log(chalk.cyan(`begin:`))

  console.log(chalk.cyan(`\n[The version to be released]：${version}\n`))

  const latestVersion = await npmLib.getLastestVersionNumberByCurrentPackage(name)

  console.log(chalk.cyan(`\n[Remote repository current version]：${latestVersion}\n`))

  existsOrders = existsOrders.map(order => `yarn ${order}`)
  existsOrders.push('npm publish')

  existsOrders.forEach(order => {
    console.log(chalk.cyan(`\n[Run command]: ${order}\n`))

    const result = exec(order)

    if (result.code) {
      console.log(chalk.red(`[Error]：${result.stderr}`))
      process.exit(result.code)
    }
  })

  if (latestVersion > version) npmLib.setCurrentVersion(name, latestVersion)

  console.log(chalk.cyan(`done.`))
}

module.exports = main
