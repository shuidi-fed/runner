'use strict'

const changelogHandler = require('./changelog.js')
const INSTALL_TYPE_LIST = { changelog: changelogHandler }

const checkType = type => {
  if (!INSTALL_TYPE_LIST[type]) {
    log.error(`the type of install invalid. the range: ${Object.keys(INSTALL_TYPE_LIST)}`)
    process.exit(1)
  }
}

async function main (type) {
  checkType(type)

  INSTALL_TYPE_LIST[type]()
}

module.exports = main
