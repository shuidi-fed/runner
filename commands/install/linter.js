'use strict'

const fs = require('../../lib/fs.js')
const orderLib = require('../../lib/order.js')
const wsLib = require('../../lib/workspace.js')

const linterName = 'standard'
const hookerName = 'husky'

async function main () {
  orderLib.checkCommands(['git', 'yarn'])

  const WORK_SPACE = await wsLib.getAndGotoWorkSpace()
  const packageJsonContent = require(`${WORK_SPACE}/package.json`)
  const name = packageJsonContent.name
  const allDependencies = [].concat(
    Object.keys(packageJsonContent.dependencies || {}),
    Object.keys(packageJsonContent.devDependencies || {})
  )

  if (!packageJsonContent.scripts) packageJsonContent.scripts = {}

  if (!allDependencies.includes(linterName)) {
    if (!packageJsonContent.scripts.lint) packageJsonContent.scripts.lint = linterName
    if (!packageJsonContent[linterName]) packageJsonContent[linterName] = { globals: [] }
  }

  if (!allDependencies.includes(hookerName)) {
    if (!packageJsonContent[hookerName]) {
      packageJsonContent[hookerName] = {
        hooks: { 'pre-commit': 'yarn lint', 'pre-push': 'yarn lint' }
      }
    }
  }

  const newPackageJsonContent = JSON.stringify(packageJsonContent, null, 2)

  await fs.writeFile(`${WORK_SPACE}/package.json`, newPackageJsonContent)

  if (!allDependencies.includes(linterName)) fixedCWDExecSync(`yarn add -D ${linterName}`)
  if (!allDependencies.includes(hookerName)) fixedCWDExecSync(`yarn add -D ${hookerName}`)

  log.info(`[PROJECT NAME]：${name} Successful installation!`)
}

module.exports = main
