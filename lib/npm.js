'use strict'

const shell = require('shelljs')
const exec = shell.exec

function getLastestVersionNumberByCurrentPackage (name) {
  return new Promise((resolve, reject) => {
    const order = `npm view ${name} version`

    exec(order, { silent: true }, (code, stdout, stderr) => {
      if (stderr.includes('E404')) return resolve('0.0.0')

      log.info(`exec [${order}] result: code: ${code}; stdout: ${stdout}; stderr: ${stderr}`)

      return resolve(stdout)
    })
  })
}

function setCurrentVersion (name, versionNumber) {
  exec(`npm dist-tag add ${name}@${versionNumber} latest`)
}

module.exports = {
  getLastestVersionNumberByCurrentPackage,
  setCurrentVersion
}
